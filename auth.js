// =============================================
// GrabMaR - Auth Helper Functions
// =============================================

const API_BASE = '/api';

// Get token from localStorage
function getToken() {
    return localStorage.getItem('grabmar_token');
}

// Get user info from localStorage
function getUser() {
    const user = localStorage.getItem('grabmar_user');
    return user ? JSON.parse(user) : null;
}

// Check if logged in
function isLoggedIn() {
    return !!getToken();
}

// Save auth data
function saveAuth(token, user) {
    localStorage.setItem('grabmar_token', token);
    localStorage.setItem('grabmar_user', JSON.stringify(user));
}

// Logout
function logout() {
    localStorage.removeItem('grabmar_token');
    localStorage.removeItem('grabmar_user');
    window.location.href = 'index.html';
}

// Fetch with auth header
async function fetchWithAuth(url, options = {}) {
    const token = getToken();
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        ...(options.headers || {})
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        logout();
        return;
    }

    return response;
}

// Format number to Rupiah
function formatRupiah(number) {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(number);
}

// Format date to Indonesian format
function formatDate(dateStr) {
    const d = new Date(dateStr);
    const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    return d.toLocaleDateString('id-ID', options);
}

// Update navbar based on auth status
function updateNavbar() {
    const navAuth = document.getElementById('nav-auth');
    if (!navAuth) return;

    if (isLoggedIn()) {
        const user = getUser();
        navAuth.innerHTML = `
            <a href="history.html" class="nav-history-btn">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                Riwayat
            </a>
            <button onclick="logout()" class="nav-logout" title="Logout">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/>
                </svg>
            </button>
        `;

        // Add username greeting below navbar
        const navbar = navAuth.closest('.navbar');
        if (navbar && !document.getElementById('user-greeting')) {
            const greeting = document.createElement('div');
            greeting.id = 'user-greeting';
            greeting.className = 'user-greeting';
            greeting.innerHTML = `
                <svg class="w-4 h-4 text-grab-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
                </svg>
                <span>Halo, <strong class="text-grab-400">${user?.username || 'User'}</strong></span>
            `;
            navbar.after(greeting);
        }
    } else {
        navAuth.innerHTML = `
            <a href="login.html" class="nav-login-btn">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
                </svg>
                Login
            </a>
        `;
    }
}

// Init navbar on page load
document.addEventListener('DOMContentLoaded', updateNavbar);
