const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const paymentRoutes = require('./routes/payment');

const app = express();
const PORT = process.env.PORT || 3000;

// Handle potential issues with Vercel serverless functions
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (must come before static middleware to override index.html)
app.use('/api/payment', paymentRoutes);

// Home route - serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Checkout page
app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Success page
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

// Failure page
app.get('/failure', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'failure.html'));
});

// Serve static files (after routes to prevent index.html override)
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Only start the server if we're not in a Vercel serverless function
if (!isVercel) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.CASHFREE_ENVIRONMENT}`);
        console.log(`Visit: http://localhost:${PORT}`);
    });
}

// Export the Express app for Vercel serverless functions
module.exports = app;
