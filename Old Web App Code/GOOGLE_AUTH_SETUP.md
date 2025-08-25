# 🔐 Google Authentication Setup Guide

## Overview
Your BHS Sports Hub now uses Google OAuth authentication instead of the old passcode system. This means:
- Teachers sign in with their own Google accounts (personal or business)
- Camera uploads go to their own Google Drive
- No more personal account credential issues
- Secure, organization-specific access

## 🚀 Quick Setup

### Step 1: Get Your Google OAuth Client ID
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Google Drive API
   - Google+ API (or Google Identity API)
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application" type
6. Add authorized origins:
   - `http://localhost:8000` (for testing)
   - Your actual domain (e.g., `https://yourdomain.com`)
7. Copy the Client ID (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)

### Step 2: Update Configuration
1. Open `config.js`
2. Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Client ID
3. Save the file

### Step 3: Test
1. Open your app in a browser
2. You should see a Google Sign-In button in the top-right navbar
3. Click it and sign in with a Google account
4. Your name and email should appear in the navbar
5. Try the camera - it should now work with your authenticated account

## 🔧 Configuration Options

In `config.js`, you can customize:

```javascript
const BHS_CONFIG = {
  GOOGLE_CLIENT_ID: 'your-client-id-here',
  ENABLE_GOOGLE_AUTH: true,        // Enable/disable Google auth
  ENABLE_PASSCODE_LOGIN: false,     // Disable old passcode system
  SESSION_TIMEOUT_HOURS: 24,        // How long sessions last
  // ... more options
};
```

## 📱 How It Works

### Authentication Flow
1. **User visits your app** → Automatically redirected to passcode page if not authenticated
2. **User sees passcode page** → Google Sign-In button displayed prominently
3. **User clicks Sign-In** → Google OAuth popup appears
4. **User authenticates** → Your app gets their info (name, email, profile picture)
5. **User redirected to main app** → Can now access all features
6. **Session persists** → User stays signed in for 24 hours

### Security Features
- **Forced authentication** - No access to main app without Google sign-in
- **Automatic redirects** - Unauthenticated users always go to passcode page
- **Session expiration** - Users must re-authenticate after 24 hours
- **Secure storage** - Authentication tokens stored securely in localStorage

### Camera Integration
- **Requires authentication** - Camera only works for signed-in users
- **User-specific uploads** - Photos go to the authenticated user's Google Drive
- **Automatic credential use** - No manual setup needed

## 🎯 Benefits

- ✅ **No personal account issues** - Each user uses their own account
- ✅ **Business accounts work** - Teachers can use work Google accounts
- ✅ **Secure** - No hardcoded credentials
- ✅ **Scalable** - Works for any number of users
- ✅ **Professional** - Modern authentication system
- ✅ **Forced authentication** - Users must sign in before accessing any part of the app
- ✅ **Session management** - Automatic redirect to passcode page when not authenticated
- ✅ **24-hour sessions** - Users stay signed in for a full day

## 🚨 Troubleshooting

### "Google Client ID not configured"
- Check that you've updated `config.js` with your actual Client ID
- Make sure `config.js` is loaded before other scripts

### "Please sign in with Google to use the camera"
- User needs to sign in first before using camera
- Check that Google authentication is working in the navbar

### "Failed to initialize Google Auth"
- Check browser console for errors
- Verify your Client ID is correct
- Make sure you've enabled the required APIs in Google Cloud Console

### Camera uploads still going to personal account
- The camera system now uses the authenticated user's credentials
- Make sure the user is signed in with their business account

## 🔄 Updating Your Apps Script

Your existing Apps Script will continue to work, but you may want to update it to:
1. Use the authenticated user's information
2. Save photos to the user's own Drive
3. Add better error handling

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Google Cloud Console setup
3. Test with the `auth-test.html` page first
4. Make sure all files are properly loaded

## 🎉 You're Done!

Once configured, your app will:
- Show Google Sign-In instead of passcode entry
- Display the user's name and email in the navbar
- Use their Google account for camera uploads
- Work seamlessly with both personal and business Google accounts

The old passcode system is still available as a fallback, but Google authentication is now the primary method.
