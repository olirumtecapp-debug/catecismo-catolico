import fs from 'fs';

const gemsData = JSON.parse(fs.readFileSync('data/pilulas_espirituais.json', 'utf8'));
let html = fs.readFileSync('index.html', 'utf8');

const p1 = html.indexOf('const SpiritualLightManager = {');
const p2 = html.indexOf('window.SpiritualLightManager = SpiritualLightManager;', p1);

if (p1 === -1 || p2 === -1) {
    console.error('Could not find SpiritualLightManager in index.html');
    process.exit(1);
}

const newManager = `const SpiritualLightManager = {
            gems: ${JSON.stringify(gemsData, null, 16)},

            getTodayGem(indexOffset = 0) {
                const todayStr = getLocalDateString();
                // Usa a data do dia para calcular um dia do ano de 1 a 365, garantindo rotação diária sem repetições
                const parts = todayStr.split('-').map(Number);
                const d = new Date(parts[0], parts[1] - 1, parts[2]);
                const startOfYear = new Date(parts[0], 0, 0);
                const diff = d - startOfYear;
                const oneDay = 1000 * 60 * 60 * 24;
                const dayOfYear = Math.floor(diff / oneDay);

                const finalIndex = (dayOfYear + indexOffset) % this.gems.length;
                return this.gems[Math.abs(finalIndex) % this.gems.length];
            },

            renderCard() {
                const gem = this.getTodayGem(window.__spiritualGemOffset || 0);
                return \`
                    <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
                        <div class="flex items-center gap-2.5">
                            <span class="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center text-sm font-bold">🕊️</span>
                            <div>
                                <h3 class="font-serif text-base font-bold text-mariana dark:text-slate-100">Uma Luz para o Seu Dia</h3>
                                <span class="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">\${gem.tema}</span>
                            </div>
                        </div>
                        <button onclick="SpiritualLightManager.nextGem()" class="text-[11px] text-slate-400 hover:text-mariana dark:hover:text-amber-300 font-bold flex items-center gap-1 transition cursor-pointer" title="Sortear outro ensinamento">
                            <span>🔄</span> <span>Outra</span>
                        </button>
                    </div>
                    <div class="space-y-2.5">
                        <div class="p-3.5 sm:p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 text-xs space-y-2.5">
                            <p class="text-[13px] sm:text-sm font-semibold text-slate-800 dark:text-amber-100 leading-relaxed tracking-normal">
                                \${gem.versiculo}
                            </p>
                            <p class="text-xs text-slate-700 dark:text-slate-300 border-t border-amber-200/60 dark:border-amber-900/50 pt-2 leading-relaxed">
                                <strong class="text-amber-900 dark:text-amber-400 font-bold">Doutrina:</strong> \${gem.catecismo}
                            </p>
                            <p class="text-xs text-slate-800 dark:text-slate-200 font-medium bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl border border-amber-100 dark:border-slate-700 leading-relaxed">
                                🙏 <em class="italic">"\${gem.prece}"</em>
                            </p>
                        </div>
                        <div class="flex justify-between items-center pt-1">
                            <button onclick="SpiritualLightManager.compartilharWhatsApp()" class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer">
                                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.983.54 1.874.82 2.796.821 3.183 0 5.768-2.587 5.769-5.766.001-3.182-2.585-5.767-5.769-5.767zm0 10.428c-.854 0-1.687-.229-2.408-.663l-.173-.102-1.789.469.477-1.744-.113-.179c-.477-.758-.729-1.639-.728-2.543.001-2.573 2.094-4.666 4.669-4.666 2.574 0 4.668 2.093 4.668 4.666 0 2.574-2.094 4.667-4.667 4.667zm6.757-12.825c-1.802-1.802-4.198-2.795-6.754-2.795-5.263 0-9.545 4.282-9.547 9.547 0 1.682.439 3.324 1.272 4.767l-1.35 4.934 5.048-1.324c1.393.76 2.96 1.16 4.567 1.161h.004c5.263 0 9.546-4.282 9.548-9.547 0-2.553-.994-4.949-2.796-6.751z"/></svg>
                                <span>Enviar no WhatsApp</span>
                            </button>
                            <span class="text-[10px] text-slate-400">Pílula espiritual</span>
                        </div>
                    </div>
                \`;
            },

            nextGem() {
                window.__spiritualGemOffset = (window.__spiritualGemOffset || 0) + 1;
                const container = document.getElementById('home-spiritual-light');
                if (container) container.innerHTML = this.renderCard();
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

html = html.substring(0, p1) + newManager + '\n        ' + html.substring(p2);
fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated with 30 spiritual gems! New length:', html.length);
