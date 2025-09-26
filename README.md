# Sayonara Wipe - Advanced Secure Data Erasure Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)

A production-ready, comprehensive secure data wiping tool with advanced hardware support, developed for SIH 2025.

## 🚀 Features

### Core Capabilities
- **Multiple Wiping Algorithms**
   - DoD 5220.22-M (3-pass)
   - Gutmann (35-pass)
   - Random data overwrite
   - Zero overwrite
   - Hardware secure erase
   - Cryptographic erase (SED)
   - NVMe sanitize
   - TRIM-only for SSDs

### Advanced Hardware Support
- **Drive Freeze Mitigation**
   - Automatic detection of frozen drives
   - Multiple unfreezing strategies
   - BIOS freeze bypass techniques

- **Hidden Area Detection & Management**
   - Host Protected Area (HPA) detection
   - Device Configuration Overlay (DCO) detection
   - Temporary or permanent removal options
   - Safe restoration after wiping

- **Self-Encrypting Drive (SED) Support**
   - OPAL 2.0/1.0 compliance
   - TCG Enterprise support
   - Instant cryptographic erase
   - Password management

- **TRIM/Discard Operations**
   - Full-drive TRIM after secure erase
   - Effectiveness verification
   - Multi-pass TRIM for security

- **Temperature Monitoring**
   - Real-time temperature tracking
   - Automatic cooling periods
   - Thermal throttling prevention

- **Health Monitoring**
   - SMART attribute analysis
   - Failure prediction
   - Pre-wipe health checks

### Safety Features
- System drive protection
- Mounted drive detection
- RAID member detection
- Confirmation prompts
- Rollback capabilities for HPA/DCO

## 📦 Installation

### Prerequisites
- Linux kernel 5.4+ (for full feature support)
- Root/sudo access
- Required system tools:
   - `smartctl` (smartmontools)
   - `hdparm`
   - `nvme-cli` (for NVMe drives)
   - `sg3_utils` (optional, for SCSI)
   - `sedutil-cli` (optional, for OPAL)

### Build from Source
```bash
# Clone the repository
git clone https://github.com/yourusername/sayonara-wipe.git
cd sayonara-wipe

# Build the project
cargo build --release

# Install system-wide (optional)
sudo cp target/release/sayonara /usr/local/bin/
```

## 🔧 Usage

### Basic Commands

#### List all drives with capabilities
```bash
sudo sayonara list --detailed
```

#### Wipe a single drive with automatic best method
```bash
sudo sayonara wipe /dev/sda --algorithm auto
```

#### Wipe with specific algorithm
```bash
sudo sayonara wipe /dev/sda --algorithm dod --cert-output certificate.json
```

#### Handle hidden areas
```bash
# Detect only (default)
sudo sayonara wipe /dev/sda --hpa-dco detect

# Temporarily remove during wipe
sudo sayonara wipe /dev/sda --hpa-dco remove-temp

# Permanently remove (DANGEROUS!)
sudo sayonara wipe /dev/sda --hpa-dco remove-perm
```

#### Temperature-aware wiping
```bash
sudo sayonara wipe /dev/sda --max-temp 60
```

#### Check drive health
```bash
sudo sayonara health /dev/sda
sudo sayonara health all  # Check all drives
```

#### Monitor drive continuously
```bash
sudo sayonara health /dev/sda --monitor
```

#### Manage self-encrypting drives
```bash
# Check SED status
sudo sayonara sed /dev/sda status

# Perform crypto erase
sudo sayonara sed /dev/sda crypto-erase

# Unlock locked drive
sudo sayonara sed /dev/sda unlock --password yourpassword
```

### Advanced Usage

#### Wipe all drives (DANGEROUS!)
```bash
sudo sayonara wipe-all --algorithm auto --cert-dir ./certificates --exclude /dev/sda,/dev/sdb
```

#### Force wipe unhealthy drive
```bash
sudo sayonara wipe /dev/sda --force --no-temp-check
```

#### Skip safety checks (EXTREMELY DANGEROUS!)
```bash
sudo sayonara --unsafe-mode wipe /dev/sda
```

#### Verify previous wipe
```bash
sudo sayonara verify /dev/sda --check-hidden
```

## 🔐 Security Features

### Multi-Layer Security
1. **Pre-wipe**: Freeze mitigation, HPA/DCO handling
2. **Wipe**: Multiple algorithms, hardware acceleration
3. **Post-wipe**: TRIM operations, verification
4. **Certificate**: Cryptographically signed proof

### Verification Methods
- Random sector sampling
- Entropy analysis
- Pattern detection
- TRIM effectiveness verification

## 📊 Performance Optimization

- **Parallel Operations**: Multiple drives simultaneously
- **Buffer Optimization**: 1MB buffers for efficiency
- **Hardware Acceleration**: Uses native commands when available
- **Smart Algorithm Selection**: Auto-selects fastest secure method

## 🛡️ Safety Mechanisms

### Default Protections
- System drive exclusion
- Mounted drive detection
- Confirmation prompts
- Temperature monitoring
- Health checks

### Override Options
- `--force`: Override health checks
- `--unsafe-mode`: Disable all safety checks
- `--no-unfreeze`: Skip freeze mitigation
- `--no-temp-check`: Disable temperature monitoring

## 📝 Certificate Generation

Each wipe generates a digitally signed certificate containing:
- Device identification (model, serial, size)
- Wipe algorithm used
- Timestamp and duration
- Verification results
- Entropy score
- Operator ID (if provided)

## 🔍 Supported Drive Types

### Hard Disk Drives (HDD)
- ATA Secure Erase
- Enhanced Secure Erase
- Multi-pass overwriting

### Solid State Drives (SSD)
- ATA Secure Erase
- TRIM operations
- Vendor-specific commands

### NVMe Drives
- Format NVM
- Sanitize (crypto, block, overwrite)
- Namespace management

### Self-Encrypting Drives
- OPAL 2.0/1.0
- TCG Enterprise
- eDrive (BitLocker)
- Proprietary (Samsung, Crucial, Intel)

## ⚠️ Important Warnings

1. **Data Loss**: All operations are IRREVERSIBLE
2. **System Safety**: Never wipe system drives while in use
3. **Backup**: Ensure all important data is backed up
4. **Verification**: Always verify the correct drive before wiping
5. **Legal**: Ensure you have authorization to wipe drives

## 🐛 Troubleshooting

### Drive is frozen
```bash
# Try automatic unfreezing
sudo sayonara wipe /dev/sda  # Will attempt unfreezing automatically

# Or manually check status
sudo hdparm -I /dev/sda | grep frozen
```

### Permission denied
```bash
# Ensure running as root
sudo sayonara list

# Check if drive is in use
lsof /dev/sda
```

### Temperature too high
```bash
# Wait for cooling
sudo sayonara health /dev/sda --monitor

# Or force (risky)
sudo sayonara wipe /dev/sda --no-temp-check
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- DoD 5220.22-M standard
- Peter Gutmann's secure deletion research
- NIST SP 800-88 guidelines
- Open source community

## ⚡ Quick Reference

| Command | Description |
|---------|-------------|
| `list` | Show all drives and capabilities |
| `wipe` | Securely erase a drive |
| `wipe-all` | Erase multiple drives |
| `verify` | Check if wipe was successful |
| `health` | Check drive health status |
| `sed` | Manage self-encrypting drives |

| Algorithm | Passes | Best For |
|-----------|--------|----------|
| `auto` | Varies | Automatic selection |
| `dod` | 3 | General purpose |
| `gutmann` | 35 | Maximum security |
| `secure` | 1 | Hardware acceleration |
| `crypto` | 1 | Self-encrypting drives |
| `trim` | 1 | SSDs only |

---

**Remember**: With great power comes great responsibility. Always double-check before wiping!