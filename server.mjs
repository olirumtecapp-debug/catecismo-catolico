import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'cloud_users.json');

// Ensure data folder and cloud_users.json exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify({
        _meta: {
            created: new Date().toISOString(),
            description: "Banco de Dados de Usuários e Sincronização em Nuvem - CATECISMO"
        },
        users: {}
    }, null, 2), 'utf8');
}

function getDatabase() {
    try {
        const raw = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(raw);
    } catch (e) {
        return { _meta: {}, users: {} };
    }
}

function saveDatabase(db) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(db, null, 2), 'utf8');
}

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav'
};

const server = http.createServer(async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = reqUrl.pathname;

    // ==========================================
    // 1. API: SALVAR SINCRONIZAÇÃO EM NUVEM
    // ==========================================
    if (pathname === '/api/cloud-sync/save' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const payload = JSON.parse(body);
                const email = (payload.email || '').trim().toLowerCase();

                if (!email || !email.includes('@') || !email.includes('.')) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'E-mail inválido fornecido.' }));
                    return;
                }

                const appState = payload.appState || {};
                const db = getDatabase();

                const nowIso = new Date().toISOString();
                const reflectionsCount = appState.lectioNotes ? Object.keys(appState.lectioNotes).length : 0;
                const xp = appState.xp || 0;
                const streak = appState.streak || 0;

                const levelNames = ["Iniciante", "Peregrino", "Discípulo", "Servo Fiel", "Guardião da Fé", "Apóstolo de Cristo"];
                const levelIdx = Math.min(Math.floor(xp / 150), levelNames.length - 1);
                const levelName = levelNames[levelIdx];

                db.users[email] = {
                    email,
                    updatedAt: nowIso,
                    createdAt: db.users[email]?.createdAt || nowIso,
                    xp,
                    streak,
                    level: levelName,
                    reflectionsCount,
                    appState
                };

                saveDatabase(db);

                console.log(`[CloudSync] Usuário '${email}' sincronizado com sucesso (${xp} XP, ${reflectionsCount} reflexões).`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
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
                }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Erro ao processar dados: ' + err.message }));
            }
        });
        return;
    }

    // ==========================================
    // 2. API: CARREGAR DADOS DO USUÁRIO NA NUVEM
    // ==========================================
    if (pathname === '/api/cloud-sync/load' && req.method === 'GET') {
        const email = (reqUrl.searchParams.get('email') || '').trim().toLowerCase();

        if (!email) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Parâmetro de e-mail não informado.' }));
            return;
        }

        const db = getDatabase();
        const user = db.users[email];

        if (!user) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Nenhum progresso encontrado para este e-mail.' }));
            return;
        }

        console.log(`[CloudSync] Progresso restaurado para o usuário '${email}'.`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
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
        }));
        return;
    }

    // ==========================================
    // 3. API: MÉTRICAS GLOBAIS DA COMUNIDADE (ADM)
    // ==========================================
    if (pathname === '/api/admin/community-metrics' && req.method === 'GET') {
        const db = getDatabase();
        const userEntries = Object.values(db.users);

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

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            totalUsers: count,
            totalXp,
            totalReflections,
            totalRosaries,
            avgStreak,
            users: usersSummary
        }));
        return;
    }

    // ==========================================
    // 4. API: EXPORTAR LISTA DE USUÁRIOS EM CSV
    // ==========================================
    if (pathname === '/api/admin/export-users-csv' && req.method === 'GET') {
        const db = getDatabase();
        const userEntries = Object.values(db.users);

        let csv = 'Email,Nivel_Espiritual,XP,Ofensiva_Dias,Reflexoes_Salvas,Ultima_Sincronizacao\n';
        userEntries.forEach(u => {
            csv += `"${u.email}","${u.level || 'Iniciante'}",${u.xp || 0},${u.streak || 0},${u.reflectionsCount || 0},"${u.updatedAt}"\n`;
        });

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename=comunidade_catecismo_${new Date().toISOString().split('T')[0]}.csv`);
        res.writeHead(200);
        res.end(csv);
        return;
    }

    // ==========================================
    // 5. SERVIDOR DE ARQUIVOS ESTÁTICOS
    // ==========================================
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

    // Security check to avoid path traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Acesso proibido');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Fallback to index.html for SPA routes
            filePath = path.join(__dirname, 'index.html');
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        fs.readFile(filePath, (readErr, content) => {
            if (readErr) {
                res.writeHead(500);
                res.end('Erro ao carregar arquivo: ' + readErr.message);
                return;
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        });
    });
});

server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🕊️ SERVIDOR CATECISMO ATIVO EM http://localhost:${PORT}`);
    console.log(`☁️ Cloud Sync & Community Metrics API inicializadas.`);
    console.log(`=======================================================`);
});
