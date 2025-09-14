# Sayonara Wipe - Secure Data Wiping Tool

**SIH 2025 - Team Sayonara**

A comprehensive secure data wiping solution built in Rust that provides military-grade data destruction with cryptographic verification and compliance certification.

## Features

### Core Wiping Algorithms
- **DoD 5220.22-M**: 3-pass Department of Defense standard (zeros, ones, random)
- **Gutmann Method**: 35-pass algorithm for maximum security
- **Random Wipe**: Single-pass cryptographically secure random overwrite
- **Hardware Secure Erase**: Native SSD/NVMe secure erase commands

### Drive Support
- **SSD**: Hardware secure erase via ATA commands
- **NVMe**: Format NVM and Sanitize operations
- **HDD**: Software and hardware secure erase methods
- **USB**: Standard wiping algorithms
- **Encrypted Drives**: LUKS, BitLocker, and OPAL detection

### Security Features
- **Verification System**: Post-wipe recovery testing with entropy analysis
- **Digital Certificates**: Cryptographically signed wipe certificates
- **Bootable Environment**: Isolated Linux environment for secure operations
- **Chain of Custody**: Detailed logging and audit trails

## Architecture

```
sayonara-wipe/
├── bootable/           # Bootable ISO generation
├── src/
│   ├── algorithms/     # Wiping algorithms (DoD, Gutmann, Random)
│   ├── drives/         # Drive detection and hardware-specific operations
│   ├── verification/   # Post-wipe verification and recovery testing
│   ├── crypto/         # Certificate generation and cryptographic operations
│   ├── lib.rs         # Core data structures and types
│   └── main.rs        # CLI interface and main application logic
└── Cargo.toml         # Dependencies and build configuration
```

## Installation

### Prerequisites
- Rust 1.70+ with `x86_64-unknown-linux-musl` target
- Linux system with root privileges
- Required system tools: `smartctl`, `hdparm`, `nvme`, `cryptsetup`, `sedutil-cli`

### Build from Source
```bash
# Clone repository
git clone <repository-url>
cd sayonara-wipe

# Add musl target for static compilation
rustup target add x86_64-unknown-linux-musl

# Build release binary
cargo build --release --target x86_64-unknown-linux-musl

# Install system dependencies (Ubuntu/Debian)
sudo apt install smartmontools hdparm nvme-cli cryptsetup-bin

# Build bootable ISO (optional)
./bootable/build_iso.sh
```

## Usage

### Command Line Interface

#### List Available Drives
```bash
sudo ./target/x86_64-unknown-linux-musl/release/sayonara-wipe list
```

#### Wipe a Drive
```bash
# DoD 3-pass wipe with verification
sudo ./sayonara-wipe wipe /dev/sda --algorithm dod --cert-output wipe_cert.json

# Hardware secure erase (SSD/NVMe)
sudo ./sayonara-wipe wipe /dev/nvme0n1 --algorithm secure

# Skip verification (faster)
sudo ./sayonara-wipe wipe /dev/sdb --no-verify
```

#### Verify Previous Wipe
```bash
sudo ./sayonara-wipe verify /dev/sda
```

### Bootable Environment

1. **Create Bootable Media**:
   ```bash
   ./bootable/build_iso.sh
   dd if=sayonara-wipe.iso of=/dev/sdX bs=4M status=progress
   ```

2. **Boot from USB/DVD** and use the interactive shell:
   ```bash
   sayonara-wipe list
   sayonara-wipe wipe /dev/sda
   poweroff
   ```

## Algorithms

### DoD 5220.22-M (Default)
- **Pass 1**: Overwrite with zeros (0x00)
- **Pass 2**: Overwrite with ones (0xFF)  
- **Pass 3**: Overwrite with random data
- **Compliance**: US Department of Defense standard
- **Time**: ~3x drive capacity write time

### Gutmann Method
- **Passes**: 35 specialized patterns
- **Security**: Maximum theoretical security for older drives
- **Time**: ~35x drive capacity write time
- **Use Case**: Ultra-high security requirements

### Hardware Secure Erase
- **SSD**: ATA Security Erase command
- **NVMe**: Format NVM or Sanitize operations
- **Speed**: Fastest option (seconds to minutes)
- **Security**: Cryptographic key destruction

## Security Features

### Verification System
The verification module performs comprehensive post-wipe analysis:

- **Entropy Analysis**: Shannon entropy calculation to detect patterns
- **Recovery Testing**: Attempts to recover data from random sectors
- **Pattern Detection**: Identifies remnants of common file signatures
- **Compliance Scoring**: Generates security score based on multiple factors

### Digital Certificates
Each wipe operation generates a cryptographically signed certificate containing:

```json
{
  "certificate_id": "uuid",
  "device_info": {
    "device_path": "/dev/sda",
    "model": "Samsung SSD 980",
    "serial": "S123456789",
    "size": 1000204886016,
    "device_hash": "sha256_hash"
  },
  "wipe_details": {
    "algorithm_used": "dod",
    "passes_completed": 3,
    "duration_seconds": 3600
  },
  "verification": {
    "verified": true,
    "entropy_score": 7.95,
    "recovery_test_passed": true
  },
  "timestamp": "2025-01-15T10:30:00Z",
  "signature": "cryptographic_signature"
}
```

## Safety Features

### Confirmation System
- Interactive confirmation required for destructive operations
- Drive information displayed before wiping
- Type "YES" requirement prevents accidental wipes

### Drive Detection
- Automatic detection of drive type (SSD/HDD/NVMe/USB)
- Encryption status identification (LUKS, BitLocker, OPAL)
- Model and serial number verification

### Error Handling
- Comprehensive error checking and reporting
- Graceful handling of frozen drives and permission issues
- Progress indicators and status updates

## Compliance Standards

- **DoD 5220.22-M**: US Department of Defense data sanitization
- **NIST SP 800-88**: National Institute of Standards guidelines
- **Common Criteria**: Security evaluation standard compatibility
- **Chain of Custody**: Full audit trail maintenance

## Development

### Project Structure
- `algorithms/`: Implements various wiping methods
- `drives/`: Hardware-specific operations and detection
- `verification/`: Post-wipe validation and testing
- `crypto/`: Certificate generation and cryptographic functions

### Key Dependencies
- `tokio`: Async runtime for concurrent operations
- `clap`: Command-line argument parsing
- `serde`: Serialization for certificates and configuration
- `rand`: Cryptographically secure random number generation
- `sha2`: SHA-256 hashing for certificates and verification
- `chrono`: Timestamp handling
- `anyhow`: Error handling and propagation

## Limitations

- Requires root privileges for direct drive access
- Hardware secure erase may not work on frozen drives
- Some USB drives may not support secure erase commands
- Verification is statistical and cannot guarantee 100% data destruction
- Modern SSDs with wear leveling may retain data in spare blocks

## Security Considerations

- Run in isolated environment when possible (bootable mode)
- Verify certificates using public key infrastructure
- Consider physical destruction for ultra-sensitive data
- Multiple wipe passes may not be necessary for modern SSDs
- Hardware encryption key destruction often more effective than overwriting

## Support

This tool is designed for SIH 2025 and follows industry best practices for secure data destruction. For technical questions or issues, refer to the source code documentation and industry standards.

## License

[License information to be added]

## Disclaimer

This tool permanently destroys data. Users are responsible for ensuring proper backups and confirming target drives before operation. The developers are not liable for any data loss resulting from improper use.