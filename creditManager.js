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

// File paths for storage
const VERCEL_TEMP_FILE = '/tmp/credits-data.json';
const PROJECT_DB_FILE = path.join(__dirname, 'database.json');

class CreditManager {
    constructor() {
        this.dataFile = path.join(__dirname, 'data', 'credits.json');
        this.isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';
        
        console.log(`CreditManager initialized. isVercel: ${this.isVercel}, VERCEL env: ${process.env.VERCEL}`);
        console.log(`Node version: ${process.version}, Platform: ${process.platform}`);
        
        // Initialize memory storage with default values if not already set
        if (!memoryStorage || typeof memoryStorage !== 'object') {
            memoryStorage = {
                totalCredits: 0,
                payments: [],
                failedPayments: [],
                creditHistory: []
            };
        }
        
        if (this.isVercel) {
            console.log(`Using Vercel storage at: ${VERCEL_TEMP_FILE}`);
            this.loadVercelStorage();
            
            // Log current memory storage state
            console.log(`Memory storage after loading: totalCredits=${memoryStorage.totalCredits}, payments=${memoryStorage.payments?.length || 0}, history=${memoryStorage.creditHistory?.length || 0}`);
        } else {
            console.log(`Using file storage at: ${this.dataFile}`);
            this.ensureDataDirectory();
        }
    }

    loadVercelStorage() {
        try {
            console.log(`Checking for storage files...`);
            let dataLoaded = false;
            
            // First try loading from project database file (more reliable)
            if (fs.existsSync(PROJECT_DB_FILE)) {
                console.log(`Project database file exists at: ${PROJECT_DB_FILE}`);
                
                try {
                    const projectData = fs.readFileSync(PROJECT_DB_FILE, 'utf8');
                    const projectParsed = JSON.parse(projectData);
                    
                    if (projectParsed && typeof projectParsed === 'object') {
                        memoryStorage = {
                            totalCredits: typeof projectParsed.totalCredits === 'number' ? projectParsed.totalCredits : 0,
                            payments: Array.isArray(projectParsed.payments) ? projectParsed.payments : [],
                            failedPayments: Array.isArray(projectParsed.failedPayments) ? projectParsed.failedPayments : [],
                            creditHistory: Array.isArray(projectParsed.creditHistory) ? projectParsed.creditHistory : []
                        };
                        
                        console.log(`Successfully loaded data from project database: ${memoryStorage.totalCredits} credits, ${memoryStorage.payments.length} payments`);
                        dataLoaded = true;
                    }
                } catch (projectError) {
                    console.error('Error loading from project database file:', projectError);
                }
            }
            
            // If project database didn't work, try temp file
            if (!dataLoaded && fs.existsSync(VERCEL_TEMP_FILE)) {
                console.log(`Temp storage file exists at: ${VERCEL_TEMP_FILE}`);
                
                try {
                    const stats = fs.statSync(VERCEL_TEMP_FILE);
                    console.log(`File size: ${stats.size} bytes, Modified: ${stats.mtime}`);
                    
                    if (stats.size === 0) {
                        console.log('File exists but is empty');
                    } else {
                        const data = fs.readFileSync(VERCEL_TEMP_FILE, 'utf8');
                        console.log(`Read ${data.length} characters from temp storage file`);
                        
                        try {
                            const parsed = JSON.parse(data);
                            
                            // Validate the parsed data
                            if (!parsed || typeof parsed !== 'object') {
                                throw new Error('Invalid data structure: not an object');
                            }
                            
                            memoryStorage = {
                                totalCredits: typeof parsed.totalCredits === 'number' ? parsed.totalCredits : 0,
                                payments: Array.isArray(parsed.payments) ? parsed.payments : [],
                                failedPayments: Array.isArray(parsed.failedPayments) ? parsed.failedPayments : [],
                                creditHistory: Array.isArray(parsed.creditHistory) ? parsed.creditHistory : []
                            };
                            
                            console.log(`Successfully loaded data from temp file: ${memoryStorage.totalCredits} credits, ${memoryStorage.payments.length} payments`);
                            dataLoaded = true;
                        } catch (parseError) {
                            console.error('Failed to parse temp storage file:', parseError);
                        }
                    }
                } catch (readError) {
                    console.error('Error reading temp storage file:', readError);
                }
            }
            
            // If no data was loaded, initialize with default values
            if (!dataLoaded) {
                console.log('No valid storage found, initializing with default values');
                // Save default values to both storage locations
                this.saveVercelStorage();
            }
        } catch (error) {
            console.error('Unexpected error in loadVercelStorage:', error);
        }
    }

    saveVercelStorage() {
        try {
            // Create directory if it doesn't exist
            const tmpDir = path.dirname(VERCEL_TEMP_FILE);
            try {
                if (!fs.existsSync(tmpDir)) {
                    fs.mkdirSync(tmpDir, { recursive: true });
                }
            } catch (dirError) {
                console.error('Error creating tmp directory:', dirError);
            }
            
            // Validate data before saving
            const dataToSave = {
                totalCredits: typeof memoryStorage.totalCredits === 'number' ? memoryStorage.totalCredits : 0,
                payments: Array.isArray(memoryStorage.payments) ? memoryStorage.payments : [],
                failedPayments: Array.isArray(memoryStorage.failedPayments) ? memoryStorage.failedPayments : [],
                creditHistory: Array.isArray(memoryStorage.creditHistory) ? memoryStorage.creditHistory : []
            };
            
            // Write to file
            const dataString = JSON.stringify(dataToSave, null, 2);
            fs.writeFileSync(VERCEL_TEMP_FILE, dataString);
            
            // Verify the file was written
            if (fs.existsSync(VERCEL_TEMP_FILE)) {
                const stats = fs.statSync(VERCEL_TEMP_FILE);
                console.log(`Saved ${dataToSave.payments.length} payments and ${dataToSave.creditHistory.length} history entries to Vercel temp storage. File size: ${stats.size} bytes`);
                return true;
            } else {
                console.error('File was not created successfully');
                return false;
            }
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
        // Update memory storage
        memoryStorage = data;
        
        // In Vercel environment, try both storage methods
        if (this.isVercel) {
            const tempResult = this.saveVercelStorage();
            
            // Also try to save to project database file as backup
            try {
                fs.writeFileSync(PROJECT_DB_FILE, JSON.stringify(data, null, 2));
                console.log(`Backup data saved to project database file: ${PROJECT_DB_FILE}`);
            } catch (projectDbError) {
                console.error('Error writing to project database file:', projectDbError);
            }
            
            return tempResult;
        }
        
        // In local environment, use the data file
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
