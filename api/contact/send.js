import { saveMessageToDatabase } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
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
      status: 'novo', // novo | lido | respondido
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
