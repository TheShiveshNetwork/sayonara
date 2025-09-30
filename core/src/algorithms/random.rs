use anyhow::Result;
use std::fs::OpenOptions;
use std::io::{Write, Seek, SeekFrom};
use crate::ui::progress::ProgressBar;
use crate::crypto::secure_rng::get_secure_rng;

pub struct RandomWipe;

impl RandomWipe {
    pub fn wipe_drive(device_path: &str, size: u64) -> Result<()> {
        let mut file = OpenOptions::new()
            .write(true)
            .open(device_path)?;

        println!("Starting single-pass random wipe on {}", device_path);

        Self::write_random(&mut file, size)?;
        file.sync_all()?;

        println!("\nRandom wipe completed successfully");
        Ok(())
    }

    fn write_random(file: &mut std::fs::File, size: u64) -> Result<()> {
        file.seek(SeekFrom::Start(0))?;

        const BUFFER_SIZE: usize = 1024 * 1024;
        let mut buffer = vec![0u8; BUFFER_SIZE];
        let rng = get_secure_rng();
        let mut bytes_written = 0u64;
        let mut bar = ProgressBar::new(48);

        while bytes_written < size {
            let write_size = std::cmp::min(BUFFER_SIZE as u64, size - bytes_written);
            rng.fill_bytes(&mut buffer[..write_size as usize])?;
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
