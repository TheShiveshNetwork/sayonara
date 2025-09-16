// src/algorithms/random.rs
use anyhow::Result;
use rand::RngCore;
use std::fs::OpenOptions;
use std::io::{Write, Seek, SeekFrom};

pub struct RandomWipe;

impl RandomWipe {
    pub fn wipe_drive(device_path: &str, size: u64) -> Result<()> {
        let mut file = OpenOptions::new()
            .write(true)
            .open(device_path)?;
        
        println!("Starting single-pass random wipe on {}", device_path);
        
        Self::write_random(&mut file, size)?;
        file.sync_all()?;
        
        println!("Random wipe completed successfully");
        Ok(())
    }
    
    fn write_random(file: &mut std::fs::File, size: u64) -> Result<()> {
        file.seek(SeekFrom::Start(0))?;
        
        const BUFFER_SIZE: usize = 1024 * 1024; // 1MB buffer
        let mut buffer = vec![0u8; BUFFER_SIZE];
        let mut rng = rand::thread_rng();
        
        let mut bytes_written = 0u64;
        
        while bytes_written < size {
            let write_size = std::cmp::min(BUFFER_SIZE as u64, size - bytes_written);
            rng.fill_bytes(&mut buffer[..write_size as usize]);
            file.write_all(&buffer[..write_size as usize])?;
            bytes_written += write_size;
            
            // Progress update every 100MB
            if bytes_written % (100 * 1024 * 1024) == 0 {
                let progress = (bytes_written as f64 / size as f64) * 100.0;
                println!("Random wipe progress: {:.1}%", progress);
            }
        }
        
        Ok(())
    }
}
