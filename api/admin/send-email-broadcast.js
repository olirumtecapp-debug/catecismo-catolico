// api/admin/send-email-broadcast.js — Disparo de e-mails para fiéis cadastrados no Catecismo Católico
import { getDatabase, getEmailBroadcastsDatabase, saveEmailBroadcastToDatabase } from '../_db.js';
import { enviarEmail, emailConfigurado } from '../_email.js';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://catecismo.creativeam.com.br';

export function buildCatholicEmailHtml({
    title = 'Novidades no Catecismo Católico',
    subtitle = 'Grandes melhorias em nossa plataforma devocional',
    greeting = 'Paz e bem no Senhor Jesus!',
    paragraphs = [],
    highlights = [],
    ctaText = 'Acessar o Catecismo & Rezar Agora',
    ctaUrl = SITE_URL,
    closing = 'Que a graça e a paz de Nosso Senhor Jesus Cristo estejam sempre com você e sua família.'
}) {
    const highlightsHtml = (highlights && highlights.length > 0) ? `
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px 24px; margin: 24px 0;">
            <p style="margin: 0 0 14px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #b45309;">
                ✨ O que há de novo para você:
            </p>
            <div style="margin: 0;">
                ${highlights.map(h => `
                    <div style="display: flex; margin-bottom: 14px; align-items: flex-start;">
                        <span style="font-size: 18px; line-height: 24px; margin-right: 12px; display: inline-block;">${h.icon || '🕊️'}</span>
                        <div style="font-size: 14px; line-height: 22px; color: #334155;">
                            <strong style="color: #0f172a;">${h.title}:</strong> ${h.description}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    ` : '';

    const paragraphsHtml = (paragraphs || []).map(p => `
        <p style="margin: 0 0 16px; font-size: 15px; line-height: 26px; color: #334155;">
            ${p}
        </p>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 32px 16px;">
        <tr>
            <td align="center">
                <!-- Card Principal -->
                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);">
                    
                    <!-- Topo Solene Dourado -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); padding: 36px 32px 28px; text-align: center; border-bottom: 4px solid #f59e0b;">
                            <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; background-color: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 14px; font-size: 24px; margin-bottom: 12px;">
                                🕊️
                            </div>
                            <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px;">
                                Catecismo Católico
                            </h1>
                            <p style="margin: 4px 0 0; font-size: 12px; color: #fbbf24; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                                Escola da Fé & Espiritualidade Diária
                            </p>
                        </td>
                    </tr>

                    <!-- Conteúdo Central -->
                    <tr>
                        <td style="padding: 36px 32px 28px;">
                            
                            <!-- Saudação -->
                            <p style="margin: 0 0 12px; font-size: 13px; font-weight: 700; color: #b45309; text-transform: uppercase; letter-spacing: 1px;">
                                ${greeting}
                            </p>

                            <!-- Título da Mensagem -->
                            <h2 style="margin: 0 0 8px; font-size: 22px; font-weight: 800; color: #0f172a; line-height: 30px;">
                                ${title}
                            </h2>

                            ${subtitle ? `
                                <p style="margin: 0 0 24px; font-size: 15px; color: #64748b; line-height: 22px;">
                                    ${subtitle}
                                </p>
                            ` : ''}

                            <!-- Parágrafos do Conteúdo -->
                            ${paragraphsHtml}

                            <!-- Destaques / Novidades -->
                            ${highlightsHtml}

                            <!-- Botão de Ação (CTA) -->
                            <div style="text-align: center; margin: 32px 0 28px;">
                                <a href="${ctaUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: #ffffff; font-size: 15px; font-weight: 800; text-decoration: none; padding: 16px 32px; border-radius: 14px; box-shadow: 0 10px 15px -3px rgba(180, 83, 9, 0.4); text-transform: uppercase; letter-spacing: 0.5px;">
                                    ${ctaText}
                                </a>
                            </div>

                            <!-- Fechamento Pastoral -->
                            <p style="margin: 28px 0 0; font-size: 14px; line-height: 22px; color: #64748b; font-style: italic; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                                ${closing}
                            </p>

                            <p style="margin: 8px 0 0; font-size: 13px; font-weight: 700; color: #0f172a;">
                                Fraternalmente em Cristo,<br>
                                <span style="color: #b45309;">Coordenação do Catecismo Católico</span>
                            </p>
                        </td>
                    </tr>

                    <!-- Rodapé -->
                    <tr>
                        <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 32px; text-align: center;">
                            <p style="margin: 0 0 8px; font-size: 12px; color: #94a3b8; line-height: 18px;">
                                Você recebeu este convite porque conectou seu e-mail para acompanhar e sincronizar seu diário de oração no <strong>Catecismo Católico</strong>.
                            </p>
                            <p style="margin: 0; font-size: 11px; color: #cbd5e1;">
                                <a href="${SITE_URL}" target="_blank" style="color: #64748b; text-decoration: underline;">Acessar Plataforma Web</a> • 
                                Conhecer, compreender e viver a Fé Católica
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}

// Modelos prontos de e-mail que o administrador pode escolher
export const EMAIL_PRESETS = [
    {
        id: 'novidades_recentes',
        name: 'Grandes Novidades & Convite para Rezar',
        subject: '🕊️ Grandes novidades no Catecismo Católico: Nova Liturgia Diária, Quiz, Santos e muito mais!',
        title: 'Atualizações Espirituais, Nova Liturgia & Formação no Catecismo',
        subtitle: 'Sua rotina com Deus ainda mais rica: Liturgia aprimorada, Pílula Diária, Quiz da Fé e 713 Santos',
        greeting: 'Paz e bem no Senhor Jesus!',
        paragraphs: [
            'Esperamos que este e-mail encontre você e sua família com muita paz, saúde e abundantes bênçãos divinas.',
            'Temos a alegria de compartilhar que o Catecismo Católico passou por grandes melhorias em sua estrutura e conteúdo! Atualizamos e aperfeiçoamos toda a base da Liturgia Diária, fortalecemos as ferramentas diárias de formação como o Quiz Católico e a Pílula Diária de Sabedoria, além de um trabalho profundo de auditoria em todos os Santos e orações da Tradição.',
            'Venha conferir o que preparamos com tanto zelo para a sua alma e retome seus momentos diários de intimidade com Deus:'
        ],
        highlights: [
            {
                icon: '☀️',
                title: 'Liturgia Diária Atualizada & Aprimorada',
                description: 'Primeira Leitura, Salmo responsorial e Evangelho com textos canônicos revisados, reflexões da Santa Igreja e calendário litúrgico completo.'
            },
            {
                icon: '💡',
                title: 'Pílula Diária de Sabedoria',
                description: 'Uma dose diária de reflexão profunda e ensinamentos dos Doutores e Santos da Igreja para iluminar o seu coração logo no início do dia.'
            },
            {
                icon: '🎯',
                title: 'Quiz Católico & Formação da Fé',
                description: 'Teste e aprofunde seus conhecimentos bíblicos e doutrinários com perguntas diárias, sistema de XP, níveis e ofensivas (streak) para aprender a fé de forma leve e envolvente.'
            },
            {
                icon: '🕊️',
                title: '713 Santos da Igreja Auditados',
                description: 'Nomes e prefixos 100% canônicos (Santa Susana, Santo Antônio, Santo Expedito, etc.) com biografias aprofundadas e arte sacra em alta resolução.'
            },
            {
                icon: '📖',
                title: 'Guia de Lectio Divina (Leitura Orante)',
                description: 'Medite o Evangelho do Dia através dos 4 passos tradicionais (Leitura, Meditação, Oração e Contemplação) com Diário Espiritual integrado.'
            },
            {
                icon: '🌹',
                title: '20 Grandes Novenas & Devocionário Completo',
                description: 'Novenas canônicas dos 9 dias com progresso automático, Santo Terço guiado, Via-Sacra e 28 grandes orações da Tradição da Igreja.'
            }
        ],
        ctaText: 'Acessar o Catecismo & Rezar Agora',
        ctaUrl: SITE_URL,
        closing: '"Que o Senhor te abençoe e te guarde. Que o Senhor faça resplandecer a Sua face sobre ti e te conceda a paz." (Nm 6, 24-26)'
    },
    {
        id: 'convite_retorno',
        name: 'Convite Fraterno de Retorno à Oração',
        subject: '✨ Um momento para sua alma: retome suas orações e formação no Catecismo Católico',
        title: 'Um convite fraterno para alimentar o seu coração',
        subtitle: 'Sua rotina com Deus: Liturgia diária, Pílula de Sabedoria, Quiz da Fé e Santo Terço',
        greeting: 'Paz e bem, querido(a) irmão(ã)!',
        paragraphs: [
            'Na agitação e desafios do dia a dia, reservar alguns minutos de silêncio e intimidade com Deus faz toda a diferença para o nosso coração.',
            'O Catecismo Católico continua disponível para você, 100% gratuito e sem distrações, pronto para acompanhar a sua caminhada com a Liturgia Diária aprimorada, o Quiz da Fé, a Pílula Diária de reflexão e o Santo Terço interativo.'
        ],
        highlights: [
            {
                icon: '☀️',
                title: 'Liturgia Diária Sempre Atualizada',
                description: 'Primeira Leitura, Salmo responsorial e Evangelho com reflexão diária da Santa Igreja.'
            },
            {
                icon: '💡',
                title: 'Pílula de Sabedoria & Quiz Diário',
                description: 'Ensinamentos inspiradores dos santos e desafios doutrinários para exercitar e fortalecer sua fé.'
            },
            {
                icon: '📿',
                title: 'Santo Terço & Novenas Interativas',
                description: 'Reze os mistérios do dia com meditações guiadas e acompanhe suas novenas com persistência no seu perfil.'
            },
            {
                icon: '🕯️',
                title: 'Seu Diário Espiritual Protegido',
                description: 'Suas anotações, propósitos e momentos com Deus salvos de forma segura e sincronizados.'
            }
        ],
        ctaText: 'Rezar a Liturgia de Hoje',
        ctaUrl: SITE_URL,
        closing: '"Vinde a mim todos vós que estais cansados e fatigados, e eu vos darei descanso." (Mt 11, 28)'
    }
];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'OPTIONS') return res.status(204).end();

    try {
        // GET: Retorna status, destinatários e histórico
        if (req.method === 'GET') {
            const dbUsers = await getDatabase();
            const users = Object.values(dbUsers.users || {}).map(u => ({
                email: u.email,
                name: u.displayName || u.nome || u.name || null,
                createdAt: u.createdAt || null,
                updatedAt: u.updatedAt || null,
                streak: u.streak || 0,
                xp: u.xp || 0
            }));

            const dbBroadcasts = await getEmailBroadcastsDatabase();
            const history = (dbBroadcasts.emails || []).slice(0, 10);

            return res.status(200).json({
                ok: true,
                emailConfigured: emailConfigurado(),
                totalUsers: users.length,
                users,
                history,
                presets: EMAIL_PRESETS
            });
        }

        // POST: Disparo de e-mail (teste ou em massa)
        if (req.method === 'POST') {
            const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
            const { 
                subject, 
                title, 
                subtitle, 
                greeting, 
                paragraphs, 
                highlights, 
                ctaText, 
                ctaUrl, 
                closing,
                testEmail, 
                sendToAll 
            } = body;

            if (!subject || !title) {
                return res.status(400).json({ ok: false, error: 'Assunto e Título são obrigatórios.' });
            }

            const html = buildCatholicEmailHtml({
                title,
                subtitle,
                greeting,
                paragraphs: Array.isArray(paragraphs) ? paragraphs : (paragraphs ? [paragraphs] : []),
                highlights: Array.isArray(highlights) ? highlights : [],
                ctaText: ctaText || 'Acessar o Catecismo & Rezar Agora',
                ctaUrl: ctaUrl || SITE_URL,
                closing
            });

            // 1. MODO DE TESTE (ENVIO PARA 1 DESTINATÁRIO)
            if (testEmail) {
                if (!testEmail.includes('@')) {
                    return res.status(400).json({ ok: false, error: 'E-mail de teste inválido.' });
                }

                console.log(`[broadcast-email] Enviando e-mail de teste para: ${testEmail}`);
                const result = await enviarEmail({
                    para: testEmail,
                    assunto: `[TESTE] ${subject}`,
                    texto: `${title}\n\n${(paragraphs || []).join('\n\n')}\n\nAcesse: ${ctaUrl || SITE_URL}`,
                    html
                });

                if (!result.ok) {
                    return res.status(500).json({ ok: false, error: result.error || 'Falha ao enviar e-mail de teste.' });
                }

                return res.status(200).json({
                    ok: true,
                    isTest: true,
                    recipient: testEmail,
                    message: `E-mail de teste enviado com sucesso para ${testEmail}! Verifique sua caixa de entrada.`
                });
            }

            // 2. DISPARO GERAL PARA TODOS OS FIÉIS CADASTRADOS
            if (sendToAll) {
                const dbUsers = await getDatabase();
                const usersList = Object.values(dbUsers.users || {}).filter(u => u && u.email && u.email.includes('@'));

                if (usersList.length === 0) {
                    return res.status(400).json({ ok: false, error: 'Nenhum fiel cadastrado com e-mail válido encontrado no banco.' });
                }

                console.log(`[broadcast-email] Iniciando disparo geral para ${usersList.length} fiéis...`);
                let sentCount = 0;
                let failedCount = 0;
                const deliveryResults = [];

                for (const u of usersList) {
                    try {
                        const resEmail = await enviarEmail({
                            para: u.email,
                            assunto: subject,
                            texto: `${title}\n\n${(paragraphs || []).join('\n\n')}\n\nAcesse: ${ctaUrl || SITE_URL}`,
                            html
                        });

                        if (resEmail.ok) {
                            sentCount++;
                            deliveryResults.push({ email: u.email, success: true, id: resEmail.id });
                        } else {
                            failedCount++;
                            deliveryResults.push({ email: u.email, success: false, error: resEmail.error });
                        }

                        // Delay de 800ms entre envios para respeitar o limite de rate do provedor SMTP
                        await new Promise(r => setTimeout(r, 800));
                    } catch (err) {
                        failedCount++;
                        deliveryResults.push({ email: u.email, success: false, error: err.message });
                    }
                }

                // Salva o registro histórico do disparo
                const broadcastRecord = {
                    id: 'eb_' + Date.now(),
                    subject,
                    title,
                    sentCount,
                    failedCount,
                    totalTargeted: usersList.length,
                    createdAt: new Date().toISOString(),
                    recipients: deliveryResults.map(r => r.email)
                };
                await saveEmailBroadcastToDatabase(broadcastRecord);

                return res.status(200).json({
                    ok: true,
                    isTest: false,
                    sentCount,
                    failedCount,
                    total: usersList.length,
                    message: `Disparo concluído: ${sentCount} e-mail(s) enviado(s) com sucesso com ${failedCount} falha(s).`,
                    results: deliveryResults
                });
            }

            return res.status(400).json({ ok: false, error: 'Indique se deseja enviar teste (testEmail) ou para todos (sendToAll: true).' });
        }

        return res.status(405).json({ ok: false, error: 'Método não permitido.' });
    } catch (err) {
        console.error('[send-email-broadcast] Erro fatal:', err);
        return res.status(500).json({ ok: false, error: 'Erro interno no servidor: ' + err.message });
    }
}
