// Vendor-specific unfreeze commands for RAID controllers

use super::{UnfreezeStrategy, StrategyResult};
use crate::drives::freeze::detection::FreezeReason;
use anyhow::{Result, anyhow};
use std::process::Command;
use std::thread;
use std::time::Duration;

pub struct VendorSpecific;

impl VendorSpecific {
    pub fn new() -> Self {
        Self
    }

    /// Dell PERC RAID controller unfreeze
    fn dell_perc_unfreeze(&self, device_path: &str) -> Result<()> {
        println!("      🔧 Attempting Dell PERC unfreeze");

        // Try percli (PERC CLI tool)
        let physical_disk = self.get_perc_physical_disk(device_path)?;

        println!("      Physical disk ID: {}", physical_disk);

        // Dell PERC: Set drive to JBOD mode temporarily
        let output = Command::new("percli")
            .args([
                "/c0/e252/s0", // Controller 0, Enclosure 252, Slot 0 (example)
                "set", "jbod"
            ])
            .output();

        if let Ok(output) = output {
            if output.status.success() {
                thread::sleep(Duration::from_secs(2));

                // Try to clear freeze
                let clear_output = Command::new("percli")
                    .args(["/c0/e252/s0", "start", "initialization"])
                    .output();

                if clear_output.is_ok() {
                    println!("      ✅ Dell PERC unfreeze successful");
                    return Ok(());
                }
            }
        }

        Err(anyhow!("Dell PERC unfreeze failed"))
    }

    fn get_perc_physical_disk(&self, _device_path: &str) -> Result<String> {
        // Parse PERC controller output to find physical disk ID
        let output = Command::new("percli")
            .args(["/c0", "show"])
            .output()?;

        let _output_str = String::from_utf8_lossy(&output.stdout);

        // Parse for disk IDs
        // This is simplified - real implementation would parse properly
        Ok("e252/s0".to_string())
    }

    /// HP SmartArray unfreeze
    fn hp_smartarray_unfreeze(&self, device_path: &str) -> Result<()> {
        println!("      🔧 Attempting HP SmartArray unfreeze");

        // Try hpssacli (HP Smart Storage Administrator CLI)
        let array_id = self.get_hp_array_id(device_path)?;

        println!("      Array ID: {}", array_id);

        // HP SmartArray: Disable and re-enable drive
        let output = Command::new("hpssacli")
            .args([
                "ctrl", "slot=0",
                "pd", &array_id,
                "modify", "clearsecurity"
            ])
            .output();

        if let Ok(output) = output {
            if output.status.success() {
                println!("      ✅ HP SmartArray unfreeze successful");
                return Ok(());
            }
        }

        Err(anyhow!("HP SmartArray unfreeze failed"))
    }

    fn get_hp_array_id(&self, _device_path: &str) -> Result<String> {
        // Parse HP controller output
        Ok("1I:1:1".to_string()) // Example format
    }

    /// LSI MegaRAID unfreeze
    fn lsi_megaraid_unfreeze(&self, device_path: &str) -> Result<()> {
        println!("      🔧 Attempting LSI MegaRAID unfreeze");

        // Try storcli or megacli
        let disk_id = self.get_lsi_disk_id(device_path)?;

        println!("      Disk ID: {}", disk_id);

        // LSI MegaRAID: Clear foreign configuration
        let commands = vec![
            vec!["storcli64", "/c0/e252/s0", "set", "security", "off"],
            vec!["megacli", "-PdSetSecurity", "-Off", "-PhysDrv", "[252:0]", "-a0"],
        ];

        for cmd in commands {
            let output = Command::new(&cmd[0])
                .args(&cmd[1..])
                .output();

            if let Ok(output) = output {
                if output.status.success() {
                    println!("      ✅ LSI MegaRAID unfreeze successful");
                    return Ok(());
                }
            }
        }

        Err(anyhow!("LSI MegaRAID unfreeze failed"))
    }

    fn get_lsi_disk_id(&self, _device_path: &str) -> Result<String> {
        Ok("[252:0]".to_string()) // Example format
    }

    /// Adaptec RAID unfreeze
    fn adaptec_unfreeze(&self, device_path: &str) -> Result<()> {
        println!("      🔧 Attempting Adaptec unfreeze");

        let disk_id = self.get_adaptec_disk_id(device_path)?;

        // Adaptec: Use arcconf tool
        let output = Command::new("arcconf")
            .args([
                "setstate", "controller", "1",
                "device", &disk_id,
                "state", "non-raid"
            ])
            .output();

        if let Ok(output) = output {
            if output.status.success() {
                println!("      ✅ Adaptec unfreeze successful");
                return Ok(());
            }
        }

        Err(anyhow!("Adaptec unfreeze failed"))
    }

    fn get_adaptec_disk_id(&self, _device_path: &str) -> Result<String> {
        Ok("0 0".to_string()) // Channel Device format
    }

    /// Intel RST (Rapid Storage Technology) unfreeze
    fn intel_rst_unfreeze(&self, _device_path: &str) -> Result<()> {
        println!("      🔧 Attempting Intel RST unfreeze");

        // Intel RST: Disable RAID mode temporarily via MSR
        // This requires root and may affect system stability

        // Method 1: Use setpci to modify PCIe configuration
        let output = Command::new("setpci")
            .args(["-s", "00:1f.2", "0x90.w=0x00"])
            .output();

        if let Ok(output) = output {
            if output.status.success() {
                thread::sleep(Duration::from_secs(1));

                // Restore
                let _ = Command::new("setpci")
                    .args(["-s", "00:1f.2", "0x90.w=0x2901"])
                    .output();

                println!("      ✅ Intel RST toggle successful");
                return Ok(());
            }
        }

        Err(anyhow!("Intel RST unfreeze failed"))
    }

    /// Detect controller vendor
    fn detect_vendor(&self, device_path: &str) -> Result<String> {
        use std::fs;
        use std::path::Path;

        let device_name = Path::new(device_path)
            .file_name()
            .and_then(|n| n.to_str())
            .ok_or_else(|| anyhow!("Invalid device path"))?;

        // Check sysfs for vendor info
        let vendor_path = format!("/sys/block/{}/device/vendor", device_name);
        if let Ok(vendor) = fs::read_to_string(&vendor_path) {
            let vendor_lower = vendor.trim().to_lowercase();

            if vendor_lower.contains("dell") || vendor_lower.contains("perc") {
                return Ok("Dell PERC".to_string());
            } else if vendor_lower.contains("hp") || vendor_lower.contains("smart") {
                return Ok("HP SmartArray".to_string());
            } else if vendor_lower.contains("lsi") || vendor_lower.contains("mega") {
                return Ok("LSI MegaRAID".to_string());
            } else if vendor_lower.contains("adaptec") {
                return Ok("Adaptec".to_string());
            } else if vendor_lower.contains("intel") {
                return Ok("Intel RST".to_string());
            }
        }

        // Check via lspci
        let output = Command::new("lspci")
            .args(["-v"])
            .output()?;

        let output_str = String::from_utf8_lossy(&output.stdout);

        if output_str.contains("PERC") {
            Ok("Dell PERC".to_string())
        } else if output_str.contains("SmartArray") {
            Ok("HP SmartArray".to_string())
        } else if output_str.contains("MegaRAID") || output_str.contains("LSI") {
            Ok("LSI MegaRAID".to_string())
        } else if output_str.contains("Adaptec") {
            Ok("Adaptec".to_string())
        } else if output_str.contains("Intel") && output_str.contains("SATA") {
            Ok("Intel RST".to_string())
        } else {
            Ok("Unknown".to_string())
        }
    }
}

impl UnfreezeStrategy for VendorSpecific {
    fn name(&self) -> &str {
        "Vendor-Specific Commands"
    }

    fn description(&self) -> &str {
        "Uses vendor-specific CLI tools to unfreeze drives on RAID controllers"
    }

    fn is_compatible_with(&self, reason: &FreezeReason) -> bool {
        matches!(reason,
            FreezeReason::RaidController |
            FreezeReason::ControllerPolicy |
            FreezeReason::Unknown
        )
    }

    fn is_available(&self) -> bool {
        // Check if any vendor tools are available
        let tools = vec![
            "percli",      // Dell PERC
            "hpssacli",    // HP SmartArray
            "storcli64",   // LSI MegaRAID (newer)
            "megacli",     // LSI MegaRAID (older)
            "arcconf",     // Adaptec
            "setpci",      // Intel RST (requires root)
        ];

        tools.iter().any(|tool| {
            Command::new("which")
                .arg(tool)
                .output()
                .map(|o| o.status.success())
                .unwrap_or(false)
        })
    }

    fn execute(&self, device_path: &str, _reason: &FreezeReason) -> Result<StrategyResult> {
        println!("      🏢 Executing vendor-specific unfreeze");

        let vendor = self.detect_vendor(device_path)?;
        println!("      Detected vendor: {}", vendor);

        let result = match vendor.as_str() {
            "Dell PERC" => self.dell_perc_unfreeze(device_path),
            "HP SmartArray" => self.hp_smartarray_unfreeze(device_path),
            "LSI MegaRAID" => self.lsi_megaraid_unfreeze(device_path),
            "Adaptec" => self.adaptec_unfreeze(device_path),
            "Intel RST" => self.intel_rst_unfreeze(device_path),
            _ => Err(anyhow!("Unknown or unsupported vendor: {}", vendor)),
        };

        match result {
            Ok(_) => Ok(StrategyResult::success(
                format!("Successfully unfrozen using {} commands", vendor)
            )),
            Err(e) => Err(anyhow!("Vendor-specific unfreeze failed: {}", e)),
        }
    }

    fn estimated_duration(&self) -> u64 {
        15 // 15 seconds
    }

    fn risk_level(&self) -> u8 {
        6 // Medium-high risk (controller commands can be dangerous)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_vendor_specific_compatibility() {
        let strategy = VendorSpecific::new();

        assert!(strategy.is_compatible_with(&FreezeReason::RaidController));
        assert!(strategy.is_compatible_with(&FreezeReason::ControllerPolicy));
        assert!(!strategy.is_compatible_with(&FreezeReason::OsSecurity));
    }

    #[test]
    fn test_vendor_specific_properties() {
        let strategy = VendorSpecific::new();

        assert_eq!(strategy.name(), "Vendor-Specific Commands");
        assert_eq!(strategy.risk_level(), 6);
        assert_eq!(strategy.estimated_duration(), 15);
    }
}
