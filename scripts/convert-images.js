const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const itinerariesDir = path.join(__dirname, '../public/images/itineraries');

async function convertToWebP() {
  try {
    console.log('🔄 Converting images to WebP...');

    // Get all year directories
    const yearDirs = fs
      .readdirSync(itinerariesDir)
      .filter(item => {
        const itemPath = path.join(itinerariesDir, item);
        return fs.statSync(itemPath).isDirectory() && /^\d{4}$/.test(item);
      })
      .sort();

    let totalConverted = 0;

    for (const year of yearDirs) {
      const yearDir = path.join(itinerariesDir, year);

      // Ensure output directory exists
      if (!fs.existsSync(yearDir)) {
        fs.mkdirSync(yearDir, { recursive: true });
      }

      // Get all image files in this year directory
      const files = fs.readdirSync(yearDir).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png'].includes(ext);
      });

      if (files.length === 0) {
        console.log(`ℹ️  No images found in ${year}/`);
        continue;
      }

      console.log(
        `\n📁 Processing ${year}/ - Found ${files.length} images to convert:`
      );

      for (const file of files) {
        const inputPath = path.join(yearDir, file);
        const nameWithoutExt = path.parse(file).name;
        const outputPath = path.join(yearDir, `${nameWithoutExt}.webp`);

        console.log(`🔄 Converting: ${file}`);

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

          totalConverted++;
        } catch (error) {
          console.error(`❌ Error converting ${file}:`, error.message);
        }
      }
    }

    if (totalConverted === 0) {
      console.log('\nℹ️  No images found to convert in any directory');
    } else {
      console.log(
        `\n✅ WebP conversion completed! Converted ${totalConverted} images.`
      );
    }
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
