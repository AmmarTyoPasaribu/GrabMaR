const { handleCors, supabaseRequest, getAuthUser } = require('./_helpers');

module.exports = async function handler(req, res) {
    if (handleCors(req, res)) return;

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Auth check
    const auth = getAuthUser(req);
    if (!auth) {
        return res.status(401).json({ error: 'Token tidak valid atau expired' });
    }

    const query = `user_id=eq.${auth.user_id}&select=id,total_digital,total_cash,total_all,created_at&order=created_at.desc`;
    const result = await supabaseRequest('earnings', 'GET', null, query);

    if (result.status >= 200 && result.status < 300) {
        return res.status(200).json({ data: result.data || [] });
    } else {
        return res.status(500).json({ error: 'Gagal memuat data' });
    }
};
