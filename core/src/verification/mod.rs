pub mod recovery_test;
pub mod enhanced;  // ADD THIS LINE

// Re-export
pub use recovery_test::RecoveryTest;
pub use enhanced::{  // ADD THESE LINES
                     EnhancedVerification,
                     VerificationReport,
                     PreWipeTestResults,
                     PostWipeAnalysis,
                     LiveUSBVerification
};
