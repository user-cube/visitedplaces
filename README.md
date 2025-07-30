# Visited Places 🌍

An interactive world map application that displays countries and cities you've visited, with photo galleries and customizable map styles.

## ✨ Features

- **Interactive World Map**: Built with Leaflet.js and React-Leaflet
- **Country Highlights**: Visited countries are highlighted with customizable color schemes
- **City Markers**: Click on cities to view photo galleries
- **Multiple Map Styles**: Choose from 6 different map styles (Standard, Dark, Light, Satellite, Terrain, Vintage)
- **Color Schemes**: 6 different color schemes for country highlighting
- **Photo Galleries**: View photos for each visited city
- **Responsive Design**: Works on desktop and mobile devices
- **Automatic Deployment**: CI/CD pipeline with semantic versioning

## 🛠️ Technologies

- **Frontend**: Next.js 15, React 19, TypeScript
- **Mapping**: Leaflet.js, React-Leaflet
- **Styling**: Tailwind CSS
- **Data**: GeoJSON for country boundaries
- **Deployment**: GitHub Pages with GitHub Actions
- **Versioning**: Semantic Release

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/user-cube/visitedplaces.git
   cd visitedplaces
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
visitedplaces/
├── src/
│   ├── components/
│   │   ├── Map.tsx          # Main map component
│   │   ├── PhotoGallery.tsx # Photo gallery modal
│   │   └── SimpleGallery.tsx
│   ├── pages/
│   │   ├── _app.tsx         # App wrapper
│   │   └── index.tsx        # Home page
│   ├── styles/
│   │   └── globals.css      # Global styles
│   └── types/
│       └── json.d.ts        # TypeScript definitions
├── data/
│   └── visited.json         # Visited places data
├── public/
│   └── countries-features.json # Country GeoJSON data
└── .github/workflows/       # CI/CD pipelines
```

## 📊 Data Format

The application uses a JSON file to store visited places data:

```json
{
  "cities": [
    {
      "city": "Paris",
      "country": "France",
      "coordinates": [48.8566, 2.3522],
      "photos": ["photo1.jpg", "photo2.jpg"]
    }
  ]
}
```

## 🎨 Customization

### Map Styles
- **Standard**: OpenStreetMap tiles
- **Dark**: Dark theme from CartoDB
- **Light**: Light theme from CartoDB
- **Satellite**: Satellite imagery from Esri
- **Terrain**: Topographic maps from OpenTopoMap
- **Vintage**: Watercolor style from Stamen

### Color Schemes
- **Green**: Green countries with red cities
- **Blue**: Blue countries with red cities
- **Purple**: Purple countries with orange cities
- **Orange**: Orange countries with green cities
- **Red**: Red countries with green cities
- **Teal**: Teal countries with red cities

## 🚀 Deployment

The application is automatically deployed to GitHub Pages using GitHub Actions:

1. **Semantic Release**: Automatically creates releases based on commit messages
2. **Build & Deploy**: Builds the Next.js app and deploys to GitHub Pages

### Commit Convention

Use conventional commits for automatic versioning:

```bash
git commit -m "feat: add new map style"
git commit -m "fix: resolve container sizing issue"
git commit -m "docs: update README"
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request