#!/bin/bash

# Script to install Node.js and npm on macOS
# This script will install Homebrew first (if not installed), then Node.js

set -e

echo "🔍 Checking for Homebrew..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "📦 Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for Apple Silicon Macs
    if [ -d "/opt/homebrew/bin" ]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.bash_profile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
    
    # Add Homebrew to PATH for Intel Macs
    if [ -d "/usr/local/bin" ]; then
        echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.bash_profile
        eval "$(/usr/local/bin/brew shellenv)"
    fi
else
    echo "✅ Homebrew is already installed"
    brew --version
fi

echo ""
echo "📦 Installing Node.js and npm..."
brew install node

echo ""
echo "✅ Installation complete!"
echo ""
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo ""
echo "⚠️  Please restart your terminal or run: source ~/.bash_profile"






















