# Sayonara - Forensic-Grade Data Wiping Software

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Rust](https://img.shields.io/badge/rust-1.70%2B-orange.svg)](https://www.rust-lang.org/)
[![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20Windows%20%7C%20macOS-lightgrey.svg)](https://github.com/TheShiveshNetwork/sayonara)

**Sayonara** is an advanced, open-source secure data wiping tool that provides forensic-level data destruction with comprehensive hardware support. Built in Rust for maximum performance and safety, Sayonara ensures data cannot be recovered by any known forensic recovery method.

## Why Sayonara is the Best Open-Source Data Wiping Solution

### Enterprise-Grade Features That Rival Blancco

Sayonara stands as a **legitimate open-source competitor to commercial solutions like Blancco** by offering:

#### 1. **Forensic-Level Verification System** (Unmatched in Open Source)
- **4-tier verification system** ranging from quick sampling to comprehensive forensic analysis
- **Recovery simulation engine** that mimics PhotoRec and TestDisk to verify data is truly unrecoverable
- **Hidden area detection** including HPA (Host Protected Area), DCO (Device Configuration Overlay), remapped sectors, and controller caches
- **MFM (Magnetic Force Microscopy) simulation** for detecting residual magnetic patterns
- **Statistical analysis** using NIST SP 800-22 test suite (runs test, monobit, chi-square)
- **Entropy analysis** ensuring randomness meets cryptographic standards (>7.8/8.0 Shannon entropy)
- **Confidence scoring** (0-100%) with weighted verification across all drive areas

**No other open-source tool provides this depth of verification.**

#### 2. **Advanced Hardware Intelligence**
- **Multi-strategy freeze mitigation** with intelligent detection of freeze causes (BIOS, Security, power management)
- **Drive-specific optimization** for HDD, SSD (TRIM-aware), and NVMe (sanitize command support)
- **Self-Encrypting Drive (SED)** support for cryptographic erasure
- **SMART monitoring** with real-time temperature and health tracking
- **Over-provisioning awareness** for SSDs to ensure complete data destruction

#### 3. **Optimized I/O Engine**
- **Direct I/O** bypassing OS cache for true hardware-level writes
- **Adaptive buffer sizing** based on drive speed and capabilities
- **Queue depth optimization** for maximum throughput
- **Performance metrics** with real-time monitoring
- **Checkpoint system** for resumable operations on multi-TB drives

#### 4. **Comprehensive Compliance Coverage**
Sayonara meets or exceeds requirements for:
- DoD 5220.22-M (3 & 7 pass variants)
- NIST 800-88 Rev. 1
- PCI DSS v3.2.1
- HIPAA Security Rule
- ISO/IEC 27001:2013
- GDPR Article 32 (Data Protection)
- NSA Storage Device Sanitization Manual

**Generates cryptographically signed certificates** for audit trails and compliance reporting.

#### 5. **Battle-Tested Wiping Algorithms**
- **Gutmann (35-pass)** - Maximum security for legacy drives
- **DoD 5220.22-M** (3-pass & 7-pass) - Government standard
- **Random Overwrite** - Cryptographically secure random data
- **Zero Fill** - Quick baseline wiping
- **Custom patterns** - User-defined wipe sequences

All algorithms use **ring-based cryptographic RNG**, not standard library pseudo-random generators.

### What Makes Sayonara Superior to Other Open-Source Tools

| Feature | Sayonara | DBAN | shred | nwipe | hdparm |
|---------|----------|------|-------|-------|--------|
| Forensic-level verification | ✅ 4 levels | ❌ | ❌ | Basic | ❌ |
| Recovery simulation (PhotoRec/TestDisk) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Hidden area detection (HPA/DCO/cache) | ✅ | ❌ | ❌ | ❌ | Partial |
| Drive freeze mitigation | ✅ Multi-strategy | ❌ | ❌ | ❌ | Basic |
| NVMe sanitize command | ✅ | ❌ | ❌ | ❌ | ❌ |
| SSD TRIM support | ✅ | ❌ | ❌ | ✅ | ❌ |
| SED cryptographic erase | ✅ | ❌ | ❌ | ❌ | ✅ |
| Optimized I/O engine | ✅ | ❌ | ❌ | ❌ | ❌ |
| Resumable operations | ✅ | ❌ | ❌ | ❌ | ❌ |
| SMART monitoring | ✅ | ❌ | ❌ | ✅ | ✅ |
| Certificate generation | ✅ Crypto-signed | ❌ | ❌ | Basic | ❌ |
| Active development | ✅ 2025 | ❌ Defunct | ✅ | ✅ | ✅ |
| Modern codebase | ✅ Rust | C (2000s) | C | C | C |

### Competing with Blancco

While Blancco is an industry-standard commercial solution, Sayonara offers:

**Advantages:**
- ✅ **100% Open Source** - Full transparency, no black boxes
- ✅ **Zero Licensing Costs** - No per-seat or per-use fees
- ✅ **Customizable** - Modify for specific organizational needs
- ✅ **No Vendor Lock-in** - Own your wiping infrastructure
- ✅ **Forensic verification** that matches or exceeds Blancco's capabilities
- ✅ **Modern Rust codebase** - Memory-safe, concurrent, fast
- ✅ **Cross-platform** - Linux, Windows, macOS support

**Where Blancco Still Leads:**
- Enterprise management console (in development for Sayonara)
- Decades of compliance certifications and third-party validations
- Professional support contracts
- Network-based deployment at scale

**For organizations that:**
- Want full control over their data sanitization process
- Need to audit their wiping methodology
- Require customization for specific hardware or workflows
- Want to avoid recurring licensing fees
- Value open-source transparency

**Sayonara is the superior choice.**

## Key Features

### Security & Safety
- ✅ **Forensic-grade verification** with 4 verification levels
- ✅ **Cryptographically signed certificates** for compliance audits
- ✅ **Secure RNG** using ring cryptography library
- ✅ **System drive protection** with configurable exclusion rules
- ✅ **Destructive operation confirmation** with safety timeouts

### Hardware Support
- ✅ **HDD, SSD, NVMe** drive types with optimized algorithms
- ✅ **SATA, NVMe, USB** interfaces
- ✅ **Drive freeze detection & mitigation** with 6+ unfreeze strategies
- ✅ **HPA/DCO handling** for complete area coverage
- ✅ **Self-Encrypting Drives (SED)** with cryptographic erase
- ✅ **TRIM/Discard** for SSD optimization

### Performance
- ✅ **Optimized I/O engine** with direct I/O and adaptive buffering
- ✅ **Queue depth optimization** for maximum throughput
- ✅ **Resumable operations** with checkpoint system (SQLite-based)
- ✅ **Temperature monitoring** with automatic throttling
- ✅ **Real-time progress** with ETA calculation

### Compliance & Reporting
- ✅ **Multiple algorithms** (Gutmann, DoD, Random, Zero Fill)
- ✅ **Compliance standards** (DoD, NIST, PCI DSS, HIPAA, GDPR, ISO 27001)
- ✅ **Audit trail generation** with cryptographic proof
- ✅ **Certificate export** in JSON format
- ✅ **Operation logging** with tracing support

## Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/TheShiveshNetwork/sayonara.git
cd sayonara/core

# Build release binary
cargo build --release

# Install to system
sudo cp target/release/sayonara /usr/local/bin/
```

### System Requirements
- **OS:** Linux (primary), Windows, macOS
- **Privileges:** Root/Administrator required for drive operations
- **Rust:** 1.70 or higher (for building from source)

## Quick Start

```bash
# List all detected drives
sudo sayonara list

# Wipe a drive with DoD 3-pass (recommended)
sudo sayonara wipe /dev/sdX --algorithm dod-3pass

# Wipe with maximum security (Gutmann 35-pass)
sudo sayonara wipe /dev/sdX --algorithm gutmann

# Wipe with verification level 3 (full scan)
sudo sayonara wipe /dev/sdX --verify-level 3

# NVMe sanitize (fastest for supported drives)
sudo sayonara wipe /dev/nvme0n1 --algorithm nvme-sanitize

# SED cryptographic erase (instant, if supported)
sudo sayonara wipe /dev/sdX --algorithm sed-crypto-erase

# Generate compliance certificate
sudo sayonara wipe /dev/sdX --certificate compliance_cert.json
```

## Usage Examples

### Basic Wiping

```bash
# Single drive wipe with default settings (DoD 3-pass)
sudo sayonara wipe /dev/sdb

# Multiple drives in sequence
sudo sayonara wipe /dev/sdb /dev/sdc /dev/sdd

# Specific algorithm
sudo sayonara wipe /dev/sdb --algorithm gutmann
```

### Advanced Options

```bash
# Enable HPA/DCO detection and wiping
sudo sayonara wipe /dev/sdb --include-hpa --include-dco

# Set temperature limit
sudo sayonara wipe /dev/sdb --max-temp 60

# Skip verification (faster, less secure)
sudo sayonara wipe /dev/sdb --no-verify

# Forensic verification (slowest, most thorough)
sudo sayonara wipe /dev/sdb --verify-level 4

# Resume interrupted operation
sudo sayonara resume /dev/sdb
```

### Information & Diagnostics

```bash
# List all drives with capabilities
sudo sayonara list --verbose

# Check if drive is frozen
sudo sayonara status /dev/sdb

# Attempt to unfreeze drive
sudo sayonara unfreeze /dev/sdb

# View SMART data
sudo sayonara smart /dev/sdb
```

## Verification Levels Explained

| Level | Coverage | Time (1TB) | Use Case |
|-------|----------|------------|----------|
| **1** | ~1% (Random sampling) | 1-5 min | Quick validation |
| **2** | Systematic sampling | 5-30 min | Standard verification |
| **3** | 100% (Full scan) | 1-4 hours | Compliance requirements |
| **4** | 100% + Forensic | 2-8+ hours | Maximum assurance, legal/gov |

**Level 4 includes:**
- Complete sector-by-sector verification
- HPA/DCO area verification
- Remapped sector detection
- Controller cache verification
- Bad sector analysis
- MFM pattern simulation
- PhotoRec/TestDisk recovery simulation

## Architecture Overview

```
Sayonara Architecture
├── Core Engine
│   ├── Drive Detection & Classification
│   ├── Freeze Mitigation (6+ strategies)
│   ├── Optimized I/O Engine
│   └── Safety & Validation
├── Wiping Algorithms
│   ├── Gutmann (35-pass)
│   ├── DoD 5220.22-M (3/7-pass)
│   ├── Random Overwrite
│   └── Zero Fill
├── Hardware Support
│   ├── HDD (Traditional overwrite)
│   ├── SSD (TRIM-aware)
│   ├── NVMe (Sanitize command)
│   └── SED (Cryptographic erase)
├── Verification System
│   ├── Entropy Analysis (NIST)
│   ├── Statistical Tests
│   ├── Pattern Detection
│   ├── Hidden Area Verification
│   └── Recovery Simulation
└── Compliance & Reporting
    ├── Certificate Generation
    ├── Audit Trail Logging
    └── Cryptographic Signing
```

## Development

### Building

```bash
# Debug build
cargo build

# Release build (optimized)
cargo build --release

# With specific features
cargo build --features experimental,debug-mode
```

### Testing

```bash
# Run all tests
cargo test

# Run specific module tests
cargo test verification

# Run with output visible
cargo test -- --nocapture

# Integration tests (requires hardware)
cargo test --features integration-tests
```

### Code Quality

```bash
# Format code
cargo fmt

# Lint
cargo clippy

# Check without building
cargo check
```

## Security & Compliance

### Compliance Standards Supported
- ✅ DoD 5220.22-M (U.S. Department of Defense)
- ✅ NIST 800-88 Rev. 1 (National Institute of Standards)
- ✅ PCI DSS v3.2.1 (Payment Card Industry)
- ✅ HIPAA Security Rule (Healthcare)
- ✅ GDPR Article 32 (EU Data Protection)
- ✅ ISO/IEC 27001:2013 (Information Security)
- ✅ NSA Storage Device Sanitization Manual

### Security Practices
- All random data generated using **ring** cryptographic library
- Certificate signing using **X.509 with SHA-256**
- Drive operations require **root/administrator privileges**
- System drives **excluded by default** with safety checks
- **Temperature monitoring** prevents hardware damage
- **SMART health checks** before operations

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the need for transparent, auditable data sanitization
- Built with Rust for memory safety and performance
- Cryptography powered by [ring](https://github.com/briansmith/ring)
- Compliance guidance from NIST, DoD, and ISO standards

## Disclaimer

**WARNING:** This tool is designed to **permanently and irreversibly destroy data**.

- ⚠️ **ALWAYS** verify the target device before running wipe operations
- ⚠️ **BACKUPS** are essential - there is no recovery after wiping
- ⚠️ **TEST** on non-critical hardware before production use
- ⚠️ Use at your own risk - the authors are not liable for data loss

## Support

- **Issues:** [GitHub Issues](https://github.com/TheShiveshNetwork/sayonara/issues)
- **Discussions:** [GitHub Discussions](https://github.com/TheShiveshNetwork/sayonara/discussions)
- **Documentation:** [Wiki](https://github.com/TheShiveshNetwork/sayonara/wiki)

---

**Sayonara** - Because data deletion should be transparent, auditable, and absolute.
