import fs from 'fs';

const filePath = 'D:/Catecismo/index.html';
let content = fs.readFileSync(filePath, 'utf8');
const isCrlf = content.includes('\r\n');
console.log('Arquivo usa CRLF?', isCrlf);

// 1. Anti-iframe recursion
if (!content.includes('Anti-iframe Recursion')) {
    const target = `<script>\r\n        /* ==========================================\r\n           1. DATA PROVIDERS DEFINITION`;
    const targetLf = `<script>\n        /* ==========================================\n           1. DATA PROVIDERS DEFINITION`;
    const rep = `<script>\r\n        // Prevenção estrita de aninhamento recursivo em iframe (Anti-iframe Recursion)\r\n        if (window.self !== window.top) {\r\n            try {\r\n                if (window.top && window.top.location) {\r\n                    window.top.location.href = window.location.href.replace('#preceitos', '');\r\n                }\r\n            } catch (e) {\r\n                document.documentElement.style.display = 'none';\r\n            }\r\n        }\r\n\r\n        /* ==========================================\r\n           1. DATA PROVIDERS DEFINITION`;
    if (content.includes(target)) {
        content = content.replace(target, rep);
        console.log('✓ 1. Anti-iframe recursion adicionada');
    } else if (content.includes(targetLf)) {
        content = content.replace(targetLf, rep.replace(/\r\n/g, '\n'));
        console.log('✓ 1. Anti-iframe recursion adicionada (LF)');
    } else {
        console.error('✗ 1. Falha no scriptMarker');
    }
}

// 2. Link Escola da Fé no Menu Lateral
const sideNeedle = `<span class="truncate">Preceitos &amp; Calendário</span>\r\n                    </button>`;
const sideNeedleLf = `<span class="truncate">Preceitos &amp; Calendário</span>\n                    </button>`;
const sideRep = `<span class="truncate">Preceitos &amp; Calendário</span>\r\n                    </button>\r\n                    <a href="https://escoladafe.creativeam.com.br/" target="_blank" rel="noopener noreferrer" class="nav-item group w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl font-medium text-amber-900 bg-amber-50/70 hover:bg-amber-100/90 border border-amber-200/70 transition text-xs sm:text-sm text-left shadow-2xs" title="Abrir Escola da Fé em nova aba">\r\n                        <div class="flex items-center gap-2 truncate">\r\n                            <span class="text-sm shrink-0">🎓</span>\r\n                            <span class="truncate font-semibold text-amber-950 dark:text-amber-200">Escola da Fé</span>\r\n                        </div>\r\n                        <svg class="w-3.5 h-3.5 text-amber-700 dark:text-amber-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>\r\n                    </a>`;

if (!content.includes('title="Abrir Escola da Fé em nova aba"')) {
    if (content.includes(sideNeedle)) {
        content = content.replace(sideNeedle, sideRep);
        console.log('✓ 2. Escola da Fé adicionada ao menu lateral');
    } else if (content.includes(sideNeedleLf)) {
        content = content.replace(sideNeedleLf, sideRep.replace(/\r\n/g, '\n'));
        console.log('✓ 2. Escola da Fé adicionada ao menu lateral (LF)');
    } else {
        console.error('✗ 2. Falha no sideNeedle');
    }
}

// 3. Link Escola da Fé no Menu Gaveta Mobile
const mobNeedle = `<span>📜 Preceitos &amp; Calendário</span>\r\n                        </button>`;
const mobNeedleLf = `<span>📜 Preceitos &amp; Calendário</span>\n                        </button>`;
const mobRep = `<span>📜 Preceitos &amp; Calendário</span>\r\n                        </button>\r\n                        <a href="https://escoladafe.creativeam.com.br/" target="_blank" rel="noopener noreferrer" onclick="toggleMobileMenu();" class="nav-item w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-semibold text-amber-900 bg-amber-50/80 hover:bg-amber-100 border border-amber-200/90 transition text-sm">\r\n                            <div class="flex items-center gap-3">\r\n                                <span>🎓</span> <span>Escola da Fé</span>\r\n                            </div>\r\n                            <span class="text-xs text-amber-700 font-bold flex items-center gap-1">Acessar ↗</span>\r\n                        </a>`;

if (!content.includes('<span>🎓</span> <span>Escola da Fé</span>')) {
    if (content.includes(mobNeedle)) {
        content = content.replace(mobNeedle, mobRep);
        console.log('✓ 3. Escola da Fé adicionada ao menu mobile');
    } else if (content.includes(mobNeedleLf)) {
        content = content.replace(mobNeedleLf, mobRep.replace(/\r\n/g, '\n'));
        console.log('✓ 3. Escola da Fé adicionada ao menu mobile (LF)');
    } else {
        console.error('✗ 3. Falha no mobNeedle');
    }
}

// 4. Card Especial Escola da Fé na Home
const homeNeedle = `<!-- BLOCO: FORMAÇÃO RÁPIDA & LUZ ESPIRITUAL (RESPONSIVO DESKTOP/MOBILE) -->`;
const homeCard = `<!-- Card Especial: Escola da Fé - Formação Doutrinária & Catequese Contínua -->\r\n                        <div class="bg-gradient-to-br from-slate-900 via-[#2A171D] to-slate-950 text-white rounded-3xl p-6 md:p-8 border border-amber-500/40 card-shadow relative overflow-hidden space-y-5">\r\n                            <div class="absolute -right-6 -bottom-6 text-9xl opacity-10 select-none pointer-events-none font-serif">🎓</div>\r\n                            <div class="absolute right-10 top-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>\r\n\r\n                            <div class="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">\r\n                                <div class="space-y-3 max-w-2xl">\r\n                                    <div class="flex items-center gap-2.5 flex-wrap">\r\n                                        <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-2xs">\r\n                                            <span>🎓</span> Formação Teológica &amp; Doutrinária\r\n                                        </span>\r\n                                        <span class="text-xs text-amber-200/90 font-bold flex items-center gap-1">\r\n                                            <span>✝️</span> Fidelidade ao Magistério da Igreja\r\n                                        </span>\r\n                                    </div>\r\n                                    \r\n                                    <h3 class="font-serif text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug">\r\n                                        Escola da Fé <span class="text-amber-400 font-normal italic text-lg md:text-xl block sm:inline sm:ml-2">— Aprofunde sua Vida Espiritual</span>\r\n                                    </h3>\r\n                                    \r\n                                    <p class="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">\r\n                                        Conheça o portal de formação contínua com estudos temáticos, aprofundamento dos <strong>Dogmas Católicos</strong>, Teologia Moral, História da Igreja e Sagradas Escrituras em harmonia com o Catecismo.\r\n                                    </p>\r\n\r\n                                    <div class="flex flex-wrap gap-2 pt-1 text-[11px] text-amber-200/90 font-medium">\r\n                                        <span class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">\r\n                                            <span class="text-amber-400">📜</span> 10 Mandamentos &amp; Moral\r\n                                        </span>\r\n                                        <span class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">\r\n                                            <span class="text-amber-400">🕊️</span> Sacramentos &amp; Graça\r\n                                        </span>\r\n                                        <span class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">\r\n                                            <span class="text-amber-400">⛪</span> Doutrina dos Santos\r\n                                        </span>\r\n                                        <span class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">\r\n                                            <span class="text-amber-400">📖</span> Exegese Bíblica\r\n                                        </span>\r\n                                    </div>\r\n                                </div>\r\n\r\n                                <div class="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">\r\n                                    <a href="https://escoladafe.creativeam.com.br/" target="_blank" rel="noopener noreferrer" class="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-gold transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer group text-center">\r\n                                        <span>Acessar Escola da Fé</span>\r\n                                        <svg class="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>\r\n                                    </a>\r\n                                    <button onclick="PreceitosModal.open()" class="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/15 transition flex items-center justify-center gap-2 cursor-pointer text-center">\r\n                                        <span>📜</span> <span>Ver Preceitos &amp; Calendário</span>\r\n                                    </button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <!-- BLOCO: FORMAÇÃO RÁPIDA & LUZ ESPIRITUAL (RESPONSIVO DESKTOP/MOBILE) -->`;

if (!content.includes('Escola da Fé <span class="text-amber-400 font-normal italic')) {
    if (content.includes(homeNeedle)) {
        const replacement = isCrlf ? homeCard : homeCard.replace(/\r\n/g, '\n');
        content = content.replace(homeNeedle, replacement);
        console.log('✓ 4. Card da Escola da Fé adicionado à Home');
    } else {
        console.error('✗ 4. Falha no homeNeedle');
    }
}

// 5. PreceitosModal & Listener OPEN_NOVENA
const preceitosTarget = `        const PreceitosModal = {
            isOpen: false,
            open() {
                const modal = document.getElementById('preceitos-modal');
                const iframe = document.getElementById('preceitos-iframe');
                if (!modal || !iframe) return;
                if (!iframe.src || iframe.src === 'about:blank' || !iframe.src.includes('preceitos')) {
                    iframe.src = '/preceitos.html';
                }
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                requestAnimationFrame(() => {
                    modal.classList.remove('opacity-0', 'pointer-events-none');
                    modal.classList.add('opacity-100');
                });
                document.body.style.overflow = 'hidden';
                this.isOpen = true;
                if (window.MetricsTracker) {
                    MetricsTracker.trackPageView('preceitos-modal');
                }
            },
            close() {
                const modal = document.getElementById('preceitos-modal');
                if (!modal) return;
                modal.classList.remove('opacity-100');
                modal.classList.add('opacity-0', 'pointer-events-none');
                setTimeout(() => {
                    modal.classList.remove('flex');
                    modal.classList.add('hidden');
                    document.body.style.overflow = '';
                }, 220);
                this.isOpen = false;
            }
        };

        window.addEventListener('message', (e) => {
            if (e.data && e.data.type === 'CLOSE_PRECEITOS') {
                PreceitosModal.close();
            }
            if (e.data && e.data.type === 'CLOSE_NOVENAS') {
                NovenasModal.close();
            }`;

const preceitosUpdated = `        const PreceitosModal = {
            isOpen: false,
            open() {
                const modal = document.getElementById('preceitos-modal');
                const iframe = document.getElementById('preceitos-iframe');
                if (!modal || !iframe) return;
                // Garante que o iframe sempre aponte para /preceitos.html limpo
                if (!iframe.src || iframe.src === 'about:blank' || !iframe.src.endsWith('/preceitos.html')) {
                    iframe.src = '/preceitos.html';
                }
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                requestAnimationFrame(() => {
                    modal.classList.remove('opacity-0', 'pointer-events-none');
                    modal.classList.add('opacity-100');
                });
                document.body.style.overflow = 'hidden';
                this.isOpen = true;
                if (window.MetricsTracker) {
                    MetricsTracker.trackPageView('preceitos-modal');
                }
            },
            close() {
                const modal = document.getElementById('preceitos-modal');
                if (!modal) return;
                modal.classList.remove('opacity-100');
                modal.classList.add('opacity-0', 'pointer-events-none');
                setTimeout(() => {
                    modal.classList.remove('flex');
                    modal.classList.add('hidden');
                    document.body.style.overflow = '';
                }, 220);
                this.isOpen = false;
                // Limpa o hash #preceitos da URL se estiver presente
                if (window.location.hash === '#preceitos') {
                    history.replaceState(null, null, window.location.pathname + window.location.search);
                }
            }
        };

        window.addEventListener('message', (e) => {
            if (e.data && e.data.type === 'CLOSE_PRECEITOS') {
                PreceitosModal.close();
            }
            if (e.data && e.data.type === 'CLOSE_NOVENAS') {
                NovenasModal.close();
            }
            if (e.data && e.data.type === 'OPEN_NOVENA') {
                if (typeof PreceitosModal !== 'undefined' && PreceitosModal.isOpen) {
                    PreceitosModal.close();
                }
                setTimeout(() => {
                    if (typeof NovenasModal !== 'undefined') {
                        NovenasModal.open(e.data.novenaId || null, e.data.day || null);
                    }
                }, 250);
            }`;

const preceitosTargetCrlf = preceitosTarget.replace(/\n/g, '\r\n');
const preceitosUpdatedCrlf = preceitosUpdated.replace(/\n/g, '\r\n');

if (content.includes(preceitosTargetCrlf)) {
    content = content.replace(preceitosTargetCrlf, preceitosUpdatedCrlf);
    console.log('✓ 5. PreceitosModal e OPEN_NOVENA atualizados (CRLF)');
} else if (content.includes(preceitosTarget)) {
    content = content.replace(preceitosTarget, preceitosUpdated);
    console.log('✓ 5. PreceitosModal e OPEN_NOVENA atualizados (LF)');
} else {
    console.error('✗ 5. Falha no preceitosTarget');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('index.html atualizado com sucesso!');
