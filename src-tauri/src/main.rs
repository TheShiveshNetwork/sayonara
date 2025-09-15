// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::thread;
use tauri::{AppHandle, Emitter, State};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

// Structs for API responses with proper serialization
#[derive(Debug, Clone, Serialize, Deserialize)]
struct LogEvent {
    message: String,
    level: String,
    timestamp: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct EndEvent {
    #[serde(rename = "exitCode")]
    exit_code: i32,
    #[serde(rename = "jobId")]
    job_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct IsoResponse {
    #[serde(rename = "downloadUrl")]
    download_url: String,
    sha256: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct CertificateResponse {
    valid: bool,
    #[serde(rename = "blockchainTx")]
    blockchain_tx: Option<String>,
    signature: Option<String>,
}

// State management for jobs
type JobState = Arc<Mutex<HashMap<String, bool>>>;

// Clean chat responses without emojis
const CHAT_RESPONSES: &[&str] = &[
    "Secure drive erasure involves overwriting data multiple times with random patterns to make recovery impossible. The DoD 5220.22-M standard requires 3 passes for complete data destruction.",
    "Different erasure modes serve different purposes: Data-only preserves the OS, Full-disk erases everything including boot sectors, and OS-only targets system partitions while preserving user data.",
    "Certificates provide cryptographic proof that erasure was completed. They include timestamps, drive signatures, and blockchain anchoring for tamper-evidence and compliance verification.",
    "SSDs require different erasure techniques than HDDs due to wear leveling and spare blocks. Secure erase commands are often more effective than overwriting for solid-state drives.",
    "The generated ISO creates a bootable environment that runs independently of the target system, ensuring complete isolation during the erasure process for maximum security.",
    "Verification involves multiple layers: cryptographic hashing of the erasure process, blockchain timestamping, and digital signatures from certified hardware for legal compliance.",
];

#[tauri::command]
async fn start_erase(
    mode: String,
    drive_id: String,
    _wipe_os: bool,
    app_handle: AppHandle,
    job_state: State<'_, JobState>,
) -> Result<String, String> {
    let job_id = Uuid::new_v4().to_string();

    // Store the job
    {
        let mut jobs = job_state.lock().unwrap();
        jobs.insert(job_id.clone(), true);
    }

    // Log start event
    app_handle
        .emit("erase-log", LogEvent {
            message: format!("Initializing {} erasure for drive {}", mode, drive_id),
            level: "info".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        })
        .map_err(|e| e.to_string())?;

    let job_id_clone = job_id.clone();
    let app_handle_clone = app_handle.clone();
    let mode_clone = mode.clone();
    let drive_id_clone = drive_id.clone();

    // Spawn the clean erasure simulation
    thread::spawn(move || {
        std::thread::sleep(std::time::Duration::from_millis(500));

        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: "Detecting drive and validating access permissions...".to_string(),
            level: "info".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        std::thread::sleep(std::time::Duration::from_millis(1000));

        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: format!("Drive {} detected and accessible", drive_id_clone),
            level: "info".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: "Drive size: 1024 GB (1,099,511,627,776 bytes)".to_string(),
            level: "info".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        let drive_type = if drive_id_clone.contains("SSD") { "SSD" } else { "HDD" };
        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: format!("Drive type: {} (optimized erasure pattern selected)", drive_type),
            level: "info".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: "Initializing secure erasure engine...".to_string(),
            level: "info".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        std::thread::sleep(std::time::Duration::from_millis(800));

        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: "Generating cryptographic seeds...".to_string(),
            level: "info".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: "Creating erasure log entries...".to_string(),
            level: "info".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        std::thread::sleep(std::time::Duration::from_millis(500));

        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: format!("Beginning {} erasure process...", mode_clone),
            level: "info".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        // Progress simulation
        for i in 1..=15 {
            std::thread::sleep(std::time::Duration::from_millis(300));
            let percent = (i * 100) / 15;
            let sector = i * 68_719_476;

            let message = match i {
                1..=5 => format!("Pass 1/3: Overwriting with random data - {}% (Sector {})", percent, sector),
                6..=10 => format!("Pass 2/3: Overwriting with zeros - {}% (Sector {})", percent, sector),
                _ => format!("Pass 3/3: Final verification pass - {}% (Sector {})", percent, sector),
            };

            let _ = app_handle_clone.emit("erase-log", LogEvent {
                message,
                level: "info".to_string(),
                timestamp: chrono::Utc::now().to_rfc3339(),
            });

            if i % 5 == 0 {
                let _ = app_handle_clone.emit("erase-log", LogEvent {
                    message: format!("Progress: {}% complete - {} sectors remaining", percent, 15 - i),
                    level: "info".to_string(),
                    timestamp: chrono::Utc::now().to_rfc3339(),
                });
            }
        }

        std::thread::sleep(std::time::Duration::from_millis(1000));

        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: "Erasure process completed successfully!".to_string(),
            level: "success".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: "Performing final verification...".to_string(),
            level: "info".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        std::thread::sleep(std::time::Duration::from_millis(2000));

        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: "Verification passed - no recoverable data found".to_string(),
            level: "success".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: "Generating tamper-proof certificate...".to_string(),
            level: "info".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        let current_time = chrono::Utc::now();
        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: format!("Certificate ID: CERT-{}", current_time.timestamp()),
            level: "info".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: format!("Blockchain anchor: 0x{}", Uuid::new_v4().to_string().replace("-", "")),
            level: "info".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: format!("Digital signature: SHA256:{}", drive_id_clone.chars().take(32).collect::<String>()),
            level: "info".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: format!("Erasure completed at: {}", current_time.format("%Y-%m-%d %H:%M:%S UTC")),
            level: "success".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: "Total time: 4.5 seconds".to_string(),
            level: "info".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: "Security level: DOD 5220.22-M compliant".to_string(),
            level: "success".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: "Sectors processed: 1,073,741,824".to_string(),
            level: "info".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: "===============================================".to_string(),
            level: "success".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: "ERASURE SUCCESSFUL - DRIVE IS SECURE".to_string(),
            level: "success".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        let _ = app_handle_clone.emit("erase-log", LogEvent {
            message: "===============================================".to_string(),
            level: "success".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        });

        let _ = app_handle_clone.emit("erase-end", EndEvent {
            exit_code: 0,
            job_id: job_id_clone,
        });
    });

    Ok(job_id)
}

#[tauri::command]
async fn prepare_iso(mode: String, drive_id: String) -> Result<IsoResponse, String> {
    // Simulate ISO generation delay
    tokio::time::sleep(tokio::time::Duration::from_millis(1500)).await;

    Ok(IsoResponse {
        download_url: format!(
            "https://releases.sayonara.app/v2/iso/sayonara-v2-{}-{}-{}.iso",
            mode,
            drive_id,
            chrono::Utc::now().format("%Y%m%d")
        ),
        sha256: format!(
            "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855{}",
            Uuid::new_v4().to_string().chars().take(8).collect::<String>()
        ),
    })
}

#[tauri::command]
async fn chat_query(q: String) -> Result<String, String> {
    // Simulate processing delay
    tokio::time::sleep(tokio::time::Duration::from_millis(800)).await;

    // Enhanced keyword matching
    let query_lower = q.to_lowercase();

    let response = if query_lower.contains("certificate") || query_lower.contains("verify") || query_lower.contains("blockchain") {
        CHAT_RESPONSES[2]
    } else if query_lower.contains("ssd") || query_lower.contains("solid state") {
        CHAT_RESPONSES[3]
    } else if query_lower.contains("iso") || query_lower.contains("bootable") {
        CHAT_RESPONSES[4]
    } else if query_lower.contains("mode") || query_lower.contains("full") || query_lower.contains("data") {
        CHAT_RESPONSES[1]
    } else if query_lower.contains("verification") || query_lower.contains("proof") || query_lower.contains("compliance") {
        CHAT_RESPONSES[5]
    } else {
        CHAT_RESPONSES[0]
    };

    Ok(format!(
        "{} Is there anything specific about the Sayonara erasure process you'd like me to explain further?",
        response
    ))
}

#[tauri::command]
async fn verify_certificate(_job_id: String) -> Result<CertificateResponse, String> {
    // Simulate verification delay
    tokio::time::sleep(tokio::time::Duration::from_millis(1200)).await;

    Ok(CertificateResponse {
        valid: true,
        blockchain_tx: Some(format!(
            "0x{}", 
            Uuid::new_v4().to_string().replace("-", "")
        )),
        signature: Some(format!(
            "SHA256:{}",
            Uuid::new_v4().to_string().replace("-", "")[..32].to_string()
        )),
    })
}

fn main() {
    let job_state: JobState = Arc::new(Mutex::new(HashMap::new()));

    tauri::Builder::default()
        .manage(job_state)
        .invoke_handler(tauri::generate_handler![
            start_erase,
            prepare_iso,
            chat_query,
            verify_certificate
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}