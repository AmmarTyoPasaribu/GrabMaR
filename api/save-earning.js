const { handleCors, supabaseRequest, getAuthUser } = require('./_helpers');

module.exports = async function handler(req, res) {
    if (handleCors(req, res)) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Auth check
    const auth = getAuthUser(req);
    if (!auth) {
        return res.status(401).json({ error: 'Token tidak valid atau expired' });
    }

    const body = req.body || {};

    const data = {
        user_id:        auth.user_id,
        dompet_kredit:  parseFloat(body.dompet_kredit) || 0,
        dompet_tunai:   parseFloat(body.dompet_tunai) || 0,
        ovo_cash:       parseFloat(body.ovo_cash) || 0,
        cash_100k:      parseInt(body.cash_100k) || 0,
        cash_50k:       parseInt(body.cash_50k) || 0,
        cash_20k:       parseInt(body.cash_20k) || 0,
        cash_10k:       parseInt(body.cash_10k) || 0,
        cash_5k:        parseInt(body.cash_5k) || 0,
        cash_2k:        parseInt(body.cash_2k) || 0,
        cash_1k:        parseInt(body.cash_1k) || 0,
        cash_manual:    parseFloat(body.cash_manual) || 0,
        total_digital:  parseFloat(body.total_digital) || 0,
        total_cash:     parseFloat(body.total_cash) || 0,
        total_all:      parseFloat(body.total_all) || 0,
    };

    const result = await supabaseRequest('earnings', 'POST', data);

    if (result.status >= 200 && result.status < 300) {
        return res.status(201).json({
            message: 'Data pendapatan berhasil disimpan!',
            data: result.data?.[0] || null
        });
    } else {
        return res.status(500).json({ error: 'Gagal menyimpan data' });
    }
};
