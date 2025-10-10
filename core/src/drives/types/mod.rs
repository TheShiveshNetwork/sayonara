// Drive type specific implementations
//
// This module organizes different drive types and their wiping implementations

// Basic drive types
pub mod hdd;
pub mod ssd;
pub mod nvme;

// Advanced drive types (Phase 1, Step 6)
pub mod smr;       // Shingled Magnetic Recording
pub mod optane;    // Intel Optane / 3D XPoint
pub mod hybrid;    // Hybrid SSHD drives
pub mod emmc;      // eMMC/UFS embedded storage
pub mod raid;      // RAID array handling

// Re-exports for convenience
pub use hdd::HDDWipe;
pub use ssd::SSDWipe;
pub use nvme::{NVMeWipe, NVMeAdvanced, NVMeNamespace, NamespaceType, ZNSZone, ZNSZoneState};
pub use smr::{SMRDrive, Zone, ZoneType, ZoneCondition, ZoneModel};
pub use optane::{OptaneDrive, OptaneMode, OptaneNamespace};
pub use hybrid::{HybridDrive, HDDInfo, SSDCacheInfo, PinnedRegion};
pub use emmc::{EMMCDevice, BootPartition, RPMBPartition, UserDataArea, UFSDevice, UFSLogicalUnit};
pub use raid::{RAIDArray, RAIDType, RAIDController, MetadataRegion, MetadataLocation};
