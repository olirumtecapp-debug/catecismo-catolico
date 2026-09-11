import { updateMessageInDatabase } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { id, status, reply } = payload;

    if (!id) return res.status(400).json({ success: false, error: 'ID da mensagem é obrigatório.' });

    const updates = {};
    if (status) updates.status = status;
    if (reply) {
      updates.reply = reply;
      updates.repliedAt = new Date().toISOString();
      updates.status = 'respondido';
    }

    const updated = await updateMessageInDatabase(id, updates);
    if (!updated) return res.status(404).json({ success: false, error: 'Mensagem não encontrada.' });

    return res.status(200).json({ success: true, message: 'Mensagem atualizada com sucesso!' });
  } catch(err) {
    return res.status(500).json({ success: false, error: 'Erro ao atualizar: ' + err.message });
  }
}
