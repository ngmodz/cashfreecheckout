@echo off
setlocal enabledelayedexpansion

echo 🚀 Setting up CashFree Popup Checkout Integration...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm is installed
npm --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

REM Check if .env file exists
if not exist ".env" (
    echo ⚙️  Creating .env file from template...
    copy ".env.template" ".env" >nul
    echo ✅ .env file created
    echo.
    echo 🔧 IMPORTANT: Please update the .env file with your CashFree credentials:
    echo    - CASHFREE_APP_ID=your_actual_app_id
    echo    - CASHFREE_SECRET_KEY=your_actual_secret_key
    echo.
    echo 📝 You can get your credentials from CashFree Dashboard:
    echo    https://www.cashfree.com/ → Developers → API Keys
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo    1. Update .env file with your CashFree credentials
echo    2. Run 'npm run dev' to start the development server
echo    3. Visit http://localhost:3000 to test the integration
echo.
echo 🔧 Available commands:
echo    npm run dev   - Start development server with auto-reload
echo    npm start     - Start production server
echo.
echo 📚 Documentation:
echo    - Project README: ./README.md
echo    - CashFree Docs: https://docs.cashfree.com/
echo.
echo Happy coding! 🚀
pause
