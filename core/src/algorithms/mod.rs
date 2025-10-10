pub mod gutmann;
pub mod dod;
pub mod random;
pub mod zero;

#[cfg(test)]
mod gutmann_test;

// Re-export the main wiping implementations
pub use dod::DoDWipe;
pub use gutmann::GutmannWipe;
pub use random::RandomWipe;
pub use zero::ZeroWipe;
