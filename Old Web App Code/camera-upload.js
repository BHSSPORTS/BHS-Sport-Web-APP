// Camera Upload and Apps Script Integration
// This file handles the photo upload functionality to Google Apps Script

class CameraUploader {
  constructor() {
    this.appsScriptUrl = null;
    this.uploadProgress = 0;
    this.isUploading = false;
  }

  // Set the Apps Script URL
  setAppsScriptUrl(url) {
    this.appsScriptUrl = url;
  }

  // Set the Google Auth instance
  setGoogleAuth(googleAuth) {
    this.googleAuth = googleAuth;
  }

  // Upload photo to Apps Script
  async uploadPhoto(imageData, metadata = {}) {
    if (!this.appsScriptUrl) {
      throw new Error('Apps Script URL not set. Please configure the upload URL first.');
    }

    // Check if user is authenticated with Google
    if (!this.googleAuth || !this.googleAuth.isUserSignedIn()) {
      throw new Error('Please sign in with Google to upload photos.');
    }

    if (this.isUploading) {
      throw new Error('Upload already in progress. Please wait.');
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    try {
      // Convert to URL parameters for better compatibility
      const params = new URLSearchParams();
      params.append('photo', imageData);
      params.append('timestamp', new Date().toISOString());
      params.append('user', metadata.user || 'unknown');
      params.append('userEmail', metadata.userEmail || 'unknown@barrowhills.org');
      params.append('description', metadata.description || '');
      params.append('category', metadata.category || 'general');
      
      return new Promise((resolve, reject) => {
        // Simulate progress
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 20;
          this.uploadProgress = Math.min(progress, 90);
          this.updateProgressUI(this.uploadProgress);
          
          if (progress >= 90) {
            clearInterval(progressInterval);
          }
        }, 200);

        // Try direct request first
        fetch(this.appsScriptUrl, {
          method: 'POST',
          body: params.toString(),
          mode: 'cors',
          credentials: 'omit',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(response => {
          clearInterval(progressInterval);
          this.isUploading = false;
          this.uploadProgress = 100;
          this.updateProgressUI(100);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          // Try to parse as JSON, but fall back to text if it fails
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return response.json();
          } else {
            // If not JSON, treat as successful text response
            return response.text().then(text => ({ success: true, message: text }));
          }
        })
        .then(data => {
          if (data.success) {
            resolve({ success: true, message: data.message || 'Photo uploaded successfully' });
          } else {
            reject(new Error(data.error || 'Upload failed'));
          }
        })
        .catch(error => {
          clearInterval(progressInterval);
          this.isUploading = false;
          console.error('Upload error:', error);
          reject(new Error(`Upload failed: ${error.message}`));
        });
      });

    } catch (error) {
      this.isUploading = false;
      throw error;
    }
  }

  // Update progress UI
  updateProgressUI(progress) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill && progressText) {
      progressFill.style.width = progress + '%';
      progressText.textContent = progress + '%';
    }
  }

  // Get current upload progress
  getProgress() {
    return this.uploadProgress;
  }

  // Check if currently uploading
  getUploadingStatus() {
    return this.isUploading;
  }

  // Cancel current upload
  cancelUpload() {
    this.isUploading = false;
    this.uploadProgress = 0;
    this.updateProgressUI(0);
  }
}
