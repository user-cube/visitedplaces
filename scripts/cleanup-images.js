const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images/itineraries/2025');

function cleanupOriginalImages() {
  try {
    console.log('🧹 Cleaning up original images...');

    // Get all original image files
    const files = fs.readdirSync(imagesDir).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png'].includes(ext);
    });

    if (files.length === 0) {
      console.log('ℹ️  No original images found to clean up');
      return;
    }

    console.log(`📁 Found ${files.length} original images to remove:`);

    let totalSize = 0;
    for (const file of files) {
      const filePath = path.join(imagesDir, file);
      const stats = fs.statSync(filePath);
      totalSize += stats.size;

      fs.unlinkSync(filePath);
      console.log(`🗑️  Removed: ${file} (${(stats.size / 1024).toFixed(1)}KB)`);
    }

    console.log(`\n✅ Cleanup completed!`);
    console.log(`💾 Freed up: ${(totalSize / 1024).toFixed(1)}KB`);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

// Run cleanup if this script is executed directly
if (require.main === module) {
  cleanupOriginalImages();
}

module.exports = { cleanupOriginalImages };
