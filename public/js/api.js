/* ============================================
   ChargeKaro — API Client
   Connects frontend to the backend REST API
   ============================================ */

const API_BASE = '/api/v1';

const API = {
    // ---- Stations ----
    async getStations(filters = {}) {
        const params = new URLSearchParams();
        if (filters.city) params.set('city', filters.city);
        if (filters.company) params.set('company', filters.company);
        if (filters.status) params.set('status', filters.status);
        if (filters.connector) params.set('connector', filters.connector);
        if (filters.search) params.set('search', filters.search);
        if (filters.sort) params.set('sort', filters.sort);

        const qs = params.toString();
        const res = await fetch(`${API_BASE}/stations${qs ? '?' + qs : ''}`);
        return res.json();
    },

    async getStation(id) {
        const res = await fetch(`${API_BASE}/stations/${id}`);
        return res.json();
    },

    // ---- Companies ----
    async getCompanies() {
        const res = await fetch(`${API_BASE}/companies`);
        return res.json();
    },

    async getCompany(id) {
        const res = await fetch(`${API_BASE}/companies/${id}`);
        return res.json();
    },

    // ---- Stats ----
    async getStats() {
        const res = await fetch(`${API_BASE}/stats`);
        return res.json();
    },

    // ---- Reviews ----
    async getReviews(stationId) {
        const res = await fetch(`${API_BASE}/stations/${stationId}/reviews`);
        return res.json();
    },

    async addReview(stationId, data) {
        const res = await fetch(`${API_BASE}/stations/${stationId}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    // ---- Favorites ----
    async getFavorites() {
        const res = await fetch(`${API_BASE}/favorites`);
        return res.json();
    },

    async addFavorite(stationId) {
        const res = await fetch(`${API_BASE}/favorites`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stationId })
        });
        return res.json();
    },

    async removeFavorite(stationId) {
        const res = await fetch(`${API_BASE}/favorites/${stationId}`, {
            method: 'DELETE'
        });
        return res.json();
    }
};
