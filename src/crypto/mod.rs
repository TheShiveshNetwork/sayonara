// src/crypto/mod.rs
pub mod certificates;

// Re-export
pub use certificates::{CertificateGenerator, WipeCertificate, WipeDetails, VerificationResult};
