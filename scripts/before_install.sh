#!/bin/bash
echo "🧹 Cleaning up old deployment artifacts..."

# Stop running app first (important)
pm2 stop sour-mango || true
pm2 delete sour-mango || true

# Remove old app ONLY if needed
rm -rf /home/ec2-user/sour-mango

echo "✅ Cleanup complete"