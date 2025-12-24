// ============================================
// Shopping Cart Functionality
// ============================================

let cart = [];

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartDisplay();
});

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(eventId, eventName, price, image) {
    const existingItem = cart.find(item => item.eventId === eventId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            eventId: eventId,
            name: eventName,
            price: price,
            quantity: 1,
            image: image
        });
    }
    
    saveCart();
    updateCartDisplay();
    showNotification('Item added to cart!', 'success');
}

// Remove item from cart
function removeFromCart(eventId) {
    cart = cart.filter(item => item.eventId !== eventId);
    saveCart();
    updateCartDisplay();
    showNotification('Item removed from cart', 'success');
}

// Update quantity
function updateQuantity(eventId, newQuantity) {
    const item = cart.find(item => item.eventId === eventId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(eventId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartDisplay();
        }
    }
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
    }
}

// Update cart display
function updateCartDisplay() {
    const cartBadge = document.getElementById('cartBadge');
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Update cart items
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
            if (cartSummary) cartSummary.style.display = 'none';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${formatCurrency(item.price)} each</div>
                        <div class="cart-item-controls">
                            <button class="quantity-btn" onclick="updateQuantity(${item.eventId}, ${item.quantity - 1})">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                                   onchange="updateQuantity(${item.eventId}, parseInt(this.value))">
                            <button class="quantity-btn" onclick="updateQuantity(${item.eventId}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.eventId})" title="Remove">×</button>
                </div>
            `).join('');
            
            // Update summary
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            if (cartSubtotal) cartSubtotal.textContent = formatCurrency(subtotal);
            if (cartTotal) cartTotal.textContent = formatCurrency(subtotal);
            if (cartSummary) cartSummary.style.display = 'block';
        }
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    // Store cart in sessionStorage for checkout
    sessionStorage.setItem('checkoutCart', JSON.stringify(cart));
    
    // Redirect to booking page (or create a checkout page)
    // For now, we'll use the first item in cart
    if (cart.length > 0) {
        const firstItem = cart[0];
        // Find the event in eventsData
        const events = window.eventsData || JSON.parse(localStorage.getItem('eventsData') || '[]');
        const event = events.find(e => e.id === firstItem.eventId);
        
        if (event) {
            sessionStorage.setItem('selectedEvent', JSON.stringify(event));
            window.location.href = 'booking.html';
        } else {
            showNotification('Event not found', 'error');
        }
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Show notification
function showNotification(message, type) {
    // Use the notification function from app.js if available
    if (window.showNotification) {
        window.showNotification(message, type);
    } else {
        alert(message);
    }
}

// Export functions
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.toggleCart = toggleCart;
window.proceedToCheckout = proceedToCheckout;

