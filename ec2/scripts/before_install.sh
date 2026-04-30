#!/bin/bash
echo "🧹 Cleaning up old deployment..."

APP_DIR="/home/ec2-user/sour-mango"

# Stop any running PM2 process first (important)
pm2 stop sour-mango || true
pm2 delete sour-mango || true

# Remove old application directory completely
sudo rm -rf "$APP_DIR"

# Recreate clean directory
mkdir -p "$APP_DIR"

# Ensure correct ownership (VERY important for npm later)
sudo chown -R ec2-user:ec2-user "$APP_DIR"

echo "✅ Cleanup complete"