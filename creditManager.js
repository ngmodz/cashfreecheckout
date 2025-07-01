const fs = require('fs');
const path = require('path');
const os = require('os');

// Global in-memory storage for Vercel serverless environment
// This will reset on each cold start, but persist during function execution
let memoryStorage = {
    totalCredits: 0,
    payments: [],
    failedPayments: []
};

// Try to use /tmp directory in Vercel for more persistence between invocations
const VERCEL_TEMP_FILE = '/tmp/cashfree-credits.json';

class CreditManager {
    constructor() {
        this.dataFile = path.join(__dirname, 'data', 'credits.json');
        this.isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';
        
        if (this.isVercel) {
            this.loadVercelStorage();
        } else {
            this.ensureDataDirectory();
        }
    }

    loadVercelStorage() {
        try {
            if (fs.existsSync(VERCEL_TEMP_FILE)) {
                const data = fs.readFileSync(VERCEL_TEMP_FILE, 'utf8');
                memoryStorage = JSON.parse(data);
                console.log('Loaded credits from Vercel temp storage:', memoryStorage.totalCredits);
            } else {
                // Initialize the temp file
                this.writeVercelStorage(memoryStorage);
                console.log('Initialized Vercel temp storage for credits');
            }
        } catch (error) {
            console.error('Error loading Vercel storage:', error);
        }
    }

    writeVercelStorage(data) {
        try {
            fs.writeFileSync(VERCEL_TEMP_FILE, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error('Error writing to Vercel temp storage:', error);
            return false;
        }
    }

    ensureDataDirectory() {
        const dataDir = path.dirname(this.dataFile);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Initialize credits file if it doesn't exist
        if (!fs.existsSync(this.dataFile)) {
            const initialData = {
                totalCredits: 0,
                payments: [],
                failedPayments: []
            };
            fs.writeFileSync(this.dataFile, JSON.stringify(initialData, null, 2));
        }
    }

    readCredits() {
        if (this.isVercel) {
            return memoryStorage;
        }
        
        try {
            const data = fs.readFileSync(this.dataFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading credits:', error);
            return { totalCredits: 0, payments: [], failedPayments: [] };
        }
    }

    writeCredits(data) {
        if (this.isVercel) {
            memoryStorage = data;
            this.writeVercelStorage(data);
            return true;
        }
        
        try {
            fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error('Error writing credits:', error);
            return false;
        }
    }

    addCredit(paymentData) {
        const credits = this.readCredits();
        
        // Check if this payment already exists to avoid duplicates
        const existingPayment = credits.payments.find(
            p => p.orderId === paymentData.orderId || p.transactionId === paymentData.transactionId
        );

        if (existingPayment) {
            console.log('Payment already credited:', paymentData.orderId);
            return credits.totalCredits;
        }

        // Add new payment
        const newPayment = {
            orderId: paymentData.orderId,
            transactionId: paymentData.transactionId,
            amount: paymentData.amount,
            customerEmail: paymentData.customerEmail,
            customerName: paymentData.customerName,
            paymentMethod: paymentData.paymentMethod,
            timestamp: new Date().toISOString(),
            environment: paymentData.environment || 'SANDBOX'
        };

        credits.payments.push(newPayment);
        credits.totalCredits = credits.payments.length;

        this.writeCredits(credits);

        console.log(`✅ Credit added! Total credits: ${credits.totalCredits}`);
        return credits.totalCredits;
    }

    addFailedPayment(paymentData) {
        const credits = this.readCredits();
        
        // Initialize failed payments array if it doesn't exist
        if (!credits.failedPayments) {
            credits.failedPayments = [];
        }
        
        // Check if this failed payment already exists to avoid duplicates
        const existingFailedPayment = credits.failedPayments.find(
            p => p.orderId === paymentData.orderId || p.transactionId === paymentData.transactionId
        );

        if (existingFailedPayment) {
            console.log('Failed payment already recorded:', paymentData.orderId);
            return credits.failedPayments.length;
        }

        // Add new failed payment record
        const newFailedPayment = {
            orderId: paymentData.orderId,
            transactionId: paymentData.transactionId,
            amount: paymentData.amount,
            customerEmail: paymentData.customerEmail,
            customerName: paymentData.customerName,
            paymentMethod: paymentData.paymentMethod,
            errorDetails: paymentData.errorDetails,
            timestamp: new Date().toISOString(),
            environment: paymentData.environment || 'SANDBOX'
        };

        credits.failedPayments.push(newFailedPayment);

        this.writeCredits(credits);

        console.log(`❌ Failed payment recorded! Total failed payments: ${credits.failedPayments.length}`);
        return credits.failedPayments.length;
    }

    getTotalCredits() {
        const credits = this.readCredits();
        return credits.totalCredits;
    }

    getPaymentHistory() {
        const credits = this.readCredits();
        return credits.payments;
    }

    getFailedPayments() {
        const credits = this.readCredits();
        return credits.failedPayments || [];
    }

    resetCredits() {
        const initialData = {
            totalCredits: 0,
            payments: [],
            failedPayments: []
        };
        this.writeCredits(initialData);
        return true;
    }
}

module.exports = CreditManager;
