// Initialize the map
let map;
let markers = [];
let collisionData = [];

// Initialize the map when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    loadData();
});

function initMap() {
    // Create the map centered on NYC
    map = L.map('map-container').setView([40.7128, -74.0060], 11);
    
    // Add the base tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add the legend
    const legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = `
            <h4>Collision Severity</h4>
            <div><span style="background: #e74c3c"></span>Fatal</div>
            <div><span style="background: #f39c12"></span>Severe</div>
            <div><span style="background: #3498db"></span>Minor</div>
            <div><span style="background: #2ecc71"></span>Property Damage Only</div>
        `;
        return div;
    };
    legend.addTo(map);

    // Add event listeners for filters
    document.getElementById('time-filter').addEventListener('change', updateMap);
    document.getElementById('severity-filter').addEventListener('change', updateMap);
}

async function loadData() {
    try {
        // Fetch real collision data from the JSON file
        const response = await fetch('js/data/map_data.json');
        if (!response.ok) {
            throw new Error('Failed to load map data');
        }
        
        const data = await response.json();
        
        // Transform the data to our required format
        collisionData = data.map(item => ({
            lat: item.LATITUDE,
            lng: item.LONGITUDE,
            severity: item.SEVERITY ? item.SEVERITY.toLowerCase() : 'property',
            injuries: item['NUMBER OF PERSONS INJURED'] || 0,
            fatalities: item['NUMBER OF PERSONS KILLED'] || 0,
            borough: item.BOROUGH || 'Unknown'
        }));
        
        updateMap();
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to sample data if the JSON file is not available
        collisionData = [
            {lat: 40.7128, lng: -74.0060, severity: 'fatal', borough: 'Manhattan'},
            {lat: 40.7589, lng: -73.9851, severity: 'severe', borough: 'Manhattan'},
            {lat: 40.7829, lng: -73.9654, severity: 'minor', borough: 'Manhattan'}
        ];
        updateMap();
    }
}

function updateMap() {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Get filter values
    const timeFilter = document.getElementById('time-filter').value;
    const severityFilter = document.getElementById('severity-filter').value;
    
    // Filter data based on user selection
    const filteredData = collisionData.filter(point => {
        if (severityFilter !== 'all' && point.severity !== severityFilter) {
            return false;
        }
        // Time filtering would be implemented here in a real application
        return true;
    });
    
    // Add new markers
    filteredData.forEach(point => {
        // Set color based on severity
        let color = '#2ecc71'; // Default green for property damage
        if (point.severity === 'fatal') {
            color = '#e74c3c'; // Red for fatal
        } else if (point.severity === 'severe') {
            color = '#f39c12'; // Orange for injury
        } else if (point.severity === 'minor') {
            color = '#3498db'; // Blue for minor
        }
        
        // Create marker
        const marker = L.circleMarker([point.lat, point.lng], {
            radius: 5,
            fillColor: color,
            color: '#fff',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
        
        // Add popup
        marker.bindPopup(`
            <b>Location:</b> ${point.borough}<br>
            <b>Severity:</b> ${point.severity.charAt(0).toUpperCase() + point.severity.slice(1)}<br>
            <b>Injuries:</b> ${point.injuries || 0}<br>
            <b>Fatalities:</b> ${point.fatalities || 0}
        `);
        
        markers.push(marker);
    });
} 