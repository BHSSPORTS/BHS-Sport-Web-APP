/**
 * Navbar Loader - Simple and Reliable Navigation System
 * Handles loading and basic interactive functionality
 */
class NavbarLoader {
    constructor(containerId = 'navbar-container') {
        this.containerId = containerId;
        this.navbarLoaded = false;
        this.init();
    }

    /**
     * Initialize the navbar loader
     */
    init() {
        // Load navbar first, then check authentication through GoogleAuth
        this.loadNavbar();
    }

    /**
     * Load the navbar HTML into the specified container
     */
    async loadNavbar() {
        try {
            console.log('Loading navbar from navbar.html...');
            
            const response = await fetch('navbar.html');
            
            if (!response.ok) {
                throw new Error(`Failed to load navbar: ${response.status} ${response.statusText}`);
            }
            
            const navbarHtml = await response.text();
            console.log('Navbar HTML loaded successfully, length:', navbarHtml.length);
            
            const container = document.getElementById(this.containerId);
            if (!container) {
                throw new Error(`Container with ID '${this.containerId}' not found`);
            }
            
            container.innerHTML = navbarHtml;
            this.navbarLoaded = true;
            console.log('Navbar HTML inserted into container');
            
            // Initialize dropdowns after navbar is loaded
            this.initializeDropdowns();
            this.initializeMobileMenu();
            this.displayUsername();
            
            // Initialize Google Authentication
            this.initializeGoogleAuth();
            
        } catch (error) {
            console.error('Error loading navbar:', error);
        }
    }

    /**
     * Initialize mobile menu toggle
     */
    initializeMobileMenu() {
        const menu = document.getElementById('navbarBasic');
        const toggle = document.querySelector('.mobile-toggle');
        
        if (!menu || !toggle) {
            console.warn('Mobile menu elements not found:', { menu: !!menu, toggle: !!toggle });
            return;
        }
        
        console.log('Mobile menu elements found, setting up toggle');
        
        // Add click listener directly to the toggle button
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Mobile toggle clicked');
            
            menu.classList.toggle('is-active');
            toggle.classList.toggle('is-active');
            
            // Update button text
            if (menu.classList.contains('is-active')) {
                toggle.textContent = '✕ Close';
                document.body.classList.add('mobile-menu-open');
                console.log('Mobile menu opened');
            } else {
                toggle.textContent = '☰ Menu';
                document.body.classList.remove('mobile-menu-open');
                console.log('Mobile menu closed');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                if (menu.classList.contains('is-active')) {
                    toggle.classList.remove('is-active');
                    menu.classList.remove('is-active');
                    document.body.classList.remove('mobile-menu-open');
                    console.log('Mobile menu closed (click outside)');
                }
            }
        });
        
        console.log('Mobile menu initialized successfully');
    }

    /**
     * Initialize dropdown functionality - SIMPLE AND RELIABLE
     */
    initializeDropdowns() {
        console.log('Initializing dropdowns...');
        
        // Wait a bit for DOM to be ready
        setTimeout(() => {
            this.setupDropdowns();
        }, 100);
    }

    /**
     * Setup dropdowns with simple, reliable event handling
     */
    setupDropdowns() {
        const dropdowns = document.querySelectorAll('.navbar-item.has-dropdown');
        console.log('Found dropdowns:', dropdowns.length);
        
        dropdowns.forEach((dropdown, index) => {
            const link = dropdown.querySelector('.navbar-link');
            const dropdownMenu = dropdown.querySelector('.navbar-dropdown');
            
            if (!link || !dropdownMenu) {
                console.warn(`Dropdown ${index} missing elements`);
                return;
            }
            
            console.log(`Setting up dropdown ${index}: ${link.textContent.trim()}`);
            
            // Remove any existing listeners to prevent duplicates
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            
            // Add click listener to the new link
            newLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log(`Dropdown ${index} clicked: ${newLink.textContent.trim()}`);
                
                // Close all other dropdowns first
                dropdowns.forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('is-active');
                        const menu = d.querySelector('.navbar-dropdown');
                        if (menu) menu.style.display = 'none';
                    }
                });
                
                // Toggle this dropdown
                const isActive = dropdown.classList.contains('is-active');
                
                if (!isActive) {
                    dropdown.classList.add('is-active');
                    dropdownMenu.style.display = 'block';
                    console.log(`Dropdown ${index} opened`);
                } else {
                    dropdown.classList.remove('is-active');
                    dropdownMenu.style.display = 'none';
                    console.log(`Dropdown ${index} closed`);
                }
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar-item.has-dropdown')) {
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('is-active');
                    const dropdownMenu = dropdown.querySelector('.navbar-dropdown');
                    if (dropdownMenu) dropdownMenu.style.display = 'none';
                });
            }
        });
        
        console.log('Dropdown setup complete');
    }

    /**
     * Initialize Google Authentication
     */
    async initializeGoogleAuth() {
        // Check if GoogleAuth is available
        if (typeof GoogleAuth === 'undefined') {
            console.warn('GoogleAuth not available, skipping authentication setup');
            return;
        }

        try {
            // Create Google Auth instance
            this.googleAuth = new GoogleAuth();
            
            // Set up callbacks
            this.googleAuth.onSignIn((user) => {
                this.updateAuthUI(user);
                console.log('User signed in:', user.name);
            });
            
            this.googleAuth.onSignOut(() => {
                this.updateAuthUI(null);
                console.log('User signed out');
                
                // Clear all authentication data
                localStorage.removeItem('bhsGoogleAuth');
                localStorage.removeItem('bhsAccessData');
                
                // Redirect to passcode screen
                window.location.href = 'passcode.html';
            });
            
            // Initialize with Client ID from config
            if (typeof BHS_CONFIG !== 'undefined' && BHS_CONFIG.GOOGLE_CLIENT_ID && BHS_CONFIG.GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE') {
                await this.googleAuth.initialize(BHS_CONFIG.GOOGLE_CLIENT_ID);
            } else {
                console.warn('Google Client ID not configured. Please update config.js with your Client ID.');
                return;
            }
            
            // Check for existing session
            if (this.googleAuth.checkExistingSession()) {
                const user = this.googleAuth.getCurrentUser();
                console.log('Existing session found for user:', user.name);
                this.updateAuthUI(user);
            } else {
                // No valid session, redirect to passcode page
                console.log('No valid session found, redirecting to passcode page');
                window.location.href = 'passcode.html';
                return;
            }
            
        } catch (error) {
            console.error('Failed to initialize Google Auth:', error);
        }
    }

    /**
     * Update authentication UI
     */
    updateAuthUI(user) {
        console.log('updateAuthUI called with user:', user);
        
        const signInContainer = document.getElementById('googleSignInContainer');
        const userInfoContainer = document.getElementById('userInfoContainer');
        const signOutBtn = document.getElementById('signOutBtn');
        const currentUsername = document.getElementById('currentUsername');
        
        console.log('Found elements:', {
            signInContainer: !!signInContainer,
            userInfoContainer: !!userInfoContainer,
            signOutBtn: !!signOutBtn,
            currentUsername: !!currentUsername
        });
        
        if (user) {
            // User is signed in
            if (signInContainer) signInContainer.style.display = 'none';
            if (userInfoContainer) userInfoContainer.style.display = 'block';
            if (signOutBtn) signOutBtn.style.display = 'inline-block';
            
            // Update the username box with the user's name
            if (currentUsername) {
                currentUsername.textContent = user.name;
                console.log('Updated username to:', user.name);
            }
            
        } else {
            // User is not signed in
            if (signInContainer) signInContainer.style.display = 'block';
            if (userInfoContainer) userInfoContainer.style.display = 'none';
            if (signOutBtn) signOutBtn.style.display = 'none';
        }
    }

    /**
     * Display current username (keeping for backward compatibility)
     */
    displayUsername() {
        // This function is now handled by Google Auth
        // Keeping it for backward compatibility
        console.log('displayUsername called - now handled by Google Auth');
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing navbar...');
    window.navbarLoader = new NavbarLoader();
});

// Also try to initialize when window loads
window.addEventListener('load', () => {
    if (!window.navbarLoader) {
        console.log('Window loaded, initializing navbar...');
        window.navbarLoader = new NavbarLoader();
    }
});

// Mobile menu toggle function
window.toggleMobileMenu = function() {
    console.log('Global toggleMobileMenu called');
    
    const menu = document.getElementById('navbarBasic');
    const toggle = document.querySelector('.mobile-toggle');
    
    if (menu && toggle) {
        console.log('Toggling mobile menu via global function');
        
        menu.classList.toggle('is-active');
        toggle.classList.toggle('is-active');
        
        if (menu.classList.contains('is-active')) {
            toggle.textContent = '✕ Close';
            document.body.classList.add('mobile-menu-open');
            console.log('Mobile menu opened via global function');
        } else {
            toggle.textContent = '☰ Menu';
            document.body.classList.remove('mobile-menu-open');
            console.log('Mobile menu closed via global function');
        }
    } else {
        console.warn('Mobile menu elements not found for global function');
    }
};

// Sign out function for Google Authentication
window.signOut = function() {
    if (window.navbarLoader && window.navbarLoader.googleAuth) {
        window.navbarLoader.googleAuth.signOut();
    }
    
    // Clear all authentication data
    localStorage.removeItem('bhsGoogleAuth');
    localStorage.removeItem('bhsAccessData');
    
    // Redirect to passcode screen
    window.location.href = 'passcode.html';
};

// Logout function (keeping for backward compatibility)
window.logout = function() {
    localStorage.removeItem('bhsAccessData');
    window.location.href = 'passcode.html';
};
