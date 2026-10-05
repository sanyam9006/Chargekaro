/* MapView Component */
let mapInstance = null;
let mapMarkers = [];

function createMapView(containerId, stations, options = {}) {
    const center = options.center || [20.5937, 78.9629]; // India center
    const zoom = options.zoom || 5;

    setTimeout(() => {
        const container = document.getElementById(containerId);
        if (!container || typeof L === 'undefined') return;

        // Clean up existing map
        if (mapInstance) {
            mapInstance.remove();
            mapInstance = null;
        }

        mapInstance = L.map(containerId, {
            zoomControl: true,
            attributionControl: false
        }).setView(center, zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(mapInstance);

        addStationMarkers(stations);

        // Fix map rendering
        setTimeout(() => mapInstance.invalidateSize(), 100);
    }, 50);
}

function addStationMarkers(stations) {
    if (!mapInstance) return;

    // Clear existing
    mapMarkers.forEach(m => mapInstance.removeLayer(m));
    mapMarkers = [];

    stations.forEach(station => {
        const company = getCompany(station.company);
        const totalAvail = getTotalAvailableConnectors(station);
        const totalConn = getTotalConnectors(station);
        const minPrice = getMinPrice(station);

        // Custom icon
        const iconColor = station.status === 'offline' ? '#ef4444' : 
                          station.status === 'busy' ? '#fbbf24' : company.color;

        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                width:36px; height:36px; 
                background:${iconColor}; 
                border-radius:50% 50% 50% 4px;
                transform:rotate(-45deg);
                border:3px solid rgba(255,255,255,0.9);
                box-shadow:0 2px 10px rgba(0,0,0,0.4);
                display:flex; align-items:center; justify-content:center;
            "><svg style="transform:rotate(45deg);width:16px;height:16px" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>`,
            iconSize: [36, 36],
            iconAnchor: [4, 36],
            popupAnchor: [14, -36]
        });

        const marker = L.marker([station.lat, station.lng], { icon })
            .addTo(mapInstance)
            .bindPopup(`
                <div class="map-popup">
                    <div class="map-popup-header">
                        <div class="map-popup-badge" style="background:${company.color}">${company.shortName}</div>
                        <div>
                            <h3>${station.name}</h3>
                            <p>${station.address}</p>
                        </div>
                    </div>
                    <div class="map-popup-meta">
                        ${createStatusBadge(station.status)}
                        <span style="font-size:0.78rem;color:var(--text-secondary)">${totalAvail}/${totalConn} free</span>
                    </div>
                    <p style="font-size:0.82rem;margin-bottom:8px">
                        <strong style="color:var(--accent-green)">₹${minPrice}/kWh</strong>
                        ${station.waitTime > 0 ? ` · ~${station.waitTime} min wait` : ' · No wait'}
                    </p>
                    <a href="#/station/${station.id}" class="btn btn-primary btn-sm" style="width:100%;text-align:center">View Details</a>
                </div>
            `, { maxWidth: 280 });

        mapMarkers.push(marker);
    });
}

function updateMapMarkers(stations) {
    addStationMarkers(stations);
}

function createMiniMap(containerId, lat, lng) {
    setTimeout(() => {
        const container = document.getElementById(containerId);
        if (!container || typeof L === 'undefined') return;

        const miniMap = L.map(containerId, {
            zoomControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            attributionControl: false
        }).setView([lat, lng], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(miniMap);

        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                width:40px; height:40px;
                background: linear-gradient(135deg, #00f5a0, #00d9f5);
                border-radius:50% 50% 50% 4px;
                transform:rotate(-45deg);
                border:3px solid white;
                box-shadow:0 2px 12px rgba(0,245,160,0.4);
                display:flex; align-items:center; justify-content:center;
            "><svg style="transform:rotate(45deg);width:18px;height:18px" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>`,
            iconSize: [40, 40],
            iconAnchor: [4, 40]
        });

        L.marker([lat, lng], { icon }).addTo(miniMap);
        setTimeout(() => miniMap.invalidateSize(), 100);
    }, 100);
}
