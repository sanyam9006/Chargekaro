/* StationDetail Component (with Reviews) */
function createStationDetail(station) {
    const company = getCompany(station.company);
    const fav = isFavorite(station.id);
    const totalAvail = getTotalAvailableConnectors(station);
    const totalConn = getTotalConnectors(station);

    const amenityIcons = {
        restroom: { icon: '🚻', label: 'Restroom' },
        cafe: { icon: '☕', label: 'Café' },
        wifi: { icon: '📶', label: 'Free WiFi' },
        parking: { icon: '🅿️', label: 'Parking' },
        lounge: { icon: '🛋️', label: 'Lounge' }
    };

    const starsHtml = Array.from({ length: 5 }, (_, i) => {
        return `<svg class="star ${i < Math.round(station.rating) ? '' : 'empty'}" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    }).join('');

    return `
    <div class="station-detail page-enter">
        <div class="station-detail-header">
            <button class="detail-back-btn" onclick="history.back()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            </button>
            <div class="detail-company-badge" style="background:${company.color}">${company.shortName}</div>
            <div class="detail-title">
                <h1>${station.name}</h1>
                <p>${company.name} · ${station.city}</p>
            </div>
        </div>

        <div class="detail-rating">
            <div class="rating-stars">${starsHtml}</div>
            <span class="rating-value">${station.rating}</span>
            <span class="rating-count">(${station.reviewCount} reviews)</span>
        </div>

        <div class="detail-actions">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}" target="_blank" rel="noopener" class="btn btn-primary btn-lg" style="flex:1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
                Navigate
            </a>
            <button class="btn btn-secondary btn-lg ${fav ? 'is-favorite' : ''}" onclick="handleDetailFavorite(${station.id}, this)" style="flex:1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${fav ? '#ef4444' : 'none'}" stroke="${fav ? '#ef4444' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                ${fav ? 'Saved' : 'Save'}
            </button>
        </div>

        <!-- Status & Info -->
        <div class="detail-section">
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-md)">
                <div>
                    ${createStatusBadge(station.status)}
                    <span style="margin-left:12px;font-size:0.85rem;color:var(--text-secondary)">
                        ${totalAvail}/${totalConn} chargers available
                    </span>
                </div>
                <div style="display:flex;align-items:center;gap:8px;font-size:0.85rem;color:var(--text-secondary)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    ${station.waitTime > 0 
                        ? `~${station.waitTime} min estimated wait` 
                        : '<span style="color:var(--status-available)">No wait time</span>'}
                </div>
            </div>
        </div>

        <!-- Mini Map -->
        <div class="detail-section">
            <h3 class="detail-section-title">Location</h3>
            <div class="detail-map-container" id="detail-mini-map"></div>
            <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:var(--space-sm)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${station.address}
            </p>
        </div>

        <!-- Connectors -->
        <div class="detail-section">
            <h3 class="detail-section-title">Charging Connectors</h3>
            ${station.connectors.map(conn => `
                <div class="connector-row">
                    <div class="connector-info">
                        <div class="connector-type-icon">${conn.type}</div>
                        <div>
                            <div class="connector-name">${conn.type} — ${conn.power} kW</div>
                            <div class="connector-speed">${conn.power >= 100 ? 'Ultra Fast' : conn.power >= 50 ? 'Fast' : conn.power >= 22 ? 'Semi-Fast' : 'Slow'} Charging</div>
                        </div>
                    </div>
                    <div class="connector-status-wrap">
                        <div>${createStatusBadge(conn.available > 0 ? 'available' : 'busy')}</div>
                        <div class="connector-price">${conn.available}/${conn.count} slots · ₹${conn.price}/kWh</div>
                    </div>
                </div>
            `).join('')}
        </div>

        <!-- Amenities -->
        ${station.amenities.length > 0 ? `
        <div class="detail-section">
            <h3 class="detail-section-title">Amenities</h3>
            <div class="amenities-grid">
                ${station.amenities.map(a => {
                    const am = amenityIcons[a] || { icon: '✓', label: a };
                    return `<div class="amenity-item"><span style="font-size:1.2rem">${am.icon}</span>${am.label}</div>`;
                }).join('')}
            </div>
        </div>` : ''}

        <!-- Operating Hours -->
        <div class="detail-section">
            <h3 class="detail-section-title">Operating Hours</h3>
            <p style="font-size:0.95rem;display:flex;align-items:center;gap:8px">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                ${station.operatingHours}
            </p>
        </div>

        <!-- Reviews Section -->
        <div class="detail-section">
            <h3 class="detail-section-title">Reviews</h3>
            
            <!-- Add Review Form -->
            <div class="review-form" id="review-form-${station.id}" style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:var(--space-lg);margin-bottom:var(--space-lg)">
                <h4 style="font-size:0.9rem;font-weight:600;margin-bottom:var(--space-md)">Write a Review</h4>
                <div style="margin-bottom:var(--space-md)">
                    <input type="text" id="review-name-${station.id}" placeholder="Your name" 
                        style="width:100%;padding:10px 14px;background:var(--bg-main);border:1px solid var(--border);border-radius:var(--radius-md);color:var(--text-primary);font-size:0.85rem;box-sizing:border-box" />
                </div>
                <div style="margin-bottom:var(--space-md)">
                    <div class="review-star-input" id="review-stars-${station.id}" style="display:flex;gap:4px;cursor:pointer">
                        ${[1,2,3,4,5].map(i => `
                            <svg class="review-star-btn" data-rating="${i}" onclick="setReviewRating(${station.id}, ${i})" 
                                 width="28" height="28" viewBox="0 0 24 24" fill="var(--bg-main)" stroke="var(--text-muted)" stroke-width="1.5" style="cursor:pointer;transition:all 0.15s">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        `).join('')}
                    </div>
                </div>
                <div style="margin-bottom:var(--space-md)">
                    <textarea id="review-comment-${station.id}" placeholder="Share your charging experience..." rows="3"
                        style="width:100%;padding:10px 14px;background:var(--bg-main);border:1px solid var(--border);border-radius:var(--radius-md);color:var(--text-primary);font-size:0.85rem;resize:vertical;font-family:inherit;box-sizing:border-box"></textarea>
                </div>
                <button class="btn btn-primary btn-sm" onclick="submitReview(${station.id})" id="review-submit-${station.id}">
                    Submit Review
                </button>
            </div>

            <!-- Existing Reviews -->
            <div id="reviews-list-${station.id}" style="display:flex;flex-direction:column;gap:var(--space-md)">
                <div style="text-align:center;padding:var(--space-lg);color:var(--text-muted);font-size:0.85rem">
                    Loading reviews...
                </div>
            </div>
        </div>
    </div>`;
}

// Review rating state
let currentReviewRating = 0;

function setReviewRating(stationId, rating) {
    currentReviewRating = rating;
    const container = document.getElementById(`review-stars-${stationId}`);
    if (!container) return;
    container.querySelectorAll('.review-star-btn').forEach(star => {
        const r = parseInt(star.dataset.rating);
        star.setAttribute('fill', r <= rating ? '#fbbf24' : 'var(--bg-main)');
        star.setAttribute('stroke', r <= rating ? '#fbbf24' : 'var(--text-muted)');
    });
}

async function submitReview(stationId) {
    const nameEl = document.getElementById(`review-name-${stationId}`);
    const commentEl = document.getElementById(`review-comment-${stationId}`);
    const submitBtn = document.getElementById(`review-submit-${stationId}`);
    
    const userName = nameEl.value.trim();
    const comment = commentEl.value.trim();

    if (!userName) { nameEl.style.borderColor = '#ef4444'; return; }
    if (currentReviewRating === 0) { alert('Please select a star rating'); return; }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
        await API.addReview(stationId, { userName, rating: currentReviewRating, comment });
        nameEl.value = '';
        commentEl.value = '';
        currentReviewRating = 0;
        setReviewRating(stationId, 0);
        submitBtn.textContent = '✅ Submitted!';
        setTimeout(() => { submitBtn.textContent = 'Submit Review'; submitBtn.disabled = false; }, 2000);
        
        // Reload reviews
        loadReviews(stationId);
    } catch (err) {
        submitBtn.textContent = 'Failed — try again';
        submitBtn.disabled = false;
    }
}

async function loadReviews(stationId) {
    const container = document.getElementById(`reviews-list-${stationId}`);
    if (!container) return;

    try {
        const reviews = await API.getReviews(stationId);
        
        if (reviews.length === 0) {
            container.innerHTML = `<p style="text-align:center;padding:var(--space-lg);color:var(--text-muted);font-size:0.85rem">No reviews yet. Be the first to review this station!</p>`;
            return;
        }

        container.innerHTML = reviews.map(r => {
            const stars = Array.from({ length: 5 }, (_, i) => 
                `<svg width="14" height="14" viewBox="0 0 24 24" fill="${i < r.rating ? '#fbbf24' : 'none'}" stroke="${i < r.rating ? '#fbbf24' : 'var(--text-muted)'}" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
            ).join('');

            const date = new Date(r.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

            return `
            <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:var(--space-md)">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                    <div style="display:flex;align-items:center;gap:8px">
                        <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#00f5a0,#00d9f5);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;color:#0a0e17">
                            ${r.userName.charAt(0).toUpperCase()}
                        </div>
                        <strong style="font-size:0.9rem">${r.userName}</strong>
                    </div>
                    <span style="font-size:0.75rem;color:var(--text-muted)">${date}</span>
                </div>
                <div style="display:flex;gap:2px;margin-bottom:8px">${stars}</div>
                ${r.comment ? `<p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.5">${r.comment}</p>` : ''}
            </div>`;
        }).join('');
    } catch {
        container.innerHTML = `<p style="text-align:center;padding:var(--space-lg);color:var(--text-muted);font-size:0.85rem">Could not load reviews</p>`;
    }
}

function handleDetailFavorite(stationId, btn) {
    toggleFavorite(stationId);
    const fav = isFavorite(stationId);
    const svg = btn.querySelector('svg');
    svg.setAttribute('fill', fav ? '#ef4444' : 'none');
    svg.setAttribute('stroke', fav ? '#ef4444' : 'currentColor');
    btn.lastElementChild && (btn.innerHTML = btn.innerHTML.replace(fav ? 'Save' : 'Saved', fav ? 'Saved' : 'Save'));
    btn.style.transform = 'scale(1.05)';
    setTimeout(() => btn.style.transform = '', 200);
}
