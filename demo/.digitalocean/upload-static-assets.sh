#!/usr/bin/env sh
set -e

# The Node.js buildpack has no rclone, so it's downloaded on every build
curl -fsSL -o /tmp/rclone.deb https://github.com/rclone/rclone/releases/download/v1.75.1/rclone-v1.75.1-linux-amd64.deb
dpkg-deb -x /tmp/rclone.deb /tmp/rclone

RCLONE_S3_ACCESS_KEY_ID="$STATIC_ASSETS_UPLOAD_ACCESS_KEY_ID" RCLONE_S3_SECRET_ACCESS_KEY="$STATIC_ASSETS_UPLOAD_SECRET_ACCESS_KEY" \
    /tmp/rclone/usr/bin/rclone copy demo/site/.next/static \
    :s3,provider=DigitalOcean,endpoint=fra1.digitaloceanspaces.com,no_check_bucket=true:dextinity-demo/site/_next/static \
    --header-upload "Cache-Control: public, max-age=31536000, immutable"
