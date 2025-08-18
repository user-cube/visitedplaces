const fs = require('fs');
const path = require('path');

/**
 * Script to generate index.json with metadata from individual itinerary files
 */

const itinerariesDir = path.join(__dirname, '../public/data/itineraries');
const indexFile = path.join(itinerariesDir, 'index.json');

// Country to flag mapping
const COUNTRY_FLAGS = {
  Hungary: '🇭🇺',
  Austria: '🇦🇹',
  France: '🇫🇷',
  'United Kingdom': '🇬🇧',
  Italy: '🇮🇹',
  Spain: '🇪🇸',
  Germany: '🇩🇪',
  Netherlands: '🇳🇱',
  'Czech Republic': '🇨🇿',
  Czechia: '🇨🇿',
  Portugal: '🇵🇹',
  Switzerland: '🇨🇭',
  Belgium: '🇧🇪',
  Denmark: '🇩🇰',
  Sweden: '🇸🇪',
  Norway: '🇳🇴',
  Finland: '🇫🇮',
  Ireland: '🇮🇪',
  Poland: '🇵🇱',
  Greece: '🇬🇷',
  Croatia: '🇭🇷',
  Slovenia: '🇸🇮',
  Slovakia: '🇸🇰',
  Romania: '🇷🇴',
  Bulgaria: '🇧🇬',
  Serbia: '🇷🇸',
  'Bosnia and Herzegovina': '🇧🇦',
  Montenegro: '🇲🇪',
  Albania: '🇦🇱',
  'North Macedonia': '🇲🇰',
  Kosovo: '🇽🇰',
  Moldova: '🇲🇩',
  Ukraine: '🇺🇦',
  Belarus: '🇧🇾',
  Lithuania: '🇱🇹',
  Latvia: '🇱🇻',
  Estonia: '🇪🇪',
  Russia: '🇷🇺',
  Turkey: '🇹🇷',
  Cyprus: '🇨🇾',
  Malta: '🇲🇹',
  Iceland: '🇮🇸',
  Luxembourg: '🇱🇺',
  Liechtenstein: '🇱🇮',
  Monaco: '🇲🇨',
  'San Marino': '🇸🇲',
  'Vatican City': '🇻🇦',
  'Città del Vaticano': '🇻🇦',
  'Roma Vatican City': '🇻🇦',
  Andorra: '🇦🇩',
};

// Country to emoji mapping
const COUNTRY_EMOJIS = {
  Hungary: '🏛️',
  Austria: '🎭',
  France: '🗼',
  'United Kingdom': '🇬🇧',
  Italy: '🏛️',
  Spain: '🌞',
  Germany: '🏛️',
  Netherlands: '🌷',
  'Czech Republic': '🏰',
  Czechia: '🏰',
  Portugal: '🍷',
  Switzerland: '🏔️',
  Belgium: '🍫',
  Denmark: '🧜‍♀️',
  Sweden: '🏰',
  Norway: '❄️',
  Finland: '🎅',
  Ireland: '🍺',
  Poland: '🏰',
  Greece: '🏛️',
  Croatia: '🏖️',
  Slovenia: '🏔️',
  Slovakia: '🏰',
  Romania: '🏰',
  Bulgaria: '🌹',
  Serbia: '🏰',
  'Bosnia and Herzegovina': '🏔️',
  Montenegro: '🏔️',
  Albania: '🏔️',
  'North Macedonia': '🏔️',
  Kosovo: '🏔️',
  Moldova: '🍇',
  Ukraine: '🌻',
  Belarus: '🌲',
  Lithuania: '🏰',
  Latvia: '🌲',
  Estonia: '🌲',
  Russia: '🏰',
  Turkey: '🕌',
  Cyprus: '🏖️',
  Malta: '🏰',
  Iceland: '🌋',
  Luxembourg: '🏰',
  Liechtenstein: '🏔️',
  Monaco: '🏎️',
  'San Marino': '🏰',
  'Vatican City': '⛪',
  'Città del Vaticano': '⛪',
  'Roma Vatican City': '⛪',
  Andorra: '🏔️',
};

function extractCountriesFromItinerary(itinerary) {
  const countries = new Set();

  itinerary.points.forEach(point => {
    // Try to extract country from address
    const addressParts = point.address.split(',').map(part => part.trim());
    const lastPart = addressParts[addressParts.length - 1];

    // Special handling for Vatican addresses
    if (
      point.address.includes('Vatican') ||
      point.address.includes('Vaticano')
    ) {
      countries.add('Vatican City');
    } else if (lastPart && COUNTRY_FLAGS[lastPart]) {
      countries.add(lastPart);
    }
  });

  return Array.from(countries);
}

function generateFlagsFromCountries(countries) {
  return countries.map(country => COUNTRY_FLAGS[country] || '🌍').join(' ');
}

function generateEmojiFromCountries(countries) {
  if (countries.length === 0) return '✈️';

  const firstCountry = countries[0];
  return COUNTRY_EMOJIS[firstCountry] || '✈️';
}

function generateMetadata(itinerary) {
  const countries = extractCountriesFromItinerary(itinerary);

  return {
    flags: generateFlagsFromCountries(countries),
    emoji: generateEmojiFromCountries(countries),
    countries,
    pointsCount: itinerary.points.length,
  };
}

function generateIndex() {
  try {
    console.log('🔄 Generating index.json with metadata...');

    // Get all year directories
    const yearDirs = fs
      .readdirSync(itinerariesDir)
      .filter(item => {
        const itemPath = path.join(itinerariesDir, item);
        return fs.statSync(itemPath).isDirectory() && /^\d{4}$/.test(item);
      })
      .sort(); // Sort years

    const itineraries = [];

    yearDirs.forEach(year => {
      const yearDir = path.join(itinerariesDir, year);
      const entries = fs.readdirSync(yearDir);

      entries.forEach(entry => {
        const entryPath = path.join(yearDir, entry);
        const stats = fs.statSync(entryPath);

        // Direct JSON file in year directory
        if (stats.isFile() && entry.endsWith('.json')) {
          const itinerary = JSON.parse(fs.readFileSync(entryPath, 'utf8'));
          const metadata = generateMetadata(itinerary);
          const relativeFile = path
            .relative(itinerariesDir, entryPath)
            .replace(/\\/g, '/');

          itineraries.push({
            id: itinerary.id,
            title: itinerary.title,
            startDate: itinerary.startDate,
            endDate: itinerary.endDate,
            description: itinerary.description,
            image: itinerary.image,
            file: relativeFile,
            metadata,
          });

          console.log(`✓ Processed: ${relativeFile}`);
          console.log(`  Flags: ${metadata.flags}`);
          console.log(`  Emoji: ${metadata.emoji}`);
          console.log(`  Countries: ${metadata.countries.join(', ')}`);
          console.log(`  Points: ${metadata.pointsCount}`);
          console.log('');
        }

        // Subdirectory – process any JSON files inside
        if (stats.isDirectory()) {
          const subFiles = fs
            .readdirSync(entryPath)
            .filter(f => f.endsWith('.json'));
          subFiles.forEach(file => {
            const filePath = path.join(entryPath, file);
            const itinerary = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const metadata = generateMetadata(itinerary);
            const relativeFile = path
              .relative(itinerariesDir, filePath)
              .replace(/\\/g, '/');

            itineraries.push({
              id: itinerary.id,
              title: itinerary.title,
              startDate: itinerary.startDate,
              endDate: itinerary.endDate,
              description: itinerary.description,
              image: itinerary.image,
              file: relativeFile,
              metadata,
            });

            console.log(`✓ Processed: ${relativeFile}`);
            console.log(`  Flags: ${metadata.flags}`);
            console.log(`  Emoji: ${metadata.emoji}`);
            console.log(`  Countries: ${metadata.countries.join(', ')}`);
            console.log(`  Points: ${metadata.pointsCount}`);
            console.log('');
          });
        }
      });
    });

    // Sort itineraries by start date (newest first)
    itineraries.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    // Write index file
    const indexData = { itineraries };
    fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2));

    console.log(
      `✅ Generated index.json with ${itineraries.length} itineraries!`
    );
    console.log(`📁 Index file: ${indexFile}`);
  } catch (error) {
    console.error('❌ Error generating index:', error);
    process.exit(1);
  }
}

// Run generation if this script is executed directly
if (require.main === module) {
  generateIndex();
}

module.exports = { generateIndex };
