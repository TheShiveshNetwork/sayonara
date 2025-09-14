use crate::{DriveInfo, DriveType, EncryptionStatus};
use anyhow::{Result, anyhow};
use std::process::Command;
use std::fs;

pub struct DriveDetector;

impl DriveDetector {
    pub fn detect_all_drives() -> Result<Vec<DriveInfo>> {
        let mut drives = Vec::new();
        
        // Scan /sys/block for block devices
        let block_devices = fs::read_dir("/sys/block")?;
        
        for entry in block_devices {
            let entry = entry?;
            let device_name = entry.file_name();
            let device_name = device_name.to_string_lossy();
            
            // Skip loop devices, ram disks, etc.
            if device_name.starts_with("loop") || 
               device_name.starts_with("ram") ||
               device_name.starts_with("dm-") {
                continue;
            }
            
            let device_path = format!("/dev/{}", device_name);
            
            if let Ok(drive_info) = Self::analyze_drive(&device_path) {
                drives.push(drive_info);
            }
        }
        
        Ok(drives)
    }
    
    fn analyze_drive(device_path: &str) -> Result<DriveInfo> {
        let smartctl_output = Command::new("smartctl")
            .args(["-i", device_path])
            .output()?;
        
        let output_str = String::from_utf8_lossy(&smartctl_output.stdout);
        
        let model = Self::extract_field(&output_str, "Device Model:")
            .or_else(|| Self::extract_field(&output_str, "Model Number:"))
            .unwrap_or_else(|| "Unknown".to_string());
        
        let serial = Self::extract_field(&output_str, "Serial Number:")
            .unwrap_or_else(|| "Unknown".to_string());
        
        let size = Self::get_drive_size(device_path)?;
        let drive_type = Self::determine_drive_type(device_path, &output_str)?;
        let encryption_status = Self::detect_encryption(device_path)?;
        
        Ok(DriveInfo {
            device_path: device_path.to_string(),
            model,
            serial,
            size,
            drive_type,
            encryption_status,
        })
    }
    
    fn extract_field(output: &str, field_name: &str) -> Option<String> {
        output
            .lines()
            .find(|line| line.contains(field_name))?
            .split(':')
            .nth(1)?
            .trim()
            .to_string()
            .into()
    }
    
    fn get_drive_size(device_path: &str) -> Result<u64> {
        let output = Command::new("blockdev")
            .args(["--getsize64", device_path])
            .output()?;
        
        let size_str = String::from_utf8_lossy(&output.stdout).trim().to_string();
        Ok(size_str.parse()?)
    }
    
    fn determine_drive_type(device_path: &str, smartctl_output: &str) -> Result<DriveType> {
        // Check for NVMe
        if device_path.contains("nvme") {
            return Ok(DriveType::NVMe);
        }
        
        // Check SMART output for rotation rate
        if smartctl_output.contains("Rotation Rate:") {
            if smartctl_output.contains("Solid State Device") || 
               smartctl_output.contains("0 rpm") {
                Ok(DriveType::SSD)
            } else {
                Ok(DriveType::HDD)
            }
        } else {
            Ok(DriveType::Unknown)
        }
    }
    
    fn detect_encryption(device_path: &str) -> Result<EncryptionStatus> {
        // Check for OPAL
        let opal_check = Command::new("sedutil-cli")
            .args(["--query", device_path])
            .output();
        
        if opal_check.is_ok() {
            return Ok(EncryptionStatus::OPAL);
        }
        
        // Check for LUKS
        let luks_check = Command::new("cryptsetup")
            .args(["isLuks", device_path])
            .output();
        
        if let Ok(output) = luks_check {
            if output.status.success() {
                return Ok(EncryptionStatus::LUKS);
            }
        }
        
        Ok(EncryptionStatus::None)
    }
}
