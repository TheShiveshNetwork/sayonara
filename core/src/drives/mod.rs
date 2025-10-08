pub mod detection;
pub mod hdd;
pub mod ssd;
pub mod nvme;
pub mod freeze;          // CHANGED: Now a module instead of individual files
pub mod hpa_dco;
pub mod sed;
pub mod trim;
pub mod smart;

// NEW: Step 6 - Advanced drive support
pub mod smr;             // Shingled Magnetic Recording
pub mod optane;          // Intel Optane / 3D XPoint
pub mod hybrid;          // Hybrid SSHD drives
pub mod raid;            // RAID array handling
pub mod emmc;            // eMMC/UFS embedded storage
pub mod nvme_advanced;   // Advanced NVMe: ZNS, multiple namespaces, KV, computational

// Re-exports
pub use detection::DriveDetector;
pub use hdd::HDDWipe;
pub use ssd::SSDWipe;
pub use nvme::NVMeWipe;

// UPDATED: Import from freeze module
pub use freeze::{
    // Basic freeze mitigation
    FreezeMitigation,

    // Advanced freeze mitigation
    AdvancedFreezeMitigation,
    FreezeMitigationConfig,
    UnfreezeResult,
    FreezeInfo,

    // Freeze detection
    FreezeReason,
    FreezeDetector,

    // Strategies (optional, for direct access)
    UnfreezeStrategy,
    StrategyResult,

    // Helper functions
    FreezeMitigationStrategy,
    get_mitigation,
};

pub use hpa_dco::HPADCOManager;
pub use sed::SEDManager;
pub use trim::TrimOperations;
pub use smart::SMARTMonitor;
