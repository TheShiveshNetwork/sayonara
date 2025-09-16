// src/algorithms/gutmann.rs
use anyhow::Result;
use rand::RngCore;
use std::fs::OpenOptions;
use std::io::{Write, Seek, SeekFrom};

pub struct GutmannWipe;

impl GutmannWipe {
    // Gutmann's 35-pass method
    const PATTERNS: [&'static [u8]; 35] = [
        // Random passes (1-4)
        &[], &[], &[], &[], 
        // Fixed patterns (5-31)
        &[0x55, 0x55, 0x55], &[0xAA, 0xAA, 0xAA], &[0x92, 0x49, 0x24],
        &[0x49, 0x24, 0x92], &[0x24, 0x92, 0x49], &[0x00, 0x00, 0x00],
        &[0x11, 0x11, 0x11], &[0x22, 0x22, 0x22], &[0x33, 0x33, 0x33],
        &[0x44, 0x44, 0x44], &[0x55, 0x55, 0x55], &[0x66, 0x66, 0x66],
        &[0x77, 0x77, 0x77], &[0x88, 0x88, 0x88], &[0x99, 0x99, 0x99],
        &[0xAA, 0xAA, 0xAA], &[0xBB, 0xBB, 0xBB], &[0xCC, 0xCC, 0xCC],
        &[0xDD, 0xDD, 0xDD], &[0xEE, 0xEE, 0xEE], &[0xFF, 0xFF, 0xFF],
        &[0x92, 0x49, 0x24], &[0x49, 0x24, 0x92], &[0x24, 0x92, 0x49],
        &[0x6D, 0xB6, 0xDB], &[0xB6, 0xDB, 0x6D], &[0xDB, 0x6D, 0xB6],
        // Random passes (32-35)
        &[], &[], &[], &[]
    ];
    
    pub fn wipe_drive(device_path: &str, size: u64) -> Result<()> {
        let mut file = OpenOptions::new()
            .write(true)
            .open(device_path)?;
        
        println!("Starting Gutmann 35-pass wipe on {} - this will take a while!", device_path);
        
        for (pass_num, pattern) in Self::PATTERNS.iter().enumerate() {
            println!("Pass {}/35", pass_num + 1);
            
            if pattern.is_empty() {
                // Random pass
                Self::write_random_pass(&mut file, size)?;
            } else {
                // Fixed pattern pass
                Self::write_pattern_pass(&mut file, size, pattern)?;
            }
        }
        
        file.sync_all()?;
        println!("Gutmann 35-pass wipe completed successfully");
        Ok(())
    }
    
    fn write_random_pass(file: &mut std::fs::File, size: u64) -> Result<()> {
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
        }
        
        Ok(())
    }
    
    fn write_pattern_pass(file: &mut std::fs::File, size: u64, pattern: &[u8]) -> Result<()> {
        file.seek(SeekFrom::Start(0))?;
        
        const BUFFER_SIZE: usize = 1024 * 1024;
        let mut buffer = vec![0u8; BUFFER_SIZE];
        
        // Fill buffer with repeating pattern
        for (i, byte) in buffer.iter_mut().enumerate() {
            *byte = pattern[i % pattern.len()];
        }
        
        let mut bytes_written = 0u64;
        
        while bytes_written < size {
            let write_size = std::cmp::min(BUFFER_SIZE as u64, size - bytes_written);
            file.write_all(&buffer[..write_size as usize])?;
            bytes_written += write_size;
        }
        
        Ok(())
    }
}
