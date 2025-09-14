use anyhow::{Result, anyhow};
use std::process::Command;

pub struct NVMeWipe;

impl NVMeWipe {
    pub fn secure_erase(device_path: &str) -> Result<()> {
        println!("Starting NVMe secure erase on {}", device_path);
        
        // Get NVMe device info
        let device_info = Self::get_nvme_info(device_path)?;
        
        // Check if Format NVM command is supported
        if Self::supports_format_nvm(device_path)? {
            Self::format_nvm_secure_erase(device_path)?;
        } else if Self::supports_sanitize(device_path)? {
            Self::sanitize_crypto_erase(device_path)?;
        } else {
            return Err(anyhow!("No secure erase method available for this NVMe device"));
        }
        
        println!("NVMe secure erase completed successfully");
        Ok(())
    }
    
    fn get_nvme_info(device_path: &str) -> Result<String> {
        let output = Command::new("nvme")
            .args(["id-ctrl", device_path])
            .output()?;
        
        if !output.status.success() {
            let error = String::from_utf8_lossy(&output.stderr);
            return Err(anyhow!("Failed to get NVMe info: {}", error));
        }
        
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    }
    
    fn supports_format_nvm(device_path: &str) -> Result<bool> {
        let info = Self::get_nvme_info(device_path)?;
        Ok(info.contains("Format NVM Supported"))
    }
    
    fn supports_sanitize(device_path: &str) -> Result<bool> {
        let info = Self::get_nvme_info(device_path)?;
        Ok(info.contains("Sanitize Operation Supported"))
    }
    
    fn format_nvm_secure_erase(device_path: &str) -> Result<()> {
        println!("Using Format NVM with secure erase...");
        
        let output = Command::new("nvme")
            .args(["format", device_path, "--ses=1", "--force"])
            .output()?;
        
        if !output.status.success() {
            let error = String::from_utf8_lossy(&output.stderr);
            return Err(anyhow!("Format NVM secure erase failed: {}", error));
        }
        
        Ok(())
    }
    
    fn sanitize_crypto_erase(device_path: &str) -> Result<()> {
        println!("Using Sanitize crypto erase...");
        
        let output = Command::new("nvme")
            .args(["sanitize", device_path, "--crypto-erase", "--force"])
            .output()?;
        
        if !output.status.success() {
            let error = String::from_utf8_lossy(&output.stderr);
            return Err(anyhow!("Sanitize crypto erase failed: {}", error));
        }
        
        Ok(())
    }
}
