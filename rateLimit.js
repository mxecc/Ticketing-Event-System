// ============================================
// Rate Limiting Implementation
// ============================================

// Rate limit configuration: 100 requests per minute
const RATE_LIMIT = {
    maxRequests: 100,
    windowMs: 60 * 1000 // 1 minute
};

// Store request timestamps
let requestHistory = {
    login: [],
    register: []
};

// Load request history from localStorage
function loadRequestHistory() {
    const stored = localStorage.getItem('rateLimitHistory');
    if (stored) {
        const parsed = JSON.parse(stored);
        // Filter out old requests (older than 1 minute)
        const now = Date.now();
        requestHistory.login = (parsed.login || []).filter(timestamp => now - timestamp < RATE_LIMIT.windowMs);
        requestHistory.register = (parsed.register || []).filter(timestamp => now - timestamp < RATE_LIMIT.windowMs);
    }
}

// Save request history to localStorage
function saveRequestHistory() {
    localStorage.setItem('rateLimitHistory', JSON.stringify(requestHistory));
}

// Check rate limit for a specific endpoint
function checkRateLimit(endpoint) {
    const now = Date.now();
    const history = requestHistory[endpoint] || [];
    
    // Remove requests older than 1 minute
    const recentRequests = history.filter(timestamp => now - timestamp < RATE_LIMIT.windowMs);
    requestHistory[endpoint] = recentRequests;
    
    // Check if limit exceeded
    if (recentRequests.length >= RATE_LIMIT.maxRequests) {
        return false; // Rate limit exceeded
    }
    
    // Add current request
    recentRequests.push(now);
    requestHistory[endpoint] = recentRequests;
    
    // Save to localStorage
    saveRequestHistory();
    
    // Update UI
    updateRateLimitDisplay(endpoint, recentRequests.length);
    
    return true; // Request allowed
}

// Update rate limit display in UI
function updateRateLimitDisplay(endpoint, count) {
    const countElement = document.getElementById(`${endpoint}RequestsCount`);
    if (countElement) {
        countElement.textContent = count;
        
        // Change color if approaching limit
        const infoElement = countElement.closest('.rate-limit-info');
        if (infoElement) {
            if (count >= RATE_LIMIT.maxRequests * 0.9) {
                infoElement.style.color = '#ef4444';
                infoElement.style.fontWeight = '600';
            } else if (count >= RATE_LIMIT.maxRequests * 0.7) {
                infoElement.style.color = '#f59e0b';
            } else {
                infoElement.style.color = '#6b7280';
            }
        }
    }
}

// Get remaining requests
function getRemainingRequests(endpoint) {
    const now = Date.now();
    const history = requestHistory[endpoint] || [];
    const recentRequests = history.filter(timestamp => now - timestamp < RATE_LIMIT.windowMs);
    return Math.max(0, RATE_LIMIT.maxRequests - recentRequests.length);
}

// Reset rate limit (for testing purposes)
function resetRateLimit(endpoint) {
    if (endpoint) {
        requestHistory[endpoint] = [];
    } else {
        requestHistory = { login: [], register: [] };
    }
    saveRequestHistory();
}

// Initialize rate limiting on page load
document.addEventListener('DOMContentLoaded', function() {
    loadRequestHistory();
    
    // Update displays
    updateRateLimitDisplay('login', requestHistory.login.length);
    updateRateLimitDisplay('register', requestHistory.register.length);
    
    // Auto-cleanup old requests every 30 seconds
    setInterval(() => {
        const now = Date.now();
        Object.keys(requestHistory).forEach(endpoint => {
            requestHistory[endpoint] = requestHistory[endpoint].filter(
                timestamp => now - timestamp < RATE_LIMIT.windowMs
            );
        });
        saveRequestHistory();
        
        // Update displays
        updateRateLimitDisplay('login', requestHistory.login.length);
        updateRateLimitDisplay('register', requestHistory.register.length);
    }, 30000);
});

// Export functions
window.checkRateLimit = checkRateLimit;
window.getRemainingRequests = getRemainingRequests;
window.resetRateLimit = resetRateLimit;

