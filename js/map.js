// Initialize the map
function initMap() {
    const map = L.map('map-container').setView([40.7128, -74.0060], 11);
    
    // Add the base tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add a placeholder for collision data
    const info = L.control();
    info.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    info.update = function(props) {
        this._div.innerHTML = '<h4>NYC Collisions</h4>' + 
            (props ? '<b>' + props.name + '</b><br />' + props.density + ' collisions'
            : 'Hover over a neighborhood');
    }
} 