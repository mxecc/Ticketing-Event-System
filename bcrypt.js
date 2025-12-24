// ============================================
// Bcrypt Password Hashing Simulation
// ============================================

// Simulate bcrypt hash function
// In a real application, this would use the actual bcrypt library
async function simulateBcryptHash(password) {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Create a simulated hash (in production, use actual bcrypt)
    // This simulates the bcrypt.hash(password, 10) behavior
    const salt = generateSalt();
    const hash = simpleHash(password + salt);
    
    // Return simulated bcrypt hash format: $2b$10$salt+hash
    return `$2b$10$${salt}${hash}`;
}

// Simulate bcrypt compare function
async function simulateBcryptCompare(password, hash) {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Extract salt from hash
    const hashParts = hash.split('$');
    if (hashParts.length !== 4) return false;
    
    const salt = hashParts[3].substring(0, 22); // Bcrypt salt is 22 chars
    const storedHash = hashParts[3].substring(22);
    
    // Recompute hash with extracted salt
    const computedHash = simpleHash(password + salt);
    
    // Compare (in production, bcrypt does constant-time comparison)
    return computedHash === storedHash;
}

// Generate a random salt (simulated)
function generateSalt() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./';
    let salt = '';
    for (let i = 0; i < 22; i++) {
        salt += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return salt;
}

// Simple hash function (simulated - in production use actual bcrypt)
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to base64-like string (simulated bcrypt hash format)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./';
    let result = '';
    let num = Math.abs(hash);
    
    for (let i = 0; i < 31; i++) {
        result += chars.charAt(num % chars.length);
        num = Math.floor(num / chars.length);
    }
    
    return result;
}

// Show bcrypt info in UI
function showBcryptInfo() {
    const bcryptInfo = document.querySelector('.bcrypt-info');
    if (bcryptInfo) {
        bcryptInfo.innerHTML = `
            <small>🔒 Passwords are secured with Bcrypt hashing (simulated)</small>
            <br>
            <small style="font-size: 0.75rem; color: #6b7280;">
                Algorithm: bcrypt with salt rounds: 10
            </small>
        `;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    showBcryptInfo();
});

// Export functions
window.simulateBcryptHash = simulateBcryptHash;
window.simulateBcryptCompare = simulateBcryptCompare;

