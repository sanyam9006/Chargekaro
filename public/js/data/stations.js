/* ============================================
   Data Helper Functions (API-compatible)
   These work with the global STATIONS/COMPANIES
   that are populated from the API at startup
   ============================================ */

// Helper functions
function getFavorites() {
    // Maintained locally for instant UI, synced with server
    try {
        return JSON.parse(localStorage.getItem('chargekaro_favorites') || '[]');
    } catch {
        return [];
    }
}

function toggleFavorite(stationId) {
    let favorites = getFavorites();
    if (favorites.includes(stationId)) {
        favorites = favorites.filter(id => id !== stationId);
        // Sync with server (fire and forget)
        API.removeFavorite(stationId).catch(() => {});
    } else {
        favorites.push(stationId);
        API.addFavorite(stationId).catch(() => {});
    }
    localStorage.setItem('chargekaro_favorites', JSON.stringify(favorites));
    return favorites;
}

function isFavorite(stationId) {
    return getFavorites().includes(stationId);
}

function getStationById(id) {
    return STATIONS.find(s => s.id === parseInt(id));
}

function getCompany(companyId) {
    return COMPANIES[companyId] || { name: companyId, shortName: '??', color: '#666' };
}

function getTotalAvailableConnectors(station) {
    return station.connectors.reduce((sum, c) => sum + c.available, 0);
}

function getTotalConnectors(station) {
    return station.connectors.reduce((sum, c) => sum + c.count, 0);
}

function getMinPrice(station) {
    return Math.min(...station.connectors.map(c => c.price));
}

function getMaxPower(station) {
    return Math.max(...station.connectors.map(c => c.power));
}

function getConnectorTypes(station) {
    return [...new Set(station.connectors.map(c => c.type))];
}

function getAllCities() {
    return [...new Set(STATIONS.map(s => s.city))].sort();
}

function getAllConnectorTypes() {
    return [...new Set(STATIONS.flatMap(s => s.connectors.map(c => c.type)))].sort();
}
