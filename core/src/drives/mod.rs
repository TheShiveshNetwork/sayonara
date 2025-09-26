pub mod detection;
pub mod hdd;
pub mod ssd;
pub mod nvme;
pub mod freeze;
pub mod hpa_dco;
pub mod sed;
pub mod trim;
pub mod smart;

pub use detection::DriveDetector;
pub use hdd::HDDWipe;
pub use ssd::SSDWipe;
pub use nvme::NVMeWipe;

pub use freeze::FreezeMitigation;
pub use hpa_dco::HPADCOManager;
pub use sed::SEDManager;
pub use trim::TrimOperations;
pub use smart::SMARTMonitor;
