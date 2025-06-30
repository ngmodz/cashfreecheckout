const fs = require('fs');
const path = require('path');

class CreditManager {
    constructor() {
        this.dataFile = path.join(__dirname, 'data', 'credits.json');
        this.ensureDataDirectory();
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
                payments: []
            };
            fs.writeFileSync(this.dataFile, JSON.stringify(initialData, null, 2));
        }
    }

    readCredits() {
        try {
            const data = fs.readFileSync(this.dataFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading credits:', error);
            return { totalCredits: 0, payments: [] };
        }
    }

    writeCredits(data) {
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
            payments: []
        };
        this.writeCredits(initialData);
        return true;
    }
}

module.exports = CreditManager;
