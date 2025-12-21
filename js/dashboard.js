// ============================================
// Dashboard Management JavaScript
// ============================================

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
});

// Load dashboard data
function loadDashboard() {
    loadEventsTable();
    updateStatistics();
}

// Load events into table
function loadEventsTable() {
    const tableBody = document.getElementById('eventsTableBody');
    if (!tableBody) return;
    
    // Get events from events.js or localStorage
    let events = window.eventsData;
    if (!events || events.length === 0) {
        const stored = localStorage.getItem('eventsData');
        events = stored ? JSON.parse(stored) : [];
        window.eventsData = events;
    }
    
    if (events.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No events found. Create your first event!</td></tr>';
        return;
    }
    
    tableBody.innerHTML = events.map(event => {
        const date = new Date(event.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const revenue = event.price * event.sold;
        const available = event.capacity - event.sold;
        
        return `
            <tr>
                <td><strong>${event.name}</strong></td>
                <td><span class="event-category ${event.category}">${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</span></td>
                <td>${formattedDate} at ${event.time}</td>
                <td>${event.location}</td>
                <td>${event.sold} / ${event.capacity} <small style="color: ${available > 0 ? '#10b981' : '#ef4444'}">(${available} available)</small></td>
                <td>${formatCurrency(event.price)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-edit" onclick="editEvent(${event.id})">Edit</button>
                        <button class="btn-delete" onclick="deleteEvent(${event.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Update statistics
function updateStatistics() {
    let events = window.eventsData;
    if (!events || events.length === 0) {
        const stored = localStorage.getItem('eventsData');
        events = stored ? JSON.parse(stored) : [];
        window.eventsData = events;
    }
    
    const totalEvents = events.length;
    const totalTickets = events.reduce((sum, event) => sum + event.sold, 0);
    const totalRevenue = events.reduce((sum, event) => sum + (event.price * event.sold), 0);
    const totalAttendees = new Set(events.flatMap(e => Array(e.sold).fill(0).map((_, i) => `user-${e.id}-${i}`))).size;
    
    document.getElementById('totalEvents').textContent = totalEvents;
    document.getElementById('totalTickets').textContent = totalTickets;
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('totalAttendees').textContent = totalAttendees;
}

// Open event modal for creating new event
function openEventModal() {
    const modal = document.getElementById('eventModal');
    const form = document.getElementById('eventForm');
    const modalTitle = document.getElementById('modalTitle');
    
    if (modal && form && modalTitle) {
        form.reset();
        document.getElementById('eventId').value = '';
        modalTitle.textContent = 'Create New Event';
        
        // Clear all errors
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close event modal
function closeEventModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Edit event
function editEvent(eventId) {
    let events = window.eventsData;
    if (!events) {
        const stored = localStorage.getItem('eventsData');
        events = stored ? JSON.parse(stored) : [];
    }
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
        alert('Event not found');
        return;
    }
    
    const modal = document.getElementById('eventModal');
    const form = document.getElementById('eventForm');
    const modalTitle = document.getElementById('modalTitle');
    
    if (modal && form && modalTitle) {
        // Populate form with event data
        document.getElementById('eventId').value = event.id;
        document.getElementById('eventName').value = event.name;
        document.getElementById('eventCategory').value = event.category;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventTime').value = event.time;
        document.getElementById('eventLocation').value = event.location;
        document.getElementById('eventPrice').value = event.price;
        document.getElementById('eventCapacity').value = event.capacity;
        document.getElementById('eventDescription').value = event.description;
        if (event.image) {
            document.getElementById('eventImage').value = event.image;
        }
        
        modalTitle.textContent = 'Edit Event';
        
        // Clear all errors
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Delete event
function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
        return;
    }
    
    let events = window.eventsData;
    if (!events) {
        const stored = localStorage.getItem('eventsData');
        events = stored ? JSON.parse(stored) : [];
    }
    const index = events.findIndex(e => e.id === eventId);
    
    if (index === -1) {
        alert('Event not found');
        return;
    }
    
    events.splice(index, 1);
    window.eventsData = events;
    
    // Save to localStorage
    localStorage.setItem('eventsData', JSON.stringify(events));
    
    // Reload dashboard
    loadDashboard();
    
    // Show notification
    if (window.showNotification) {
        showNotification('Event deleted successfully', 'success');
    }
}

// Save event (create or update)
function saveEvent(event) {
    event.preventDefault();
    
    const form = event.target;
    const eventId = document.getElementById('eventId').value;
    const name = document.getElementById('eventName').value.trim();
    const category = document.getElementById('eventCategory').value;
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const location = document.getElementById('eventLocation').value.trim();
    const price = parseFloat(document.getElementById('eventPrice').value);
    const capacity = parseInt(document.getElementById('eventCapacity').value);
    const description = document.getElementById('eventDescription').value.trim();
    const image = document.getElementById('eventImage').value.trim();
    
    // Validate all fields
    let isValid = true;
    if (!validateEventField(document.getElementById('eventName'))) isValid = false;
    if (!validateEventField(document.getElementById('eventCategory'))) isValid = false;
    if (!validateEventField(document.getElementById('eventDate'))) isValid = false;
    if (!validateEventField(document.getElementById('eventTime'))) isValid = false;
    if (!validateEventField(document.getElementById('eventLocation'))) isValid = false;
    if (!validateEventField(document.getElementById('eventPrice'))) isValid = false;
    if (!validateEventField(document.getElementById('eventCapacity'))) isValid = false;
    if (!validateEventField(document.getElementById('eventDescription'))) isValid = false;
    
    if (!isValid) {
        return;
    }
    
    // Get events from window or localStorage
    let events = window.eventsData;
    if (!events) {
        const stored = localStorage.getItem('eventsData');
        events = stored ? JSON.parse(stored) : [];
    }
    
    if (eventId) {
        // Update existing event
        const index = events.findIndex(e => e.id === parseInt(eventId));
        if (index !== -1) {
            events[index] = {
                ...events[index],
                name,
                category,
                date,
                time,
                location,
                price,
                capacity,
                description,
                image: image || events[index].image
            };
        }
    } else {
        // Create new event
        const newEvent = {
            id: Date.now(),
            name,
            category,
            date,
            time,
            location,
            price,
            capacity,
            sold: 0,
            description,
            image: image || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=800`
        };
        events.push(newEvent);
    }
    
    window.eventsData = events;
    
    // Save to localStorage
    localStorage.setItem('eventsData', JSON.stringify(events));
    
    // Reload dashboard
    loadDashboard();
    
    // Close modal
    closeEventModal();
    
    // Show notification
    if (window.showNotification) {
        showNotification(eventId ? 'Event updated successfully' : 'Event created successfully', 'success');
    }
    
    // Reload events on index page if it's open
    if (window.displayEvents) {
        window.displayEvents(events);
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Export functions
window.openEventModal = openEventModal;
window.closeEventModal = closeEventModal;
window.editEvent = editEvent;
window.deleteEvent = deleteEvent;
window.saveEvent = saveEvent;
window.loadDashboard = loadDashboard;

