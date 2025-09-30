// Implementations for PCIe, ACPI, USB, and IPMI strategies

use super::{UnfreezeStrategy, StrategyResult};
use crate::drives::freeze::detection::FreezeReason;
use anyhow::{Result, anyhow};
use std::process::Command;
use std::fs;
use std::thread;
use std::time::Duration;

// ===== PCIe Hot Reset =====

pub struct PcieHotReset;

impl PcieHotReset {
    pub fn new() -> Self { Self }
}

impl UnfreezeStrategy for PcieHotReset {
    fn name(&self) -> &str { "PCIe Hot Reset" }
    fn description(&self) -> &str {
        "Triggers PCIe hot-reset through sysfs to reset controller"
    }
    fn is_compatible_with(&self, reason: &FreezeReason) -> bool {
        matches!(reason, FreezeReason::ControllerPolicy | FreezeReason::Unknown)
    }
    fn is_available(&self) -> bool {
        std::path::Path::new("/sys/bus/pci/rescan").exists()
    }
    fn execute(&self, _device_path: &str, _reason: &FreezeReason) -> Result<StrategyResult> {
        println!("      🔌 Executing PCIe hot-reset");

        // Remove device
        fs::write("/sys/bus/pci/devices/0000:00:1f.2/remove", "1")?;
        thread::sleep(Duration::from_secs(2));

        // Rescan
        fs::write("/sys/bus/pci/rescan", "1")?;
        thread::sleep(Duration::from_secs(5));

        Ok(StrategyResult::success("PCIe hot-reset completed"))
    }
    fn risk_level(&self) -> u8 { 7 }
}

// ===== ACPI Sleep =====

pub struct AcpiSleep;

impl AcpiSleep {
    pub fn new() -> Self { Self }
}

impl UnfreezeStrategy for AcpiSleep {
    fn name(&self) -> &str { "ACPI Sleep" }
    fn description(&self) -> &str {
        "System sleep/wake cycle (S3 state) to reset drive"
    }
    fn is_compatible_with(&self, reason: &FreezeReason) -> bool {
        matches!(reason, FreezeReason::BiosSetFrozen | FreezeReason::Unknown)
    }
    fn is_available(&self) -> bool {
        std::path::Path::new("/sys/power/state").exists()
    }
    fn execute(&self, _device_path: &str, _reason: &FreezeReason) -> Result<StrategyResult> {
        println!("      💤 Attempting ACPI sleep/wake");

        // Attempt sleep
        let result = fs::write("/sys/power/state", b"mem");

        if result.is_ok() {
            // System will sleep and wake
            thread::sleep(Duration::from_secs(3));
            Ok(StrategyResult::success("Sleep/wake cycle completed"))
        } else {
            Err(anyhow!("ACPI sleep not available or failed"))
        }
    }
    fn risk_level(&self) -> u8 { 9 } // Very high - affects entire system
}

// ===== USB Suspend =====

pub struct UsbSuspend;

impl UsbSuspend {
    pub fn new() -> Self { Self }

    fn find_usb_device(&self, device_path: &str) -> Result<String> {
        use std::path::Path;

        let device_name = Path::new(device_path)
            .file_name()
            .and_then(|n| n.to_str())
            .ok_or_else(|| anyhow!("Invalid path"))?;

        let sys_path = format!("/sys/block/{}/device", device_name);
        let real_path = fs::read_link(&sys_path)?;
        let path_str = real_path.to_string_lossy();

        if path_str.contains("usb") {
            // Find authorize file
            let mut current = real_path.as_path();
            while let Some(parent) = current.parent() {
                let auth_path = parent.join("authorized");
                if auth_path.exists() {
                    return Ok(auth_path.to_string_lossy().to_string());
                }
                current = parent;
            }
        }

        Err(anyhow!("Not a USB device"))
    }
}

impl UnfreezeStrategy for UsbSuspend {
    fn name(&self) -> &str { "USB Suspend/Resume" }
    fn description(&self) -> &str {
        "Power cycles USB device through sysfs authorization"
    }
    fn is_compatible_with(&self, _reason: &FreezeReason) -> bool {
        true // Works for USB devices
    }
    fn is_available(&self) -> bool {
        true // Always available for USB devices
    }
    fn execute(&self, device_path: &str, _reason: &FreezeReason) -> Result<StrategyResult> {
        println!("      🔌 USB suspend/resume");

        let auth_path = self.find_usb_device(device_path)?;

        // Deauthorize
        fs::write(&auth_path, b"0")?;
        thread::sleep(Duration::from_secs(2));

        // Reauthorize
        fs::write(&auth_path, b"1")?;
        thread::sleep(Duration::from_secs(5));

        Ok(StrategyResult::success("USB power cycle completed"))
    }
    fn risk_level(&self) -> u8 { 3 }
}

// ===== IPMI Power =====

pub struct IpmiPower;

impl IpmiPower {
    pub fn new() -> Self { Self }
}

impl UnfreezeStrategy for IpmiPower {
    fn name(&self) -> &str { "IPMI Power Cycle" }
    fn description(&self) -> &str {
        "Uses IPMI to power cycle the system (server environments)"
    }
    fn is_compatible_with(&self, _reason: &FreezeReason) -> bool {
        true // Works for all as nuclear option
    }
    fn is_available(&self) -> bool {
        Command::new("ipmitool")
            .arg("power")
            .arg("status")
            .output()
            .map(|o| o.status.success())
            .unwrap_or(false)
    }
    fn execute(&self, _device_path: &str, _reason: &FreezeReason) -> Result<StrategyResult> {
        println!("      ⚡ IPMI power cycle");
        println!("      ⚠️  This will reboot the system!");

        // Give user time to cancel
        thread::sleep(Duration::from_secs(5));

        let output = Command::new("ipmitool")
            .args(["power", "cycle"])
            .output()?;

        if output.status.success() {
            Ok(StrategyResult::success("IPMI power cycle initiated"))
        } else {
            Err(anyhow::anyhow!("IPMI power cycle failed"))
        }
    }
    fn estimated_duration(&self) -> u64 { 120 } // 2 minutes
    fn risk_level(&self) -> u8 { 10 } // Maximum - reboots system
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_all_strategies_have_names() {
        assert_eq!(PcieHotReset::new().name(), "PCIe Hot Reset");
        assert_eq!(AcpiSleep::new().name(), "ACPI Sleep");
        assert_eq!(UsbSuspend::new().name(), "USB Suspend/Resume");
        assert_eq!(IpmiPower::new().name(), "IPMI Power Cycle");
    }

    #[test]
    fn test_risk_levels() {
        assert!(PcieHotReset::new().risk_level() >= 5);
        assert!(AcpiSleep::new().risk_level() >= 8);
        assert_eq!(IpmiPower::new().risk_level(), 10);
    }
}
