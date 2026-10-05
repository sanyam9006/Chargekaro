/* StationPage */
function renderStationPage(stationId) {
    const station = getStationById(stationId);
    if (!station) {
        return `
        <div class="station-detail page-enter" style="text-align:center;padding:var(--space-3xl)">
            <h2>Station Not Found</h2>
            <p style="color:var(--text-muted);margin:var(--space-lg)">The station you're looking for doesn't exist.</p>
            <a href="#/stations" class="btn btn-primary">Browse Stations</a>
        </div>`;
    }
    return createStationDetail(station);
}

function initStationPage(stationId) {
    const station = getStationById(stationId);
    if (station) {
        createMiniMap('detail-mini-map', station.lat, station.lng);
        // Load reviews from API
        loadReviews(parseInt(stationId));
    }
}
