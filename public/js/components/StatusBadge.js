/* StatusBadge Component */
function createStatusBadge(status) {
    const labels = {
        'available': 'Available',
        'busy': 'Busy',
        'offline': 'Offline',
        'coming-soon': 'Coming Soon'
    };
    return `<span class="status-badge ${status}"><span class="status-dot"></span>${labels[status] || status}</span>`;
}
