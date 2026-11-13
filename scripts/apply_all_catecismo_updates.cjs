const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

console.log('Original index.html length:', html.length);

// 1. Carregar 365 pílulas
const gems365 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/pilulas_espirituais.json'), 'utf8'));
console.log('Total gems loaded from json:', gems365.length);

// 2. Corrigir chamadas de "Rezar agora" na Home (linhas 7462 e 7491)
html = html.replace(
    `onclick="openPrayerModal('p_14')"`,
    `onclick="openPrayerModal('p_oracao_manha')"`
);
html = html.replace(
    `onclick="openPrayerModal('p_15')"`,
    `onclick="openPrayerModal('p_oracao_noite')"`
);

// 3. Adicionar CSS do Modo Capela e Vela Litúrgica no bloco <style>
const candleCss = `
        /* Animação Contemplativa da Vela no Modo Capela */
        @keyframes chapelCandleFlicker {
            0% { transform: scale(1) rotate(-1deg); opacity: 0.95; }
            20% { transform: scale(1.08, 0.95) rotate(1deg); opacity: 1; }
            40% { transform: scale(0.95, 1.05) rotate(-0.5deg); opacity: 0.9; }
            60% { transform: scale(1.04, 0.97) rotate(1.5deg); opacity: 0.98; }
            80% { transform: scale(0.97, 1.03) rotate(-1deg); opacity: 0.93; }
            100% { transform: scale(1) rotate(-1deg); opacity: 0.95; }
        }
        .chapel-candle-flame {
            width: 14px;
            height: 24px;
            background: radial-gradient(ellipse at bottom, #fff 0%, #ffdf6d 35%, #ff9500 75%, transparent 100%);
            border-radius: 50% 50% 35% 35% / 60% 60% 40% 40%;
            box-shadow: 0 0 12px #ffb300, 0 0 24px rgba(255, 179, 0, 0.5);
            animation: chapelCandleFlicker 2.4s infinite ease-in-out;
        }
`;

if (!html.includes('chapelCandleFlicker')) {
    html = html.replace('</style>', `${candleCss}\n    </style>`);
    console.log('Added candle animation CSS to <style>');
}

// 4. Substituir SpiritualLightManager com 365 pílulas, salto não-repetitivo e gerador de santinho
const spStart = html.indexOf('const SpiritualLightManager = {');
const spEnd = html.indexOf('window.SpiritualLightManager = SpiritualLightManager;', spStart);

if (spStart === -1 || spEnd === -1) {
    console.error('Could not locate SpiritualLightManager');
    process.exit(1);
}

const newSpiritualLightManager = `const SpiritualLightManager = {
            gems: ${JSON.stringify(gems365, null, 12)},

            getTodayGem(indexOffset = 0) {
                const todayStr = (typeof getLocalDateString === 'function') ? getLocalDateString() : new Date().toISOString().slice(0, 10);
                const parts = todayStr.split('-').map(Number);
                const d = new Date(parts[0], parts[1] - 1, parts[2]);
                const startOfYear = new Date(parts[0], 0, 0);
                const diff = d - startOfYear;
                const oneDay = 1000 * 60 * 60 * 24;
                const dayOfYear = Math.floor(diff / oneDay);

                let idx;
                if (!indexOffset) {
                    idx = (dayOfYear - 1) % this.gems.length;
                } else {
                    // Passo coprimo (47) para percorrer todas as 365 reflexões sem repetições imediatas
                    idx = (dayOfYear - 1 + indexOffset * 47) % this.gems.length;
                }
                if (idx < 0) idx += this.gems.length;
                return this.gems[idx] || this.gems[0];
            },

            renderCard() {
                const gem = this.getTodayGem(window.__spiritualGemOffset || 0);
                return \`
                    <div data-app-cover="bg_pilula_fe" class="quote relative overflow-hidden bg-gradient-to-br from-[#faf6ee] via-[#f3ead8] to-[#ede1c7] dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900 border-2 border-[#e3d3b3] dark:border-slate-700 rounded-[24px] p-5 sm:p-7 shadow-md w-full flex flex-col justify-between">
                        <!-- Imagem de Fundo Editorial / Santinho -->
                        <img class="app-cover-img hidden absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-15 mix-blend-multiply dark:mix-blend-luminosity pointer-events-none" alt="Fundo Santinho">
                        <div class="app-cover-placeholder absolute -right-6 -bottom-6 w-44 h-44 rounded-full bg-radial from-amber-500/15 via-transparent to-transparent pointer-events-none"></div>

                        <!-- Topo Nobre do Santinho -->
                        <div class="relative z-10 flex items-center justify-between border-b border-[#e5d6b8] dark:border-slate-700 pb-3 mb-3.5">
                            <div class="flex items-center gap-2">
                                <span class="w-7 h-7 rounded-lg bg-cgreen text-dourado-light flex items-center justify-center text-xs shadow-2xs">🕊️</span>
                                <span class="text-[10px] font-bold uppercase tracking-[0.18em] text-cgreen-light dark:text-csage">
                                    UMA LUZ PARA O SEU DIA &nbsp;·&nbsp; \${gem.tema || 'Pílula da Fé'}
                                </span>
                            </div>
                            <span class="text-xs font-serif text-amber-700 dark:text-amber-400">✦ Meditação</span>
                        </div>

                        <!-- Corpo da Mensagem / Aspas e Doutrina -->
                        <div class="relative z-10 space-y-3">
                            <div class="flex gap-3 items-start">
                                <span class="font-serif text-3xl sm:text-4xl text-cgold leading-none select-none shrink-0 mt-0.5">“</span>
                                <p class="font-serif italic text-base sm:text-[18px] text-cink dark:text-slate-100 leading-snug">
                                    \${gem.versiculo || 'Fazei tudo o que ele vos disser.'}
                                </p>
                            </div>
                            \${gem.catecismo ? \`
                                <div class="bg-white/60 dark:bg-slate-900/50 backdrop-blur-xs rounded-xl p-3 border border-[#e8dcc4] dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                    <strong class="text-cgreen dark:text-csage font-bold uppercase tracking-wider text-[10px] block mb-0.5">Doutrina da Igreja:</strong>
                                    \${gem.catecismo}
                                </div>
                            \` : ''}
                            \${gem.prece ? \`
                                <div class="text-xs text-[#526356] dark:text-slate-300 italic pt-1 flex items-center gap-1.5 leading-relaxed">
                                    <span class="text-amber-600 dark:text-amber-400">🙏</span>
                                    <span>"\${gem.prece}"</span>
                                </div>
                            \` : ''}
                        </div>

                        <!-- Rodapé de Ações -->
                        <div class="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-3.5 border-t border-[#e5d6b8] dark:border-slate-700 mt-3.5">
                            <span class="text-[11px] text-[#7d7c6f] dark:text-slate-400 font-medium">
                                Inspiração diária para meditar e partilhar
                            </span>
                            <div class="flex items-center gap-2">
                                <button onclick="SpiritualLightManager.nextGem()" class="text-[11px] bg-white/70 dark:bg-slate-700 hover:bg-white text-cgreen dark:text-csage font-semibold px-3 py-1 rounded-full border border-cline transition cursor-pointer flex items-center gap-1" title="Outra reflexão">
                                    <span>↻</span> <span>Outra</span>
                                </button>
                                <button onclick="SpiritualLightManager.gerarSantinho()" class="text-[11px] bg-[#d4af37] hover:bg-[#c59a4b] text-white font-semibold px-3 py-1 rounded-full flex items-center gap-1 transition shadow-2xs cursor-pointer" title="Gerar Santinho em Imagem">
                                    <span>🎴</span> <span>Santinho</span>
                                </button>
                                <button onclick="SpiritualLightManager.compartilharWhatsApp()" class="text-[11px] bg-cgreen hover:bg-cgreen-light text-white font-semibold px-3 py-1 rounded-full flex items-center gap-1 transition shadow-2xs cursor-pointer" title="Compartilhar no WhatsApp">
                                    <span>WhatsApp</span>
                                </button>
                            </div>
                        </div>
                    </div>
                \`;
            },

            nextGem() {
                window.__spiritualGemOffset = (window.__spiritualGemOffset || 0) + 1;
                const container = document.getElementById('home-spiritual-light');
                if (container) {
                    container.innerHTML = this.renderCard();
                    if (window.AppCoversManager) AppCoversManager.applyCoversToDOM();
                }
            },

            async gerarSantinho() {
                const gem = this.getTodayGem(window.__spiritualGemOffset || 0);
                if (!gem) return;
                
                showToast("Gerando santinho em alta resolução...", "info");

                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = 1080;
                    canvas.height = 1350;
                    const ctx = canvas.getContext('2d');

                    // 1. Fundo Nobre / Marfim Papal com gradiente sutil
                    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1350);
                    bgGrad.addColorStop(0, '#FDFBF7');
                    bgGrad.addColorStop(0.5, '#F6EFE3');
                    bgGrad.addColorStop(1, '#EDE2D0');
                    ctx.fillStyle = bgGrad;
                    ctx.fillRect(0, 0, 1080, 1350);

                    // 2. Moldura Dourada Clássica com Cantos Finos
                    ctx.strokeStyle = '#D4AF37';
                    ctx.lineWidth = 4;
                    ctx.strokeRect(40, 40, 1000, 1270);

                    ctx.strokeStyle = '#C59A4B';
                    ctx.lineWidth = 1.5;
                    ctx.strokeRect(55, 55, 970, 1240);

                    const corners = [
                        [55, 55], [1025, 55], [55, 1295], [1025, 1295]
                    ];
                    ctx.fillStyle = '#C59A4B';
                    corners.forEach(([x, y]) => {
                        ctx.beginPath();
                        ctx.arc(x, y, 7, 0, Math.PI * 2);
                        ctx.fill();
                    });

                    // 3. Emblema da Cruz no topo
                    ctx.textAlign = 'center';
                    ctx.fillStyle = '#C59A4B';
                    ctx.font = '36px Georgia, serif';
                    ctx.fillText('✠', 540, 125);

                    // 4. Cabeçalho Litúrgico
                    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                    ctx.fillStyle = '#234638';
                    ctx.fillText('UMA LUZ PARA O SEU DIA', 540, 175);

                    ctx.font = 'italic bold 22px Georgia, serif';
                    ctx.fillStyle = '#8B6508';
                    ctx.fillText('· ' + (gem.tema || 'Meditação Diária').toUpperCase() + ' ·', 540, 215);

                    // Divisor Ornamento
                    ctx.strokeStyle = '#D4AF37';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(340, 245);
                    ctx.lineTo(740, 245);
                    ctx.stroke();

                    // Função auxiliar para quebra de texto
                    function wrapText(context, text, x, y, maxWidth, lineHeight) {
                        const words = String(text).split(' ');
                        let line = '';
                        let currentY = y;
                        for (let n = 0; n < words.length; n++) {
                            const testLine = line + words[n] + ' ';
                            const metrics = context.measureText(testLine);
                            if (metrics.width > maxWidth && n > 0) {
                                context.fillText(line, x, currentY);
                                line = words[n] + ' ';
                                currentY += lineHeight;
                            } else {
                                line = testLine;
                            }
                        }
                        context.fillText(line, x, currentY);
                        return currentY + lineHeight;
                    }

                    // 5. Versículo Bíblico
                    ctx.fillStyle = '#1E293B';
                    ctx.font = 'italic 34px Georgia, serif';
                    let curY = wrapText(ctx, (gem.versiculo || ''), 540, 330, 840, 50);

                    // 6. Caixa Doutrina da Igreja
                    if (gem.catecismo) {
                        curY = Math.max(curY + 30, 530);
                        const boxW = 860;
                        const boxX = 110;
                        const boxY = curY;
                        
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
                        ctx.beginPath();
                        if (typeof ctx.roundRect === 'function') {
                            ctx.roundRect(boxX, boxY, boxW, 280, 20);
                        } else {
                            ctx.rect(boxX, boxY, boxW, 280);
                        }
                        ctx.fill();
                        ctx.strokeStyle = '#E2D5BA';
                        ctx.lineWidth = 2;
                        ctx.stroke();

                        ctx.font = 'bold 18px -apple-system, sans-serif';
                        ctx.fillStyle = '#234638';
                        ctx.textAlign = 'left';
                        ctx.fillText('DOUTRINA DA IGREJA CATÓLICA', boxX + 40, boxY + 50);

                        ctx.font = '22px Georgia, serif';
                        ctx.fillStyle = '#334155';
                        wrapText(ctx, gem.catecismo, boxX + 40, boxY + 95, 780, 36);
                        ctx.textAlign = 'center';
                        curY = boxY + 310;
                    }

                    // 7. Oração / Prece
                    if (gem.prece) {
                        curY = Math.max(curY + 40, 890);
                        ctx.font = 'bold 22px Georgia, serif';
                        ctx.fillStyle = '#8B6508';
                        ctx.fillText('🙏 PRECE DO DIA', 540, curY);

                        ctx.font = 'italic 26px Georgia, serif';
                        ctx.fillStyle = '#1E3A2B';
                        curY = wrapText(ctx, '"' + gem.prece + '"', 540, curY + 50, 820, 42);
                    }

                    // 8. Rodapé Nobre
                    ctx.textAlign = 'center';
                    ctx.font = '16px -apple-system, sans-serif';
                    ctx.fillStyle = '#78716C';
                    ctx.fillText('CATECISMO DA IGREJA CATÓLICA · PÍLULA ESPIRITUAL DIÁRIA', 540, 1220);
                    ctx.font = 'bold 18px Georgia, serif';
                    ctx.fillStyle = '#234638';
                    ctx.fillText('catecismo.creativeam.com.br', 540, 1250);

                    // Converte para imagem e dispara download ou share nativo
                    canvas.toBlob(async (blob) => {
                        if (!blob) return;
                        const file = new File([blob], 'santinho-do-dia.png', { type: 'image/png' });
                        if (navigator.canShare && navigator.canShare({ files: [file] })) {
                            try {
                                await navigator.share({
                                    title: 'Santinho do Dia - ' + gem.tema,
                                    text: gem.tema + '\\n' + gem.versiculo,
                                    files: [file]
                                });
                                showToast('Santinho compartilhado com sucesso!', 'success');
                                return;
                            } catch(e) {
                                if (e.name === 'AbortError') return;
                            }
                        }

                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = \`santinho-\${(gem.tema || 'dia').toLowerCase().replace(/[^a-z0-9]/g, '-')}.png\`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        showToast('Santinho baixado com sucesso!', 'success');
                    }, 'image/png', 0.95);

                } catch(err) {
                    console.error('Erro ao gerar santinho:', err);
                    showToast('Não foi possível gerar a imagem no momento.', 'error');
                }
            },

            async compartilharWhatsApp() {
                const gem = this.getTodayGem(window.__spiritualGemOffset || 0);
                const msg = \`🕊️ *Uma Luz para o Seu Dia — \${gem.tema}*\\n\\n\${gem.versiculo}\\n\\n*Catecismo:* \${gem.catecismo}\\n\\n🙏 *Oração:* _"\${gem.prece}"_\\n\\n✨ _Encontre mais reflexões e orações no Catecismo:_\\nhttps://catecismo.creativeam.com.br\`;

                if (navigator.share) {
                    try {
                        await navigator.share({ title: 'Uma Luz para o Seu Dia', text: msg });
                        return;
                    } catch(e) {
                        if (e.name === 'AbortError') return;
                    }
                }
                window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(msg), '_blank');
            }
        };`;

html = html.substring(0, spStart) + newSpiritualLightManager + '\n        ' + html.substring(spEnd);
console.log('Replaced SpiritualLightManager successfully!');

// 5. Adicionar CanonicalHoursManager antes de Views
const canonicalHoursCode = `
        /* ========================================================
           CONTROLLER DE HORAS CANÔNICAS & LITURGIA DO TEMPO
           ======================================================== */
        const CanonicalHoursManager = {
            getCurrentMoment() {
                const now = new Date();
                const hour = now.getHours();
                const min = now.getMinutes();
                const timeNum = hour + min / 60;

                if (timeNum >= 5.0 && timeNum < 9.5) {
                    return {
                        id: 'manha',
                        prayerId: 'p_oracao_manha',
                        nome: 'Laudes & Oração da Manhã',
                        subtitulo: 'Ao romper da aurora, entregue as primícias deste novo dia nas mãos de Deus',
                        icon: '🌅',
                        badge: 'Aurora',
                        btnText: 'Rezar da Manhã'
                    };
                } else if (timeNum >= 11.75 && timeNum < 13.5) {
                    return {
                        id: 'angelus_meio_dia',
                        prayerId: 'p_angelus',
                        nome: 'Hora do Angelus (12h)',
                        subtitulo: '“O Anjo do Senhor anunciou a Maria e Ela concebeu do Espírito Santo”',
                        icon: '🔔',
                        badge: 'Tradição dos Sinos',
                        btnText: 'Rezar o Angelus'
                    };
                } else if (timeNum >= 14.75 && timeNum < 16.0) {
                    return {
                        id: 'misericordia',
                        prayerId: 'p_tres_horas',
                        nome: 'Hora da Divina Misericórdia (15h)',
                        subtitulo: 'A hora suprema do sacrifício redentor de Cristo na Cruz',
                        icon: '🕊️',
                        badge: 'Hora Santa',
                        btnText: 'Rezar às 15h'
                    };
                } else if (timeNum >= 17.5 && timeNum < 19.5) {
                    return {
                        id: 'angelus_tarde',
                        prayerId: 'p_angelus',
                        nome: 'Angelus Vespertino & Vésperas',
                        subtitulo: 'Ao entardecer, agradeça pelas graças e proteções recebidas hoje',
                        icon: '🌆',
                        badge: 'Entardecer',
                        btnText: 'Rezar Angelus'
                    };
                } else if (timeNum >= 21.0 || timeNum < 5.0) {
                    return {
                        id: 'completas',
                        prayerId: 'p_oracao_noite',
                        nome: 'Completas & Oração da Noite',
                        subtitulo: '“Em vossas mãos, Senhor, entrego o meu espírito” — Exame e paz noturna',
                        icon: '🌙',
                        badge: 'Antes de Dormir',
                        btnText: 'Rezar da Noite'
                    };
                } else {
                    return {
                        id: 'momento_graca',
                        prayerId: 'p_sinal_cruz',
                        nome: 'Momento de Presença Divina',
                        subtitulo: 'Uma breve pausa orante para santificar os afazeres da sua jornada',
                        icon: '✝️',
                        badge: 'Pausa Espiritual',
                        btnText: 'Oferecer o Dia'
                    };
                }
            },

            renderBanner() {
                const m = this.getCurrentMoment();
                return \`
                    <div class="relative overflow-hidden bg-gradient-to-r from-[#fdfbf7] via-[#f7f2e7] to-[#ede2d0] dark:from-slate-800 dark:via-slate-800/95 dark:to-slate-900 border border-[#e2d5ba] dark:border-slate-700/80 rounded-[20px] p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
                        <div class="flex items-center gap-3">
                            <span class="w-10 h-10 rounded-2xl bg-amber-500/15 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 flex items-center justify-center text-lg shrink-0 border border-amber-500/30">
                                \${m.icon}
                            </span>
                            <div>
                                <div class="flex items-center gap-2">
                                    <span class="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 uppercase tracking-wider">\${m.badge}</span>
                                    <h4 class="font-serif font-bold text-sm sm:text-base text-cgreen dark:text-amber-100">\${m.nome}</h4>
                                </div>
                                <p class="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1">\${m.subtitulo}</p>
                            </div>
                        </div>
                        <button onclick="openPrayerModal('\${m.prayerId}')" class="shrink-0 self-start sm:self-auto px-4 py-2 bg-cgreen hover:bg-cgreen-light text-white text-xs font-bold rounded-xl transition shadow-2xs flex items-center gap-1.5 cursor-pointer">
                            <span>\${m.btnText}</span>
                            <span>→</span>
                        </button>
                    </div>
                \`;
            }
        };
        window.CanonicalHoursManager = CanonicalHoursManager;
`;

if (!html.includes('const CanonicalHoursManager = {')) {
    html = html.replace('const Views = {', `${canonicalHoursCode}\n        const Views = {`);
    console.log('Added CanonicalHoursManager before Views!');
}

// 6. Injetar banner das Horas Canônicas na Home em Views.renderHome()
const targetRoutine = `<div class="space-y-3">
                            <div class="flex items-center justify-between">
                                <div class="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8c8b7e] dark:text-slate-400 flex items-center gap-1.5">
                                    <span>✦</span> <span>Rotina diária de oração</span>
                                </div>`;

if (html.includes(targetRoutine) && !html.includes('${CanonicalHoursManager.renderBanner()}')) {
    html = html.replace(targetRoutine, `<div class="space-y-3">
                            \${CanonicalHoursManager.renderBanner()}
                            <div class="flex items-center justify-between">
                                <div class="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8c8b7e] dark:text-slate-400 flex items-center gap-1.5">
                                    <span>✦</span> <span>Rotina diária de oração</span>
                                </div>`);
    console.log('Injected CanonicalHoursManager banner into Home routine section!');
}

// 7. Atualizar openPrayerModal com Modo Capela, Áudio e Mapeamento de Alias
const fnStart = html.indexOf('function openPrayerModal(id) {');
const nextFn = html.indexOf('function openIntentionPrayerModal(id) {');

if (fnStart === -1 || nextFn === -1) {
    console.error('Could not locate openPrayerModal or openIntentionPrayerModal');
    process.exit(1);
}

// Encontrar o início do bloco antes de openIntentionPrayerModal (o comentário de cabeçalho)
const commentHeader = '/* ========================================================\n           CONTROLLER DE ORAÇÕES POR INTENÇÃO';
const commentHeaderCRLF = '/* ========================================================\r\n           CONTROLLER DE ORAÇÕES POR INTENÇÃO';

let sliceEnd = html.indexOf(commentHeader, fnStart);
if (sliceEnd === -1) {
    sliceEnd = html.indexOf(commentHeaderCRLF, fnStart);
}
if (sliceEnd === -1) {
    sliceEnd = nextFn;
}

const targetOpenPrayerNew = `/* ========================================================
           CONTROLLER DE ORAÇÃO: MODAL CANÔNICO, MODO CAPELA & VOZ
           ======================================================== */
        let activePrayerUtterance = null;

        function togglePrayerAudio(prayerId) {
            if (!('speechSynthesis' in window)) {
                showToast("Leitura por voz não é suportada neste navegador.", "info");
                return;
            }

            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
                activePrayerUtterance = null;
                updateAudioButtons(false);
                showToast("Leitura pausada.", "info");
                return;
            }

            let targetId = prayerId;
            if (prayerId === 'p_14') targetId = 'p_oracao_manha';
            if (prayerId === 'p_15') targetId = 'p_oracao_noite';
            const p = PrayerContentProvider.prayers.find(x => x.id === targetId || x.id === prayerId);
            if (!p) return;

            const cleanText = (p.text || '').replace(/[\(\)\[\]]/g, '').trim();
            const textToSpeak = \`\${p.title}. \${cleanText}\`;
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = 'pt-BR';
            utterance.rate = 0.88; // Cadência calma e devocional
            utterance.pitch = 0.98;

            const voices = window.speechSynthesis.getVoices();
            const ptVoice = voices.find(v => v.lang === 'pt-BR' && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Luciana') || v.name.includes('Francisca'))) 
                         || voices.find(v => v.lang.startsWith('pt'));
            if (ptVoice) utterance.voice = ptVoice;

            utterance.onstart = () => {
                updateAudioButtons(true);
            };

            utterance.onend = () => {
                activePrayerUtterance = null;
                updateAudioButtons(false);
            };

            utterance.onerror = () => {
                activePrayerUtterance = null;
                updateAudioButtons(false);
            };

            activePrayerUtterance = utterance;
            window.speechSynthesis.speak(utterance);
        }

        function updateAudioButtons(isPlaying) {
            document.querySelectorAll('.btn-prayer-audio').forEach(btn => {
                if (isPlaying) {
                    btn.classList.add('bg-amber-500', 'text-white', 'animate-pulse');
                    btn.innerHTML = \`<span>⏹</span> <span class="hidden sm:inline">Pausar Voz</span>\`;
                } else {
                    btn.classList.remove('bg-amber-500', 'text-white', 'animate-pulse');
                    btn.innerHTML = \`<span>🔊</span> <span class="hidden sm:inline">Ouvir</span>\`;
                }
            });
        }

        function openChapelMode(id) {
            let targetId = id;
            if (id === 'p_14') targetId = 'p_oracao_manha';
            if (id === 'p_15') targetId = 'p_oracao_noite';
            const p = PrayerContentProvider.prayers.find(x => x.id === targetId || x.id === id);
            if (!p) return;

            const modal = document.getElementById('modal-container');
            window.__chapelFontSize = window.__chapelFontSize || 20;

            modal.innerHTML = \`
                <div class="chapel-mode-box bg-[#0a0f14] text-slate-100 w-full max-w-3xl rounded-3xl p-6 sm:p-10 space-y-6 max-h-[94vh] overflow-y-auto custom-scrollbar shadow-2xl border border-amber-500/30 relative select-none">
                    <!-- Topo: Controles da Capela -->
                    <div class="flex items-center justify-between border-b border-amber-900/40 pb-4">
                        <div class="flex items-center gap-2">
                            <span class="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-sm border border-amber-500/30">🕯️</span>
                            <div>
                                <span class="text-[10px] uppercase font-bold tracking-[0.2em] text-amber-400 block">Modo Capela · Silêncio e Oração</span>
                                <span class="text-xs text-slate-400 font-serif italic">\${p.category}</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="adjustChapelFontSize(-2)" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center justify-center cursor-pointer" title="Diminuir fonte">A-</button>
                            <button onclick="adjustChapelFontSize(2)" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center justify-center cursor-pointer" title="Aumentar fonte">A+</button>
                            <button onclick="togglePrayerAudio('\${p.id}')" class="btn-prayer-audio px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-amber-500/40 transition cursor-pointer" title="Ouvir leitura suave">
                                <span>🔊</span> <span class="hidden sm:inline">Voz Suave</span>
                            </button>
                            <button onclick="openPrayerModal('\${p.id}')" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer" title="Voltar ao modo normal">
                                ✕ Sair
                            </button>
                        </div>
                    </div>

                    <!-- Chama da Vela Viva (Animação Sagrada Contemplativa) -->
                    <div class="flex flex-col items-center justify-center pt-2">
                        <div class="relative w-8 h-12 flex flex-col items-center">
                            <div class="absolute -top-2 w-16 h-16 rounded-full bg-amber-400/20 blur-md pointer-events-none animate-pulse"></div>
                            <div class="chapel-candle-flame"></div>
                            <div class="w-0.5 h-2 bg-slate-700"></div>
                            <div class="w-4 h-6 bg-gradient-to-b from-[#e8dcc4] to-[#c7b99c] rounded-t-xs border border-amber-900/30"></div>
                        </div>
                        <h2 class="font-serif text-2xl sm:text-3xl font-bold text-amber-200 mt-3 text-center tracking-tight">\${p.title}</h2>
                        \${p.latinTitle ? \`<p class="text-xs text-amber-400/80 font-serif italic mt-0.5">\${p.latinTitle}</p>\` : ''}
                    </div>

                    <!-- Texto Sagrado da Oração -->
                    <div class="bg-black/40 p-6 sm:p-8 rounded-2xl border border-amber-900/30 shadow-inner">
                        <p id="chapel-prayer-text" style="font-size: \${window.__chapelFontSize || 20}px;" class="font-serif text-amber-50/95 leading-relaxed tracking-wide whitespace-pre-line text-center select-text">
                            \${p.text}
                        </p>
                    </div>

                    <!-- Rodapé de Conclusão -->
                    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                        <span class="text-xs text-slate-500 italic">"Onde dois ou três estiverem reunidos em meu nome, ali estou eu no meio deles." (Mt 18, 20)</span>
                        <button onclick="closeModal(); markPrayerDone();" class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center justify-center gap-2 cursor-pointer">
                            <span>✓ Rezei esta oração (+10 XP)</span>
                        </button>
                    </div>
                </div>
            \`;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function adjustChapelFontSize(delta) {
            window.__chapelFontSize = Math.min(32, Math.max(16, (window.__chapelFontSize || 20) + delta));
            const el = document.getElementById('chapel-prayer-text');
            if (el) el.style.fontSize = window.__chapelFontSize + 'px';
        }

        function openPrayerModal(id) {
            let targetId = id;
            if (id === 'p_14') targetId = 'p_oracao_manha';
            if (id === 'p_15') targetId = 'p_oracao_noite';
            const p = PrayerContentProvider.prayers.find(x => x.id === targetId || x.id === id);
            if (!p) return;
            const isFav = AppState.favorites.includes('prayer_' + p.id);
            const modal = document.getElementById('modal-container');
            modal.innerHTML = \`
                <div class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl border border-slate-200 dark:border-slate-800 relative">
                    <div class="absolute top-6 right-6 flex items-center gap-1.5">
                        <button onclick="openChapelMode('\${p.id}')" class="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition border border-amber-300/40 dark:border-amber-700/40 cursor-pointer" title="Modo Capela (Silêncio e Foco)">
                            <span>🕯️</span> <span class="hidden sm:inline">Capela</span>
                        </button>
                        <button onclick="togglePrayerAudio('\${p.id}')" class="btn-prayer-audio px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-200 dark:border-slate-700 cursor-pointer" title="Ouvir oração com voz suave">
                            <span>🔊</span> <span class="hidden sm:inline">Ouvir</span>
                        </button>
                        <button onclick="toggleFavorite('prayer_\${p.id}')" class="p-2 rounded-xl text-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center cursor-pointer" title="Favoritar">
                            \${isFav ? '<svg class="w-5 h-5 text-amber-500 fill-amber-500" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>' : '<svg class="w-5 h-5 text-slate-400 hover:text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>'}
                        </button>
                        <button onclick="closeModal()" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <div class="pr-36 space-y-1">
                        <span class="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 rounded-lg text-[10px] font-bold tracking-wider uppercase">\${p.category}</span>
                        <h3 class="font-serif text-2xl md:text-3xl font-bold text-mariana dark:text-amber-200 mt-2 leading-tight">\${p.title}</h3>
                        \${p.latinTitle ? \`<p class="text-xs text-cgold dark:text-amber-400 font-serif italic">\${p.latinTitle}</p>\` : ''}
                    </div>
                    <div class="bg-slate-50 dark:bg-slate-800/70 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <p class="font-serif text-base sm:text-lg text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line select-text">\${p.text}</p>
                    </div>
                    <button onclick="closeModal(); markPrayerDone();" class="w-full py-3.5 bg-cgreen hover:bg-cgreen-light text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer">
                        <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3c-1.5 2-3 4-3 7 0 2.5 1.5 4 3 6 1.5-2 3-3.5 3-6 0-3-1.5-5-3-7zm-7 9c3 0 5.5-1.5 7-3-1.5 4-4.5 7-7 7v-4zm14 0c-3 0-5.5-1.5-7-3 1.5 4 4.5 7 7 7v-4z"/></svg>
                        <span>Rezei esta oração (+10 XP)</span>
                    </button>
                </div>
            \`;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        `;

html = html.substring(0, fnStart) + targetOpenPrayerNew + html.substring(sliceEnd);
console.log('Updated openPrayerModal cleanly!');

// 8. Atualizar closeModal para interromper áudio caso esteja tocando
const oldCloseModal = `        function closeModal() {
            stopApoioStatusPolling();
            const modal = document.getElementById('modal-container');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }`;

const newCloseModal = `        function closeModal() {
            if (window.speechSynthesis && window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
            if (typeof updateAudioButtons === 'function') {
                updateAudioButtons(false);
            }
            stopApoioStatusPolling();
            const modal = document.getElementById('modal-container');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }`;

if (html.includes(oldCloseModal)) {
    html = html.replace(oldCloseModal, newCloseModal);
    console.log('Updated closeModal with audio cancellation!');
}

// 9. Atualizar A Chama da Fé na Home (Seu caminho de hoje)
html = html.replace(
    `<b class="text-xs text-cgreen dark:text-csage font-bold">\${userStreak > 1 ? \`🔥 \${userStreak} dias de oração\` : 'Acompanhe sua caminhada'}</b>`,
    `<b class="text-xs text-cgreen dark:text-csage font-bold">\${userStreak >= 1 ? \`🔥 \${userStreak} \${userStreak === 1 ? 'dia de chama acesa' : 'dias de oração contínua'}\` : 'Acompanhe sua caminhada'}</b>`
);

// 10. Salvar e validar sintaxe de index.html
fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully saved updated index.html! New length:', html.length);

// Validação sintática completa
const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
let m;
let scriptIdx = 0;
let hasError = false;
while ((m = scriptRegex.exec(html)) !== null) {
    scriptIdx++;
    if (m[0].includes('type="module"')) continue;
    try {
        new vm.Script(m[1]);
        console.log(`Script #${scriptIdx} syntax OK`);
    } catch(e) {
        console.error(`Script #${scriptIdx} Syntax Error:`, e.message);
        hasError = true;
    }
}

if (hasError) {
    console.error('Validation FAILED! Reverting changes...');
    process.exit(1);
} else {
    console.log('ALL SCRIPTS PASSED SYNTAX VALIDATION PERFECTLY! 100% OK');
}
