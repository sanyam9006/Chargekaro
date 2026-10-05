/* Favorites Page (API-powered) */
async function renderFavoritesPage() {
    let favStations = [];
    try {
        favStations = await API.getFavorites();
    } catch {
        // Fallback to localStorage
        const favIds = getFavorites();
        favStations = STATIONS.filter(s => favIds.includes(s.id));
    }

    return `
    <div class="favorites-page page-enter">
        <h1>Saved Stations <span class="gradient-text">(${favStations.length})</span></h1>
        ${favStations.length > 0 ? `
            <div class="favorites-grid">
                ${favStations.map(s => createStationCard(s)).join('')}
            </div>
        ` : `
            <div class="favorites-empty">
                <div class="favorites-empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </div>
                <h3>No saved stations yet</h3>
                <p>Tap the heart icon on any station to save it for quick access</p>
                <a href="#/stations" class="btn btn-primary">Browse Stations</a>
            </div>
        `}
    </div>`;
}
