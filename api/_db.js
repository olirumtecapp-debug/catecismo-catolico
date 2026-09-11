
import fs from 'fs';
import path from 'path';

const TMP_FILE = path.join('/tmp', 'cloud_users.json');

export function getDatabase() {
    try {
        if (fs.existsSync(TMP_FILE)) {
            return JSON.parse(fs.readFileSync(TMP_FILE, 'utf8'));
        }
    } catch(e) {}
    return {
        _meta: { created: new Date().toISOString() },
        users: {
            "comunidade@catecismo.com": {
                email: "comunidade@catecismo.com",
                level: "Guardião da Fé",
                xp: 1250,
                streak: 42,
                reflectionsCount: 28,
                updatedAt: new Date().toISOString(),
                appState: { xp: 1250, streak: 42 }
            }
        }
    };
}

export function saveDatabase(db) {
    try {
        fs.writeFileSync(TMP_FILE, JSON.stringify(db, null, 2), 'utf8');
    } catch(e) {}
}
