pub mod recovery_test;
pub mod enhanced;
mod enhanced_tests;

// Re-export all verification types
pub use recovery_test::RecoveryTest;
pub use enhanced::{
    // Main verification system
    EnhancedVerification,

    // Report structures
    VerificationReport,
    PreWipeTestResults,
    PostWipeAnalysis,

    // Verification levels
    VerificationLevel,

    // Hidden area verification
    HiddenAreaVerification,

    // Recovery simulation
    RecoverySimulationResults,
    PhotoRecResults,
    TestDiskResults,
    FilesystemMetadataResults,
    MFMResults,
    RecoveryRisk,
    FileSignatureMatch,

    // Pattern analysis
    PatternAnalysis,
    StatisticalTests,
    SectorSamplingResult,

    // Heat map
    EntropyHeatMap,

    // Bad sector tracking
    BadSectorTracker,

    // Live USB
    LiveUSBVerification,
};
