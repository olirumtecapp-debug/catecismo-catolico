import fs from 'fs';
import path from 'path';

const indexPath = path.resolve('index.html');
let content = fs.readFileSync(indexPath, 'utf8').replace(/\r\n/g, '\n');

// 1. Criar AdventManager logo antes de NovenasManager
const adventManagerCode = `
        /* ========================================================
           GESTOR DO CALENDÁRIO DO ADVENTO (MOTOR LITÚRGICO PERPÉTUO)
           ======================================================== */
        const AdventManager = {
            data: null,
            simulatedDate: null,

            async loadData() {
                if (this.data && this.data.length) return this.data;
                try {
                    const res = await fetch('/data/advento.json');
                    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
                    this.data = await res.json();
                    return this.data;
                } catch (e) {
                    console.warn('[AdventManager] Erro ao carregar /data/advento.json:', e);
                    return [];
                }
            },

            getEffectiveDate() {
                if (this.simulatedDate) return this.simulatedDate;
                try {
                    const savedSim = sessionStorage.getItem('catecismo_advent_simulated_date');
                    if (savedSim) return savedSim;
                } catch(e) {}
                return getLocalDateString();
            },

            setSimulatedDate(dateStr) {
                this.simulatedDate = dateStr;
                try {
                    if (dateStr) sessionStorage.setItem('catecismo_advent_simulated_date', dateStr);
                    else sessionStorage.removeItem('catecismo_advent_simulated_date');
                } catch(e) {}
                this.updateHomeCard();
                if (window.renderAdminDashboardModal) renderAdminDashboardModal();
            },

            async getStatus() {
                if (!window.LiturgicalEngine) {
                    try {
                        const mod = await import('./services/liturgicalEngine.js');
                        window.LiturgicalEngine = mod.default || mod;
                    } catch(e) {}
                }
                const dateStr = this.getEffectiveDate();
                if (window.LiturgicalEngine && typeof window.LiturgicalEngine.getAdventStatus === 'function') {
                    return window.LiturgicalEngine.getAdventStatus(dateStr);
                }
                return { isActive: false, currentDay: null };
            },

            getProgress(year) {
                const y = year || new Date().getFullYear();
                try {
                    return JSON.parse(localStorage.getItem(\`advento_progress_\${y}\`) || '[]');
                } catch(e) { return []; }
            },

            toggleProgress(day, year) {
                const y = year || new Date().getFullYear();
                let list = this.getProgress(y);
                const d = Number(day);
                if (list.includes(d)) {
                    list = list.filter(x => x !== d);
                } else {
                    list.push(d);
                    if (window.AppState) {
                        AppState.xp = (AppState.xp || 0) + 10;
                        saveState();
                    }
                    showToast('Propósito do Advento concluído! (+10 XP)', 'success');
                }
                try {
                    localStorage.setItem(\`advento_progress_\${y}\`, JSON.stringify(list));
                } catch(e) {}
                this.updateHomeCard();
                return list.includes(d);
            },

            async updateHomeCard() {
                const container = document.getElementById('home-advento-alert-container');
                if (!container) return;

                const status = await this.getStatus();
                const isSimulated = !!this.simulatedDate;

                if (!status.isActive && !isSimulated) {
                    container.innerHTML = '';
                    return;
                }

                const data = await this.loadData();
                const currentDay = status.currentDay || 1;
                const dayItem = data.find(x => x.dia === currentDay) || data[0];
                const year = status.schedule?.year || new Date().getFullYear();
                const progress = this.getProgress(year);
                const isCompletedToday = progress.includes(currentDay);

                container.innerHTML = \`
                    <div class="p-4 sm:p-5 rounded-3xl bg-linear-to-r from-indigo-900 via-purple-900 to-amber-950 text-white shadow-lg border border-amber-300/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300 relative">
                        \${isSimulated ? \`
                            <div class="absolute -top-2.5 left-6 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs">
                                🛠️ Modo de Teste ADM Simulado: \${this.simulatedDate}
                            </div>
                        \` : ''}
                        <div class="flex items-center gap-3.5 min-w-0 pr-4 sm:pr-0">
                            <div class="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-200 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                                🕯️
                            </div>
                            <div class="min-w-0">
                                <div class="flex items-center gap-2 mb-0.5">
                                    <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-2xs">
                                        Tempo do Advento • Dia \${currentDay} de \${status.totalDays || 26}
                                    </span>
                                    <span class="text-[10px] text-purple-200 font-semibold">\${dayItem.vela || 'Coroa do Advento'}</span>
                                    \${isCompletedToday ? \`<span class="text-[9px] bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded-full">✓ Cumprido</span>\` : ''}
                                </div>
                                <h4 class="font-serif text-base sm:text-lg font-bold truncate text-amber-100">\${dayItem.titulo}</h4>
                                <p class="text-xs text-slate-200/90 line-clamp-1">🎯 <strong>Missão de hoje:</strong> \${dayItem.missao_concreta}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <button type="button" onclick="AdventManager.toggleProgress(\${currentDay}, \${year})" class="px-3.5 py-2 rounded-xl \${isCompletedToday ? 'bg-emerald-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white'} text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-white/20">
                                <span>\${isCompletedToday ? '✓ Concluído' : 'Cumprir Missão'}</span>
                            </button>
                            <button type="button" onclick="AdventManager.openModal(\${currentDay})" class="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer">
                                <span>Ver Calendário</span> <span>→</span>
                            </button>
                        </div>
                    </div>
                \`;
            },

            async openModal(selectedDay) {
                const modal = document.getElementById('modal-container');
                if (!modal) return;

                const data = await this.loadData();
                const status = await this.getStatus();
                const year = status.schedule?.year || new Date().getFullYear();
                const progress = this.getProgress(year);
                const currentDay = Number(selectedDay) || status.currentDay || 1;
                const currentItem = data.find(x => x.dia === currentDay) || data[0];
                const isCompleted = progress.includes(currentDay);

                // Calcular velas acesas na Coroa do Advento (1 a 4)
                const currentWeek = status.currentWeek || Math.min(4, Math.floor((currentDay - 1) / 7) + 1);

                modal.innerHTML = \`
                    <div class="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto custom-scrollbar shadow-2xl border border-slate-200 dark:border-slate-800 relative text-left">
                        <button onclick="closeModal()" class="absolute top-6 right-6 w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xl hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">✕</button>

                        <!-- Cabeçalho Litúrgico do Advento -->
                        <div class="pr-12 space-y-2">
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-700">
                                <span>🕯️</span> <span>Itinerário Canônico do Advento • \${year}</span>
                            </div>
                            <h3 class="font-serif text-2xl sm:text-3xl font-bold text-mariana dark:text-amber-200">
                                Calendário do Advento — Caminho para Belém
                            </h3>
                            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                Preparai o caminho do Senhor! A cada dia do Advento, uma reflexão bíblica, uma oração e um gesto concreto de amor para acolher o Menino Jesus no coração.
                            </p>
                        </div>

                        <!-- A Coroa do Advento (Velas Acessas Dinâmicas) -->
                        <div class="bg-linear-to-r from-purple-950 via-slate-900 to-amber-950 p-4 sm:p-5 rounded-2xl border border-amber-400/40 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div class="space-y-1 text-center sm:text-left">
                                <span class="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">A Coroa do Advento</span>
                                <h4 class="font-serif font-bold text-base text-amber-100">Semana \${currentWeek} de 4 • \${currentWeek >= 3 ? 'Alegria de Gaudete' : 'Vigilância e Conversão'}</h4>
                                <p class="text-xs text-slate-300">\${progress.length} de \${status.totalDays || 26} dias de propósitos concluídos (\${Math.round((progress.length / (status.totalDays || 26)) * 100)}%)</p>
                            </div>
                            <!-- Representação das 4 Velas da Coroa -->
                            <div class="flex items-center gap-3">
                                \${[1, 2, 3, 4].map(w => {
                                    const isLit = currentWeek >= w;
                                    const isGaudete = w === 3;
                                    return \`
                                        <div class="flex flex-col items-center gap-1 text-center">
                                            <div class="text-xl \${isLit ? 'animate-bounce' : 'opacity-30'} select-none">\${isLit ? '🔥' : '🕯️'}</div>
                                            <div class="w-5 h-8 rounded-sm \${isGaudete ? 'bg-rose-400 border border-rose-300' : 'bg-purple-700 border border-purple-500'} \${isLit ? 'shadow-lg shadow-amber-500/50' : 'opacity-40'}"></div>
                                            <span class="text-[9px] font-bold \${isLit ? 'text-amber-300' : 'text-slate-500'}">\${w}ª Vela</span>
                                        </div>
                                    \`;
                                }).join('')}
                            </div>
                        </div>

                        <!-- Mosaico dos Dias do Calendário -->
                        <div>
                            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">Selecione o Dia para Meditar:</span>
                            <div class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-1.5">
                                \${data.map(item => {
                                    const isDone = progress.includes(item.dia);
                                    const isSel = item.dia === currentDay;
                                    return \`
                                        <button type="button" onclick="AdventManager.openModal(\${item.dia})" class="p-2 rounded-xl text-center font-bold text-xs transition cursor-pointer flex flex-col items-center justify-center \${isSel ? 'bg-amber-500 text-slate-950 shadow-md scale-105' : (isDone ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200')}">
                                            <span class="text-[9px]">\${isDone ? '✓' : 'Dia'}</span>
                                            <span>\${item.dia}</span>
                                        </button>
                                    \`;
                                }).join('')}
                            </div>
                        </div>

                        <!-- Detalhe do Dia Selecionado -->
                        <div class="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
                            <div class="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3 flex-wrap">
                                <div>
                                    <span class="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">\${currentItem.vela}</span>
                                    <h4 class="font-serif text-xl sm:text-2xl font-bold text-mariana dark:text-amber-200 mt-0.5">
                                        Dia \${currentItem.dia} — \${currentItem.titulo}
                                    </h4>
                                </div>
                                <button type="button" onclick="AdventManager.toggleProgress(\${currentItem.dia}, \${year}); AdventManager.openModal(\${currentItem.dia});" class="px-4 py-2 rounded-xl \${isCompleted ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'gold-gradient text-mariana-dark'} text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer">
                                    <span>\${isCompleted ? '✓ Missão Cumprida' : 'Marcar como Cumprida (+10 XP)'}</span>
                                </button>
                            </div>

                            <!-- Palavra Bíblica -->
                            <div class="bg-amber-50/70 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-800/60">
                                <span class="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-widest block mb-1">Palavra de Deus:</span>
                                <p class="font-serif text-sm sm:text-base text-slate-800 dark:text-slate-100 italic leading-relaxed">
                                    "\${currentItem.versiculo}"
                                </p>
                            </div>

                            <!-- Reflexão Espiritual -->
                            <div class="space-y-1">
                                <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Meditação do Coração:</span>
                                <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                    \${currentItem.reflexao}
                                </p>
                            </div>

                            <!-- Oração Diária -->
                            <div class="bg-purple-50/70 dark:bg-purple-950/30 p-4 rounded-xl border border-purple-200 dark:border-purple-800/60">
                                <span class="text-[10px] font-bold text-purple-800 dark:text-purple-300 uppercase tracking-widest block mb-1">Oração em Família / Pessoal:</span>
                                <p class="font-serif text-xs sm:text-sm text-purple-950 dark:text-purple-200 italic leading-relaxed">
                                    "\${currentItem.oracao}"
                                </p>
                            </div>

                            <!-- Missão Prática Concreta -->
                            <div class="p-4 rounded-xl bg-amber-100/70 dark:bg-amber-950/60 border-2 border-amber-300 dark:border-amber-700 space-y-1">
                                <div class="flex items-center gap-2">
                                    <span class="text-base">🎯</span>
                                    <span class="text-xs font-bold text-amber-950 dark:text-amber-200 uppercase tracking-wider">Missão Concreta do Dia:</span>
                                </div>
                                <p class="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed pl-6">
                                    \${currentItem.missao_concreta}
                                </p>
                            </div>

                            <!-- Botão Compartilhar no WhatsApp -->
                            <div class="flex justify-end pt-2">
                                <button type="button" onclick="AdventManager.compartilharWhatsApp(\${currentItem.dia})" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer">
                                    <span>📲 Compartilhar Missão no WhatsApp</span>
                                </button>
                            </div>
                        </div>
                    </div>
                \`;

                modal.classList.remove('hidden');
                modal.classList.add('flex');
            },

            async compartilharWhatsApp(dayNum) {
                const data = await this.loadData();
                const item = data.find(x => x.dia === dayNum) || data[0];
                const msg = \`🕯️ *Calendário do Advento — Dia \${item.dia}*\n\n📖 *Palavra de Deus:*\n_"\${item.versiculo}"_\n\n💭 *Meditação:*\n\${item.reflexao}\n\n🙏 *Oração:*\n_"\${item.oracao}"_\n\n🎯 *Missão de Hoje:*\n\${item.missao_concreta}\n\n✨ _Prepare seu coração para o Natal no Catecismo Católico:_\nhttps://catecismo.creativeam.com.br\`;

                if (navigator.share) {
                    try {
                        await navigator.share({ title: \`Calendário do Advento • Dia \${item.dia}\`, text: msg });
                        return;
                    } catch(e) {
                        if (e.name === 'AbortError') return;
                    }
                }
                window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(msg), '_blank');
            }
        };
        window.AdventManager = AdventManager;
`;

if (!content.includes('const AdventManager =')) {
    content = content.replace('/* ==========================================\n           GESTOR DE NOVENAS CATÓLICAS (THESAURUS)', adventManagerCode + '\n        /* ==========================================\n           GESTOR DE NOVENAS CATÓLICAS (THESAURUS)');
    console.log('✓ AdventManager adicionado ao index.html com sucesso!');
}

// 2. Inserir o container #home-advento-alert-container na Home
const homeAnchor = '<div id="home-novena-alert-container"></div>';
const newHomeContainers = `<div id="home-advento-alert-container"></div>\n                <div id="home-novena-alert-container"></div>`;

if (content.includes(homeAnchor) && !content.includes('home-advento-alert-container')) {
    content = content.replace(homeAnchor, newHomeContainers);
    console.log('✓ #home-advento-alert-container adicionado na tela inicial!');
}

// 3. Chamar AdventManager.updateHomeCard() em loadHomeContextAsync
const oldLoadHomeCall = 'NovenasManager.updateHomeCard();';
const newLoadHomeCall = 'NovenasManager.updateHomeCard();\n                    AdventManager.updateHomeCard();';

if (content.includes(oldLoadHomeCall) && !content.includes('AdventManager.updateHomeCard();')) {
    content = content.replace(oldLoadHomeCall, newLoadHomeCall);
    console.log('✓ AdventManager.updateHomeCard() vinculado à Home!');
}

// 4. Inserir a Seção Dedicada de Gestão do Advento no Painel ADM (renderAdminDashboardModal)
const adminAnchor = '<!-- SEÇÃO 3: GESTÃO DA LITURGIA DIÁRIA -->';
const adventAdminSection = `<!-- SEÇÃO: GESTÃO DO CALENDÁRIO DO ADVENTO (MOTOR LITÚRGICO PERPÉTUO) -->
                        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 card-shadow space-y-5">
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-200 flex items-center justify-center text-xl shrink-0">
                                        🕯️
                                    </div>
                                    <div>
                                        <h4 class="font-serif text-lg font-bold text-mariana dark:text-slate-100">
                                            Gestão do Calendário do Advento (Motor Litúrgico Perpétuo)
                                        </h4>
                                        <p class="text-xs text-slate-500 dark:text-slate-400">
                                            Cálculo astronômico perpétuo e simulador para os anos 2026, 2027, 2028, 2029 e 2030
                                        </p>
                                    </div>
                                </div>
                                <button type="button" onclick="AdventManager.openModal(1)" class="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-center">
                                    <span>📖</span> <span>Abrir Calendário Completo</span>
                                </button>
                            </div>

                            <!-- Informações do Motor Litúrgico em Tempo Real -->
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
                                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ano Vigente (2026)</span>
                                    <strong class="text-sm text-mariana dark:text-amber-200 block">29/11/2026 a 24/12/2026</strong>
                                    <span class="text-[11px] text-slate-500 block">Duração: 26 dias (Natal na Sexta-feira)</span>
                                </div>
                                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
                                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Próximo Ano (2027)</span>
                                    <strong class="text-sm text-mariana dark:text-amber-200 block">28/11/2027 a 24/12/2027</strong>
                                    <span class="text-[11px] text-slate-500 block">Duração: 27 dias (Natal no Sábado)</span>
                                </div>
                                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
                                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ano 2028</span>
                                    <strong class="text-sm text-mariana dark:text-amber-200 block">03/12/2028 a 24/12/2028</strong>
                                    <span class="text-[11px] text-slate-500 block">Duração: 22 dias (Natal na Segunda-feira)</span>
                                </div>
                            </div>

                            <!-- Painel de Simulação Rápida para o Administrador -->
                            <div class="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-3">
                                <div>
                                    <span class="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-widest block">Simulador de Teste para o Administrador:</span>
                                    <p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                        Clique em uma data para simular imediatamente como a Home e o Calendário do Advento aparecem para o fiel sem precisar esperar dezembro:
                                    </p>
                                </div>
                                <div class="flex flex-wrap gap-2 pt-1">
                                    <button type="button" onclick="AdventManager.setSimulatedDate(null); showToast('Retornado para o modo de data real de hoje.', 'info');" class="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition cursor-pointer">
                                        🟢 Data Real de Hoje (\${getLocalDateString()})
                                    </button>
                                    <button type="button" onclick="AdventManager.setSimulatedDate('2026-11-29'); showToast('Simulando 1º Domingo do Advento (29/11/2026)!', 'success');" class="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition cursor-pointer shadow-xs">
                                        🕯️ Simular 1º Domingo do Advento (Dia 1)
                                    </button>
                                    <button type="button" onclick="AdventManager.setSimulatedDate('2026-12-05'); showToast('Simulando Dia 7 do Advento (05/12/2026)!', 'success');" class="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition cursor-pointer shadow-xs">
                                        🕯️ Simular Dia 7 do Advento
                                    </button>
                                    <button type="button" onclick="AdventManager.setSimulatedDate('2026-12-13'); showToast('Simulando 3º Domingo de Gaudete (13/12/2026)!', 'success');" class="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer shadow-xs">
                                        🌹 Simular Gaudete (Vela Rosa)
                                    </button>
                                    <button type="button" onclick="AdventManager.setSimulatedDate('2026-12-24'); showToast('Simulando Véspera de Natal (24/12/2026)!', 'success');" class="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition cursor-pointer shadow-xs">
                                        ⭐ Simular Véspera de Natal (24/Dez)
                                    </button>
                                </div>
                            </div>
                        </div>

                        ${adminAnchor}`;

if (content.includes(adminAnchor) && !content.includes('Gestão do Calendário do Advento (Motor Litúrgico Perpétuo)')) {
    content = content.replace(adminAnchor, adventAdminSection);
    console.log('✓ Seção de Gestão do Advento integrada com sucesso ao Painel ADM!');
}

fs.writeFileSync(indexPath, content, 'utf8');
console.log('Fim da integração do AdventManager.');
