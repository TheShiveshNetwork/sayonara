use anyhow::{Result, anyhow};
use std::process::Command;

pub struct SSDWipe;

impl SSDWipe {
    pub fn secure_erase(device_path: &str) -> Result<()> {
        println!("Attempting hardware secure erase on {}", device_path);
        
        // First, check if secure erase is supported
        if !Self::is_secure_erase_supported(device_path)? {
            return Err(anyhow!("Secure erase not supported on this device"));
        }
        
        // Unfreeze the drive if frozen
        Self::unfreeze_drive(device_path)?;
        
        // Set security password (temporary)
        Self::set_security_password(device_path, "temp123")?;
        
        // Execute secure erase
        let output = Command::new("hdparm")
            .args(["--user-master", "u", "--security-erase", "temp123", device_path])
            .output()?;
        
        if !output.status.success() {
            let error = String::from_utf8_lossy(&output.stderr);
            return Err(anyhow!("Secure erase failed: {}", error));
        }
        
        println!("Hardware secure erase completed successfully");
        Ok(())
    }
    
    fn is_secure_erase_supported(device_path: &str) -> Result<bool> {
        let output = Command::new("hdparm")
            .args(["-I", device_path])
            .output()?;
        
        let output_str = String::from_utf8_lossy(&output.stdout);
        Ok(output_str.contains("supported: enhanced erase"))
    }
    
    fn unfreeze_drive(device_path: &str) -> Result<()> {
        // Some drives need to be power cycled to unfreeze
        // In a real implementation, you'd need to handle this properly
        println!("Checking drive freeze status...");
        
        let output = Command::new("hdparm")
            .args(["-I", device_path])
            .output()?;
        
        let output_str = String::from_utf8_lossy(&output.stdout);
        if output_str.contains("frozen") {
            println!("Warning: Drive is frozen. May need power cycle.");
        }
        
        Ok(())
    }
    
    fn set_security_password(device_path: &str, password: &str) -> Result<()> {
        let output = Command::new("hdparm")
            .args(["--user-master", "u", "--security-set-pass", password, device_path])
            .output()?;
        
        if !output.status.success() {
            let error = String::from_utf8_lossy(&output.stderr);
            return Err(anyhow!("Failed to set security password: {}", error));
        }
        
        Ok(())
    }
}
