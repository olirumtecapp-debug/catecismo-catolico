import fs from 'fs';
import path from 'path';

console.log('=== INICIANDO VINCULAÇÃO DAS IMAGENS E DADOS AO BANCO DE SANTOS ===');

// ========================================================
// 1. ATUALIZAR data/novenas.json
// ========================================================
const novenasPath = path.resolve('data/novenas.json');
const novenas = JSON.parse(fs.readFileSync(novenasPath, 'utf8'));

const novenaImageMapping = {
    "santa-teresinha": {
        img: "assets/img/santos/ns_santa-teresinha-do-menino-jesus.png",
        slug: "santa-teresinha-do-menino-jesus"
    },
    "padre-pio": {
        img: "assets/img/santos/ns_sao-padre-pio-de-pietrelcina.jpeg",
        slug: "sao-padre-pio-de-pietrelcina"
    },
    "sao-geraldo-magela": {
        img: "assets/img/santos/10-16-sao-geraldo-majella-irmao-leigo-redentorista.png",
        slug: "sao-geraldo-majella"
    },
    "santa-edwiges": {
        img: "assets/img/santos/ns_santa-edwiges.webp",
        slug: "santa-edwiges"
    },
    "santa-luzia": {
        img: "assets/img/santos/ns_santa-luzia.jpg",
        slug: "santa-luzia"
    },
    "nossa-senhora-aparecida": {
        img: "assets/img/santos/ns_nossa-senhora-aparecida.png",
        slug: "nossa-senhora-aparecida"
    },
    "sao-judas-tadeu": {
        img: "assets/img/santos/ns_sao-judas-tadeu.jpg",
        slug: "sao-judas-tadeu"
    },
    "nossa-senhora-desatadora-dos-nos": {
        img: "assets/img/santos/ns_nossa-senhora-desatadora-dos-nos.png",
        slug: "nossa-senhora-desatadora-dos-nos"
    },
    "divina-misericordia": {
        img: "assets/img/santos/ns_santa-faustina-kowalska.png",
        slug: "santa-faustina-kowalska"
    },
    "pentecostes": {
        img: "assets/img/liturgia/cristo_bencao.jpg",
        slug: null
    },
    "sao-bento": {
        img: "assets/img/santos/ns_sao-bento-de-nursia.jpg",
        slug: "sao-bento-de-nursia"
    },
    "santo-antonio": {
        img: "assets/img/santos/ns_santo-antonio-de-padua.jpg",
        slug: "santo-antonio-de-padua"
    },
    "sao-jose": {
        img: "assets/img/santos/ns_sao-jose.jpg",
        slug: "sao-jose"
    },
    "sao-miguel-arcanjo": {
        img: "assets/img/santos/ns_sao-miguel-arcanjo.png",
        slug: "sao-miguel-arcanjo"
    },
    "novena-de-natal": {
        img: "assets/img/liturgia/adoracao_pastores.jpg",
        slug: null
    },
    "santa-rita-de-cassia": {
        img: "assets/img/santos/ns_santa-rita-de-cassia.png",
        slug: "santa-rita-de-cassia"
    },
    "sagrado-coracao-de-jesus": {
        img: "assets/img/liturgia/cristo_bencao.jpg",
        slug: null
    },
    "nossa-senhora-de-fatima": {
        img: "assets/img/santos/ns_nossa-senhora-de-fatima.jpeg",
        slug: "nossa-senhora-de-fatima"
    },
    "sao-peregrino": {
        img: "assets/img/santos/ns_sao-peregrino.jpg",
        slug: "sao-peregrino"
    },
    "medalha-milagrosa": {
        img: "assets/img/santos/01-01-santa-maria-mae-de-deus.png",
        slug: null
    }
};

novenas.forEach(n => {
    const map = novenaImageMapping[n.id];
    if (map) {
        n.imagem = map.img;
        n.santo_slug = map.slug;
    }
});

fs.writeFileSync(novenasPath, JSON.stringify(novenas, null, 2), 'utf8');
console.log('✓ data/novenas.json atualizado com imagens do Banco de Santos e santo_slug!');

// ========================================================
// 2. ATUALIZAR novenas.html
// ========================================================
const novenasHtmlPath = path.resolve('novenas.html');
let novenasHtml = fs.readFileSync(novenasHtmlPath, 'utf8');

// A. Corrigir getNovenaImage para priorizar item.imagem
const oldGetNovenaImage = `function getNovenaImage(item) {
            if (!item) return '';
            if (typeof window.resolveLocalSaintImage === 'function') {
                const resolved = window.resolveLocalSaintImage(item.titulo, item.festa_liturgica?.data);
                if (resolved) return resolved;
            }
            return item.imagem || '';
        }`;

const newGetNovenaImage = `function getNovenaImage(item) {
            if (!item) return '';
            if (item.imagem) return item.imagem;
            if (typeof window.resolveLocalSaintImage === 'function') {
                const resolved = window.resolveLocalSaintImage(item.titulo, item.festa_liturgica?.data);
                if (resolved) return resolved;
            }
            return '';
        }`;

if (novenasHtml.includes(oldGetNovenaImage)) {
    novenasHtml = novenasHtml.replace(oldGetNovenaImage, newGetNovenaImage);
    console.log('✓ novenas.html: getNovenaImage corrigido com sucesso para priorizar item.imagem!');
}

// B. No card de cada novena em renderCards(), adicionar botão para abrir o Santo no Banco de Santos
const oldCardAction = `<button onclick="openNovenaModal('\${novena.id}')" class="w-full py-2.5 rounded-xl bg-mariana hover:bg-mariana-dark dark:bg-dourado dark:text-slate-900 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer">
                                <span>Rezar Novena</span>
                                <span>➔</span>
                            </button>`;

const newCardAction = `<div class="space-y-1.5 w-full">
                                <button onclick="openNovenaModal('\${novena.id}')" class="w-full py-2.5 rounded-xl bg-mariana hover:bg-mariana-dark dark:bg-dourado dark:text-slate-900 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer">
                                    <span>Rezar Novena</span>
                                    <span>➔</span>
                                </button>
                                \${novena.santo_slug ? \`
                                    <button type="button" onclick="event.stopPropagation(); if (window.parent && typeof window.parent.openSaintModal === 'function') { window.parent.openSaintModal('\${novena.santo_slug}'); } else if (typeof window.openSaintModal === 'function') { window.openSaintModal('\${novena.santo_slug}'); }" class="w-full py-1.5 px-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200/80 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer">
                                        <span>👑</span> <span>Conhecer Santo no Banco de Santos</span> <span>➔</span>
                                    </button>
                                \` : ''}
                            </div>`;

if (novenasHtml.includes(oldCardAction)) {
    novenasHtml = novenasHtml.replace(oldCardAction, newCardAction);
    console.log('✓ novenas.html: Link ao Banco de Santos integrado nos cards de novenas!');
}

// C. No modal da Novena, adicionar botão ao Banco de Santos no Header
const oldModalHeaderSub = `<p id="modal-novena-padroeiro" class="text-xs text-slate-500 dark:text-slate-400"></p>`;
const newModalHeaderSub = `<p id="modal-novena-padroeiro" class="text-xs text-slate-500 dark:text-slate-400"></p>
                    <div id="modal-novena-saint-link-container" class="pt-1"></div>`;

if (novenasHtml.includes(oldModalHeaderSub) && !novenasHtml.includes('modal-novena-saint-link-container')) {
    novenasHtml = novenasHtml.replace(oldModalHeaderSub, newModalHeaderSub);
}

const oldOpenModalHook = `document.getElementById('modal-novena-padroeiro').innerText = novena.padroeiro_de ? 'Padroeiro(a) de: ' + novena.padroeiro_de : '';`;
const newOpenModalHook = `document.getElementById('modal-novena-padroeiro').innerText = novena.padroeiro_de ? 'Padroeiro(a) de: ' + novena.padroeiro_de : '';
            const saintLinkBox = document.getElementById('modal-novena-saint-link-container');
            if (saintLinkBox) {
                if (novena.santo_slug) {
                    saintLinkBox.innerHTML = \`<button type="button" onclick="if (window.parent && typeof window.parent.openSaintModal === 'function') { window.parent.openSaintModal('\${novena.santo_slug}'); } else if (typeof window.openSaintModal === 'function') { window.openSaintModal('\${novena.santo_slug}'); }" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300/80 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-bold hover:bg-amber-200 transition cursor-pointer"><span>👑</span> <span>Ver Biografia & Relíquias no Banco de Santos</span> <span>➔</span></button>\`;
                } else {
                    saintLinkBox.innerHTML = '';
                }
            }`;

if (novenasHtml.includes(oldOpenModalHook) && !novenasHtml.includes('modal-novena-saint-link-container')) {
    novenasHtml = novenasHtml.replace(oldOpenModalHook, newOpenModalHook);
    console.log('✓ novenas.html: Botão do Banco de Santos integrado ao topo do Modal da Novena!');
}

fs.writeFileSync(novenasHtmlPath, novenasHtml, 'utf8');

// ========================================================
// 3. ATUALIZAR index.html (Orações & Atalhos da Home & Modal do Santo)
// ========================================================
const indexPath = path.resolve('index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// A. Elevar z-index do #saint-modal para z-[60]
indexHtml = indexHtml.replace('id="saint-modal" class="fixed inset-0 z-50', 'id="saint-modal" class="fixed inset-0 z-[60]');
console.log('✓ index.html: z-index do #saint-modal elevado para z-[60] para sobrepor outros modais!');

// B. Atualizar atalhos rápidos da Home (linhas 6122-6152)
indexHtml = indexHtml.replace(
    'src="assets/img/santos/05-01-sao-jose-operario-esposo-da-santissima-virgem-maria-protetor-dos-trabalhadores.png" alt="São José Operário"',
    'src="assets/img/santos/ns_sao-jose.jpg" alt="São José Operário"'
);
indexHtml = indexHtml.replace(
    'src="assets/img/santos/10-15-santa-teresa-de-jesus-virgem-doutora-da-igreja-carmelita-descalca.png" alt="Santa Teresa"',
    'src="assets/img/santos/ns_santa-teresa-de-avila.jpg" alt="Santa Teresa"'
);
indexHtml = indexHtml.replace(
    'src="assets/img/santos/03-19-santa-jose-esposo-da-santissima-virgem-maria-padroeiro-da-igreja-universal.png" alt="São José"',
    'src="assets/img/santos/ns_sao-jose.jpg" alt="São José"'
);
indexHtml = indexHtml.replace(
    'src="assets/img/santos/10-28-ss-simao-e-judas-tadeu-apostolos.png" alt="São Judas Tadeu"',
    'src="assets/img/santos/ns_sao-judas-tadeu.jpg" alt="São Judas Tadeu"'
);
indexHtml = indexHtml.replace(
    'src="assets/img/santos/09-29-sao-miguel-arcanjo.png" alt="São Miguel Arcanjo"',
    'src="assets/img/santos/ns_sao-miguel-arcanjo.png" alt="São Miguel Arcanjo"'
);
indexHtml = indexHtml.replace(
    'src="assets/img/santos/09-29-san-rafael-arcanjo.png" alt="São Rafael Arcanjo"',
    'src="assets/img/santos/ns_sao-rafael-arcanjo.png" alt="São Rafael Arcanjo"'
);
console.log('✓ index.html: Imagens dos 6 atalhos da Home atualizadas para as do Banco de Santos!');

// C. Tornar openSaintModal universal e global
const oldModalDef = `        // --- MODAL DO SANTO ---
        function openSaintModal(sId) {
            const all = [...(window.SAINTS_DATA?.catalog || []), ...(window.SAINTS_DATA?.mapSaints || [])];
            const s = all.find(x => x.id === sId || x.slug === sId);
            if (!s) return;`;

const newModalDef = `        // --- MODAL DO SANTO (BANCO DE SANTOS UNIFICADO) ---
        function openSaintModal(sId) {
            if (!sId) return;
            const all = [...(window.SAINTS_DATA?.catalog || []), ...(window.SAINTS_DATA?.mapSaints || [])];
            let s = all.find(x => x.id === sId || x.slug === sId || (x.name && x.name.toLowerCase() === String(sId).toLowerCase()));
            if (!s && typeof SaintContentProvider !== 'undefined' && SaintContentProvider.saints) {
                const legacy = SaintContentProvider.saints.find(x => x.id === sId);
                if (legacy) {
                    s = {
                        id: legacy.id,
                        slug: legacy.id,
                        name: legacy.name,
                        image: 'assets/img/santos/ns_' + legacy.id.replace(/^s_/, 'sao-').replace(/_/g, '-') + '.jpg',
                        seculo: legacy.feast || '',
                        pais: legacy.country || '',
                        virtudes: Array.isArray(legacy.virtues) ? legacy.virtues.join(', ') : '',
                        causas: [legacy.patronage || ''],
                        bio: legacy.biography,
                        richBio: \`<p class="leading-relaxed">\${legacy.biography}</p>\`,
                        oracao: legacy.prayer
                    };
                }
            }
            if (!s) {
                console.warn('[openSaintModal] Santo não encontrado no catálogo:', sId);
                return;
            }`;

if (indexHtml.includes(oldModalDef)) {
    indexHtml = indexHtml.replace(oldModalDef, newModalDef);
    indexHtml = indexHtml.replace('function closeSaintModal() {', 'window.openSaintModal = openSaintModal;\n\n        function closeSaintModal() {');
    console.log('✓ index.html: openSaintModal expandido e registrado globalmente no window!');
}

// D. Atualizar card de intenção em index.html com link para o Banco de Santos
const oldIntentionCardSaintBox = `<div class="flex items-center gap-3.5 bg-gradient-to-r from-amber-50/70 to-amber-100/40 dark:from-slate-900/60 dark:to-amber-950/20 p-3.5 rounded-2xl border border-amber-200/70 dark:border-amber-900/40">
                                                <img src="\${item.santo_imagem}" alt="\${item.santo_nome}" class="w-14 h-14 rounded-xl object-cover border border-amber-300 shadow-2xs shrink-0" onerror="handleSaintImageError(this, '\${item.santo_nome}')">
                                                <div class="min-w-0">
                                                    <h5 class="font-serif text-sm font-bold text-mariana dark:text-amber-200 truncate">\${item.santo_nome}</h5>
                                                    <p class="text-[11px] text-amber-900/90 dark:text-amber-300/90 font-medium line-clamp-1">\${item.santo_titulo}</p>
                                                    <p class="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">\${item.por_que_padroeiro}</p>
                                                </div>
                                            </div>`;

const newIntentionCardSaintBox = `<div class="flex items-center gap-3.5 bg-gradient-to-r from-amber-50/70 to-amber-100/40 dark:from-slate-900/60 dark:to-amber-950/20 p-3.5 rounded-2xl border border-amber-200/70 dark:border-amber-900/40">
                                                <img src="\${item.santo_imagem}" alt="\${item.santo_nome}" class="w-14 h-14 rounded-xl object-cover border border-amber-300 shadow-2xs shrink-0 cursor-pointer hover:opacity-90 transition" onclick="\${item.santo_slug ? \`openSaintModal('\${item.santo_slug}')\` : ''}" onerror="handleSaintImageError(this, '\${item.santo_nome}')">
                                                <div class="min-w-0 flex-1">
                                                    <div class="flex items-center justify-between gap-1">
                                                        <h5 class="font-serif text-sm font-bold text-mariana dark:text-amber-200 truncate cursor-pointer hover:underline" onclick="\${item.santo_slug ? \`openSaintModal('\${item.santo_slug}')\` : ''}">\${item.santo_nome}</h5>
                                                        \${item.santo_slug ? \`
                                                            <button type="button" onclick="openSaintModal('\${item.santo_slug}')" class="px-2 py-0.5 rounded-md bg-amber-200/80 dark:bg-amber-900/80 hover:bg-amber-300 text-amber-950 dark:text-amber-100 text-[9px] font-black uppercase tracking-wider transition shrink-0 cursor-pointer" title="Ver história e relíquias">
                                                                👑 Biografia
                                                            </button>
                                                        \` : ''}
                                                    </div>
                                                    <p class="text-[11px] text-amber-900/90 dark:text-amber-300/90 font-medium line-clamp-1">\${item.santo_titulo}</p>
                                                    <p class="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">\${item.por_que_padroeiro}</p>
                                                </div>
                                            </div>`;

if (indexHtml.includes(oldIntentionCardSaintBox)) {
    indexHtml = indexHtml.replace(oldIntentionCardSaintBox, newIntentionCardSaintBox);
    console.log('✓ index.html: Cards de Intenção agora possuem botão para abrir o Santo no Banco de Santos!');
}

// E. No Modal da Intenção de Oração, também adicionar botão e clique
const oldModalSaintBox = `<div class="bg-gradient-to-br from-amber-50/80 to-amber-100/50 dark:from-slate-800/80 dark:to-amber-950/20 rounded-2xl p-4 sm:p-5 border border-amber-300/70 dark:border-amber-700/60 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        <img src="\${item.santo_imagem}" alt="\${item.santo_nome}" class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-300 shadow-md shrink-0" onerror="handleSaintImageError(this, '\${item.santo_nome}')">
                        <div class="space-y-1.5 text-center sm:text-left">
                            <span class="text-[10px] font-black uppercase tracking-wider text-amber-900 dark:text-amber-300 bg-amber-200/70 dark:bg-amber-950/80 px-2 py-0.5 rounded-md inline-block">
                                Santo Padroeiro & Intercessor
                            </span>
                            <h4 class="font-serif text-lg sm:text-xl font-bold text-mariana dark:text-amber-200">\${item.santo_nome}</h4>
                            <p class="text-xs font-semibold text-slate-700 dark:text-slate-300">\${item.santo_titulo}</p>
                            <p class="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed pt-1">
                                "\${item.por_que_padroeiro}"
                            </p>
                        </div>
                    </div>`;

const newModalSaintBox = `<div class="bg-gradient-to-br from-amber-50/80 to-amber-100/50 dark:from-slate-800/80 dark:to-amber-950/20 rounded-2xl p-4 sm:p-5 border border-amber-300/70 dark:border-amber-700/60 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        <img src="\${item.santo_imagem}" alt="\${item.santo_nome}" class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-300 shadow-md shrink-0 cursor-pointer hover:opacity-90 transition" onclick="\${item.santo_slug ? \`openSaintModal('\${item.santo_slug}')\` : ''}" onerror="handleSaintImageError(this, '\${item.santo_nome}')">
                        <div class="space-y-1.5 text-center sm:text-left flex-1">
                            <div class="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                                <span class="text-[10px] font-black uppercase tracking-wider text-amber-900 dark:text-amber-300 bg-amber-200/70 dark:bg-amber-950/80 px-2 py-0.5 rounded-md inline-block">
                                    Santo Padroeiro & Intercessor
                                </span>
                                \${item.santo_slug ? \`
                                    <button type="button" onclick="openSaintModal('\${item.santo_slug}')" class="px-2.5 py-1 rounded-xl bg-mariana hover:bg-mariana-dark text-white text-[10px] font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer">
                                        <span>👑</span> <span>Conhecer Santo no Banco</span> <span>➔</span>
                                    </button>
                                \` : ''}
                            </div>
                            <h4 class="font-serif text-lg sm:text-xl font-bold text-mariana dark:text-amber-200 cursor-pointer hover:underline" onclick="\${item.santo_slug ? \`openSaintModal('\${item.santo_slug}')\` : ''}">\${item.santo_nome}</h4>
                            <p class="text-xs font-semibold text-slate-700 dark:text-slate-300">\${item.santo_titulo}</p>
                            <p class="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed pt-1">
                                "\${item.por_que_padroeiro}"
                            </p>
                        </div>
                    </div>`;

if (indexHtml.includes(oldModalSaintBox)) {
    indexHtml = indexHtml.replace(oldModalSaintBox, newModalSaintBox);
    console.log('✓ index.html: Modal de Intenção agora possui botão para abrir o Santo no Banco de Santos!');
}

// F. Atualizar array de intenções em index.html
const intentionMapping = {
    "intencao-familia-sao-jose": { slug: "sao-jose", img: "assets/img/santos/ns_sao-jose.jpg" },
    "intencao-familia-santo-antonio": { slug: "santo-antonio-de-padua", img: "assets/img/santos/ns_santo-antonio-de-padua.jpg" },
    "intencao-trabalho-sao-jose-operario": { slug: "sao-jose", img: "assets/img/santos/ns_sao-jose.jpg" },
    "intencao-trabalho-santa-edwiges": { slug: "santa-edwiges", img: "assets/img/santos/ns_santa-edwiges.webp" },
    "intencao-causas-dificeis-sao-judas": { slug: "sao-judas-tadeu", img: "assets/img/santos/ns_sao-judas-tadeu.jpg" },
    "intencao-causas-dificeis-santa-rita": { slug: "santa-rita-de-cassia", img: "assets/img/santos/ns_santa-rita-de-cassia.png" },
    "intencao-protecao-sao-miguel": { slug: "sao-miguel-arcanjo", img: "assets/img/santos/ns_sao-miguel-arcanjo.png" },
    "intencao-protecao-sao-bento": { slug: "sao-bento-de-nursia", img: "assets/img/santos/ns_sao-bento-de-nursia.jpg" },
    "intencao-saude-sao-rafael": { slug: "sao-rafael-arcanjo", img: "assets/img/santos/ns_sao-rafael-arcanjo.png" },
    "intencao-saude-sao-camilo": { slug: "sao-camilo-de-lellis", img: "assets/img/santos/ns_sao-camilo-de-lellis.jpg" },
    "intencao-saude-sao-bras": { slug: "sao-bras", img: "assets/img/santos/ns_sao-bras.jpg" },
    "intencao-paz-santa-teresa": { slug: "santa-teresa-de-avila", img: "assets/img/santos/ns_santa-teresa-de-avila.jpg" },
    "intencao-paz-sao-francisco": { slug: "sao-francisco-de-assis", img: "assets/img/santos/ns_sao-francisco-de-assis.jpg" },
    "intencao-conversao-santa-monica": { slug: "santa-monica", img: "assets/img/santos/ns_santa-monica.jpg" },
    "intencao-conversao-santo-agostinho": { slug: "santo-agostinho-de-hipona", img: "assets/img/santos/ns_santo-agostinho-de-hipona.jpg" },
    "intencao-relacionamentos-santo-antonio": { slug: "santo-antonio-de-padua", img: "assets/img/santos/ns_santo-antonio-de-padua.jpg" },
    "intencao-relacionamentos-sao-rafael": { slug: "sao-rafael-arcanjo", img: "assets/img/santos/ns_sao-rafael-arcanjo.png" },
    "intencao-urgentes-santo-expedito": { slug: "sao-expedito", img: "assets/img/santos/ns_sao-expedito.jpg" },
    "intencao-urgentes-desatadora": { slug: "nossa-senhora-desatadora-dos-nos", img: "assets/img/santos/ns_nossa-senhora-desatadora-dos-nos.png" },
    "intencao-agradecimento-sagrado-coracao": { slug: null, img: "assets/img/liturgia/cristo_bencao.jpg" },
    "intencao-agradecimento-padre-pio": { slug: "sao-padre-pio-de-pietrelcina", img: "assets/img/santos/ns_sao-padre-pio-de-pietrelcina.jpeg" },
    "intencao-exame-santo-inacio": { slug: "santo-inacio-de-loyola", img: "assets/img/santos/ns_santo-inacio-de-loyola.jpg" },
    "intencao-exame-cura-d-ars": { slug: null, img: "assets/img/santos/08-04-sao-joao-maria-vianney-cura-de-ars-padroeiro-.jpg" }
};

const intentionsAnchor = 'PrayerContentProvider.intentions = [';
const startInt = indexHtml.indexOf(intentionsAnchor);
const endInt = indexHtml.indexOf('];\n\n        /* ========================================================', startInt);

if (startInt !== -1 && endInt !== -1) {
    const rawArr = indexHtml.substring(startInt + intentionsAnchor.length - 1, endInt + 1);
    const parsed = eval(rawArr);
    parsed.forEach(it => {
        const m = intentionMapping[it.id];
        if (m) {
            it.santo_imagem = m.img;
            it.santo_slug = m.slug;
        }
    });
    const updatedRaw = JSON.stringify(parsed, null, 4);
    indexHtml = indexHtml.substring(0, startInt + intentionsAnchor.length - 1) + updatedRaw + indexHtml.substring(endInt + 1);
    console.log('✓ index.html: Array PrayerContentProvider.intentions atualizado com imagens do Banco e santo_slug!');
}

fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log('✓ index.html salvo com sucesso!');
console.log('=== VINCULAÇÃO CONCLUÍDA COM SUCESSO! ===');
