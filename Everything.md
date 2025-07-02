# Everything: The Ultimate CashFree Checkout Integration Guide

This document provides the most comprehensive, A-to-Z guide to CashFree Payment Integration ever created. It includes deep technical dives, complete code implementations, architectural patterns, security best practices, production deployment strategies, troubleshooting guides, and real-world examples. This guide covers every single aspect of building a production-ready CashFree checkout system.

## 🎯 What You'll Learn
- Complete CashFree API integration from scratch to production
- Advanced payment flow optimization and user experience design
- Security implementation including webhook verification and fraud prevention
- Performance optimization and scaling strategies
- Error handling and recovery mechanisms
- Testing strategies for payment systems
- Production deployment and monitoring
- Compliance and regulatory considerations

## 📚 Table of Contents

### 🏗️ **PART I: FOUNDATION & SETUP**
1.  [Project Philosophy & Architecture](#1-project-philosophy--architecture)
2.  [Core Technologies Deep Dive](#2-core-technologies-deep-dive)
3.  [Complete Project Setup Guide](#3-complete-project-setup-guide)
    -   [Prerequisites & Environment](#prerequisites--environment)
    -   [Installation & Configuration](#installation--configuration)
    -   [Environment Variables Master Guide](#environment-variables-master-guide)
    -   [CashFree Account Setup](#cashfree-account-setup)
4.  [System Architecture & Design Patterns](#4-system-architecture--design-patterns)
    -   [Project Structure Deep Dive](#project-structure-deep-dive)
    -   [Data Flow Architecture](#data-flow-architecture)
    -   [Security Architecture](#security-architecture)

### 💻 **PART II: BACKEND IMPLEMENTATION**
5.  [Server Implementation Masterclass](#5-server-implementation-masterclass)
    -   [Express Server Deep Dive](#express-server-deep-dive)
    -   [Middleware Chain Optimization](#middleware-chain-optimization)
    -   [Route Management](#route-management)
6.  [Payment API Implementation](#6-payment-api-implementation)
    -   [Order Creation Endpoint](#order-creation-endpoint)
    -   [Payment Status Management](#payment-status-management)
    -   [Webhook Handler Implementation](#webhook-handler-implementation)
    -   [Advanced Error Handling](#advanced-error-handling)
7.  [Data Management & Persistence](#7-data-management--persistence)
    -   [CreditManager Class Deep Dive](#creditmanager-class-deep-dive)
    -   [File System vs Database Strategies](#file-system-vs-database-strategies)
    -   [Data Integrity & Concurrency](#data-integrity--concurrency)

### 🎨 **PART III: FRONTEND IMPLEMENTATION**
8.  [Frontend Architecture & UX Design](#8-frontend-architecture--ux-design)
    -   [Checkout Page Implementation](#checkout-page-implementation)
    -   [SDK Integration Strategies](#sdk-integration-strategies)
    -   [Form Validation & User Feedback](#form-validation--user-feedback)
9.  [Payment Flow Optimization](#9-payment-flow-optimization)
    -   [Fast Failure Detection System](#fast-failure-detection-system)
    -   [Polling vs Callback Strategies](#polling-vs-callback-strategies)
    -   [User Experience Optimization](#user-experience-optimization)

### 🔒 **PART IV: SECURITY & COMPLIANCE**
10. [Security Implementation Guide](#10-security-implementation-guide)
    -   [Webhook Signature Verification](#webhook-signature-verification)
    -   [Input Validation & Sanitization](#input-validation--sanitization)
    -   [PCI Compliance Considerations](#pci-compliance-considerations)
11. [Fraud Prevention & Risk Management](#11-fraud-prevention--risk-management)
    -   [Transaction Monitoring](#transaction-monitoring)
    -   [Rate Limiting & DDoS Protection](#rate-limiting--ddos-protection)
    -   [Suspicious Activity Detection](#suspicious-activity-detection)

### 📊 **PART V: TESTING & MONITORING**
12. [Testing Strategies](#12-testing-strategies)
    -   [Unit Testing Payment Logic](#unit-testing-payment-logic)
    -   [Integration Testing with CashFree](#integration-testing-with-cashfree)
    -   [End-to-End Testing Scenarios](#end-to-end-testing-scenarios)
13. [Monitoring & Analytics](#13-monitoring--analytics)
    -   [Performance Monitoring](#performance-monitoring)
    -   [Payment Analytics](#payment-analytics)
    -   [Error Tracking & Alerting](#error-tracking--alerting)

### 🚀 **PART VI: DEPLOYMENT & PRODUCTION**
14. [Production Deployment Guide](#14-production-deployment-guide)
    -   [Environment Configuration](#environment-configuration)
    -   [Database Migration Strategies](#database-migration-strategies)
    -   [SSL & HTTPS Configuration](#ssl--https-configuration)
15. [Scaling & Performance Optimization](#15-scaling--performance-optimization)
    -   [Load Balancing Strategies](#load-balancing-strategies)
    -   [Caching Implementation](#caching-implementation)
    -   [Database Optimization](#database-optimization)
16. [Maintenance & Support](#16-maintenance--support)
    -   [Troubleshooting Guide](#troubleshooting-guide)
    -   [Common Issues & Solutions](#common-issues--solutions)
    -   [Version Upgrade Strategies](#version-upgrade-strategies)

---

## 1. Project Philosophy & Architecture

### 🎯 Core Philosophy

This CashFree checkout integration is built on **five fundamental principles** that distinguish it from basic implementations:

#### 1. **User-Centric Design**
- **Zero Friction**: Users should never be confused or lost during payment
- **Instant Feedback**: Every action provides immediate, clear response
- **Graceful Failures**: Failed payments are detected and communicated within 3-5 seconds
- **Mobile-First**: Responsive design optimized for mobile payment flows

#### 2. **Production-Ready Architecture**
- **Scalability**: Designed to handle thousands of concurrent payments
- **Reliability**: Multiple fallback mechanisms for critical operations
- **Maintainability**: Clean separation of concerns with clear interfaces
- **Observability**: Comprehensive logging and monitoring throughout

#### 3. **Security-First Approach**
- **Defense in Depth**: Multiple layers of security validation
- **PCI Compliance**: Follows payment industry security standards
- **Data Protection**: Minimal data storage with secure handling
- **Fraud Prevention**: Built-in suspicious activity detection

#### 4. **Developer Experience**
- **Clear Documentation**: Every function and endpoint documented
- **Easy Configuration**: Environment-based setup with validation
- **Debugging Support**: Comprehensive logging and error messages
- **Testing Support**: Built-in test modes and mock capabilities

#### 5. **Business Continuity**
- **High Availability**: Resilient to service disruptions
- **Data Integrity**: Atomic operations prevent data corruption
- **Recovery Mechanisms**: Automatic retry and fallback strategies
- **Audit Trail**: Complete transaction history and compliance logging

### 🏛️ Architectural Patterns

#### Model-View-Controller (MVC) Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     VIEW        │    │   CONTROLLER    │    │     MODEL       │
│                 │    │                 │    │                 │
│ • index.html    │◄──►│ • server.js     │◄──►│ • creditManager │
│ • success.html  │    │ • payment.js    │    │ • credits.json  │
│ • failure.html  │    │ • middleware    │    │ • data logic    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Event-Driven Architecture

```
Payment Events Flow:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │───►│  Frontend   │───►│   Backend   │───►│  CashFree   │
│   Action    │    │   Events    │    │   Events    │    │   Events    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       ▲                   ▲                   ▲                   │
       │                   │                   │                   │
       └───────────────────┼───────────────────┼───────────────────┘
                           │                   │
                    Status Updates     Webhook Events
```

### 🔄 Key Architectural Decisions

#### Why File-Based Storage for Demo?
- **Learning Focus**: Eliminates database complexity for educational purposes
- **Portability**: Runs anywhere without external dependencies
- **Visibility**: Easy to inspect data during development
- **Migration Path**: Clear upgrade path to production databases

#### Why Axios over CashFree SDK for Backend?
- **Timeout Control**: Granular control over request timeouts
- **Error Handling**: Better error message extraction and handling
- **Debugging**: Easier to log and inspect HTTP requests
- **Flexibility**: Can easily switch to different HTTP clients

#### Why Vanilla JavaScript for Frontend?
- **Simplicity**: No build process or framework complexity
- **Performance**: Faster loading without framework overhead
- **Learning**: Clear understanding of underlying concepts
- **Integration**: Easy to integrate into existing projects

## 2. Core Technologies Deep Dive

### 🛠️ Technology Stack Overview

Our CashFree integration leverages a carefully curated technology stack optimized for performance, security, and developer experience.

#### Core Backend Technologies

| Technology | Version | Purpose | Why Chosen | Alternatives Considered |
|------------|---------|---------|------------|------------------------|
| **Node.js** | `18+` | Runtime Environment | • Excellent for I/O intensive operations<br>• Large ecosystem<br>• JavaScript across full stack | Python Flask, Java Spring, .NET Core |
| **Express.js** | `^5.1.0` | Web Framework | • Minimal overhead<br>• Extensive middleware ecosystem<br>• Industry standard | Fastify, Koa.js, NestJS |
| **Axios** | `^1.10.0` | HTTP Client | • Promise-based API<br>• Request/Response interceptors<br>• Timeout control<br>• Better error handling | CashFree SDK, Fetch API, Request |

#### Frontend Technologies

| Technology | Version | Purpose | Why Chosen | Alternatives Considered |
|------------|---------|---------|------------|------------------------|
| **Vanilla JavaScript** | `ES2020+` | Client-Side Logic | • No build process<br>• Better performance<br>• Easy to understand | React, Vue.js, Angular |
| **CashFree JS SDK** | `^1.0.5` | Payment Integration | • Official SDK<br>• Popup integration<br>• Event handling | Custom implementation |
| **CSS3** | `Latest` | Styling | • Modern features<br>• No dependencies<br>• Responsive design | Tailwind CSS, Bootstrap |

#### Supporting Libraries

| Package | Version | Purpose | Configuration |
|---------|---------|---------|---------------|
| `cors` | `^2.8.5` | Cross-Origin Resource Sharing | ```javascript<br>app.use(cors({<br>  origin: process.env.NODE_ENV === 'production' ?<br>    ['https://yourdomain.com'] :<br>    true,<br>  credentials: true<br>}));<br>``` |
| `dotenv` | `^17.0.0` | Environment Variables | ```javascript<br>require('dotenv').config({<br>  path: process.env.NODE_ENV === 'production' ?<br>    '.env.production' : '.env'<br>});<br>``` |
| `nodemon` | `^3.1.10` | Development Server | ```json<br>{<br>  "scripts": {<br>    "dev": "nodemon server.js",<br>    "start": "node server.js"<br>  }<br>}<br>``` |

### 🏗️ Architecture Decision Records

#### ADR-001: HTTP Client Selection (Axios vs CashFree SDK)

**Context**: Need to make API calls to CashFree backend services

**Decision**: Use Axios instead of official CashFree backend SDK

**Rationale**:
```javascript
// Axios Advantages
const axiosConfig = {
  timeout: 5000,           // Granular timeout control
  retry: 3,                // Custom retry logic
  validateStatus: (status) => status < 500,  // Custom status validation
  transformResponse: [     // Response transformation
    (data) => {
      // Custom error handling
      if (data.error) {
        throw new PaymentError(data.error.message);
      }
      return JSON.parse(data);
    }
  ]
};
```

**Consequences**:
- ✅ Better error handling and debugging
- ✅ More control over request/response lifecycle
- ✅ Easier to implement fast-failure detection
- ❌ Need to implement more boilerplate code
- ❌ Manual API endpoint management

#### ADR-002: Frontend Framework Selection

**Context**: Need to build payment checkout interface

**Decision**: Use Vanilla JavaScript instead of React/Vue

**Rationale**:
```javascript
// Vanilla JS Benefits for Payment Integration
const checkoutForm = {
  // Direct DOM manipulation for critical payment forms
  validateInRealTime: () => {
    // No framework overhead during payment validation
    const isValid = validatePaymentForm();
    updateUIImmediately(isValid);
  },
  
  // No build process means faster development cycles
  handleSDKEvents: () => {
    // Direct access to CashFree SDK events
    cashfree.onSuccess = handlePaymentSuccess;
    cashfree.onFailure = handlePaymentFailure;
  }
};
```

**Consequences**:
- ✅ No build process complexity
- ✅ Faster page load times
- ✅ Direct SDK integration
- ✅ Easier to debug payment flows
- ❌ More verbose code for complex UIs
- ❌ Manual state management

### 📦 Package.json Deep Dive

```json
{
  "name": "cashfree-checkout-integration",
  "version": "1.0.0",
  "description": "Production-ready CashFree payment integration",
  "main": "server.js",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js --ignore data/",
    "test": "npm run test:unit && npm run test:integration",
    "test:unit": "jest tests/unit/",
    "test:integration": "jest tests/integration/",
    "lint": "eslint . --ext .js",
    "format": "prettier --write .",
    "security-audit": "npm audit --audit-level moderate",
    "build": "echo 'No build step required for vanilla JS'",
    "deploy": "npm run security-audit && npm start"
  },
  "dependencies": {
    "express": "^5.1.0",
    "axios": "^1.10.0",
    "cors": "^2.8.5",
    "dotenv": "^17.0.0",
    "helmet": "^7.0.0",           // Security headers
    "express-rate-limit": "^6.8.0", // Rate limiting
    "express-validator": "^7.0.1"   // Input validation
  },
  "devDependencies": {
    "nodemon": "^3.1.10",
    "jest": "^29.5.0",
    "supertest": "^6.3.3",
    "eslint": "^8.42.0",
    "prettier": "^2.8.8"
  },
  "keywords": [
    "cashfree",
    "payment-gateway",
    "checkout",
    "nodejs",
    "express"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/cashfree-checkout.git"
  },
  "license": "MIT",
  "funding": {
    "type": "individual",
    "url": "https://github.com/sponsors/yourusername"
  }
}
```

### 🔧 Development Tools Configuration

#### ESLint Configuration (.eslintrc.js)
```javascript
module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:security/recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    // Payment-specific security rules
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'security/detect-object-injection': 'error',
    'security/detect-sql-injection': 'error'
  }
};
```

#### Prettier Configuration (.prettierrc)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

## 3. Complete Project Setup Guide

### 🔧 Prerequisites & Environment Setup

#### System Requirements
```bash
# Check your system meets requirements
node --version    # Should be >= 18.0.0
npm --version     # Should be >= 8.0.0
git --version     # Should be >= 2.0.0

# Recommended global packages
npm install -g nodemon     # For development
npm install -g pm2         # For production
```

#### CashFree Account Setup

Before starting development, you need a CashFree merchant account:

1. **Create Account**: Visit [CashFree Merchant Dashboard](https://merchant.cashfree.com/)
2. **Complete KYC**: Submit required business documents
3. **Get API Credentials**: Navigate to Developers → API Keys

#### Environment Setup Checklist

```bash
# ✅ Development Environment Checklist
□ Node.js 18+ installed
□ Git configured with SSH keys
□ Code editor (VS Code recommended) with extensions:
  □ ES6 String HTML
  □ Prettier
  □ ESLint
  □ REST Client (for API testing)
□ CashFree merchant account created
□ API credentials obtained (App ID & Secret Key)
□ ngrok installed (for webhook testing)
```

### 📥 Installation & Configuration

#### Step 1: Project Initialization

```bash
# Option A: Clone from repository
git clone https://github.com/yourusername/cashfree-checkout.git
cd cashfree-checkout

# Option B: Create from scratch
mkdir cashfree-checkout
cd cashfree-checkout
npm init -y
```

#### Step 2: Dependency Installation

```bash
# Install production dependencies
npm install express@^5.1.0 \
           axios@^1.10.0 \
           cors@^2.8.5 \
           dotenv@^17.0.0 \
           helmet@^7.0.0 \
           express-rate-limit@^6.8.0

# Install development dependencies
npm install --save-dev nodemon@^3.1.10 \
                       jest@^29.5.0 \
                       supertest@^6.3.3 \
                       eslint@^8.42.0 \
                       prettier@^2.8.8

# Verify installation
npm list --depth=0
```

#### Step 3: Project Structure Creation

```bash
# Create directory structure
mkdir -p {data,public,routes,tests/{unit,integration},docs}
mkdir -p public/{css,js,images}
mkdir -p logs

# Create essential files
touch server.js
touch routes/payment.js
touch creditManager.js
touch .env
touch .env.example
touch .gitignore
touch README.md
```

### 🔐 Environment Variables Master Guide

#### .env File Structure

```bash
# =====================================
# CashFree Payment Gateway Configuration
# =====================================

# CRITICAL: CashFree API Credentials
# Get these from: https://merchant.cashfree.com/developers/api-keys
CASHFREE_APP_ID="YOUR_APP_ID_HERE"
CASHFREE_SECRET_KEY="YOUR_SECRET_KEY_HERE"

# Environment: SANDBOX (testing) or PRODUCTION (live payments)
CASHFREE_ENVIRONMENT="SANDBOX"

# =====================================
# Server Configuration
# =====================================

# Port for local development
PORT=3000

# Node.js environment
NODE_ENV="development"

# =====================================
# URL Configuration
# =====================================

# Base URL for your application
BASE_URL="http://localhost:3000"

# Return URL after payment completion
RETURN_URL="http://localhost:3000/success"

# Webhook URL for payment notifications
# For local development, use ngrok: https://ngrok.com/
# Example: NOTIFY_URL="https://abc123.ngrok.io/api/payment/webhook"
NOTIFY_URL="http://localhost:3000/api/payment/webhook"

# =====================================
# Security Configuration
# =====================================

# Enable webhook signature verification (CRITICAL for production)
WEBHOOK_VERIFICATION_ENABLED=true

# Rate limiting (requests per window)
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100  # 100 requests per window

# =====================================
# Logging & Monitoring
# =====================================

# Log level: error, warn, info, debug
LOG_LEVEL="debug"

# Enable detailed request logging
ENABLE_REQUEST_LOGGING=true

# Log file path
LOG_FILE_PATH="./logs/app.log"

# =====================================
# Database Configuration (for production)
# =====================================

# When migrating from file storage to database
# DATABASE_URL="postgresql://user:password@localhost:5432/cashfree_db"
# DATABASE_SSL=false

# =====================================
# Email Configuration (optional)
# =====================================

# For sending payment notifications
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT=587
# SMTP_USER="your-email@gmail.com"
# SMTP_PASS="your-app-password"

# =====================================
# Third-party Integrations (optional)
# =====================================

# Error tracking
# SENTRY_DSN="https://your-sentry-dsn@sentry.io/project-id"

# Analytics
# GOOGLE_ANALYTICS_ID="GA-XXXXXXXXX"
```

#### .env.example (Template)

```bash
# Copy this file to .env and fill in your actual values
# Never commit .env to version control

# CashFree Credentials (Required)
CASHFREE_APP_ID="TEST_APP_ID_12345"
CASHFREE_SECRET_KEY="TEST_SECRET_KEY_67890"
CASHFREE_ENVIRONMENT="SANDBOX"

# Server Configuration
PORT=3000
NODE_ENV="development"

# URLs
BASE_URL="http://localhost:3000"
RETURN_URL="http://localhost:3000/success"
NOTIFY_URL="http://localhost:3000/api/payment/webhook"

# Security
WEBHOOK_VERIFICATION_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL="debug"
ENABLE_REQUEST_LOGGING=true
LOG_FILE_PATH="./logs/app.log"
```

### 🔍 Environment Validation System

```javascript
// config/environmentValidator.js
class EnvironmentValidator {
  constructor() {
    this.requiredVars = [
      'CASHFREE_APP_ID',
      'CASHFREE_SECRET_KEY',
      'CASHFREE_ENVIRONMENT'
    ];
    
    this.optionalVars = [
      'PORT',
      'NODE_ENV',
      'BASE_URL',
      'RETURN_URL',
      'NOTIFY_URL'
    ];
  }

  validate() {
    console.log('🔍 Validating environment configuration...');
    
    // Check required variables
    const missing = this.requiredVars.filter(key => !process.env[key]);
    if (missing.length > 0) {
      this.handleMissingVariables(missing);
    }

    // Validate specific values
    this.validateCashFreeEnvironment();
    this.validateCredentialFormat();
    this.validateUrls();
    this.validateSecuritySettings();

    console.log('✅ Environment validation passed');
    this.logConfiguration();
  }

  handleMissingVariables(missing) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => {
      console.error(`   - ${key}`);
    });
    
    console.error('\n💡 Setup Guide:');
    console.error('   1. Copy .env.example to .env');
    console.error('   2. Get credentials from CashFree Dashboard');
    console.error('   3. Fill in all required variables');
    
    process.exit(1);
  }

  validateCashFreeEnvironment() {
    const validEnvs = ['SANDBOX', 'PRODUCTION'];
    const env = process.env.CASHFREE_ENVIRONMENT;
    
    if (!validEnvs.includes(env)) {
      console.error('❌ Invalid CASHFREE_ENVIRONMENT');
      console.error(`   Expected: ${validEnvs.join(' or ')}`);
      console.error(`   Received: ${env}`);
      process.exit(1);
    }

    if (env === 'PRODUCTION') {
      this.validateProductionSettings();
    }
  }

  validateCredentialFormat() {
    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    if (appId.length < 10) {
      console.warn('⚠️  CASHFREE_APP_ID seems too short (expected 10+ chars)');
    }

    if (secretKey.length < 20) {
      console.warn('⚠️  CASHFREE_SECRET_KEY seems too short (expected 20+ chars)');
    }

    if (appId.includes('TEST') && process.env.CASHFREE_ENVIRONMENT === 'PRODUCTION') {
      console.error('❌ Test credentials detected in PRODUCTION environment');
      process.exit(1);
    }
  }

  validateUrls() {
    const urls = ['BASE_URL', 'RETURN_URL', 'NOTIFY_URL'];
    
    urls.forEach(urlKey => {
      const url = process.env[urlKey];
      if (url && !this.isValidUrl(url)) {
        console.warn(`⚠️  ${urlKey} appears to be invalid: ${url}`);
      }
    });
  }

  validateSecuritySettings() {
    if (process.env.NODE_ENV === 'production') {
      if (process.env.WEBHOOK_VERIFICATION_ENABLED !== 'true') {
        console.error('❌ Webhook verification MUST be enabled in production');
        process.exit(1);
      }

      if (!process.env.NOTIFY_URL || process.env.NOTIFY_URL.includes('localhost')) {
        console.error('❌ Production webhook URL cannot be localhost');
        process.exit(1);
      }
    }
  }

  validateProductionSettings() {
    console.warn('🚨 PRODUCTION MODE DETECTED');
    console.warn('   - Ensure you have production CashFree credentials');
    console.warn('   - Verify webhook URLs are publicly accessible');
    console.warn('   - Enable all security features');
    console.warn('   - Test thoroughly in SANDBOX first');
  }

  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  logConfiguration() {
    console.log('\n📋 Current Configuration:');
    console.log(`   Environment: ${process.env.CASHFREE_ENVIRONMENT}`);
    console.log(`   App ID: ${process.env.CASHFREE_APP_ID.substring(0, 8)}...`);
    console.log(`   Port: ${process.env.PORT || 3000}`);
    console.log(`   Node Env: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Base URL: ${process.env.BASE_URL || 'http://localhost:3000'}`);
  }
}

module.exports = EnvironmentValidator;
```

### 🎯 Quick Start Commands

```bash
# Development setup (one-time)
npm run setup

# Start development server
npm run dev

# Start production server
npm start

# Run tests
npm test

# Security audit
npm run security-audit

# Code formatting
npm run format

# Deploy to production
npm run deploy
```
npm list --depth=0
```

### Environment Variables Master Guide

Create a `.env` file in the project root. This file is ignored by Git and is the correct place for all your secrets.

```env
# --- CashFree API Credentials ---
# These are the most sensitive keys. Treat them like passwords.
# Found in your CashFree Merchant Dashboard under Developers -> API Keys.
CASHFREE_APP_ID="YOUR_CASHFREE_APP_ID"
CASHFREE_SECRET_KEY="YOUR_CASHFREE_SECRET_KEY"

# --- Application Configuration ---
# Controls which CashFree environment your backend communicates with.
# Use 'SANDBOX' for all development and testing.
# Only switch to 'PRODUCTION' when you are ready for live payments.
CASHFREE_ENVIRONMENT="SANDBOX" 

# --- Server Configuration ---
# The port your local server will run on.
PORT=3000

# --- Optional: URL Configuration ---
# While optional, explicitly setting these is good practice.
# RETURN_URL is where CashFree might redirect a user in some non-popup flows.
# NOTIFY_URL is the webhook endpoint you configure in the CashFree dashboard.
RETURN_URL="http://localhost:3000/success"
NOTIFY_URL="http://localhost:3000/api/payment/webhook"

# --- Development Flags ---
DEBUG_MODE=true
LOG_LEVEL=verbose
```

### CashFree Account Setup
1.  **Create a CashFree Account**: Sign up at [CashFree](https://www.cashfree.com/).
2.  **Get API Credentials**: Navigate to Developers -> API Keys in the dashboard.
3.  **Set Up Webhook**: Configure a webhook URL in the CashFree dashboard for payment notifications.
4.  **Enable Sandbox Mode**: Ensure your account is in Sandbox mode for testing.

### Project Initialization Sequence

When you run `npm install`, the following happens:

1. **Package Resolution**: npm reads `package.json` and resolves all dependencies
2. **Dependency Tree**: Creates a dependency tree and checks for conflicts
3. **Download**: Downloads packages from npm registry
4. **Installation**: Installs packages in `node_modules/`
5. **Audit**: Runs security audit on installed packages

## 4. System Architecture & Design Patterns

### 🏗️ High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  Browser (Client)                                                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │   index.html    │  │  success.html   │  │  failure.html   │             │
│  │   (Checkout)    │  │   (Success)     │  │   (Failure)     │             │
│  │                 │  │                 │  │                 │             │
│  │ • Form UI       │  │ • Success UI    │  │ • Error UI      │             │
│  │ • Validation    │  │ • Transaction   │  │ • Retry Options │             │
│  │ • SDK Loading   │  │   Details       │  │ • Support Info  │             │
│  │ • Status Poll   │  │                 │  │                 │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│           │                      ▲                      ▲                   │
│           │                      │                      │                   │
│           ▼                      │                      │                   │
│  ┌─────────────────────────────────────────────────────────────────────────┤
│  │                       CashFree JS SDK                                   │
│  │  • Popup Management  • Event Handling  • Payment Processing            │
│  └─────────────────────────────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────────────────┘
           │                      ▲                      ▲
           │ HTTPS/API Calls      │ Redirects            │ Webhook Events
           ▼                      │                      │
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  Express.js Server (Node.js)                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │   server.js     │  │ routes/payment  │  │ creditManager   │             │
│  │                 │  │                 │  │                 │             │
│  │ • App Setup     │  │ • Order Create  │  │ • Data Layer    │             │
│  │ • Middleware    │  │ • Status Check  │  │ • File I/O      │             │
│  │ • Route Setup   │  │ • Webhook       │  │ • Validation    │             │
│  │ • Error Handle  │  │ • Security      │  │ • Concurrency   │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│           │                      │                      │                   │
│           │                      ▼                      ▼                   │
│           │          ┌─────────────────────────────────────────────────────┤
│           │          │                Data Storage                         │
│           │          │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│           │          │  │ credits.json│  │  logs/      │  │  temp/      │ │
│           │          │  │ • Payments  │  │ • Requests  │  │ • Sessions  │ │
│           │          │  │ • Orders    │  │ • Errors    │  │ • Cache     │ │
│           │          │  │ • Failures  │  │ • Analytics │  │             │ │
│           │          │  └─────────────┘  └─────────────┘  └─────────────┘ │
│           │          └─────────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────────────────┘
           │
           │ HTTPS API Calls
           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CASHFREE SERVICES                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │   Order API     │  │  Payment API    │  │   Webhook API   │             │
│  │                 │  │                 │  │                 │             │
│  │ • Create Order  │  │ • Process Pay   │  │ • Send Events   │             │
│  │ • Get Status    │  │ • Handle Cards  │  │ • Retry Logic   │             │
│  │ • Update State  │  │ • UPI, NetBank  │  │ • Signatures    │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 🎯 Design Patterns Implementation

#### 1. **Model-View-Controller (MVC) Pattern**

```javascript
// MODEL: Data Layer (creditManager.js)
class CreditManager {
  // Handles all data operations
  // Abstracts storage mechanism
  // Provides business logic
}

// VIEW: Presentation Layer (public/*.html)
const CheckoutView = {
  // User interface components
  // Form validation and feedback
  // Event handling
};

// CONTROLLER: Logic Layer (routes/payment.js)
const PaymentController = {
  // Orchestrates business operations
  // Handles API requests/responses
  // Manages payment flow
};
```

#### 2. **Repository Pattern**

```javascript
// Abstract data access
class PaymentRepository {
  async createOrder(orderData) {
    // Abstract order creation
  }
  
  async getOrderStatus(orderId) {
    // Abstract status retrieval
  }
  
  async recordPayment(paymentData) {
    // Abstract payment recording
  }
}

// File-based implementation
class FilePaymentRepository extends PaymentRepository {
  constructor() {
    this.creditManager = new CreditManager();
  }
  
  async createOrder(orderData) {
    return this.creditManager.addOrder(orderData);
  }
}

// Database implementation (for production)
class DatabasePaymentRepository extends PaymentRepository {
  constructor(dbConnection) {
    this.db = dbConnection;
  }
  
  async createOrder(orderData) {
    return this.db.orders.create(orderData);
  }
}
```

#### 3. **Factory Pattern for Environment Configuration**

```javascript
// ConfigFactory.js
class ConfigFactory {
  static create(environment) {
    switch (environment) {
      case 'SANDBOX':
        return new SandboxConfig();
      case 'PRODUCTION':
        return new ProductionConfig();
      default:
        throw new Error(`Unknown environment: ${environment}`);
    }
  }
}

class SandboxConfig {
  getBaseUrl() {
    return 'https://sandbox.cashfree.com/pg';
  }
  
  getWebhookConfig() {
    return {
      verifySignature: false,  // Relaxed for testing
      timeout: 10000
    };
  }
}

class ProductionConfig {
  getBaseUrl() {
    return 'https://api.cashfree.com/pg';
  }
  
  getWebhookConfig() {
    return {
      verifySignature: true,   // Strict for production
      timeout: 5000
    };
  }
}
```

## 5. Server Implementation Masterclass

### 🚀 Express Server Deep Dive

Our Express server is the backbone of the payment system, handling everything from request routing to error management. Let's break down every component:

#### Core Server Architecture

```javascript
// server.js - Production-ready implementation

// ============================================================================
// PHASE 1: IMPORTS AND ENVIRONMENT SETUP
// ============================================================================

// Core dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Environment configuration
require('dotenv').config();

// Custom modules
const paymentRoutes = require('./routes/payment');
const EnvironmentValidator = require('./config/environmentValidator');
const SecurityMiddleware = require('./middleware/security');
const LoggingMiddleware = require('./middleware/logging');

// ============================================================================
// PHASE 2: APPLICATION INITIALIZATION
// ============================================================================

class CashFreeServer {
  constructor() {
    this.app = express();
    this.PORT = process.env.PORT || 3000;
    this.NODE_ENV = process.env.NODE_ENV || 'development';
    
    // Initialize application
    this.initialize();
  }
  
  async initialize() {
    console.log('🚀 Initializing CashFree Checkout Server...');
    
    try {
      // Validate environment first
      await this.validateEnvironment();
      
      // Setup logging
      this.setupLogging();
      
      // Configure security
      this.configureSecurity();
      
      // Setup middleware chain
      this.setupMiddleware();
      
      // Configure routes
      this.setupRoutes();
      
      // Setup error handling
      this.setupErrorHandling();
      
      // Start server
      await this.startServer();
      
    } catch (error) {
      console.error('❌ Server initialization failed:', error);
      process.exit(1);
    }
  }
  
  // ============================================================================
  // PHASE 3: ENVIRONMENT VALIDATION
  // ============================================================================
  
  async validateEnvironment() {
    console.log('🔍 Validating environment configuration...');
    
    const validator = new EnvironmentValidator();
    validator.validate();
    
    // Create necessary directories
    this.createDirectories();
    
    console.log('✅ Environment validation completed');
  }
  
  createDirectories() {
    const directories = [
      'data',
      'logs',
      'temp',
      'public/uploads'
    ];
    
    directories.forEach(dir => {
      const dirPath = path.join(__dirname, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    });
  }
  
  // ============================================================================
  // PHASE 4: LOGGING CONFIGURATION
  // ============================================================================
  
  setupLogging() {
    console.log('📋 Setting up logging system...');
    
    // Request logging middleware
    this.app.use((req, res, next) => {
      const timestamp = new Date().toISOString();
      const method = req.method.padEnd(6);
      const url = req.url;
      const ip = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent') || 'Unknown';
      
      console.log(`[${timestamp}] ${method} ${url} - ${ip} - ${userAgent}`);
      
      // Log to file in production
      if (this.NODE_ENV === 'production') {
        this.logToFile({
          timestamp,
          method: req.method,
          url,
          ip,
          userAgent,
          headers: req.headers
        });
      }
      
      next();
    });
    
    console.log('✅ Logging system configured');
  }
  
  logToFile(logData) {
    const logFile = path.join(__dirname, 'logs', 'access.log');
    const logEntry = JSON.stringify(logData) + '\n';
    
    fs.appendFile(logFile, logEntry, (err) => {
      if (err) {
        console.error('Failed to write to log file:', err);
      }
    });
  }
  
  // ============================================================================
  // PHASE 5: SECURITY CONFIGURATION
  // ============================================================================
  
  configureSecurity() {
    console.log('🔒 Configuring security middleware...');
    
    // Basic security headers
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "https://sdk.cashfree.com",
            "'unsafe-inline'" // For inline scripts (consider removing in production)
          ],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: [
            "'self'",
            "https://api.cashfree.com",
            "https://sandbox.cashfree.com"
          ],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
          upgradeInsecureRequests: this.NODE_ENV === 'production' ? [] : null
        }
      },
      hsts: this.NODE_ENV === 'production' ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      } : false
    }));
    
    // CORS configuration
    this.app.use(cors({
      origin: this.NODE_ENV === 'production' 
        ? process.env.ALLOWED_ORIGINS?.split(',') || false
        : true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-cashfree-signature', 'x-cashfree-timestamp']
    }));
    
    // General rate limiting
    const generalLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // Limit each IP to 1000 requests per windowMs
      message: {
        error: 'Too many requests',
        retryAfter: '15 minutes'
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        console.warn(`⚠️ Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
          success: false,
          error: 'Too many requests',
          retryAfter: Math.round(req.rateLimit.resetTime / 1000)
        });
      }
    });
    
    this.app.use(generalLimiter);
    
    console.log('✅ Security configuration completed');
  }
  
  // ============================================================================
  // PHASE 6: MIDDLEWARE SETUP
  // ============================================================================
  
  setupMiddleware() {
    console.log('🔧 Setting up middleware chain...');
    
    // Body parsing middleware
    this.app.use(express.json({ 
      limit: '10mb',
      verify: (req, res, buf, encoding) => {
        // Store raw body for webhook signature verification
        req.rawBody = buf;
      }
    }));
    
    this.app.use(express.urlencoded({ 
      extended: true, 
      limit: '10mb' 
    }));
    
    // Custom middleware for payment validation
    this.app.use('/api/payment/create-order', this.validatePaymentRequest.bind(this));
    
    // Webhook-specific middleware
    this.app.use('/api/payment/webhook', this.webhookMiddleware.bind(this));
    
    console.log('✅ Middleware chain configured');
  }
  
  validatePaymentRequest(req, res, next) {
    // Additional validation for payment requests
    const { amount, customerName, customerEmail, customerPhone } = req.body;
    
    // Amount validation
    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum < 1 || amountNum > 500000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
        details: 'Amount must be between ₹1 and ₹5,00,000'
      });
    }
    
    // Name validation
    if (!customerName || customerName.trim().length < 2 || customerName.trim().length > 50) {
      return res.status(400).json({
        success: false,
        error: 'Invalid customer name',
        details: 'Name must be between 2 and 50 characters'
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail || !emailRegex.test(customerEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address',
        details: 'Please provide a valid email address'
      });
    }
    
    // Phone validation (Indian numbers)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!customerPhone || !phoneRegex.test(customerPhone)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number',
        details: 'Please provide a valid 10-digit Indian phone number'
      });
    }
    
    next();
  }
  
  webhookMiddleware(req, res, next) {
    // Webhook-specific security and validation
    console.log('🔔 Processing webhook request...');
    
    // Log webhook for debugging
    if (this.NODE_ENV !== 'production') {
      console.log('Webhook Headers:', req.headers);
      console.log('Webhook Body:', req.body);
    }
    
    // Production webhook signature verification
    if (this.NODE_ENV === 'production') {
      const signature = req.headers['x-cashfree-signature'];
      const timestamp = req.headers['x-cashfree-timestamp'];
      
      if (!signature || !timestamp) {
        console.error('❌ Missing webhook signature or timestamp');
        return res.status(400).json({ 
          success: false, 
          error: 'Missing signature or timestamp' 
        });
      }
      
      if (!this.verifyWebhookSignature(req.rawBody, signature, timestamp)) {
        console.error('❌ Invalid webhook signature');
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid signature' 
        });
      }
      
      console.log('✅ Webhook signature verified');
    }
    
    next();
  }
  
  verifyWebhookSignature(rawBody, signature, timestamp) {
    const crypto = require('crypto');
    
    try {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.CASHFREE_SECRET_KEY)
        .update(timestamp + rawBody.toString())
        .digest('base64');
      
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }
  
  // ============================================================================
  // PHASE 7: ROUTE CONFIGURATION
  // ============================================================================
  
  setupRoutes() {
    console.log('🛣️ Setting up routes...');
    
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.CASHFREE_ENVIRONMENT,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: require('./package.json').version
      });
    });
    
    // API routes
    this.app.use('/api/payment', paymentRoutes);
    
    // Page routes with error handling
    this.app.get('/', this.servePage('home.html'));
    this.app.get('/checkout', this.servePage('index.html'));
    this.app.get('/success', this.servePage('success.html'));
    this.app.get('/failure', this.servePage('failure.html'));
    
    // Static file serving
    this.app.use(express.static(path.join(__dirname, 'public'), {
      maxAge: this.NODE_ENV === 'production' ? '1d' : 0,
      etag: true,
      lastModified: true
    }));
    
    // 404 handler for undefined routes
    this.app.use('*', (req, res) => {
      console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
      res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
      });
    });
    
    console.log('✅ Routes configured');
  }
  
  servePage(filename) {
    return (req, res) => {
      const filePath = path.join(__dirname, 'public', filename);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error(`❌ Page not found: ${filename}`);
        return res.status(404).json({
          success: false,
          error: 'Page not found'
        });
      }
      
      console.log(`📄 Serving page: ${filename}`);
      res.sendFile(filePath);
    };
  }
  
  // ============================================================================
  // PHASE 8: ERROR HANDLING
  // ============================================================================
  
  setupErrorHandling() {
    console.log('🚨 Setting up error handling...');
    
    // Global error handler
    this.app.use((err, req, res, next) => {
      console.error('🚨 Global error handler triggered:', err);
      
      // Log detailed error information
      this.logError(err, req);
      
      // Determine error response based on error type
      let statusCode = 500;
      let errorMessage = 'Internal server error';
      
      if (err.name === 'ValidationError') {
        statusCode = 400;
        errorMessage = 'Validation failed';
      } else if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        errorMessage = 'Unauthorized';
      } else if (err.code === 'ENOTFOUND') {
        statusCode = 503;
        errorMessage = 'Service temporarily unavailable';
      }
      
      // Send error response
      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        ...(this.NODE_ENV !== 'production' && { 
          details: err.message,
          stack: err.stack 
        }),
        timestamp: new Date().toISOString(),
        requestId: req.id || 'unknown'
      });
    });
    
    console.log('✅ Error handling configured');
  }
  
  logError(error, req) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      request: {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        body: req.body
      }
    };
    
    // Log to console
    console.error('Error details:', JSON.stringify(errorLog, null, 2));
    
    // Log to file in production
    if (this.NODE_ENV === 'production') {
      const errorFile = path.join(__dirname, 'logs', 'errors.log');
      fs.appendFile(errorFile, JSON.stringify(errorLog) + '\n', (err) => {
        if (err) {
          console.error('Failed to write error to log file:', err);
        }
      });
    }
  }
  
  // ============================================================================
  // PHASE 9: SERVER STARTUP
  // ============================================================================
  
  async startServer() {
    return new Promise((resolve, reject) => {
      try {
        this.server = this.app.listen(this.PORT, () => {
          console.log('');
          console.log('🎉 ====================================');
          console.log('🚀   CashFree Server Started!       ');
          console.log('🎉 ====================================');
          console.log(`📍 Server URL: http://localhost:${this.PORT}`);
          console.log(`🌍 Environment: ${process.env.CASHFREE_ENVIRONMENT}`);
          console.log(`📊 Node Environment: ${this.NODE_ENV}`);
          console.log(`⚡ Process ID: ${process.pid}`);
          console.log(`💾 Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
          console.log('🎉 ====================================');
          console.log('');
          
          resolve();
        });
        
        this.server.on('error', (error) => {
          console.error('❌ Server startup error:', error);
          reject(error);
        });
        
        // Setup graceful shutdown
        this.setupGracefulShutdown();
        
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // ============================================================================
  // PHASE 10: GRACEFUL SHUTDOWN
  // ============================================================================
  
  setupGracefulShutdown() {
    const shutdown = (signal) => {
      console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
      
      this.server.close(() => {
        console.log('✅ HTTP server closed');
        
        // Close database connections, cleanup resources, etc.
        this.cleanup()
          .then(() => {
            console.log('✅ Cleanup completed');
            process.exit(0);
          })
          .catch((error) => {
            console.error('❌ Cleanup failed:', error);
            process.exit(1);
          });
      });
      
      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('❌ Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };
    
    // Listen for shutdown signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      shutdown('UNCAUGHT_EXCEPTION');
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      shutdown('UNHANDLED_REJECTION');
    });
  }
  
  async cleanup() {
    console.log('🧹 Performing cleanup...');
    
    // Add cleanup tasks here:
    // - Close database connections
    // - Save pending data
    // - Clear intervals/timeouts
    // - Release resources
    
    return Promise.resolve();
  }
}

// ============================================================================
// STARTUP
// ============================================================================

// Initialize and start the server
const server = new CashFreeServer();

// Export for testing
module.exports = server;
```

### 🔧 Middleware Chain Deep Dive

The middleware chain is critical for proper request processing. Here's the detailed order and purpose:

```javascript
// middleware/index.js - Centralized middleware management

class MiddlewareManager {
  static setupChain(app) {
    console.log('🔧 Setting up middleware chain...');
    
    // 1. LOGGING (First - to log everything)
    app.use(this.requestLogger);
    
    // 2. SECURITY HEADERS (Early security)
    app.use(helmet());
    
    // 3. CORS (Handle preflight requests)
    app.use(cors());
    
    // 4. RATE LIMITING (Prevent abuse)
    app.use(this.rateLimiter);
    
    // 5. BODY PARSING (Parse request bodies)
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // 6. VALIDATION (Route-specific validation)
    app.use('/api/payment/*', this.paymentValidation);
    
    // 7. AUTHENTICATION (If required)
    // app.use('/api/admin/*', this.authMiddleware);
    
    // 8. BUSINESS LOGIC ROUTES
    // Routes are added here
    
    // 9. STATIC FILES (After API routes)
    app.use(express.static('public'));
    
    // 10. ERROR HANDLING (Last)
    app.use(this.errorHandler);
    
    console.log('✅ Middleware chain configured');
  }
  
  static requestLogger(req, res, next) {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const size = res.get('Content-Length') || 0;
      
      console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms - ${size}bytes`);
    });
    
    next();
  }
  
  static rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
  });
  
  static paymentValidation(req, res, next) {
    // Specific validation for payment endpoints
    if (req.path.includes('/create-order')) {
      return this.validateOrderCreation(req, res, next);
    }
    
    if (req.path.includes('/webhook')) {
      return this.validateWebhook(req, res, next);
    }
    
    next();
  }
  
  static validateOrderCreation(req, res, next) {
    const { amount, customerName, customerEmail, customerPhone } = req.body;
    const errors = [];
    
    // Validate amount
    if (!amount || isNaN(amount) || amount < 1 || amount > 500000) {
      errors.push('Amount must be between ₹1 and ₹5,00,000');
    }
    
    // Validate name
    if (!customerName || customerName.trim().length < 2) {
      errors.push('Customer name is required (minimum 2 characters)');
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail || !emailRegex.test(customerEmail)) {
      errors.push('Valid email address is required');
    }
    
    // Validate phone
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!customerPhone || !phoneRegex.test(customerPhone)) {
      errors.push('Valid 10-digit Indian phone number is required');
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }
    
    next();
  }
  
  static validateWebhook(req, res, next) {
    // Webhook-specific validation
    const signature = req.headers['x-cashfree-signature'];
    const timestamp = req.headers['x-cashfree-timestamp'];
    
    if (process.env.NODE_ENV === 'production') {
      if (!signature || !timestamp) {
        return res.status(400).json({
          success: false,
          error: 'Missing webhook signature or timestamp'
        });
      }
      
      // Verify signature (implementation depends on CashFree documentation)
      // if (!verifyWebhookSignature(req.body, signature, timestamp)) {
      //   return res.status(401).json({
      //     success: false,
      //     error: 'Invalid webhook signature'
      //   });
      // }
    }
    
    next();
  }
  
  static errorHandler(err, req, res, next) {
    console.error('Global error handler:', err);
    
    // Default error
    let status = 500;
    let message = 'Internal server error';
    
    // Handle specific error types
    if (err.name === 'ValidationError') {
      status = 400;
      message = 'Validation error';
    } else if (err.name === 'CastError') {
      status = 400;
      message = 'Invalid data format';
    } else if (err.code === 11000) {
      status = 409;
      message = 'Duplicate entry';
    }
    
    res.status(status).json({
      success: false,
      error: message,
      ...(process.env.NODE_ENV !== 'production' && {
        details: err.message,
        stack: err.stack
      })
    });
  }
}

module.exports = MiddlewareManager;
```
