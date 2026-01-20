/* ============================================
   REMBAYUNG - Admin Console JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    checkAdminAuth();
    initAdminLogin();
    initDashboard();
});

// ===== Admin Credentials =====
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: '12345678'
};

// ===== Check Admin Authentication =====
function checkAdminAuth() {
    const isLoggedIn = sessionStorage.getItem('rembayung_admin_logged_in');
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');

    if (isLoggedIn === 'true') {
        if (loginSection) loginSection.style.display = 'none';
        if (dashboardSection) dashboardSection.style.display = 'block';
        loadDashboardData();
    } else {
        if (loginSection) loginSection.style.display = 'flex';
        if (dashboardSection) dashboardSection.style.display = 'none';
    }
}

// ===== Initialize Admin Login =====
function initAdminLogin() {
    const loginForm = document.getElementById('adminLoginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', handleAdminLogin);
}

// ===== Handle Admin Login =====
function handleAdminLogin(e) {
    e.preventDefault();

    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;
    const errorEl = document.getElementById('loginError');

    // Reset error
    if (errorEl) errorEl.style.display = 'none';

    // Validate credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('rembayung_admin_logged_in', 'true');
        sessionStorage.setItem('rembayung_admin_login_time', new Date().toISOString());
        checkAdminAuth();
    } else {
        if (errorEl) {
            errorEl.textContent = 'Nama pengguna atau kata laluan tidak sah';
            errorEl.style.display = 'block';
        }
    }
}

// ===== Logout Admin =====
function logoutAdmin() {
    sessionStorage.removeItem('rembayung_admin_logged_in');
    sessionStorage.removeItem('rembayung_admin_login_time');
    checkAdminAuth();
}

// ===== Initialize Dashboard =====
function initDashboard() {
    const dashboardSection = document.getElementById('dashboardSection');
    if (!dashboardSection) return;

    // Add event listeners for filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', loadDashboardData);
    }

    const dateFilter = document.getElementById('dateFilter');
    if (dateFilter) {
        dateFilter.addEventListener('change', loadDashboardData);
    }
}

// ===== Load Dashboard Data =====
function loadDashboardData() {
    updateStats();
    loadBookingsTable();
}

// ===== Update Statistics =====
function updateStats() {
    const bookings = getBookings();
    const today = new Date().toISOString().split('T')[0];

    // Total bookings
    const totalEl = document.getElementById('totalBookings');
    if (totalEl) totalEl.textContent = bookings.length;

    // Today's bookings
    const todayBookings = bookings.filter(b => b.date === today);
    const todayEl = document.getElementById('todayBookings');
    if (todayEl) todayEl.textContent = todayBookings.length;

    // Pending bookings
    const pendingBookings = bookings.filter(b => b.status === 'pending');
    const pendingEl = document.getElementById('pendingBookings');
    if (pendingEl) pendingEl.textContent = pendingBookings.length;

    // Confirmed bookings
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
    const confirmedEl = document.getElementById('confirmedBookings');
    if (confirmedEl) confirmedEl.textContent = confirmedBookings.length;

    // Total guests today
    const totalGuests = todayBookings.reduce((sum, b) => sum + b.guests, 0);
    const guestsEl = document.getElementById('totalGuests');
    if (guestsEl) guestsEl.textContent = totalGuests;
}

// ===== Load Bookings Table =====
function loadBookingsTable() {
    const tableBody = document.getElementById('bookingsTableBody');
    if (!tableBody) return;

    let bookings = getBookings();

    // Apply status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter && statusFilter.value !== 'all') {
        bookings = bookings.filter(b => b.status === statusFilter.value);
    }

    // Apply date filter
    const dateFilter = document.getElementById('dateFilter');
    if (dateFilter && dateFilter.value) {
        bookings = bookings.filter(b => b.date === dateFilter.value);
    }

    // Sort by date (newest first)
    bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Render table
    if (bookings.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #666;">
                    Tiada tempahan dijumpai
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = bookings.map(booking => `
        <tr>
            <td><strong>${booking.id}</strong></td>
            <td>
                <div style="font-weight: 600;">${booking.name}</div>
                <div style="font-size: 12px; color: #666;">${booking.phone}</div>
            </td>
            <td>${formatDateShort(booking.date)}</td>
            <td>${formatTime12Hour(booking.time)}</td>
            <td>${booking.guests} orang</td>
            <td>
                <span class="status-badge status-${booking.status}">
                    ${getStatusLabel(booking.status)}
                </span>
            </td>
            <td>
                ${booking.status === 'pending' ? `
                    <button class="action-btn confirm" onclick="confirmBooking('${booking.id}')">
                        <img src="assets/icons/check.png" alt="" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 4px;"> Sahkan
                    </button>
                    <button class="action-btn cancel" onclick="cancelBooking('${booking.id}')">
                        ✕ Batal
                    </button>
                ` : booking.status === 'confirmed' ? `
                    <button class="action-btn cancel" onclick="cancelBooking('${booking.id}')">
                        ✕ Batal
                    </button>
                ` : `
                    <span style="color: #999; font-size: 12px;">Tiada tindakan</span>
                `}
            </td>
        </tr>
    `).join('');
}

// ===== Confirm Booking =====
function confirmBooking(bookingId) {
    if (confirm('Adakah anda pasti ingin mengesahkan tempahan ini?')) {
        if (updateBookingStatus(bookingId, 'confirmed')) {
            showAdminNotification('Tempahan berjaya disahkan!', 'success');
            loadDashboardData();
        }
    }
}

// ===== Cancel Booking =====
function cancelBooking(bookingId) {
    if (confirm('Adakah anda pasti ingin membatalkan tempahan ini?')) {
        if (updateBookingStatus(bookingId, 'cancelled')) {
            showAdminNotification('Tempahan telah dibatalkan.', 'info');
            loadDashboardData();
        }
    }
}

// ===== Delete Booking =====
function deleteBookingPermanent(bookingId) {
    if (confirm('Adakah anda pasti ingin memadam tempahan ini secara kekal?')) {
        deleteBooking(bookingId);
        showAdminNotification('Tempahan telah dipadam.', 'info');
        loadDashboardData();
    }
}

// ===== Get Bookings (from localStorage) =====
function getBookings() {
    return JSON.parse(localStorage.getItem('rembayung_bookings') || '[]');
}

// ===== Update Booking Status =====
function updateBookingStatus(bookingId, newStatus) {
    let bookings = getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);

    if (index !== -1) {
        bookings[index].status = newStatus;
        bookings[index].updatedAt = new Date().toISOString();
        localStorage.setItem('rembayung_bookings', JSON.stringify(bookings));
        return true;
    }
    return false;
}

// ===== Delete Booking =====
function deleteBooking(bookingId) {
    let bookings = getBookings();
    bookings = bookings.filter(b => b.id !== bookingId);
    localStorage.setItem('rembayung_bookings', JSON.stringify(bookings));
}

// ===== Get Status Label (Malay) =====
function getStatusLabel(status) {
    const labels = {
        'pending': 'Menunggu',
        'confirmed': 'Disahkan',
        'cancelled': 'Dibatalkan'
    };
    return labels[status] || status;
}

// ===== Format Date Short =====
function formatDateShort(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// ===== Format Time 12-Hour =====
function formatTime12Hour(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
}

// ===== Show Admin Notification =====
function showAdminNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.admin-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `admin-notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 4000);
}

// ===== Export Bookings to CSV =====
function exportBookingsCSV() {
    const bookings = getBookings();
    if (bookings.length === 0) {
        showAdminNotification('Tiada tempahan untuk dieksport.', 'error');
        return;
    }

    const headers = ['ID', 'Nama', 'Email', 'Telefon', 'Tarikh', 'Masa', 'Tetamu', 'Status', 'Catatan'];
    const csvContent = [
        headers.join(','),
        ...bookings.map(b => [
            b.id,
            `"${b.name}"`,
            b.email,
            b.phone,
            b.date,
            b.time,
            b.guests,
            b.status,
            `"${b.notes || ''}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rembayung_bookings_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    showAdminNotification('Fail CSV berjaya dimuat turun!', 'success');
}

// Add admin notification styles
const adminNotificationStyles = document.createElement('style');
adminNotificationStyles.textContent = `
    .admin-notification {
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    }
    .admin-notification.notification-success {
        background: #22C55E;
        color: white;
    }
    .admin-notification.notification-error {
        background: #EF4444;
        color: white;
    }
    .admin-notification.notification-info {
        background: #3B82F6;
        color: white;
    }
    .admin-notification button {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        margin-left: 8px;
    }
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(adminNotificationStyles);
