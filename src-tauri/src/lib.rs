// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;
use tauri::{command, State};

// Shared state for tracking wipe progress
type ProgressStore = Arc<Mutex<HashMap<String, WipeProgress>>>;

#[derive(Clone, serde::Serialize)]
pub struct Drive {
    pub id: String,
    pub name: String,
    pub size: String,
    pub usage_pct: u8,
}

#[derive(Clone, serde::Serialize)]
pub struct WipeProgress {
    pub percent: u8,
    pub step: String,
    pub status: String,
}

// Simulated drive list - replace with real drive enumeration
#[command]
fn list_drives() -> Vec<Drive> {
    vec![
        Drive {
            id: "C:".to_string(),
            name: "C: SSD".to_string(),
            size: "512 GB".to_string(),
            usage_pct: 75,
        },
        Drive {
            id: "D:".to_string(),
            name: "D: HDD".to_string(),
            size: "1 TB".to_string(),
            usage_pct: 40,
        },
    ]
}

// Start wipe simulation - returns task_id immediately, runs background thread
#[command]
fn start_wipe(
    drive_id: String,
    method: String,
    progress_store: State<ProgressStore>,
) -> Result<String, String> {
    let task_id = format!("wipe_{}", chrono::Utc::now().timestamp_millis());
    
    // Initialize progress
    let initial_progress = WipeProgress {
        percent: 0,
        step: "Initializing wipe process".to_string(),
        status: "running".to_string(),
    };
    
    {
        let mut store = progress_store.lock().unwrap();
        store.insert(task_id.clone(), initial_progress);
    }
    
    // Spawn background thread for simulation
    let store_clone = progress_store.inner().clone();
    let drive_id_clone = drive_id.clone();
    let method_clone = method.clone();
    let task_id_clone = task_id.clone();
    
    thread::spawn(move || {
        simulate_wipe_progress(task_id_clone, drive_id_clone, method_clone, store_clone);
    });
    
    Ok(task_id)
}

// Get current progress for a task
#[command]
fn get_wipe_progress(
    task_id: String,
    progress_store: State<ProgressStore>,
) -> Result<WipeProgress, String> {
    let store = progress_store.lock().unwrap();
    store.get(&task_id).cloned().ok_or_else(|| "Task not found".to_string())
}

// Background simulation - replace with real wipe implementation
fn simulate_wipe_progress(
    task_id: String,
    _drive_id: String,
    _method: String,
    store: Arc<Mutex<HashMap<String, WipeProgress>>>,
) {
    let steps = vec![
        "Initializing secure wipe process",
        "Analyzing drive structure",
        "Overwriting sectors - Pass 1/3",
        "Overwriting sectors - Pass 2/3", 
        "Overwriting sectors - Pass 3/3",
        "Secure erase verification",
        "Generating completion hash",
        "Anchoring blockchain proof",
        "Finalizing wipe certificate",
    ];
    
    for (i, step) in steps.iter().enumerate() {
        thread::sleep(Duration::from_millis(2000)); // 2 second intervals
        
        let percent = ((i + 1) * 100 / steps.len()) as u8;
        let status = if i == steps.len() - 1 { "completed" } else { "running" };
        
        let progress = WipeProgress {
            percent,
            step: step.to_string(),
            status: status.to_string(),
        };
        
        {
            let mut store = store.lock().unwrap();
            store.insert(task_id.clone(), progress);
        }
        
        println!("Wipe progress: {}% - {}", percent, step);
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let progress_store: ProgressStore = Arc::new(Mutex::new(HashMap::new()));
    
    tauri::Builder::default()
        .manage(progress_store)
        .invoke_handler(tauri::generate_handler![
            list_drives,
            start_wipe,
            get_wipe_progress
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}