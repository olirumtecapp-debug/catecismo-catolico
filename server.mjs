import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import * as cheerio from 'cheerio';
import contactListHandler from './api/contact/list.js';
import contactSendHandler from './api/contact/send.js';
import contactUpdateStatusHandler from './api/contact/update-status.js';
import adminBroadcastsHandler from './api/admin/broadcasts.js';
import adminAuthHandler from './api/admin/auth.js';
import cloudSyncSaveHandler from './api/cloud-sync/save.js';
import cloudSyncLoadHandler from './api/cloud-sync/load.js';
import adminCommunityMetricsHandler from './api/admin/community-metrics.js';
import adminExportUsersCsvHandler from './api/admin/export-users-csv.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function handleServerlessFunction(handlerFn, req, res) {
    if (!res.status) {
        res.status = function(code) {
            res.statusCode = code;
            return res;
        };
    }
    if (!res.send) {
        res.send = function(data) {
            if (!res.headersSent) {
                res.writeHead(res.statusCode || 200);
            }
            res.end(data);
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

// ==========================================
// CONFIGURAÇÕES & HELPERS DE SANTOS E BACKUP
// ==========================================
const VATICAN_BASE = 'https://www.vaticannews.va/pt/santo-do-dia';
const BACKUP_DIR = path.join(DATA_DIR, 'santos', 'backups');
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function cleanText(v = '') {
    return String(v || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeSaintName(v = '') {
    let norm = cleanText(v).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    norm = norm
        .replace(/\b(s|sao|santo|santa|sta|sto|st)\b/gi, 'sao')
        .replace(/\b(beato|beata|bto|bta)\b/gi, 'beato')
        .replace(/[,;:.!?]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    return norm;
}

function backupSaintDayFile(filePath) {
    if (fs.existsSync(filePath)) {
        const filename = path.basename(filePath);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(BACKUP_DIR, `${filename.replace('.json', '')}_${timestamp}.json`);
        fs.copyFileSync(filePath, backupPath);
        return backupPath;
    }
    return null;
}

function parseVaticanPage(html, date) {
    const $ = cheerio.load(html);
    const saints = [];
    $('.section.section--evidence.section--isStatic').each((_, section) => {
        const $s = $(section);
        let name = cleanText($s.find('.section__head h2').first().text());
        if (!name) return;
        if (/^S\.\s+Edviges\b/i.test(name)) name = name.replace(/^S\.\s+/i, 'Santa ');
        else if (/^S\.\s+(Margarida Maria Alacoque)\b/i.test(name)) name = name.replace(/^S\.\s+/i, 'Santa ');
        else if (/^S\.\s+(Geraldo Majella)\b/i.test(name)) name = name.replace(/^S\.\s+/i, 'São ');
        else if (/^S\.\s+/.test(name)) name = name.replace(/^S\.\s+/, /\b(virgem|religiosa|freira|duquesa|rainha|abadessa|madre)\b/i.test(name) ? 'Santa ' : 'São ');
        
        let profileHref = $s.find('a.saintReadMore[href]').first().attr('href') || null;
        if (profileHref && !profileHref.startsWith('http')) profileHref = `https://www.vaticannews.va${profileHref}`;
        
        const sourceText = cleanText($s.find('.section__content p').first().text()) || null;
        saints.push({
            date,
            name,
            normalizedName: normalizeSaintName(name),
            profileUrl: profileHref,
            source: 'Vatican News',
            sourceUrl: profileHref,
            sourceText
        });
    });
    return saints;
}

async function fetchVaticanSaintsForDate(date) {
    const parts = date.split('-');
    const m = parts[1];
    const d = parts[2];
    const url = `${VATICAN_BASE}/${m}/${d}.html`;
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            signal: AbortSignal.timeout(7000)
        });
        if (!res.ok) return [];
        const html = await res.text();
        return parseVaticanPage(html, date);
    } catch(e) {
        return [];
    }
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
    if (pathname === '/api/admin/community-metrics') {
        return handleServerlessFunction(adminCommunityMetricsHandler, req, res);
    }

    // ==========================================
    // 4. API: EXPORTAR LISTA DE USUÁRIOS EM CSV
    // ==========================================
    if (pathname === '/api/admin/export-users-csv') {
        return handleServerlessFunction(adminExportUsersCsvHandler, req, res);
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
    // API: ADICIONAR NOVO SANTO AO CATÁLOGO
    // ==========================================
    if (pathname === '/api/admin/add-saint' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { date, name, sourceText, source } = JSON.parse(body);
                if (!date || !name) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ success: false, error: 'Data e Nome do santo são obrigatórios.' }));
                    return;
                }
                const parts = date.split('-');
                if (parts.length !== 3) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ success: false, error: 'Formato de data inválido. Use AAAA-MM-DD.' }));
                    return;
                }
                const [year, month, day] = parts.map(Number);
                const dirPath = path.join(DATA_DIR, 'santos', String(year));
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                }
                const filePath = path.join(dirPath, `${date}.json`);
                let dayData = {
                    date,
                    year,
                    month,
                    day,
                    source: source || 'Vatican News',
                    calendarUrl: `https://www.vaticannews.va/pt/santo-do-dia/${String(month).padStart(2,'0')}/${String(day).padStart(2,'0')}.html`,
                    liturgicalCelebration: null,
                    saints: []
                };

                if (fs.existsSync(filePath)) {
                    dayData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    if (!Array.isArray(dayData.saints)) dayData.saints = [];
                }

                // Verificar se já existe santo com o mesmo nome nessa data
                const exists = dayData.saints.some(s => s.name && s.name.trim().toLowerCase() === name.trim().toLowerCase());
                if (exists) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ success: false, error: 'Este santo já está cadastrado nesta data!' }));
                    return;
                }

                const newSaint = {
                    date,
                    name: name.trim(),
                    normalizedName: name.trim().toLowerCase(),
                    imageUrl: '',
                    profileUrl: null,
                    source: source || 'Curadoria Manual',
                    sourceUrl: null,
                    sourceText: sourceText ? sourceText.trim() : null
                };

                dayData.saints.push(newSaint);
                fs.writeFileSync(filePath, JSON.stringify(dayData, null, 2), 'utf8');

                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: true, saint: newSaint, message: `Santo "${name}" adicionado com sucesso ao dia ${date}!` }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // ==========================================
    // API: VERIFICAR ATUALIZAÇÕES NO VATICANO (SOMENTE LEITURA / INSPEÇÃO)
    // ==========================================
    if (pathname === '/api/admin/check-vatican-updates' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { month, date } = JSON.parse(body || '{}');
                let targetDates = [];
                if (date && date !== 'all') {
                    targetDates = [date];
                } else if (month && month !== 'all') {
                    const m = String(month).padStart(2, '0');
                    const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][parseInt(m, 10)] || 31;
                    for (let d = 1; d <= daysInMonth; d++) {
                        targetDates.push(`2026-${m}-${String(d).padStart(2, '0')}`);
                    }
                } else {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ success: false, error: 'Selecione um mês ou um dia específico para verificar.' }));
                    return;
                }

                const newSaintsFound = [];
                let checkedDays = 0;

                for (const dt of targetDates) {
                    checkedDays++;
                    const remoteSaints = await fetchVaticanSaintsForDate(dt);
                    if (!remoteSaints.length) continue;

                    const filePath = path.join(DATA_DIR, 'santos', '2026', `${dt}.json`);
                    let localSaints = [];
                    if (fs.existsSync(filePath)) {
                        try {
                            const ld = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                            localSaints = ld.saints || [];
                        } catch(e) {}
                    }

                    for (const rs of remoteSaints) {
                        const localMatch = localSaints.find(ls => {
                            const normR = normalizeSaintName(rs.name);
                            const normL = normalizeSaintName(ls.name);
                            return normR === normL || normR.includes(normL) || normL.includes(normR);
                        });

                        if (!localMatch) {
                            newSaintsFound.push({
                                type: 'new_saint',
                                date: dt,
                                name: rs.name,
                                sourceText: rs.sourceText,
                                profileUrl: rs.profileUrl,
                                source: 'Vatican News'
                            });
                        }
                    }
                }

                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({
                    success: true,
                    checkedDays,
                    foundCount: newSaintsFound.length,
                    newSaints: newSaintsFound,
                    message: newSaintsFound.length 
                        ? `Varredura concluída: ${newSaintsFound.length} novidade(s) encontrada(s) no Vatican News!`
                        : `Tudo 100% atualizado! Nenhum santo novo encontrado no Vatican News para os ${checkedDays} dia(s) verificado(s).`
                }));
            } catch(err) {
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // ==========================================
    // API: APLICAR ATUALIZAÇÃO DO VATICANO (COM BACKUP AUTOMÁTICO)
    // ==========================================
    if (pathname === '/api/admin/apply-vatican-update' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { saints } = JSON.parse(body || '{}');
                if (!Array.isArray(saints) || saints.length === 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ success: false, error: 'Nenhum santo informado para inclusão.' }));
                    return;
                }

                let applied = 0;
                for (const s of saints) {
                    const { date, name, sourceText, source } = s;
                    if (!date || !name) continue;

                    const filePath = path.join(DATA_DIR, 'santos', '2026', `${date}.json`);
                    
                    // Backup automático antes de mexer
                    backupSaintDayFile(filePath);

                    let dayData = {
                        date,
                        year: 2026,
                        month: parseInt(date.split('-')[1], 10),
                        day: parseInt(date.split('-')[2], 10),
                        source: 'Vatican News',
                        saints: []
                    };

                    if (fs.existsSync(filePath)) {
                        try {
                            dayData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                            if (!Array.isArray(dayData.saints)) dayData.saints = [];
                        } catch(e) {}
                    }

                    // Verifica se já existe para não duplicar
                    const normNew = normalizeSaintName(name);
                    const exists = dayData.saints.some(ex => normalizeSaintName(ex.name) === normNew);
                    if (!exists) {
                        dayData.saints.push({
                            date,
                            name: name.trim(),
                            normalizedName: normNew,
                            imageUrl: '',
                            profileUrl: s.profileUrl || null,
                            source: source || 'Vatican News',
                            sourceUrl: s.profileUrl || null,
                            sourceText: sourceText ? sourceText.trim() : null
                        });
                        fs.writeFileSync(filePath, JSON.stringify(dayData, null, 2), 'utf8');
                        applied++;
                    }
                }

                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ 
                    success: true, 
                    appliedCount: applied,
                    message: `${applied} santo(s) adicionado(s) com sucesso com backup de segurança gerado!`
                }));
            } catch(err) {
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // ==========================================
    // API: LISTAR BACKUPS DE SANTOS
    // ==========================================
    if (pathname === '/api/admin/list-saint-backups' && req.method === 'GET') {
        try {
            if (!fs.existsSync(BACKUP_DIR)) {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: true, backups: [] }));
                return;
            }
            const dateParam = reqUrl.searchParams.get('date');
            let files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json'));
            if (dateParam && dateParam !== 'all') {
                files = files.filter(f => f.startsWith(`${dateParam}_`));
            }
            files.sort().reverse();
            const backups = files.slice(0, 30).map(file => {
                const stat = fs.statSync(path.join(BACKUP_DIR, file));
                const parts = file.replace('.json', '').split('_');
                const date = parts[0];
                const rawTime = parts.slice(1).join('_');
                return {
                    file,
                    date,
                    rawTime,
                    size: stat.size,
                    mtime: stat.mtime
                };
            });
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: true, backups }));
        } catch(err) {
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    // ==========================================
    // API: RESTAURAR BACKUP DE SANTOS
    // ==========================================
    if (pathname === '/api/admin/restore-saint-backup' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { date, backupFile } = JSON.parse(body || '{}');
                if (!date && !backupFile) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ success: false, error: 'Data ou arquivo de backup não informado.' }));
                    return;
                }

                let targetBackupPath = null;
                let targetDate = date;

                if (backupFile) {
                    targetBackupPath = path.join(BACKUP_DIR, backupFile);
                    if (!fs.existsSync(targetBackupPath)) {
                        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify({ success: false, error: `Arquivo de backup ${backupFile} não encontrado.` }));
                        return;
                    }
                    targetDate = backupFile.split('_')[0];
                } else {
                    const prefix = `${date}_`;
                    const files = fs.readdirSync(BACKUP_DIR)
                        .filter(f => f.startsWith(prefix) && f.endsWith('.json'))
                        .sort()
                        .reverse(); // mais recente primeiro

                    if (!files.length) {
                        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify({ success: false, error: `Nenhum backup encontrado para a data ${date}.` }));
                        return;
                    }
                    targetBackupPath = path.join(BACKUP_DIR, files[0]);
                }

                const targetFile = path.join(DATA_DIR, 'santos', '2026', `${targetDate}.json`);
                fs.copyFileSync(targetBackupPath, targetFile);

                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ 
                    success: true, 
                    message: `Backup restaurado com sucesso para ${targetDate} a partir de ${path.basename(targetBackupPath)}!` 
                }));
            } catch(err) {
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // ==========================================
    // API: PUBLICAR NO VERCEL (GIT COMMIT & PUSH)
    // ==========================================
    if (pathname === '/api/admin/publish-to-vercel' && req.method === 'POST') {
        const GIT_BIN = fs.existsSync('C:\\Program Files\\Verdent\\resources\\app.asar.unpacked\\node_modules\\dugite\\git\\cmd\\git.exe')
            ? 'C:\\Program Files\\Verdent\\resources\\app.asar.unpacked\\node_modules\\dugite\\git\\cmd\\git.exe'
            : 'git';

        const runGit = (args) => new Promise((resolve, reject) => {
            const child = spawn(GIT_BIN, args, { cwd: __dirname });
            let stdout = '', stderr = '';
            child.stdout.on('data', d => stdout += d);
            child.stderr.on('data', d => stderr += d);
            child.on('close', code => {
                if (code === 0) resolve(stdout);
                else reject(new Error(stderr || stdout || `Código de saída ${code}`));
            });
            child.on('error', reject);
        });

        (async () => {
            try {
                await runGit(['add', '-A']);
                let committed = false;
                try {
                    await runGit(['commit', '-m', `feat(santos): atualizar imagens e curadoria de santos [${new Date().toLocaleDateString('pt-BR')}]`]);
                    committed = true;
                } catch(commitErr) {
                    const msg = (commitErr.message || '').toLowerCase();
                    const isNothing = msg.includes('nothing') || msg.includes('no changes') || msg.includes('nada') || msg.includes('limp') || msg.includes('clean');
                    if (!isNothing) {
                        throw commitErr;
                    }
                }
                const pushOut = await runGit(['push', 'origin', 'main']);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ 
                    success: true, 
                    message: committed ? 'Atualizações enviadas com sucesso para a Vercel! O site estará atualizado em instantes.' : 'Tudo já estava atualizado na nuvem!',
                    output: pushOut
                }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        })();
        return;
    }

    // ==========================================
    // API: PUXAR DA NUVEM (GIT PULL / BACKUP)
    // ==========================================
    if (pathname === '/api/admin/pull-from-vercel' && req.method === 'POST') {
        const GIT_BIN = fs.existsSync('C:\\Program Files\\Verdent\\resources\\app.asar.unpacked\\node_modules\\dugite\\git\\cmd\\git.exe')
            ? 'C:\\Program Files\\Verdent\\resources\\app.asar.unpacked\\node_modules\\dugite\\git\\cmd\\git.exe'
            : 'git';

        const runGit = (args) => new Promise((resolve, reject) => {
            const child = spawn(GIT_BIN, args, { cwd: __dirname });
            let stdout = '', stderr = '';
            child.stdout.on('data', d => stdout += d);
            child.stderr.on('data', d => stderr += d);
            child.on('close', code => {
                if (code === 0) resolve(stdout);
                else reject(new Error(stderr || stdout || `Código de saída ${code}`));
            });
            child.on('error', reject);
        });

        (async () => {
            try {
                const pullOut = await runGit(['pull', 'origin', 'main']);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ 
                    success: true, 
                    message: 'Backup e sincronização concluídos com sucesso!',
                    output: pullOut
                }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        })();
        return;
    }
    // 5. SERVIDOR DE ARQUIVOS ESTÁTICOS
    // ==========================================
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
    if (pathname === '/auditoria') filePath = path.join(__dirname, 'auditoria.html');
    if (pathname === '/preceitos') filePath = path.join(__dirname, 'preceitos.html');

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
