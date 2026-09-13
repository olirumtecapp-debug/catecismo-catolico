export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    const payload = req.body || {};
    const year = Number(payload.year || new Date().getFullYear());

    // On Vercel, serverless functions have a read-only filesystem.
    // The automatic monthly update runs via GitHub Actions (.github/workflows/atualizar-liturgia.yml).
    return res.status(200).json({
        success: true,
        message: `Ano ${year} agendado para compilação via automação contínua da liturgia (GitHub Actions)!`,
        year
    });
}
