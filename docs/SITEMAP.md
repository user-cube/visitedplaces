# Sitemap for Google Search

This document explains how the sitemap is set up for the visitedplaces.com website to help Google Search index all content properly.

## Files Created

### 1. Static Sitemap (`public/sitemap.xml`)

- **Location**: `/public/sitemap.xml`
- **Purpose**: Static XML sitemap that lists all URLs
- **Content**: All main pages, itineraries, and galleries
- **URL**: `https://visitedplaces.com/sitemap.xml`

### 2. Robots.txt (`public/robots.txt`)

- **Location**: `/public/robots.txt`
- **Purpose**: Tells search engines about the sitemap location
- **URL**: `https://visitedplaces.com/robots.txt`

### 3. Generation Script (`scripts/generate-sitemap.js`)

- **Location**: `/scripts/generate-sitemap.js`
- **Purpose**: Automatically generates sitemap from data files
- **Command**: `npm run generate-sitemap`

## How to Use

### Automatic Generation

The sitemap is automatically generated from your data files:

```bash
npm run generate-sitemap
```

This will:

- Read `/public/data/itineraries/index.json`
- Read `/public/data/galleries/index.json`
- Generate `/public/sitemap.xml` with current date
- Show statistics of URLs included

### Manual Updates

When you add new itineraries or galleries:

1. Add the new data to the respective JSON files
2. Run `npm run generate-sitemap`
3. The sitemap will be updated automatically

### Google Search Console

To submit your sitemap to Google:

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (visitedplaces.com)
3. Go to "Sitemaps" section
4. Submit: `https://visitedplaces.com/sitemap.xml`

## Sitemap Structure

The sitemap includes:

### Main Pages (Priority: 1.0)

- Homepage (`/`)
- Itineraries index (`/itineraries`)
- Galleries index (`/galleries`)

### Itineraries (Priority: 0.8)

- All individual itinerary pages
- Example: `/itineraries/athens-2025`

### Galleries (Priority: 0.7)

- All individual gallery pages
- Example: `/galleries/athens`

## SEO Benefits

1. **Better Indexing**: Google will discover all your pages
2. **Faster Crawling**: Search engines know your site structure
3. **Priority Indication**: Important pages get higher priority
4. **Update Frequency**: Tells Google how often content changes

## Maintenance

- The sitemap automatically includes all itineraries and galleries
- Run `npm run generate-sitemap` after adding new content
- The static sitemap is simple and efficient

## Testing

You can test the sitemap by visiting:

- `https://visitedplaces.com/sitemap.xml` (static)
- `https://visitedplaces.com/robots.txt` (robots file)

The sitemap should be valid XML and include all your content URLs.
