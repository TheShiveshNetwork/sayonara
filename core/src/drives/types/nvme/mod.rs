// NVMe drive support
//
// This module provides both basic and advanced NVMe functionality:
// - basic.rs: Standard NVMe secure erase and sanitize operations
// - advanced.rs: ZNS (Zoned Namespaces), multiple namespaces, Key-Value, Computational storage

pub mod basic;
pub mod advanced;

// Re-export commonly used types
pub use basic::NVMeWipe;
pub use advanced::{
    NVMeAdvanced,
    NVMeNamespace,
    NamespaceType,
    ZNSZone,
    ZNSZoneState,
};
