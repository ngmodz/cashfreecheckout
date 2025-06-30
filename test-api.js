// Quick API test script
// Run this with: node test-api.js

const axios = require('axios');
require('dotenv').config();

async function testAPI() {
    console.log('🧪 Testing CashFree API Integration...\n');
    
    // Test data
    const testPayment = {
        amount: 10,
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        customerPhone: '9999999999'
    };
    
    try {
        console.log('📡 Testing create-order endpoint...');
        console.log('Sending data:', testPayment);
        
        const response = await axios.post('http://localhost:3000/api/payment/create-order', testPayment, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
        
        console.log('✅ API Response Status:', response.status);
        console.log('✅ API Response Data:', JSON.stringify(response.data, null, 2));
        
        if (response.data.success) {
            console.log('\n🎉 API Test PASSED!');
            console.log('- Order ID:', response.data.order_id);
            console.log('- Payment Session ID:', response.data.payment_session_id);
            console.log('- Environment:', response.data.environment);
        } else {
            console.log('\n❌ API Test FAILED!');
            console.log('Error:', response.data.error);
        }
        
    } catch (error) {
        console.log('\n❌ API Test FAILED!');
        console.log('Error:', error.message);
        
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Response:', error.response.data);
        }
    }
}

// Check if server is running
async function checkServer() {
    try {
        const response = await axios.get('http://localhost:3000', { timeout: 5000 });
        console.log('✅ Server is running');
        return true;
    } catch (error) {
        console.log('❌ Server is not running. Please start it with: npm run dev');
        return false;
    }
}

async function main() {
    const serverRunning = await checkServer();
    if (serverRunning) {
        await testAPI();
    }
}

main();
