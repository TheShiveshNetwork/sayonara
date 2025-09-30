# Sayonara Wipe

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Rust](https://img.shields.io/badge/rust-1.70+-orange.svg)](https://www.rust-lang.org/)
[![Security](https://img.shields.io/badge/security-hardened-green.svg)](docs/SECURITY.md)

**Advanced secure data wiping tool with comprehensive hardware support and mathematical verification**

Sayonara Wipe is a professional-grade, military-standard secure data destruction tool designed for HDD, SSD, and NVMe drives. It provides cryptographically-verified data destruction with compliance-ready certification.

## ⚠️ Warning

**This tool PERMANENTLY DESTROYS DATA. There is NO RECOVERY after a successful wipe.**

Use extreme caution. Always verify drive selection before proceeding.

## ✨ Features

### Core Capabilities
- **Multiple Wiping Algorithms**
  - DoD 5220.22-M (3-pass)
  - Gutmann Method (35-pass)
  - Cryptographic Secure Random
  - Zero-fill
  - Hardware Secure Erase (HDD/SSD)
  - NVMe Format/Sanitize
  - TRIM-based wiping (SSD)
  - Self-Encrypting Drive (SED) cryptographic erase

- **Advanced Hardware Support**
  - **HDD**: Hardware secure erase, SMART monitoring
  - **SSD**: TRIM, secure erase, wear leveling aware
  - **NVMe**: Format, sanitize, crypto erase
  - Automatic drive type detection
  - Multi-drive parallel operations

- **Security Features**
  - ATA Security freeze state detection and mitigation
  - Host Protected Area (HPA) detection and removal
  - Device Configuration Overlay (DCO) detection and handling
  - Self-Encrypting Drive (SED) management
  - FIPS 140-2 compliant random number generation
  - Cryptographic verification certificates

### Advanced Capabilities

#### Drive Freeze Mitigation
- Multiple unfreeze strategies:
  - SATA link reset
  - PCIe hot reset
  - ACPI sleep/resume
  - USB suspend/resume
  - IPMI power cycling
  - Vendor-specific commands
  - **Kernel module** for direct ATA register access
- Automatic strategy selection based on freeze reason
- Success probability calculation

#### Mathematical Verification System
- **Pre-wipe capability testing**
  - Pattern detection validation
  - Recovery tool simulation
  - False positive/negative rate measurement
- **Post-wipe verification**
  - Shannon entropy calculation
  - Chi-square randomness testing
  - Pattern analysis
  - Sector anomaly detection
  - Confidence level scoring (90-100%)
- **Live USB verification** for OS-independent validation

#### Certificate Generation
- Cryptographically signed wipe certificates
- X.509 standard compliance
- Detailed metadata:
  - Drive information (model, serial, size)
  - Algorithm used
  - Duration and timestamp
  - Verification results (entropy scores, recovery tests)
  - Operator information
- JSON format for easy integration

## 📋 Requirements

- **Operating System**: Linux (Ubuntu, Debian, Fedora, Arch)
- **Privileges**: Root/sudo access required
- **Rust**: 1.70 or later
- **Kernel Headers**: Required for kernel module compilation

### Optional Dependencies
- `hdparm`: For ATA commands
- `nvme-cli`: For NVMe operations
- `smartctl`: For SMART monitoring
- `ipmitool`: For server environments

## 🚀 Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/yourusername/sayonara-wipe.git
cd sayonara-wipe

# Build in release mode
cargo build --release

# Install (optional)
sudo cp target/release/sayonara /usr/local/bin/
```

### Building with Kernel Module Support

```bash
# Install kernel headers first
sudo apt install linux-headers-$(uname -r)  # Debian/Ubuntu
sudo dnf install kernel-devel               # Fedora
sudo pacman -S linux-headers                # Arch

# Build with kernel module feature
cargo build --release --features kernel-module

# Build the kernel module
cd drives/freeze/kernel_module
make
sudo make install
```

## 📖 Usage

### List Drives

```bash
# Basic list
sudo sayonara list

# Detailed capabilities
sudo sayonara list --detailed

# Include system drives (USE WITH CAUTION)
sudo sayonara list --include-system
```

### Wipe a Single Drive

```bash
# Auto-select best algorithm
sudo sayonara wipe /dev/sdX

# Specify algorithm
sudo sayonara wipe /dev/sdX --algorithm gutmann

# With verification and certificate
sudo sayonara wipe /dev/sdX --algorithm dod \
  --cert-output /path/to/certificate.json

# Advanced options
sudo sayonara wipe /dev/sdX \
  --algorithm secure \
  --hpa-dco remove-temp \
  --cert-output cert.json \
  --max-temp 60 \
  --force
```

### Enhanced Wipe with Mathematical Verification (Recommended)

```bash
sudo sayonara enhanced-wipe /dev/sdX \
  --algorithm auto \
  --cert-output certificate.json \
  --sample-percent 1.0 \
  --min-confidence 95.0
```

This performs:
1. Pre-wipe capability testing
2. Complete data destruction
3. Mathematical verification with confidence scoring
4. Compliance certification

### Wipe Multiple Drives

```bash
# Wipe all non-system drives (EXTREMELY DANGEROUS)
sudo sayonara wipe-all --algorithm dod \
  --cert-dir ./certificates \
  --exclude /dev/sda,/dev/sdb

# Always double-check with list first!
```

### Verify Previous Wipe

```bash
sudo sayonara verify /dev/sdX --check-hidden
```

### Check Drive Health

```bash
# Basic health check
sudo sayonara health /dev/sdX

# Run SMART self-test
sudo sayonara health /dev/sdX --self-test

# Monitor temperature
sudo sayonara health /dev/sdX --monitor
```

### Self-Encrypting Drive (SED) Management

```bash
# Check SED status
sudo sayonara sed /dev/sdX status

# Crypto erase (fastest secure wipe for SEDs)
sudo sayonara sed /dev/sdX crypto-erase

# Unlock drive
sudo sayonara sed /dev/sdX unlock --password <password>
```

## 🔧 Configuration

### Algorithm Selection Guide

| Algorithm | Passes | Speed | Security Level | Best For |
|-----------|--------|-------|----------------|----------|
| `zero` | 1 | ⚡⚡⚡ | ⭐ | Quick wipe, media destruction planned |
| `random` | 1 | ⚡⚡ | ⭐⭐⭐ | Fast, good security |
| `dod` | 3 | ⚡⚡ | ⭐⭐⭐⭐ | DoD 5220.22-M compliance |
| `gutmann` | 35 | ⚡ | ⭐⭐⭐⭐⭐ | Maximum paranoia, old drives |
| `secure` | 1 | ⚡⚡⚡ | ⭐⭐⭐⭐ | Hardware secure erase (HDD/SSD) |
| `crypto` | 1 | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | SED cryptographic erase |
| `sanitize` | 1 | ⚡⚡ | ⭐⭐⭐⭐⭐ | NVMe sanitize |
| `trim` | 1 | ⚡⚡⚡ | ⭐⭐⭐⭐ | SSD TRIM-based wipe |
| `auto` | - | - | - | **Automatic selection** (recommended) |

### HPA/DCO Handling

- `ignore`: Don't check for hidden areas
- `detect`: Detect and warn (default)
- `remove-temp`: Temporarily remove for wiping only
- `remove-perm`: Permanently remove hidden areas

## 🔒 Security Features

### Random Number Generation
- FIPS 140-2 compliant
- Multiple entropy sources:
  - Hardware RNG (`/dev/hwrng`)
  - OS cryptographic RNG (`/dev/urandom`)
  - Timing jitter
  - System entropy
- HMAC-DRBG with automatic reseeding
- Continuous health testing

### Verification Methods
1. **Pattern Verification**: Confirms expected patterns written
2. **Entropy Analysis**: Shannon entropy ≥ 7.8 for random data
3. **Recovery Testing**: Simulates data recovery attempts
4. **Chi-Square Test**: Statistical randomness validation
5. **Sector Scanning**: Detects anomalies and skipped sectors

### Certificate Security
- RSA-4096 signatures
- SHA-512 hashing
- Tamper-evident design
- JSON format for audit trails

## 🧪 Testing

```bash
# Run unit tests
cargo test

# Run with coverage
cargo tarpaulin --out Html

# Integration tests (requires root and test hardware)
cargo test --features integration-tests -- --ignored

# Benchmarks
cargo bench
```

## 🐛 Troubleshooting

### Drive is Frozen

If you encounter "Drive is frozen" errors:

```bash
# Try automatic unfreeze
sudo sayonara wipe /dev/sdX  # Will attempt unfreeze automatically

# Or use kernel module
cd drives/freeze/kernel_module
make
sudo make install
sudo insmod ata_unfreeze.ko
```

### Hidden Areas (HPA/DCO)

```bash
# Detect hidden areas
sudo sayonara wipe /dev/sdX --hpa-dco detect

# Remove before wiping
sudo sayonara wipe /dev/sdX --hpa-dco remove-temp
```

### Temperature Issues

```bash
# Set custom temperature limit
sudo sayonara wipe /dev/sdX --max-temp 50

# Disable temperature monitoring (NOT RECOMMENDED)
sudo sayonara wipe /dev/sdX --no-temp-check
```

### Verification Failures

If verification fails:
1. Check drive health: `sudo sayonara health /dev/sdX`
2. Look for bad sectors in SMART data
3. Try a different algorithm
4. Consider drive replacement if hardware issues detected

## 📚 Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Security Whitepaper](docs/SECURITY.md)
- [API Documentation](docs/API.md)
- [Compliance Guide](docs/COMPLIANCE.md)
- [Contributing Guidelines](CONTRIBUTING.md)

### Development Setup

```bash
git clone https://github.com/yourusername/sayonara-wipe.git
cd sayonara-wipe
cargo build
cargo test
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚖️ Legal Notice

This software is designed for legitimate data destruction purposes including:
- End-of-life device disposal
- Secure media sanitization before reuse
- Compliance with data protection regulations (GDPR, HIPAA, etc.)
- Digital forensics and incident response

**Users are solely responsible for:**
- Verifying correct drive selection before wiping
- Ensuring legal authority to destroy data
- Compliance with local regulations
- Maintaining backups of important data

**The authors and contributors accept NO LIABILITY for:**
- Data loss due to user error
- Misuse of this software
- Hardware damage
- Violation of data retention laws

## 🙏 Acknowledgments

- Rust community for excellent crates
- Linux kernel developers for ATA/SCSI subsystems
- Security researchers for verification methodologies
- Open source contributors

---

**Remember: With great power comes great responsibility. Always verify before you wipe!**