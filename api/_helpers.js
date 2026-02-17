// =============================================
// GrabMaR - Shared Helpers for Vercel Serverless
// =============================================
const crypto = require('crypto');

// Config from environment variables (set in Vercel dashboard)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const JWT_SECRET = process.env.JWT_SECRET || 'grabmar_secret_key_2026_change_this';
const JWT_EXPIRY = 60 * 60 * 24 * 7; // 7 days

// =============================================
// CORS Headers
// =============================================
function setCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function handleCors(req, res) {
    setCors(res);
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return true;
    }
    return false;
}

// =============================================
// Supabase REST API Helper
// =============================================
async function supabaseRequest(endpoint, method = 'GET', data = null, query = '') {
    let url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
    if (query) url += '?' + query;

    const options = {
        method,
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }
    };

    if (data && (method === 'POST' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const responseData = await response.json().catch(() => null);
        return { status: response.status, data: responseData };
    } catch (err) {
        return { status: 0, data: null, error: err.message };
    }
}

// =============================================
// JWT Helpers (Pure Node.js, no library)
// =============================================
function base64UrlEncode(data) {
    return Buffer.from(data).toString('base64')
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(str, 'base64').toString();
}

function jwtEncode(payload) {
    const header = { alg: 'HS256', typ: 'JWT' };

    const segments = [
        base64UrlEncode(JSON.stringify(header)),
        base64UrlEncode(JSON.stringify(payload))
    ];

    const signingInput = segments.join('.');
    const signature = crypto.createHmac('sha256', JWT_SECRET).update(signingInput).digest();
    segments.push(base64UrlEncode(signature));

    return segments.join('.');
}

function jwtDecode(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const signingInput = parts[0] + '.' + parts[1];
        const signature = Buffer.from(parts[2].replace(/-/g, '+').replace(/_/g, '/'), 'base64');
        const expected = crypto.createHmac('sha256', JWT_SECRET).update(signingInput).digest();

        if (!crypto.timingSafeEqual(signature, expected)) return null;

        const payload = JSON.parse(base64UrlDecode(parts[1]));

        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

        return payload;
    } catch {
        return null;
    }
}

// =============================================
// Auth Middleware
// =============================================
function getAuthUser(req) {
    const authHeader = req.headers['authorization'] || '';
    const match = authHeader.match(/Bearer\s+(.+)/);
    if (!match) return null;
    return jwtDecode(match[1]);
}

// =============================================
// Exports
// =============================================
module.exports = {
    SUPABASE_URL,
    SUPABASE_KEY,
    JWT_SECRET,
    JWT_EXPIRY,
    setCors,
    handleCors,
    supabaseRequest,
    jwtEncode,
    jwtDecode,
    getAuthUser
};
