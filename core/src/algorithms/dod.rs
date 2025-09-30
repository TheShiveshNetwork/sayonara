use anyhow::Result;
use crate::crypto::secure_rng::secure_random_bytes;
use std::fs::OpenOptions;
use std::io::{Write, Seek, SeekFrom};
use crate::ui::progress::ProgressBar;

pub struct DoDWipe;

impl DoDWipe {
    pub fn wipe_drive(device_path: &str, size: u64) -> Result<()> {
        let mut file = OpenOptions::new()
            .write(true)
            .open(device_path)?;

        println!("Starting DoD 5220.22-M 3-pass wipe on {}", device_path);

        Self::write_pattern(&mut file, size, &[0x00])?;
        Self::write_pattern(&mut file, size, &[0xFF])?;
        Self::write_random(&mut file, size)?;

        file.sync_all()?;

        println!("\nDoD wipe completed successfully");
        Ok(())
    }

    fn write_pattern(file: &mut std::fs::File, size: u64, pattern: &[u8]) -> Result<()> {
        file.seek(SeekFrom::Start(0))?;

        const BUFFER_SIZE: usize = 1024 * 1024;
        let buffer = vec![pattern[0]; BUFFER_SIZE];
        let mut bytes_written = 0u64;
        let mut bar = ProgressBar::new(48);

        while bytes_written < size {
            let write_size = std::cmp::min(BUFFER_SIZE as u64, size - bytes_written);
            file.write_all(&buffer[..write_size as usize])?;
            bytes_written += write_size;

            if bytes_written % (50 * 1024 * 1024) == 0 || bytes_written == size {
                let progress = (bytes_written as f64 / size as f64) * 100.0;
                bar.render(progress, Some(bytes_written), Some(size));
            }
        }

        bar.render(100.0, Some(size), Some(size));
        Ok(())
    }

    fn write_random(file: &mut std::fs::File, size: u64) -> Result<()> {
        file.seek(SeekFrom::Start(0))?;

        const BUFFER_SIZE: usize = 1024 * 1024;
        let mut buffer = vec![0u8; BUFFER_SIZE];
        secure_random_bytes(&mut buffer)?;
        let mut bytes_written = 0u64;
        let mut bar = ProgressBar::new(48);

        while bytes_written < size {
            let write_size = std::cmp::min(BUFFER_SIZE as u64, size - bytes_written);
            file.write_all(&buffer[..write_size as usize])?;
            bytes_written += write_size;

            if bytes_written % (50 * 1024 * 1024) == 0 || bytes_written == size {
                let progress = (bytes_written as f64 / size as f64) * 100.0;
                bar.render(progress, Some(bytes_written), Some(size));
            }
        }

        bar.render(100.0, Some(size), Some(size));
        Ok(())
    }
}
