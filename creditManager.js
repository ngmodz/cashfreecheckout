const fs = require('fs');
const path = require('path');
const os = require('os');

// Global in-memory storage for Vercel serverless environment
// This will reset on each cold start, but persist during function execution
let memoryStorage = null; // Will be initialized in constructor

// Initialize with default values
function getDefaultStorage() {
    return {
        totalCredits: 0,
        payments: [],
        failedPayments: [],
        creditHistory: [] // Array to store credit history events
    };
}

// Try to use /tmp directory in Vercel for more persistence between invocations
const VERCEL_TEMP_FILE = '/tmp/cashfree-credits.json';

class CreditManager {
    constructor() {
        this.dataFile = path.join(__dirname, 'data', 'credits.json');
        this.isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';
        
        // Initialize memory storage if it doesn't exist
        if (!memoryStorage || typeof memoryStorage !== 'object') {
            memoryStorage = getDefaultStorage();
            console.log('Initialized default memory storage');
        }
        
        if (this.isVercel) {
            console.log('Running in Vercel environment, loading from /tmp storage');
            this.loadVercelStorage();
        } else {
            console.log('Running in local environment, using file system storage');
            this.ensureDataDirectory();
        }
        
        // Force a read to ensure we have valid data
        const currentCredits = this.readCredits();
        console.log(`CreditManager initialized. isVercel: ${this.isVercel}, Credits: ${currentCredits.totalCredits}, History entries: ${currentCredits.creditHistory?.length || 0}`);
    }

    loadVercelStorage() {
        try {
            if (fs.existsSync(VERCEL_TEMP_FILE)) {
                try {
                    const data = fs.readFileSync(VERCEL_TEMP_FILE, 'utf8');
                    const parsedData = JSON.parse(data);
                    
                    // Validate the data structure
                    if (parsedData && typeof parsedData === 'object') {
                        if (typeof parsedData.totalCredits !== 'number') {
                            parsedData.totalCredits = 0;
                        }
                        
                        if (!Array.isArray(parsedData.payments)) {
                            parsedData.payments = [];
                        }
                        
                        if (!Array.isArray(parsedData.failedPayments)) {
                            parsedData.failedPayments = [];
                        }
                        
                        if (!Array.isArray(parsedData.creditHistory)) {
                            parsedData.creditHistory = [];
                        }
                        
                        memoryStorage = parsedData;
                        console.log('Loaded credits from Vercel temp storage:', memoryStorage.totalCredits);
                    } else {
                        throw new Error('Invalid data structure in temp file');
                    }
                } catch (parseError) {
                    console.error('Error parsing Vercel temp storage:', parseError);
                    // Initialize with default values if parsing fails
                    this.writeVercelStorage(memoryStorage);
                }
            } else {
                // Initialize the temp file
                this.writeVercelStorage(memoryStorage);
                console.log('Initialized Vercel temp storage for credits');
            }
        } catch (error) {
            console.error('Error loading Vercel storage:', error);
            // Ensure we have valid memory storage even if loading fails
            memoryStorage = {
                totalCredits: 0,
                payments: [],
                failedPayments: [],
                creditHistory: []
            };
        }
    }

    writeVercelStorage(data) {
        try {
            console.log('Writing to Vercel temp storage:', VERCEL_TEMP_FILE);
            
            // Ensure the data is valid before writing
            const validData = {
                totalCredits: typeof data.totalCredits === 'number' ? data.totalCredits : 0,
                payments: Array.isArray(data.payments) ? data.payments : [],
                failedPayments: Array.isArray(data.failedPayments) ? data.failedPayments : [],
                creditHistory: Array.isArray(data.creditHistory) ? data.creditHistory : []
            };
            
            // Ensure /tmp directory exists and is writable
            try {
                // Check if /tmp exists
                if (!fs.existsSync('/tmp')) {
                    console.log('/tmp directory does not exist, attempting to create it');
                    fs.mkdirSync('/tmp', { recursive: true });
                }
                
                // Test write permissions
                const testFile = '/tmp/test-write.txt';
                fs.writeFileSync(testFile, 'test');
                fs.unlinkSync(testFile);
                console.log('/tmp directory exists and is writable');
            } catch (dirError) {
                console.error('Error with /tmp directory:', dirError);
                // Fall back to using memory only
                console.log('Falling back to memory-only storage');
                return false;
            }
            
            // Write the actual data file
            fs.writeFileSync(VERCEL_TEMP_FILE, JSON.stringify(validData, null, 2));
            
            // Verify the file was written
            if (fs.existsSync(VERCEL_TEMP_FILE)) {
                const stats = fs.statSync(VERCEL_TEMP_FILE);
                console.log(`Successfully wrote to Vercel temp storage: ${validData.totalCredits} credits, ${validData.creditHistory.length} history entries, file size: ${stats.size} bytes`);
                return true;
            } else {
                console.error('File write appeared to succeed but file does not exist');
                return false;
            }
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
                failedPayments: [],
                creditHistory: []
            };
            fs.writeFileSync(this.dataFile, JSON.stringify(initialData, null, 2));
        }
    }

    readCredits() {
        if (this.isVercel) {
            // Ensure memory storage is initialized
            if (!memoryStorage || typeof memoryStorage !== 'object') {
                console.log('Memory storage was null or invalid, initializing default');
                memoryStorage = getDefaultStorage();
            }
            
            // Validate memory storage structure
            if (typeof memoryStorage.totalCredits !== 'number') {
                memoryStorage.totalCredits = 0;
            }
            
            if (!Array.isArray(memoryStorage.payments)) {
                memoryStorage.payments = [];
            }
            
            if (!Array.isArray(memoryStorage.failedPayments)) {
                memoryStorage.failedPayments = [];
            }
            
            if (!Array.isArray(memoryStorage.creditHistory)) {
                memoryStorage.creditHistory = [];
            }
            
            return memoryStorage;
        }
        
        try {
            const data = fs.readFileSync(this.dataFile, 'utf8');
            const parsedData = JSON.parse(data);
            
            // Validate data structure
            if (typeof parsedData.totalCredits !== 'number') {
                parsedData.totalCredits = 0;
            }
            
            if (!Array.isArray(parsedData.payments)) {
                parsedData.payments = [];
            }
            
            if (!Array.isArray(parsedData.failedPayments)) {
                parsedData.failedPayments = [];
            }
            
            if (!Array.isArray(parsedData.creditHistory)) {
                parsedData.creditHistory = [];
            }
            
            return parsedData;
        } catch (error) {
            console.error('Error reading credits:', error);
            return getDefaultStorage();
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
        console.log('Adding credit for payment:', JSON.stringify(paymentData));
        
        // Make sure we have valid payment data
        if (!paymentData || !paymentData.orderId) {
            console.error('Invalid payment data provided to addCredit');
            return 0;
        }
        
        // Read the latest credits data
        const credits = this.readCredits();
        console.log('Current credits before adding:', credits.totalCredits);
        
        // Ensure credits data structure is valid
        if (!credits.payments) credits.payments = [];
        if (!credits.creditHistory) credits.creditHistory = [];
        if (typeof credits.totalCredits !== 'number') credits.totalCredits = 0;
        
        // Check if this payment already exists to avoid duplicates
        const existingPayment = credits.payments.find(
            p => (p.orderId === paymentData.orderId) || 
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
            timestamp: new Date().toISOString(),
            environment: paymentData.environment || 'SANDBOX'
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

        // Write the updated credits data
        const writeSuccess = this.writeCredits(credits);
        
        if (writeSuccess) {
            console.log(`✅ Credit added! Total credits: ${credits.totalCredits}`);
        } else {
            console.error('❌ Failed to write credits data');
        }
        
        // Verify the credit was added by reading again
        const updatedCredits = this.readCredits();
        console.log(`Credits after adding: ${updatedCredits.totalCredits}, History entries: ${updatedCredits.creditHistory.length}`);
        
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
        
        // Add to credit history
        const historyEntry = {
            type: 'failed',
            change: 0,
            orderId: paymentData.orderId,
            transactionId: paymentData.transactionId,
            amount: paymentData.amount,
            timestamp: new Date().toISOString(),
            customerName: paymentData.customerName,
            paymentMethod: paymentData.paymentMethod,
            errorDetails: paymentData.errorDetails
        };
        
        if (!credits.creditHistory) {
            credits.creditHistory = [];
        }
        
        credits.creditHistory.push(historyEntry);

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
        this.writeCredits(initialData);
        return true;
    }
}

module.exports = CreditManager;
