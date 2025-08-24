const fs = require('fs');
const path = require('path');

// Read the data files
const itinerariesData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../public/data/itineraries/index.json'),
    'utf8'
  )
);
const galleriesData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../public/data/galleries/index.json'),
    'utf8'
  )
);

// Get current date for lastmod
const currentDate = new Date().toISOString().split('T')[0];

// Base URL
const baseUrl = 'https://visitedplaces.com';

// Generate sitemap XML
function generateSitemap() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Main pages
  xml += '  <!-- Main pages -->\n';
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/</loc>\n`;
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n\n`;

  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/itineraries</loc>\n`;
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.9</priority>\n`;
  xml += `  </url>\n\n`;

  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/galleries</loc>\n`;
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.9</priority>\n`;
  xml += `  </url>\n\n`;

  // Itineraries
  xml += '  <!-- Itineraries -->\n';
  itinerariesData.itineraries.forEach(itinerary => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/itineraries/${itinerary.id}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n\n`;
  });

  // Galleries
  xml += '  <!-- Galleries -->\n';
  galleriesData.galleries.forEach(gallery => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/galleries/${gallery.id}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n\n`;
  });

  xml += '</urlset>';

  return xml;
}

// Write the sitemap
const sitemapContent = generateSitemap();
fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemapContent);

console.log('✅ Sitemap generated successfully!');
console.log(
  `📊 Total URLs: ${1 + 2 + itinerariesData.itineraries.length + galleriesData.galleries.length}`
);
console.log(`🗺️  Itineraries: ${itinerariesData.itineraries.length}`);
console.log(`📸 Galleries: ${galleriesData.galleries.length}`);
