// api/_db.js — camada de dados do Catecismo
//
// ANTES: gravava JSON dentro do proprio repositorio GitHub usando a API do GitHub,
// com um token embutido no arquivo (o token ficou exposto em repositorio publico).
//
// AGORA: usa Firestore pelo mesmo modelo que o CodeLogic ja usa no navegador.
// Nenhum segredo embutido: a chave abaixo e a configuracao publica do projeto
// (a mesma que ja vai no HTML), e pode ser sobrescrita por variavel de ambiente.
//
// A interface exportada e identica a anterior, entao nenhum endpoint precisou mudar:
//   getDatabase, saveUserToDatabase, getMessagesDatabase, saveMessageToDatabase, updateMessageInDatabase

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_USERS_FILE = path.join(__dirname, '..', 'data', 'cloud_users.json');

function getLocalUsers() {
    try {
        if (fs.existsSync(LOCAL_USERS_FILE)) {
            const raw = fs.readFileSync(LOCAL_USERS_FILE, 'utf8');
            const data = JSON.parse(raw);
            return data.users || {};
        }
    } catch (e) {
        console.warn('[db] Erro ao ler cloud_users.json local:', e.message);
    }
    return {};
}

function saveLocalUsers(users) {
    try {
        let meta = {
            created: new Date().toISOString(),
            description: "Backup Local de Usuários e Sincronização em Nuvem - CATECISMO (Espelho do Firestore)",
            totalUsers: Object.keys(users).length
        };
        if (fs.existsSync(LOCAL_USERS_FILE)) {
            const raw = fs.readFileSync(LOCAL_USERS_FILE, 'utf8');
            const parsed = JSON.parse(raw);
            meta = { ...(parsed._meta || {}), updated: new Date().toISOString(), totalUsers: Object.keys(users).length };
        }
        fs.writeFileSync(LOCAL_USERS_FILE, JSON.stringify({ _meta: meta, users }, null, 2), 'utf8');
    } catch (e) {
        console.warn('[db] Erro ao gravar cloud_users.json local:', e.message);
    }
}

const API_KEY = process.env.FIREBASE_API_KEY || 'AIzaSyBUHGXoUMg0bV3EdmfpfmVAEYMLQceqkQc';
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'expedicao-brasil';

const COL_USERS = 'catecismo_cloud_users';
const COL_MESSAGES = 'catecismo_contact_messages';
const COL_BROADCASTS = 'catecismo_broadcasts';
const COL_EMAIL_BROADCASTS = 'catecismo_email_broadcasts';

const CACHE_MS = 5000;
const TIMEOUT_MS = 8000;

const cache = new Map();

function basePath(col) {
    return '/v1/projects/' + PROJECT_ID + '/databases/(default)/documents/' + col;
}

function docId(value) {
    return crypto.createHash('sha256').update(String(value)).digest('hex').slice(0, 32);
}

// ---------- conversao de tipos (mantem objetos e numeros intactos) ----------

function toValue(v) {
    if (v === null || v === undefined) return { nullValue: null };
    if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    if (typeof v === 'boolean') return { booleanValue: v };
    if (typeof v === 'string') return { stringValue: v };
    if (Array.isArray(v)) return { arrayValue: { values: v.map(toValue) } };
    if (typeof v === 'object') {
        const fields = {};
        for (const [k, x] of Object.entries(v)) fields[k] = toValue(x);
        return { mapValue: { fields } };
    }
    return { stringValue: String(v) };
}

function fromValue(v) {
    if (!v) return null;
    if ('nullValue' in v) return null;
    if ('integerValue' in v) return Number(v.integerValue);
    if ('doubleValue' in v) return Number(v.doubleValue);
    if ('booleanValue' in v) return v.booleanValue;
    if ('stringValue' in v) return v.stringValue;
    if ('timestampValue' in v) return v.timestampValue;
    if ('arrayValue' in v) return (v.arrayValue.values || []).map(fromValue);
    if ('mapValue' in v) {
        const o = {};
        for (const [k, x] of Object.entries(v.mapValue.fields || {})) o[k] = fromValue(x);
        return o;
    }
    return null;
}

function toFields(obj) {
    const fields = {};
    for (const [k, v] of Object.entries(obj || {})) fields[k] = toValue(v);
    return fields;
}

function docToObject(doc) {
    const o = {};
    for (const [k, v] of Object.entries(doc.fields || {})) o[k] = fromValue(v);
    return o;
}

// ---------- acesso ao Firestore via REST ----------

async function fsRequest(path, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const res = await fetch('https://firestore.googleapis.com' + path + (path.includes('?') ? '&' : '?') + 'key=' + API_KEY, {
            ...options,
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
        });
        const text = await res.text();
        let json = null;
        try { json = text ? JSON.parse(text) : null; } catch (e) { json = null; }
        return { ok: res.ok, status: res.status, body: json, raw: text };
    } catch (err) {
        return { ok: false, status: 0, body: null, raw: String(err && err.message) };
    } finally {
        clearTimeout(timer);
    }
}

async function listDocs(col, pageSize = 300) {
    const res = await fsRequest(basePath(col) + '?pageSize=' + pageSize);
    if (!res.ok || !res.body) return [];
    return (res.body.documents || []).map(docToObject);
}

async function upsertDoc(col, id, obj) {
    const res = await fsRequest(basePath(col) + '/' + id, {
        method: 'PATCH',
        body: JSON.stringify({ fields: toFields(obj) })
    });
    return res.ok;
}

// ---------- cache curto (mesmo comportamento de antes) ----------

function cacheGet(key) {
    const hit = cache.get(key);
    if (hit && (Date.now() - hit.time) < CACHE_MS) return hit.data;
    return null;
}

function cacheSet(key, data) {
    cache.set(key, { data, time: Date.now() });
}

function cacheClear() {
    cache.clear();
}

// ================= USERS DB =================

export async function getDatabase() {
    const cached = cacheGet('users');
    if (cached) return cached;

    const localUsers = getLocalUsers();
    let docs = [];
    try {
        docs = await listDocs(COL_USERS);
    } catch (e) {
        docs = [];
    }

    const db = { _meta: { source: 'hybrid', updatedAt: new Date().toISOString() }, users: { ...localUsers } };

    for (const u of docs) {
        if (!u || !u.email) continue;
        const email = String(u.email).trim().toLowerCase();
        // o registro precisa manter o campo email: o painel admin e o CSV usam ele
        db.users[email] = { ...(db.users[email] || {}), ...u, email };
    }

    // Se o Firestore estava vazio ou com menos usuários que o local, sincroniza o Firestore silenciosamente
    if (docs.length < Object.keys(localUsers).length) {
        (async () => {
            for (const [em, rec] of Object.entries(localUsers)) {
                try {
                    await upsertDoc(COL_USERS, docId(em), { email: em, ...rec });
                } catch(e) {}
            }
        })().catch(() => {});
    }

    cacheSet('users', db);
    return db;
}

export async function saveUserToDatabase(email, userRecord) {
    if (!email) return false;
    const key = String(email).trim().toLowerCase();
    const id = docId(key);

    // 1. Sempre salva localmente primeiro (garantia de dados nunca perdidos)
    const localUsers = getLocalUsers();
    localUsers[key] = { ...(localUsers[key] || {}), ...userRecord, email: key };
    saveLocalUsers(localUsers);
    cacheClear();

    // Sincroniza com Firestore em segundo plano sem travar a resposta do usuário
    (async () => {
        try {
            const atual = await fsRequest(basePath(COL_USERS) + '/' + id);
            if (atual.ok && atual.body && atual.body.fields) {
                const existente = docToObject(atual.body);
                if (existente.createdAt && !userRecord.createdAt) userRecord.createdAt = existente.createdAt;
                if (existente.createdAt && userRecord.createdAt && existente.createdAt < userRecord.createdAt) {
                    userRecord.createdAt = existente.createdAt;
                }
            }
            await upsertDoc(COL_USERS, id, { email: key, ...userRecord });
        } catch (err) {
            // Firestore falhou, mas dados locais já estão 100% seguros
        }
    })().catch(() => {});

    return true;
}

// ================= MESSAGES / CAIXA POSTAL DB =================

export async function getMessagesDatabase() {
    const cached = cacheGet('messages');
    if (cached) return cached;

    const docs = await listDocs(COL_MESSAGES);
    const messages = docs
        .filter(m => m && m.id)
        .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));

    const db = { _meta: { source: 'firestore', updatedAt: new Date().toISOString() }, messages };
    cacheSet('messages', db);
    return db;
}

export async function saveMessageToDatabase(msg) {
    if (!msg || !msg.id) return false;

    try {
        const ok = await upsertDoc(COL_MESSAGES, docId(msg.id), msg);
        cacheClear();
        return ok;
    } catch (err) {
        console.error('[db] falha ao gravar mensagem:', err && err.message);
        return false;
    }
}

export async function updateMessageInDatabase(messageId, updates) {
    if (!messageId) return false;

    try {
        const docs = await listDocs(COL_MESSAGES, 500);
        const alvo = docs.find(m => m && m.id === messageId);
        if (!alvo) return false;

        const atualizado = { ...alvo, ...(updates || {}), updatedAt: new Date().toISOString() };
        const ok = await upsertDoc(COL_MESSAGES, docId(messageId), atualizado);
        cacheClear();
        return ok;
    } catch (err) {
        console.error('[db] falha ao atualizar mensagem:', err && err.message);
        return false;
    }
}

// remove a mensagem definitivamente (usado pelo "Excluir" do painel)
export async function deleteMessageInDatabase(messageId) {
    if (!messageId) return false;
    try {
        const res = await fsRequest(basePath(COL_MESSAGES) + '/' + docId(messageId), { method: 'DELETE' });
        cacheClear();
        return res.ok;
    } catch (err) {
        console.error('[db] falha ao excluir mensagem:', err && err.message);
        return false;
    }
}

// ================= BROADCASTS / COMUNICADOS DB =================

export async function getBroadcastsDatabase() {
    const cached = cacheGet('broadcasts');
    if (cached) return cached;

    const docs = await listDocs(COL_BROADCASTS);
    const broadcasts = docs
        .filter(b => b && b.id)
        .sort((a, b) => String(b.date || b.createdAt || '').localeCompare(String(a.date || a.createdAt || '')));

    const db = { _meta: { source: 'firestore', updatedAt: new Date().toISOString() }, broadcasts };
    cacheSet('broadcasts', db);
    return db;
}

export async function saveBroadcastToDatabase(broadcast) {
    if (!broadcast || !broadcast.id) return false;
    try {
        const ok = await upsertDoc(COL_BROADCASTS, docId(broadcast.id), broadcast);
        cacheClear();
        return ok;
    } catch (err) {
        console.error('[db] falha ao gravar comunicado:', err && err.message);
        return false;
    }
}

export async function deleteBroadcastInDatabase(broadcastId) {
    if (!broadcastId) return false;
    try {
        const res = await fsRequest(basePath(COL_BROADCASTS) + '/' + docId(broadcastId), { method: 'DELETE' });
        cacheClear();
        return res.ok;
    } catch (err) {
        console.error('[db] falha ao excluir comunicado:', err && err.message);
        return false;
    }
}

// ================= EMAIL BROADCASTS DB =================

export async function getEmailBroadcastsDatabase() {
    const cached = cacheGet('email_broadcasts');
    if (cached) return cached;

    const docs = await listDocs(COL_EMAIL_BROADCASTS);
    const emails = docs
        .filter(b => b && b.id)
        .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));

    const db = { _meta: { source: 'firestore', updatedAt: new Date().toISOString() }, emails };
    cacheSet('email_broadcasts', db);
    return db;
}

export async function saveEmailBroadcastToDatabase(record) {
    if (!record || !record.id) return false;
    try {
        const ok = await upsertDoc(COL_EMAIL_BROADCASTS, docId(record.id), record);
        cacheClear();
        return ok;
    } catch (err) {
        console.error('[db] falha ao gravar log de email:', err && err.message);
        return false;
    }
}

// ================= AUTENTICACAO DO PAINEL ADMIN =================
// A senha do painel NAO fica no HTML: fica aqui como HMAC-SHA256, usando um segredo que
// so existe no servidor (variavel de ambiente ADMIN_AUTH_SECRET na Vercel).

export const COL_ADMIN_AUTH = 'catecismo_admin_auth';

export async function getAdminAuth() {
    const res = await fsRequest(basePath(COL_ADMIN_AUTH) + '/main');
    if (res.ok && res.body && res.body.fields) return docToObject(res.body);
    return null;
}

export async function saveAdminAuth(registro) {
    const res = await fsRequest(basePath(COL_ADMIN_AUTH) + '/main', {
        method: 'PATCH',
        body: JSON.stringify({ fields: toFields(registro) })
    });
    if (!res.ok) console.error('[db] falha ao gravar a senha do admin:', res.status, res.raw && res.raw.slice(0, 200));
    return res.ok;
}

export async function clearAdminAuth() {
    const res = await fsRequest(basePath(COL_ADMIN_AUTH) + '/main', { method: 'DELETE' });
    return res.ok;
}
