#!/bin/bash

# CashFree Popup Checkout - Quick Setup Script

echo "🚀 Setting up CashFree Popup Checkout Integration..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm is installed: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file from template..."
    cp .env.template .env
    echo "✅ .env file created"
    echo ""
    echo "🔧 IMPORTANT: Please update the .env file with your CashFree credentials:"
    echo "   - CASHFREE_APP_ID=your_actual_app_id"
    echo "   - CASHFREE_SECRET_KEY=your_actual_secret_key"
    echo ""
    echo "📝 You can get your credentials from CashFree Dashboard:"
    echo "   https://www.cashfree.com/ → Developers → API Keys"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Update .env file with your CashFree credentials"
echo "   2. Run 'npm run dev' to start the development server"
echo "   3. Visit http://localhost:3000 to test the integration"
echo ""
echo "🔧 Available commands:"
echo "   npm run dev   - Start development server with auto-reload"
echo "   npm start     - Start production server"
echo ""
echo "📚 Documentation:"
echo "   - Project README: ./README.md"
echo "   - CashFree Docs: https://docs.cashfree.com/"
echo ""
echo "Happy coding! 🚀"
