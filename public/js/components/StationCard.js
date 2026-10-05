/* StationCard Component */
function createStationCard(station) {
    const company = getCompany(station.company);
    const fav = isFavorite(station.id);
    const totalAvail = getTotalAvailableConnectors(station);
    const totalConn = getTotalConnectors(station);
    const minPrice = getMinPrice(station);
    const maxPower = getMaxPower(station);
    const connectorTypes = getConnectorTypes(station);

    return `
    <div class="station-card animate-in" data-station-id="${station.id}" onclick="window.location.hash='/station/${station.id}'">
        <div class="station-card-header">
            <div class="station-company-badge" style="background:${company.color}">${company.shortName}</div>
            <div class="station-card-title">
                <h3>${station.name}</h3>
                <p>${station.address}</p>
            </div>
            <button class="station-card-favorite ${fav ? 'is-favorite' : ''}" onclick="event.stopPropagation(); handleFavoriteClick(${station.id}, this)" aria-label="Toggle favorite">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${fav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
        </div>
        <div class="station-card-meta">
            ${createStatusBadge(station.status)}
            <span class="meta-tag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                ${maxPower} kW
            </span>
            <span class="meta-tag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                ${station.operatingHours}
            </span>
            ${connectorTypes.map(t => `<span class="meta-tag">${t}</span>`).join('')}
        </div>
        <div class="station-card-footer">
            <div>
                <span class="station-price gradient-text">₹${minPrice}/kWh</span>
                <span style="font-size:0.75rem;color:var(--text-muted);margin-left:8px">${totalAvail}/${totalConn} slots</span>
            </div>
            <div class="station-wait">
                ${station.waitTime > 0 ? `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    ~${station.waitTime} min wait
                ` : `
                    <span style="color:var(--status-available)">No wait</span>
                `}
            </div>
        </div>
    </div>`;
}

function handleFavoriteClick(stationId, btn) {
    toggleFavorite(stationId);
    const fav = isFavorite(stationId);
    btn.className = `station-card-favorite ${fav ? 'is-favorite' : ''}`;
    btn.querySelector('svg').setAttribute('fill', fav ? 'currentColor' : 'none');
    
    // Animate
    btn.style.transform = 'scale(1.3)';
    setTimeout(() => btn.style.transform = '', 200);
}
