const fs = require('fs');
const path = require('path');

const itinerariesDir = path.join(__dirname, '../public/images/itineraries');

function cleanupOriginalImages() {
  try {
    console.log('🧹 Cleaning up original images...');

    // Get all year directories
    const yearDirs = fs
      .readdirSync(itinerariesDir)
      .filter(item => {
        const itemPath = path.join(itinerariesDir, item);
        return fs.statSync(itemPath).isDirectory() && /^\d{4}$/.test(item);
      })
      .sort();

    let totalRemoved = 0;
    let totalSize = 0;

    for (const year of yearDirs) {
      const yearDir = path.join(itinerariesDir, year);

      // Get all original image files in this year directory
      const files = fs.readdirSync(yearDir).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png'].includes(ext);
      });

      if (files.length === 0) {
        console.log(`ℹ️  No original images found in ${year}/`);
        continue;
      }

      console.log(
        `\n📁 Processing ${year}/ - Found ${files.length} original images to remove:`
      );

      for (const file of files) {
        const filePath = path.join(yearDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;

        fs.unlinkSync(filePath);
        console.log(
          `🗑️  Removed: ${file} (${(stats.size / 1024).toFixed(1)}KB)`
        );
        totalRemoved++;
      }
    }

    if (totalRemoved === 0) {
      console.log(
        '\nℹ️  No original images found to clean up in any directory'
      );
    } else {
      console.log(`\n✅ Cleanup completed!`);
      console.log(`🗑️  Removed: ${totalRemoved} files`);
      console.log(`💾 Freed up: ${(totalSize / 1024).toFixed(1)}KB`);
    }
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
