// Test Credit System
const CreditManager = require('./creditManager');

async function testCreditSystem() {
    console.log('🧪 Testing Credit System...\n');
    
    const creditManager = new CreditManager();
    
    // Test 1: Initial credits
    console.log('📊 Initial credits:', creditManager.getTotalCredits());
    
    // Test 2: Add a test credit
    const testPayment1 = {
        orderId: 'TEST_ORDER_1',
        transactionId: 'TXN_123456',
        amount: 100,
        customerEmail: 'test@example.com',
        customerName: 'Test User',
        paymentMethod: 'upi',
        environment: 'SANDBOX'
    };
    
    console.log('💰 Adding test payment 1...');
    const credits1 = creditManager.addCredit(testPayment1);
    console.log('Credits after payment 1:', credits1);
    
    // Test 3: Add another credit
    const testPayment2 = {
        orderId: 'TEST_ORDER_2',
        transactionId: 'TXN_789012',
        amount: 200,
        customerEmail: 'user@example.com',
        customerName: 'Another User',
        paymentMethod: 'card',
        environment: 'SANDBOX'
    };
    
    console.log('💰 Adding test payment 2...');
    const credits2 = creditManager.addCredit(testPayment2);
    console.log('Credits after payment 2:', credits2);
    
    // Test 4: Try to add duplicate (should not increase credits)
    console.log('🔄 Trying to add duplicate payment...');
    const duplicateCredits = creditManager.addCredit(testPayment1);
    console.log('Credits after duplicate attempt:', duplicateCredits);
    
    // Test 5: Get payment history
    console.log('\n📋 Payment History:');
    const history = creditManager.getPaymentHistory();
    history.forEach((payment, index) => {
        console.log(`${index + 1}. Order: ${payment.orderId}, Amount: ₹${payment.amount}, Customer: ${payment.customerName}`);
    });
    
    console.log('\n✅ Credit system test completed!');
    console.log(`Final total credits: ${creditManager.getTotalCredits()}`);
}

// Run the test
testCreditSystem();
