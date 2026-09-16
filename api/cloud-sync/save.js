// POST /api/cloud-sync/save â€” grava o progresso do aluno do Catecismo na nuvem
//
// Inclui o padrao de acesso seguro:
//   - PIN opcional: quando existe, o progresso so e entregue com o PIN (ver load.js)
//   - Codigo de recuperacao: gerado na primeira gravacao e devolvido UMA vez
//   - action: 'recover': valida o codigo e devolve o progresso (permite trocar o PIN)
import crypto from 'crypto';
import { saveUserToDatabase, getDatabase } from '../_db.js';

function segredo() {
    return process.env.ADMIN_AUTH_SECRET || '';
}

function hash(valor) {
    return crypto.createHmac('sha256', segredo()).update(String(valor).trim()).digest('hex');
}

function gerarCodigo() {
    const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numeros = '23456789';
    let codigo = '';
    for (let i = 0; i < 3; i++) codigo += letras[crypto.randomInt(0, letras.length)];
    for (let i = 0; i < 3; i++) codigo += numeros[crypto.randomInt(0, numeros.length)];
    return codigo;
}

const NIVEIS = ['Iniciante', 'Peregrino', 'DiscÃ­pulo', 'Servo Fiel', 'GuardiÃ£o da FÃ©', 'ApÃ³stolo de Cristo'];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

    try {
        const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        const email = String(payload.email || '').trim().toLowerCase();

        if (!email || !email.includes('@') || !email.includes('.')) {
            return res.status(400).json({ success: false, error: 'E-mail invÃ¡lido fornecido.' });
        }

        const db = await getDatabase();
        const existente = db.users[email] || null;

        // ---- recuperacao pelo codigo ----
        if (payload.action === 'recover') {
            const codigo = String(payload.code || '').trim().toUpperCase().replace(/[\s-]/g, '');
            const novoPin = String(payload.newPin || '').trim();

            if (!existente) return res.status(200).json({ success: false, error: 'Conta nÃ£o encontrada com este e-mail.' });
            if (!existente.recoveryHash) return res.status(200).json({ success: false, error: 'Esta conta ainda nÃ£o tem cÃ³digo de recuperaÃ§Ã£o.' });
            if (!segredo()) return res.status(200).json({ success: false, error: 'Servidor sem segredo configurado.' });
            if (!codigo || hash(codigo) !== existente.recoveryHash) {
                return res.status(200).json({ success: false, error: 'CÃ³digo de recuperaÃ§Ã£o incorreto.' });
            }
            if (novoPin && !/^\d{4,6}$/.test(novoPin)) {
                return res.status(200).json({ success: false, error: 'O novo PIN deve ter de 4 a 6 dÃ­gitos.' });
            }

            const atualizado = { ...existente, updatedAt: new Date().toISOString() };
            if (novoPin) atualizado.pinHash = hash(novoPin);
            await saveUserToDatabase(email, atualizado);

            return res.status(200).json({
                success: true,
                message: novoPin ? 'Progresso recuperado e PIN atualizado!' : 'Progresso recuperado!',
                user: { email, xp: atualizado.xp, streak: atualizado.streak, level: atualizado.level, reflectionsCount: atualizado.reflectionsCount },
                appState: atualizado.appState || null,
                temPin: !!atualizado.pinHash
            });
        }

        // ---- gravacao normal ----
        const appState = payload.appState || {};
        const pinInformado = String(payload.pin || '').trim();
        if (pinInformado && !/^\d{4,6}$/.test(pinInformado)) {
            return res.status(200).json({ success: false, error: 'O PIN deve ter de 4 a 6 dÃ­gitos.' });
        }

        const nowIso = new Date().toISOString();
        const reflectionsCount = appState.lectioNotes ? Object.keys(appState.lectioNotes).length : 0;
        const xp = appState.xp || 0;
        const streak = appState.streak || 0;
        const levelName = NIVEIS[Math.min(Math.floor(xp / 150), NIVEIS.length - 1)];

        const userRecord = {
            email,
            updatedAt: nowIso,
            createdAt: (existente && existente.createdAt) || nowIso,
            xp,
            streak,
            level: levelName,
            reflectionsCount,
            appState
        };

        // preserva o que ja existia (o PATCH do banco substitui o registro inteiro)
        if (existente && existente.pinHash) userRecord.pinHash = existente.pinHash;
        if (existente && existente.recoveryHash) userRecord.recoveryHash = existente.recoveryHash;
        if (existente && existente.recoveryCreatedAt) userRecord.recoveryCreatedAt = existente.recoveryCreatedAt;

        let codigoNovo = null;
        if (pinInformado && segredo()) userRecord.pinHash = hash(pinInformado);
        if (!userRecord.recoveryHash && segredo()) {
            codigoNovo = gerarCodigo();
            userRecord.recoveryHash = hash(codigoNovo);
            userRecord.recoveryCreatedAt = nowIso;
        }

        await saveUserToDatabase(email, userRecord);

        const resposta = {
            success: true,
            message: 'Sincronizado na nuvem com sucesso!',
            temPin: !!userRecord.pinHash,
            user: { email, xp, streak, level: levelName, reflectionsCount, updatedAt: nowIso }
        };
        if (codigoNovo) {
            resposta.recoveryCode = codigoNovo;
            resposta.avisoCodigo = 'Guarde este cÃ³digo: Ã© com ele que vocÃª recupera seu progresso em outro aparelho.';
        }
        return res.status(200).json(resposta);
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Erro ao processar dados: ' + err.message });
    }
}
