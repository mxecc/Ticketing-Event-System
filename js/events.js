// ============================================
// Event Management JavaScript
// ============================================

// Sample events data (in production, this would come from an API)
let eventsData = [
    {
        id: 1,
        name: "Riyadh Season Festival",
        category: "cultural",
        date: "2025-12-25",
        time: "18:00",
        location: "Riyadh, Saudi Arabia",
        price: 50.00,
        capacity: 500,
        sold: 320,
        description: "Experience the vibrant culture of Riyadh with music, art, and traditional performances.",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800"
    },
    {
        id: 2,
        name: "International Food Festival",
        category: "food",
        date: "2025-12-20",
        time: "12:00",
        location: "Jeddah, Saudi Arabia",
        price: 35.00,
        capacity: 300,
        sold: 180,
        description: "Taste cuisines from around the world with live cooking demonstrations and food competitions.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
    },
    {
        id: 3,
        name: "Nature Walk & Photography",
        category: "nature",
        date: "2025-12-22",
        time: "07:00",
        location: "Al-Ahsa Oasis",
        price: 25.00,
        capacity: 50,
        sold: 30,
        description: "Explore the beautiful natural landscapes and learn photography techniques from professionals.",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800"
    },
    {
        id: 4,
        name: "Desert Adventure Race",
        category: "adventure",
        date: "2025-12-28",
        time: "06:00",
        location: "Empty Quarter Desert",
        price: 75.00,
        capacity: 100,
        sold: 65,
        description: "Challenge yourself in this exciting desert race with dune bashing and camping.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
    },
    {
        id: 5,
        name: "Classical Music Concert",
        category: "cultural",
        date: "2025-12-23",
        time: "19:30",
        location: "King Fahd Cultural Center",
        price: 60.00,
        capacity: 400,
        sold: 250,
        description: "Enjoy an evening of classical music performed by world-renowned musicians.",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800"
    },
    {
        id: 6,
        name: "Street Food Market",
        category: "food",
        date: "2025-12-21",
        time: "16:00",
        location: "Dammam Corniche",
        price: 20.00,
        capacity: 200,
        sold: 120,
        description: "Discover local street food vendors and enjoy live entertainment.",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800"
    }
];

// Load events from localStorage if available
function loadEventsFromStorage() {
    const stored = localStorage.getItem('eventsData');
    if (stored) {
        eventsData = JSON.parse(stored);
    }
}

// Save events to localStorage
function saveEventsToStorage() {
    localStorage.setItem('eventsData', JSON.stringify(eventsData));
}

// Initialize events on page load
document.addEventListener('DOMContentLoaded', function() {
    loadEventsFromStorage();
    displayEvents(eventsData);
    
    // Load event for booking page if eventId is in URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');
    if (eventId && document.getElementById('eventSummary')) {
        loadEventForBooking(parseInt(eventId));
    }
});

// Display events in grid
function displayEvents(events) {
    const eventsGrid = document.getElementById('eventsGrid');
    const noEventsMessage = document.getElementById('noEventsMessage');
    
    if (!eventsGrid) return;
    
    if (events.length === 0) {
        eventsGrid.innerHTML = '';
        if (noEventsMessage) {
            noEventsMessage.style.display = 'block';
        }
        return;
    }
    
    if (noEventsMessage) {
        noEventsMessage.style.display = 'none';
    }
    
    eventsGrid.innerHTML = events.map(event => `
        <div class="event-card" onclick="viewEventDetails(${event.id})">
            <img src="${event.image}" alt="${event.name}" class="event-image" onerror="this.style.background='linear-gradient(135deg, #6366f1, #818cf8)'">
            <div class="event-content">
                <span class="event-category ${event.category}">${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</span>
                <h3 class="event-title">${event.name}</h3>
                <p class="event-date">📅 ${formatDate(event.date)} at ${event.time}</p>
                <p class="event-location">📍 ${event.location}</p>
                <p class="event-price">${formatCurrency(event.price)}</p>
                <div class="event-actions">
                    <a href="#" class="btn-view" onclick="event.stopPropagation(); viewEventDetails(${event.id})">View Details</a>
                    <a href="booking.html?eventId=${event.id}" class="btn-book" onclick="event.stopPropagation()">Book Now</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter events by category
function filterEvents(category) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    // Filter events
    let filtered = eventsData;
    if (category !== 'all') {
        filtered = eventsData.filter(event => event.category === category);
    }
    
    displayEvents(filtered);
}

// Search events
function searchEvents() {
    const searchInput = document.getElementById('eventSearch');
    if (!searchInput) return;
    
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        displayEvents(eventsData);
        return;
    }
    
    const filtered = eventsData.filter(event => 
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
    );
    
    displayEvents(filtered);
}

// Allow Enter key to search
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('eventSearch');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchEvents();
            }
        });
    }
});

// View event details in modal
function viewEventDetails(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;
    
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;
    
    const available = event.capacity - event.sold;
    
    modalBody.innerHTML = `
        <div class="event-details-modal">
            <img src="${event.image}" alt="${event.name}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem;" onerror="this.style.background='linear-gradient(135deg, #6366f1, #818cf8)'">
            <span class="event-category ${event.category}">${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</span>
            <h2 style="margin: 1rem 0; color: var(--dark-color);">${event.name}</h2>
            <p style="color: var(--gray-color); margin-bottom: 1rem;">${event.description}</p>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0;">
                <div>
                    <strong>📅 Date:</strong>
                    <p>${formatDate(event.date)}</p>
                </div>
                <div>
                    <strong>🕐 Time:</strong>
                    <p>${event.time}</p>
                </div>
                <div>
                    <strong>📍 Location:</strong>
                    <p>${event.location}</p>
                </div>
                <div>
                    <strong>💰 Price:</strong>
                    <p style="color: var(--primary-color); font-weight: 700; font-size: 1.25rem;">${formatCurrency(event.price)}</p>
                </div>
            </div>
            <div style="background: var(--light-color); padding: 1rem; border-radius: 8px; margin: 1.5rem 0;">
                <p><strong>Tickets Available:</strong> ${available} / ${event.capacity}</p>
            </div>
            <a href="booking.html?eventId=${event.id}" class="btn btn-primary btn-block" style="margin-top: 1.5rem; text-align: center;">Book Tickets</a>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Load event for booking page
function loadEventForBooking(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) {
        window.location.href = 'index.html';
        return;
    }
    
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
    
    // Store event in sessionStorage for booking
    sessionStorage.setItem('selectedEvent', JSON.stringify(event));
    
    // Update price display
    const ticketPriceEl = document.getElementById('ticketPrice');
    if (ticketPriceEl) {
        ticketPriceEl.textContent = formatCurrency(event.price);
    }
    
    calculateTotal();
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Export functions for use in other files
window.eventsData = eventsData;
window.displayEvents = displayEvents;
window.filterEvents = filterEvents;
window.searchEvents = searchEvents;
window.viewEventDetails = viewEventDetails;
window.loadEventForBooking = loadEventForBooking;

