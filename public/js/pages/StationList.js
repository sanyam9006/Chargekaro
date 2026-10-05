/* StationList Page */
function renderStationListPage() {
    const filtered = getFilteredStations(STATIONS);
    
    return `
    <div class="stations-page page-enter">
        <div class="stations-page-header">
            <div>
                <h1>Charging Stations</h1>
                <p class="stations-count" id="stations-count">${filtered.length} stations found</p>
            </div>
            <div style="display:flex;gap:var(--space-sm);align-items:center">
                <button class="btn btn-secondary btn-sm filter-toggle-btn" onclick="toggleFilterPanel()" style="display:none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 21V14"/><path d="M4 10V3"/><path d="M12 21V12"/><path d="M12 8V3"/><path d="M20 21V16"/><path d="M20 12V3"/><path d="M1 14h6"/><path d="M9 8h6"/><path d="M17 16h6"/></svg>
                    Filters
                </button>
                <select class="sort-select" onchange="handleSort(this.value)">
                    <option value="name">Sort by Name</option>
                    <option value="price">Sort by Price (Low)</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="wait">Sort by Wait Time</option>
                </select>
            </div>
        </div>
        <div class="stations-layout">
            ${createFilterPanel()}
            <div class="stations-grid" id="stations-grid">
                ${filtered.map((s, i) => createStationCard(s)).join('')}
            </div>
        </div>
    </div>`;
}

function handleSort(sortBy) {
    let sorted = [...getFilteredStations(STATIONS)];
    switch(sortBy) {
        case 'price':
            sorted.sort((a, b) => getMinPrice(a) - getMinPrice(b));
            break;
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'wait':
            sorted.sort((a, b) => a.waitTime - b.waitTime);
            break;
        default:
            sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    const grid = document.getElementById('stations-grid');
    if (grid) {
        grid.innerHTML = sorted.map(s => createStationCard(s)).join('');
    }
}
