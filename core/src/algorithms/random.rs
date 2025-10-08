use anyhow::Result;
use crate::ui::progress::ProgressBar;
use crate::crypto::secure_rng::get_secure_rng;
use crate::io::{OptimizedIO, IOConfig, IOHandle};
use crate::DriveType;

pub struct RandomWipe;

impl RandomWipe {
    pub fn wipe_drive(device_path: &str, size: u64, drive_type: DriveType) -> Result<()> {
        println!("Starting single-pass random wipe on {}", device_path);

        // Configure I/O based on drive type
        let io_config = match drive_type {
            DriveType::NVMe => IOConfig::nvme_optimized(),
            DriveType::SSD => IOConfig::sata_ssd_optimized(),
            DriveType::HDD => IOConfig::hdd_optimized(),
            _ => IOConfig::default(),
        };

        // Open device with optimized I/O
        let mut io_handle = OptimizedIO::open(device_path, io_config)?;

        Self::write_random(&mut io_handle, size)?;

        // Final sync
        io_handle.sync()?;

        // Print performance report
        OptimizedIO::print_performance_report(&io_handle, None);

        println!("\n✅ Random wipe completed successfully");
        Ok(())
    }

    fn write_random(io_handle: &mut IOHandle, size: u64) -> Result<()> {
        let rng = get_secure_rng();
        let mut bytes_written = 0u64;
        let mut bar = ProgressBar::new(48);

        OptimizedIO::sequential_write(io_handle, size, |buffer| {
            // Fill buffer with cryptographically secure random data
            let buf = buffer.as_mut_slice();
            rng.fill_bytes(buf)?;

            bytes_written += buf.len() as u64;

            if bytes_written % (50 * 1024 * 1024) == 0 || bytes_written >= size {
                let progress = (bytes_written as f64 / size as f64) * 100.0;
                bar.render(progress, Some(bytes_written), Some(size));
            }

            Ok(())
        })?;

        bar.render(100.0, Some(size), Some(size));
        Ok(())
    }
}
