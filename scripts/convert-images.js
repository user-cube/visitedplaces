const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, '../public/images/itineraries/2025');
const outputDir = path.join(__dirname, '../public/images/itineraries/2025');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function convertToWebP() {
  try {
    console.log('🔄 Converting images to WebP...');

    // Get all image files
    const files = fs.readdirSync(imagesDir).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png'].includes(ext);
    });

    if (files.length === 0) {
      console.log('ℹ️  No images found to convert');
      return;
    }

    console.log(`📁 Found ${files.length} images to convert:`);

    for (const file of files) {
      const inputPath = path.join(imagesDir, file);
      const nameWithoutExt = path.parse(file).name;
      const outputPath = path.join(outputDir, `${nameWithoutExt}.webp`);

      console.log(`\n🔄 Converting: ${file}`);

      try {
        // Convert to WebP with optimization
        await sharp(inputPath)
          .webp({
            quality: 80,
            effort: 6,
            nearLossless: false,
          })
          .resize(800, null, {
            // Resize to 800px width, maintain aspect ratio
            withoutEnlargement: true,
            fit: 'inside',
          })
          .toFile(outputPath);

        // Get file sizes for comparison
        const originalSize = fs.statSync(inputPath).size;
        const webpSize = fs.statSync(outputPath).size;
        const savings = (
          ((originalSize - webpSize) / originalSize) *
          100
        ).toFixed(1);

        console.log(`✅ Converted: ${nameWithoutExt}.webp`);
        console.log(`   Original: ${(originalSize / 1024).toFixed(1)}KB`);
        console.log(`   WebP: ${(webpSize / 1024).toFixed(1)}KB`);
        console.log(`   Savings: ${savings}%`);
      } catch (error) {
        console.error(`❌ Error converting ${file}:`, error.message);
      }
    }

    console.log('\n✅ WebP conversion completed!');
    console.log('📁 WebP files saved in:', outputDir);
  } catch (error) {
    console.error('❌ Error during conversion:', error);
    process.exit(1);
  }
}

// Run conversion if this script is executed directly
if (require.main === module) {
  convertToWebP();
}

module.exports = { convertToWebP };
