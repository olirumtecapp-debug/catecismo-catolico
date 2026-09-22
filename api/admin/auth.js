// /api/admin/auth — login e troca de senha do painel do Catecismo
//
// Uma unica funcao atende as tres necessidades, para nao estourar o limite de 12 funcoes
// do plano gratuito da Vercel:
//   GET                        -> informa se o dono ja criou uma senha propria
//   POST { action: 'login' }   -> valida a senha
//   POST { action: 'set-password', currentPassword, newPassword } -> troca a senha
//
// A senha fica no Firestore como HMAC-SHA256 com o segredo do servidor (ADMIN_AUTH_SECRET).
// Enquanto o dono nao criar a propria, vale a senha padrao que ja era usada.
import crypto from 'crypto';
import { getAdminAuth, saveAdminAuth } from '../_db.js';

const SENHA_PADRAO = '16Bl33@p';
const MIN_CARACTERES = 4;

function hashSenha(senha, segredo) {
    return crypto.createHmac('sha256', segredo).update(String(senha)).digest('hex');
}

function preparar(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store');
}

export default async function handler(req, res) {
    preparar(res);

    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    try {
        const auth = await getAdminAuth();
        const temSenhaPropria = !!(auth && auth.hash);
        const segredo = process.env.ADMIN_AUTH_SECRET || 'catecismo-catolico-auth-secret-key-2026';

        const body = req.method === 'POST'
            ? (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {}))
            : {};
        const acao = String(body.action || (req.method === 'GET' ? 'status' : 'login'));

        // ---- consulta de estado ----
        if (req.method === 'GET' || acao === 'status') {
            return res.status(200).json({
                ok: true,
                hasCustomPassword: temSenhaPropria,
                updatedAt: (auth && auth.updatedAt) || null
            });
        }

        if (!segredo) {
            return res.status(200).json({ ok: false, error: 'Servidor sem segredo configurado. Avise o suporte tecnico.' });
        }

        // ---- login ----
        if (acao === 'login') {
            const senha = String(body.password || '');
            const senhaOk = temSenhaPropria
                ? hashSenha(senha, segredo) === auth.hash
                : senha === SENHA_PADRAO;

            return res.status(200).json({
                ok: senhaOk,
                hasCustomPassword: temSenhaPropria,
                message: senhaOk ? 'Acesso liberado.' : 'Senha incorreta.'
            });
        }

        // ---- troca de senha ----
        if (acao === 'set-password') {
            const senhaAtual = String(body.currentPassword || '');
            const senhaNova = String(body.newPassword || '');

            if (senhaNova.trim().length < MIN_CARACTERES) {
                return res.status(200).json({ ok: false, error: 'A nova senha precisa ter ao menos ' + MIN_CARACTERES + ' caracteres.' });
            }

            const atualOk = temSenhaPropria
                ? hashSenha(senhaAtual, segredo) === auth.hash
                : senhaAtual === SENHA_PADRAO;

            if (!atualOk) return res.status(200).json({ ok: false, error: 'Senha atual incorreta.' });

            const gravou = await saveAdminAuth({
                hash: hashSenha(senhaNova.trim(), segredo),
                updatedAt: new Date().toISOString()
            });

            if (!gravou) return res.status(200).json({ ok: false, error: 'Falha ao gravar a nova senha.' });
            return res.status(200).json({ ok: true, hasCustomPassword: true, message: 'Senha atualizada com sucesso!' });
        }

        return res.status(200).json({ ok: false, error: 'Acao desconhecida: ' + acao });
    } catch (err) {
        return res.status(500).json({ ok: false, error: 'Erro no servidor: ' + err.message });
    }
}
