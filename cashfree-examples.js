// Example: Direct CashFree SDK Usage
// This file demonstrates how to use the CashFree SDK directly

// 1. Install the CashFree JavaScript SDK
// npm install @cashfreepayments/cashfree-js

// 2. Initialize the SDK
import { Cashfree } from '@cashfreepayments/cashfree-js';

// Initialize CashFree for Sandbox
const cashfree = new Cashfree({
    mode: 'sandbox' // Use 'production' for live environment
});

// 3. Example: Create and process payment
async function createAndProcessPayment() {
    try {
        // Step 1: Create order on your server
        const orderResponse = await fetch('/api/payment/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: 100.00,
                customerName: 'John Doe',
                customerEmail: 'john@example.com',
                customerPhone: '9999999999'
            })
        });

        const orderData = await orderResponse.json();

        if (!orderData.success) {
            throw new Error('Failed to create order');
        }

        // Step 2: Configure checkout options
        const checkoutOptions = {
            paymentSessionId: orderData.payment_session_id,
            returnUrl: window.location.origin + '/success?order_id=' + orderData.order_id,
        };

        // Step 3: Open CashFree checkout popup
        const result = await cashfree.checkout(checkoutOptions);

        // Step 4: Handle the result
        if (result.error) {
            console.error('Payment failed:', result.error);
            // Handle payment failure
        } else {
            console.log('Payment successful:', result.paymentDetails);
            // Handle payment success
        }

    } catch (error) {
        console.error('Error processing payment:', error);
    }
}

// 4. Example: Handle payment methods
const paymentMethods = {
    // Credit/Debit Cards
    cards: 'cc,dc',
    
    // Net Banking
    netBanking: 'nb',
    
    // UPI
    upi: 'upi',
    
    // Wallets
    wallets: 'wallet',
    
    // EMI
    emi: 'emi,cardlessemi',
    
    // Pay Later
    payLater: 'paylater',
    
    // Buy Now Pay Later
    bnpl: 'bnpl',
    
    // All methods
    all: 'cc,dc,nb,upi,wallet,emi,cardlessemi,paylater,bnpl'
};

// 5. Example: Custom styling for checkout
const customStyleOptions = {
    // Primary color for buttons and highlights
    primaryColor: '#667eea',
    
    // Background color for the checkout
    backgroundColor: '#ffffff',
    
    // Text color
    textColor: '#333333'
};

// 6. Example: Advanced checkout with custom options
async function advancedCheckout() {
    const advancedOptions = {
        paymentSessionId: 'session_id_from_server',
        returnUrl: window.location.origin + '/success',
        
        // Custom styling
        theme: customStyleOptions,
        
        // Preferred payment methods order
        paymentMethods: paymentMethods.all,
        
        // Auto-capture payment
        autoCapture: true,
        
        // Additional metadata
        metadata: {
            custom_field1: 'value1',
            custom_field2: 'value2'
        }
    };

    try {
        const result = await cashfree.checkout(advancedOptions);
        
        if (result.paymentDetails) {
            // Payment successful
            console.log('Payment Details:', result.paymentDetails);
            
            // Verify payment on server
            const verification = await fetch(`/api/payment/status/${result.paymentDetails.orderId}`);
            const verificationData = await verification.json();
            
            if (verificationData.success) {
                // Payment verified successfully
                window.location.href = '/success';
            }
        }
    } catch (error) {
        console.error('Advanced checkout error:', error);
    }
}

// 7. Example: Mobile app integration
function mobileAppIntegration() {
    // For mobile apps, you might want to handle the return URL differently
    const mobileOptions = {
        paymentSessionId: 'session_id_from_server',
        
        // For mobile apps, use custom schemes
        returnUrl: 'yourapp://payment-success',
        
        // Handle mobile-specific events
        onPaymentComplete: (result) => {
            console.log('Mobile payment complete:', result);
            // Handle mobile-specific post-payment actions
        }
    };

    return cashfree.checkout(mobileOptions);
}

// 8. Example: Error handling
function handlePaymentErrors(error) {
    switch (error.type) {
        case 'validation_error':
            console.error('Validation error:', error.message);
            // Show user-friendly validation message
            break;
            
        case 'payment_failed':
            console.error('Payment failed:', error.message);
            // Show payment failure message
            break;
            
        case 'network_error':
            console.error('Network error:', error.message);
            // Show network error message
            break;
            
        default:
            console.error('Unknown error:', error.message);
            // Show generic error message
    }
}

// 9. Example: Payment status polling
async function pollPaymentStatus(orderId, maxAttempts = 10, interval = 3000) {
    let attempts = 0;
    
    const poll = async () => {
        try {
            const response = await fetch(`/api/payment/status/${orderId}`);
            const data = await response.json();
            
            if (data.success && data.payments && data.payments.length > 0) {
                const payment = data.payments[0];
                
                if (payment.payment_status === 'SUCCESS') {
                    console.log('Payment confirmed:', payment);
                    return payment;
                } else if (payment.payment_status === 'FAILED') {
                    throw new Error('Payment failed');
                } else if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(poll, interval);
                } else {
                    throw new Error('Payment status polling timeout');
                }
            }
        } catch (error) {
            console.error('Error polling payment status:', error);
        }
    };
    
    return poll();
}

// Export functions for use in other modules
export {
    createAndProcessPayment,
    advancedCheckout,
    mobileAppIntegration,
    handlePaymentErrors,
    pollPaymentStatus,
    paymentMethods
};
