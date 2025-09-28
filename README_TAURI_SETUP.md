# Tauri Setup Checklist

## Prerequisites
1. Install Rust toolchain: https://rustup.rs/
2. Install Node.js 16+ and npm
3. Install Tauri CLI: `npm install -g @tauri-apps/cli`

## Setup Commands
```bash
# Install Tauri API dependency
npm install @tauri-apps/api

# Build frontend
npm run build

# Run in development mode
npx tauri dev

# Build production installer
npx tauri build
```

## Expected Output
- Development: Opens app window with hot reload
- Production: Creates installer in `src-tauri/target/release/bundle/`
  - Windows: `sayonara_0.1.0_x64_en-US.msi`
  - macOS: `Sayonara.app` (DMG)
  - Linux: `sayonara_0.1.0_amd64.AppImage`

## Troubleshooting
- **Rust not found**: Run `rustup update` and restart terminal
- **Node version**: Use Node 16+ (check with `node --version`)
- **Build fails**: Ensure `dist/` exists after `npm run build`
- **Permission errors**: Run terminal as administrator (Windows) or with sudo (Linux/macOS)
