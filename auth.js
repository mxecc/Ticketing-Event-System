// ============================================
// Authentication JavaScript
// ============================================

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
    initAuth();
});

function initAuth() {
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser && window.location.pathname.includes('login.html')) {
        // Redirect to home if already logged in
        window.location.href = 'index.html';
    }
}

// Switch between login and register tabs
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.querySelector('.tab-btn:first-child');
    const registerTab = document.querySelector('.tab-btn:last-child');
    
    if (tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
    }
    
    // Clear messages
    clearMessages();
}

// Handle registration
async function handleRegister(event) {
    event.preventDefault();
    
    const form = event.target;
    const fullname = document.getElementById('registerFullname').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    
    // Validate inputs
    if (!validateRegisterForm(fullname, email, password, passwordConfirm)) {
        return;
    }
    
    // Check rate limiting
    if (!checkRateLimit('register')) {
        showMessage('registerMessage', 'Too many requests. Please wait a minute.', 'error');
        return;
    }
    
    // Check if email already exists
    const users = getStoredUsers();
    if (users.find(u => u.email === email)) {
        showMessage('registerMessage', 'Email already exists. Please use a different email or login.', 'error');
        return;
    }
    
    // Simulate bcrypt password hashing
    const hashedPassword = await simulateBcryptHash(password);
    
    // Create user object
    const user = {
        id: Date.now(),
        fullname: fullname,
        email: email,
        password: hashedPassword, // Store hashed password
        createdAt: new Date().toISOString()
    };
    
    // Save user
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Show success message
    showMessage('registerMessage', 'Registration successful! You can now login.', 'success');
    
    // Clear form
    form.reset();
    
    // Switch to login tab after 2 seconds
    setTimeout(() => {
        switchTab('login');
        document.getElementById('loginEmail').value = email;
    }, 2000);
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validate inputs
    if (!email || !password) {
        showMessage('loginMessage', 'Please fill in all fields.', 'error');
        return;
    }
    
    // Check rate limiting
    if (!checkRateLimit('login')) {
        showMessage('loginMessage', 'Too many requests. Please wait a minute.', 'error');
        return;
    }
    
    // Get users from storage
    const users = getStoredUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
        showMessage('loginMessage', 'Invalid email or password.', 'error');
        return;
    }
    
    // Verify password (simulate bcrypt compare)
    const isValid = await simulateBcryptCompare(password, user.password);
    
    if (!isValid) {
        showMessage('loginMessage', 'Invalid email or password.', 'error');
        return;
    }
    
    // Login successful
    const userData = {
        id: user.id,
        fullname: user.fullname,
        email: user.email
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    showMessage('loginMessage', 'Login successful! Redirecting...', 'success');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Get stored users
function getStoredUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Validate registration form
function validateRegisterForm(fullname, email, password, passwordConfirm) {
    let isValid = true;
    
    if (!fullname || fullname.length < 2) {
        showFieldError('registerFullnameError', 'Name must be at least 2 characters.');
        isValid = false;
    }
    
    if (!email || !isValidEmail(email)) {
        showFieldError('registerEmailError', 'Please enter a valid email address.');
        isValid = false;
    }
    
    if (!password || password.length < 6) {
        showFieldError('registerPasswordError', 'Password must be at least 6 characters.');
        isValid = false;
    }
    
    if (password !== passwordConfirm) {
        showFieldError('registerPasswordConfirmError', 'Passwords do not match.');
        isValid = false;
    }
    
    return isValid;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show field error
function showFieldError(fieldId, message) {
    const errorEl = document.getElementById(fieldId);
    if (errorEl) {
        errorEl.textContent = message;
    }
}

// Show form message
function showMessage(messageId, message, type) {
    const messageEl = document.getElementById(messageId);
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `form-message ${type}`;
    }
}

// Clear messages
function clearMessages() {
    const messages = document.querySelectorAll('.form-message');
    messages.forEach(msg => {
        msg.textContent = '';
        msg.className = 'form-message';
    });
    
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(err => {
        err.textContent = '';
    });
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Export functions
window.switchTab = switchTab;
window.handleRegister = handleRegister;
window.handleLogin = handleLogin;
window.logout = logout;

