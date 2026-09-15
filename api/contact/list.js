import { getMessagesDatabase } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();

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
