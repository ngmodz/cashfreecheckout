# Deploying to Vercel

This guide will help you deploy your Cashfree Checkout application to Vercel without breaking any functionality.

## Prerequisites

- A Vercel account (you can sign up at [vercel.com](https://vercel.com))
- Git installed on your computer
- Your Cashfree API credentials

## Step 1: Push Your Code to GitHub

1. Create a new GitHub repository
2. Push your code to the repository

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure your project:
   - Framework preset: Other
   - Root Directory: ./
   - Build Command: None (leave empty)
   - Output Directory: public
   - Install Command: npm install

## Step 3: Configure Environment Variables

The following environment variables need to be set up in Vercel:

| Variable Name | Description | Example |
|--------------|-------------|---------|
| `CASHFREE_APP_ID` | Your Cashfree App ID | app_1234567890abcdef |
| `CASHFREE_SECRET_KEY` | Your Cashfree Secret Key | secret_1234567890abcdef |
| `CASHFREE_ENVIRONMENT` | Environment to use (SANDBOX or PRODUCTION) | SANDBOX |
| `RETURN_URL` | URL to redirect after payment | https://your-domain.vercel.app/success |
| `NOTIFY_URL` | Webhook notification URL | https://your-domain.vercel.app/webhook |

To set up these variables:
1. In your Vercel project dashboard, go to "Settings" > "Environment Variables"
2. Add each variable with its corresponding value
3. Click "Save"

## Step 4: Deploy

1. Click "Deploy" in the Vercel dashboard
2. Wait for the deployment to complete
3. Your site will be live at `https://your-project-name.vercel.app`

## Verifying Functionality

After deployment, make sure to check:

1. The home page loads correctly
2. The checkout process works
3. Payments are processed correctly
4. Success/failure pages redirect properly
5. API endpoints respond correctly

If you encounter any issues, check the Vercel logs in the dashboard under "Deployments" > [latest deployment] > "View Logs".

## Updating Your Deployment

Any push to the main branch of your GitHub repository will automatically trigger a new deployment on Vercel.

## Note on Local Development vs. Vercel

- In your local development environment, you use `http://localhost:3000`
- On Vercel, you need to use your Vercel URL (e.g., `https://your-project-name.vercel.app`)
- Update any hardcoded URLs in your code to use environment variables or relative paths 