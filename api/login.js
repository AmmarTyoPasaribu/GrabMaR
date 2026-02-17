const bcrypt = require('bcryptjs');
const { handleCors, supabaseRequest, jwtEncode, JWT_EXPIRY } = require('./_helpers');

module.exports = async function handler(req, res) {
    if (handleCors(req, res)) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ error: 'Email dan password wajib diisi' });
    }

    // Find user
    const result = await supabaseRequest('users', 'GET', null,
        `email=eq.${encodeURIComponent(email)}&select=*`
    );

    if (!result.data || result.data.length === 0) {
        return res.status(401).json({ error: 'Email atau password salah' });
    }

    const user = result.data[0];

    // Verify password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(401).json({ error: 'Email atau password salah' });
    }

    // Generate JWT
    const now = Math.floor(Date.now() / 1000);
    const token = jwtEncode({
        user_id: user.id,
        username: user.username,
        email: user.email,
        iat: now,
        exp: now + JWT_EXPIRY
    });

    return res.status(200).json({
        message: 'Login berhasil!',
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    });
};
