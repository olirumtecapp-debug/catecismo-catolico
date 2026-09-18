// GET  /api/admin/broadcasts — lista comunicados publicados no mural do Catecismo
// POST /api/admin/broadcasts — cria novo comunicado ou exclui ({ id, action: 'delete' })
import { getBroadcastsDatabase, saveBroadcastToDatabase, deleteBroadcastInDatabase } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const db = await getBroadcastsDatabase();
      const broadcasts = (db && Array.isArray(db.broadcasts)) ? db.broadcasts : [];
      return res.status(200).json({
        success: true,
        ok: true,
        total: broadcasts.length,
        broadcasts
      });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const acao = String(body.action || '').trim();

      // Exclusão de comunicado
      if (acao === 'delete') {
        const id = String(body.id || '').trim();
        if (!id) return res.status(400).json({ success: false, ok: false, error: 'ID do comunicado não informado.' });

        const apagou = await deleteBroadcastInDatabase(id);
        if (!apagou) return res.status(404).json({ success: false, ok: false, error: 'Comunicado não encontrado.' });
        return res.status(200).json({ success: true, ok: true, deleted: true, message: 'Comunicado excluído com sucesso.' });
      }

      // Publicação de novo comunicado
      const { title, content, tag, sender } = body;
      if (!title || !String(title).trim() || !content || !String(content).trim()) {
        return res.status(400).json({ success: false, ok: false, error: 'Título e conteúdo da mensagem são obrigatórios.' });
      }

      const comunicado = {
        id: 'b_' + Date.now(),
        sender: String(sender || 'Coordenação Geral — Catecismo Católico').trim(),
        tag: String(tag || 'Comunicado').trim(),
        title: String(title).trim(),
        content: String(content).trim(),
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };

      const salvou = await saveBroadcastToDatabase(comunicado);
      if (!salvou) {
        return res.status(500).json({ success: false, ok: false, error: 'Falha ao gravar comunicado no banco de dados.' });
      }

      return res.status(200).json({
        success: true,
        ok: true,
        message: 'Comunicado publicado com sucesso!',
        broadcast: comunicado
      });
    }

    return res.status(405).json({ success: false, ok: false, error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ success: false, ok: false, error: 'Erro no servidor: ' + err.message });
  }
}
