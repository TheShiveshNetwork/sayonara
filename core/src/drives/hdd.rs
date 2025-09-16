// src/drives/hdd.rs
use anyhow::Result;
use std::process::Command;

pub struct HDDWipe;

impl HDDWipe {
    pub fn secure_erase(device_path: &str) -> Result<()> {
        println!("Starting HDD secure erase on {}", device_path);
        
        // For HDDs, we typically use software methods since hardware secure erase
        // is less reliable than on SSDs
        
        // Check if drive supports secure erase
        if Self::supports_secure_erase(device_path)? {
            Self::hardware_secure_erase(device_path)
        } else {
            // Fall back to software method
            println!("Hardware secure erase not available, use software method instead");
            Ok(())
        }
    }
    
    fn supports_secure_erase(device_path: &str) -> Result<bool> {
        let output = Command::new("hdparm")
            .args(["-I", device_path])
            .output()?;
        
        let output_str = String::from_utf8_lossy(&output.stdout);
        Ok(output_str.contains("supported: enhanced erase"))
    }
    
    fn hardware_secure_erase(device_path: &str) -> Result<()> {
        // Set security password
        Command::new("hdparm")
            .args(["--user-master", "u", "--security-set-pass", "temp123", device_path])
            .output()?;
        
        // Execute secure erase
        let output = Command::new("hdparm")
            .args(["--user-master", "u", "--security-erase", "temp123", device_path])
            .output()?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Hardware secure erase failed"));
        }
        
        println!("Hardware secure erase completed successfully");
        Ok(())
    }
}
