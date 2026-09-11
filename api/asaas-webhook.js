// api/asaas-webhook.js - Webhook Oficial do Asaas para CATECISMO
let recentApprovals = globalThis.__catecismo_approvals || [];
globalThis.__catecismo_approvals = recentApprovals;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Content-Type, asaas-access-token');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 1. Consulta do frontend do Catecismo (GET) para verificar se a doação/apoio foi confirmada
  if (req.method === 'GET') {
    const { value } = req.query;
    const now = Date.now();
    
    // Procura aprovação recente (últimos 15 minutos)
    const match = recentApprovals.find(item => {
      const isFresh = (now - item.timestamp) < 15 * 60 * 1000;
      if (!isFresh) return false;
      if (value && Math.abs(parseFloat(item.value) - parseFloat(value)) < 0.1) return true;
      return true;
    });

    if (match) {
      return res.status(200).json({
        approved: true,
        event: match.event,
        paymentId: match.paymentId,
        value: match.value,
        customerName: match.customerName,
        timestamp: match.timestamp
      });
    }

    return res.status(200).json({ approved: false, message: 'Aguardando confirmação do Asaas' });
  }

  // 2. Notificação oficial do Asaas (POST)
  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const event = body.event;
      const payment = body.payment || {};

      console.log(`[Asaas Catecismo Webhook] Evento: ${event}, ID: ${payment.id}, Valor: ${payment.value}`);

      const isApprovedEvent = [
        'PAYMENT_RECEIVED',
        'PAYMENT_CONFIRMED',
        'PAYMENT_RECEIVED_IN_CASH'
      ].includes(event);

      if (isApprovedEvent) {
        const approvalRecord = {
          paymentId: payment.id,
          event: event,
          value: payment.value,
          customerName: payment.customer?.name || null,
          timestamp: Date.now()
        };

        recentApprovals.unshift(approvalRecord);
        if (recentApprovals.length > 50) recentApprovals.pop();
      }

      return res.status(200).json({ received: true });
    } catch (err) {
      console.error('[Asaas Catecismo Webhook] Erro:', err);
      return res.status(200).json({ received: true, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
