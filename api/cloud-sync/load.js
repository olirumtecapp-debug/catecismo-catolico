
import { getDatabase } from '../_db.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    const email = (req.query.email || '').trim().toLowerCase();
    if (!email) {
        return res.status(400).json({ success: false, error: 'Parâmetro de e-mail não informado.' });
    }

    const db = await getDatabase();
    const user = db.users[email];

    if (!user) {
        return res.status(404).json({ success: false, error: 'Nenhum progresso encontrado para este e-mail.' });
    }

    return res.status(200).json({
        success: true,
        user: {
            email: user.email,
            xp: user.xp,
            streak: user.streak,
            level: user.level,
            reflectionsCount: user.reflectionsCount,
            updatedAt: user.updatedAt
        },
        appState: user.appState
    });
}
