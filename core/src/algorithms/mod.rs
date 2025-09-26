pub mod gutmann;
pub mod dod;
pub mod random;

// Re-export the main wiping implementations
pub use dod::DoDWipe;
pub use gutmann::GutmannWipe;
pub use random::RandomWipe;
