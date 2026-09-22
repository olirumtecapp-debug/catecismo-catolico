// GET /api/cloud-sync/load?email=&pin= — devolve o progresso do aluno
//
// Se a conta tiver PIN, ele passa a ser exigido: sem o PIN o progresso nao e entregue.
import crypto from 'crypto';
import { getDatabase } from '../_db.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'OPTIONS') return res.status(204).end();

    const email = String(req.query.email || '').trim().toLowerCase();
    const pin = String(req.query.pin || '').trim();
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
        temPin: !!user.pinHash,
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
