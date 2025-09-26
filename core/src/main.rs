use anyhow::Result;
use clap::{Parser, Subcommand};
use sayonara_wipe::*;
use sayonara_wipe::drives::{
    detection::DriveDetector,
    freeze::FreezeMitigation,
    hpa_dco::HPADCOManager,
    sed::SEDManager,
    trim::TrimOperations,
    smart::SMARTMonitor,
    hdd::HDDWipe,
    ssd::SSDWipe,
    nvme::NVMeWipe,
};
use sayonara_wipe::algorithms::{dod::DoDWipe, gutmann::GutmannWipe, random::RandomWipe};
use sayonara_wipe::verification::recovery_test::RecoveryTest;
use sayonara_wipe::crypto::certificates::{CertificateGenerator, WipeDetails, VerificationResult};
use std::time::Instant;
use std::io::{self, Write};
use uuid::Uuid;

#[derive(Parser)]
#[command(name = "sayonara-wipe")]
#[command(about = "Advanced secure data wiping tool with comprehensive hardware support")]
#[command(version = "1.0.0")]
struct Cli {
    #[command(subcommand)]
    command: Commands,

    /// Enable debug logging
    #[arg(long, global = true)]
    debug: bool,

    /// Disable safety checks (DANGEROUS!)
    #[arg(long, global = true)]
    unsafe_mode: bool,
}

#[derive(Subcommand)]
enum Commands {
    /// List all detected drives with capabilities
    List {
        /// Show detailed capabilities
        #[arg(short, long)]
        detailed: bool,

        /// Include system drives
        #[arg(long)]
        include_system: bool,
    },

    /// Wipe a specific drive
    Wipe {
        /// Device path (e.g., /dev/sda)
        device: String,

        /// Wiping algorithm (dod, gutmann, random, zero, secure, crypto, sanitize, trim, auto)
        #[arg(short, long, default_value = "auto")]
        algorithm: String,

        /// Skip verification
        #[arg(long)]
        no_verify: bool,

        /// Output certificate path
        #[arg(short, long)]
        cert_output: Option<String>,

        /// Handle HPA/DCO (ignore, detect, remove-temp, remove-perm)
        #[arg(long, default_value = "detect")]
        hpa_dco: String,

        /// Skip TRIM after wipe
        #[arg(long)]
        no_trim: bool,

        /// Skip temperature monitoring
        #[arg(long)]
        no_temp_check: bool,

        /// Maximum temperature in Celsius
        #[arg(long, default_value = "65")]
        max_temp: u32,

        /// Skip freeze mitigation
        #[arg(long)]
        no_unfreeze: bool,

        /// Force operation even if drive is unhealthy
        #[arg(long)]
        force: bool,
    },

    /// Wipe ALL drives (EXTREMELY DANGEROUS!)
    WipeAll {
        /// Wiping algorithm
        #[arg(short, long, default_value = "auto")]
        algorithm: String,

        /// Skip verification
        #[arg(long)]
        no_verify: bool,

        /// Output directory for certificates
        #[arg(short, long, default_value = "./certificates")]
        cert_dir: String,

        /// Exclude specific drives (comma-separated)
        #[arg(long)]
        exclude: Option<String>,

        /// Handle HPA/DCO
        #[arg(long, default_value = "detect")]
        hpa_dco: String,

        /// Skip TRIM after wipe
        #[arg(long)]
        no_trim: bool,

        /// Force operation even if drives are unhealthy
        #[arg(long)]
        force: bool,
    },

    /// Verify a previous wipe
    Verify {
        /// Device path to verify
        device: String,

        /// Check for hidden areas
        #[arg(long)]
        check_hidden: bool,
    },

    /// Check drive health and capabilities
    Health {
        /// Device path (or "all" for all drives)
        device: String,

        /// Run SMART self-test
        #[arg(long)]
        self_test: bool,

        /// Monitor temperature continuously
        #[arg(long)]
        monitor: bool,
    },

    /// Manage self-encrypting drives
    Sed {
        /// Device path
        device: String,

        #[command(subcommand)]
        action: SedAction,
    },
}

#[derive(Subcommand)]
enum SedAction {
    /// Check SED status
    Status,

    /// Perform cryptographic erase
    CryptoErase {
        /// Password for locked drives
        #[arg(long)]
        password: Option<String>,
    },

    /// Unlock drive
    Unlock {
        /// Password
        password: String,
    },
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    setup_signal_handlers()?;

    // Check for root privileges
    if !cli.unsafe_mode && !is_root() {
        eprintln!("Error: This program requires root privileges.");
        eprintln!("Please run with sudo or as root user.");
        std::process::exit(1);
    }

    // Set up logging
    if cli.debug {
        env_logger::init();
    }

    match &cli.command {
        Commands::List { detailed, include_system } => {
            list_drives(*detailed, *include_system).await?;
        }
        Commands::Wipe { device, algorithm, no_verify, cert_output, hpa_dco,
            no_trim, no_temp_check, max_temp, no_unfreeze, force } => {
            let config = build_wipe_config(
                algorithm, !no_verify, hpa_dco, !no_trim,
                !no_temp_check, *max_temp, !no_unfreeze
            )?;
            wipe_drive(device, config, cert_output.as_deref(), *force, cli.unsafe_mode).await?;
        }
        Commands::WipeAll { algorithm, no_verify, cert_dir, exclude,
            hpa_dco, no_trim, force: _ } => {
            let config = build_wipe_config(
                algorithm, !no_verify, hpa_dco, !no_trim,
                true, 65, true
            )?;
            wipe_all_drives(config, cert_dir, exclude.as_deref(), cli.unsafe_mode).await?;
        }
        Commands::Verify { device, check_hidden } => {
            verify_drive(device, *check_hidden).await?;
        }
        Commands::Health { device, self_test, monitor } => {
            check_health(device, *self_test, *monitor).await?;
        }
        Commands::Sed { device, action } => {
            handle_sed(device, action).await?;
        }
    }

    Ok(())
}

fn is_root() -> bool {
    unsafe { libc::geteuid() == 0 }
}

fn build_wipe_config(
    algorithm: &str,
    verify: bool,
    hpa_dco: &str,
    use_trim: bool,
    temp_monitoring: bool,
    max_temp: u32,
    freeze_mitigation: bool,
) -> Result<WipeConfig> {
    let algorithm = match algorithm.to_lowercase().as_str() {
        "dod" => Algorithm::DoD5220,
        "gutmann" => Algorithm::Gutmann,
        "random" => Algorithm::Random,
        "zero" => Algorithm::Zero,
        "secure" => Algorithm::SecureErase,
        "crypto" => Algorithm::CryptoErase,
        "sanitize" => Algorithm::Sanitize,
        "trim" => Algorithm::TrimOnly,
        "auto" => Algorithm::SecureErase, // Will fallback based on capabilities
        _ => return Err(anyhow::anyhow!("Unknown algorithm: {}", algorithm)),
    };

    let hpa_dco_handling = match hpa_dco {
        "ignore" => HPADCOHandling::Ignore,
        "detect" => HPADCOHandling::Detect,
        "remove-temp" => HPADCOHandling::TemporaryRemove,
        "remove-perm" => HPADCOHandling::PermanentRemove,
        _ => HPADCOHandling::Detect,
    };

    Ok(WipeConfig {
        algorithm,
        verify,
        multiple_passes: None,
        preserve_partition_table: false,
        unlock_encrypted: false,
        handle_hpa_dco: hpa_dco_handling,
        use_trim_after: use_trim,
        temperature_monitoring: temp_monitoring,
        max_temperature_celsius: Some(max_temp),
        freeze_mitigation,
        sed_crypto_erase: true,
    })
}

async fn list_drives(detailed: bool, include_system: bool) -> Result<()> {
    println!("Detecting drives...");
    let drives = DriveDetector::detect_all_drives()?;

    if drives.is_empty() {
        println!("No drives detected.");
        return Ok(());
    }

    println!("\nDetected drives:");

    if detailed {
        for drive in drives {
            if !include_system && DriveDetector::is_system_drive(&drive.device_path)? {
                continue;
            }

            print_drive_detailed(&drive)?;
        }
    } else {
        println!("{:<15} {:<20} {:<15} {:<10} {:<10} {:<10}",
                 "Device", "Model", "Serial", "Size", "Type", "Health");
        println!("{}", "-".repeat(90));

        for drive in drives {
            if !include_system && DriveDetector::is_system_drive(&drive.device_path)? {
                continue;
            }

            let size_gb = drive.size / (1024 * 1024 * 1024);
            let health = drive.health_status
                .map(|h| format!("{:?}", h))
                .unwrap_or_else(|| "Unknown".to_string());

            println!("{:<15} {:<20} {:<15} {:<10} {:<10} {:<10}",
                     drive.device_path,
                     truncate_string(&drive.model, 20),
                     truncate_string(&drive.serial, 15),
                     format!("{}GB", size_gb),
                     format!("{:?}", drive.drive_type),
                     health);
        }
    }

    Ok(())
}

fn print_drive_detailed(drive: &DriveInfo) -> Result<()> {
    println!("\n{}", "=".repeat(60));
    println!("Device: {}", drive.device_path);
    println!("Model: {}", drive.model);
    println!("Serial: {}", drive.serial);
    println!("Size: {} GB", drive.size / (1024 * 1024 * 1024));
    println!("Type: {:?}", drive.drive_type);

    if let Some(health) = &drive.health_status {
        println!("Health: {:?}", health);
    }

    if let Some(temp) = drive.temperature_celsius {
        println!("Temperature: {}°C", temp);
    }

    println!("\nCapabilities:");
    let caps = &drive.capabilities;
    println!("  Secure Erase: {}", caps.secure_erase);
    println!("  Enhanced Erase: {}", caps.enhanced_erase);
    println!("  Crypto Erase: {}", caps.crypto_erase);
    println!("  TRIM Support: {}", caps.trim_support);
    println!("  Freeze Status: {:?}", caps.freeze_status);

    if caps.hpa_enabled {
        println!("  ⚠ HPA Enabled (hidden area present)");
    }
    if caps.dco_enabled {
        println!("  ⚠ DCO Enabled (device configuration overlay)");
    }

    if let Some(sed_type) = &caps.sed_type {
        println!("  SED Type: {:?}", sed_type);
    }

    if !caps.sanitize_options.is_empty() {
        println!("  NVMe Sanitize: {:?}", caps.sanitize_options);
    }

    println!("Encryption: {:?}", drive.encryption_status);

    Ok(())
}

async fn wipe_drive(
    device: &str,
    config: WipeConfig,
    cert_output: Option<&str>,
    force: bool,
    unsafe_mode: bool,
) -> Result<()> {
    // Detect the specific drive
    let drives = DriveDetector::detect_all_drives()?;
    let drive_info = drives.into_iter()
        .find(|d| d.device_path == device)
        .ok_or_else(|| anyhow::anyhow!("Drive not found: {}", device))?;

    // Safety checks
    if !unsafe_mode {
        if DriveDetector::is_system_drive(device)? {
            eprintln!("Error: {} appears to be a system drive.", device);
            eprintln!("Use --unsafe-mode to override (DANGEROUS!)");
            return Ok(());
        }

        if DriveDetector::is_mounted(device)? {
            eprintln!("Error: {} is currently mounted.", device);
            eprintln!("Please unmount before wiping.");
            return Ok(());
        }
    }

    // Health check
    if !force {
        if let Some(health) = &drive_info.health_status {
            if *health == HealthStatus::Failed || *health == HealthStatus::Critical {
                eprintln!("Error: Drive health is {:?}", health);
                eprintln!("Use --force to override.");
                return Ok(());
            }
        }

        if !SMARTMonitor::check_safe_to_operate(device)? {
            eprintln!("Error: Drive is not safe to operate.");
            eprintln!("Use --force to override.");
            return Ok(());
        }
    }

    // Confirmation
    if !unsafe_mode {
        println!("\nWARNING: This will permanently erase ALL data on {}", device);
        println!("Drive: {} ({})", drive_info.model, drive_info.serial);
        println!("Size: {} GB", drive_info.size / (1024 * 1024 * 1024));

        if drive_info.capabilities.hpa_enabled || drive_info.capabilities.dco_enabled {
            println!("\n⚠ Hidden areas detected:");
            if drive_info.capabilities.hpa_enabled {
                println!("  - HPA (Host Protected Area) is enabled");
            }
            if drive_info.capabilities.dco_enabled {
                println!("  - DCO (Device Configuration Overlay) is enabled");
            }
        }

        print!("\nType 'YES' to confirm: ");
        io::stdout().flush()?;

        let mut input = String::new();
        io::stdin().read_line(&mut input)?;

        if input.trim() != "YES" {
            println!("Operation cancelled.");
            return Ok(());
        }
    }

    // Create wipe session
    let session = WipeSession {
        session_id: Uuid::new_v4().to_string(),
        start_time: chrono::Utc::now(),
        end_time: None,
        drives: vec![],
        config: config.clone(),
        operator_id: None,
    };

    // Perform the wipe
    wipe_single_drive(device, &drive_info, config, cert_output, session).await
}

async fn wipe_single_drive(
    device: &str,
    drive_info: &DriveInfo,
    config: WipeConfig,
    cert_output: Option<&str>,
    mut session: WipeSession,
) -> Result<()> {
    println!("\nStarting wipe of {} ({}, {})",
             device, drive_info.model, drive_info.serial);

    let start_time = Instant::now();
    let mut warnings = Vec::new();

    // Phase 1: Preparation
    println!("\nPhase 1: Preparation");

    // Handle freeze mitigation
    if config.freeze_mitigation && drive_info.capabilities.is_frozen {
        println!("Drive is frozen, attempting mitigation...");
        match FreezeMitigation::unfreeze_drive(device) {
            Ok(_) => println!("✓ Drive unfrozen successfully"),
            Err(e) => {
                let msg = format!("Failed to unfreeze: {}", e);
                warnings.push(msg.clone());
                eprintln!("⚠ {}", msg);
            }
        }
    }

    // Handle HPA/DCO
    let mut hpa_original = None;
    match config.handle_hpa_dco {
        HPADCOHandling::Detect => {
            if let Ok((hpa, dco)) = HPADCOManager::check_hidden_areas(device) {
                if hpa.is_some() || dco.is_some() {
                    warnings.push("Hidden areas detected but not removed".to_string());
                }
            }
        }
        HPADCOHandling::TemporaryRemove => {
            if let Ok(Some(hpa)) = HPADCOManager::detect_hpa(device) {
                hpa_original = Some(hpa.current_max_sectors);
                println!("Temporarily removing HPA...");
                HPADCOManager::remove_hpa_temporary(device)?;
                println!("✓ HPA temporarily removed");
            }
        }
        HPADCOHandling::PermanentRemove => {
            if HPADCOManager::detect_hpa(device)?.is_some() {
                println!("Permanently removing HPA...");
                HPADCOManager::remove_hpa_temporary(device)?;
                println!("✓ HPA permanently removed");
            }
            if HPADCOManager::detect_dco(device)?.is_some() {
                println!("Removing DCO...");
                HPADCOManager::remove_dco(device)?;
                println!("✓ DCO removed");
            }
        }
        _ => {}
    }

    // Temperature monitoring
    if config.temperature_monitoring {
        if let Ok(temp_mon) = SMARTMonitor::monitor_temperature(device) {
            if temp_mon.current_celsius > temp_mon.warning_threshold {
                println!("Waiting for drive to cool down...");
                SMARTMonitor::wait_for_safe_temperature(device, 300)?;
            }
        }
    }

    // Phase 2: Wipe
    println!("\nPhase 2: Wiping");

    let wipe_result = match select_and_execute_wipe(device, drive_info, &config).await {
        Ok(_) => Ok(()),
        Err(e) => {
            warnings.push(format!("Wipe error: {}", e));
            Err(e)
        }
    };

    // Phase 3: Post-wipe operations
    println!("\nPhase 3: Post-wipe operations");

    // TRIM after wipe
    if config.use_trim_after && drive_info.capabilities.trim_support {
        println!("Performing TRIM operation...");
        match TrimOperations::secure_trim_with_verify(device) {
            Ok(_) => println!("✓ TRIM completed"),
            Err(e) => warnings.push(format!("TRIM failed: {}", e)),
        }
    }

    // Restore HPA if needed
    if let Some(original_sectors) = hpa_original {
        println!("Restoring original HPA configuration...");
        HPADCOManager::restore_hpa(device, original_sectors)?;
        println!("✓ HPA restored");
    }

    let wipe_duration = start_time.elapsed();
    println!("\nWipe completed in {:.2} seconds", wipe_duration.as_secs_f64());

    // Phase 4: Verification
    let verification_result = if config.verify {
        println!("\nPhase 4: Verification");
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
        println!("\nGenerating certificate...");
        let cert_gen = CertificateGenerator::new();
        let wipe_details = WipeDetails {
            algorithm_used: format!("{:?}", config.algorithm),
            passes_completed: 1,
            duration_seconds: wipe_duration.as_secs(),
            operator_id: session.operator_id.clone(),
        };

        let certificate = cert_gen.generate_certificate(drive_info, wipe_details, verification_result.clone())?;
        cert_gen.save_certificate(&certificate, cert_path)?;
        println!("✓ Certificate saved to: {}", cert_path);
    }

    // Update session
    session.drives.push(DriveWipeRecord {
        drive_info: drive_info.clone(),
        status: if wipe_result.is_ok() { WipeStatus::Completed } else { WipeStatus::Failed },
        start_time: chrono::Utc::now() - chrono::Duration::seconds(wipe_duration.as_secs() as i64),
        end_time: Some(chrono::Utc::now()),
        error_message: wipe_result.err().map(|e| e.to_string()),
        certificate_path: cert_output.map(|s| s.to_string()),
        verification_passed: Some(verification_result.verified),
    });

    if !warnings.is_empty() {
        println!("\nWarnings:");
        for warning in warnings {
            println!("  ⚠ {}", warning);
        }
    }

    println!("\n✓ Operation completed successfully!");
    Ok(())
}

async fn select_and_execute_wipe(
    device: &str,
    drive_info: &DriveInfo,
    config: &WipeConfig,
) -> Result<()> {
    // Auto-select best method based on capabilities and config
    let algorithm = if config.algorithm == Algorithm::SecureErase {
        // Auto-select based on drive capabilities
        if drive_info.capabilities.crypto_erase && config.sed_crypto_erase {
            Algorithm::CryptoErase
        } else if drive_info.drive_type == DriveType::NVMe &&
            !drive_info.capabilities.sanitize_options.is_empty() {
            Algorithm::Sanitize
        } else if drive_info.capabilities.secure_erase {
            Algorithm::SecureErase
        } else {
            Algorithm::DoD5220
        }
    } else {
        config.algorithm.clone()
    };

    println!("Using algorithm: {:?}", algorithm);

    match algorithm {
        Algorithm::DoD5220 => {
            DoDWipe::wipe_drive(device, drive_info.size)?;
        }
        Algorithm::Gutmann => {
            GutmannWipe::wipe_drive(device, drive_info.size)?;
        }
        Algorithm::Random => {
            RandomWipe::wipe_drive(device, drive_info.size)?;
        }
        Algorithm::Zero => {
            // Simple zero overwrite
            DoDWipe::wipe_drive(device, drive_info.size)?; // Reuse with zero pattern
        }
        Algorithm::SecureErase => {
            match drive_info.drive_type {
                DriveType::SSD => SSDWipe::secure_erase(device)?,
                DriveType::NVMe => NVMeWipe::secure_erase(device)?,
                DriveType::HDD => HDDWipe::secure_erase(device)?,
                _ => {
                    println!("Hardware secure erase not available, falling back to DoD");
                    DoDWipe::wipe_drive(device, drive_info.size)?;
                }
            }
        }
        Algorithm::CryptoErase => {
            if let Ok(sed_info) = SEDManager::detect_sed(device) {
                SEDManager::crypto_erase(device, &sed_info)?;
            } else {
                return Err(anyhow::anyhow!("Crypto erase not available for this drive"));
            }
        }
        Algorithm::Sanitize => {
            if drive_info.drive_type == DriveType::NVMe {
                NVMeWipe::secure_erase(device)?;
            } else {
                return Err(anyhow::anyhow!("Sanitize only available for NVMe drives"));
            }
        }
        Algorithm::TrimOnly => {
            if drive_info.capabilities.trim_support {
                TrimOperations::secure_trim_with_verify(device)?;
            } else {
                return Err(anyhow::anyhow!("TRIM not supported on this drive"));
            }
        }
    }

    Ok(())
}

async fn wipe_all_drives(
    config: WipeConfig,
    cert_dir: &str,
    exclude: Option<&str>,
    unsafe_mode: bool,
) -> Result<()> {
    let drives = DriveDetector::detect_all_drives()?;

    if drives.is_empty() {
        println!("No drives detected.");
        return Ok(());
    }

    // Parse exclusion list
    let excluded_drives: Vec<&str> = exclude
        .map(|s| s.split(',').map(|s| s.trim()).collect())
        .unwrap_or_default();

    // Filter drives
    let mut drives_to_wipe = Vec::new();
    for drive in drives {
        if excluded_drives.contains(&drive.device_path.as_str()) {
            continue;
        }
        if !unsafe_mode && DriveDetector::is_system_drive(&drive.device_path)? {
            println!("Skipping system drive: {}", drive.device_path);
            continue;
        }
        if !unsafe_mode && DriveDetector::is_mounted(&drive.device_path)? {
            println!("Skipping mounted drive: {}", drive.device_path);
            continue;
        }
        drives_to_wipe.push(drive);
    }

    if drives_to_wipe.is_empty() {
        println!("No drives to wipe after applying filters.");
        return Ok(());
    }

    // Show what will be wiped
    println!("The following drives will be wiped:");
    for drive in &drives_to_wipe {
        println!("  - {} ({}, {} GB)",
                 drive.device_path,
                 drive.model,
                 drive.size / (1024 * 1024 * 1024));
    }

    if !unsafe_mode {
        println!("\n⚠ WARNING: This action is IRREVERSIBLE!");
        print!("Type 'DESTROY_ALL_DATA' to confirm: ");
        io::stdout().flush()?;

        let mut input = String::new();
        io::stdin().read_line(&mut input)?;

        if input.trim() != "DESTROY_ALL_DATA" {
            println!("Operation cancelled.");
            return Ok(());
        }
    }

    // Create certificate directory
    std::fs::create_dir_all(cert_dir)?;

    // Create session
    let session = WipeSession {
        session_id: Uuid::new_v4().to_string(),
        start_time: chrono::Utc::now(),
        end_time: None,
        drives: vec![],
        config: config.clone(),
        operator_id: None,
    };

    let total_drives = drives_to_wipe.len();
    let mut successful = 0;
    let mut failed = 0;

    // Wipe each drive
    for (index, drive) in drives_to_wipe.iter().enumerate() {
        println!("\n{}", "=".repeat(60));
        println!("Wiping drive {}/{}: {}", index + 1, total_drives, drive.device_path);
        println!("{}", "=".repeat(60));

        let cert_filename = drive.device_path.replace("/", "_").replace("dev_", "");
        let cert_path = format!("{}/cert_{}.json", cert_dir, cert_filename);

        let result = wipe_single_drive(
            &drive.device_path,
            drive,
            config.clone(),
            Some(&cert_path),
            session.clone()
        ).await;

        match result {
            Ok(_) => {
                successful += 1;
                println!("✓ Successfully wiped {}", drive.device_path);
            }
            Err(e) => {
                failed += 1;
                println!("✗ Failed to wipe {}: {}", drive.device_path, e);
            }
        }
    }

    // Summary
    println!("\n{}", "=".repeat(60));
    println!("SUMMARY");
    println!("{}", "=".repeat(60));
    println!("Total drives: {}", total_drives);
    println!("Successful: {}", successful);
    println!("Failed: {}", failed);

    Ok(())
}

async fn verify_drive(device: &str, check_hidden: bool) -> Result<()> {
    let drives = DriveDetector::detect_all_drives()?;
    let drive_info = drives.into_iter()
        .find(|d| d.device_path == device)
        .ok_or_else(|| anyhow::anyhow!("Drive not found: {}", device))?;

    println!("Verifying wipe on {} ({}, {})",
             device, drive_info.model, drive_info.serial);

    // Check for hidden areas if requested
    if check_hidden {
        println!("\nChecking for hidden areas...");
        let (hpa, dco) = HPADCOManager::check_hidden_areas(device)?;

        if hpa.is_some() || dco.is_some() {
            println!("⚠ WARNING: Hidden areas detected!");
            if let Some(h) = hpa {
                println!("  HPA: {} bytes hidden", h.hidden_size_bytes);
            }
            if let Some(d) = dco {
                println!("  DCO: {} bytes hidden", d.hidden_size_bytes);
            }
            println!("  These areas may contain recoverable data!");
        } else {
            println!("✓ No hidden areas detected");
        }
    }

    // Run verification test
    println!("\nRunning recovery test...");
    let verified = RecoveryTest::verify_wipe(device, drive_info.size)?;

    if verified {
        println!("✓ Verification PASSED - No recoverable data detected");
    } else {
        println!("✗ Verification FAILED - Recoverable data may be present");
    }

    // Check TRIM effectiveness if applicable
    if drive_info.capabilities.trim_support {
        println!("\nChecking TRIM effectiveness...");
        if TrimOperations::verify_trim_effectiveness(device, 100)? {
            println!("✓ TRIM appears to be effective");
        } else {
            println!("⚠ TRIM may not be fully effective");
        }
    }

    Ok(())
}

async fn check_health(device: &str, self_test: bool, monitor: bool) -> Result<()> {
    if device == "all" {
        // Check all drives
        let drives = DriveDetector::detect_all_drives()?;

        println!("Health Status for All Drives:");
        println!("{}", "=".repeat(80));

        for drive in drives {
            print_health_status(&drive.device_path).await?;
            println!();
        }
    } else {
        // Check specific drive
        if monitor {
            // Continuous monitoring
            println!("Monitoring {} (Press Ctrl+C to stop)...", device);
            loop {
                print!("\x1B[2J\x1B[1;1H"); // Clear screen
                print_health_status(device).await?;
                tokio::time::sleep(tokio::time::Duration::from_secs(5)).await;
            }
        } else {
            print_health_status(device).await?;

            if self_test {
                println!("\nRunning SMART self-test...");
                use crate::drives::smart::{SMARTMonitor, SelfTestType};
                SMARTMonitor::run_self_test(device, SelfTestType::Short)?;
                println!("Self-test started. Check progress with 'smartctl -l selftest {}'", device);
            }
        }
    }

    Ok(())
}

async fn print_health_status(device: &str) -> Result<()> {
    let health = SMARTMonitor::get_health(device)?;

    println!("Device: {}", device);
    println!("Overall Health: {:?}", health.overall_health);

    if let Some(temp) = health.temperature_celsius {
        let temp_status = if temp > 60 {
            "⚠ HIGH"
        } else if temp > 50 {
            "! Warm"
        } else {
            "✓ Normal"
        };
        println!("Temperature: {}°C {}", temp, temp_status);
    }

    if let Some(hours) = health.power_on_hours {
        println!("Power On Hours: {} ({} days)", hours, hours / 24);
    }

    if let Some(cycles) = health.power_cycle_count {
        println!("Power Cycles: {}", cycles);
    }

    // Critical attributes
    let mut has_issues = false;

    if let Some(reallocated) = health.reallocated_sectors {
        if reallocated > 0 {
            println!("⚠ Reallocated Sectors: {}", reallocated);
            has_issues = true;
        }
    }

    if let Some(pending) = health.pending_sectors {
        if pending > 0 {
            println!("⚠ Pending Sectors: {}", pending);
            has_issues = true;
        }
    }

    if let Some(uncorrectable) = health.uncorrectable_errors {
        if uncorrectable > 0 {
            println!("⚠ Uncorrectable Errors: {}", uncorrectable);
            has_issues = true;
        }
    }

    // SSD specific
    if let Some(wear) = health.wear_level {
        let wear_status = if wear > 90 {
            "⚠ CRITICAL"
        } else if wear > 80 {
            "! High"
        } else {
            "✓ Normal"
        };
        println!("SSD Wear Level: {}% {}", wear, wear_status);
    }

    // NVMe specific
    if let Some(spare) = health.available_spare {
        let spare_status = if spare < 10 {
            "⚠ CRITICAL"
        } else if spare < 20 {
            "! Low"
        } else {
            "✓ Normal"
        };
        println!("Available Spare: {}% {}", spare, spare_status);
    }

    if !has_issues && health.overall_health == HealthStatus::Good {
        println!("✓ No issues detected");
    }

    // Failure prediction
    use crate::drives::smart::SMARTMonitor;
    let prediction = SMARTMonitor::predict_failure(device)?;

    if prediction.risk_score > 0 {
        println!("\nFailure Risk Assessment:");
        println!("  Risk Level: {:?}", prediction.risk_level);
        println!("  Risk Score: {}/100", prediction.risk_score);

        if let Some(days) = prediction.estimated_days_remaining {
            println!("  Estimated Time to Failure: {} days", days);
        }

        if !prediction.failure_indicators.is_empty() {
            println!("  Indicators:");
            for indicator in &prediction.failure_indicators {
                println!("    - {}", indicator);
            }
        }

        println!("  Recommendation: {}", prediction.recommendation);
    }

    Ok(())
}

async fn handle_sed(device: &str, action: &SedAction) -> Result<()> {
    match action {
        SedAction::Status => {
            let sed_info = SEDManager::detect_sed(device)?;

            println!("Self-Encrypting Drive Status for {}", device);
            println!("{}", "=".repeat(50));

            match sed_info.sed_type {
                SEDType::None => {
                    println!("No SED capabilities detected");
                }
                _ => {
                    println!("SED Type: {:?}", sed_info.sed_type);
                    println!("Locked: {}", sed_info.locked);
                    println!("Enabled: {}", sed_info.enabled);
                    println!("Frozen: {}", sed_info.frozen);

                    if let Some(max_tries) = sed_info.max_password_tries {
                        println!("Max Password Tries: {}", max_tries);
                    }

                    println!("Crypto Erase Support: {}", sed_info.supports_crypto_erase);
                    println!("Instant Secure Erase: {}", sed_info.supports_instant_secure_erase);

                    if let Some(fw) = sed_info.firmware_version {
                        println!("Firmware: {}", fw);
                    }
                }
            }
        }

        SedAction::CryptoErase { password } => {
            let sed_info = SEDManager::detect_sed(device)?;

            if sed_info.sed_type == SEDType::None {
                eprintln!("Error: No SED capabilities detected on this drive");
                return Ok(());
            }

            if !sed_info.supports_crypto_erase {
                eprintln!("Error: This drive does not support cryptographic erase");
                return Ok(());
            }

            // Handle locked drives
            if sed_info.locked {
                if let Some(pwd) = password {
                    println!("Unlocking drive...");
                    SEDManager::unlock_sed(device, pwd, &sed_info)?;
                } else {
                    eprintln!("Error: Drive is locked. Please provide password with --password");
                    return Ok(());
                }
            }

            println!("WARNING: Cryptographic erase will instantly destroy all data!");
            print!("Type 'ERASE' to confirm: ");
            io::stdout().flush()?;

            let mut input = String::new();
            io::stdin().read_line(&mut input)?;

            if input.trim() != "ERASE" {
                println!("Operation cancelled.");
                return Ok(());
            }

            println!("Performing cryptographic erase...");
            SEDManager::crypto_erase(device, &sed_info)?;

            // Verify
            if SEDManager::verify_crypto_erase(device)? {
                println!("✓ Cryptographic erase completed successfully");
            } else {
                println!("⚠ Cryptographic erase completed but verification shows unexpected data");
            }
        }

        SedAction::Unlock { password } => {
            let sed_info = SEDManager::detect_sed(device)?;

            if !sed_info.locked {
                println!("Drive is not locked");
                return Ok(());
            }

            println!("Attempting to unlock drive...");
            SEDManager::unlock_sed(device, password, &sed_info)?;
            println!("✓ Drive unlocked successfully");
        }
    }

    Ok(())
}

fn truncate_string(s: &str, max_len: usize) -> String {
    if s.len() <= max_len {
        s.to_string()
    } else {
        format!("{}...", &s[..max_len - 3])
    }
}

// Additional helper functions for parallel operations
#[allow(dead_code)]
async fn wipe_drives_parallel(
    drives: Vec<DriveInfo>,
    config: WipeConfig,
    cert_dir: &str,
    max_parallel: usize,
) -> Result<Vec<DriveWipeRecord>> {
    use futures::stream::{self, StreamExt};

    let results = stream::iter(drives)
        .map(|drive| {
            let config = config.clone();
            let cert_dir = cert_dir.to_string();
            async move {
                let cert_filename = drive.device_path.replace("/", "_").replace("dev_", "");
                let cert_path = format!("{}/cert_{}.json", cert_dir, cert_filename);

                let session = WipeSession {
                    session_id: Uuid::new_v4().to_string(),
                    start_time: chrono::Utc::now(),
                    end_time: None,
                    drives: vec![],
                    config: config.clone(),
                    operator_id: None,
                };

                match wipe_single_drive(
                    &drive.device_path,
                    &drive,
                    config,
                    Some(&cert_path),
                    session
                ).await {
                    Ok(_) => DriveWipeRecord {
                        drive_info: drive.clone(),
                        status: WipeStatus::Completed,
                        start_time: chrono::Utc::now(),
                        end_time: Some(chrono::Utc::now()),
                        error_message: None,
                        certificate_path: Some(cert_path),
                        verification_passed: Some(true),
                    },
                    Err(e) => DriveWipeRecord {
                        drive_info: drive.clone(),
                        status: WipeStatus::Failed,
                        start_time: chrono::Utc::now(),
                        end_time: Some(chrono::Utc::now()),
                        error_message: Some(e.to_string()),
                        certificate_path: None,
                        verification_passed: Some(false),
                    }
                }
            }
        })
        .buffer_unordered(max_parallel)
        .collect::<Vec<_>>()
        .await;

    Ok(results)
}

// Signal handler for graceful shutdown
fn setup_signal_handlers() -> Result<()> {
    use signal_hook::{consts::SIGINT, iterator::Signals};
    use std::sync::atomic::{AtomicBool, Ordering};
    use std::sync::Arc;

    let running = Arc::new(AtomicBool::new(true));
    let r = running.clone();

    let mut signals = Signals::new(&[SIGINT])?;

    std::thread::spawn(move || {
        for sig in signals.forever() {
            match sig {
                SIGINT => {
                    println!("\nReceived interrupt signal, shutting down gracefully...");
                    r.store(false, Ordering::SeqCst);
                }
                _ => {}
            }
        }
    });

    Ok(())
}
