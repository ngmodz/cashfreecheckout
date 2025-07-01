const axios = require('axios');

// Replace with your Vercel deployment URL
const API_URL = 'https://cashfreecheckout-2dxj50t5x-nishus-projects-70e433b8.vercel.app/api/payment/process-credit';

async function addTestCredit() {
  try {
    console.log('Adding test credit...');
    
    const testPayment = {
      orderId: `test_order_${Date.now()}`,
      transactionId: `test_tx_${Date.now()}`,
      amount: 100,
      customerEmail: 'test@example.com',
      customerName: 'Test User',
      paymentMethod: 'test'
    };
    
    console.log('Sending credit data:', testPayment);
    
    const response = await axios.post(API_URL, testPayment, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store'
      }
    });
    
    console.log('Response:', response.data);
    
    // Now check if the credit was added
    await checkCredits();
    
  } catch (error) {
    console.error('Error adding test credit:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

async function checkCredits() {
  try {
    console.log('\nChecking credits...');
    
    const response = await axios.get(
      'https://cashfreecheckout-2dxj50t5x-nishus-projects-70e433b8.vercel.app/api/payment/credits',
      {
        headers: {
          'Cache-Control': 'no-cache, no-store',
          'Pragma': 'no-cache'
        }
      }
    );
    
    console.log('Total credits:', response.data.totalCredits);
    console.log('Credit history entries:', response.data.creditHistory.length);
    console.log('Credit history:', JSON.stringify(response.data.creditHistory, null, 2));
    
  } catch (error) {
    console.error('Error checking credits:', error.message);
  }
}

// Run the test
addTestCredit(); 