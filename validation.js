// ============================================
// Form Validation JavaScript
// ============================================

// Validate name input
function validateName(input) {
    const value = input.value.trim();
    const errorId = input.id + 'Error';
    const errorEl = document.getElementById(errorId);
    
    if (!value) {
        showError(errorEl, 'Name is required.');
        return false;
    }
    
    if (value.length < 2) {
        showError(errorEl, 'Name must be at least 2 characters.');
        return false;
    }
    
    if (!/^[a-zA-Z\s]+$/.test(value)) {
        showError(errorEl, 'Name can only contain letters and spaces.');
        return false;
    }
    
    clearError(errorEl);
    return true;
}

// Validate email input
function validateEmail(input) {
    const value = input.value.trim();
    const errorId = input.id + 'Error';
    const errorEl = document.getElementById(errorId);
    
    if (!value) {
        showError(errorEl, 'Email is required.');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        showError(errorEl, 'Please enter a valid email address.');
        return false;
    }
    
    clearError(errorEl);
    return true;
}

// Validate password input
function validatePassword(input) {
    const value = input.value;
    const errorId = input.id + 'Error';
    const errorEl = document.getElementById(errorId);
    const strengthEl = document.getElementById('passwordStrength');
    
    if (!value) {
        showError(errorEl, 'Password is required.');
        if (strengthEl) strengthEl.className = 'password-strength';
        return false;
    }
    
    if (value.length < 6) {
        showError(errorEl, 'Password must be at least 6 characters.');
        if (strengthEl) {
            strengthEl.className = 'password-strength weak';
        }
        return false;
    }
    
    // Check password strength
    let strength = 'weak';
    if (value.length >= 8 && /[A-Z]/.test(value) && /[0-9]/.test(value)) {
        strength = 'strong';
    } else if (value.length >= 6 && (/[A-Z]/.test(value) || /[0-9]/.test(value))) {
        strength = 'medium';
    }
    
    if (strengthEl) {
        strengthEl.className = `password-strength ${strength}`;
    }
    
    clearError(errorEl);
    return true;
}

// Validate password match
function validatePasswordMatch() {
    const password = document.getElementById('registerPassword');
    const confirm = document.getElementById('registerPasswordConfirm');
    const errorEl = document.getElementById('registerPasswordConfirmError');
    
    if (!password || !confirm || !errorEl) return;
    
    if (confirm.value && password.value !== confirm.value) {
        showError(errorEl, 'Passwords do not match.');
        return false;
    }
    
    clearError(errorEl);
    return true;
}

// Validate phone number
function validatePhone(input) {
    const value = input.value.trim();
    const errorId = input.id + 'Error';
    const errorEl = document.getElementById(errorId);
    
    if (!value) {
        showError(errorEl, 'Phone number is required.');
        return false;
    }
    
    // Allow various phone formats
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
        showError(errorEl, 'Please enter a valid phone number.');
        return false;
    }
    
    clearError(errorEl);
    return true;
}

// Validate card number
function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '');
    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    input.value = formatted;
}

function validateCardNumber(input) {
    const value = input.value.replace(/\s/g, '');
    const errorId = input.id + 'Error';
    const errorEl = document.getElementById(errorId);
    
    if (!value) {
        showError(errorEl, 'Card number is required.');
        return false;
    }
    
    // Luhn algorithm for card validation
    if (!luhnCheck(value)) {
        showError(errorEl, 'Invalid card number.');
        return false;
    }
    
    if (value.length < 13 || value.length > 19) {
        showError(errorEl, 'Card number must be between 13 and 19 digits.');
        return false;
    }
    
    clearError(errorEl);
    return true;
}

// Luhn algorithm for card validation
function luhnCheck(cardNumber) {
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}

// Validate expiry date
function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}

function validateExpiry(input) {
    const value = input.value;
    const errorId = input.id + 'Error';
    const errorEl = document.getElementById(errorId);
    
    if (!value) {
        showError(errorEl, 'Expiry date is required.');
        return false;
    }
    
    const parts = value.split('/');
    if (parts.length !== 2) {
        showError(errorEl, 'Please enter date in MM/YY format.');
        return false;
    }
    
    const month = parseInt(parts[0]);
    const year = parseInt('20' + parts[1]);
    
    if (month < 1 || month > 12) {
        showError(errorEl, 'Invalid month.');
        return false;
    }
    
    const now = new Date();
    const expiryDate = new Date(year, month - 1);
    
    if (expiryDate < now) {
        showError(errorEl, 'Card has expired.');
        return false;
    }
    
    clearError(errorEl);
    return true;
}

// Validate CVV
function validateCVV(input) {
    const value = input.value;
    const errorId = input.id + 'Error';
    const errorEl = document.getElementById(errorId);
    
    if (!value) {
        showError(errorEl, 'CVV is required.');
        return false;
    }
    
    if (!/^\d{3,4}$/.test(value)) {
        showError(errorEl, 'CVV must be 3 or 4 digits.');
        return false;
    }
    
    clearError(errorEl);
    return true;
}

// Validate quantity
function validateQuantity(input) {
    const value = parseInt(input.value);
    const errorId = input.id + 'Error';
    const errorEl = document.getElementById(errorId);
    
    if (!value || value < 1) {
        showError(errorEl, 'Quantity must be at least 1.');
        return false;
    }
    
    if (value > 10) {
        showError(errorEl, 'Maximum 10 tickets per booking.');
        return false;
    }
    
    clearError(errorEl);
    return true;
}

// Validate event field
function validateEventField(input) {
    const value = input.value.trim();
    const errorId = input.id + 'Error';
    const errorEl = document.getElementById(errorId);
    
    if (!value && input.required) {
        showError(errorEl, 'This field is required.');
        return false;
    }
    
    // Additional validation based on field type
    if (input.type === 'number' && value) {
        const num = parseFloat(value);
        if (isNaN(num) || num < 0) {
            showError(errorEl, 'Please enter a valid positive number.');
            return false;
        }
    }
    
    if (input.type === 'date' && value) {
        const date = new Date(value);
        if (date < new Date()) {
            showError(errorEl, 'Event date must be in the future.');
            return false;
        }
    }
    
    clearError(errorEl);
    return true;
}

// Show error message
function showError(errorEl, message) {
    if (errorEl) {
        errorEl.textContent = message;
    }
}

// Clear error message
function clearError(errorEl) {
    if (errorEl) {
        errorEl.textContent = '';
    }
}

// Export functions
window.validateName = validateName;
window.validateEmail = validateEmail;
window.validatePassword = validatePassword;
window.validatePasswordMatch = validatePasswordMatch;
window.validatePhone = validatePhone;
window.formatCardNumber = formatCardNumber;
window.validateCardNumber = validateCardNumber;
window.formatExpiry = formatExpiry;
window.validateExpiry = validateExpiry;
window.validateCVV = validateCVV;
window.validateQuantity = validateQuantity;
window.validateEventField = validateEventField;

