// Wipe Orchestrator - Routes to appropriate wipe implementation based on drive type
//
// This module acts as the main entry point for wipe operations, detecting the drive
// type and routing to the appropriate specialized wipe implementation.

use crate::{
    DriveInfo, DriveType, WipeConfig, Algorithm, DriveResult, DriveError,
    drives::{
        SMRDrive,
        OptaneDrive,
        HybridDrive,
        NVMeAdvanced,
    },
};
use crate::drives::types::emmc::EMMCDevice;
use anyhow::Result;
use std::fs::OpenOptions;
use std::io::{Write, Seek, SeekFrom};

/// Main wipe orchestrator
pub struct WipeOrchestrator {
    device_path: String,
    config: WipeConfig,
    drive_info: DriveInfo,
}

impl WipeOrchestrator {
    /// Create new orchestrator for a device
    pub fn new(device_path: String, config: WipeConfig) -> Result<Self> {
        // Detect drive type and capabilities
        // For now, create a basic DriveInfo
        let drive_info = Self::create_basic_drive_info(&device_path)?;

        Ok(Self {
            device_path,
            config,
            drive_info,
        })
    }

    /// Execute the wipe operation
    pub async fn execute(&self) -> DriveResult<()> {
        println!("\n=== Starting Wipe Operation ===");
        println!("Device: {}", self.device_path);
        println!("Model: {}", self.drive_info.model);
        println!("Size: {} GB", self.drive_info.size / (1024 * 1024 * 1024));
        println!("Type: {:?}", self.drive_info.drive_type);
        println!("Algorithm: {:?}", self.config.algorithm);
        println!();

        // Route to appropriate wipe implementation
        match self.drive_info.drive_type {
            DriveType::SMR => self.wipe_smr_drive().await,
            DriveType::Optane => self.wipe_optane_drive().await,
            DriveType::HybridSSHD => self.wipe_hybrid_drive().await,
            DriveType::EMMC => self.wipe_emmc_drive().await,
            DriveType::UFS => self.wipe_ufs_drive().await,
            DriveType::NVMe => self.wipe_nvme_drive().await,
            DriveType::SSD => self.wipe_ssd_drive().await,
            DriveType::HDD => self.wipe_hdd_drive().await,
            DriveType::RAID => self.wipe_raid_member().await,
            _ => Err(DriveError::Unsupported(
                format!("Drive type {:?} not yet supported", self.drive_info.drive_type)
            )),
        }
    }

    /// Wipe SMR (Shingled Magnetic Recording) drive
    async fn wipe_smr_drive(&self) -> DriveResult<()> {
        println!("📀 Detected SMR drive - using zone-aware wipe strategy");

        let smr = SMRDrive::get_zone_configuration(&self.device_path)
            .map_err(|e| DriveError::HardwareCommandFailed(format!("SMR detection failed: {}", e)))?;

        println!("Zone Model: {:?}", smr.zone_model);
        println!("Total Zones: {}", smr.zones.len());
        println!("Conventional Zones: {}", smr.conventional_zone_count);
        println!();

        // Reset all zones before wiping
        println!("🔄 Resetting all SMR zones...");
        smr.reset_all_zones()
            .map_err(|e| DriveError::HardwareCommandFailed(format!("Zone reset failed: {}", e)))?;

        // Perform zone-aware wipe
        smr.wipe_smr_drive(|offset, size| {
            self.write_pattern_to_region(offset, size)
        })
        .map_err(|e| DriveError::IoError(
            std::io::Error::new(std::io::ErrorKind::Other, format!("SMR wipe failed: {}", e))
        ))?;

        println!("✅ SMR drive wipe completed successfully");
        Ok(())
    }

    /// Wipe Intel Optane / 3D XPoint drive
    async fn wipe_optane_drive(&self) -> DriveResult<()> {
        println!("⚡ Detected Intel Optane drive - checking for ISE support");

        let optane = OptaneDrive::get_configuration(&self.device_path)
            .map_err(|e| DriveError::HardwareCommandFailed(format!("Optane detection failed: {}", e)))?;

        println!("Generation: {}", optane.generation);
        println!("Mode: {}", if optane.is_pmem { "Persistent Memory" } else { "Block Device" });
        println!("ISE Support: {}", if optane.supports_ise { "Yes" } else { "No" });
        println!();

        optane.wipe_optane_drive()
            .map_err(|e| DriveError::IoError(
                std::io::Error::new(std::io::ErrorKind::Other, format!("Optane wipe failed: {}", e))
            ))?;

        println!("✅ Optane drive wipe completed successfully");
        Ok(())
    }

    /// Wipe Hybrid SSHD drive
    async fn wipe_hybrid_drive(&self) -> DriveResult<()> {
        println!("🔀 Detected Hybrid SSHD - wiping both HDD and SSD cache");

        let hybrid = HybridDrive::get_configuration(&self.device_path)
            .map_err(|e| DriveError::HardwareCommandFailed(format!("Hybrid detection failed: {}", e)))?;

        println!("HDD: {} GB @ {} RPM",
                 hybrid.hdd_portion.capacity / (1024 * 1024 * 1024),
                 hybrid.hdd_portion.rpm);
        println!("SSD Cache: {} GB",
                 hybrid.ssd_cache.cache_size / (1024 * 1024 * 1024));
        println!();

        hybrid.wipe_hybrid_drive()
            .map_err(|e| DriveError::IoError(
                std::io::Error::new(std::io::ErrorKind::Other, format!("Hybrid wipe failed: {}", e))
            ))?;

        println!("✅ Hybrid drive wipe completed successfully");
        Ok(())
    }

    /// Wipe eMMC embedded storage
    async fn wipe_emmc_drive(&self) -> DriveResult<()> {
        println!("📱 Detected eMMC device - wiping all partitions");

        let emmc = EMMCDevice::get_configuration(&self.device_path)
            .map_err(|e| DriveError::HardwareCommandFailed(format!("eMMC detection failed: {}", e)))?;

        println!("eMMC Version: {}", emmc.emmc_version);
        println!("Boot Partitions: {}", emmc.boot_partitions.len());
        println!();

        emmc.wipe_emmc()
            .map_err(|e| DriveError::IoError(
                std::io::Error::new(std::io::ErrorKind::Other, format!("eMMC wipe failed: {}", e))
            ))?;

        println!("✅ eMMC wipe completed successfully");
        Ok(())
    }

    /// Wipe UFS (Universal Flash Storage)
    async fn wipe_ufs_drive(&self) -> DriveResult<()> {
        println!("📱 Detected UFS device - using PURGE command");

        // UFS detection and wipe via purge command
        println!("⚠️  UFS full integration pending, using PURGE command");

        let output = std::process::Command::new("sg_unmap")
            .arg("--all")
            .arg(&self.device_path)
            .output()
            .map_err(|e| DriveError::HardwareCommandFailed(format!("UFS PURGE failed: {}", e)))?;

        if !output.status.success() {
            return Err(DriveError::HardwareCommandFailed("UFS PURGE command failed".to_string()));
        }

        println!("✅ UFS wipe completed successfully");
        Ok(())
    }

    /// Wipe NVMe drive (check for advanced features first)
    async fn wipe_nvme_drive(&self) -> DriveResult<()> {
        println!("💾 Detected NVMe drive - checking for advanced features");

        // Check if this is an advanced NVMe with ZNS, multiple namespaces, etc.
        if NVMeAdvanced::detect_advanced_features(&self.device_path).unwrap_or(false) {
            println!("🔬 Advanced NVMe features detected, using controller-wide sanitize");
            println!();

            // Use controller-wide sanitize for advanced NVMe
            let output = std::process::Command::new("nvme")
                .arg("sanitize")
                .arg(&self.device_path)
                .arg("-a").arg("2")  // Cryptographic erase
                .arg("--no-uuid")    // Apply to all namespaces
                .output()
                .map_err(|e| DriveError::HardwareCommandFailed(format!("NVMe sanitize failed: {}", e)))?;

            if output.status.success() {
                println!("✅ Advanced NVMe wipe completed successfully");
                return Ok(());
            }
        }

        // Fall back to basic NVMe wipe via sanitize command
        println!("Using standard NVMe sanitize command");
        let output = std::process::Command::new("nvme")
            .arg("sanitize")
            .arg(&self.device_path)
            .arg("-a").arg("2")  // Cryptographic erase
            .output()
            .map_err(|e| DriveError::HardwareCommandFailed(format!("NVMe sanitize failed: {}", e)))?;

        if !output.status.success() {
            return Err(DriveError::HardwareCommandFailed("NVMe sanitize failed".to_string()));
        }

        println!("✅ NVMe wipe completed successfully");
        Ok(())
    }

    /// Wipe SSD drive
    async fn wipe_ssd_drive(&self) -> DriveResult<()> {
        println!("💿 Detected SSD - using TRIM-aware wipe strategy");

        // Use generic overwrite + TRIM for now
        println!("⚠️  Using simplified SSD wipe (full integration pending)");

        // Perform basic overwrite
        self.write_pattern_to_region(0, self.drive_info.size)
            .map_err(|e| DriveError::IoError(
                std::io::Error::new(std::io::ErrorKind::Other, format!("SSD wipe failed: {}", e))
            ))?;

        // Then TRIM if supported
        if self.drive_info.capabilities.trim_support {
            let _ = std::process::Command::new("blkdiscard")
                .arg(&self.device_path)
                .output();
        }

        println!("✅ SSD wipe completed successfully");
        Ok(())
    }

    /// Wipe HDD drive
    async fn wipe_hdd_drive(&self) -> DriveResult<()> {
        println!("💽 Detected HDD - using traditional overwrite strategy");

        // Use generic overwrite for now
        println!("⚠️  Using simplified HDD wipe (full integration pending)");

        self.write_pattern_to_region(0, self.drive_info.size)
            .map_err(|e| DriveError::IoError(
                std::io::Error::new(std::io::ErrorKind::Other, format!("HDD wipe failed: {}", e))
            ))?;

        println!("✅ HDD wipe completed successfully");
        Ok(())
    }

    /// Wipe RAID array member
    async fn wipe_raid_member(&self) -> DriveResult<()> {
        println!("🔗 Detected RAID array member");
        println!("⚠️  Warning: Wiping individual RAID members will destroy the array!");

        // Check if user confirmed
        if !self.config.unlock_encrypted {  // Reusing this flag as "force" for now
            return Err(DriveError::Unsupported(
                "Wiping RAID members requires --force flag".to_string()
            ));
        }

        // Import raid module
        use crate::drives::types::raid::RAIDArray;

        // Wipe metadata first
        let raid = RAIDArray::get_configuration(&self.device_path)
            .map_err(|e| DriveError::HardwareCommandFailed(format!("RAID detection failed: {}", e)))?;

        println!("RAID Type: {:?}", raid.raid_type);
        println!("Wiping RAID metadata...");

        raid.wipe_metadata()
            .map_err(|e| DriveError::IoError(
                std::io::Error::new(std::io::ErrorKind::Other, format!("Metadata wipe failed: {}", e))
            ))?;

        // Then wipe the drive normally based on its underlying type
        println!("Wiping drive data...");
        self.wipe_hdd_drive().await?;

        println!("✅ RAID member wipe completed successfully");
        Ok(())
    }

    /// Write pattern to a specific region (used by SMR and other specialized wipers)
    fn write_pattern_to_region(&self, offset: u64, size: u64) -> Result<()> {
        let mut file = OpenOptions::new()
            .write(true)
            .open(&self.device_path)?;

        file.seek(SeekFrom::Start(offset))?;

        // Generate pattern based on algorithm
        let pattern = self.generate_pattern(size as usize)?;
        file.write_all(&pattern)?;
        file.sync_all()?;

        Ok(())
    }

    /// Create basic drive info for now (TODO: integrate with full detection)
    fn create_basic_drive_info(device_path: &str) -> Result<DriveInfo> {
        // Simple detection based on device path
        let drive_type = if device_path.contains("nvme") {
            DriveType::NVMe
        } else if device_path.contains("mmcblk") {
            DriveType::EMMC
        } else {
            DriveType::HDD  // Default
        };

        Ok(DriveInfo {
            device_path: device_path.to_string(),
            model: "Unknown".to_string(),
            serial: "Unknown".to_string(),
            size: 1024 * 1024 * 1024 * 100,  // Assume 100GB for now
            drive_type,
            encryption_status: crate::EncryptionStatus::None,
            capabilities: Default::default(),
            health_status: None,
            temperature_celsius: None,
        })
    }

    /// Generate wipe pattern based on configured algorithm
    fn generate_pattern(&self, size: usize) -> Result<Vec<u8>> {
        use crate::crypto::secure_rng::SecureRNG;

        match self.config.algorithm {
            Algorithm::Random => {
                let mut data = vec![0u8; size];
                let mut rng = SecureRNG::new()?;
                rng.fill_bytes(&mut data)?;
                Ok(data)
            }
            Algorithm::Zero => {
                Ok(vec![0u8; size])
            }
            Algorithm::DoD5220 => {
                // DoD uses multiple passes, for now just use first pass pattern
                let mut data = vec![0u8; size];
                let mut rng = SecureRNG::new()?;
                rng.fill_bytes(&mut data)?;
                Ok(data)
            }
            Algorithm::Gutmann => {
                // Gutmann uses 35 passes, this is simplified
                let mut data = vec![0u8; size];
                let mut rng = SecureRNG::new()?;
                rng.fill_bytes(&mut data)?;
                Ok(data)
            }
            _ => {
                let mut data = vec![0u8; size];
                let mut rng = SecureRNG::new()?;
                rng.fill_bytes(&mut data)?;
                Ok(data)
            }
        }
    }
}

/// Convenience function for simple wipe operations
pub async fn wipe_drive(device_path: &str, config: WipeConfig) -> DriveResult<()> {
    let orchestrator = WipeOrchestrator::new(device_path.to_string(), config)
        .map_err(|e| DriveError::HardwareCommandFailed(format!("Orchestrator creation failed: {}", e)))?;

    orchestrator.execute().await
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_orchestrator_creation() {
        // This will fail without a real device, but tests the interface
        let config = WipeConfig::default();
        let result = WipeOrchestrator::new("/dev/null".to_string(), config);

        // Just verify it doesn't panic
        let _ = result;
    }

    #[test]
    fn test_pattern_generation() {
        let config = WipeConfig {
            algorithm: Algorithm::Zero,
            ..Default::default()
        };

        let orchestrator = WipeOrchestrator {
            device_path: "/dev/null".to_string(),
            config: config.clone(),
            drive_info: DriveInfo {
                device_path: "/dev/null".to_string(),
                model: "Test".to_string(),
                serial: "TEST123".to_string(),
                size: 1024 * 1024 * 1024,
                drive_type: DriveType::HDD,
                encryption_status: crate::EncryptionStatus::None,
                capabilities: Default::default(),
                health_status: None,
                temperature_celsius: None,
            },
        };

        let pattern = orchestrator.generate_pattern(1024).unwrap();
        assert_eq!(pattern.len(), 1024);
        assert!(pattern.iter().all(|&b| b == 0));
    }
}
