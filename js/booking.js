/* ============================================
   REMBAYUNG - Booking System JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    initBookingForm();
    setMinDate();
});

// ===== Initialize Booking Form =====
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    form.addEventListener('submit', handleBookingSubmit);

    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

// ===== Set Minimum Date (Today) =====
function setMinDate() {
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }
}

// ===== Handle Form Submit =====
function handleBookingSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const isValid = validateForm(form);

    if (!isValid) {
        showNotification('Sila lengkapkan semua maklumat yang diperlukan.', 'error');
        return;
    }

    // Gather form data
    const formData = {
        id: generateBookingId(),
        name: document.getElementById('customerName').value.trim(),
        email: document.getElementById('customerEmail').value.trim(),
        phone: document.getElementById('customerPhone').value.trim(),
        date: document.getElementById('bookingDate').value,
        time: document.getElementById('bookingTime').value,
        guests: parseInt(document.getElementById('guestCount').value),
        occasion: document.getElementById('occasion')?.value || '',
        notes: document.getElementById('specialRequests')?.value.trim() || '',
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    // Save booking
    saveBooking(formData);

    // Show confirmation
    showBookingConfirmation(formData);

    // Reset form
    form.reset();
}

// ===== Generate Booking ID =====
function generateBookingId() {
    const prefix = 'RB';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return prefix + timestamp + random;
}

// ===== Save Booking to LocalStorage =====
function saveBooking(booking) {
    let bookings = JSON.parse(localStorage.getItem('rembayung_bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('rembayung_bookings', JSON.stringify(bookings));
}

// ===== Get All Bookings =====
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

// ===== Validate Form =====
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

// ===== Validate Field =====
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    let isValid = true;
    let errorMessage = '';

    // Remove previous error state
    field.classList.remove('error');
    const errorEl = field.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.classList.remove('show');

    // Required check
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Medan ini diperlukan';
    }

    // Email validation
    if (isValid && field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Sila masukkan alamat emel yang sah';
        }
    }

    // Phone validation
    if (isValid && fieldName === 'customerPhone' && value) {
        const phoneRegex = /^(\+?6?0)[0-9]{8,11}$/;
        if (!phoneRegex.test(value.replace(/\s|-/g, ''))) {
            isValid = false;
            errorMessage = 'Sila masukkan nombor telefon yang sah';
        }
    }

    // Guest count validation
    if (isValid && fieldName === 'guestCount' && value) {
        const guests = parseInt(value);
        if (guests < 1 || guests > 50) {
            isValid = false;
            errorMessage = 'Bilangan tetamu mestilah antara 1 dan 50';
        }
    }

    // Show error if invalid
    if (!isValid) {
        field.classList.add('error');
        if (errorEl) {
            errorEl.textContent = errorMessage;
            errorEl.classList.add('show');
        }
    }

    return isValid;
}

// ===== Show Booking Confirmation =====
function showBookingConfirmation(booking) {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        // Update modal content
        const bookingIdEl = document.getElementById('confirmBookingId');
        const bookingDateEl = document.getElementById('confirmBookingDate');
        const bookingTimeEl = document.getElementById('confirmBookingTime');
        const bookingGuestsEl = document.getElementById('confirmBookingGuests');

        if (bookingIdEl) bookingIdEl.textContent = booking.id;
        if (bookingDateEl) bookingDateEl.textContent = formatDateMalay(booking.date);
        if (bookingTimeEl) bookingTimeEl.textContent = formatTime12Hour(booking.time);
        if (bookingGuestsEl) bookingGuestsEl.textContent = booking.guests + ' orang';

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// ===== Close Confirmation Modal =====
function closeConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== Format Date in Malay =====
function formatDateMalay(dateString) {
    const days = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
        'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];

    const date = new Date(dateString);
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${day} ${month} ${year}`;
}

// ===== Format Time 12-Hour =====
function formatTime12Hour(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
}

// ===== Show Notification =====
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add notification styles dynamically
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 100px;
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
    .notification-success {
        background: #22C55E;
        color: white;
    }
    .notification-error {
        background: #EF4444;
        color: white;
    }
    .notification-info {
        background: #3B82F6;
        color: white;
    }
    .notification button {
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
document.head.appendChild(notificationStyles);
