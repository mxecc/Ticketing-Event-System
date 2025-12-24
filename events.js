// ============================================
// Event Management JavaScript
// ============================================

// Real Saudi Events Data
let eventsData = [
    {
        id: 1,
        name: "Riyadh Season 2025 - Boulevard World",
        category: "cultural",
        date: "2025-12-15",
        time: "18:00",
        location: "Boulevard World, Riyadh, Saudi Arabia",
        price: 150.00,
        capacity: 10000,
        sold: 7500,
        description: "Experience the world's most exciting entertainment destination at Boulevard World. Featuring international shows, cultural experiences, and world-class performances. This year's season promises unforgettable moments with attractions from around the globe.",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
        mapLocation: { lat: 24.7136, lng: 46.6753, city: "Riyadh" }
    },
    {
        id: 2,
        name: "Formula 1 Saudi Arabian Grand Prix",
        category: "adventure",
        date: "2025-12-07",
        time: "20:00",
        location: "Jeddah Corniche Circuit, Jeddah, Saudi Arabia",
        price: 450.00,
        capacity: 5000,
        sold: 4200,
        description: "Witness the fastest cars in the world race through the stunning Jeddah Corniche Circuit. Experience the thrill of Formula 1 racing under the lights with world-class drivers competing for the championship. Includes access to paddock area and entertainment zones.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        mapLocation: { lat: 21.5433, lng: 39.1728, city: "Jeddah" }
    },
    {
        id: 3,
        name: "AlUla Moments - Winter at Tantora",
        category: "cultural",
        date: "2025-12-20",
        time: "19:00",
        location: "AlUla, Saudi Arabia",
        price: 200.00,
        capacity: 2000,
        sold: 1800,
        description: "Immerse yourself in the magical Winter at Tantora festival in the ancient city of AlUla. Enjoy classical music concerts, art installations, and cultural experiences in one of the world's most stunning heritage sites. A celebration of music, art, and history.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        mapLocation: { lat: 26.6144, lng: 37.9236, city: "AlUla" }
    },
    {
        id: 4,
        name: "Six Flags Qiddiya",
        category: "adventure",
        date: "2025-12-19",
        time: "10:00",
        location: "Qiddiya, Riyadh, Saudi Arabia",
        price: 350.00,
        capacity: 20000,
        sold: 15000,
        description: "Experience the world's most thrilling theme park! Home to Falcon's Flight - the world's tallest and fastest rollercoaster. Six Flags Qiddiya features record-breaking rides, immersive themed areas, and world-class entertainment. A must-visit destination for thrill-seekers and families alike.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        mapLocation: { lat: 24.7136, lng: 46.6753, city: "Riyadh" }
    },
    {
        id: 5,
        name: "Saudi Cup 2025",
        category: "adventure",
        date: "2025-12-25",
        time: "15:00",
        location: "King Abdulaziz Racetrack, Riyadh, Saudi Arabia",
        price: 180.00,
        capacity: 8000,
        sold: 6500,
        description: "The world's richest horse race! Watch elite thoroughbreds compete for the $20 million prize. Experience the excitement of world-class horse racing with VIP access, fine dining, and entertainment. A prestigious event in the heart of Riyadh.",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
        mapLocation: { lat: 24.7136, lng: 46.6753, city: "Riyadh" }
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
                    <button class="btn-cart" onclick="event.stopPropagation(); addToCart(${event.id}, '${event.name.replace(/'/g, "\\'")}', ${event.price}, '${event.image}')">Add to Cart</button>
                    <a href="booking.html?eventId=${event.id}" class="btn-book" onclick="event.stopPropagation()">Book Now</a>
                </div>
                ${event.mapLocation ? `
                <div class="event-location-link">
                    <a href="#map" onclick="event.stopPropagation(); showEventOnMap(${event.id})" class="location-link">
                        📍 View on Map
                    </a>
                </div>
                ` : ''}
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

