// Icon Generator for BHS Sports Hub Web App
// Run this in a browser to generate all required icon sizes

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

function generateIcons() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Load the source image (use your 512x512 image as base)
  const img = new Image();
  img.crossOrigin = 'anonymous';
  
  img.onload = function() {
    iconSizes.forEach(size => {
      canvas.width = size;
      canvas.height = size;
      
      // Clear canvas
      ctx.clearRect(0, 0, size, size);
      
      // Draw image scaled to size
      ctx.drawImage(img, 0, 0, size, size);
      
      // Convert to blob and download
      canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `icon-${size}x${size}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');
    });
  };
  
  // Set source to your 512x512 icon
  img.src = 'WebAppImages/Sports Hub (512 x 512 px).png';
}

// Create UI for icon generation
function createIconGenerator() {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 10000;
    font-family: Arial, sans-serif;
  `;
  
  container.innerHTML = `
    <h3 style="margin: 0 0 15px 0; color: #cf0553;">Icon Generator</h3>
    <p style="margin: 0 0 15px 0; font-size: 14px;">Click to generate all icon sizes</p>
    <button onclick="generateIcons()" style="
      background: #cf0553;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    ">Generate Icons</button>
  `;
  
  document.body.appendChild(container);
}

// Auto-create the generator when script loads
if (typeof document !== 'undefined') {
  createIconGenerator();
}
