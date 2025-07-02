# CashFree Popup Checkout Integration

A complete implementation of CashFree's hosted popup payment checkout using Node.js, Express, and the CashFree JavaScript SDK.

## 🚀 Features

- **CashFree SDK Integration**: Complete popup checkout implementation
- **Multiple Payment Methods**: Credit/Debit Cards, UPI, Net Banking, Wallets, EMI, Pay Later
- **Environment Support**: Both Sandbox and Production environments
- **Real-time Webhooks**: Instant payment status notifications
- **Payment Verification**: Server-side payment status verification
- **Credit Management**: Built-in credit system for tracking payments
- **Modern UI**: Responsive and user-friendly checkout interface
- **Error Handling**: Comprehensive error handling and user feedback
- **Multi-platform Deployment**: Support for Vercel, Netlify, and traditional hosting

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- CashFree merchant account
- CashFree App ID and Secret Key

## 🛠️ Installation

1. **Clone or download the project**:
   ```bash
   git clone https://github.com/yourusername/cashfree-checkout.git
   cd cashfree-checkout
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   
   Or use the provided setup scripts:
   ```bash
   # For Windows
   ./setup.bat
   
   # For Linux/Mac
   ./setup.sh
   ```

3. **Configure environment variables**:
   
   Update the `.env` file with your CashFree credentials:
   ```env
   # CashFree Configuration
   CASHFREE_ENVIRONMENT=SANDBOX
   CASHFREE_APP_ID=your_actual_app_id_here
   CASHFREE_SECRET_KEY=your_actual_secret_key_here
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # URLs
   BASE_URL=http://localhost:3000
   RETURN_URL=http://localhost:3000/success
   NOTIFY_URL=http://localhost:3000/webhook
   ```

## 🎯 Getting Your CashFree Credentials

1. **Sign up/Login** to [CashFree Dashboard](https://www.cashfree.com/)
2. **Navigate** to Developers → API Keys
3. **Copy** your App ID and Secret Key
4. **For Sandbox**: Use sandbox credentials for testing
5. **For Production**: Switch to production credentials when going live

## 🚦 Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
cashfree-checkout/
├── server.js                 # Main Express server
├── package.json              # Project dependencies and scripts
├── .env                      # Environment configuration
├── database.json             # Local database file
├── creditManager.js          # Credit management system
├── routes/
│   └── payment.js            # Payment API routes
├── controllers/              # Route controllers
├── services/                 # Business logic services
├── lib/
│   └── cashfree/             # CashFree SDK wrappers
├── public/
│   ├── index.html            # Main checkout page
│   ├── home.html             # Home page
│   ├── success.html          # Payment success page
│   ├── failure.html          # Payment failure page
│   ├── credits.html          # Credits management page
│   ├── css/                  # Stylesheets
│   └── js/                   # Client-side JavaScript
├── netlify/
│   └── functions/            # Serverless functions for Netlify
└── .github/
    └── workflows/            # GitHub Actions workflows
```

## 🔌 API Endpoints

### Create Payment Order
```http
POST /api/payment/create-order
Content-Type: application/json

{
  "amount": 100,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "9999999999"
}
```

### Get Payment Status
```http
GET /api/payment/status/{orderId}
```

### Webhook Handler
```http
POST /api/payment/webhook
```

## 💻 Frontend Integration

The checkout page (`public/index.html`) demonstrates:

1. **SDK Initialization**:
   ```javascript
   const cashfree = new Cashfree({
       mode: 'sandbox' // or 'production'
   });
   ```

2. **Order Creation**:
   ```javascript
   const response = await fetch('/api/payment/create-order', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(paymentData)
   });
   ```

3. **Popup Checkout**:
   ```javascript
   const result = await cashfree.checkout({
       paymentSessionId: orderData.payment_session_id,
       returnUrl: 'http://localhost:3000/success'
   });
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `CASHFREE_ENVIRONMENT` | Environment mode | `SANDBOX` or `PRODUCTION` |
| `CASHFREE_APP_ID` | Your CashFree App ID | `your_app_id` |
| `CASHFREE_SECRET_KEY` | Your CashFree Secret Key | `your_secret_key` |
| `PORT` | Server port | `3000` |
| `RETURN_URL` | Payment return URL | `http://localhost:3000/success` |
| `NOTIFY_URL` | Webhook notification URL | `http://localhost:3000/webhook` |

### Supported Payment Methods

- Credit Cards (Visa, MasterCard, American Express, Diners, RuPay)
- Debit Cards
- Net Banking (All major banks)
- UPI (Google Pay, PhonePe, Paytm, etc.)
- Digital Wallets (Paytm, Mobikwik, Amazon Pay, etc.)
- EMI Options
- Pay Later (Simpl, LazyPay, etc.)
- BNPL (Buy Now Pay Later)

## 🧪 Testing

### Test Cards (Sandbox)

| Card Type | Card Number | CVV | Expiry |
|-----------|-------------|-----|--------|
| Visa | 4111111111111111 | 123 | 12/25 |
| MasterCard | 5555555555554444 | 123 | 12/25 |
| Success | 4000000000000002 | 123 | 12/25 |
| Failure | 4000000000000069 | 123 | 12/25 |

### Test UPI IDs
- Success: `success@upi`
- Failure: `failure@upi`

## 🔒 Security

### Important Security Measures

1. **Environment Variables**: Never commit sensitive credentials to version control
2. **HTTPS**: Always use HTTPS in production
3. **Webhook Verification**: Implement proper webhook signature verification
4. **Input Validation**: Validate all user inputs server-side
5. **Rate Limiting**: Implement rate limiting for API endpoints
6. **Error Handling**: Don't expose sensitive information in error messages

### Webhook Security
```javascript
const crypto = require('crypto');

function verifySignature(signature, body, secret) {
    const computedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');
    
    return signature === computedSignature;
}
```

## 🚀 Deployment

### Vercel Deployment

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in
   - Click "Add New" > "Project"
   - Import your GitHub repository
   - Configure your project:
     - Framework preset: Other
     - Root Directory: ./
     - Build Command: None (leave empty)
     - Output Directory: public
     - Install Command: npm install

3. **Configure Environment Variables in Vercel**:
   - In your Vercel project dashboard, go to "Settings" > "Environment Variables"
   - Add all required variables:
     - `CASHFREE_APP_ID`
     - `CASHFREE_SECRET_KEY`
     - `CASHFREE_ENVIRONMENT`
     - `RETURN_URL` (set to your Vercel URL + /success)
     - `NOTIFY_URL` (set to your Vercel URL + /webhook)

4. **Use the Vercel Setup Script**:
   ```bash
   # For Windows
   ./vercel-setup.bat
   
   # For Linux/Mac
   ./vercel-setup.sh
   ```

5. **Verify Deployment**:
   - Click "Deploy" in the Vercel dashboard
   - Your site will be live at `https://your-project-name.vercel.app`
   - Test all payment flows to ensure everything works correctly

### Netlify Deployment

The project includes Netlify Functions in the `netlify/functions` directory for serverless deployment on Netlify.

### Production Checklist

- [ ] Update environment variables with production credentials
- [ ] Set `CASHFREE_ENVIRONMENT=PRODUCTION` 
- [ ] Configure production URLs (RETURN_URL, NOTIFY_URL) using your domain
- [ ] Configure webhook endpoints
- [ ] Test all payment flows
- [ ] Enable HTTPS
- [ ] Set up proper error logging

## 📝 Maintenance

This codebase has been cleaned up to remove unnecessary test and backup files. If you need to add test functionality, consider creating a dedicated test directory and using a proper testing framework like Jest.

## 💳 Credit System

This integration includes a built-in credit management system that:

1. **Tracks Payments**: Records all successful payments
2. **Manages Credits**: Converts payments to credits in the system
3. **Stores History**: Maintains a history of all credit transactions
4. **Persistent Storage**: Saves credit data to a local database file

The credit system is managed by the `creditManager.js` file and uses a JSON-based storage system that works across different deployment platforms.

## 📚 Documentation Links

- [CashFree API Documentation](https://docs.cashfree.com/reference/pg-getting-started)
- [CashFree JS SDK Documentation](https://docs.cashfree.com/docs/web-checkout-integration)
- [CashFree Test Cards](https://docs.cashfree.com/docs/test-data)
- [Express.js Documentation](https://expressjs.com/)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments/overview)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)

## 🛟 Support

For CashFree specific issues:
- [CashFree Support](https://www.cashfree.com/support)
- [CashFree Developer Forum](https://community.cashfree.com/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- CashFree team for their comprehensive payment gateway
- Contributors to this project

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy Coding! 🚀**
