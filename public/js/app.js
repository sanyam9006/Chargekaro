/* ============================================
   ChargeKaro App — Router & Init (API-powered)
   ============================================ */

// Global data — populated from API
let STATIONS = [];
let COMPANIES = {};
let _dataLoaded = false;

(function() {
    const mainContent = document.getElementById('main-content');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    // ---- Load Data from API ----
    async function loadAppData() {
        if (_dataLoaded) return;
        try {
            const [stations, companies] = await Promise.all([
                API.getStations(),
                API.getCompanies()
            ]);
            STATIONS = stations;
            // Convert companies array to object keyed by id
            COMPANIES = {};
            companies.forEach(c => { COMPANIES[c.id] = c; });
            _dataLoaded = true;
        } catch (err) {
            console.error('Failed to load data from API:', err);
        }
    }

    // ---- Router ----
    async function router() {
        const hash = window.location.hash || '#/';
        const path = hash.slice(1);

        // Show loading state
        if (!_dataLoaded) {
            mainContent.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:center;min-height:60vh;flex-direction:column;gap:16px;">
                    <div class="brand-icon" style="width:48px;height:48px;animation:pulse 1.5s infinite">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <path d="M16.5 2L6 16H14L11.5 26L22 12H14L16.5 2Z" fill="url(#bolt-load)" stroke="url(#bolt-load)" stroke-width="1.5" stroke-linejoin="round"/>
                            <defs><linearGradient id="bolt-load" x1="6" y1="2" x2="22" y2="26" gradientUnits="userSpaceOnUse"><stop stop-color="#00f5a0"/><stop offset="1" stop-color="#00d9f5"/></linearGradient></defs>
                        </svg>
                    </div>
                    <p style="color:var(--text-muted);font-size:0.9rem">Loading ChargeKaro...</p>
                </div>`;
            await loadAppData();
        }

        // Clean up previous map
        if (mapInstance) {
            mapInstance.remove();
            mapInstance = null;
        }
        mapMarkers = [];

        // Scroll to top
        window.scrollTo(0, 0);

        // Route matching
        if (path === '/' || path === '') {
            mainContent.innerHTML = renderHomePage();
            setTimeout(() => initHomePage(), 50);
            updateActiveNav('home');
        } else if (path === '/stations') {
            resetFilters();
            mainContent.innerHTML = renderStationListPage();
            updateActiveNav('stations');
        } else if (path.startsWith('/station/')) {
            const id = path.split('/')[2];
            mainContent.innerHTML = renderStationPage(id);
            setTimeout(() => initStationPage(id), 50);
            updateActiveNav('');
        } else if (path === '/favorites') {
            mainContent.innerHTML = await renderFavoritesPage();
            updateActiveNav('favorites');
        } else if (path === '/about') {
            mainContent.innerHTML = renderAboutPage();
            updateActiveNav('about');
        } else {
            mainContent.innerHTML = renderHomePage();
            setTimeout(() => initHomePage(), 50);
            updateActiveNav('home');
        }
    }

    function updateActiveNav(route) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.route === route);
        });
        document.querySelectorAll('.bottom-nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.route === route);
        });
    }

    // ---- Search ----
    let searchTimeout;
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim().toLowerCase();
            
            if (query.length < 2) {
                searchResults.classList.remove('active');
                return;
            }

            searchTimeout = setTimeout(() => {
                const results = STATIONS.filter(s => {
                    return s.name.toLowerCase().includes(query) ||
                           s.city.toLowerCase().includes(query) ||
                           s.address.toLowerCase().includes(query) ||
                           getCompany(s.company).name.toLowerCase().includes(query);
                }).slice(0, 6);

                if (results.length > 0) {
                    searchResults.innerHTML = results.map(s => {
                        const company = getCompany(s.company);
                        return `
                        <div class="search-result-item" onclick="window.location.hash='/station/${s.id}'; searchResults.classList.remove('active'); searchInput.value='';">
                            <div class="search-result-company" style="background:${company.color}">${company.shortName}</div>
                            <div class="search-result-info">
                                <h4>${s.name}</h4>
                                <p>${s.city} · ${createStatusBadge(s.status)}</p>
                            </div>
                        </div>`;
                    }).join('');
                    searchResults.classList.add('active');
                } else {
                    searchResults.innerHTML = `<div class="search-result-item"><div class="search-result-info"><h4>No results found</h4><p>Try a different search term</p></div></div>`;
                    searchResults.classList.add('active');
                }
            }, 200);
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar-search')) {
                searchResults.classList.remove('active');
            }
        });
    }

    // ---- PWA Install Prompt ----
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const installPrompt = document.getElementById('install-prompt');
        if (installPrompt) installPrompt.style.display = 'block';
    });

    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
        installBtn.addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(() => {
                    deferredPrompt = null;
                    document.getElementById('install-prompt').style.display = 'none';
                });
            }
        });
    }

    const installDismiss = document.getElementById('install-dismiss');
    if (installDismiss) {
        installDismiss.addEventListener('click', () => {
            document.getElementById('install-prompt').style.display = 'none';
        });
    }

    // ---- Navbar scroll effect ----
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.boxShadow = 'none';
        }
        lastScroll = scrollY;
    });

    // ---- Init ----
    window.addEventListener('hashchange', router);
    window.addEventListener('DOMContentLoaded', router);
    
    if (document.readyState !== 'loading') {
        router();
    }
})();
