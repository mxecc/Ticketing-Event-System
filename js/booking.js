// ============================================
// Booking Management JavaScript
// ============================================

// Initialize booking page
document.addEventListener('DOMContentLoaded', function() {
    initializeBooking();
});

function initializeBooking() {
    // Load event from URL or sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');
    
    if (eventId) {
        // Load event details
        if (window.loadEventForBooking) {
            window.loadEventForBooking(parseInt(eventId));
        } else {
            // Fallback: load from eventsData
            const events = window.eventsData || JSON.parse(localStorage.getItem('eventsData') || '[]');
            const event = events.find(e => e.id === parseInt(eventId));
            if (event) {
                loadEventSummary(event);
                sessionStorage.setItem('selectedEvent', JSON.stringify(event));
            } else {
                window.location.href = 'index.html';
            }
        }
    } else {
        // Try to load from sessionStorage
        const storedEvent = sessionStorage.getItem('selectedEvent');
        if (storedEvent) {
            const event = JSON.parse(storedEvent);
            loadEventSummary(event);
        } else {
            window.location.href = 'index.html';
        }
    }
    
    // Initialize quantity change handler
    const quantityInput = document.getElementById('bookingQuantity');
    if (quantityInput) {
        quantityInput.addEventListener('input', calculateTotal);
    }
}

// Load event summary
function loadEventSummary(event) {
    const eventSummary = document.getElementById('eventSummary');
    if (eventSummary) {
        eventSummary.innerHTML = `
            <h3>${event.name}</h3>
            <p><strong>Date:</strong> ${formatDate(event.date)}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Category:</strong> ${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</p>
            <p class="summary-price">${formatCurrency(event.price)} per ticket</p>
        `;
    }
    
    // Update price display
    const ticketPriceEl = document.getElementById('ticketPrice');
    if (ticketPriceEl) {
        ticketPriceEl.textContent = formatCurrency(event.price);
    }
    
    calculateTotal();
}

// Calculate total price
function calculateTotal() {
    const eventStr = sessionStorage.getItem('selectedEvent');
    if (!eventStr) return;
    
    const event = JSON.parse(eventStr);
    const quantityInput = document.getElementById('bookingQuantity');
    const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
    
    const total = event.price * quantity;
    
    const totalAmountEl = document.getElementById('totalAmount');
    const ticketQuantityEl = document.getElementById('ticketQuantity');
    
    if (totalAmountEl) {
        totalAmountEl.textContent = formatCurrency(total);
    }
    
    if (ticketQuantityEl) {
        ticketQuantityEl.textContent = quantity;
    }
}

// Process booking
function processBooking(event) {
    event.preventDefault();
    
    const form = event.target;
    
    // Get form values
    const fullname = document.getElementById('bookingFullname').value.trim();
    const email = document.getElementById('bookingEmail').value.trim();
    const phone = document.getElementById('bookingPhone').value.trim();
    const quantity = parseInt(document.getElementById('bookingQuantity').value);
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCVV = document.getElementById('cardCVV').value;
    const cardName = document.getElementById('cardName').value.trim();
    
    // Validate all fields
    let isValid = true;
    
    if (!validateName(document.getElementById('bookingFullname'))) isValid = false;
    if (!validateEmail(document.getElementById('bookingEmail'))) isValid = false;
    if (!validatePhone(document.getElementById('bookingPhone'))) isValid = false;
    if (!validateQuantity(document.getElementById('bookingQuantity'))) isValid = false;
    if (!validateCardNumber(document.getElementById('cardNumber'))) isValid = false;
    if (!validateExpiry(document.getElementById('cardExpiry'))) isValid = false;
    if (!validateCVV(document.getElementById('cardCVV'))) isValid = false;
    if (!validateName(document.getElementById('cardName'))) isValid = false;
    
    if (!isValid) {
        showBookingMessage('Please fix the errors in the form.', 'error');
        return;
    }
    
    // Get event
    const eventStr = sessionStorage.getItem('selectedEvent');
    if (!eventStr) {
        showBookingMessage('Event not found. Please select an event.', 'error');
        return;
    }
    
    const selectedEvent = JSON.parse(eventStr);
    
    // Check availability
    const available = selectedEvent.capacity - selectedEvent.sold;
    if (quantity > available) {
        showBookingMessage(`Only ${available} tickets available.`, 'error');
        return;
    }
    
    // Simulate payment processing
    const bookingBtn = document.getElementById('bookBtn');
    if (bookingBtn) {
        bookingBtn.disabled = true;
        bookingBtn.textContent = 'Processing...';
    }
    
    // Simulate API call delay
    setTimeout(() => {
        // Create booking
        const booking = {
            id: Date.now(),
            eventId: selectedEvent.id,
            eventName: selectedEvent.name,
            fullname,
            email,
            phone,
            quantity,
            totalPrice: selectedEvent.price * quantity,
            bookingDate: new Date().toISOString(),
            status: 'confirmed'
        };
        
        // Save booking to localStorage
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        // Update event sold count
        const events = window.eventsData || JSON.parse(localStorage.getItem('eventsData') || '[]');
        const eventIndex = events.findIndex(e => e.id === selectedEvent.id);
        if (eventIndex !== -1) {
            events[eventIndex].sold += quantity;
            window.eventsData = events;
            localStorage.setItem('eventsData', JSON.stringify(events));
        }
        
        // Show success modal
        showSuccessModal(booking, selectedEvent);
        
        if (bookingBtn) {
            bookingBtn.disabled = false;
            bookingBtn.textContent = 'Complete Booking';
        }
    }, 1500);
}

// Show booking message
function showBookingMessage(message, type) {
    const messageEl = document.getElementById('bookingMessage');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `form-message ${type}`;
        
        // Scroll to message
        messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Show success modal
function showSuccessModal(booking, event) {
    const modal = document.getElementById('successModal');
    const successMessage = document.getElementById('successMessage');
    const ticketDetails = document.getElementById('ticketDetails');
    
    if (modal && successMessage && ticketDetails) {
        successMessage.textContent = `Your booking for ${booking.quantity} ticket(s) has been confirmed!`;
        
        ticketDetails.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <strong>Booking ID:</strong> #${booking.id}
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>Event:</strong> ${event.name}
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>Date:</strong> ${formatDate(event.date)} at ${event.time}
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>Location:</strong> ${event.location}
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>Tickets:</strong> ${booking.quantity}
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>Total Paid:</strong> ${formatCurrency(booking.totalPrice)}
            </div>
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
                <small style="color: #6b7280;">
                    A confirmation email has been sent to ${booking.email}
                </small>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close success modal
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Export functions
window.calculateTotal = calculateTotal;
window.processBooking = processBooking;
window.closeSuccessModal = closeSuccessModal;

