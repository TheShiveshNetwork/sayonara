use anyhow::Result;
use rand::RngCore;
use std::fs::OpenOptions;
use std::io::{Write, Seek, SeekFrom};

pub struct DoDWipe;

impl DoDWipe {
    pub fn wipe_drive(device_path: &str, size: u64) -> Result<()> {
        let mut file = OpenOptions::new()
            .write(true)
            .open(device_path)?;
        
        println!("Starting DoD 5220.22-M 3-pass wipe on {}", device_path);
        
        // Pass 1: Write zeros
        Self::write_pattern(&mut file, size, &[0x00])?;
        
        // Pass 2: Write ones  
        Self::write_pattern(&mut file, size, &[0xFF])?;
        
        // Pass 3: Write random data
        Self::write_random(&mut file, size)?;
        
        // Sync to ensure all data is written
        file.sync_all()?;
        
        println!("DoD wipe completed successfully");
        Ok(())
    }
    
    fn write_pattern(file: &mut std::fs::File, size: u64, pattern: &[u8]) -> Result<()> {
        file.seek(SeekFrom::Start(0))?;
        
        const BUFFER_SIZE: usize = 1024 * 1024; // 1MB buffer
        let mut buffer = vec![pattern[0]; BUFFER_SIZE];
        
        let mut bytes_written = 0u64;
        
        while bytes_written < size {
            let write_size = std::cmp::min(BUFFER_SIZE as u64, size - bytes_written);
            file.write_all(&buffer[..write_size as usize])?;
            bytes_written += write_size;
            
            // Progress update
            let progress = (bytes_written as f64 / size as f64) * 100.0;
            if bytes_written % (100 * 1024 * 1024) == 0 { // Update every 100MB
                println!("Progress: {:.1}%", progress);
            }
        }
        
        Ok(())
    }
    
    fn write_random(file: &mut std::fs::File, size: u64) -> Result<()> {
        file.seek(SeekFrom::Start(0))?;
        
        const BUFFER_SIZE: usize = 1024 * 1024;
        let mut buffer = vec![0u8; BUFFER_SIZE];
        let mut rng = rand::thread_rng();
        
        let mut bytes_written = 0u64;
        
        while bytes_written < size {
            let write_size = std::cmp::min(BUFFER_SIZE as u64, size - bytes_written);
            rng.fill_bytes(&mut buffer[..write_size as usize]);
            file.write_all(&buffer[..write_size as usize])?;
            bytes_written += write_size;
            
            let progress = (bytes_written as f64 / size as f64) * 100.0;
            if bytes_written % (100 * 1024 * 1024) == 0 {
                println!("Random pass progress: {:.1}%", progress);
            }
        }
        
        Ok(())
    }
}
