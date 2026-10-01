import fs from 'fs';
import path from 'path';

const indexPath = path.resolve('index.html');
let html = fs.readFileSync(indexPath, 'utf8').replace(/\r\n/g, '\n');

// 1. Limpar menções internas de Canção Nova
html = html.replace(
  '/* Estilos Litúrgicos Nobres (Lecionário / Canção Nova Standard) */',
  '/* Estilos Litúrgicos Nobres (Lecionário Canônico da Igreja) */'
);

html = html.replace(
  "source:url,sourceName:String(payload?.source || 'Canção Nova'),",
  "source:url,sourceName:String(payload?.source || 'Lecionário Canônico Oficial'),"
);

html = html.replace(
  '<!-- Canção Nova Standard Liturgical Tabs (1ª Leitura, Salmo, 2ª Leitura, Evangelho) -->',
  '<!-- Abas Litúrgicas Canônicas (1ª Leitura, Salmo, 2ª Leitura, Evangelho) -->'
);

// 2. Adicionar botão de Lectio Divina no final do card do Evangelho
const oldEvangelhoNav = `                    } else if (kindKey === 'evangelho') {
                        navButtonsHtml = \`
                            <div class="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                                <button onclick="window.switchLiturgiaTab('\${lit.secondReading ? 'segunda' : 'salmo'}', true)" class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
                                    <span>←</span> <span>\${lit.secondReading ? '2ª Leitura' : 'Salmo'}</span>
                                </button>
                                <div></div>
                            </div>
                        \`;
                    }`;

const newEvangelhoNav = `                    } else if (kindKey === 'evangelho') {
                        navButtonsHtml = \`
                            <div class="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <button onclick="window.switchLiturgiaTab('\${lit.secondReading ? 'segunda' : 'salmo'}', true)" class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start">
                                    <span>←</span> <span>\${lit.secondReading ? '2ª Leitura' : 'Salmo'}</span>
                                </button>
                                <button onclick="router.navigate('oracao')" class="px-4 py-2.5 rounded-xl bg-linear-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer">
                                    <span>🙏</span> <span>Fazer Leitura Orante (Lectio Divina) deste Evangelho</span> <span>→</span>
                                </button>
                            </div>
                        \`;
                    }`;

if (html.includes(oldEvangelhoNav)) {
  html = html.replace(oldEvangelhoNav, newEvangelhoNav);
  console.log('✓ Botão de Lectio Divina integrado ao card do Evangelho!');
}

// 3. Atualizar o grid de Conexões da Liturgia para 4 colunas incluindo Lectio Divina
const oldConexoes = `<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                \${lit.gospel?.reference ? \`<button onclick="openScriptureReferenceFromText('\${encodeURIComponent(lit.gospel.reference)}')" class="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-left hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"><span class="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase">📖 Evangelho</span><strong class="block text-sm text-blue-950 dark:text-blue-100 mt-1">\${esc(lit.gospel.reference)}</strong><span class="text-[10px] text-blue-800/80 dark:text-blue-300/80">Abrir na Bíblia</span></button>\` : ''}
                                <button onclick="router.navigate('santo')" class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-left hover:bg-amber-100 dark:hover:bg-amber-900/50 transition"><span class="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">☩ Santo</span><strong class="block text-sm text-amber-950 dark:text-amber-100 mt-1">\${esc(lit.saintOrMemory || 'Celebração do dia')}</strong><span class="text-[10px] text-amber-800/80 dark:text-amber-300/80">Ver Santo do Dia</span></button>
                                <button onclick="router.navigate('catecismo')" class="p-4 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/60 text-left hover:bg-violet-100 dark:hover:bg-violet-900/50 transition"><span class="text-[10px] font-bold text-violet-700 dark:text-violet-300 uppercase">📜 Catecismo</span><strong class="block text-sm text-violet-950 dark:text-violet-100 mt-1">Relacionar com a fé</strong><span class="text-[10px] text-violet-800/80 dark:text-violet-300/80">Estudar doutrina</span></button>
                            </div>`;

const newConexoes = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                \${lit.gospel?.reference ? \`<button onclick="openScriptureReferenceFromText('\${encodeURIComponent(lit.gospel.reference)}')" class="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-left hover:bg-blue-100 dark:hover:bg-blue-900/50 transition cursor-pointer"><span class="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase">📖 Evangelho</span><strong class="block text-sm text-blue-950 dark:text-blue-100 mt-1 truncate">\${esc(lit.gospel.reference)}</strong><span class="text-[10px] text-blue-800/80 dark:text-blue-300/80">Abrir na Bíblia</span></button>\` : ''}
                                <button onclick="router.navigate('oracao')" class="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-left hover:bg-rose-100 dark:hover:bg-rose-900/50 transition cursor-pointer"><span class="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase">🙏 Lectio Divina</span><strong class="block text-sm text-rose-950 dark:text-rose-100 mt-1 truncate">Leitura Orante</strong><span class="text-[10px] text-rose-800/80 dark:text-rose-300/80">Meditar Palavra de Hoje</span></button>
                                <button onclick="router.navigate('santo')" class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-left hover:bg-amber-100 dark:hover:bg-amber-900/50 transition cursor-pointer"><span class="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">☩ Santo</span><strong class="block text-sm text-amber-950 dark:text-amber-100 mt-1 truncate">\${esc(lit.saintOrMemory || 'Celebração do dia')}</strong><span class="text-[10px] text-amber-800/80 dark:text-amber-300/80">Ver Santo do Dia</span></button>
                                <button onclick="router.navigate('catecismo')" class="p-4 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/60 text-left hover:bg-violet-100 dark:hover:bg-violet-900/50 transition cursor-pointer"><span class="text-[10px] font-bold text-violet-700 dark:text-violet-300 uppercase">📜 Catecismo</span><strong class="block text-sm text-violet-950 dark:text-violet-100 mt-1 truncate">Relacionar com a fé</strong><span class="text-[10px] text-violet-800/80 dark:text-violet-300/80">Estudar doutrina</span></button>
                            </div>`;

if (html.includes(oldConexoes)) {
  html = html.replace(oldConexoes, newConexoes);
  console.log('✓ Card de Lectio Divina adicionado às Conexões da Liturgia!');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✓ Limpeza de referências externas e vinculação da Liturgia concluídas!');
