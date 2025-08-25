// Configuration file for BHS Sports Hub
// Update these values with your actual configuration

const BHS_CONFIG = {
  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: '384244798967-eoqipv42bt1tp34rkqv4gb5bnmtejag5.apps.googleusercontent.com', // Replace with your actual Client ID from Google Cloud Console
  
  // Apps Script Configuration
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwSMjNbx5Y3ZQH97aOAcnSPwwYKTYnncQ4cMa7Lf4PBCiXTltxThFmQMwCjeoewzm2a/exec',
  
  // App Settings
  APP_NAME: 'BHS Sports Hub',
  ORGANIZATION_NAME: 'Barrow Hills School',
  
  // Feature Flags
  ENABLE_GOOGLE_AUTH: true,
  ENABLE_CAMERA_UPLOAD: true,
  ENABLE_PASSCODE_LOGIN: false, // Set to false to disable old passcode system
  
  // Session Settings
  SESSION_TIMEOUT_HOURS: 24, // How long Google auth sessions last
  
  // Camera Settings
  MAX_PHOTO_SIZE_MB: 10,
  SUPPORTED_IMAGE_FORMATS: ['image/jpeg', 'image/png', 'image/webp']
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BHS_CONFIG;
}
