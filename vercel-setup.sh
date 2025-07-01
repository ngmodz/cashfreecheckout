#!/bin/bash

# This script helps set up the project for Vercel deployment

# Install dependencies
npm install

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found, installing..."
    npm install -g vercel
fi

# Instructions
echo "====================================================="
echo "Cashfree Checkout - Vercel Deployment Setup"
echo "====================================================="
echo ""
echo "Before continuing, make sure you have:"
echo "1. A Vercel account"
echo "2. Your Cashfree API credentials"
echo ""
echo "Instructions:"
echo "1. Run 'vercel login' to log in to your Vercel account"
echo "2. Run 'vercel' to set up your project"
echo "3. When asked about the settings, use these options:"
echo "   - Framework preset: Other"
echo "   - Build Command: None (leave empty)"
echo "   - Output Directory: public"
echo "   - Install Command: npm install"
echo ""
echo "4. After deployment, set up these environment variables in Vercel:"
echo "   - CASHFREE_APP_ID"
echo "   - CASHFREE_SECRET_KEY"
echo "   - CASHFREE_ENVIRONMENT (SANDBOX or PRODUCTION)"
echo "   - RETURN_URL (your-vercel-url.vercel.app/success)"
echo "   - NOTIFY_URL (your-vercel-url.vercel.app/webhook)"
echo ""
echo "5. Finally, run 'vercel --prod' to deploy to production"
echo ""
echo "====================================================="

# Ask if user wants to proceed with login
read -p "Do you want to log in to Vercel now? (y/n): " answer
if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
    vercel login
fi

# Ask if user wants to start deployment
read -p "Do you want to deploy to Vercel now? (y/n): " answer
if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
    vercel
fi

echo ""
echo "Setup complete! Remember to configure your environment variables in the Vercel dashboard." 