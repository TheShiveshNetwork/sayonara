// src/lib.rs
pub mod drives;
pub mod algorithms;
pub mod verification;
pub mod crypto;

use anyhow::Result;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WipeConfig {
    pub algorithm: Algorithm,
    pub verify: bool,
    pub multiple_passes: Option<u32>,
    pub preserve_partition_table: bool,
    pub unlock_encrypted: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Algorithm {
    DoD5220,      // 3-pass DoD 5220.22-M
    Gutmann,      // 35-pass Gutmann
    Random,       // Single pass random
    Zero,         // Single pass zeros
    SecureErase,  // Hardware secure erase
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DriveInfo {
    pub device_path: String,
    pub model: String,
    pub serial: String,
    pub size: u64,
    pub drive_type: DriveType,
    pub encryption_status: EncryptionStatus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum DriveType {
    HDD,
    SSD,
    NVMe,
    USB,
    Unknown,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EncryptionStatus {
    None,
    OPAL,
    BitLocker,
    LUKS,
    Unknown,
}
