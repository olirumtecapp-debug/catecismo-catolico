import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import contactListHandler from './api/contact/list.js';
import contactSendHandler from './api/contact/send.js';
import contactUpdateStatusHandler from './api/contact/update-status.js';
import adminBroadcastsHandler from './api/admin/broadcasts.js';
import adminAuthHandler from './api/admin/auth.js';
import cloudSyncSaveHandler from './api/cloud-sync/save.js';
import cloudSyncLoadHandler from './api/cloud-sync/load.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function handleServerlessFunction(handlerFn, req, res) {
    if (!res.status) {
        res.status = function(code) {
            res.statusCode = code;
            return res;
        };
    }
    if (!res.json) {
        res.json = function(data) {
            if (!res.headersSent) {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.writeHead(res.statusCode || 200);
            }
            res.end(JSON.stringify(data));
            return res;
        };
    }
    if (!req.query) {
        const u = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        req.query = Object.fromEntries(u.searchParams.entries());
    }
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        let body = '';
        await new Promise((resolve) => {
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                try {
                    req.body = body ? JSON.parse(body) : {};
                } catch(e) {
                    req.body = body;
                }
                resolve();
            });
        });
    }
    try {
        await handlerFn(req, res);
    } catch (err) {
        if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
    }
}

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
    // ROTAS DE CAIXA POSTAL & COMUNICADOS
    // ==========================================
    if (pathname === '/api/contact/list') {
        return handleServerlessFunction(contactListHandler, req, res);
    }
    if (pathname === '/api/contact/send') {
        return handleServerlessFunction(contactSendHandler, req, res);
    }
    if (pathname === '/api/contact/update-status') {
        return handleServerlessFunction(contactUpdateStatusHandler, req, res);
    }
    if (pathname === '/api/admin/broadcasts') {
        return handleServerlessFunction(adminBroadcastsHandler, req, res);
    }
    if (pathname === '/api/admin/auth') {
        return handleServerlessFunction(adminAuthHandler, req, res);
    }

    // ==========================================
    // 1. API: SALVAR SINCRONIZAÇÃO EM NUVEM
    // ==========================================
    if (pathname === '/api/cloud-sync/save') {
        return handleServerlessFunction(cloudSyncSaveHandler, req, res);
    }

    // ==========================================
    // 2. API: CARREGAR DADOS DO USUÁRIO NA NUVEM
    // ==========================================
    if (pathname === '/api/cloud-sync/load') {
        return handleServerlessFunction(cloudSyncLoadHandler, req, res);
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
    // 4.1 API: STATUS DA LITURGIA (ANOS BAIXADOS)
    // ==========================================
    if (pathname === '/api/admin/liturgia/status' && req.method === 'GET') {
        const litDir = path.join(__dirname, 'data', 'liturgia');
        const result = {};
        const currentYear = new Date().getFullYear();
        const yearsToCheck = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3];

        yearsToCheck.forEach(y => {
            const yDir = path.join(litDir, String(y));
            const isLeap = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
            const expected = isLeap ? 366 : 365;

            if (fs.existsSync(yDir)) {
                const files = fs.readdirSync(yDir).filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f));
                result[y] = {
                    year: y,
                    count: files.length,
                    expected,
                    complete: files.length >= expected,
                    status: files.length >= expected ? 'Completo' : `${files.length}/${expected} dias`
                };
            } else {
                result[y] = {
                    year: y,
                    count: 0,
                    expected,
                    complete: false,
                    status: 'Pendente'
                };
            }
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            years: result,
            currentYear,
            isUpdating: !!global.isLiturgiaUpdating
        }));
        return;
    }

    // ==========================================
    // 4.2 API: ATUALIZAR ANO DA LITURGIA (MANUAL VIA PAINEL)
    // ==========================================
    if (pathname === '/api/admin/liturgia/atualizar' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const payload = body ? JSON.parse(body) : {};
                const targetYear = Number(payload.year || new Date().getFullYear());
                const force = !!payload.force;

                if (!targetYear || targetYear < 2020 || targetYear > 2050) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Ano inválido fornecido.' }));
                    return;
                }

                if (global.isLiturgiaUpdating) {
                    res.writeHead(429, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Já existe uma atualização de liturgia em andamento.' }));
                    return;
                }

                global.isLiturgiaUpdating = true;
                console.log(`[LiturgiaAuto] Solicitada atualização para o ano ${targetYear} (force=${force})...`);

                const scriptPath = path.join(__dirname, 'scripts', 'atualizar-liturgia.mjs');
                const args = ['--year', String(targetYear)];
                if (force) args.push('--force');

                const proc = spawn(process.execPath, [scriptPath, ...args], { cwd: __dirname });
                let logOutput = '';

                proc.stdout.on('data', d => {
                    logOutput += d.toString();
                    process.stdout.write(d);
                });
                proc.stderr.on('data', d => {
                    logOutput += d.toString();
                    process.stderr.write(d);
                });

                proc.on('close', code => {
                    global.isLiturgiaUpdating = false;
                    if (code === 0) {
                        console.log(`[LiturgiaAuto] ✅ Ano ${targetYear} concluído e validado com êxito!`);
                    } else {
                        console.error(`[LiturgiaAuto] ⚠️ Erro no processamento do ano ${targetYear} (código ${code})`);
                    }
                });

                res.writeHead(202, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: `Atualização do ano ${targetYear} iniciada em segundo plano!`,
                    year: targetYear
                }));
            } catch (err) {
                global.isLiturgiaUpdating = false;
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Falha ao iniciar: ' + err.message }));
            }
        });
        return;
    }

    // ==========================================
    // API: UPLOAD E ATUALIZAR IMAGEM
    // ==========================================
    if (pathname === '/api/admin/upload-saint-image' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { date, saintName, base64Data, filename } = JSON.parse(body);
                const buffer = Buffer.from(base64Data.split(',')[1], 'base64');
                const savePath = path.join(__dirname, 'assets', 'img', 'santos', filename);
                
                fs.writeFileSync(savePath, buffer);

                // Atualiza o JSON
                const filePath = path.join(DATA_DIR, 'santos', '2026', `${date}.json`);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                data.saints = data.saints.map(s => {
                    if (s.name === saintName) return { ...s, imageUrl: `./assets/img/santos/${filename}` };
                    return s;
                });
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // ==========================================
    // API: ATUALIZAR IMAGEM DO SANTO
    // ==========================================
    if (pathname === '/api/admin/update-saint-image' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { date, saintName, newImageUrl } = JSON.parse(body);
                if (!date || !saintName || !newImageUrl) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Dados incompletos.' }));
                    return;
                }
                const filePath = path.join(DATA_DIR, 'santos', '2026', `${date}.json`);
                if (!fs.existsSync(filePath)) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Arquivo não encontrado.' }));
                    return;
                }
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                let found = false;
                data.saints = (data.saints || []).map(s => {
                    if (s.name === saintName) {
                        found = true;
                        return { ...s, imageUrl: newImageUrl };
                    }
                    return s;
                });
                if (!found) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Santo não encontrado.' }));
                    return;
                }
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
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

// =======================================================
// ROTINA AUTOMÁTICA EM SEGUNDO PLANO (SCHEDULER LITÚRGICO)
// =======================================================
function scheduleAutomaticLiturgyCheck() {
    async function checkAndAutoUpdate() {
        if (global.isLiturgiaUpdating) return;
        const currentYear = new Date().getFullYear();
        const targets = [currentYear, currentYear + 1];
        const scriptPath = path.join(__dirname, 'scripts', 'atualizar-liturgia.mjs');

        for (const y of targets) {
            const yDir = path.join(__dirname, 'data', 'liturgia', String(y));
            const isLeap = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
            const expected = isLeap ? 366 : 365;
            let currentCount = 0;
            if (fs.existsSync(yDir)) {
                currentCount = fs.readdirSync(yDir).filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).length;
            }
            if (currentCount < expected) {
                console.log(`[LiturgiaAuto] Rotina de verificação: ano ${y} incompleto (${currentCount}/${expected}). Disparando download autônomo...`);
                global.isLiturgiaUpdating = true;
                const proc = spawn(process.execPath, [scriptPath, '--year', String(y)], { cwd: __dirname });
                proc.on('close', code => {
                    global.isLiturgiaUpdating = false;
                    console.log(`[LiturgiaAuto] Download autônomo do ano ${y} finalizado (código ${code})`);
                });
                break; // Processa um ano de cada vez
            }
        }
    }

    // Executa 45 segundos após o boot e repete a cada 24 horas
    setTimeout(checkAndAutoUpdate, 45 * 1000);
    setInterval(checkAndAutoUpdate, 24 * 60 * 60 * 1000);
}

scheduleAutomaticLiturgyCheck();
