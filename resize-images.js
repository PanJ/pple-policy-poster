#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];

async function resizeImages(folderPath) {
  if (!fs.existsSync(folderPath)) {
    console.error(`Error: Folder "${folderPath}" does not exist`);
    process.exit(1);
  }

  const outputFolder = path.join(folderPath, 'resized');
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

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

  console.log(`Resizing ${total} images to 1200x1600...`);

  for (let i = 0; i < total; i++) {
    const filename = imageFiles[i];
    const inputPath = path.join(folderPath, filename);
    const outputFilename = path.parse(filename).name + '.png';
    const outputPath = path.join(outputFolder, outputFilename);

    try {
      await sharp(inputPath)
        .resize(1200, 1600, {
          fit: 'fill'
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Resized: ${filename} -> ${outputFilename} (${i + 1}/${total})`);
    } catch (error) {
      console.error(`✗ Error resizing ${filename}:`, error.message);
    }
  }

  console.log(`\nCompleted! Resized images saved to: ${outputFolder}`);
}

const folderPath = process.argv[2];

if (!folderPath) {
  console.log('Usage: node resize-images.js <folder-path>');
  console.log('Example: node resize-images.js ./images');
  process.exit(1);
}

resizeImages(folderPath).catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
