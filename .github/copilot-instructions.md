<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# CashFree Popup Checkout Integration

This project implements CashFree's hosted popup payment checkout integration using Node.js, Express, and the CashFree JavaScript SDK.

## Project Structure
- `server.js` - Main Express server
- `routes/payment.js` - Payment API endpoints (create order, status, webhook)
- `public/index.html` - Main checkout page with CashFree popup integration
- `public/success.html` - Payment success page
- `.env` - Environment configuration (credentials, URLs)

## Key Features
- CashFree SDK integration with popup checkout
- Order creation and payment processing
- Payment status verification
- Webhook handling for real-time notifications
- Support for multiple payment methods (Cards, UPI, Net Banking, Wallets, etc.)
- Sandbox and Production environment support
- Modern responsive UI

## API Endpoints
- `POST /api/payment/create-order` - Creates a new payment order
- `GET /api/payment/status/:orderId` - Gets payment status for an order
- `POST /api/payment/webhook` - Handles CashFree webhook notifications

## Environment Variables
- `CASHFREE_ENVIRONMENT` - 'SANDBOX' or 'PRODUCTION'
- `CASHFREE_APP_ID` - Your CashFree App ID
- `CASHFREE_SECRET_KEY` - Your CashFree Secret Key
- `PORT` - Server port (default: 3000)
- `RETURN_URL` - Payment return URL
- `NOTIFY_URL` - Webhook notification URL

## Development Guidelines
- Always use proper error handling for payment operations
- Log payment events for debugging and audit trails
- Validate all user inputs before processing payments
- Use HTTPS in production for security
- Implement proper webhook signature verification
- Follow CashFree API versioning (currently 2023-08-01)
- Test thoroughly in sandbox before production deployment

## Security Considerations
- Never expose secret keys in client-side code
- Implement proper webhook signature verification
- Use environment variables for sensitive configuration
- Validate payment amounts and customer data
- Implement rate limiting for API endpoints
- Use HTTPS for all production communications
