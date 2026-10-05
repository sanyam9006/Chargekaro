/* FilterPanel Component */
let activeFilters = {
    companies: [],
    connectors: [],
    status: [],
    minPower: 0
};

function createFilterPanel() {
    const companyKeys = Object.keys(COMPANIES);
    const connectorTypes = getAllConnectorTypes();

    return `
    <div class="filter-panel" id="filter-panel">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg)">
            <h3 style="font-size:1rem;font-weight:700">Filters</h3>
            <button onclick="resetFilters()" style="font-size:0.78rem;color:var(--accent-green);font-weight:600">Reset All</button>
        </div>

        <div class="filter-section">
            <h4>Status</h4>
            <div class="filter-chips">
                <button class="filter-chip" data-filter="status" data-value="available" onclick="toggleFilter('status','available',this)">✅ Available</button>
                <button class="filter-chip" data-filter="status" data-value="busy" onclick="toggleFilter('status','busy',this)">⏳ Busy</button>
                <button class="filter-chip" data-filter="status" data-value="offline" onclick="toggleFilter('status','offline',this)">🔴 Offline</button>
            </div>
        </div>

        <div class="filter-section">
            <h4>Connector Type</h4>
            <div class="filter-chips">
                ${connectorTypes.map(type => `
                    <button class="filter-chip" data-filter="connectors" data-value="${type}" onclick="toggleFilter('connectors','${type}',this)">${type}</button>
                `).join('')}
            </div>
        </div>

        <div class="filter-section">
            <h4>Network</h4>
            <div class="filter-chips">
                ${companyKeys.map(key => {
                    const c = COMPANIES[key];
                    return `<button class="filter-chip" data-filter="companies" data-value="${key}" onclick="toggleFilter('companies','${key}',this)">
                        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${c.color};margin-right:4px"></span>
                        ${c.name}
                    </button>`;
                }).join('')}
            </div>
        </div>

        <div class="filter-section">
            <h4>Min Charging Speed</h4>
            <div class="filter-chips">
                <button class="filter-chip" data-filter="power" data-value="0" onclick="setPowerFilter(0,this)">All</button>
                <button class="filter-chip" data-filter="power" data-value="22" onclick="setPowerFilter(22,this)">22+ kW</button>
                <button class="filter-chip" data-filter="power" data-value="50" onclick="setPowerFilter(50,this)">50+ kW</button>
                <button class="filter-chip" data-filter="power" data-value="100" onclick="setPowerFilter(100,this)">100+ kW</button>
            </div>
        </div>
    </div>`;
}

function toggleFilter(category, value, btn) {
    const idx = activeFilters[category].indexOf(value);
    if (idx === -1) {
        activeFilters[category].push(value);
        btn.classList.add('active');
    } else {
        activeFilters[category].splice(idx, 1);
        btn.classList.remove('active');
    }
    applyFilters();
}

function setPowerFilter(power, btn) {
    activeFilters.minPower = power;
    document.querySelectorAll('[data-filter="power"]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
}

function resetFilters() {
    activeFilters = { companies: [], connectors: [], status: [], minPower: 0 };
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    applyFilters();
}

function getFilteredStations(stations) {
    return stations.filter(station => {
        if (activeFilters.status.length > 0 && !activeFilters.status.includes(station.status)) return false;
        if (activeFilters.companies.length > 0 && !activeFilters.companies.includes(station.company)) return false;
        if (activeFilters.connectors.length > 0) {
            const stationTypes = getConnectorTypes(station);
            if (!activeFilters.connectors.some(t => stationTypes.includes(t))) return false;
        }
        if (activeFilters.minPower > 0 && getMaxPower(station) < activeFilters.minPower) return false;
        return true;
    });
}

function applyFilters() {
    const filtered = getFilteredStations(STATIONS);
    const grid = document.getElementById('stations-grid');
    if (grid) {
        grid.innerHTML = filtered.length > 0 
            ? filtered.map(s => createStationCard(s)).join('')
            : `<div class="stations-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
                <h3>No stations match your filters</h3>
                <p>Try adjusting your filter criteria</p>
               </div>`;
    }
    const count = document.getElementById('stations-count');
    if (count) count.textContent = `${filtered.length} stations found`;
}

function toggleFilterPanel() {
    const panel = document.getElementById('filter-panel');
    if (panel) panel.classList.toggle('open');
}
