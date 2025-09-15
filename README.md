# Sayonara - Secure Drive Erasure Application

A professional cross-platform desktop application built with **Tauri v2**, **React**, and **Vite**.

## Quick Start

```bash
# 1. Extract and navigate
unzip Sayonara-V2-FIXED.zip && cd sayonara

# 2. Install dependencies
npm install

# 3. Start development server
npm run tauri:dev
```

## Issues FIXED

✅ **Fixed Cargo dependency errors** - Using simple version patterns instead of ranges  
✅ **Fixed version parsing errors** - `tauri = "2"` instead of `tauri = { version = ">=2.0.0" }`  
✅ **Fixed icon parsing errors** - Created proper working ICO and PNG files  
✅ **Removed emojis** - Clean, professional UI with SVG icons  
✅ **Fixed runtime invoke errors** - Proper Tauri v2 API implementation  

## Key Changes

### Cargo.toml Fix
**Before (caused errors):**
```toml
tauri = { version = ">=2.0.0", features = ["protocol-asset"] }
chrono = { features = ["serde"] }
```

**After (working):**
```toml
tauri = { version = "2", features = ["protocol-asset"] }
chrono = { version = "0.4", features = ["serde"] }
```

### UI Improvements
- Clean, professional interface without emojis
- Professional SVG icons
- Dark theme optimized for work
- Consistent typography and spacing

## Features

- Drive selection and erasure simulation
- Real-time logging with clean formatting
- Chat assistant with security expertise
- Certificate generation and verification
- ISO generation workflows
- Professional confirmation dialogs
- 100% safe mock operations

## Development

```bash
npm install          # Install dependencies
npm run tauri:dev    # Start development server
npm run tauri:build  # Build production release
```

This version should compile without any Cargo dependency errors.
