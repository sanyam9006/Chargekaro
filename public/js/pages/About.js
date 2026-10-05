/* About Page */
function renderAboutPage() {
    const companyNames = Object.values(COMPANIES).map(c => c.name);

    return `
    <div class="about-page page-enter">
        <div class="about-hero">
            <h1>About <span class="gradient-text">ChargeKaro</span></h1>
            <p>
                India has 20+ different EV charging networks — each with its own app, its own wallet, 
                and a minimum recharge of ₹300. We think that's broken. ChargeKaro brings every charger 
                to one place, so you can just find the nearest one and charge.
            </p>
        </div>

        <div class="about-section">
            <h2>🎯 The Problem</h2>
            <p>
                Every EV charging station in India requires you to download their specific app. With companies 
                like Tata Power, Ather Grid, ChargeZone, Statiq, Kazam, Jio-bp, and many more — that's potentially 
                20+ apps on your phone, each with its own registration, wallet, and minimum recharge requirements.
            </p>
            <p>
                You pull up to a station and realize you don't have their app. You download it, register, add ₹300 
                to a wallet you'll rarely use again, and finally start charging. That's not a good experience.
            </p>
        </div>

        <div class="about-section">
            <h2>💡 Our Solution</h2>
            <p>
                ChargeKaro is a single app that aggregates <strong>every</strong> EV charging station in India. 
                Find the nearest charger from any network, check real-time availability and wait times, compare 
                pricing, and navigate there — all without switching between apps.
            </p>
        </div>

        <div class="about-section">
            <h2>🔌 Supported Networks</h2>
            <p>We aggregate data from all major Indian EV charging networks:</p>
            <div class="about-networks">
                ${companyNames.map(name => `<span class="about-network-tag">${name}</span>`).join('')}
                <span class="about-network-tag" style="border-color:var(--accent-green);color:var(--accent-green)">+ More coming</span>
            </div>
        </div>

        <div class="about-section">
            <h2>📱 Install on Your Phone</h2>
            <p>
                ChargeKaro works as a Progressive Web App (PWA). You can install it directly on your 
                phone's home screen — no app store needed. It works offline, loads instantly, and feels 
                just like a native app.
            </p>
            <p><strong>To install:</strong> Open this site in your phone's browser → tap the share/menu button → "Add to Home Screen"</p>
        </div>

        <div class="about-section">
            <h2>🚀 Coming Soon</h2>
            <p>
                We're working on exciting features: route planning with charger stops, real-time charger 
                reservations, unified payment across all networks, community reviews and photos, and native 
                apps for iOS and Android.
            </p>
        </div>
    </div>`;
}
