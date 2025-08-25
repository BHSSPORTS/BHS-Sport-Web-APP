// Results Input JavaScript - Specifically for Boys Kit Marks
// This handles form submission to a different spreadsheet than the main results input

// Google Apps Script Web App URL for Boys Kit Marks
// IMPORTANT: Replace this with your actual Google Apps Script URL for kit marks
// This should be different from the main results spreadsheet
const BOYS_KIT_MARKS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_KIT_MARKS_SCRIPT_ID_HERE/exec';

// Form submission function for Boys Kit Marks
async function submitKitMarkForm(formData) {
  try {
    // Check if the script URL is properly configured
    if (BOYS_KIT_MARKS_SCRIPT_URL.includes('YOUR_KIT_MARKS_SCRIPT_ID_HERE')) {
      showMessage('Kit marks submission is not configured. Please contact the administrator.', 'error');
      console.error('Kit marks script URL not configured:', BOYS_KIT_MARKS_SCRIPT_URL);
      return;
    }

    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="icon"><i class="fas fa-spinner fa-spin"></i></span><span>Submitting...</span>';
    submitBtn.disabled = true;

    // Prepare the data for submission
    const submissionData = {
      Student: formData.Student,
      KitMark: formData.KitMark,
      DateSubmitted: new Date().toISOString(),
      SubmittedBy: getCurrentUserName()
    };

    console.log('Attempting to submit kit mark to:', BOYS_KIT_MARKS_SCRIPT_URL);
    console.log('Data being sent:', submissionData);

    // Send data to Google Apps Script
    const response = await fetch(BOYS_KIT_MARKS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Required for Google Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData)
    });

    // Since we're using no-cors, we can't read the response
    // But we can assume success if no error was thrown
    
    // Show success message
    showMessage('Kit mark submitted successfully!', 'success');
    
    // Reset form
    resetKitMarkForm();
    
    // Log submission for debugging
    console.log('Kit mark submitted successfully:', submissionData);
    
  } catch (error) {
    console.error('Error submitting kit mark:', error);
    showMessage('Error submitting kit mark. Please try again.', 'error');
  } finally {
    // Restore submit button
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = '<span class="icon"><i class="fas fa-paper-plane"></i></span><span>Submit Kit Mark</span>';
    submitBtn.disabled = false;
  }
}

// Alternative submission method using Google Forms (if Apps Script doesn't work)
async function submitKitMarkViaGoogleForms(formData) {
  try {
    // Google Forms submission URL (you'll need to create a Google Form and get this URL)
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/YOUR_FORM_ID/formResponse';
    
    // Prepare form data for Google Forms
    const formDataToSend = new FormData();
    formDataToSend.append('entry.123456789', formData.Student); // Replace with actual entry IDs
    formDataToSend.append('entry.987654321', formData.KitMark); // Replace with actual entry IDs
    formDataToSend.append('entry.111111111', new Date().toISOString()); // Replace with actual entry IDs
    formDataToSend.append('entry.222222222', getCurrentUserName()); // Replace with actual entry IDs

    // Submit to Google Forms
    const response = await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formDataToSend
    });

    // Show success message
    showMessage('Kit mark submitted successfully!', 'error');
    
    // Reset form
    resetKitMarkForm();
    
    console.log('Kit mark submitted via Google Forms:', formData);
    
  } catch (error) {
    console.error('Error submitting via Google Forms:', error);
    showMessage('Error submitting kit mark. Please try again.', 'error');
  }
}

// Get current user name from localStorage
function getCurrentUserName() {
  const accessData = localStorage.getItem('bhsAccessData');
  if (accessData) {
    try {
      const data = JSON.parse(accessData);
      if (data.name && data.surname) {
        return `${data.name} ${data.surname}`;
      } else if (data.name) {
        return data.name;
      } else if (data.username) {
        return data.username;
      }
    } catch (error) {
      console.error('Error parsing access data:', error);
    }
  }
  return 'Unknown User';
}

// Reset the kit mark form
function resetKitMarkForm() {
  const form = document.getElementById('kitMarkForm');
  if (form) {
    form.reset();
  }
  
  // Reset kit mark buttons
  const kitMarkButtons = document.querySelectorAll('#kit-mark-buttons button');
  kitMarkButtons.forEach(btn => btn.classList.remove('active'));
  
  // Reset hidden input
  const kitMarkValue = document.getElementById('kit-mark-value');
  if (kitMarkValue) {
    kitMarkValue.value = '';
  }
}

// Show message to user
function showMessage(text, type) {
  const messageDiv = document.getElementById('message');
  if (messageDiv) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 5000);
  }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const kitMarkForm = document.getElementById('kitMarkForm');
  const kitMarkButtons = document.querySelectorAll('#kit-mark-buttons button');
  const kitMarkValue = document.getElementById('kit-mark-value');

  if (kitMarkForm && kitMarkButtons.length > 0 && kitMarkValue) {
    // Handle kit mark button selection
    kitMarkButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        kitMarkButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        // Set the hidden input value
        kitMarkValue.value = this.dataset.value;
      });
    });

    // Handle form submission
    kitMarkForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const student = document.getElementById('student-select').value;
      const kitMark = kitMarkValue.value;
      
      if (!student || !kitMark) {
        showMessage('Please select both a student and kit mark.', 'error');
        return;
      }
      
      // Submit the form data
      const formData = {
        Student: student,
        KitMark: kitMark
      };
      
      // Try Apps Script first, fallback to Google Forms
      submitKitMarkForm(formData);
    });
  }
});

// Export functions for use in HTML
window.submitKitMarkForm = submitKitMarkForm;
window.submitKitMarkViaGoogleForms = submitKitMarkViaGoogleForms;
window.resetKitMarkForm = resetKitMarkForm;
window.showMessage = showMessage;
window.getCurrentUserName = getCurrentUserName;
