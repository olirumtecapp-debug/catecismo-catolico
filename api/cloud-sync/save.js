import { saveUserToDatabase } from '../_db.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const email = (payload.email || '').trim().toLowerCase();

        if (!email || !email.includes('@') || !email.includes('.')) {
            return res.status(400).json({ success: false, error: 'E-mail inválido fornecido.' });
        }

        const appState = payload.appState || {};
        const nowIso = new Date().toISOString();
        const reflectionsCount = appState.lectioNotes ? Object.keys(appState.lectioNotes).length : 0;
        const xp = appState.xp || 0;
        const streak = appState.streak || 0;

        const levelNames = ["Iniciante", "Peregrino", "Discípulo", "Servo Fiel", "Guardião da Fé", "Apóstolo de Cristo"];
        const levelIdx = Math.min(Math.floor(xp / 150), levelNames.length - 1);
        const levelName = levelNames[levelIdx];

        const userRecord = {
            email,
            updatedAt: nowIso,
            createdAt: nowIso,
            xp,
            streak,
            level: levelName,
            reflectionsCount,
            appState
        };

        // Persist to GitHub
        await saveUserToDatabase(email, userRecord);

        return res.status(200).json({
            success: true,
            message: 'Sincronizado na nuvem com sucesso!',
            user: {
                email,
                xp,
                streak,
                level: levelName,
                reflectionsCount,
                updatedAt: nowIso
            }
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Erro ao processar dados: ' + err.message });
    }
}
