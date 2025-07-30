# Visited Places - Modular Structure

This project has been refactored to follow a modular and organized architecture, separating responsibilities and facilitating maintenance.

## File Structure

### 📁 `types/`
- **`index.ts`** - All TypeScript interfaces and types centralized
- **`json.d.ts`** - Type declarations for JSON files

### 📁 `components/`
Modular and reusable React components:

- **`Map.tsx`** - Main map component (now simplified)
- **`MapControls.tsx`** - Map controls panel
- **`MapStyleSelector.tsx`** - Map style selector
- **`ColorSchemeSelector.tsx`** - Color scheme selector
- **`RecenterButton.tsx`** - Map recenter button
- **`CountryLayer.tsx`** - Country rendering layer
- **`CityMarkers.tsx`** - City markers
- **`SimpleGallery.tsx`** - Photo gallery

### 📁 `hooks/`
Custom hooks for state management:

- **`useMapState.ts`** - Map state management
- **`useRecenter.ts`** - Recenter function management

### 📁 `utils/`
Utilities and business logic:

- **`countryData.ts`** - Country data loading and processing

### 📁 `constants/`
Constants and configurations:

- **`mapConfig.ts`** - Map configurations and styles

## Refactoring Benefits

### ✅ **Separation of Concerns**
- Each component has a specific responsibility
- Business logic separated from presentation
- Centralized configurations

### ✅ **Reusability**
- Modular components can be reused
- Custom hooks facilitate logic sharing
- Centralized types prevent duplication

### ✅ **Maintainability**
- Code easier to understand and modify
- Isolated changes in specific components
- More focused tests

### ✅ **Performance**
- Smaller components render faster
- Optimized hooks to avoid unnecessary re-renders
- Lazy loading of heavy components

### ✅ **Scalability**
- Easy addition of new features
- Structure prepared for growth
- Consistent patterns

## How to Use

### Adding a New Map Style
1. Add the style in `types/index.ts` (MAP_STYLES)
2. Update the preview in `MapStyleSelector.tsx`

### Adding a New Color Scheme
1. Add the scheme in `types/index.ts` (COLOR_SCHEMES)
2. The `ColorSchemeSelector.tsx` will be automatically updated

### Adding a New Component
1. Create the component in `components/`
2. Add necessary types in `types/index.ts`
3. Import and use in the parent component

## Patterns Used

- **Composition Pattern** - Components composed of smaller ones
- **Custom Hooks** - Encapsulated reusable logic
- **Type Safety** - Strict TypeScript to prevent errors
- **Separation of Concerns** - Each file has a clear responsibility
- **Configuration as Code** - Configurations as TypeScript constants 