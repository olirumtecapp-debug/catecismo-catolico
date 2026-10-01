import fs from 'fs';
import path from 'path';

const indexPath = path.resolve('index.html');
let content = fs.readFileSync(indexPath, 'utf8');

const targetAnchor = '<!-- 8. GESTÃO E ATUALIZAÇÃO DA LITURGIA DIÁRIA -->';
if (!content.includes(targetAnchor)) {
    console.error('Target anchor not found!');
    process.exit(1);
}

if (content.includes('Gestão do Calendário do Advento (Motor Litúrgico Perpétuo)')) {
    console.log('Seção do Advento já existe no index.html!');
    process.exit(0);
}

const adventAdminHtml = `<!-- 7.5 GESTÃO DO CALENDÁRIO DO ADVENTO (MOTOR LITÚRGICO PERPÉTUO) -->
                    <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 border border-slate-200 dark:border-slate-700 space-y-5">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-200 flex items-center justify-center text-xl shrink-0">
                                    🕯️
                                </div>
                                <div>
                                    <h4 class="font-serif text-lg font-bold text-mariana dark:text-slate-100">
                                        Gestão do Calendário do Advento (Motor Litúrgico Perpétuo)
                                    </h4>
                                    <p class="text-xs text-slate-500 dark:text-slate-400">
                                        Cálculo canônico perpétuo e simulador para os anos 2026, 2027, 2028, 2029 e 2030
                                    </p>
                                </div>
                            </div>
                            <button type="button" onclick="AdventManager.openModal(1)" class="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-center">
                                <span>📖</span> <span>Visualizar Calendário Completo</span>
                            </button>
                        </div>

                        <!-- Informações do Motor Litúrgico em Tempo Real -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ano Vigente (2026)</span>
                                <strong class="text-sm text-mariana dark:text-amber-200 block">29/11/2026 a 24/12/2026</strong>
                                <span class="text-[11px] text-slate-500 block">Duração: 26 dias (Natal na Sexta-feira)</span>
                            </div>
                            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Próximo Ano (2027)</span>
                                <strong class="text-sm text-mariana dark:text-amber-200 block">28/11/2027 a 24/12/2027</strong>
                                <span class="text-[11px] text-slate-500 block">Duração: 27 dias (Natal no Sábado)</span>
                            </div>
                            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
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

                    ` + targetAnchor;

content = content.replace(targetAnchor, adventAdminHtml);
fs.writeFileSync(indexPath, content, 'utf8');
console.log('✓ Seção de Gestão do Advento inserida com sucesso no ADM!');
