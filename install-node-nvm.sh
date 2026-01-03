#!/bin/bash

# Script to install Node.js and npm using NVM (no sudo required)
# NVM installs Node.js in your home directory, so no password needed

set -e

echo "🔍 Installing NVM (Node Version Manager)..."

# Install NVM
if [ ! -d "$HOME/.nvm" ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    
    # Load NVM immediately
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    
    echo "✅ NVM installed successfully"
else
    echo "✅ NVM is already installed"
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

echo ""
echo "📦 Installing latest LTS version of Node.js..."
nvm install --lts
nvm use --lts
nvm alias default node

echo ""
echo "✅ Installation complete!"
echo ""
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo ""
echo "⚠️  Please restart your terminal or run: source ~/.bash_profile"
echo "   NVM will be automatically loaded in new bash terminals"





















