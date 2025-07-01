// Set environment to simulate Vercel
process.env.VERCEL = 'true';

// Import the creditManager instance
const creditManager = require('./creditManager');

// Test adding a credit
console.log('Initial credits:', creditManager.getTotalCredits());
console.log('Initial credit history:', creditManager.getCreditHistory());

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

// Read credits again to verify persistence
console.log('Reading credits again...');
const updatedCredits = creditManager.readCredits();
console.log('Total credits:', updatedCredits.totalCredits);
console.log('Payments:', updatedCredits.payments.length);
console.log('Credit history:', updatedCredits.creditHistory.length);

// Print full credit data
console.log('Full credit data:', JSON.stringify(updatedCredits, null, 2)); 