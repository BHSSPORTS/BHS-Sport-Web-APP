// Google OAuth Authentication Module for BHS Sports Hub
// This module handles Google Sign-In for organization users

class GoogleAuth {
  constructor() {
    this.isInitialized = false;
    this.isSignedIn = false;
    this.currentUser = null;
    this.authToken = null;
    this.clientId = null; // You'll set this from Google Cloud Console
  }

  // Initialize Google Sign-In
  async initialize(clientId) {
    if (this.isInitialized) {
      console.log('Google Auth already initialized');
      return;
    }

    this.clientId = clientId;
    
    try {
      // Load Google Sign-In API
      await this.loadGoogleSignInAPI();
      
      // Initialize Google Sign-In
      google.accounts.id.initialize({
        client_id: clientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
        context: 'signin'
      });

      // Render the sign-in button
      this.renderSignInButton();
      
      this.isInitialized = true;
      console.log('Google Auth initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize Google Auth:', error);
      throw error;
    }
  }

  // Load Google Sign-In API
  loadGoogleSignInAPI() {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.accounts) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Sign-In API'));
      
      document.head.appendChild(script);
    });
  }

  // Render the sign-in button
  renderSignInButton() {
    const container = document.getElementById('googleSignInContainer');
    if (container) {
      google.accounts.id.renderButton(container, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 250
      });
    }
  }

  // Handle credential response after sign-in
  handleCredentialResponse(response) {
    try {
      // Decode the JWT token to get user info
      const payload = this.decodeJwtResponse(response.credential);
      
      this.currentUser = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        sub: payload.sub
      };
      
      this.authToken = response.credential;
      this.isSignedIn = true;
      
      // Update UI to show signed-in state
      this.updateAuthUI();
      
      // Store auth state in localStorage
      localStorage.setItem('bhsGoogleAuth', JSON.stringify({
        user: this.currentUser,
        token: this.authToken,
        timestamp: Date.now()
      }));
      
      console.log('User signed in:', this.currentUser.name);
      
      // Trigger any callbacks
      if (this.onSignInCallback) {
        this.onSignInCallback(this.currentUser);
      }
      
    } catch (error) {
      console.error('Error handling credential response:', error);
      this.showAuthError('Sign-in failed. Please try again.');
    }
  }

  // Decode JWT response
  decodeJwtResponse(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid JWT token');
    }
  }

  // Sign out
  signOut() {
    if (window.google && window.google.accounts) {
      google.accounts.id.disableAutoSelect();
    }
    
    this.isSignedIn = false;
    this.currentUser = null;
    this.authToken = null;
    
    // Clear localStorage
    localStorage.removeItem('bhsGoogleAuth');
    
    // Update UI
    this.updateAuthUI();
    
    console.log('User signed out');
    
    // Trigger callback
    if (this.onSignOutCallback) {
      this.onSignOutCallback();
    }
  }

  // Update authentication UI
  updateAuthUI() {
    const signInContainer = document.getElementById('googleSignInContainer');
    const userInfoContainer = document.getElementById('userInfoContainer');
    const signOutBtn = document.getElementById('signOutBtn');
    const currentUsername = document.getElementById('currentUsername');
    
    if (this.isSignedIn && this.currentUser) {
      // Show user info and sign out button
      if (signInContainer) signInContainer.style.display = 'none';
      if (userInfoContainer) userInfoContainer.style.display = 'block';
      if (signOutBtn) signOutBtn.style.display = 'inline-block';
      
      // Update username box with user's name
      if (currentUsername) {
        currentUsername.textContent = this.currentUser.name;
      }
      
    } else {
      // Show sign in button
      if (signInContainer) signInContainer.style.display = 'block';
      if (userInfoContainer) userInfoContainer.style.display = 'none';
      if (signOutBtn) signOutBtn.style.display = 'none';
    }
  }

  // Check if user is signed in
  isUserSignedIn() {
    return this.isSignedIn && this.currentUser !== null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Get auth token
  getAuthToken() {
    return this.authToken;
  }

  // Set callbacks
  onSignIn(callback) {
    this.onSignInCallback = callback;
  }

  onSignOut(callback) {
    this.onSignOutCallback = callback;
  }

  // Show authentication error
  showAuthError(message) {
    const errorDiv = document.getElementById('authError');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
      setTimeout(() => {
        errorDiv.style.display = 'none';
      }, 5000);
    }
  }

  // Check for existing auth session
  checkExistingSession() {
    try {
      const authData = localStorage.getItem('bhsGoogleAuth');
      if (authData) {
        const { user, token, timestamp } = JSON.parse(authData);
        
        // Check if session is still valid (24 hours)
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          this.currentUser = user;
          this.authToken = token;
          this.isSignedIn = true;
          // Don't call updateAuthUI here - let the navbar-loader handle it
          return true;
        } else {
          // Session expired, clear it
          localStorage.removeItem('bhsGoogleAuth');
        }
      }
    } catch (error) {
      console.error('Error checking existing session:', error);
      localStorage.removeItem('bhsGoogleAuth');
    }
    
    return false;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GoogleAuth;
}
