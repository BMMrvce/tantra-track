#!/bin/bash

set -u

trap 'echo "❌ Setup failed at line $LINENO"' ERR

echo "🚀 Tantratrack Setup Script"
echo "=========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo "✅ npm $(npm -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo ""

# Root dependencies
echo "📥 Installing root dependencies..."
if ! npm install; then
    echo "❌ Root dependency install failed"
    exit 1
fi

# Server dependencies
echo "📥 Installing server dependencies..."
cd server
if ! npm install; then
    echo "❌ Server dependency install failed"
    exit 1
fi
cd ..

# Client dependencies
echo "📥 Installing client dependencies..."
cd client
if ! npm install; then
    echo "❌ Client dependency install failed"
    exit 1
fi
cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "🎉 Setup Successful!"
echo ""
echo "📚 Next Steps:"
echo "1. Run: npm run dev"
echo "2. Open: http://localhost:3000"
echo "3. Start adding transactions!"
echo ""
echo "📖 For more help, see SETUP.md"
echo ""

if [ -t 1 ]; then
    read -r -p "Press Enter to exit setup..." _
fi
