// Initialize the map
const map = L.map('map').setView([20, 0], 2);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Highlight visited countries
fetch('data/visited.json')
    .then(response => response.json())
    .then(data => {
        data.countries.forEach(country => {
            L.geoJSON(country.geometry, {
                style: {
                    color: 'blue',
                    weight: 1,
                    fillColor: 'blue',
                    fillOpacity: 0.5
                }
            }).addTo(map);
        });
    })
    .catch(error => console.error('Error loading visited countries:', error));
