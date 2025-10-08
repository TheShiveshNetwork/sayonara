# Optimized I/O Engine

High-performance I/O engine for secure data wiping with drive-type-specific optimizations.

## Quick Start

```rust
use sayonara_wipe::io::{OptimizedIO, IOConfig};
use sayonara_wipe::DriveType;

// Configure for drive type
let config = match drive_type {
    DriveType::NVMe => IOConfig::nvme_optimized(),
    DriveType::SSD => IOConfig::sata_ssd_optimized(),
    DriveType::HDD => IOConfig::hdd_optimized(),
    _ => IOConfig::default(),
};

// Open device
let mut handle = OptimizedIO::open("/dev/sdb", config)?;

// Write data
OptimizedIO::sequential_write(&mut handle, total_size, |buffer| {
    // Fill buffer with data
    let buf = buffer.as_mut_slice();
    // ... populate buffer ...
    Ok(())
})?;

// Sync and print stats
handle.sync()?;
OptimizedIO::print_performance_report(&handle, None);
```

## Features

### 1. Drive-Specific Optimization

**NVMe Configuration**
- Buffer Size: 16MB
- Queue Depth: 32
- Temperature Threshold: 75°C
- Check Interval: 500MB

**SATA SSD Configuration**
- Buffer Size: 8MB
- Queue Depth: 8
- Temperature Threshold: 65°C
- Check Interval: 200MB

**HDD Configuration**
- Buffer Size: 4MB
- Queue Depth: 2
- Temperature Threshold: 55°C
- Check Interval: 50MB

### 2. Direct I/O

Bypasses OS page cache for:
- Immediate writes to physical media
- Reduced memory pressure
- Predictable performance
- Lower CPU overhead

### 3. Temperature Monitoring

Automatic throttling based on drive temperature:
```rust
// Automatic throttling
if temp < threshold => No throttling
if temp < threshold + 5 => Slow to 75%
if temp < threshold + 10 => Slow to 50%
if temp >= threshold + 10 => Pause for cooling
```

### 4. Buffer Pool

Efficient memory management:
- Pre-allocated aligned buffers
- Reusable across operations
- Automatic alignment for Direct I/O
- Pool statistics tracking

### 5. Performance Metrics

Detailed statistics after each operation:
```
📊 I/O Performance Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Total Written: 10.00 GB
  Duration: 45.23 seconds
  Throughput: 226.45 MB/s
  Avg Latency: 17.65 ms
  Operations: 2560
  ⚙️  Efficiency: 94.3% of drive max
  ✅ EXCELLENT: Achieved 95%+ efficiency target!

📦 Buffer Pool Statistics:
  Allocated Buffers: 8
  Available Buffers: 8
  Total Memory: 128.00 MB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## API Reference

### IOConfig

```rust
pub struct IOConfig {
    pub use_direct_io: bool,
    pub initial_buffer_size: usize,
    pub max_buffer_size: usize,
    pub queue_depth: usize,
    pub max_buffers: usize,
    pub temperature_threshold: u32,
    pub temperature_check_interval: u64,
    pub adaptive_tuning: bool,
    pub target_efficiency: f64,
}

impl IOConfig {
    fn default() -> Self;
    fn nvme_optimized() -> Self;
    fn sata_ssd_optimized() -> Self;
    fn hdd_optimized() -> Self;
    fn for_drive_speed(speed: DriveSpeed) -> Self;
}
```

### IOHandle

```rust
pub struct IOHandle {
    // Methods
    pub fn write_at(&mut self, data: &[u8], offset: u64) -> IOResult<usize>;
    pub fn write_buffer(&mut self, buffer: &PooledBuffer, offset: u64) -> IOResult<usize>;
    pub fn sync(&self) -> IOResult<()>;
    pub fn metrics(&self) -> Arc<IOMetrics>;
    pub fn acquire_buffer(&self) -> IOResult<PooledBuffer>;

    // Public fields
    pub device_path: String,
}
```

### OptimizedIO

```rust
impl OptimizedIO {
    pub fn open(device_path: &str, config: IOConfig) -> IOResult<IOHandle>;

    pub fn sequential_write<F>(
        handle: &mut IOHandle,
        total_size: u64,
        fill_buffer: F,
    ) -> IOResult<()>
    where
        F: FnMut(&mut PooledBuffer) -> IOResult<()>;

    pub fn print_performance_report(
        handle: &IOHandle,
        drive_max_speed_bps: Option<u64>
    );
}
```

### PooledBuffer

```rust
impl PooledBuffer {
    pub fn as_slice(&self) -> &[u8];
    pub fn as_mut_slice(&mut self) -> &mut [u8];
    // Auto-returns to pool on drop
}
```

## Platform Support

### Linux
- `O_DIRECT`: Direct I/O
- `O_DSYNC`: Synchronous writes
- `posix_fadvise()`: Sequential access hints
- `fdatasync()`: Fast sync

### Windows
- `FILE_FLAG_NO_BUFFERING`: Direct I/O
- `FILE_FLAG_WRITE_THROUGH`: Write-through
- `FlushFileBuffers()`: Sync

### macOS
- `F_NOCACHE`: Disable cache
- `F_FULLFSYNC`: Complete sync
- Write-through mode

## Error Handling

```rust
pub enum IOError {
    OperationFailed(String),
    AlignmentError(String),
    AllocationFailed(String),
    PlatformNotSupported(String),
    PerformanceDegraded(String),
    IoError(std::io::Error),
}

pub type IOResult<T> = Result<T, IOError>;
```

## Best Practices

### 1. Choose Correct Configuration

Always match configuration to drive type:
```rust
let config = match detected_drive_type {
    DriveType::NVMe => IOConfig::nvme_optimized(),
    DriveType::SSD => IOConfig::sata_ssd_optimized(),
    DriveType::HDD => IOConfig::hdd_optimized(),
    _ => IOConfig::default(),
};
```

### 2. Use Sequential Write Helper

Prefer `OptimizedIO::sequential_write()` over manual loops:
```rust
// GOOD
OptimizedIO::sequential_write(&mut handle, size, |buffer| {
    fill_data(buffer.as_mut_slice())?;
    Ok(())
})?;

// AVOID
let mut offset = 0;
while offset < size {
    let buf = handle.acquire_buffer()?;
    // ... manual offset tracking ...
    handle.write_buffer(&buf, offset)?;
    offset += buf.len();
}
```

### 3. Always Sync

Ensure data is written to physical media:
```rust
OptimizedIO::sequential_write(&mut handle, size, fill_fn)?;
handle.sync()?;  // IMPORTANT!
```

### 4. Monitor Performance

Use performance reports to verify efficiency:
```rust
OptimizedIO::print_performance_report(&handle, Some(drive_max_speed));
```

### 5. Handle Temperature Throttling

Trust automatic throttling - don't disable it:
```rust
// Temperature checks are automatic
// No manual intervention needed
```

## Examples

### Example 1: Simple Write

```rust
use sayonara_wipe::io::{OptimizedIO, IOConfig};

let config = IOConfig::sata_ssd_optimized();
let mut handle = OptimizedIO::open("/dev/sdb", config)?;
let size = 1024 * 1024 * 1024; // 1GB

OptimizedIO::sequential_write(&mut handle, size, |buffer| {
    buffer.as_mut_slice().fill(0x00);
    Ok(())
})?;

handle.sync()?;
OptimizedIO::print_performance_report(&handle, None);
```

### Example 2: Pattern Write

```rust
let pattern = [0x92, 0x49, 0x24];
let mut pattern_idx = 0;

OptimizedIO::sequential_write(&mut handle, size, |buffer| {
    let buf = buffer.as_mut_slice();
    for byte in buf.iter_mut() {
        *byte = pattern[pattern_idx % pattern.len()];
        pattern_idx += 1;
    }
    Ok(())
})?;
```

### Example 3: Random Data

```rust
use crate::crypto::secure_rng::secure_random_bytes;

OptimizedIO::sequential_write(&mut handle, size, |buffer| {
    secure_random_bytes(buffer.as_mut_slice())?;
    Ok(())
})?;
```

### Example 4: With Progress Tracking

```rust
use crate::ui::progress::ProgressBar;

let mut bytes_written = 0u64;
let mut bar = ProgressBar::new(48);

OptimizedIO::sequential_write(&mut handle, size, |buffer| {
    buffer.as_mut_slice().fill(0xFF);

    bytes_written += buffer.as_slice().len() as u64;
    let progress = (bytes_written as f64 / size as f64) * 100.0;
    bar.render(progress, Some(bytes_written), Some(size));

    Ok(())
})?;
```

## Performance Tips

1. **Use Direct I/O**: Enabled by default, provides best performance
2. **Match Buffer Size**: Larger buffers for faster drives
3. **Adjust Queue Depth**: Higher for NVMe, lower for HDD
4. **Monitor Temperature**: Let auto-throttling prevent thermal issues
5. **Benchmark**: Use performance reports to tune configuration

## Troubleshooting

### "Alignment Error"
Direct I/O requires aligned buffers. Use `IOHandle::acquire_buffer()` instead of manual allocation.

### "Operation Failed"
Check device permissions and ensure device is not mounted.

### "Performance Degraded"
May indicate drive throttling or hardware issues. Check SMART data.

### "Platform Not Supported"
Some features may not be available on all platforms. Will fall back to standard I/O.

## Module Structure

```
io/
├── mod.rs              - Public API, enums, types
├── optimized_engine.rs - Core engine implementation
├── buffer_pool.rs      - Buffer management
├── metrics.rs          - Performance tracking
├── platform_specific.rs- Platform abstractions
└── tests.rs            - Unit tests
```

## See Also

- `src/algorithms/` - Wipe algorithms using this engine
- `src/drives/` - Drive detection and capabilities
- `CLAUDE.md` - Project architecture overview
- `IO_MIGRATION_COMPLETE.md` - Migration details
