#!/bin/bash
MODE=$1
DRIVE_ID=$2
WIPE_OS=$3

if [ -z "$MODE" ] || [ -z "$DRIVE_ID" ]; then
    echo "Usage: $0 <mode> <drive_id> <wipe_os>"
    exit 1
fi

echo "=== Sayonora Mock Erasure Process ==="
echo "Mode: $MODE"
echo "Drive: $DRIVE_ID"
echo "Wipe OS: $WIPE_OS"
echo ""

echo "Detecting drive..."
sleep 1
echo "Drive detected and accessible"
echo "Drive size: 1024 GB"
echo ""

for i in $(seq 1 10); do
    echo "Pass 1/3: Overwriting with random data - $(( i * 10 ))%"
    sleep 0.2
done

echo ""
echo "Erasure process completed successfully!"
echo "ERASURE SUCCESSFUL - DRIVE IS SECURE"

exit 0