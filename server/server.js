/* ============================================
   ChargeKaro — Zero-Dependency HTTP Server
   Uses only Node.js built-in modules
   ============================================ */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { getDb, saveDb } = require('./db');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// ---- MIME Types ----
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.webmanifest': 'application/manifest+json'
};

// ---- Helpers ----
function sendJSON(res, data, status = 200) {
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
}

function sendError(res, message, status = 400) {
    sendJSON(res, { error: message }, status);
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                reject(new Error('Invalid JSON'));
            }
        });
        req.on('error', reject);
    });
}

function serveStaticFile(res, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            // Serve index.html for SPA fallback
            fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (err2, indexData) => {
                if (err2) {
                    res.writeHead(404);
                    res.end('Not Found');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(indexData);
            });
            return;
        }
        res.writeHead(200, { 'Content-Type': mime });
        res.end(data);
    });
}

// =============================================
//  API Route Handlers
// =============================================

// GET /api/v1/stats
function handleGetStats(req, res) {
    const db = getDb();
    const totalStations = db.stations.length;
    const totalCities = [...new Set(db.stations.map(s => s.city))].length;
    const totalCompanies = Object.keys(db.companies).length;
    const availableNow = db.stations.filter(s => s.status === 'available').length;
    const totalConnectors = db.stations.reduce((sum, s) => sum + s.connectors.reduce((cs, c) => cs + c.count, 0), 0);
    const totalReviews = db.reviews.length;

    sendJSON(res, { totalStations, totalCities, totalCompanies, availableNow, totalConnectors, totalReviews });
}

// GET /api/v1/stations
function handleGetStations(req, res) {
    const db = getDb();
    const query = url.parse(req.url, true).query;

    let stations = [...db.stations];

    // Filters
    if (query.city) {
        stations = stations.filter(s => s.city === query.city);
    }
    if (query.company) {
        stations = stations.filter(s => s.company === query.company);
    }
    if (query.status) {
        stations = stations.filter(s => s.status === query.status);
    }
    if (query.connector) {
        stations = stations.filter(s =>
            s.connectors.some(c => c.type === query.connector)
        );
    }
    if (query.search) {
        const term = query.search.toLowerCase();
        stations = stations.filter(s =>
            s.name.toLowerCase().includes(term) ||
            s.city.toLowerCase().includes(term) ||
            s.address.toLowerCase().includes(term) ||
            (db.companies[s.company] && db.companies[s.company].name.toLowerCase().includes(term))
        );
    }

    // Sort
    if (query.sort === 'rating') {
        stations.sort((a, b) => b.rating - a.rating);
    } else if (query.sort === 'waitTime') {
        stations.sort((a, b) => a.waitTime - b.waitTime);
    } else if (query.sort === 'name') {
        stations.sort((a, b) => a.name.localeCompare(b.name));
    }

    sendJSON(res, stations);
}

// GET /api/v1/stations/:id
function handleGetStation(req, res, stationId) {
    const db = getDb();
    const station = db.stations.find(s => s.id === parseInt(stationId));

    if (!station) return sendError(res, 'Station not found', 404);

    // Attach reviews
    const reviews = db.reviews.filter(r => r.stationId === parseInt(stationId));
    sendJSON(res, { ...station, reviews });
}

// GET /api/v1/companies
function handleGetCompanies(req, res) {
    const db = getDb();
    const companies = Object.entries(db.companies).map(([id, c]) => {
        const stationCount = db.stations.filter(s => s.company === id).length;
        return { ...c, id, stationCount };
    }).sort((a, b) => a.name.localeCompare(b.name));

    sendJSON(res, companies);
}

// GET /api/v1/companies/:id
function handleGetCompany(req, res, companyId) {
    const db = getDb();
    const company = db.companies[companyId];

    if (!company) return sendError(res, 'Company not found', 404);

    const stations = db.stations.filter(s => s.company === companyId);
    sendJSON(res, { ...company, id: companyId, stations });
}

// GET /api/v1/stations/:id/reviews
function handleGetReviews(req, res, stationId) {
    const db = getDb();
    const reviews = db.reviews
        .filter(r => r.stationId === parseInt(stationId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    sendJSON(res, reviews);
}

// POST /api/v1/stations/:id/reviews
async function handlePostReview(req, res, stationId) {
    const db = getDb();
    const body = await parseBody(req);

    if (!body.userName || !body.rating) {
        return sendError(res, 'userName and rating are required');
    }
    if (body.rating < 1 || body.rating > 5) {
        return sendError(res, 'rating must be between 1 and 5');
    }

    const station = db.stations.find(s => s.id === parseInt(stationId));
    if (!station) return sendError(res, 'Station not found', 404);

    const review = {
        id: db._meta.nextReviewId++,
        stationId: parseInt(stationId),
        userName: body.userName,
        rating: parseInt(body.rating),
        comment: body.comment || '',
        createdAt: new Date().toISOString()
    };

    db.reviews.push(review);

    // Update station aggregate rating
    const stationReviews = db.reviews.filter(r => r.stationId === parseInt(stationId));
    const avgRating = stationReviews.reduce((sum, r) => sum + r.rating, 0) / stationReviews.length;
    station.rating = Math.round(avgRating * 10) / 10;
    station.reviewCount = stationReviews.length;

    saveDb(db);
    sendJSON(res, review, 201);
}

// GET /api/v1/favorites
function handleGetFavorites(req, res) {
    const db = getDb();
    const favorites = db.favorites.map(fav => {
        const station = db.stations.find(s => s.id === fav.stationId);
        return station ? { ...station, favoriteId: fav.id, savedAt: fav.createdAt } : null;
    }).filter(Boolean);

    sendJSON(res, favorites);
}

// POST /api/v1/favorites
async function handlePostFavorite(req, res) {
    const db = getDb();
    const body = await parseBody(req);

    if (!body.stationId) return sendError(res, 'stationId is required');

    const existing = db.favorites.find(f => f.stationId === parseInt(body.stationId));
    if (existing) return sendError(res, 'Already in favorites', 409);

    const station = db.stations.find(s => s.id === parseInt(body.stationId));
    if (!station) return sendError(res, 'Station not found', 404);

    const fav = {
        id: db._meta.nextFavoriteId++,
        stationId: parseInt(body.stationId),
        createdAt: new Date().toISOString()
    };

    db.favorites.push(fav);
    saveDb(db);
    sendJSON(res, { id: fav.id, stationId: fav.stationId }, 201);
}

// DELETE /api/v1/favorites/:stationId
function handleDeleteFavorite(req, res, stationId) {
    const db = getDb();
    const idx = db.favorites.findIndex(f => f.stationId === parseInt(stationId));

    if (idx === -1) return sendError(res, 'Favorite not found', 404);

    db.favorites.splice(idx, 1);
    saveDb(db);
    sendJSON(res, { success: true });
}

// =============================================
//  Router
// =============================================
const server = http.createServer(async (req, res) => {
    const parsed = url.parse(req.url, true);
    const pathname = parsed.pathname;
    const method = req.method;

    // CORS preflight
    if (method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    try {
        // ---- API Routes ----
        if (pathname.startsWith('/api/v1/')) {
            const segments = pathname.replace('/api/v1/', '').split('/').filter(Boolean);

            // GET /api/v1/stats
            if (method === 'GET' && segments[0] === 'stats') {
                return handleGetStats(req, res);
            }

            // GET /api/v1/companies
            if (method === 'GET' && segments[0] === 'companies' && !segments[1]) {
                return handleGetCompanies(req, res);
            }

            // GET /api/v1/companies/:id
            if (method === 'GET' && segments[0] === 'companies' && segments[1]) {
                return handleGetCompany(req, res, segments[1]);
            }

            // GET /api/v1/stations
            if (method === 'GET' && segments[0] === 'stations' && !segments[1]) {
                return handleGetStations(req, res);
            }

            // GET /api/v1/stations/:id
            if (method === 'GET' && segments[0] === 'stations' && segments[1] && !segments[2]) {
                return handleGetStation(req, res, segments[1]);
            }

            // GET /api/v1/stations/:id/reviews
            if (method === 'GET' && segments[0] === 'stations' && segments[2] === 'reviews') {
                return handleGetReviews(req, res, segments[1]);
            }

            // POST /api/v1/stations/:id/reviews
            if (method === 'POST' && segments[0] === 'stations' && segments[2] === 'reviews') {
                return await handlePostReview(req, res, segments[1]);
            }

            // GET /api/v1/favorites
            if (method === 'GET' && segments[0] === 'favorites' && !segments[1]) {
                return handleGetFavorites(req, res);
            }

            // POST /api/v1/favorites
            if (method === 'POST' && segments[0] === 'favorites') {
                return await handlePostFavorite(req, res);
            }

            // DELETE /api/v1/favorites/:stationId
            if (method === 'DELETE' && segments[0] === 'favorites' && segments[1]) {
                return handleDeleteFavorite(req, res, segments[1]);
            }

            return sendError(res, 'API endpoint not found', 404);
        }

        // ---- Static Files ----
        const filePath = pathname === '/' 
            ? path.join(PUBLIC_DIR, 'index.html')
            : path.join(PUBLIC_DIR, pathname);

        // Security: prevent directory traversal
        if (!filePath.startsWith(PUBLIC_DIR)) {
            res.writeHead(403);
            res.end('Forbidden');
            return;
        }

        serveStaticFile(res, filePath);

    } catch (err) {
        console.error('❌ Server Error:', err.message);
        sendError(res, 'Internal server error', 500);
    }
});

server.listen(PORT, '127.0.0.1', () => {
    // Initialize DB on startup
    getDb();
    console.log(`\n⚡ ChargeKaro Server running at http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api/v1`);
    console.log(`🌐 Frontend at http://localhost:${PORT}\n`);
    console.log('Endpoints:');
    console.log('  GET    /api/v1/stats');
    console.log('  GET    /api/v1/stations');
    console.log('  GET    /api/v1/stations/:id');
    console.log('  GET    /api/v1/companies');
    console.log('  GET    /api/v1/companies/:id');
    console.log('  GET    /api/v1/stations/:id/reviews');
    console.log('  POST   /api/v1/stations/:id/reviews');
    console.log('  GET    /api/v1/favorites');
    console.log('  POST   /api/v1/favorites');
    console.log('  DELETE /api/v1/favorites/:stationId');
    console.log('');
});
