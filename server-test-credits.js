// This script tests the credit manager directly
const creditManager = require('./creditManager');

// Display current credits
console.log('Current credits:', creditManager.getTotalCredits());
console.log('Current credit history:', creditManager.getCreditHistory());

// Add a test credit
const testPayment = {
    orderId: `test_order_${Date.now()}`,
    transactionId: `test_tx_${Date.now()}`,
    amount: 100,
    customerEmail: 'test@example.com',
    customerName: 'Test User',
    paymentMethod: 'test'
};

console.log('Adding test credit...');
const totalCredits = creditManager.addCredit(testPayment);
console.log('Credits after adding:', totalCredits);

// Verify the credit was added
const updatedCredits = creditManager.readCredits();
console.log('Updated total credits:', updatedCredits.totalCredits);
console.log('Updated payments count:', updatedCredits.payments.length);
console.log('Updated credit history count:', updatedCredits.creditHistory.length);

// Display the last credit history entry
if (updatedCredits.creditHistory.length > 0) {
    console.log('Last credit history entry:', updatedCredits.creditHistory[updatedCredits.creditHistory.length - 1]);
} 