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
            <div><span style="background: #f39c12"></span>Injury</div>
            <div><span style="background: #3498db"></span>Property Damage</div>
        `;
        return div;
    };
    legend.addTo(map);
}

async function loadData() {
    try {
        // In a real implementation, this would be an API call or data file
        // For now, we'll use sample data
        collisionData = [
            {lat: 40.7128, lng: -74.0060, severity: 'fatal', time: '2024-01-01 14:30'},
            {lat: 40.7589, lng: -73.9851, severity: 'injury', time: '2024-01-01 15:45'},
            {lat: 40.7829, lng: -73.9654, severity: 'property', time: '2024-01-01 16:20'}
        ];
        
        updateMap();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function updateMap() {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Get current filters
    const timeFilter = document.getElementById('time-filter').value;
    const severityFilter = document.getElementById('severity-filter').value;

    // Filter and add markers
    collisionData.forEach(collision => {
        if (shouldShowCollision(collision, timeFilter, severityFilter)) {
            const marker = L.circleMarker([collision.lat, collision.lng], {
                radius: 8,
                fillColor: getSeverityColor(collision.severity),
                color: '#fff',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });

            marker.bindPopup(createPopupContent(collision));
            marker.addTo(map);
            markers.push(marker);
        }
    });
}

function shouldShowCollision(collision, timeFilter, severityFilter) {
    // Time filter logic
    if (timeFilter !== 'all') {
        const hour = new Date(collision.time).getHours();
        if (timeFilter === 'morning' && (hour < 6 || hour >= 12)) return false;
        if (timeFilter === 'afternoon' && (hour < 12 || hour >= 18)) return false;
        if (timeFilter === 'evening' && (hour < 18 || hour >= 24)) return false;
        if (timeFilter === 'night' && (hour >= 6 && hour < 24)) return false;
    }

    // Severity filter logic
    if (severityFilter !== 'all' && collision.severity !== severityFilter) {
        return false;
    }

    return true;
}

function getSeverityColor(severity) {
    switch(severity) {
        case 'fatal': return '#e74c3c';
        case 'injury': return '#f39c12';
        case 'property': return '#3498db';
        default: return '#95a5a6';
    }
}

function createPopupContent(collision) {
    return `
        <div class="popup-content">
            <h3>Collision Details</h3>
            <p><strong>Time:</strong> ${collision.time}</p>
            <p><strong>Severity:</strong> ${collision.severity}</p>
        </div>
    `;
}

// Add event listeners for filters
document.getElementById('time-filter').addEventListener('change', updateMap);
document.getElementById('severity-filter').addEventListener('change', updateMap); 