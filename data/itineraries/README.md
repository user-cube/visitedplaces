# Itineraries Structure

This directory contains all travel itineraries organized by year and individual files.

## Structure

```
data/itineraries/
├── index.json              # Central index with metadata for all itineraries
├── README.md               # This file
└── 2025/                   # Year-based directories
    └── budapeste-and-vienna.json  # Individual itinerary files
```

## File Organization

### Index File (`index.json`)

The central index file contains metadata for all itineraries without the full details:

```json
{
  "itineraries": [
    {
      "id": "budapest-vienna-2025",
      "title": "Budapeste and Vienna",
      "startDate": "2025-02-26",
      "endDate": "2025-03-02",
      "description": "5-day trip from Porto to Budapest and Vienna",
      "file": "2025/budapeste-and-vienna.json"
    }
  ]
}
```

### Individual Itinerary Files

Each itinerary is stored in its own JSON file with the complete data including all points of interest.

### Naming Convention

- **Directories**: Year-based (e.g., `2025/`, `2024/`)
- **Files**: Sanitized title with hyphens (e.g., `budapeste-and-vienna.json`)

## Benefits

1. **Better Organization**: Itineraries are organized by year
2. **Easier Management**: Individual files are easier to edit and maintain
3. **Performance**: Only load itineraries when needed
4. **Scalability**: Easy to add new itineraries without affecting existing ones
5. **Version Control**: Better diff tracking for individual changes

## Adding New Itineraries

1. Create a new JSON file in the appropriate year directory
2. Add the metadata to `index.json`
3. Follow the naming convention: `year/sanitized-title.json`

## Migration

The old single-file structure has been migrated to this new structure. A backup of the original file is available at `data/itineraries.json.backup`.

## Utilities

The application includes utilities in `src/utils/itineraryUtils.ts` for:

- Loading all itineraries
- Loading specific itineraries by ID
- Getting itinerary metadata
- Generating filenames
- Managing the file structure
