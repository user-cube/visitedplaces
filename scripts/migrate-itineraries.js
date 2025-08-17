const fs = require('fs');
const path = require('path');

/**
 * Script to migrate itineraries from the old single-file structure
 * to the new organized file structure
 */

// Read the old itineraries file
const oldItinerariesPath = path.join(
  __dirname,
  '../public/data/itineraries.json.backup'
);
const itinerariesDir = path.join(__dirname, '../public/data/itineraries');

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function sanitizeFilename(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function getYearFromDate(dateString) {
  return new Date(dateString).getFullYear().toString();
}

function migrateItineraries() {
  try {
    // Read the old itineraries file
    const oldData = JSON.parse(fs.readFileSync(oldItinerariesPath, 'utf8'));
    const itineraries = oldData.itineraries || [];

    console.log(`Found ${itineraries.length} itineraries to migrate`);

    // Ensure the itineraries directory exists
    ensureDirectoryExists(itinerariesDir);

    const indexEntries = [];

    // Process each itinerary
    itineraries.forEach((itinerary, index) => {
      const year = getYearFromDate(itinerary.startDate);
      const yearDir = path.join(itinerariesDir, year);

      // Ensure year directory exists
      ensureDirectoryExists(yearDir);

      // Generate filename
      const filename = `${sanitizeFilename(itinerary.title)}.json`;
      const filePath = path.join(yearDir, filename);

      // Write individual itinerary file
      fs.writeFileSync(filePath, JSON.stringify(itinerary, null, 2));

      // Add to index
      indexEntries.push({
        id: itinerary.id,
        title: itinerary.title,
        startDate: itinerary.startDate,
        endDate: itinerary.endDate,
        description: itinerary.description,
        file: `${year}/${filename}`,
      });

      console.log(`✓ Migrated: ${itinerary.title} -> ${year}/${filename}`);
    });

    // Write index file
    const indexData = {
      itineraries: indexEntries,
    };

    const indexPath = path.join(itinerariesDir, 'index.json');
    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));

    console.log(`\n✓ Migration completed successfully!`);
    console.log(`✓ Created index file: data/itineraries/index.json`);
    console.log(
      `✓ Migrated ${itineraries.length} itineraries to individual files`
    );

    // Create backup of old file
    const backupPath = path.join(
      __dirname,
      '../public/data/itineraries.json.backup'
    );
    fs.copyFileSync(oldItinerariesPath, backupPath);
    console.log(`✓ Created backup: public/data/itineraries.json.backup`);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateItineraries();
}

module.exports = { migrateItineraries };
