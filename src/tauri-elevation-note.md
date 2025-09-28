# Tauri Elevation Requirements

## Windows
- True disk wiping requires elevated privileges (Administrator)
- Consider using NSIS installer with `RequestExecutionLevel admin`
- Add UAC manifest to your Tauri app for automatic elevation prompts
- Alternative: Create a separate elevated helper executable for wipe operations

## macOS
- Disk wiping requires root privileges or user authorization
- Consider using Authorization Services framework
- May need to prompt user for admin password during wipe operations

## Linux
- Disk operations typically require root privileges
- Consider using `pkexec` or similar for privilege escalation
- Some operations may work with proper udev rules

## Implementation Notes
- Never attempt to elevate privileges automatically without user consent
- Always inform users about privilege requirements before starting wipe operations
- Consider graceful degradation (simulation mode) when elevated privileges unavailable
