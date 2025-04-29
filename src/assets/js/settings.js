document.addEventListener('DOMContentLoaded', function() {
    // Theme selection functionality
    const darkThemeOption = document.getElementById('dark-theme');
    const lightThemeOption = document.getElementById('light-theme');
    const autoDarkModeToggle = document.getElementById('auto-dark-mode');
    
    // Fix the theme options if they exist
    if (darkThemeOption && lightThemeOption) {
        // Set up event listeners for theme options
        darkThemeOption.addEventListener('click', function() {
            selectTheme('dark');
        });
        
        lightThemeOption.addEventListener('click', function() {
            selectTheme('light');
        });
    }
    
    // Set up automatic dark mode based on system preference
    if (autoDarkModeToggle) {
        autoDarkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                // Enable automatic theme switching
                localStorage.setItem('autoThemeMode', 'true');
                // Check current system preference and apply theme
                checkSystemThemePreference();
            } else {
                // Disable automatic theme switching
                localStorage.setItem('autoThemeMode', 'false');
                // Apply user's manual preference instead
                const savedTheme = localStorage.getItem('preferredTheme') || 'dark';
                applyTheme(savedTheme);
                updateActiveThemeButton(savedTheme);
            }
        });
        
        // Initialize auto dark mode toggle from localStorage
        const autoMode = localStorage.getItem('autoThemeMode') === 'true';
        autoDarkModeToggle.checked = autoMode;
        
        // If auto mode is enabled, apply system preference
        if (autoMode) {
            checkSystemThemePreference();
        }
    }
    
    // Load saved theme preference if auto mode is not enabled
    if (localStorage.getItem('autoThemeMode') !== 'true') {
        const savedTheme = localStorage.getItem('preferredTheme') || 'dark';
        applyTheme(savedTheme);
        updateActiveThemeButton(savedTheme);
    }
});

// Helper Functions
function selectTheme(themeName) {
    // Get the auto dark mode toggle
    const autoDarkModeToggle = document.getElementById('auto-dark-mode');
    
    // Disable auto dark mode when manually selecting a theme
    if (autoDarkModeToggle) {
        autoDarkModeToggle.checked = false;
        localStorage.setItem('autoThemeMode', 'false');
    }
    
    // Apply theme
    applyTheme(themeName);
    
    // Update the active button
    updateActiveThemeButton(themeName);
    
    // Save preference to localStorage
    localStorage.setItem('preferredTheme', themeName);
}

function applyTheme(themeName) {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('theme-dark', 'theme-light');
    
    // Add selected theme class
    body.classList.add(`theme-${themeName}`);
    
    // Update the appearance based on theme
    switch(themeName) {
        case 'light':
            document.documentElement.style.setProperty('--main-bg-color', '#f5f7fa');
            document.documentElement.style.setProperty('--text-color', '#333');
            document.documentElement.style.setProperty('--card-bg', '#fff');
            break;
        case 'dark':
        default:
            document.documentElement.style.setProperty('--main-bg-color', '#1e2845');
            document.documentElement.style.setProperty('--text-color', '#fff');
            document.documentElement.style.setProperty('--card-bg', '#2c3e50');
            break;
    }
    
    console.log(`Theme switched to: ${themeName}`);
}

function updateActiveThemeButton(themeName) {
    // Update the active class on theme buttons
    const darkThemeOption = document.getElementById('dark-theme');
    const lightThemeOption = document.getElementById('light-theme');
    
    if (darkThemeOption && lightThemeOption) {
        darkThemeOption.classList.remove('active');
        lightThemeOption.classList.remove('active');
        
        if (themeName === 'dark') {
            darkThemeOption.classList.add('active');
        } else if (themeName === 'light') {
            lightThemeOption.classList.add('active');
        }
    }
}

function checkSystemThemePreference() {
    // Check if the user's system is set to dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark');
        updateActiveThemeButton('dark');
    } else {
        applyTheme('light');
        updateActiveThemeButton('light');
    }
    
    // Listen for changes in system theme preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (localStorage.getItem('autoThemeMode') === 'true') {
            const newTheme = event.matches ? 'dark' : 'light';
            applyTheme(newTheme);
            updateActiveThemeButton(newTheme);
        }
    });
}
