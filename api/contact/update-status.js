// /api/contact/update-status — ciclo de vida da mensagem na caixa postal do Catecismo
//
// Aceita tanto o formato antigo ({ id, status, reply }) quanto as acoes novas:
//   action: read | archive | unarchive | delete
// Mantem uma unica funcao para nao estourar o limite de 12 funcoes do plano gratuito.
import { updateMessageInDatabase, deleteMessageInDatabase } from '../_db.js';

const ACOES = ['read', 'archive', 'unarchive', 'delete', 'hide-student', 'unhide-student', 'reply'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { id, status, reply } = payload;
    const acao = String(payload.action || '').trim();

    if (!id) return res.status(400).json({ success: false, error: 'ID da mensagem é obrigatório.' });
    if (acao && !ACOES.includes(acao)) {
      return res.status(400).json({ success: false, error: 'Ação inválida: ' + acao });
    }

    // exclusao definitiva
    if (acao === 'delete') {
      const apagou = await deleteMessageInDatabase(id);
      if (!apagou) return res.status(404).json({ success: false, error: 'Mensagem não encontrada.' });
      return res.status(200).json({ success: true, deleted: true, message: 'Mensagem excluída.' });
    }

    const updates = {};
    if (acao === 'read') { updates.status = 'lido'; updates.readAt = new Date().toISOString(); }
    if (acao === 'archive') { updates.status = 'arquivado'; updates.archivedAt = new Date().toISOString(); }
    if (acao === 'unarchive') updates.status = 'novo';

    // some da lista do fiel, mas continua no painel da coordenacao
    if (acao === 'hide-student') { updates.ocultadaParaAluno = true; updates.hiddenAt = new Date().toISOString(); }
    if (acao === 'unhide-student') updates.ocultadaParaAluno = false;

    if (acao === 'reply') {
      if (!reply || !String(reply).trim()) return res.status(400).json({ success: false, error: 'Escreva a resposta antes de enviar.' });
      updates.reply = String(reply).trim();
      updates.repliedAt = new Date().toISOString();
      updates.status = 'respondido';
    }

    if (status) updates.status = status;
    if (reply && !updates.reply) {
      updates.reply = reply;
      updates.repliedAt = new Date().toISOString();
      updates.status = 'respondido';
    }

    const updated = await updateMessageInDatabase(id, updates);
    if (!updated) return res.status(404).json({ success: false, error: 'Mensagem não encontrada.' });

    return res.status(200).json({ success: true, message: 'Mensagem atualizada com sucesso!' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Erro ao atualizar: ' + err.message });
  }
}
