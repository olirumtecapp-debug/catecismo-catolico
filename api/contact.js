// api/contact.js — Gestão completa da Caixa Postal (Envio, Listagem e Ciclo de Vida)
// Unificado para manter o limite de funções Serverless da Vercel (plano Hobby).
import { getMessagesDatabase, saveMessageToDatabase, updateMessageInDatabase, deleteMessageInDatabase } from './_db.js';

const ACOES = ['read', 'archive', 'unarchive', 'delete', 'hide-student', 'unhide-student', 'reply'];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'OPTIONS') return res.status(204).end();

    // 1. GET: Listagem de mensagens para a coordenação / painel admin
    if (req.method === 'GET') {
        try {
            const db = await getMessagesDatabase();
            const messages = Array.isArray(db.messages) ? db.messages : [];

            const byStatus = { novo: 0, lido: 0, respondido: 0, arquivado: 0 };
            messages.forEach(m => {
                const st = m.status || 'novo';
                if (byStatus[st] !== undefined) byStatus[st]++;
                else byStatus.novo++;
            });

            return res.status(200).json({
                success: true,
                total: messages.length,
                unreadCount: byStatus.novo,
                byStatus,
                messages: messages
            });
        } catch(err) {
            return res.status(500).json({ success: false, error: 'Erro ao listar mensagens: ' + err.message });
        }
    }

    // 2. POST: Pode ser envio de nova mensagem OU atualização de status
    if (req.method === 'POST') {
        try {
            const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
            const acao = String(payload.action || '').trim();

            // CASO A: Atualização de status ou exclusão (update-status)
            if (payload.id && (acao || payload.status !== undefined || payload.reply !== undefined)) {
                const id = payload.id;
                if (acao && !ACOES.includes(acao)) {
                    return res.status(400).json({ success: false, error: 'Ação inválida: ' + acao });
                }

                // Exclusão definitiva
                if (acao === 'delete') {
                    const apagou = await deleteMessageInDatabase(id);
                    if (!apagou) return res.status(404).json({ success: false, error: 'Mensagem não encontrada.' });
                    return res.status(200).json({ success: true, deleted: true, message: 'Mensagem excluída.' });
                }

                const updates = {};
                if (acao === 'read') { updates.status = 'lido'; updates.readAt = new Date().toISOString(); }
                if (acao === 'archive') { updates.status = 'arquivado'; updates.archivedAt = new Date().toISOString(); }
                if (acao === 'unarchive') updates.status = 'novo';
                if (acao === 'hide-student') { updates.ocultadaParaAluno = true; updates.hiddenAt = new Date().toISOString(); }
                if (acao === 'unhide-student') updates.ocultadaParaAluno = false;

                if (acao === 'reply') {
                    const textoResposta = String(payload.replyText || payload.reply || '').trim();
                    if (!textoResposta) return res.status(400).json({ success: false, error: 'Texto da resposta é obrigatório.' });
                    updates.status = 'respondido';
                    updates.repliedAt = new Date().toISOString();
                    updates.reply = {
                        text: textoResposta,
                        author: String(payload.author || 'Coordenação Catecismo Católico').trim(),
                        at: new Date().toISOString()
                    };
                }

                if (!acao) {
                    if (payload.status) updates.status = payload.status;
                    if (payload.reply !== undefined) updates.reply = payload.reply;
                    updates.updatedAt = new Date().toISOString();
                }

                const ok = await updateMessageInDatabase(id, updates);
                if (!ok) return res.status(404).json({ success: false, error: 'Mensagem não encontrada ou falha ao atualizar.' });
                return res.status(200).json({ success: true, message: 'Mensagem atualizada.', updates });
            }

            // CASO B: Envio de nova mensagem pelos fiéis (send)
            const { name, email, type, subject, message } = payload;
            if (!email || !email.includes('@')) {
                return res.status(400).json({ success: false, error: 'E-mail válido é obrigatório.' });
            }
            if (!message || message.trim().length < 5) {
                return res.status(400).json({ success: false, error: 'Mensagem deve conter ao menos 5 caracteres.' });
            }

            const msgRecord = {
                id: 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
                name: (name || 'Fiel Católico').trim(),
                email: email.trim().toLowerCase(),
                type: type || 'Dúvida',
                subject: (subject || 'Contato pelo site').trim(),
                message: message.trim(),
                status: 'novo',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                reply: null
            };

            const saved = await saveMessageToDatabase(msgRecord);
            if (!saved) {
                return res.status(500).json({ success: false, error: 'Falha ao gravar mensagem na nuvem.' });
            }

            return res.status(200).json({
                success: true,
                message: 'Mensagem enviada com sucesso para a equipe pastoral e técnica!',
                data: msgRecord
            });
        } catch (err) {
            return res.status(500).json({ success: false, error: 'Erro no servidor: ' + err.message });
        }
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
}
