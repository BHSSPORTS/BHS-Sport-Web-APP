# 🚨 CORS Fix for Your Apps Script - PERSONAL ACCOUNT VERSION

## The Problem
Your Apps Script is blocking requests from `bhssportshub.org` due to CORS policy. **Google Apps Script has a fundamental limitation: it cannot override CORS headers set by Google's servers.**

## 🔧 **SOLUTION: Use Personal Account + Specific Organization Folder**

### Step 1: Update Your Apps Script Code
**Delete everything** in the editor and paste this **personal account version** that saves to your specific folder:

```javascript
// Google Apps Script for BHS Sports Hub - Personal Account Version
// This script runs under your personal account but saves to your specific organization folder

function doGet(e) {
  // Simple response for testing
  return ContentService.createTextOutput('BHS Sports Hub Camera Upload Endpoint')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    // Get the uploaded photo data and metadata
    const photoData = e.parameter.photo;
    const timestamp = e.parameter.timestamp;
    const user = e.parameter.user;
    const userEmail = e.parameter.userEmail; // User's email for logging
    const description = e.parameter.description || '';
    const category = e.parameter.category || 'sports';
    
    // Validate required parameters
    if (!photoData || !timestamp || !user || !userEmail) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Missing required parameters: photo, timestamp, user, or userEmail'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Create a unique filename
    const filename = `BHS_Sports_${timestamp}_${user.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
    
    // Convert base64 data to blob
    const photoBlob = Utilities.newBlob(
      Utilities.base64Decode(photoData.split(',')[1]), 
      'image/jpeg', 
      filename
    );
    
    // STEP 1: Save to your specific organization folder (NOT personal Drive)
    const specificFolder = getSpecificOrganizationFolder();
    const organizationFile = specificFolder.createFile(photoBlob);
    organizationFile.setName(filename);
    
    // Add metadata to organization file
    const fileDescription = `BHS Sports Hub Photo Upload
Uploaded by: ${user} (${userEmail})
Timestamp: ${timestamp}
Description: ${description}
Category: ${category}
Folder: ${specificFolder.getName()}
Folder ID: ${specificFolder.getId()}
Upload Date: ${new Date().toISOString()}
Saved to: Specific Organization Folder (NOT personal Drive)`;
    
    organizationFile.setDescription(fileDescription);
    
    // Log the successful upload
    console.log(`Photo uploaded successfully: ${filename} by ${user} (${userEmail})`);
    console.log(`Specific folder: ${specificFolder.getName()} (ID: ${specificFolder.getId()})`);
    console.log(`File saved to specific organization folder, NOT personal Drive`);
    
    // Return success response with file details
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Photo uploaded successfully to your specific BHS Sports Hub folder',
        organizationFile: {
          fileId: organizationFile.getId(),
          fileUrl: organizationFile.getUrl(),
          filename: filename,
          folder: specificFolder.getName(),
          folderId: specificFolder.getId(),
          driveType: 'Specific Organization Folder (NOT personal Drive)'
        },
        user: user,
        userEmail: userEmail,
        uploadTime: new Date().toISOString(),
        note: 'Photo saved to your specific organization folder - not personal Drive'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log the error
    console.error('Error in doPost:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Upload failed: ' + error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Get your specific organization folder by ID (NOT personal Drive)
function getSpecificOrganizationFolder() {
  const specificFolderId = '1_pG1s9lfujQCEW5bj58XF4CPQ5bRIYcE'; // Your specific folder ID
  
  try {
    // Get the specific folder by ID
    const specificFolder = DriveApp.getFolderById(specificFolderId);
    console.log(`Successfully accessed specific folder: ${specificFolder.getName()} (ID: ${specificFolder.getId()})`);
    return specificFolder;
  } catch (error) {
    console.error('Error accessing specific folder:', error);
    throw new Error(`Failed to access your specific folder (ID: ${specificFolderId}): ${error.toString()}`);
  }
}

// Helper function to test the script
function testScript() {
  console.log('BHS Sports Hub Apps Script is working correctly');
  console.log('Script can access Drive:', typeof DriveApp !== 'undefined');
  console.log('Script can access ContentService:', typeof ContentService !== 'undefined');
  console.log('Script can access Utilities:', typeof Utilities !== 'undefined');
  console.log('Personal account script configured for specific organization folder access');
  
  // Test folder access
  try {
    const testFolder = getSpecificOrganizationFolder();
    console.log('✅ Successfully accessed specific folder:', testFolder.getName());
  } catch (error) {
    console.error('❌ Failed to access specific folder:', error.message);
  }
}
```

### Step 2: **Deploy with Personal Account**
1. **Use your PERSONAL Google account** (not barrowhills.org)
2. **Save the project** (Ctrl+S or Cmd+S)
3. **Deploy as new version:**
   - Click "Deploy" → "New deployment"
   - **Type**: "Web app"
   - **Execute as**: "Me" (your personal account)
   - **Who has access**: "Anyone" (this should be available with personal account)
   - Click "Deploy"
4. **Copy the new Web App URL**

### Step 3: Update Your Config
1. Open `config.js` in your project
2. Update the `APPS_SCRIPT_URL` with your new personal account URL:

```javascript
const BHS_CONFIG = {
  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: '384244798967-eoqipv42bt1tp34rkqv4gb5bnmtejag5.apps.googleusercontent.com',
  
  // Apps Script Configuration - UPDATE WITH YOUR PERSONAL ACCOUNT URL
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_PERSONAL_SCRIPT_ID/exec',
  
  // ... rest of config
};
```

## 🎯 **What This Updated Version Does**

- ✅ **Uses your personal account** (fewer deployment restrictions)
- ✅ **Saves to your SPECIFIC folder** (ID: 1_pG1s9lfujQCEW5bj58XF4CPQ5bRIYcE)
- ✅ **NOT saved to personal Drive** (clean separation)
- ✅ **Better CORS handling** (personal accounts often have more access)
- ✅ **Uses existing folder** (no new folders created)

## 🚨 **Why This Will Work**

- **Personal accounts** can access organization folders they have access to
- **Personal accounts** often have fewer deployment restrictions
- **Photos go directly** to your specific folder, bypassing personal Drive
- **No new folders created** - uses your existing setup

## 🧪 **Test After Update**

1. **Update your Apps Script** with the specific folder code
2. **Deploy with personal account** (should see "Anyone" access option)
3. **Update your config.js** with the new URL
4. **Test camera upload** - should work without CORS errors
5. **Check your specific folder** - photos should appear there
6. **Check personal Drive** - should be empty (no photos or new folders)

This approach gives you the best of both worlds - easy deployment AND photos go to your exact folder! 🎉
