@echo off
ECHO =====================================================
ECHO Cashfree Checkout - Vercel Deployment Setup
ECHO =====================================================
ECHO.
ECHO Before continuing, make sure you have:
ECHO 1. A Vercel account
ECHO 2. Your Cashfree API credentials
ECHO.

REM Install dependencies
ECHO Installing dependencies...
call npm install

REM Check if vercel CLI is installed
where vercel >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    ECHO Vercel CLI not found, installing...
    call npm install -g vercel
)

ECHO.
ECHO Instructions:
ECHO 1. Run 'vercel login' to log in to your Vercel account
ECHO 2. Run 'vercel' to set up your project
ECHO 3. When asked about the settings, use these options:
ECHO    - Framework preset: Other
ECHO    - Build Command: None (leave empty)
ECHO    - Output Directory: public
ECHO    - Install Command: npm install
ECHO.
ECHO 4. After deployment, set up these environment variables in Vercel:
ECHO    - CASHFREE_APP_ID
ECHO    - CASHFREE_SECRET_KEY
ECHO    - CASHFREE_ENVIRONMENT (SANDBOX or PRODUCTION)
ECHO    - RETURN_URL (your-vercel-url.vercel.app/success)
ECHO    - NOTIFY_URL (your-vercel-url.vercel.app/webhook)
ECHO.
ECHO 5. Finally, run 'vercel --prod' to deploy to production
ECHO.
ECHO =====================================================

REM Ask if user wants to proceed with login
SET /P LOGIN=Do you want to log in to Vercel now? (y/n): 
IF /I "%LOGIN%"=="y" (
    call vercel login
)

REM Ask if user wants to start deployment
SET /P DEPLOY=Do you want to deploy to Vercel now? (y/n): 
IF /I "%DEPLOY%"=="y" (
    call vercel
)

ECHO.
ECHO Setup complete! Remember to configure your environment variables in the Vercel dashboard.
PAUSE 