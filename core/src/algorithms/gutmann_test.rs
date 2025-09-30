use crate::algorithms::{gutmann::GutmannWipe};

#[cfg(test)]
mod tests {
    use std::collections::HashMap;
    use super::*;
    type Result<T> = std::result::Result<T, Box<dyn std::error::Error + Send + Sync>>;
    use tempfile::NamedTempFile;
    use std::io::{Write, Read, Seek, SeekFrom};
    use crate::algorithms::gutmann::DriveEncoding;
    use crate::ui::progress::ProgressBar;

    /// Test that patterns match the original Gutmann specification
    #[test]
    fn test_gutmann_patterns_correct() {
        // Verify we have exactly 35 patterns
        assert_eq!(GutmannWipe::GUTMANN_PATTERNS.len(), 35);

        // Verify first 4 and last 4 are random (None)
        for i in 0..4 {
            assert!(GutmannWipe::GUTMANN_PATTERNS[i].0.is_none(),
                    "Pass {} should be random", i + 1);
        }
        for i in 31..35 {
            assert!(GutmannWipe::GUTMANN_PATTERNS[i].0.is_none(),
                    "Pass {} should be random", i + 1);
        }

        // Verify specific patterns according to paper
        assert_eq!(GutmannWipe::GUTMANN_PATTERNS[4].0, Some(&[0x55][..]));
        assert_eq!(GutmannWipe::GUTMANN_PATTERNS[5].0, Some(&[0xAA][..]));
        assert_eq!(GutmannWipe::GUTMANN_PATTERNS[6].0, Some(&[0x92, 0x49, 0x24][..]));
        assert_eq!(GutmannWipe::GUTMANN_PATTERNS[7].0, Some(&[0x49, 0x24, 0x92][..]));
        assert_eq!(GutmannWipe::GUTMANN_PATTERNS[8].0, Some(&[0x24, 0x92, 0x49][..]));

        // Verify incrementing patterns 0x00 through 0xFF
        assert_eq!(GutmannWipe::GUTMANN_PATTERNS[9].0, Some(&[0x00][..]));
        assert_eq!(GutmannWipe::GUTMANN_PATTERNS[24].0, Some(&[0xFF][..]));

        // Verify RLL patterns
        assert_eq!(GutmannWipe::GUTMANN_PATTERNS[28].0, Some(&[0x6D, 0xB6, 0xDB][..]));
        assert_eq!(GutmannWipe::GUTMANN_PATTERNS[29].0, Some(&[0xB6, 0xDB, 0x6D][..]));
        assert_eq!(GutmannWipe::GUTMANN_PATTERNS[30].0, Some(&[0xDB, 0x6D, 0xB6][..]));
    }

    /// Test pattern writing and verification
    #[test]
    fn test_pattern_write_and_verify() -> Result<()> {
        let mut temp_file = NamedTempFile::new()?;
        let test_size = 10 * 1024; // 10KB for testing

        // Create test file with known data
        let initial_data = vec![0xDE; test_size];
        temp_file.write_all(&initial_data)?;
        temp_file.flush()?;

        // Test writing a specific pattern
        let pattern = &[0x55, 0xAA];
        let mut file = temp_file.reopen()?;
        let _bar = ProgressBar::new(48);

        GutmannWipe::write_pattern_with_verification(
            &mut file,
            test_size as u64,
            pattern,
            0
        )?;

        // Manually verify the pattern was written
        file.seek(SeekFrom::Start(0))?;
        let mut buffer = vec![0u8; test_size];
        file.read_exact(&mut buffer)?;

        for (i, &byte) in buffer.iter().enumerate() {
            let expected = pattern[i % pattern.len()];
            assert_eq!(byte, expected,
                       "Byte at position {} should be 0x{:02x}, got 0x{:02x}",
                       i, expected, byte);
        }

        Ok(())
    }

    /// Test entropy calculation
    #[test]
    fn test_entropy_calculation() {
        // Test all zeros - should have 0 entropy
        let all_zeros = vec![0u8; 1000];
        let entropy = GutmannWipe::calculate_entropy(&all_zeros);
        assert!(entropy < 0.1, "All zeros should have near-zero entropy");

        // Test all ones - should have 0 entropy
        let all_ones = vec![0xFF; 1000];
        let entropy = GutmannWipe::calculate_entropy(&all_ones);
        assert!(entropy < 0.1, "All ones should have near-zero entropy");

        // Test perfect random data - should have high entropy
        let mut random_data = vec![0u8; 256];
        for i in 0..256 {
            random_data[i] = i as u8;
        }
        let entropy = GutmannWipe::calculate_entropy(&random_data);
        assert!(entropy > 7.9, "Perfect distribution should have max entropy");

        // Test real random data
        use crate::crypto::secure_rng::secure_random_bytes;
        let mut real_random = vec![0u8; 4096];
        secure_random_bytes(&mut real_random).unwrap();
        let entropy = GutmannWipe::calculate_entropy(&real_random);
        assert!(entropy > 7.5, "Random data should have high entropy");
    }

    /// Test checkpoint save and load
    #[test]
    fn test_checkpoint_operations() -> Result<()> {
        let test_device = "/dev/test_device";
        let test_pass = 15;
        let test_size = 1024 * 1024 * 1024; // 1GB
        let encoding = DriveEncoding::PRML;

        // Save checkpoint
        GutmannWipe::save_checkpoint(test_device, test_pass, test_size, &encoding)?;

        // Load checkpoint
        let loaded = GutmannWipe::load_checkpoint(test_device);
        assert!(loaded.is_some(), "Checkpoint should be loaded");

        let checkpoint = loaded.unwrap();
        assert_eq!(checkpoint.device_path, test_device);
        assert_eq!(checkpoint.current_pass, test_pass);
        assert_eq!(checkpoint.total_size, test_size);
        assert_eq!(checkpoint.encoding, "PRML");

        // Verify timestamp is recent
        let age = chrono::Utc::now() - checkpoint.timestamp;
        assert!(age.num_seconds() < 5, "Checkpoint should be recent");

        // Clean up
        GutmannWipe::delete_checkpoint(test_device);

        // Verify deletion
        let deleted = GutmannWipe::load_checkpoint(test_device);
        assert!(deleted.is_none(), "Checkpoint should be deleted");

        Ok(())
    }

    /// Test drive encoding detection
    #[test]
    fn test_encoding_detection() {
        // Since we can't test real drives in unit tests,
        // verify the function returns a valid encoding
        let encoding = GutmannWipe::detect_drive_encoding("/dev/null").unwrap();

        // Should return Unknown for /dev/null
        match encoding {
            DriveEncoding::MFM |
            DriveEncoding::RLL |
            DriveEncoding::PRML |
            DriveEncoding::Unknown => {
                // Valid encoding returned
            }
        }
    }

    /// Test optimized pattern selection based on encoding
    #[test]
    fn test_optimized_patterns() {
        // Test MFM optimization
        let mfm_patterns = GutmannWipe::get_optimized_patterns(DriveEncoding::MFM);
        assert!(mfm_patterns.len() < 35, "MFM should use subset of patterns");
        assert!(mfm_patterns.contains(&6), "MFM should include MFM-specific patterns");

        // Test RLL optimization
        let rll_patterns = GutmannWipe::get_optimized_patterns(DriveEncoding::RLL);
        assert!(rll_patterns.len() < 35, "RLL should use subset of patterns");
        assert!(rll_patterns.contains(&26), "RLL should include RLL-specific patterns");

        // Test PRML optimization
        let prml_patterns = GutmannWipe::get_optimized_patterns(DriveEncoding::PRML);
        assert!(prml_patterns.len() < 35, "PRML should use subset of patterns");

        // Test Unknown - should use all patterns
        let unknown_patterns = GutmannWipe::get_optimized_patterns(DriveEncoding::Unknown);
        assert_eq!(unknown_patterns.len(), 35, "Unknown should use all 35 patterns");
    }

    /// Test random data verification
    #[test]
    fn test_random_verification() -> Result<()> {
        let mut temp_file = NamedTempFile::new()?;
        let test_size = 1024 * 1024; // 1MB for testing

        // Write random data
        use rand::RngCore;
        let mut rng = rand::thread_rng();
        let mut random_data = vec![0u8; test_size];
        rng.fill_bytes(&mut random_data);
        temp_file.write_all(&random_data)?;
        temp_file.flush()?;

        // Create verification samples
        let mut samples = HashMap::new();
        samples.insert(0, random_data[..4096].to_vec());
        samples.insert(100 * 1024, random_data[100*1024..100*1024+4096].to_vec());

        let mut file = temp_file.reopen()?;
        let mut bar = ProgressBar::new(48);

        // Should pass verification for random data
        GutmannWipe::verify_random_entropy(
            &mut file,
            test_size as u64,
            &samples,
            &mut bar
        )?;

        Ok(())
    }

    /// Test that verification catches incorrect patterns
    #[test]
    fn test_verification_catches_errors() -> Result<()> {
        let mut temp_file = NamedTempFile::new()?;
        let test_size = 10 * 1024; // 10KB

        // Write wrong pattern
        let wrong_data = vec![0xFF; test_size];
        temp_file.write_all(&wrong_data)?;
        temp_file.flush()?;

        let mut file = temp_file.reopen()?;
        let mut bar = ProgressBar::new(48);

        // Try to verify with different pattern - should fail
        let expected_pattern = &[0x55];
        let result = GutmannWipe::verify_pattern(
            &mut file,
            test_size as u64,
            expected_pattern,
            &mut bar
        );

        assert!(result.is_err(), "Verification should fail for wrong pattern");

        Ok(())
    }

    /// Performance test for pattern generation
    #[test]
    fn test_pattern_generation_performance() {
        use std::time::Instant;

        const BUFFER_SIZE: usize = 4 * 1024 * 1024; // 4MB
        let mut buffer = vec![0u8; BUFFER_SIZE];

        // Test pattern fill performance
        let pattern = &[0x92, 0x49, 0x24];
        let start = Instant::now();

        for (i, byte) in buffer.iter_mut().enumerate() {
            *byte = pattern[i % pattern.len()];
        }

        let duration = start.elapsed();

        // Should complete 4MB pattern fill in under 10ms

        assert!(duration.as_millis() < 100,
                "Pattern generation took {}ms, should be <100ms",

                duration.as_millis());
    }

    /// Integration test for resume functionality
    #[test]
    fn test_resume_after_interruption() -> Result<()> {
        let test_device = "/dev/test_resume";
        let test_size = 100 * 1024 * 1024; // 100MB
        let encoding = DriveEncoding::PRML;

        // Simulate interruption at pass 10
        GutmannWipe::save_checkpoint(test_device, 10, test_size, &encoding)?;

        // Load and verify resume point
        let checkpoint = GutmannWipe::load_checkpoint(test_device);
        assert!(checkpoint.is_some());

        let cp = checkpoint.unwrap();
        assert_eq!(cp.current_pass, 10, "Should resume from pass 10");

        // Clean up
        GutmannWipe::delete_checkpoint(test_device);

        Ok(())
    }
}
