# Google Apps Script Deployment Guide for BHS Sports Hub

## Important: CORS Configuration

To resolve the CORS errors, you need to configure your Google Apps Script deployment properly.

## Step 1: Copy the Code
Copy the entire contents of `google-apps-script-code.js` into your Google Apps Script project.

## Step 2: Deploy as Web App
1. Click **Deploy** → **New deployment**
2. Choose **Web app** as the type
3. Set **Execute as**: `Me` (your organization account)
4. Set **Who has access**: `Anyone within [your organization]`
5. Click **Deploy**

## Step 3: Update CORS Settings (Critical!)
After deployment, you need to manually add CORS headers to your Apps Script:

### Option A: Use the Updated Code (Recommended)
The updated `google-apps-script-code.js` already includes CORS headers for `https://bhssportshub.org`

### Option B: Manual CORS Configuration
If you're still having issues, add this to the top of your Apps Script:

```javascript
// Add this at the very top of your Apps Script
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': 'https://bhssportshub.org',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
}
```

## Step 4: Test the Endpoint
1. Get your deployment URL
2. Test with a simple GET request to ensure CORS headers are working
3. Check browser console for CORS errors

## Step 5: Update Your Config
Make sure your `config.js` has the correct Apps Script URL from the deployment.

## Troubleshooting CORS Issues

### Common Problems:
1. **Missing CORS headers** - Apps Script doesn't send them by default
2. **Wrong deployment settings** - Must be deployed as web app
3. **Organization restrictions** - Ensure proper access settings

### Testing CORS:
```javascript
// Test in browser console
fetch('YOUR_APPS_SCRIPT_URL', {
  method: 'POST',
  body: new FormData(),
  mode: 'cors'
}).then(r => console.log('CORS working')).catch(e => console.error('CORS failed:', e));
```

## Organization-Specific Notes
- Since you're using an organization account, ensure the script is deployed under your organization domain
- The folder ID `1_pG1s9lfujQCEW5bj58XF4CPQ5bRIYcE` should be accessible to your organization account
- All users must be signed in with their organization Google accounts

## Final Check
After deployment, verify:
1. ✅ Script deploys without errors
2. ✅ CORS headers are present in responses
3. ✅ Photos upload to the correct folder
4. ✅ No console errors in browser
