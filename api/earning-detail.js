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

    const id = req.query.id;
    if (!id) {
        return res.status(400).json({ error: 'ID tidak ditemukan' });
    }

    const query = `id=eq.${parseInt(id)}&user_id=eq.${auth.user_id}&select=*`;
    const result = await supabaseRequest('earnings', 'GET', null, query);

    if (result.status >= 200 && result.status < 300 && result.data && result.data.length > 0) {
        return res.status(200).json({ data: result.data[0] });
    } else {
        return res.status(404).json({ error: 'Data tidak ditemukan' });
    }
};
