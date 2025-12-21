# Ticketing Event System

A complete web-based ticketing system for events, built as a Software Engineering 2 final project.

## Features

### Core Functionality
- **Event Browsing**: Browse events by category (Cultural, Food, Nature, Adventure)
- **Event Search**: Search events by name, description, or location
- **Event Details**: View detailed information about each event
- **Ticket Booking**: Complete booking flow with payment simulation
- **Map View**: Interactive map showing event locations

### Security & Quality Features
- **User Authentication**: Login and registration system
- **Bcrypt Password Hashing**: Simulated bcrypt password encryption (as documented in Phase 2)
- **Rate Limiting**: 100 requests per minute limit (as documented in Phase 2)
- **Input Validation**: Comprehensive form validation for all inputs
- **Data Persistence**: LocalStorage for user data and events

### Organizer Dashboard
- **Event Management**: Create, edit, and delete events
- **Statistics**: View total events, tickets sold, revenue, and attendees
- **Event Table**: Manage all events in a comprehensive table view

## Project Structure

```
TicketingEventSystem/
├── index.html          # Home page with event browsing
├── login.html          # Login/Register page
├── dashboard.html      # Organizer dashboard
├── booking.html        # Ticket booking page
├── styles.css          # Main stylesheet
├── js/
│   ├── app.js          # Main application logic
│   ├── events.js       # Event management
│   ├── auth.js         # Authentication
│   ├── bcrypt.js       # Bcrypt simulation
│   ├── rateLimit.js    # Rate limiting
│   ├── validation.js   # Form validation
│   ├── dashboard.js    # Dashboard functionality
│   └── booking.js      # Booking functionality
└── README.md           # This file
```

## How to Use

### Getting Started
1. Open `index.html` in a web browser
2. Browse events by category or search for specific events
3. Click "View Details" to see more information
4. Click "Book Now" to purchase tickets

### User Registration/Login
1. Navigate to the Login page
2. Register a new account (passwords are hashed with simulated bcrypt)
3. Login with your credentials
4. Rate limiting is active (100 requests per minute)

### Organizer Dashboard
1. Navigate to the Dashboard page
2. View statistics and manage events
3. Create new events with all required details
4. Edit or delete existing events

### Booking Tickets
1. Select an event and click "Book Now"
2. Fill in your information
3. Enter payment details (simulated)
4. Complete the booking

## Technical Details

### Security Features
- **Bcrypt Hashing**: Passwords are hashed using a simulated bcrypt algorithm (as per Phase 2 documentation)
- **Rate Limiting**: Maximum 100 requests per minute per endpoint (login/register)
- **Input Validation**: All forms include comprehensive validation
- **Data Validation**: Card numbers use Luhn algorithm validation

### Testing
- All features have been tested and verified
- Forms include real-time validation
- Error messages guide users to fix issues
- Success messages confirm actions

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile devices
- No external dependencies required

## Project Phases Implementation

### Phase 1 (SE1)
- ✅ Event browsing by category
- ✅ Event details viewing
- ✅ Ticket booking system

### Phase 2 (SE2)
- ✅ Bcrypt password hashing simulation
- ✅ Rate limiting (100 req/min)
- ✅ Input validation
- ✅ Security measures

### Phase 3 (SE2)
- ✅ All features tested and working
- ✅ 100% test pass rate (as documented)

### Phase 4 (SE2)
- ✅ Complete system ready for presentation
- ✅ All documentation features implemented

## Notes

- This is a front-end only application using LocalStorage for data persistence
- Payment processing is simulated
- Bcrypt hashing is simulated (in production, use actual bcrypt library)
- Rate limiting uses LocalStorage for persistence
- All data is stored in browser LocalStorage

## Development

To modify or extend the system:
1. Edit HTML files for structure
2. Modify `styles.css` for design changes
3. Update JavaScript files in `js/` folder for functionality
4. Events data is stored in LocalStorage and can be managed through the dashboard

---

**Software Engineering 2 - Final Project**
*Built with HTML, CSS, and JavaScript*

