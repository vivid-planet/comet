#!/usr/bin/env bash

echo ""
echo "=== Installing oauth2-proxy ==="

releases=$(curl -s https://api.github.com/repos/oauth2-proxy/oauth2-proxy/releases/latest)
version=$(echo "$releases" | grep '"tag_name":' | sed -E 's/.*"v([^"]+)".*/\1/')
platform=$(uname -s | tr '[:upper:]' '[:lower:]')
architecture=$(uname -m)
filename=oauth2-proxy-v$version.$platform-$architecture/oauth2-proxy

if [ -f "$filename" ]; then
    echo "oauth2-proxy version $version already installed."
else
    echo "Download and extract oauth2-proxy version $version..."
    download_url=$(echo "$releases" | grep '"browser_download_url":' | grep "$version.$platform-$architecture.tar.gz\"" | grep -o 'https://[^"]*')
    echo $download_url
    wget -qO- $download_url | tar xvf -
fi

echo "Create symlink to oauth2-proxy binary"
ln -sf $filename ./.oauth2-proxy
echo "=== Finished installing oauth2-proxy ==="
