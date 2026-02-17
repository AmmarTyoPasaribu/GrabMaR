const bcrypt = require('bcryptjs');
const { handleCors, supabaseRequest, jwtEncode, JWT_EXPIRY } = require('./_helpers');

module.exports = async function handler(req, res) {
    if (handleCors(req, res)) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, dan password wajib diisi' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password minimal 6 karakter' });
    }

    // Check existing user
    const existing = await supabaseRequest('users', 'GET', null,
        `or=(username.eq.${encodeURIComponent(username)},email.eq.${encodeURIComponent(email)})&select=id`
    );

    if (existing.data && existing.data.length > 0) {
        return res.status(409).json({ error: 'Username atau email sudah terdaftar' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await supabaseRequest('users', 'POST', {
        username,
        email,
        password: hashedPassword
    });

    if (result.status >= 200 && result.status < 300 && result.data && result.data[0]) {
        const user = result.data[0];
        const now = Math.floor(Date.now() / 1000);
        const token = jwtEncode({
            user_id: user.id,
            username: user.username,
            email: user.email,
            iat: now,
            exp: now + JWT_EXPIRY
        });

        return res.status(201).json({
            message: 'Registrasi berhasil!',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } else {
        const errMsg = result.error || 'Gagal mendaftar. Coba lagi.';
        return res.status(500).json({ error: errMsg });
    }
};
