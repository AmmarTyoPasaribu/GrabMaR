const { handleCors, supabaseRequest, getAuthUser } = require('./_helpers');

module.exports = async function handler(req, res) {
    if (handleCors(req, res)) return;

    if (req.method !== 'DELETE' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Auth check
    const auth = getAuthUser(req);
    if (!auth) {
        return res.status(401).json({ error: 'Token tidak valid atau expired' });
    }

    const id = req.query.id || (req.body && req.body.id);
    if (!id) {
        return res.status(400).json({ error: 'ID tidak ditemukan' });
    }

    // Verify ownership first
    const check = await supabaseRequest('earnings', 'GET', null,
        `id=eq.${parseInt(id)}&user_id=eq.${auth.user_id}&select=id`
    );

    if (!check.data || check.data.length === 0) {
        return res.status(404).json({ error: 'Data tidak ditemukan' });
    }

    // Delete
    const result = await supabaseRequest('earnings', 'DELETE', null,
        `id=eq.${parseInt(id)}&user_id=eq.${auth.user_id}`
    );

    if (result.status >= 200 && result.status < 300) {
        return res.status(200).json({ message: 'Data berhasil dihapus' });
    } else {
        return res.status(500).json({ error: 'Gagal menghapus data' });
    }
};
