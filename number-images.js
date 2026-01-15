#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, registerFont } = require('canvas');

// Register Anakotmai font from Windows (accessible via WSL)
try {
  registerFont('/mnt/c/Windows/Fonts/Anakotmai-Medium.otf', { family: 'Anakotmai Medium' });
  registerFont('/mnt/c/Windows/Fonts/Anakotmai-Bold.otf', { family: 'Anakotmai Bold' });
  console.log('✓ Anakotmai fonts registered successfully');
} catch (error) {
  console.log('⚠ Could not register Anakotmai fonts from Windows. Using fallback fonts.');
}

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];

async function processImages(folderPath) {
  // Validate folder exists
  if (!fs.existsSync(folderPath)) {
    console.error(`Error: Folder "${folderPath}" does not exist`);
    process.exit(1);
  }

  // Create output subfolder
  const outputFolder = path.join(folderPath, 'numbered');
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  // Get all image files
  const files = fs.readdirSync(folderPath);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return IMAGE_EXTENSIONS.includes(ext);
  }).sort();

  const total = imageFiles.length;

  if (total === 0) {
    console.log('No images found in the folder');
    return;
  }

  console.log(`Processing ${total} images...`);

  // Process each image
  for (let i = 0; i < total; i++) {
    const filename = imageFiles[i];
    const inputPath = path.join(folderPath, filename);
    const outputFilename = path.parse(filename).name + '.png';
    const outputPath = path.join(outputFolder, outputFilename);

    try {
      // Load the image
      const image = await loadImage(inputPath);
      
      // Create canvas at target size directly (1200x1600)
      const canvas = createCanvas(1200, 1600);
      const ctx = canvas.getContext('2d');

      // Draw original image resized to fit
      ctx.drawImage(image, 0, 0, 1200, 1600);

      // Calculate text and rectangle dimensions
      const current = i + 1;
      const text = `นโยบายพรรคประชาชน ${current}/${total}`;
      
      // Set font for measurement
      const fontSize = 32;
      ctx.font = `bold ${fontSize}px "Anakotmai Medium", Arial, sans-serif`;
      
      // Measure text
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = fontSize;
      
      // Rectangle dimensions with padding
      const padding = 40;
      const rectWidth = textWidth + padding * 2;
      const rectHeight = textHeight + padding * 2;
      
      // Draw blue rectangle (using #002A47 color)
      ctx.fillStyle = '#002A47';
      ctx.fillRect(0, 0, rectWidth, rectHeight);

      ctx.fillRect(0, 0, 1200, 2);

      // Draw white text
      ctx.fillStyle = 'white';
      ctx.textBaseline = 'top';
      ctx.fillText(text, padding, padding);

      // Save as PNG
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(outputPath, buffer);

      console.log(`✓ Processed: ${filename} -> ${outputFilename}`);
    } catch (error) {
      console.error(`✗ Error processing ${filename}:`, error.message);
    }
  }

  console.log(`\nCompleted! Numbered images saved to: ${outputFolder}`);
}

// Main execution
const folderPath = process.argv[2];

if (!folderPath) {
  console.log('Usage: node number-images.js <folder-path>');
  console.log('Example: node number-images.js ./my-images');
  process.exit(1);
}

processImages(folderPath).catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
