/*
  Quick validator for itinerary point coordinates.
  - Flags invalid arrays
  - Flags obviously swapped lat/lng (lat outside [-90,90], lng outside [-180,180])
  - Flags points far from the itinerary centroid (> 500km)

  Usage: node scripts/validate-coordinates.js
*/

const fs = require('fs');
const path = require('path');

function haversineKm([lat1, lon1], [lat2, lon2]) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function validateItinerary(itineraryPath) {
  const data = JSON.parse(fs.readFileSync(itineraryPath, 'utf8'));
  const errors = [];
  const warnings = [];

  const latLngs = [];
  for (const [idx, p] of data.points.entries()) {
    if (!Array.isArray(p.coordinates) || p.coordinates.length !== 2) {
      errors.push(
        `${path.basename(itineraryPath)} [${idx}] ${p.name}: invalid coordinates array`
      );
      continue;
    }
    const [lng, lat] = p.coordinates;
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      errors.push(
        `${path.basename(itineraryPath)} [${idx}] ${p.name}: non-number coordinates`
      );
      continue;
    }
    // Obvious swap checks
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      warnings.push(
        `${path.basename(itineraryPath)} [${idx}] ${p.name}: lat/lng out of bounds (possible swap) → [${lng}, ${lat}]`
      );
    }
    latLngs.push([lat, lng]);
  }

  if (latLngs.length > 0) {
    const avgLat = latLngs.reduce((a, b) => a + b[0], 0) / latLngs.length;
    const avgLng = latLngs.reduce((a, b) => a + b[1], 0) / latLngs.length;
    const centroid = [avgLat, avgLng];
    latLngs.forEach(([lat, lng], i) => {
      const d = haversineKm([lat, lng], centroid);
      if (d > 500) {
        warnings.push(
          `${path.basename(itineraryPath)} [${i}] far from centroid (~${d.toFixed(0)} km)`
        );
      }
    });
  }

  return { errors, warnings };
}

function main() {
  const base = path.join(process.cwd(), 'public', 'data', 'itineraries');
  const yearDirs = fs
    .readdirSync(base)
    .filter(d => fs.statSync(path.join(base, d)).isDirectory());

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const year of yearDirs) {
    const yearPath = path.join(base, year);
    const entries = fs.readdirSync(yearPath);
    for (const entry of entries) {
      const entryPath = path.join(yearPath, entry);
      if (fs.statSync(entryPath).isDirectory()) {
        const files = fs
          .readdirSync(entryPath)
          .filter(f => f.endsWith('.json'));
        for (const f of files) {
          const fp = path.join(entryPath, f);
          const { errors, warnings } = validateItinerary(fp);
          errors.forEach(e => console.error('ERROR:', e));
          warnings.forEach(w => console.warn('WARN :', w));
          totalErrors += errors.length;
          totalWarnings += warnings.length;
        }
      }
    }
  }

  console.log(`\nSummary: ${totalErrors} errors, ${totalWarnings} warnings`);
  process.exit(totalErrors > 0 ? 1 : 0);
}

if (require.main === module) {
  main();
}
