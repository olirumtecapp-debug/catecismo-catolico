import { getMessagesDatabase } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const db = await getMessagesDatabase();
    const messages = Array.isArray(db.messages) ? db.messages : [];
    
    return res.status(200).json({
      success: true,
      total: messages.length,
      unreadCount: messages.filter(m => m.status === 'novo').length,
      messages: messages
    });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Erro ao listar mensagens: ' + err.message });
  }
}
