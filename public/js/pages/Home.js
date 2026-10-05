/* Home Page */
function renderHomePage() {
    const availableCount = STATIONS.filter(s => s.status === 'available').length;
    const companies = Object.keys(COMPANIES);
    const cities = getAllCities();

    return `
    <div class="home-page page-enter">
        <!-- Hero -->
        <section class="hero-section">
            <div class="hero-content">
                <div class="hero-badge">
                    <span class="pulse-dot"></span>
                    All India EV Charging Network
                </div>
                <h1 class="hero-title">
                    One App.<br>
                    <span class="gradient-text">Every Charger.</span><br>
                    Zero Hassle.
                </h1>
                <p class="hero-subtitle">
                    Stop downloading 20+ apps. ChargeKaro finds every EV charging station near you — 
                    <strong>${companies.length} networks</strong>, real-time availability, wait times & pricing. Just charge and go.
                </p>
                <div class="hero-search">
                    <svg style="margin-left:16px;color:var(--text-muted)" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <input type="text" id="hero-search-input" placeholder="Search by city, station, or company..." oninput="handleHeroSearch(this.value)">
                    <a href="#/stations" class="btn btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        <span>Find Chargers</span>
                    </a>
                </div>
                <div class="hero-stats">
                    <div class="hero-stat">
                        <div class="hero-stat-value">${STATIONS.length}+</div>
                        <div class="hero-stat-label">Charging Stations</div>
                    </div>
                    <div class="hero-stat">
                        <div class="hero-stat-value">${companies.length}</div>
                        <div class="hero-stat-label">Networks</div>
                    </div>
                    <div class="hero-stat">
                        <div class="hero-stat-value">${cities.length}</div>
                        <div class="hero-stat-label">Cities</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Map -->
        <section class="map-section">
            <div class="map-section-header">
                <h2>Nearby Stations</h2>
                <a href="#/stations" class="btn btn-secondary btn-sm">View All →</a>
            </div>
            <div class="map-wrapper" id="home-map"></div>
        </section>

        <!-- Companies -->
        <section class="companies-section">
            <h2>All ${companies.length} Networks, <span class="gradient-text">One App</span></h2>
            <div class="companies-grid">
                ${companies.map(key => {
                    const c = COMPANIES[key];
                    const count = STATIONS.filter(s => s.company === key).length;
                    return `
                    <a href="#/stations" class="company-chip" onclick="setTimeout(()=>{document.querySelectorAll('[data-filter=\\'companies\\'][data-value=\\'${key}\\']').forEach(b=>{if(!b.classList.contains('active'))b.click()})},100)">
                        <div class="company-chip-logo" style="background:${c.color}">${c.shortName}</div>
                        <div>
                            <div class="company-chip-name">${c.name}</div>
                            <div class="company-chip-count">${count} stations</div>
                        </div>
                    </a>`;
                }).join('')}
            </div>
        </section>

        <!-- Features -->
        <section class="features-section">
            <h2>Why <span class="gradient-text">ChargeKaro</span>?</h2>
            <p>We solve the biggest pain point for EV owners in India</p>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🗺️</div>
                    <h3>Find Any Charger</h3>
                    <p>All ${companies.length}+ Indian EV charging networks on one interactive map. No more switching between apps.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <h3>Real-Time Status</h3>
                    <p>See which chargers are available, busy, or offline right now. Know the wait time before you drive there.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💰</div>
                    <h3>Compare Prices</h3>
                    <p>No more ₹300 minimum recharge surprises. Compare per-kWh pricing across all networks instantly.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔌</div>
                    <h3>Connector Match</h3>
                    <p>Filter by CCS2, CHAdeMO, Type 2, or AC. Find exact compatible chargers for your EV model.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🧭</div>
                    <h3>One-Tap Navigate</h3>
                    <p>Get instant directions to any charging station via Google Maps. No copy-pasting addresses.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <h3>Works Like an App</h3>
                    <p>Install ChargeKaro on your phone's home screen. Works offline, loads instantly — no app store needed.</p>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="footer">
            <div class="footer-content">
                <div class="footer-brand">
                    <div class="brand-icon" style="width:32px;height:32px">
                        <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                            <path d="M16.5 2L6 16H14L11.5 26L22 12H14L16.5 2Z" fill="url(#bolt-grad3)" stroke="url(#bolt-grad3)" stroke-width="1.5" stroke-linejoin="round"/>
                            <defs><linearGradient id="bolt-grad3" x1="6" y1="2" x2="22" y2="26"><stop stop-color="#00f5a0"/><stop offset="1" stop-color="#00d9f5"/></linearGradient></defs>
                        </svg>
                    </div>
                    <span class="brand-text">Charge<span class="brand-accent">Karo</span></span>
                </div>
                <div class="footer-text">© 2026 ChargeKaro. Made with ⚡ for India's EV revolution.</div>
                <div class="footer-links">
                    <a href="#/about">About</a>
                    <a href="#/stations">Stations</a>
                    <a href="#/favorites">Favorites</a>
                </div>
            </div>
        </footer>
    </div>`;
}

function handleHeroSearch(value) {
    if (value.length > 1) {
        window.location.hash = '/stations';
    }
}

function initHomePage() {
    createMapView('home-map', STATIONS, { center: [20.5937, 78.9629], zoom: 5 });
}
