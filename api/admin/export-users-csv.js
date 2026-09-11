
import { getDatabase } from '../_db.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const db = getDatabase();
    const userEntries = Object.values(db.users);

    let csv = 'Email,Nivel_Espiritual,XP,Ofensiva_Dias,Reflexoes_Salvas,Ultima_Sincronizacao\n';
    userEntries.forEach(u => {
        csv += `"${u.email}","${u.level || 'Iniciante'}",${u.xp || 0},${u.streak || 0},${u.reflectionsCount || 0},"${u.updatedAt}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=comunidade_catecismo_${new Date().toISOString().split('T')[0]}.csv`);
    return res.status(200).send(csv);
}
