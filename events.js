// ============================================
// Event Management JavaScript
// ============================================

// Real Saudi Events Data
let eventsData = [
    {
        id: 1,
        name: "Boulevard World",
        nameAr: "بوليفارد وورلد",
        category: "cultural",
        date: "2025-12-15",
        time: "18:00",
        location: "Hittin, Riyadh, Saudi Arabia",
        locationAr: "حطين، الرياض، المملكة العربية السعودية",
        price: 150.00,
        capacity: 10000,
        sold: 7500,
        description: "A premier entertainment zone showcasing global cultures, the world's largest man-made lake, and diverse international pavilions.",
        image: "images/boulevard.jpg.jpg",
        mapLocation: { lat: 24.776, lng: 46.628, city: "Riyadh" },
        googleMapsUrl: "https://maps.app.goo.gl/9T8fD3gGndPq6A6P7"
    },
    {
        id: 2,
        name: "Jeddah F1 Grand Prix",
        nameAr: "جائزة جدة الكبرى للفورمولا 1",
        category: "adventure",
        date: "2025-12-07",
        time: "20:00",
        location: "Jeddah Corniche Circuit, Jeddah, Saudi Arabia",
        locationAr: "حلبة كورنيش جدة، جدة، المملكة العربية السعودية",
        price: 450.00,
        capacity: 5000,
        sold: 4200,
        description: "Experience the adrenaline at the world's fastest and longest street circuit, located on the beautiful Jeddah Corniche.",
        image: "images/f1.jpg.png",
        mapLocation: { lat: 21.5433, lng: 39.1728, city: "Jeddah" },
        googleMapsUrl: "https://maps.app.goo.gl/o1H7K8v2z2H3Xn8R6"
    },
    {
        id: 3,
        name: "AlUla Moments - Maraya",
        nameAr: "لحظات العلا - مرايا",
        category: "cultural",
        date: "2025-12-20",
        time: "19:00",
        location: "AlUla, Medina Province, Saudi Arabia",
        locationAr: "العلا، منطقة المدينة المنورة، المملكة العربية السعودية",
        price: 200.00,
        capacity: 2000,
        sold: 1800,
        description: "Discover Maraya, the world's largest mirrored building, nestled in the stunning desert canyon of Ashar Valley.",
        image: "images/alula.jpg.png",
        mapLocation: { lat: 26.6144, lng: 37.9236, city: "AlUla" },
        googleMapsUrl: "https://maps.app.goo.gl/v6Y7M5J2H9L6K4P7"
    },
    {
        id: 4,
        name: "Six Flags Qiddiya",
        nameAr: "سيكس فلاج القدية",
        category: "adventure",
        date: "2025-12-19",
        time: "10:00",
        location: "Qiddiya, Riyadh, Saudi Arabia",
        locationAr: "القدية، الرياض، المملكة العربية السعودية",
        price: 350.00,
        capacity: 20000,
        sold: 15000,
        description: "The future capital of thrills, featuring 'Falcon's Flight', the world's tallest, fastest, and longest rollercoaster.",
        image: "images/qiddiya.jpg.png",
        mapLocation: { lat: 24.7136, lng: 46.6753, city: "Riyadh" },
        googleMapsUrl: "https://maps.app.goo.gl/uX6ZEnXp4EsqiHoz8"
    },
    {
        id: 5,
        name: "Saudi Cup 2025",
        nameAr: "كأس السعودية 2025",
        category: "adventure",
        date: "2025-12-25",
        time: "15:00",
        location: "King Abdulaziz Racetrack, Riyadh, Saudi Arabia",
        locationAr: "مضمار الملك عبدالعزيز، الرياض، المملكة العربية السعودية",
        price: 180.00,
        capacity: 8000,
        sold: 6500,
        description: "The world's richest horse race! Watch elite thoroughbreds compete for the $20 million prize. Experience the excitement of world-class horse racing with VIP access, fine dining, and entertainment. A prestigious event in the heart of Riyadh.",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80",
        mapLocation: { lat: 24.7136, lng: 46.6753, city: "Riyadh" },
        googleMapsUrl: "https://www.google.com/maps?q=24.7136,46.6753"
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
            <img src="${event.image}" alt="${event.name}" class="event-image" loading="lazy" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=Check+Extension';">
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
                    <a href="${event.googleMapsUrl || '#'}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" class="location-link">
                        📍 View Location on Google Maps
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
            <img src="${event.image}" alt="${event.name}" style="width: 100%; height: 300px; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); margin-bottom: 1.5rem;" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=Check+Extension';">
            <span class="event-category ${event.category}">${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</span>
            <h2 style="margin: 1rem 0; color: var(--text-primary);">${event.name}</h2>
            ${event.nameAr ? `<p style="color: var(--text-secondary); margin-bottom: 0.5rem; font-family: 'Cairo', sans-serif; direction: rtl;">${event.nameAr}</p>` : ''}
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">${event.description}</p>
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
                    ${event.locationAr ? `<p style="font-family: 'Cairo', sans-serif; direction: rtl; font-size: 0.875rem; color: var(--text-secondary);">${event.locationAr}</p>` : ''}
                </div>
                <div>
                    <strong>💰 Price:</strong>
                    <p style="background: linear-gradient(135deg, var(--vibrant-purple), var(--emerald-green)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 700; font-size: 1.25rem;">${formatCurrency(event.price)}</p>
                </div>
            </div>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px; margin: 1.5rem 0; border: 1px solid var(--border-color);">
                <p><strong>Tickets Available:</strong> ${available} / ${event.capacity}</p>
            </div>
            ${event.googleMapsUrl ? `
            <a href="${event.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-block" style="margin-top: 1rem; text-align: center;">
                📍 View on Google Maps
            </a>
            ` : ''}
            <a href="booking.html?eventId=${event.id}" class="btn btn-primary btn-block" style="margin-top: 1rem; text-align: center;">Book Tickets</a>
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

// Show event on map
function showEventOnMap(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event || !event.mapLocation) return;
    
    const { lat, lng } = event.mapLocation;
    const mapIframe = document.getElementById('eventMap');
    
    if (mapIframe) {
        // Update Google Maps embed with event location
        const encodedLocation = encodeURIComponent(event.location);
        const newMapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.5!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzQ5LjAiTiA0NsKwNDAnMzEuMSJF!5e0!3m2!1sen!2ssa!4v1700000000000!5m2!1sen!2sus&q=${encodedLocation}`;
        mapIframe.src = newMapUrl;
        
        // Scroll to map section
        document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' });
        
        // Highlight event in legend
        highlightEventInLegend(eventId);
    }
}

// Center map on Riyadh
function centerMapOnRiyadh() {
    const mapIframe = document.getElementById('eventMap');
    if (mapIframe) {
        mapIframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.5!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba76d1c73e1d982c!2sRiyadh%2C%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus&q=24.7136,46.6753';
        document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' });
    }
}

// Show all events on map
function showAllEvents() {
    const mapIframe = document.getElementById('eventMap');
    if (mapIframe) {
        mapIframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.5!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba76d1c73e1d982c!2sRiyadh%2C%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus&z=7';
        document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' });
    }
}

// Highlight event in legend
function highlightEventInLegend(eventId) {
    const legendItems = document.querySelectorAll('.event-location-item');
    legendItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.eventId == eventId) {
            item.classList.add('active');
        }
    });
}

// Populate event locations list
function populateEventLocations() {
    const locationsList = document.getElementById('eventLocationsList');
    if (!locationsList) return;
    
    locationsList.innerHTML = eventsData.map(event => `
        <div class="event-location-item" data-event-id="${event.id}" onclick="showEventOnMap(${event.id})">
            <strong>${event.name}</strong>
            <span>📍 ${event.location}</span>
        </div>
    `).join('');
}

// Initialize map on page load
document.addEventListener('DOMContentLoaded', function() {
    populateEventLocations();
});

// Export functions for use in other files
window.eventsData = eventsData;
window.displayEvents = displayEvents;
window.filterEvents = filterEvents;
window.searchEvents = searchEvents;
window.viewEventDetails = viewEventDetails;
window.loadEventForBooking = loadEventForBooking;
window.showEventOnMap = showEventOnMap;
window.centerMapOnRiyadh = centerMapOnRiyadh;
window.showAllEvents = showAllEvents;

