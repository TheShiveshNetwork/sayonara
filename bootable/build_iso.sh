#!/bin/bash

# Build bootable ISO with Sayonara Wipe tool
# This creates a minimal Linux environment that boots directly into the wipe tool

set -e

WORK_DIR=$(pwd)/bootable
ISO_DIR=$WORK_DIR/iso
INITRD_DIR=$WORK_DIR/initrd

# Clean previous builds
rm -rf $ISO_DIR $INITRD_DIR
mkdir -p $ISO_DIR/boot $INITRD_DIR

# Build the Rust application
cargo build --release --target x86_64-unknown-linux-musl

# Create initrd structure
mkdir -p $INITRD_DIR/{bin,sbin,etc,proc,sys,dev,tmp,mnt}

# Copy essential binaries
cp target/x86_64-unknown-linux-musl/release/sayonara-wipe $INITRD_DIR/bin/
cp /bin/busybox $INITRD_DIR/bin/
cp /usr/sbin/smartctl $INITRD_DIR/sbin/
cp /usr/sbin/hdparm $INITRD_DIR/sbin/
cp /usr/bin/nvme $INITRD_DIR/bin/

# Create symlinks for busybox
cd $INITRD_DIR/bin
for cmd in sh ls cat echo mount umount mkdir rmdir cp mv rm; do
    ln -sf busybox $cmd
done
cd - > /dev/null

# Create init script
cat > $INITRD_DIR/init << 'EOF'
#!/bin/sh

# Mount essential filesystems
mount -t proc proc /proc
mount -t sysfs sysfs /sys
mount -t devtmpfs devtmpfs /dev

# Load necessary modules
modprobe ahci
modprobe nvme
modprobe usb-storage

# Wait for devices to settle
sleep 3

# Clear screen and show banner
clear
echo "=================================================="
echo "    SAYONARA - Secure Data Wiping System"
echo "    SIH 2025 - Team Sayonara"
echo "=================================================="
echo

# Auto-detect and list drives
echo "Detecting storage devices..."
/bin/sayonara-wipe list

echo
echo "Available commands:"
echo "  sayonara-wipe list                    - List all drives"
echo "  sayonara-wipe wipe /dev/sdX          - Wipe specific drive"
echo "  sayonara-wipe verify /dev/sdX        - Verify wipe"
echo "  poweroff                             - Shutdown system"
echo

# Start interactive shell
exec /bin/sh
EOF

chmod +x $INITRD_DIR/init

# Create initrd
cd $INITRD_DIR
find . | cpio -o -H newc | gzip > $ISO_DIR/boot/initrd.gz
cd - > /dev/null

# Copy kernel (you'll need to build or obtain a suitable kernel)
# For now, assume kernel is available
cp /boot/vmlinuz-$(uname -r) $ISO_DIR/boot/vmlinuz

# Create isolinux config
mkdir -p $ISO_DIR/boot/isolinux
cat > $ISO_DIR/boot/isolinux/isolinux.cfg << 'EOF'
DEFAULT sayonara
LABEL sayonara
    KERNEL /boot/vmlinuz
    APPEND initrd=/boot/initrd.gz quiet
PROMPT 0
TIMEOUT 10
EOF

# Copy isolinux files
cp /usr/lib/ISOLINUX/isolinux.bin $ISO_DIR/boot/isolinux/
cp /usr/lib/syslinux/modules/bios/ldlinux.c32 $ISO_DIR/boot/isolinux/

# Create ISO
genisoimage -o sayonara-wipe.iso \
    -b boot/isolinux/isolinux.bin \
    -c boot/isolinux/boot.cat \
    -no-emul-boot \
    -boot-load-size 4 \
    -boot-info-table \
    -J -R -V "SAYONARA-WIPE" \
    $ISO_DIR

echo "Bootable ISO created: sayonara-wipe.iso"
