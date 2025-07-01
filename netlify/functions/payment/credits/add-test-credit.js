const creditManager = require('../../../../creditManager');

exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' })
    };
  }
  
  try {
    // Only accept POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }
    
    // Parse the request body
    const body = JSON.parse(event.body || '{}');
    
    // Check for secret key (simple authentication)
    const secretKey = body.secretKey || '';
    if (secretKey !== 'test-credit-key') {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }
    
    // Create test payment data
    const testPayment = {
      orderId: `test_order_${Date.now()}`,
      transactionId: `test_tx_${Date.now()}`,
      amount: body.amount || 100,
      customerEmail: body.email || 'test@example.com',
      customerName: body.name || 'Test User',
      paymentMethod: body.method || 'test'
    };
    
    console.log('Adding test credit:', testPayment);
    
    // Add the credit
    const totalCredits = creditManager.addCredit(testPayment);
    
    // Get updated credit data
    const credits = creditManager.readCredits();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Test credit added successfully',
        totalCredits: totalCredits,
        creditHistory: credits.creditHistory || []
      })
    };
    
  } catch (error) {
    console.error('Error adding test credit:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to add test credit: ' + (error.message || 'Unknown error')
      })
    };
  }
}; 