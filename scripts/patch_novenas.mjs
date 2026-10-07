import fs from 'fs';

let html = fs.readFileSync('novenas.html', 'utf8');

const newSpotlight = `        // Renderiza o destaque (Spotlight) das novenas com prioridade para a do fiel em andamento
        function renderSpotlight() {
            const container = document.getElementById('spotlight-active');
            if (!container) return;

            // 1. Identificar novenas que o fiel já iniciou (progresso > 0 e < 9)
            const inProgressList = [];
            for (const nov of novenasList) {
                const prog = getNovenaCompletedDays(nov.id);
                if (prog.length > 0 && prog.length < 9) {
                    let meta = {};
                    try { meta = JSON.parse(localStorage.getItem(\`thesaurus_meta_\${nov.id}\`) || '{}'); } catch(e) {}
                    const status = LiturgicalEngine.evaluateNovenaStatus(nov, todayDate);
                    const startedTime = meta.startedAt || (meta.date ? new Date(meta.date).getTime() : 0) || (status.schedule?.startDate ? status.schedule.startDate.getTime() : 0);
                    const nextPendingDay = [1,2,3,4,5,6,7,8,9].find(d => !prog.includes(d)) || 1;
                    const calendarDay = status.currentDay || nextPendingDay;
                    const isTodayPrayed = prog.includes(calendarDay);
                    const targetDay = isTodayPrayed ? calendarDay : nextPendingDay;

                    inProgressList.push({
                        novena: nov,
                        status,
                        completedDays: prog,
                        completedCount: prog.length,
                        pct: Math.round((prog.length / 9) * 100),
                        nextPendingDay,
                        calendarDay,
                        targetDay,
                        startedTime,
                        isTodayPrayed
                    });
                }
            }

            // Ordenar da mais antiga para a mais recente
            inProgressList.sort((a, b) => a.startedTime - b.startedTime);

            // SE O FIEL TEM NOVENA EM ANDAMENTO, ELA É O SPOTLIGHT PRINCIPAL!
            if (inProgressList.length > 0) {
                const primary = inProgressList[0];
                const fullNovena = primary.novena;
                const actImg = getNovenaImage(fullNovena);
                const nextPending = primary.nextPendingDay;
                const targetDay = primary.targetDay;
                const completedCount = primary.completedCount;
                const pct = primary.pct;

                container.classList.remove('hidden');
                container.innerHTML = \`
                    <div class="p-6 rounded-3xl bg-linear-to-r from-rose-50 via-amber-50 to-emerald-50 dark:from-rose-950/30 dark:via-slate-900 dark:to-emerald-950/30 border-2 border-rose-300 dark:border-rose-800 shadow-md">
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-5">
                            <div class="flex items-start gap-4">
                                <div class="w-16 h-16 rounded-2xl overflow-hidden bg-rose-500 text-white shadow-lg shrink-0 flex items-center justify-center border-2 border-white dark:border-slate-800">
                                    \${actImg ? \`
                                        <img src="\${actImg}" alt="\${fullNovena.titulo}" class="w-full h-full object-cover" onerror="window.handleSaintImageError(this, '\${fullNovena.id}')">
                                        <div class="hidden w-full h-full items-center justify-center text-3xl">\${fullNovena.simbolo || '🌹'}</div>
                                    \` : \`<span class="text-3xl">\${fullNovena.simbolo || '🌹'}</span>\`}
                                </div>
                                <div class="min-w-0">
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-2xs">
                                            🌹 SUA NOVENA EM ANDAMENTO
                                        </span>
                                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300">
                                            Progresso: \${completedCount}/9 dias (\${pct}%)
                                        </span>
                                        <span class="text-[11px] font-bold text-rose-800 dark:text-rose-300">
                                            Próximo: Dia \${nextPending}
                                        </span>
                                    </div>
                                    <h3 class="font-serif text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                        \${fullNovena.titulo}
                                    </h3>
                                    <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
                                        Você já completou \${completedCount} dias. Continue sua oração para não quebrar a sequência: <em>\${fullNovena.dias[targetDay - 1]?.tema || ''}</em>.
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3 shrink-0">
                                <button onclick="openNovenaModal('\${fullNovena.id}', \${targetDay})" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2">
                                    <span>Continuar Oração (Dia \${targetDay})</span>
                                    <span>➔</span>
                                </button>
                            </div>
                        </div>
                    </div>
                \`;
                return;
            }

            // Caso o fiel não tenha novenas em andamento, busca as do calendário litúrgico
            const activeList = LiturgicalEngine.getActiveNovenas(novenasList, todayDate);

            if (!activeList.length) {
                const upcoming = LiturgicalEngine.getUpcomingNovenas(novenasList, todayDate, 1);
                if (upcoming.length) {
                    const up = upcoming[0];
                    const fullNovena = novenasList.find(n => n.id === up.id);
                    const upImg = getNovenaImage(fullNovena);
                    container.classList.remove('hidden');
                    container.innerHTML = \`
                        <div class="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                            <div class="flex items-center gap-3.5">
                                <div class="w-14 h-14 rounded-2xl overflow-hidden bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 shadow-xs shrink-0 flex items-center justify-center">
                                    \${upImg ? \`
                                        <img src="\${upImg}" alt="\${fullNovena.titulo}" class="w-full h-full object-cover" onerror="window.handleSaintImageError(this, '\${fullNovena.id}')">
                                        <div class="hidden w-full h-full items-center justify-center text-3xl">\${fullNovena.simbolo || '⏳'}</div>
                                    \` : \`<span class="text-3xl">\${fullNovena.simbolo || '⏳'}</span>\`}
                                </div>
                                <div>
                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                                        Próxima Novena
                                    </span>
                                    <h4 class="font-serif text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
                                        \${fullNovena.titulo}
                                    </h4>
                                    <p class="text-xs text-slate-600 dark:text-slate-400">
                                        \${up.statusLabel} • Festa litúrgica em \${LiturgicalEngine.formatLiturgicalDate(up.feastISO)}
                                    </p>
                                </div>
                            </div>
                            <button onclick="openNovenaModal('\${fullNovena.id}')" class="px-5 py-2.5 rounded-xl bg-mariana dark:bg-dourado text-white dark:text-slate-900 font-bold text-xs shadow-sm hover:opacity-90 transition shrink-0 cursor-pointer">
                                Conhecer Novena →
                            </button>
                        </div>
                    \`;
                }
                return;
            }

            container.classList.remove('hidden');
            const primaryActive = activeList[0];
            const fullNovena = novenasList.find(n => n.id === primaryActive.id);
            const actImg = getNovenaImage(fullNovena);

            container.innerHTML = \`
                <div class="p-6 rounded-3xl bg-linear-to-r from-rose-50 via-amber-50 to-emerald-50 dark:from-rose-950/30 dark:via-slate-900 dark:to-emerald-950/30 border border-rose-200 dark:border-rose-900 shadow-md">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-5">
                        <div class="flex items-start gap-4">
                            <div class="w-16 h-16 rounded-2xl overflow-hidden bg-rose-500 text-white shadow-lg shrink-0 flex items-center justify-center border-2 border-white dark:border-slate-800">
                                \${actImg ? \`
                                    <img src="\${actImg}" alt="\${fullNovena.titulo}" class="w-full h-full object-cover" onerror="window.handleSaintImageError(this, '\${fullNovena.id}')">
                                    <div class="hidden w-full h-full items-center justify-center text-3xl">\${fullNovena.simbolo || '🌹'}</div>
                                \` : \`<span class="text-3xl">\${fullNovena.simbolo || '🌹'}</span>\`}
                            </div>
                            <div>
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200 animate-pulse">
                                        🔥 Novena Ativa Hoje!
                                    </span>
                                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                                        \${primaryActive.statusBadge}
                                    </span>
                                </div>
                                <h3 class="font-serif text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                    \${fullNovena.titulo}
                                </h3>
                                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
                                    Hoje a Igreja e os devotos rezam o <strong>Dia \${primaryActive.currentDay} de 9</strong>: <em>\${fullNovena.dias[primaryActive.currentDay - 1]?.tema || ''}</em>.
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 shrink-0">
                            <button onclick="openNovenaModal('\${fullNovena.id}', \${primaryActive.currentDay})" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2">
                                <span>Rezar Dia \${primaryActive.currentDay}</span>
                                <span>➔</span>
                            </button>
                        </div>
                    </div>
                </div>
            \`;
        }`;

const newCheckHash = `        function checkUrlHash() {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                let targetId = hash;
                let targetDay = null;
                if (hash.includes('-day-')) {
                    const parts = hash.split('-day-');
                    targetId = parts[0];
                    targetDay = parseInt(parts[1], 10);
                }
                const n = novenasList.find(item => item.id === targetId);
                if (n) {
                    const st = LiturgicalEngine.evaluateNovenaStatus(n, todayDate);
                    const userProgress = getNovenaCompletedDays(n.id);
                    const nextPendingDay = [1,2,3,4,5,6,7,8,9].find(d => !userProgress.includes(d)) || 1;
                    const finalDay = targetDay || ((userProgress.length > 0 && userProgress.length < 9) ? nextPendingDay : (st.currentDay || 1));
                    openNovenaModal(n.id, finalDay);
                }
            }
        }`;

const idx1 = html.indexOf('function renderSpotlight()');
const idx2 = html.indexOf('function renderCards()', idx1);
if (idx1 !== -1 && idx2 !== -1) {
    html = html.substring(0, idx1) + newSpotlight.trim() + '\n\n        ' + html.substring(idx2);
    console.log('Spotlight replaced!');
} else {
    console.error('Could not find renderSpotlight');
}

const idxH1 = html.indexOf('function checkUrlHash()');
const idxH2 = html.indexOf('window.addEventListener(\'hashchange\', checkUrlHash);', idxH1);
if (idxH1 !== -1 && idxH2 !== -1) {
    html = html.substring(0, idxH1) + newCheckHash.trim() + '\n        ' + html.substring(idxH2);
    console.log('checkUrlHash replaced!');
} else {
    console.error('Could not find checkUrlHash');
}

fs.writeFileSync('novenas.html', html, 'utf8');
console.log('novenas.html successfully written!');
