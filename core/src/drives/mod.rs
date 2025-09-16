// src/drives/mod.rs
pub mod detection;
pub mod hdd;
pub mod ssd;
pub mod nvme;

// Re-export commonly used items
pub use detection::DriveDetector;
pub use hdd::HDDWipe;
pub use ssd::SSDWipe;
pub use nvme::NVMeWipe;
