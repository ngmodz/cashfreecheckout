const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const creditManager = require('../creditManager');
const router = express.Router();

// CashFree configuration
const CASHFREE_CONFIG = {
    SANDBOX: {
        BASE_URL: 'https://sandbox.cashfree.com/pg',
    },
    PRODUCTION: {
        BASE_URL: 'https://api.cashfree.com/pg',
    }
};

const getBaseUrl = () => {
    const env = process.env.CASHFREE_ENVIRONMENT || 'SANDBOX';
    return CASHFREE_CONFIG[env].BASE_URL;
};

const getHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
    };
};

// Generate unique order ID
const generateOrderId = () => {
    return 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
};

// Create Order Route
router.post('/create-order', async (req, res) => {
    try {
        console.log('=== CREATE ORDER REQUEST ===');
        console.log('Request body:', req.body);
        console.log('Environment:', process.env.CASHFREE_ENVIRONMENT);
        console.log('App ID:', process.env.CASHFREE_APP_ID ? 'SET' : 'NOT SET');
        console.log('Secret Key:', process.env.CASHFREE_SECRET_KEY ? 'SET' : 'NOT SET');

        const { amount, customerName, customerEmail, customerPhone } = req.body;

        // Validate required fields
        if (!amount || !customerName || !customerEmail || !customerPhone) {
            console.log('❌ Missing required fields');
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: amount, customerName, customerEmail, customerPhone'
            });
        }

        // Validate credentials
        if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
            console.log('❌ Missing CashFree credentials');
            return res.status(500).json({
                success: false,
                error: 'CashFree credentials not configured. Please check your .env file.'
            });
        }

        const orderId = generateOrderId();
        
        const orderData = {
            order_id: orderId,
            order_amount: parseFloat(amount),
            order_currency: 'INR',
            customer_details: {
                customer_id: 'CUST_' + Date.now(),
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone,
            },
            order_meta: {
                return_url: process.env.RETURN_URL || 'http://localhost:3000/success',
                notify_url: process.env.NOTIFY_URL || 'http://localhost:3000/webhook',
                payment_methods: 'cc,dc,upi,nb,app,paylater,emi'
            }
        };

        console.log('📦 Creating order with data:', JSON.stringify(orderData, null, 2));
        console.log('🌐 API URL:', getBaseUrl() + '/orders');
        console.log('🔐 Headers:', { ...getHeaders(), 'x-client-secret': '[HIDDEN]' });

        const response = await axios.post(
            `${getBaseUrl()}/orders`,
            orderData,
            { 
                headers: getHeaders(),
                timeout: 10000 // 10 second timeout
            }
        );

        console.log('✅ CashFree response:', response.data);

        res.json({
            success: true,
            order_id: orderId,
            payment_session_id: response.data.payment_session_id,
            order_token: response.data.order_token,
            environment: process.env.CASHFREE_ENVIRONMENT || 'SANDBOX'
        });

    } catch (error) {
        console.error('❌ Error creating order:');
        console.error('Error message:', error.message);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error headers:', error.response?.headers);
        
        let errorMessage = 'Failed to create order';
        let errorDetails = error.message;

        if (error.response?.data) {
            errorMessage = error.response.data.message || errorMessage;
            errorDetails = error.response.data;
        }

        res.status(500).json({
            success: false,
            error: errorMessage,
            details: errorDetails,
            debug: {
                status: error.response?.status,
                statusText: error.response?.statusText,
                url: error.config?.url
            }
        });
    }
});

// Get Payment Status Route - Only fetches status without processing credits
router.get('/status/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;

        const response = await axios.get(
            `${getBaseUrl()}/orders/${orderId}/payments`,
            { headers: getHeaders() }
        );

        console.log('Payment status response:', response.data);

        // Return the payment data without processing credits
        // Credits will be processed by the explicit process-credit endpoint
        res.json({
            success: true,
            payments: response.data
        });

    } catch (error) {
        console.error('Error fetching payment status:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to fetch payment status',
            details: error.response?.data || error.message
        });
    }
});

// Get Credits Route
router.get('/credits', (req, res) => {
    try {
        console.log('Credits API request received');
        
        // Read credits directly to get the most up-to-date data
        const credits = creditManager.readCredits();
        const totalCredits = credits.totalCredits || 0;
        const paymentHistory = credits.payments || [];
        const failedPayments = credits.failedPayments || [];
        const creditHistory = credits.creditHistory || [];
        
        console.log(`Returning credits data: ${totalCredits} credits, ${creditHistory.length} history entries`);
        
        // Set cache control headers to prevent caching
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        res.json({
            success: true,
            totalCredits: totalCredits,
            paymentHistory: paymentHistory,
            failedPayments: failedPayments,
            totalFailedPayments: failedPayments.length,
            creditHistory: creditHistory
        });
    } catch (error) {
        console.error('Error fetching credits:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch credits: ' + (error.message || 'Unknown error')
        });
    }
});

// Get Failed Payments Route (for analytics)
router.get('/failed-payments', (req, res) => {
    try {
        const failedPayments = creditManager.getFailedPayments();

        res.json({
            success: true,
            failedPayments: failedPayments,
            totalFailedPayments: failedPayments.length
        });
    } catch (error) {
        console.error('Error fetching failed payments:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch failed payments'
        });
    }
});

// Reset Credits Route (for testing)
router.post('/credits/reset', (req, res) => {
    try {
        creditManager.resetCredits();
        res.json({
            success: true,
            message: 'Credits reset successfully'
        });
    } catch (error) {
        console.error('Error resetting credits:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to reset credits'
        });
    }
});

// Webhook handler for payment notifications
router.post('/webhook', (req, res) => {
    try {
        console.log('Webhook received:', req.body);
        
        // Process the webhook data
        const paymentData = req.body;
        
        // Add credit if payment is successful
        if (paymentData.payment_status === 'SUCCESS') {
            const creditData = {
                orderId: paymentData.order_id,
                transactionId: paymentData.cf_payment_id || paymentData.payment_id,
                amount: paymentData.payment_amount,
                customerEmail: paymentData.customer_email,
                customerName: paymentData.customer_name,
                paymentMethod: paymentData.payment_method,
                environment: process.env.CASHFREE_ENVIRONMENT
            };

            const totalCredits = creditManager.addCredit(creditData);
            console.log(`💰 Webhook credit processed! Total credits: ${totalCredits}`);
        } else if (paymentData.payment_status === 'FAILED') {
            // Track failed payment from webhook
            const failedPaymentData = {
                orderId: paymentData.order_id,
                transactionId: paymentData.cf_payment_id || paymentData.payment_id,
                amount: paymentData.payment_amount,
                customerEmail: paymentData.customer_email,
                customerName: paymentData.customer_name,
                paymentMethod: paymentData.payment_method,
                errorDetails: paymentData.error_details,
                environment: process.env.CASHFREE_ENVIRONMENT
            };

            const totalFailedPayments = creditManager.addFailedPayment(failedPaymentData);
            console.log(`❌ Webhook failed payment processed! Total failed payments: ${totalFailedPayments}`);
        }
        
        console.log(`Payment ${paymentData.order_id} status: ${paymentData.payment_status}`);
        
        res.status(200).json({ message: 'Webhook processed successfully' });
        
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// Verify signature (for webhook security)
const verifySignature = (signature, body, secret) => {
    const computedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');
    
    return signature === computedSignature;
};

// Direct credit processing route - can be called from frontend
router.post('/process-credit', async (req, res) => {
    try {
        console.log('Manual credit processing request:', req.body);
        
        const { orderId, transactionId, amount, customerEmail, customerName, paymentMethod } = req.body;
        
        // Validate required fields
        if (!orderId || !amount) {
            console.log('Missing required fields for credit processing');
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: orderId, amount'
            });
        }
        
        // Debug info
        console.log(`Processing credit for order ${orderId} with transaction ID ${transactionId || 'none'}`);
        console.log(`Environment: ${process.env.VERCEL ? 'Vercel' : 'Local'}, VERCEL env var: ${process.env.VERCEL}`);
        
        // First check if this payment has already been credited
        const credits = creditManager.readCredits();
        console.log('Current credits data:', JSON.stringify(credits));
        
        const existingPayment = credits.payments.find(
            p => p.orderId === orderId || (transactionId && p.transactionId === transactionId)
        );
        
        if (existingPayment) {
            console.log(`Payment already credited: ${orderId} / ${transactionId}`);
            return res.json({
                success: true,
                message: 'Credit already processed (no duplicate added)',
                totalCredits: credits.totalCredits,
                alreadyProcessed: true
            });
        }
        
        // Add the credit
        const creditData = {
            orderId,
            transactionId: transactionId || `manual_${Date.now()}`,
            amount,
            customerEmail: customerEmail || 'customer@example.com',
            customerName: customerName || 'Customer',
            paymentMethod: paymentMethod || 'manual',
            environment: process.env.CASHFREE_ENVIRONMENT || 'UNKNOWN'
        };
        
        console.log('Adding credit with data:', JSON.stringify(creditData));
        const totalCredits = creditManager.addCredit(creditData);
        console.log(`💰 Manual credit processed! Total credits: ${totalCredits}`);
        
        // Verify credit was added by reading credits again
        const updatedCredits = creditManager.readCredits();
        console.log('Updated credits data:', JSON.stringify(updatedCredits));
        
        res.json({
            success: true,
            message: 'Credit processed successfully',
            totalCredits,
            creditHistory: updatedCredits.creditHistory || []
        });
        
    } catch (error) {
        console.error('Error processing credit manually:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process credit: ' + (error.message || 'Unknown error')
        });
    }
});

// Debug route to check and fix credit data
router.get('/debug-credits', (req, res) => {
    try {
        console.log('Debug credits request received');
        
        // Read current credits
        const currentCredits = creditManager.readCredits();
        console.log('Current credits data:', JSON.stringify(currentCredits));
        
        // Fix any issues with the data structure
        const fixedData = {
            totalCredits: typeof currentCredits.totalCredits === 'number' ? currentCredits.totalCredits : 0,
            payments: Array.isArray(currentCredits.payments) ? currentCredits.payments : [],
            failedPayments: Array.isArray(currentCredits.failedPayments) ? currentCredits.failedPayments : [],
            creditHistory: Array.isArray(currentCredits.creditHistory) ? currentCredits.creditHistory : []
        };
        
        // Ensure totalCredits matches payments length
        if (fixedData.payments.length !== fixedData.totalCredits) {
            console.log(`Fixing totalCredits: ${fixedData.totalCredits} → ${fixedData.payments.length}`);
            fixedData.totalCredits = fixedData.payments.length;
        }
        
        // Save the fixed data
        const writeResult = creditManager.writeCredits(fixedData);
        console.log(`Fixed credits data saved: ${writeResult}`);
        
        // Read again to verify
        const verifiedCredits = creditManager.readCredits();
        
        // Set cache control headers
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        res.json({
            success: true,
            message: 'Credits data checked and fixed',
            originalData: currentCredits,
            fixedData: fixedData,
            verifiedData: verifiedCredits,
            isVercel: creditManager.isVercel,
            environment: process.env.VERCEL ? 'Vercel' : 'Local'
        });
    } catch (error) {
        console.error('Error in debug-credits:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check/fix credits: ' + (error.message || 'Unknown error')
        });
    }
});

// Test credit route - for debugging only
router.post('/test-credit', async (req, res) => {
    try {
        console.log('Test credit request received:', req.body);
        
        // Simple authentication
        const { secretKey } = req.body;
        if (secretKey !== 'test-credit-key') {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized - Invalid secret key'
            });
        }
        
        // Create test payment data
        const testPayment = {
            orderId: `test_order_${Date.now()}`,
            transactionId: `test_tx_${Date.now()}`,
            amount: req.body.amount || 100,
            customerEmail: req.body.email || 'test@example.com',
            customerName: req.body.name || 'Test User',
            paymentMethod: req.body.method || 'test'
        };
        
        console.log('Adding test credit:', testPayment);
        
        // Add the credit
        const totalCredits = creditManager.addCredit(testPayment);
        console.log(`💰 Test credit added! Total credits: ${totalCredits}`);
        
        // Get updated credit data
        const updatedCredits = creditManager.readCredits();
        
        // Set cache control headers to prevent caching
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        res.json({
            success: true,
            message: 'Test credit added successfully',
            totalCredits: totalCredits,
            creditHistory: updatedCredits.creditHistory || []
        });
        
    } catch (error) {
        console.error('Error adding test credit:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add test credit: ' + (error.message || 'Unknown error')
        });
    }
});

module.exports = router;
