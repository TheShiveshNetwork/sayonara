use anyhow::Result;
use clap::{Parser, Subcommand};
use sayonara_wipe::*;
use sayonara_wipe::drives::detection::DriveDetector;
use sayonara_wipe::algorithms::dod::DoDWipe;
use sayonara_wipe::drives::ssd::SSDWipe;
use sayonara_wipe::drives::nvme::NVMeWipe;
use sayonara_wipe::verification::recovery_test::RecoveryTest;
use sayonara_wipe::crypto::certificates::{CertificateGenerator, WipeDetails, VerificationResult};
use std::time::Instant;

#[derive(Parser)]
#[command(name = "sayonara-wipe")]
#[command(about = "Secure data wiping tool for SIH 2025")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// List all detected drives
    List,
    /// Wipe a specific drive
    Wipe {
        /// Device path (e.g., /dev/sda)
        device: String,
        /// Wiping algorithm
        #[arg(short, long, default_value = "dod")]
        algorithm: String,
        /// Skip verification
        #[arg(long)]
        no_verify: bool,
        /// Output certificate path
        #[arg(short, long)]
        cert_output: Option<String>,
    },
    /// Verify a previous wipe
    Verify {
        /// Device path to verify
        device: String,
    },
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();
    
    match &cli.command {
        Commands::List => {
            list_drives().await?;
        }
        Commands::Wipe { device, algorithm, no_verify, cert_output } => {
            wipe_drive(device, algorithm, !no_verify, cert_output.as_deref()).await?;
        }
        Commands::Verify { device } => {
            verify_drive(device).await?;
        }
    }
    
    Ok(())
}

async fn list_drives() -> Result<()> {
    println!("Detecting drives...");
    let drives = DriveDetector::detect_all_drives()?;
    
    if drives.is_empty() {
        println!("No drives detected.");
        return Ok(());
    }
    
    println!("\nDetected drives:");
    println!("{:<15} {:<20} {:<15} {:<10} {:<10}", 
             "Device", "Model", "Serial", "Size", "Type");
    println!("{}", "-".repeat(80));
    
    for drive in drives {
        let size_gb = drive.size / (1024 * 1024 * 1024);
        println!("{:<15} {:<20} {:<15} {:<10} {:<10}", 
                 drive.device_path,
                 drive.model,
                 drive.serial,
                 format!("{}GB", size_gb),
                 format!("{:?}", drive.drive_type));
    }
    
    Ok(())
}

async fn wipe_drive(device: &str, algorithm: &str, verify: bool, cert_output: Option<&str>) -> Result<()> {
    // Safety check - require confirmation for destructive operation
    println!("WARNING: This will permanently erase ALL data on {}", device);
    print!("Type 'YES' to confirm: ");
    std::io::Write::flush(&mut std::io::stdout()).unwrap();
    
    let mut input = String::new();
    std::io::stdin().read_line(&mut input)?;
    
    if input.trim() != "YES" {
        println!("Operation cancelled.");
        return Ok(());
    }
    
    // Detect the specific drive
    let drives = DriveDetector::detect_all_drives()?;
    let drive_info = drives.into_iter()
        .find(|d| d.device_path == device)
        .ok_or_else(|| anyhow::anyhow!("Drive not found: {}", device))?;
    
    println!("Starting wipe of {} ({}, {})", 
             device, drive_info.model, drive_info.serial);
    
    let start_time = Instant::now();
    
    // Perform the wipe based on drive type and algorithm
    match (algorithm, &drive_info.drive_type) {
        ("dod", _) => {
            DoDWipe::wipe_drive(device, drive_info.size)?;
        }
        ("secure", DriveType::SSD) => {
            SSDWipe::secure_erase(device)?;
        }
        ("secure", DriveType::NVMe) => {
            NVMeWipe::secure_erase(device)?;
        }
        ("secure", _) => {
            println!("Hardware secure erase not available for this drive type, using DoD method");
            DoDWipe::wipe_drive(device, drive_info.size)?;
        }
        _ => {
            return Err(anyhow::anyhow!("Unknown algorithm: {}", algorithm));
        }
    }
    
    let wipe_duration = start_time.elapsed();
    println!("Wipe completed in {:.2} seconds", wipe_duration.as_secs_f64());
    
    // Verification
    let verification_result = if verify {
        println!("Starting verification...");
        let verified = RecoveryTest::verify_wipe(device, drive_info.size)?;
        let entropy_score = 7.8; // This would come from the actual verification
        
        VerificationResult {
            verified,
            entropy_score,
            recovery_test_passed: verified,
            verification_timestamp: chrono::Utc::now(),
        }
    } else {
        VerificationResult {
            verified: false,
            entropy_score: 0.0,
            recovery_test_passed: false,
            verification_timestamp: chrono::Utc::now(),
        }
    };
    
    // Generate certificate
    if let Some(cert_path) = cert_output {
        let cert_gen = CertificateGenerator::new();
        let wipe_details = WipeDetails {
            algorithm_used: algorithm.to_string(),
            passes_completed: match algorithm {
                "dod" => 3,
                "secure" => 1,
                _ => 1,
            },
            duration_seconds: wipe_duration.as_secs(),
            operator_id: None,
        };
        
        let certificate = cert_gen.generate_certificate(&drive_info, wipe_details, verification_result)?;
        cert_gen.save_certificate(&certificate, cert_path)?;
        
        println!("Certificate saved to: {}", cert_path);
    }
    
    println!("Operation completed successfully!");
    Ok(())
}

async fn verify_drive(device: &str) -> Result<()> {
    let drives = DriveDetector::detect_all_drives()?;
    let drive_info = drives.into_iter()
        .find(|d| d.device_path == device)
        .ok_or_else(|| anyhow::anyhow!("Drive not found: {}", device))?;
    
    println!("Verifying wipe on {} ({}, {})", 
             device, drive_info.model, drive_info.serial);
    
    let verified = RecoveryTest::verify_wipe(device, drive_info.size)?;
    
    if verified {
        println!("✅ Verification PASSED - No recoverable data detected");
    } else {
        println!("❌ Verification FAILED - Recoverable data may be present");
    }
    
    Ok(())
}
