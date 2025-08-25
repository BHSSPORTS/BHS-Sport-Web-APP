// Google Apps Script Code for BHS Sports Hub Photo Upload
// Copy this entire code into your Google Apps Script project

function doGet(e) {
  // Handle CORS preflight request
  const headers = {
    'Access-Control-Allow-Origin': 'https://bhssportshub.org',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  };
  
  return HtmlService.createHtmlOutput('BHS Sports Hub - Camera Upload Endpoint')
    .addMetaTag('Access-Control-Allow-Origin', 'https://bhssportshub.org');
}

function doOptions(e) {
  // Handle CORS preflight OPTIONS request
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

function doPost(e) {
  try {
    // Get the uploaded file data
    const photoData = e.parameter.photo;
    const timestamp = e.parameter.timestamp;
    const user = e.parameter.user;
    const description = e.parameter.description || '';
    const category = e.parameter.category || 'general';
    
    // Create a unique filename with better formatting
    const date = new Date(timestamp);
    const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
    const formattedTime = date.toTimeString().split(' ')[0].replace(/:/g, '');
    const filename = `BHS_Sports_${formattedDate}_${formattedTime}_${user}.jpg`;
    
    // Get the Drive folder by ID (your specific folder)
    const folderId = '1_pG1s9lfujQCEW5bj58XF4CPQ5bRIYcE';
    let folder;
    try {
      folder = DriveApp.getFolderById(folderId);
      console.log('Successfully accessed folder:', folder.getName());
    } catch (e) {
      // If folder doesn't exist or access denied, create a new one
      const folderName = 'BHS_Sports_Photos';
      try {
        folder = DriveApp.getFoldersByName(folderName).next();
        console.log('Using existing folder:', folder.getName());
      } catch (e2) {
        folder = DriveApp.createFolder(folderName);
        console.log('Created new folder:', folder.getName());
      }
    }
    
    // Convert base64 data to blob
    const photoBlob = Utilities.newBlob(Utilities.base64Decode(photoData), 'image/jpeg', filename);
    
    // Save the file to Drive
    const file = folder.createFile(photoBlob);
    file.setName(filename);
    
    // Add metadata to file description
    const fileDescription = `Uploaded by: ${user}\nTimestamp: ${timestamp}\nDescription: ${description}\nCategory: ${category}\nFolder: ${folder.getName()}`;
    file.setDescription(fileDescription);
    
    // Log successful upload
    console.log('Photo uploaded successfully:', {
      filename: filename,
      fileId: file.getId(),
      folder: folder.getName(),
      user: user,
      timestamp: timestamp
    });
    
    // Return success response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Photo uploaded successfully to BHS Sports Hub',
        fileId: file.getId(),
        fileUrl: file.getUrl(),
        filename: filename,
        folderName: folder.getName()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': 'https://bhssportshub.org',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      
  } catch (error) {
    // Log error for debugging
    console.error('Error uploading photo:', error.toString());
    
    // Return error response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        message: 'Failed to upload photo. Please try again.'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': 'https://bhssportshub.org',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
  }
}

// Optional: Function to test folder access
function testFolderAccess() {
  try {
    const folderId = '1_pG1s9lfujQCEW5bj58XF4CPQ5bRIYcE';
    const folder = DriveApp.getFolderById(folderId);
    console.log('Folder access successful!');
    console.log('Folder name:', folder.getName());
    console.log('Folder ID:', folder.getId());
    console.log('Folder URL:', folder.getUrl());
    return true;
  } catch (error) {
    console.error('Folder access failed:', error.toString());
    return false;
  }
}

// Optional: Function to list files in the folder
function listFolderContents() {
  try {
    const folderId = '1_pG1s9lfujQCEW5bj58XF4CPQ5bRIYcE';
    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFiles();
    
    console.log('Files in folder:', folder.getName());
    let fileCount = 0;
    while (files.hasNext()) {
      const file = files.next();
      console.log(`- ${file.getName()} (${file.getSize()} bytes)`);
      fileCount++;
    }
    console.log(`Total files: ${fileCount}`);
    return fileCount;
  } catch (error) {
    console.error('Failed to list folder contents:', error.toString());
    return -1;
  }
}
