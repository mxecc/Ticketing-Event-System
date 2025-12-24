// ============================================
// Theme Toggle Functionality
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
});

function initTheme() {
    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    // Add event listener to theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function setTheme(theme) {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    if (theme === 'light') {
        body.classList.add('light-mode');
        if (themeIcon) themeIcon.textContent = '☀️';
    } else {
        body.classList.remove('light-mode');
        if (themeIcon) themeIcon.textContent = '🌙';
    }
    
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Export for use in other files
window.toggleTheme = toggleTheme;
window.setTheme = setTheme;

