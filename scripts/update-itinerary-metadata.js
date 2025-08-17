const fs = require('fs');
const path = require('path');

/**
 * Script to update itinerary metadata automatically
 */

const itinerariesDir = path.join(__dirname, '../public/data/itineraries');

// Country to flag mapping (same as in the TypeScript file)
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
  Andorra: '🏔️',
};

function extractCountriesFromItinerary(itinerary) {
  const countries = new Set();

  itinerary.points.forEach(point => {
    // Try to extract country from address
    const addressParts = point.address.split(',').map(part => part.trim());
    const lastPart = addressParts[addressParts.length - 1];

    if (lastPart && COUNTRY_FLAGS[lastPart]) {
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

function generateItineraryMetadata(itinerary) {
  const countries = extractCountriesFromItinerary(itinerary);

  return {
    flags: generateFlagsFromCountries(countries),
    emoji: generateEmojiFromCountries(countries),
    countries,
  };
}

function updateItineraryMetadata() {
  try {
    console.log('🔄 Updating itinerary metadata...');

    // Get all year directories
    const yearDirs = fs.readdirSync(itinerariesDir).filter(item => {
      const itemPath = path.join(itinerariesDir, item);
      return fs.statSync(itemPath).isDirectory() && /^\d{4}$/.test(item);
    });

    let updatedCount = 0;

    yearDirs.forEach(year => {
      const yearDir = path.join(itinerariesDir, year);
      const files = fs
        .readdirSync(yearDir)
        .filter(file => file.endsWith('.json'));

      files.forEach(file => {
        const filePath = path.join(yearDir, file);
        const itinerary = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Generate metadata if it doesn't exist or force update
        const metadata = generateItineraryMetadata(itinerary);

        // Update the itinerary
        itinerary.metadata = metadata;

        // Write back to file
        fs.writeFileSync(filePath, JSON.stringify(itinerary, null, 2));

        console.log(`✓ Updated: ${year}/${file}`);
        console.log(`  Flags: ${metadata.flags}`);
        console.log(`  Emoji: ${metadata.emoji}`);
        console.log(`  Countries: ${metadata.countries.join(', ')}`);
        console.log('');

        updatedCount++;
      });
    });

    console.log(`✅ Updated metadata for ${updatedCount} itineraries!`);
  } catch (error) {
    console.error('❌ Error updating itinerary metadata:', error);
    process.exit(1);
  }
}

// Run update if this script is executed directly
if (require.main === module) {
  updateItineraryMetadata();
}

module.exports = { updateItineraryMetadata };
