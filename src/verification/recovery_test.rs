use anyhow::{Result, anyhow};
use rand::RngCore;
use std::fs::OpenOptions;
use std::io::{Read, Seek, SeekFrom};
use sha2::{Sha256, Digest};

pub struct RecoveryTest;

impl RecoveryTest {
    pub fn verify_wipe(device_path: &str, size: u64) -> Result<bool> {
        println!("Starting recovery verification test...");
        
        // Sample random sectors for testing
        let test_sectors = Self::generate_test_sectors(size)?;
        
        for sector in test_sectors {
            if !Self::verify_sector_wiped(device_path, sector)? {
                println!("Warning: Recoverable data found at sector {}", sector);
                return Ok(false);
            }
        }
        
        // Perform entropy analysis
        let entropy_score = Self::calculate_entropy(device_path, size)?;
        println!("Drive entropy score: {:.2}", entropy_score);
        
        // High entropy indicates good randomization
        Ok(entropy_score > 7.5) // Threshold for good randomness
    }
    
    fn generate_test_sectors(size: u64) -> Result<Vec<u64>> {
        let sector_size = 512u64;
        let total_sectors = size / sector_size;
        let mut test_sectors = Vec::new();
        let mut rng = rand::thread_rng();
        
        // Test 1000 random sectors
        for _ in 0..1000 {
            let sector = rng.next_u64() % total_sectors;
            test_sectors.push(sector * sector_size);
        }
        
        Ok(test_sectors)
    }
    
    fn verify_sector_wiped(device_path: &str, offset: u64) -> Result<bool> {
        let mut file = OpenOptions::new()
            .read(true)
            .open(device_path)?;
        
        file.seek(SeekFrom::Start(offset))?;
        
        let mut buffer = vec![0u8; 4096]; // Read 4KB
        file.read_exact(&mut buffer)?;
        
        // Check for patterns that might indicate recoverable data
        // This is a simplified check - in practice, you'd want more sophisticated analysis
        let zero_count = buffer.iter().filter(|&&b| b == 0).count();
        let ff_count = buffer.iter().filter(|&&b| b == 0xFF).count();
        
        // If more than 80% is the same byte, it's likely properly wiped
        let uniform_threshold = buffer.len() * 8 / 10;
        
        Ok(zero_count < uniform_threshold && ff_count < uniform_threshold)
    }
    
    fn calculate_entropy(device_path: &str, size: u64) -> Result<f64> {
        let mut file = OpenOptions::new()
            .read(true)
            .open(device_path)?;
        
        let sample_size = std::cmp::min(100 * 1024 * 1024, size); // Sample up to 100MB
        let mut buffer = vec![0u8; sample_size as usize];
        
        file.read_exact(&mut buffer)?;
        
        // Calculate Shannon entropy
        let mut counts = [0u64; 256];
        for &byte in &buffer {
            counts[byte as usize] += 1;
        }
        
        let length = buffer.len() as f64;
        let mut entropy = 0.0;
        
        for &count in &counts {
            if count > 0 {
                let probability = count as f64 / length;
                entropy -= probability * probability.log2();
            }
        }
        
        Ok(entropy)
    }
}
