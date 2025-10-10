// Drive detection and operations module
//
// Organized structure:
// - detection.rs: Core drive detection logic
// - types/: Drive-type specific implementations (HDD, SSD, NVMe, SMR, etc.)
// - operations/: Drive operations (SMART, TRIM, HPA/DCO, SED)
// - freeze/: Freeze detection and mitigation

// Core functionality
pub mod detection;

// Drive types (organized by category)
pub mod types;

// Drive operations
pub mod operations;

// Freeze mitigation (already well-organized)
pub mod freeze;

// Re-exports for backward compatibility and convenience
pub use detection::DriveDetector;

// Drive types
pub use types::{
    // Basic types
    HDDWipe,
    SSDWipe,
    NVMeWipe,

    // Advanced NVMe
    NVMeAdvanced,
    NVMeNamespace,
    NamespaceType,
    ZNSZone,
    ZNSZoneState,

    // Advanced drive types (Phase 1, Step 6)
    SMRDrive,
    Zone,
    ZoneType,
    ZoneCondition,
    ZoneModel,
    OptaneDrive,
    OptaneMode,
    OptaneNamespace,
    HybridDrive,
    HDDInfo,
    SSDCacheInfo,
    PinnedRegion,
    EMMCDevice,
    BootPartition,
    RPMBPartition,
    UserDataArea,
    UFSDevice,
    UFSLogicalUnit,
    RAIDArray,
    RAIDType,
    RAIDController,
    MetadataRegion,
    MetadataLocation,
};

// Operations
pub use operations::{
    HPADCOManager,
    SEDManager,
    TrimOperations,
    SMARTMonitor,
};

// Freeze mitigation
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
