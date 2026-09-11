import { getDatabase } from '../_db.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    const db = await getDatabase();
    const userEntries = Object.values(db.users || {});

    let totalXp = 0;
    let totalStreak = 0;
    let totalReflections = 0;
    let totalRosaries = 0;

    userEntries.forEach(u => {
        totalXp += (u.xp || 0);
        totalStreak += (u.streak || 0);
        totalReflections += (u.reflectionsCount || 0);
        if (u.appState?.rosary?.totalPrayed) {
            totalRosaries += u.appState.rosary.totalPrayed;
        }
    });

    const count = userEntries.length;
    const avgStreak = count > 0 ? Math.round(totalStreak / count) : 0;

    const usersSummary = userEntries.map(u => ({
        email: u.email,
        level: u.level || 'Iniciante',
        xp: u.xp || 0,
        streak: u.streak || 0,
        reflectionsCount: u.reflectionsCount || 0,
        updatedAt: u.updatedAt
    })).sort((a, b) => (b.xp - a.xp));

    return res.status(200).json({
        success: true,
        totalUsers: count,
        totalXp,
        totalReflections,
        totalRosaries,
        avgStreak,
        users: usersSummary
    });
}
