// scripts/disparar-email-novidades.mjs
// Dispara e-mail de novidades e convite pastoral para os fiéis cadastrados
// Uso:
//   node scripts/disparar-email-novidades.mjs --preview
//   node scripts/disparar-email-novidades.mjs --test seu-email@gmail.com
//   node scripts/disparar-email-novidades.mjs --all

import { getDatabase, saveEmailBroadcastToDatabase } from '../api/_db.js';
import { enviarEmail, emailConfigurado } from '../api/_email.js';
import { buildCatholicEmailHtml, EMAIL_PRESETS } from '../api/admin/send-email-broadcast.js';

const args = process.argv.slice(2);
const isPreview = args.includes('--preview');
const testIndex = args.indexOf('--test');
const testEmail = testIndex !== -1 ? args[testIndex + 1] : null;
const isSendToAll = args.includes('--all');

async function main() {
    console.log('====================================================');
    console.log('🕊️ DISPARADOR DE E-MAILS PASTORAIS — CATECISMO CATÓLICO');
    console.log('====================================================\n');

    if (!emailConfigurado()) {
        console.error('❌ E-mail não configurado! Verifique as credenciais no api/_email.js');
        process.exit(1);
    }

    const template = EMAIL_PRESETS[0]; // Novidades Recentes & Convite

    // 1. Apenas Prévia no Terminal
    if (isPreview) {
        console.log('📄 [MODO PRÉVIA]');
        console.log(`Assunto: ${template.subject}`);
        console.log(`Título: ${template.title}`);
        console.log(`Subtítulo: ${template.subtitle}\n`);
        console.log('Destaques incluídos:');
        template.highlights.forEach((h, i) => console.log(`  ${h.icon} ${h.title}: ${h.description}`));
        console.log(`\nBotão CTA: [ ${template.ctaText} ] -> ${template.ctaUrl}`);
        console.log('\nPara testar envio: node scripts/disparar-email-novidades.mjs --test seu-email@gmail.com');
        console.log('Para enviar a todos: node scripts/disparar-email-novidades.mjs --all');
        return;
    }

    const html = buildCatholicEmailHtml(template);

    // 2. Modo de Teste para 1 e-mail
    if (testEmail) {
        console.log(`🧪 [MODO TESTE] Enviando e-mail de teste para: ${testEmail}...`);
        const res = await enviarEmail({
            para: testEmail,
            assunto: `[TESTE] ${template.subject}`,
            texto: `${template.title}\n\n${template.paragraphs.join('\n\n')}\n\nAcesse: ${template.ctaUrl}`,
            html
        });

        if (res.ok) {
            console.log(`✅ Sucesso! E-mail de teste entregue para ${testEmail} (ID: ${res.id})`);
            console.log('Verifique a sua caixa de entrada no celular ou computador!');
        } else {
            console.error(`❌ Falha ao enviar para ${testEmail}:`, res.error);
        }
        return;
    }

    // 3. Disparo para todos os fiéis
    if (isSendToAll) {
        console.log('Consultando fiéis cadastrados no banco Firestore...');
        const db = await getDatabase();
        const users = Object.values(db.users || {}).filter(u => u && u.email && u.email.includes('@'));

        if (users.length === 0) {
            console.log('Nenhum fiel encontrado na base.');
            return;
        }

        console.log(`📢 [DISPARO GERAL] Iniciando envio para ${users.length} fiéis cadastrados:\n`);
        users.forEach((u, idx) => console.log(`  ${idx + 1}. ${u.email}`));
        console.log('\nEnviando mensagens com proteção anti-spam...');

        let sent = 0;
        let failed = 0;
        const results = [];

        for (let i = 0; i < users.length; i++) {
            const u = users[i];
            process.stdout.write(`[${i + 1}/${users.length}] Enviando para ${u.email}... `);

            try {
                const res = await enviarEmail({
                    para: u.email,
                    assunto: template.subject,
                    texto: `${template.title}\n\n${template.paragraphs.join('\n\n')}\n\nAcesse: ${template.ctaUrl}`,
                    html
                });

                if (res.ok) {
                    sent++;
                    results.push({ email: u.email, ok: true, id: res.id });
                    console.log('✅ OK');
                } else {
                    failed++;
                    results.push({ email: u.email, ok: false, error: res.error });
                    console.log(`❌ Erro: ${res.error}`);
                }
            } catch (err) {
                failed++;
                results.push({ email: u.email, ok: false, error: err.message });
                console.log(`❌ Exceção: ${err.message}`);
            }

            // Intervalo de segurança
            if (i < users.length - 1) {
                await new Promise(r => setTimeout(r, 1000));
            }
        }

        // Salvar histórico
        await saveEmailBroadcastToDatabase({
            id: 'eb_' + Date.now(),
            subject: template.subject,
            title: template.title,
            sentCount: sent,
            failedCount: failed,
            totalTargeted: users.length,
            createdAt: new Date().toISOString(),
            recipients: results.map(r => r.email)
        });

        console.log('\n====================================================');
        console.log(`🎉 DISPARO CONCLUÍDO!`);
        console.log(`   ✅ Entregues com sucesso: ${sent}`);
        console.log(`   ❌ Falhas: ${failed}`);
        console.log(`   👥 Total processado: ${users.length}`);
        console.log('====================================================');
        return;
    }

    // Se nenhum argumento foi passado
    console.log('Como utilizar este script:');
    console.log('  1. Visualizar o texto do e-mail:');
    console.log('     node scripts/disparar-email-novidades.mjs --preview\n');
    console.log('  2. Fazer um envio de teste para o seu próprio e-mail:');
    console.log('     node scripts/disparar-email-novidades.mjs --test seu-email@gmail.com\n');
    console.log('  3. Disparar para todos os fiéis cadastrados:');
    console.log('     node scripts/disparar-email-novidades.mjs --all\n');
}

main().catch(console.error);
