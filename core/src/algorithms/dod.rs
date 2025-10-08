use anyhow::Result;
use crate::crypto::secure_rng::secure_random_bytes;
use crate::ui::progress::ProgressBar;
use crate::io::{OptimizedIO, IOConfig, IOHandle};
use crate::DriveType;

pub struct DoDWipe;

impl DoDWipe {
    pub fn wipe_drive(device_path: &str, size: u64, drive_type: DriveType) -> Result<()> {
        println!("Starting DoD 5220.22-M 3-pass wipe on {}", device_path);

        // Configure I/O based on drive type
        let io_config = match drive_type {
            DriveType::NVMe => IOConfig::nvme_optimized(),
            DriveType::SSD => IOConfig::sata_ssd_optimized(),
            DriveType::HDD => IOConfig::hdd_optimized(),
            _ => IOConfig::default(),
        };

        // Open device with optimized I/O
        let mut io_handle = OptimizedIO::open(device_path, io_config)?;

        // Pass 1: Write 0x00
        println!("\n🔄 Pass 1/3: Writing 0x00");
        Self::write_pattern(&mut io_handle, size, 0x00)?;

        // Pass 2: Write 0xFF
        println!("\n🔄 Pass 2/3: Writing 0xFF");
        Self::write_pattern(&mut io_handle, size, 0xFF)?;

        // Pass 3: Write random data
        println!("\n🔄 Pass 3/3: Writing random data");
        Self::write_random(&mut io_handle, size)?;

        // Final sync
        io_handle.sync()?;

        // Print performance report
        OptimizedIO::print_performance_report(&io_handle, None);

        println!("\n✅ DoD wipe completed successfully");
        Ok(())
    }

    fn write_pattern(io_handle: &mut IOHandle, size: u64, pattern_byte: u8) -> Result<()> {
        let mut bytes_written = 0u64;
        let mut bar = ProgressBar::new(48);

        OptimizedIO::sequential_write(io_handle, size, |buffer| {
            // Fill buffer with pattern
            let buf = buffer.as_mut_slice();
            buf.fill(pattern_byte);

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

    fn write_random(io_handle: &mut IOHandle, size: u64) -> Result<()> {
        let mut bytes_written = 0u64;
        let mut bar = ProgressBar::new(48);

        OptimizedIO::sequential_write(io_handle, size, |buffer| {
            // Fill buffer with cryptographically secure random data
            let buf = buffer.as_mut_slice();
            secure_random_bytes(buf)?;

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
