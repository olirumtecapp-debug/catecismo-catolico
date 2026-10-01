import fs from 'fs';
import path from 'path';

const indexPath = path.resolve('index.html');
let content = fs.readFileSync(indexPath, 'utf8').replace(/\r\n/g, '\n');

// 1. Inserir window.switchLectioStep logo após window.switchLiturgiaTab
const liturgiaTabAnchor = `            if (scrollIntoView) {
                document.getElementById('liturgical-tabs-nav')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        };`;

const newLectioSwitcher = `            if (scrollIntoView) {
                document.getElementById('liturgical-tabs-nav')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        };

        window.currentLectioStep = 1;
        window.switchLectioStep = function(stepNum) {
            window.currentLectioStep = Number(stepNum) || 1;
            const buttons = document.querySelectorAll('.lectio-step-btn');
            buttons.forEach(btn => {
                const s = Number(btn.getAttribute('data-step') || 1);
                if (s === window.currentLectioStep) {
                    btn.className = 'lectio-step-btn flex-1 min-w-0 text-center px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all bg-mariana text-white shadow-xs cursor-pointer';
                } else {
                    btn.className = 'lectio-step-btn flex-1 min-w-0 text-center px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer';
                }
            });

            const panels = document.querySelectorAll('.lectio-step-panel');
            panels.forEach(p => {
                const s = Number(p.getAttribute('data-step') || 1);
                p.style.display = (s === window.currentLectioStep) ? 'block' : 'none';
            });

            document.getElementById('lectio-gospel-of-day')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };`;

if (!content.includes('window.switchLectioStep')) {
    content = content.replace(liturgiaTabAnchor, newLectioSwitcher);
    console.log('✓ window.switchLectioStep adicionado com sucesso!');
}

// 2. Atualizar loadLectioContextAsync
const oldLectioAsync = `            async loadLectioContextAsync(mainView) {
                const date = getLocalDateString();
                const container = document.getElementById('lectio-gospel-of-day');
                if (!container) return;
                try {
                    const lit = await LiturgicalContentProvider.getLiturgicalDayAsync(date);
                    if (router.currentRoute !== 'oracao' || !mainView.isConnected) return;
                    if (!lit || !lit.gospel) {
                        container.innerHTML = \`
                            <div class="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-sm">
                                <p class="font-bold">Evangelho de Hoje Indisponível</p>
                                <p class="text-xs mt-1">Abra a Liturgia Diária ou a Bíblia para realizar a leitura orante.</p>
                            </div>
                        \`;
                        return;
                    }
                    const gospel = lit.gospel;
                    const savedNotes = (AppState.lectioNotes && AppState.lectioNotes[date]) || '';
                    const savedNotesCount = Object.keys(AppState.lectioNotes || {}).filter(k => (AppState.lectioNotes[k] || '').trim().length > 0).length;
                    container.innerHTML = \`
                        <div class="space-y-4">
                            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                                <div>
                                    <span class="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">Passagem de Hoje</span>
                                    <h4 class="font-serif text-xl font-bold text-mariana mt-1">\${gospel.reference}</h4>
                                    <p class="text-xs text-slate-500">\${lit.celebration || 'Liturgia Diária'} • \${date.split('-').reverse().join('/')}</p>
                                </div>
                                <button onclick="openScriptureReferenceFromText('\${encodeURIComponent(gospel.reference)}')" class="px-4 py-2 bg-mariana hover:bg-mariana-dark text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm">
                                    <span>📖</span> Abrir no Texto Bíblico Completo (Matos Soares) →
                                </button>
                            </div>
                            <div class="bg-white p-5 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed max-h-72 overflow-y-auto custom-scrollbar font-serif whitespace-pre-line">
                                \${esc(formatLiturgicalText(gospel.text))}
                            </div>
                            <div class="bg-amber-50/60 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200/70 dark:border-amber-800/50 space-y-2.5">
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-bold text-mariana dark:text-slate-100 flex items-center gap-1.5">
                                        <span>✍️</span> Seu Diário Espiritual (Lectio / Meditatio)
                                    </span>
                                    <span id="lectio-saved-indicator" class="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold hidden">✓ Salvo no Diário</span>
                                </div>
                                <textarea id="lectio-user-notes" placeholder="O que este Evangelho diz ao meu coração hoje? Escreva aqui sua oração ou propósito..." class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition resize-y min-h-[75px] bg-white dark:bg-slate-900 leading-relaxed font-serif">\${savedNotes}</textarea>
                                <div class="flex items-center justify-between pt-1">
                                    <button type="button" onclick="ReflectionsManager.openModal()" class="text-xs font-bold text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 flex items-center gap-1.5 cursor-pointer hover:underline transition">
                                        <span>📖</span> <span>Minhas Reflexões</span>
                                        <span class="bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold">\${savedNotesCount}</span>
                                    </button>
                                    <button onclick="saveLectioNotes('\${date}')" class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5">
                                        <span>💾</span> <span>Gravar Reflexão</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    \`;
                } catch (e) {
                    console.error('Erro ao carregar Evangelho para Lectio Divina:', e);
                }
            },`;

const newLectioAsync = `            async loadLectioContextAsync(mainView) {
                const date = getLocalDateString();
                const container = document.getElementById('lectio-gospel-of-day');
                if (!container) return;
                try {
                    const lit = await LiturgicalContentProvider.getLiturgicalDayAsync(date);
                    if (router.currentRoute !== 'oracao' || !mainView.isConnected) return;
                    if (!lit || !lit.gospel) {
                        container.innerHTML = \`
                            <div class="p-6 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-sm space-y-2">
                                <p class="font-bold flex items-center gap-2 text-base"><span>⚠️</span> Evangelho de Hoje Indisponível</p>
                                <p class="text-xs">Abra a Liturgia Diária ou a Bíblia para realizar a leitura orante.</p>
                                <button onclick="router.navigate('liturgia')" class="mt-2 px-4 py-2 bg-mariana text-white rounded-xl text-xs font-bold shadow-xs">Ir para Liturgia Diária →</button>
                            </div>
                        \`;
                        return;
                    }
                    const gospel = lit.gospel;
                    const savedNotes = (AppState.lectioNotes && AppState.lectioNotes[date]) || '';
                    const savedNotesCount = Object.keys(AppState.lectioNotes || {}).filter(k => (AppState.lectioNotes[k] || '').trim().length > 0).length;
                    
                    container.innerHTML = \`
                        <div class="space-y-6">
                            <!-- Cabeçalho Litúrgico da Passagem -->
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-700/80 pb-4">
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span class="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 px-2.5 py-1 rounded-lg">Evangelho do Dia</span>
                                        <span class="text-xs text-slate-500 dark:text-slate-400 font-mono">\${date.split('-').reverse().join('/')}</span>
                                    </div>
                                    <h4 class="font-serif text-2xl font-bold text-mariana dark:text-amber-200 mt-1">\${gospel.reference}</h4>
                                    <p class="text-xs text-slate-500 dark:text-slate-400">\${lit.celebration || 'Liturgia Diária'}</p>
                                </div>
                                <button onclick="openScriptureReferenceFromText('\${encodeURIComponent(gospel.reference)}')" class="self-start sm:self-center px-4 py-2.5 bg-mariana hover:bg-mariana-dark text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer">
                                    <span>📖</span> <span>Bíblia Completa</span> <span>→</span>
                                </button>
                            </div>

                            <!-- Navegação das 4 Etapas Canônicas da Lectio Divina -->
                            <div class="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
                                <button onclick="window.switchLectioStep(1)" data-step="1" class="lectio-step-btn flex-1 min-w-0 text-center px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all bg-mariana text-white shadow-xs cursor-pointer whitespace-nowrap">
                                    1. Lectio (Leitura)
                                </button>
                                <button onclick="window.switchLectioStep(2)" data-step="2" class="lectio-step-btn flex-1 min-w-0 text-center px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer whitespace-nowrap">
                                    2. Meditatio (Meditação)
                                </button>
                                <button onclick="window.switchLectioStep(3)" data-step="3" class="lectio-step-btn flex-1 min-w-0 text-center px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer whitespace-nowrap">
                                    3. Oratio (Oração)
                                </button>
                                <button onclick="window.switchLectioStep(4)" data-step="4" class="lectio-step-btn flex-1 min-w-0 text-center px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer whitespace-nowrap">
                                    4. Contemplatio & Actio
                                </button>
                            </div>

                            <!-- PAINEL 1: LECTIO (LEITURA ATENTA) -->
                            <div class="lectio-step-panel space-y-4" data-step="1" style="display: block;">
                                <div class="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-200/80 dark:border-blue-800/60 flex items-start gap-3">
                                    <span class="text-xl shrink-0">📖</span>
                                    <div class="text-xs leading-relaxed text-blue-950 dark:text-blue-200">
                                        <strong class="font-bold">Passo 1 — Lectio (Leitura):</strong> Leia o Evangelho pausadamente, ao menos duas vezes. Deixe que as palavras ressoem no silêncio da sua alma. Preste atenção aos detalhes: onde Jesus está? Com quem Ele fala? Que palavras tocam o seu coração?
                                    </div>
                                </div>
                                <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-serif whitespace-pre-line shadow-xs max-h-96 overflow-y-auto custom-scrollbar select-text">
                                    \${esc(formatLiturgicalText(gospel.text))}
                                </div>
                                <div class="flex justify-end pt-2">
                                    <button onclick="window.switchLectioStep(2)" class="px-5 py-2.5 rounded-xl bg-mariana hover:bg-mariana-dark text-white font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer">
                                        <span>Ir para 2. Meditatio (Meditação)</span> <span>→</span>
                                    </button>
                                </div>
                            </div>

                            <!-- PAINEL 2: MEDITATIO (MEDITAÇÃO DO CORAÇÃO) -->
                            <div class="lectio-step-panel space-y-4" data-step="2" style="display: none;">
                                <div class="p-3.5 bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl border border-amber-200/80 dark:border-amber-800/60 flex items-start gap-3">
                                    <span class="text-xl shrink-0">💭</span>
                                    <div class="text-xs leading-relaxed text-amber-950 dark:text-amber-200">
                                        <strong class="font-bold">Passo 2 — Meditatio (Meditação):</strong> Rumine a Palavra como um tesouro. Não se trata de um estudo puramente intelectual, mas de perguntar: <em>"O que Deus está falando pessoalmente para mim através deste texto hoje?"</em>
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                                        <div class="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 flex items-center justify-center font-bold text-xs">1</div>
                                        <h5 class="font-serif font-bold text-sm text-mariana dark:text-amber-200">O que o texto revela?</h5>
                                        <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Qual face de Deus Jesus revela neste trecho? Sua misericórdia, Sua justiça, Seu zelo ou Sua paciência de Bom Pastor?</p>
                                    </div>
                                    <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                                        <div class="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 flex items-center justify-center font-bold text-xs">2</div>
                                        <h5 class="font-serif font-bold text-sm text-mariana dark:text-amber-200">Como ilumina a minha vida?</h5>
                                        <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Onde as palavras de Jesus tocam minhas alegrias, preocupações de trabalho, feridas familiares ou desafios de hoje?</p>
                                    </div>
                                    <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                                        <div class="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 flex items-center justify-center font-bold text-xs">3</div>
                                        <h5 class="font-serif font-bold text-sm text-mariana dark:text-amber-200">O apelo de conversão</h5>
                                        <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Onde estou falhando ou me acomodando? Que atitude Jesus me pede para desapegar ou transformar?</p>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between pt-2">
                                    <button onclick="window.switchLectioStep(1)" class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition cursor-pointer">
                                        <span>← Reeler o Evangelho</span>
                                    </button>
                                    <button onclick="window.switchLectioStep(3)" class="px-5 py-2.5 rounded-xl bg-mariana hover:bg-mariana-dark text-white font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer">
                                        <span>Ir para 3. Oratio (Oração)</span> <span>→</span>
                                    </button>
                                </div>
                            </div>

                            <!-- PAINEL 3: ORATIO (ORAÇÃO PESSOAL) -->
                            <div class="lectio-step-panel space-y-4" data-step="3" style="display: none;">
                                <div class="p-3.5 bg-rose-50/80 dark:bg-rose-950/40 rounded-2xl border border-rose-200/80 dark:border-rose-900/60 flex items-start gap-3">
                                    <span class="text-xl shrink-0">🙏</span>
                                    <div class="text-xs leading-relaxed text-rose-950 dark:text-rose-200">
                                        <strong class="font-bold">Passo 3 — Oratio (Oração):</strong> Agora é a sua vez de responder a Deus. Fale com Ele como um filho fala com seu pai muito amado, ou como um amigo com outro amigo. Agradeça, peça perdão, suplique ajuda e entregue suas dores.
                                    </div>
                                </div>
                                <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                                    <span class="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">Oração Espontânea Inspirada no Evangelho de Hoje:</span>
                                    <p class="font-serif text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed italic select-text">
                                        "Senhor Jesus Cristo, Vós que falais com tanta clareza e autoridade no Vosso Santo Evangelho, abri os meus ouvidos para escutar a Vossa voz e purificai o meu coração para acolher a Vossa verdade. Não permitais que as preocupações do mundo e o apego às coisas passageiras sufoquem a semente da Vossa Palavra em minha alma. Dai-me a graça de viver hoje segundo o Vosso Espírito. Amém."
                                    </p>
                                </div>
                                <div class="flex items-center justify-between pt-2">
                                    <button onclick="window.switchLectioStep(2)" class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition cursor-pointer">
                                        <span>← Voltar à Meditação</span>
                                    </button>
                                    <button onclick="window.switchLectioStep(4)" class="px-5 py-2.5 rounded-xl bg-mariana hover:bg-mariana-dark text-white font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer">
                                        <span>Ir para 4. Contemplatio & Actio</span> <span>→</span>
                                    </button>
                                </div>
                            </div>

                            <!-- PAINEL 4: CONTEMPLATIO & ACTIO (CONTEMPLAÇÃO E PROPÓSITO) -->
                            <div class="lectio-step-panel space-y-4" data-step="4" style="display: none;">
                                <div class="p-3.5 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 flex items-start gap-3">
                                    <span class="text-xl shrink-0">✨</span>
                                    <div class="text-xs leading-relaxed text-emerald-950 dark:text-emerald-200">
                                        <strong class="font-bold">Passo 4 — Contemplatio & Actio:</strong> Permaneça um instante em silêncio puro, deixando-se olhar por Deus com ternura. Em seguida, formule um <strong>propósito prático e concreto</strong> de caridade, perdão ou serviço para viver hoje.
                                    </div>
                                </div>

                                <div class="bg-amber-50/70 dark:bg-amber-950/30 p-5 rounded-2xl border border-amber-200/80 dark:border-amber-800/60 space-y-3">
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs font-bold text-mariana dark:text-slate-100 flex items-center gap-1.5">
                                            <span>✍️</span> <span>Seu Diário Espiritual (Fruto da Lectio Divina)</span>
                                        </span>
                                        <span id="lectio-saved-indicator" class="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold hidden">✓ Salvo no Diário Espiritual</span>
                                    </div>
                                    <textarea id="lectio-user-notes" placeholder="Qual palavra tocou o meu coração hoje? Que propósito concreto de oração, paciência ou caridade assumirei para o dia de hoje?..." class="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition resize-y min-h-[110px] bg-white dark:bg-slate-900 leading-relaxed font-serif">\${savedNotes}</textarea>
                                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                                        <button type="button" onclick="ReflectionsManager.openModal()" class="text-xs font-bold text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 flex items-center gap-1.5 cursor-pointer hover:underline transition">
                                            <span>📖</span> <span>Ver Minhas Reflexões Gravadas</span>
                                            <span class="bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">\${savedNotesCount}</span>
                                        </button>
                                        <button onclick="saveLectioNotes('\${date}')" class="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-2">
                                            <span>💾</span> <span>Gravar Reflexão & Propósito</span>
                                        </button>
                                    </div>
                                </div>

                                <div class="flex items-center justify-start pt-2">
                                    <button onclick="window.switchLectioStep(3)" class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition cursor-pointer">
                                        <span>← Voltar à Oração</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    \`;
                } catch (e) {
                    console.error('Erro ao carregar Evangelho para Lectio Divina:', e);
                }
            },`;

if (content.includes(oldLectioAsync)) {
    content = content.replace(oldLectioAsync, newLectioAsync);
    console.log('✓ loadLectioContextAsync atualizado com os 4 passos canônicos interativos!');
} else {
    console.error('! oldLectioAsync não encontrado exatamente no index.html');
}

fs.writeFileSync(indexPath, content, 'utf8');
console.log('Fim da atualização da Lectio Divina.');
