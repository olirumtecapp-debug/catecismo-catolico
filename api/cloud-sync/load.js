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

    // conta com PIN: exige o PIN antes de entregar o progresso
    if (user.pinHash) {
        const segredo = process.env.ADMIN_AUTH_SECRET || 'catecismo-catolico-auth-secret-key-2026';
        if (!segredo) return res.status(200).json({ success: false, error: 'Servidor sem segredo configurado.' });
        if (!pin) {
            return res.status(200).json({ success: false, precisaPin: true, error: 'Esta conta tem PIN. Informe o PIN para carregar o progresso.' });
        }
        const hash = crypto.createHmac('sha256', segredo).update(pin).digest('hex');
        if (hash !== user.pinHash) {
            return res.status(200).json({ success: false, pinInvalido: true, error: 'PIN incorreto.' });
        }
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
