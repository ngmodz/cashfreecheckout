const fs = require('fs');
const path = require('path');
const os = require('os');

// Global in-memory storage that persists during function execution
let memoryStorage = {
    totalCredits: 0,
    payments: [],
    failedPayments: [],
    creditHistory: []
};

// Simple file path for Vercel's /tmp directory
const VERCEL_TEMP_FILE = '/tmp/credits-data.json';

class CreditManager {
    constructor() {
        this.dataFile = path.join(__dirname, 'data', 'credits.json');
        this.isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';
        
        console.log(`CreditManager initialized. isVercel: ${this.isVercel}`);
        
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
                try {
                    const parsed = JSON.parse(data);
                    memoryStorage = {
                        totalCredits: parsed.totalCredits || 0,
                        payments: Array.isArray(parsed.payments) ? parsed.payments : [],
                        failedPayments: Array.isArray(parsed.failedPayments) ? parsed.failedPayments : [],
                        creditHistory: Array.isArray(parsed.creditHistory) ? parsed.creditHistory : []
                    };
                    console.log(`Loaded ${memoryStorage.payments.length} payments and ${memoryStorage.creditHistory.length} history entries from Vercel temp storage`);
                } catch (e) {
                    console.error('Failed to parse Vercel storage, using default values', e);
                }
            } else {
                console.log('No existing Vercel storage found, using default values');
            }
        } catch (error) {
            console.error('Error loading from Vercel storage:', error);
        }
    }

    saveVercelStorage() {
        try {
            fs.writeFileSync(VERCEL_TEMP_FILE, JSON.stringify(memoryStorage));
            console.log(`Saved ${memoryStorage.payments.length} payments and ${memoryStorage.creditHistory.length} history entries to Vercel temp storage`);
            return true;
        } catch (error) {
            console.error('Error saving to Vercel storage:', error);
            return false;
        }
    }

    ensureDataDirectory() {
        const dataDir = path.dirname(this.dataFile);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        if (!fs.existsSync(this.dataFile)) {
            const initialData = {
                totalCredits: 0,
                payments: [],
                failedPayments: [],
                creditHistory: []
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
            return { totalCredits: 0, payments: [], failedPayments: [], creditHistory: [] };
        }
    }

    writeCredits(data) {
        if (this.isVercel) {
            memoryStorage = data;
            return this.saveVercelStorage();
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
        console.log('Adding credit for payment:', JSON.stringify(paymentData));
        
        if (!paymentData || !paymentData.orderId) {
            console.error('Invalid payment data');
            return 0;
        }
        
        const credits = this.readCredits();
        
        // Ensure all required properties exist
        if (!credits.payments) credits.payments = [];
        if (!credits.creditHistory) credits.creditHistory = [];
        if (typeof credits.totalCredits !== 'number') credits.totalCredits = 0;
        
        // Check for duplicate
        const existingPayment = credits.payments.find(p => 
            p.orderId === paymentData.orderId || 
            (paymentData.transactionId && p.transactionId === paymentData.transactionId)
        );

        if (existingPayment) {
            console.log('Payment already credited:', paymentData.orderId);
            return credits.totalCredits;
        }

        // Add new payment
        const newPayment = {
            orderId: paymentData.orderId,
            transactionId: paymentData.transactionId || `manual_${Date.now()}`,
            amount: paymentData.amount,
            customerEmail: paymentData.customerEmail || 'customer@example.com',
            customerName: paymentData.customerName || 'Customer',
            paymentMethod: paymentData.paymentMethod || 'manual',
            timestamp: new Date().toISOString()
        };

        credits.payments.push(newPayment);
        credits.totalCredits = credits.payments.length;
        
        // Add to credit history
        const historyEntry = {
            type: 'success',
            change: +1,
            orderId: paymentData.orderId,
            transactionId: paymentData.transactionId || `manual_${Date.now()}`,
            amount: paymentData.amount,
            timestamp: new Date().toISOString(),
            customerName: paymentData.customerName || 'Customer',
            paymentMethod: paymentData.paymentMethod || 'manual'
        };
        
        credits.creditHistory.push(historyEntry);

        // Save the updated credits
        const writeResult = this.writeCredits(credits);
        console.log(`Credit added! Total: ${credits.totalCredits}, Write success: ${writeResult}`);
        
        return credits.totalCredits;
    }

    addFailedPayment(paymentData) {
        const credits = this.readCredits();
        
        // Ensure all required properties exist
        if (!credits.failedPayments) credits.failedPayments = [];
        if (!credits.creditHistory) credits.creditHistory = [];
        
        // Check for duplicate
        const existingFailedPayment = credits.failedPayments.find(p => 
            p.orderId === paymentData.orderId || 
            (paymentData.transactionId && p.transactionId === paymentData.transactionId)
        );

        if (existingFailedPayment) {
            console.log('Failed payment already recorded:', paymentData.orderId);
            return credits.failedPayments.length;
        }

        // Add new failed payment record
        const newFailedPayment = {
            orderId: paymentData.orderId,
            transactionId: paymentData.transactionId || `failed_${Date.now()}`,
            amount: paymentData.amount,
            customerEmail: paymentData.customerEmail || 'customer@example.com',
            customerName: paymentData.customerName || 'Customer',
            paymentMethod: paymentData.paymentMethod || 'unknown',
            errorDetails: paymentData.errorDetails,
            timestamp: new Date().toISOString()
        };

        credits.failedPayments.push(newFailedPayment);
        
        // Add to credit history
        const historyEntry = {
            type: 'failed',
            change: 0,
            orderId: paymentData.orderId,
            transactionId: paymentData.transactionId || `failed_${Date.now()}`,
            amount: paymentData.amount,
            timestamp: new Date().toISOString(),
            customerName: paymentData.customerName || 'Customer',
            paymentMethod: paymentData.paymentMethod || 'unknown',
            errorDetails: paymentData.errorDetails
        };
        
        credits.creditHistory.push(historyEntry);

        this.writeCredits(credits);
        console.log(`Failed payment recorded! Total: ${credits.failedPayments.length}`);
        
        return credits.failedPayments.length;
    }

    getTotalCredits() {
        const credits = this.readCredits();
        return credits.totalCredits || 0;
    }

    getPaymentHistory() {
        const credits = this.readCredits();
        return credits.payments || [];
    }

    getFailedPayments() {
        const credits = this.readCredits();
        return credits.failedPayments || [];
    }

    getCreditHistory() {
        const credits = this.readCredits();
        return credits.creditHistory || [];
    }
    
    resetCredits() {
        const initialData = {
            totalCredits: 0,
            payments: [],
            failedPayments: [],
            creditHistory: []
        };
        return this.writeCredits(initialData);
    }
}

module.exports = new CreditManager();
