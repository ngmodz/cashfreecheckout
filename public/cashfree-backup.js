// CashFree SDK Backup - Minimal Implementation
// This is a basic fallback implementation when the main SDK fails to load

window.CashfreeBackup = {
    checkout: function(options) {
        console.log('🔄 Using CashFree backup implementation');
        
        // Create a simple redirect to CashFree checkout
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://sandbox.cashfree.com/pg/checkout';
        form.style.display = 'none';
        
        // Add payment session ID
        const sessionInput = document.createElement('input');
        sessionInput.type = 'hidden';
        sessionInput.name = 'payment_session_id';
        sessionInput.value = options.paymentSessionId;
        form.appendChild(sessionInput);
        
        document.body.appendChild(form);
        
        // Submit form to redirect to CashFree
        form.submit();
        
        // Return a promise that resolves after redirect
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ redirect: true });
            }, 1000);
        });
    }
};

console.log('📦 CashFree backup SDK loaded');
