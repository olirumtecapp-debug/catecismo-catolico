const fs = require('fs');

let html = fs.readFileSync('D:/Catecismo/index.html', 'utf8');
const prayers = JSON.parse(fs.readFileSync('D:/Catecismo/data/canonical_prayers.json', 'utf8'));

console.log('Original index.html size:', html.length);

function replaceOnce(findStr, replaceStr, label) {
    if (html.includes(findStr)) {
        html = html.replace(findStr, replaceStr);
        console.log(`[OK] ${label}`);
        return true;
    }
    const findNorm = findStr.replace(/\r\n/g, '\n');
    const htmlNorm = html.replace(/\r\n/g, '\n');
    const idx = htmlNorm.indexOf(findNorm);
    if (idx !== -1) {
        let origIdx = 0, normCount = 0;
        while (normCount < idx && origIdx < html.length) {
            if (html[origIdx] === '\r' && html[origIdx + 1] === '\n') {
                origIdx += 2; normCount += 1;
            } else {
                origIdx += 1; normCount += 1;
            }
        }
        let origEnd = origIdx, targetNormCount = 0;
        while (targetNormCount < findNorm.length && origEnd < html.length) {
            if (html[origEnd] === '\r' && html[origEnd + 1] === '\n') {
                origEnd += 2; targetNormCount += 1;
            } else {
                origEnd += 1; targetNormCount += 1;
            }
        }
        html = html.substring(0, origIdx) + replaceStr + html.substring(origEnd);
        console.log(`[OK - norm] ${label}`);
        return true;
    }
    console.error(`[FAIL] ${label}`);
    return false;
}

// 1. INJECT CANONICAL PRAYERS (74 items)
const pStart = html.indexOf('const PrayerContentProvider = {');
const pEnd = html.indexOf('categories:', pStart);
if (pStart === -1 || pEnd === -1) throw new Error('PrayerContentProvider bounds not found');
const prayersJs = 'const PrayerContentProvider = {\r\n            prayers: ' + JSON.stringify(prayers, null, 16) + ',\r\n\r\n            ';
html = html.substring(0, pStart) + prayersJs + html.substring(pEnd);
console.log('[OK] 1. Injected 74 canonical prayers into PrayerContentProvider.');

// 2. DEFINE getPillarIconSvg HELPER
const intentionHelperIdx = html.indexOf('function getIntentionIconSvg(');
if (intentionHelperIdx !== -1 && !html.includes('function getPillarIconSvg(')) {
    const pillarHelperCode = `
        function getPillarIconSvg(pillarId, extraClass = 'w-3.5 h-3.5') {
            switch (pillarId) {
                case 'creio':
                    return \`<svg class="\${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM12 8v8m-3-5h6"/></svg>\`;
                case 'celebro':
                    return \`<svg class="\${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15a6 6 0 006-6H6a6 6 0 006 6zm0 0v6m-4 0h8M9 4a3 3 0 116 0"/></svg>\`;
                case 'vivo':
                    return \`<svg class="\${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 22V12m0 0C12 7 7 3 2 4c0 6 5 8 10 8zm0 0c0-5 5-9 10-8 0 6-5 8-10 8z"/></svg>\`;
                case 'rezo':
                    return \`<svg class="\${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3c-1.5 2-3 4-3 7 0 2.5 1.5 4 3 6 1.5-2 3-3.5 3-6 0-3-1.5-5-3-7zm-7 9c3 0 5.5-1.5 7-3-1.5 4-4.5 7-7 7v-4zm14 0c-3 0-5.5-1.5-7-3 1.5 4 4.5 7 7 7v-4z"/></svg>\`;
                default:
                    return \`<svg class="\${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>\`;
            }
        }
`;
    html = html.substring(0, intentionHelperIdx) + pillarHelperCode + '\r\n' + html.substring(intentionHelperIdx);
    console.log('[OK] 2. Injected getPillarIconSvg helper.');
}

// 3. Quatro Pilares: 🔤 Fonte:
replaceOnce(
    `<span>🔤</span> Fonte:`,
    `<svg class="w-3.5 h-3.5 text-cgold dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8V5h12v3M9 5v14M16 13h5v2M18.5 13v6"/></svg> Fonte:`,
    '3. Replaced 🔤 Fonte: with typography SVG'
);

// 4. Quatro Pilares: Filter chips loop & module card icon
replaceOnce(
    `\${CatecismContentProvider.categories.map(c => {
                                    const pillarIcons = { 'creio': '🛡️', 'celebro': '🍷', 'vivo': '🌿', 'rezo': '🕊️' };
                                    const icon = pillarIcons[c.id] || '📖';
                                    return \`
                                        <button onclick="router.navigate('catecismo', '\${c.id}')" class="px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 \${filterCat === c.id ? 'bg-cgreen text-white shadow-xs' : 'bg-[#f3f2ed] hover:bg-[#e8e5dc] text-slate-700 dark:bg-slate-700 dark:text-slate-200'}">
                                            <span>\${icon}</span>
                                            <span>\${c.title.split('—')[0].trim()}</span>
                                        </button>
                                    \`;
                                }).join('')}`,
    `\${CatecismContentProvider.categories.map(c => {
                                    return \`
                                        <button onclick="router.navigate('catecismo', '\${c.id}')" class="px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 \${filterCat === c.id ? 'bg-cgreen text-white shadow-xs' : 'bg-[#f3f2ed] hover:bg-[#e8e5dc] text-slate-700 dark:bg-slate-700 dark:text-slate-200'}">
                                            <span>\${getPillarIconSvg(c.id, 'w-3.5 h-3.5')}</span>
                                            <span>\${c.title.split('—')[0].trim()}</span>
                                        </button>
                                    \`;
                                }).join('')}`,
    '4a. Replaced Quatro Pilares filter chips with getPillarIconSvg'
);

replaceOnce(
    `<span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">\${icon} \${pillarNames[mod.categoryId] || ''}</span>`,
    `<span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">\${getPillarIconSvg(mod.categoryId, 'w-3.5 h-3.5 text-cgold dark:text-amber-400')} <span>\${pillarNames[mod.categoryId] || ''}</span></span>`,
    '4b. Replaced pillar module card icon with getPillarIconSvg'
);

// 5. Aprender cards: Planos de Estudo, Quizzes, Biblioteca
replaceOnce(
    `<span class="text-2xl p-2 bg-[#fbf9f4] dark:bg-slate-800 rounded-xl border border-cline dark:border-slate-700 shadow-2xs">📅</span>`,
    `<span class="w-10 h-10 p-2 bg-[#fbf9f4] dark:bg-slate-800 rounded-xl border border-cline dark:border-slate-700 shadow-2xs flex items-center justify-center text-cgreen dark:text-csage">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                                </span>`,
    '5a. Replaced Planos de Estudo card icon with SVG'
);

replaceOnce(
    `<span class="text-2xl p-2 bg-[#fbf9f4] dark:bg-slate-800 rounded-xl border border-cline dark:border-slate-700 shadow-2xs">🧠</span>`,
    `<span class="w-10 h-10 p-2 bg-[#fbf9f4] dark:bg-slate-800 rounded-xl border border-cline dark:border-slate-700 shadow-2xs flex items-center justify-center text-cgold dark:text-amber-400">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                                </span>`,
    '5b. Replaced Quizzes card icon with SVG'
);

replaceOnce(
    `<span class="text-2xl p-2 bg-[#fbf9f4] dark:bg-slate-800 rounded-xl border border-cline dark:border-slate-700 shadow-2xs">📚</span>`,
    `<span class="w-10 h-10 p-2 bg-[#fbf9f4] dark:bg-slate-800 rounded-xl border border-cline dark:border-slate-700 shadow-2xs flex items-center justify-center text-cgreen dark:text-csage">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                                </span>`,
    '5c. Replaced Biblioteca card icon with SVG'
);

// 6. Santos navigation tabs & banner
replaceOnce(
    `<button id="saints-tab-today" onclick="setSaintsViewMode('today')" class="px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all bg-cgreen text-white shadow-xs flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer">
                                    <span>📅</span> <span>Santo do Dia</span>
                                </button>
                                <button id="saints-tab-catalog" onclick="setSaintsViewMode('catalog')" class="px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all text-slate-600 dark:text-slate-300 hover:text-cgreen hover:bg-[#f3f2ed] dark:hover:bg-slate-800 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer">
                                    <span>👑</span> <span>140 Grandes Padroeiros</span>
                                </button>
                                <button id="saints-tab-map" onclick="setSaintsViewMode('map')" class="px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all text-slate-600 dark:text-slate-300 hover:text-cgreen hover:bg-[#f3f2ed] dark:hover:bg-slate-800 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer">
                                    <span>🗺️</span> <span>Mapa da Santidade</span>
                                </button>`,
    `<button id="saints-tab-today" onclick="setSaintsViewMode('today')" class="px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all bg-cgreen text-white shadow-xs flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer">
                                    <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    <span>Santo do Dia</span>
                                </button>
                                <button id="saints-tab-catalog" onclick="setSaintsViewMode('catalog')" class="px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all text-slate-600 dark:text-slate-300 hover:text-cgreen hover:bg-[#f3f2ed] dark:hover:bg-slate-800 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer">
                                    <svg class="w-4 h-4 shrink-0 text-cgold dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 18h18M4 14l3-7 5 5 5-5 3 7H4z"/></svg>
                                    <span>140 Grandes Padroeiros</span>
                                </button>
                                <button id="saints-tab-map" onclick="setSaintsViewMode('map')" class="px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all text-slate-600 dark:text-slate-300 hover:text-cgreen hover:bg-[#f3f2ed] dark:hover:bg-slate-800 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer">
                                    <svg class="w-4 h-4 shrink-0 text-cgreen dark:text-csage" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                                    <span>Mapa da Santidade</span>
                                </button>`,
    '6a. Replaced Santos tabs emojis with crisp SVGs'
);

replaceOnce(
    `<span class="text-3xl sm:text-4xl shrink-0 select-none">🗺️</span>`,
    `<span class="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-[#e4cb92] flex items-center justify-center shrink-0 shadow-md">
                                    <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                                </span>`,
    '6b. Replaced Mapa da Santidade banner emoji with SVG'
);

// 7. INJECT CANONICAL PRAYER LIBRARY CARD AT EXACT ID secao-biblioteca-oracoes
const sLibIdx = html.indexOf('id="secao-biblioteca-oracoes"');
if (sLibIdx === -1) throw new Error('secao-biblioteca-oracoes not found in html');

const cardStart = html.lastIndexOf('<div', sLibIdx);
const renderMissaIdx = html.indexOf('renderMissa()', sLibIdx);
const lastClosingDiv = html.lastIndexOf('</div>', renderMissaIdx);
const secondLast = html.lastIndexOf('</div>', lastClosingDiv - 1);
const cardEnd = secondLast + 6;

const newLibraryCardHtml = `<div id="secao-biblioteca-oracoes" class="bg-[#fffefa] dark:bg-slate-800 rounded-[22px] p-6 sm:p-8 border border-cline dark:border-slate-700 shadow-2xs space-y-5">
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cline dark:border-slate-700 pb-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-xl bg-cgreen/10 dark:bg-slate-700 text-cgreen dark:text-csage flex items-center justify-center shrink-0">
                                        <svg class="w-5 h-5 text-cgold dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                                    </div>
                                    <div>
                                        <h3 class="font-serif text-2xl font-semibold text-cgreen dark:text-white">Biblioteca Canônica de Orações</h3>
                                        <p class="text-xs text-cmuted dark:text-slate-400">Devocionário tradicional e orações oficiais da Santa Igreja Católica</p>
                                    </div>
                                </div>
                                <div class="relative w-full sm:w-64">
                                    <input type="text" id="prayer-search-input" oninput="filterPrayersBySearch(this.value)" placeholder="Buscar por título ou intenção..." class="w-full pl-8 pr-3 py-1.5 bg-[#f3f2ed] dark:bg-slate-700 border border-cline dark:border-slate-600 rounded-full text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-cgreen">
                                    <span class="absolute left-2.5 top-2 text-slate-400 pointer-events-none flex items-center justify-center">
                                        <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                    </span>
                                </div>
                            </div>

                            <div class="flex flex-wrap gap-2" id="prayer-filters">
                                <button onclick="filterPrayers(null, this)" class="prayer-filter px-4 py-2 rounded-full text-xs font-bold bg-cgreen text-white shadow-xs transition cursor-pointer flex items-center gap-1.5">
                                    <span>Todas (\${PrayerContentProvider.prayers.length})</span>
                                </button>
                                \${PrayerContentProvider.categories.map(c => {
                                    const count = PrayerContentProvider.prayers.filter(p => p.category === c).length;
                                    return \`
                                        <button onclick="filterPrayers('\${c}', this)" data-cat="\${c}" class="prayer-filter px-4 py-2 rounded-full text-xs font-semibold bg-[#f3f2ed] dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-[#e8e5dc] dark:hover:bg-slate-600 transition cursor-pointer flex items-center gap-1.5">
                                            <span>\${c}</span>
                                            <span class="text-[10px] opacity-75 font-mono">(\${count})</span>
                                        </button>
                                    \`;
                                }).join('')}
                            </div>

                            <div id="prayer-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                \${PrayerContentProvider.prayers.map(p => \`
                                    <button onclick="openPrayerModal('\${p.id}')" data-category="\${p.category}" data-title="\${p.title.toLowerCase()}" class="prayer-item group p-4 bg-[#fbf9f4] dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-cline dark:border-slate-700/80 hover:border-cgold/60 rounded-2xl text-left transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs flex flex-col justify-between">
                                        <div>
                                            <div class="flex items-center justify-between gap-2 mb-1">
                                                <span class="text-[10px] font-bold text-cgold dark:text-amber-400 uppercase tracking-wider">\${p.category}</span>
                                                <span class="text-xs text-slate-400 group-hover:text-cgreen dark:group-hover:text-csage transition">→</span>
                                            </div>
                                            <span class="text-sm font-semibold font-serif text-cgreen dark:text-white block group-hover:text-cgreen-light">\${p.title}</span>
                                            \${p.latinTitle ? \`<span class="text-[11px] text-slate-400 dark:text-slate-500 font-serif italic block mb-1">\${p.latinTitle}</span>\` : ''}
                                            <p class="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 leading-relaxed">\${p.text.split('\\n')[0]}</p>
                                        </div>
                                        <span class="text-[10px] font-bold text-cgold dark:text-amber-400 mt-2 block">Ler e Rezar</span>
                                    </button>
                                \`).join('')}
                            </div>
                        </div>`;

html = html.substring(0, cardStart) + newLibraryCardHtml + html.substring(cardEnd);
console.log('[OK] 7. Injected Canonical Prayer Library Card at exact location.');

// 8. UPDATE filterPrayers & add filterPrayersBySearch
replaceOnce(
    `function filterPrayers(category, btn) {
            document.querySelectorAll('.prayer-filter').forEach(b => {
                b.classList.remove('bg-mariana', 'text-white');
                b.classList.add('bg-slate-100', 'text-slate-700');
            });
            btn.classList.remove('bg-slate-100', 'text-slate-700');
            btn.classList.add('bg-mariana', 'text-white');
            document.querySelectorAll('.prayer-item').forEach(item => {
                item.style.display = (!category || item.dataset.category === category) ? '' : 'none';
            });
        }`,
    `function filterPrayers(category, btn) {
            document.querySelectorAll('.prayer-filter').forEach(b => {
                b.className = "prayer-filter px-4 py-2 rounded-full text-xs font-semibold bg-[#f3f2ed] dark:bg-slate-700 hover:bg-[#e8e5dc] dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition cursor-pointer flex items-center gap-1.5";
            });
            if (btn) {
                btn.className = "prayer-filter px-4 py-2 rounded-full text-xs font-bold bg-cgreen text-white shadow-xs transition cursor-pointer flex items-center gap-1.5";
            }
            const searchInput = document.getElementById('prayer-search-input');
            const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
            document.querySelectorAll('.prayer-item').forEach(item => {
                const matchCategory = (!category || item.dataset.category === category);
                const title = (item.dataset.title || '').toLowerCase();
                const text = item.innerText.toLowerCase();
                const matchSearch = !q || title.includes(q) || text.includes(q);
                item.style.display = (matchCategory && matchSearch) ? '' : 'none';
            });
        }

        function filterPrayersBySearch(query) {
            const q = (query || '').toLowerCase().trim();
            const activeFilterBtn = document.querySelector('.prayer-filter.bg-cgreen');
            const activeCategory = activeFilterBtn && activeFilterBtn.dataset.cat ? activeFilterBtn.dataset.cat : null;
            document.querySelectorAll('.prayer-item').forEach(item => {
                const title = (item.dataset.title || '').toLowerCase();
                const cat = (item.dataset.category || '').toLowerCase();
                const text = item.innerText.toLowerCase();
                const matchSearch = !q || title.includes(q) || cat.includes(q) || text.includes(q);
                const matchCategory = !activeCategory || item.dataset.category === activeCategory;
                item.style.display = (matchSearch && matchCategory) ? '' : 'none';
            });
        }`,
    '8. Fixed filterPrayers contrast bug & added filterPrayersBySearch'
);

// 9. UPDATE openPrayerModal
replaceOnce(
    `function openPrayerModal(id) {
            const p = PrayerContentProvider.prayers.find(x => x.id === id);
            if (!p) return;
            const isFav = AppState.favorites.includes('prayer_' + id);
            const modal = document.getElementById('modal-container');
            modal.innerHTML = \`
                <div class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl border border-slate-200 dark:border-slate-800 relative">
                    <div class="absolute top-6 right-6 flex items-center gap-2">
                        <button onclick="toggleFavorite('prayer_\${p.id}')" class="p-2 rounded-xl text-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Favoritar">\${isFav ? '⭐' : '☆'}</button>
                        <button onclick="closeModal()" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xl hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">✕</button>
                    </div>
                    <div class="pr-16">
                        <span class="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 rounded-lg text-[10px] font-bold tracking-wider uppercase">\${p.category}</span>
                        <h3 class="font-serif text-2xl md:text-3xl font-bold text-mariana dark:text-amber-200 mt-3 leading-tight">\${p.title}</h3>
                    </div>
                    <div class="bg-slate-50 dark:bg-slate-800/70 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <p class="font-serif text-base text-slate-800 dark:text-slate-100 leading-loose whitespace-pre-line select-text">\${p.text}</p>
                    </div>
                    <button onclick="closeModal(); markPrayerDone();" class="w-full py-3.5 mariana-gradient text-white rounded-xl text-xs font-bold shadow-md transition hover:scale-105 cursor-pointer">🙏 Rezei esta oração (+10 XP)</button>
                </div>
            \`;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }`,
    `function openPrayerModal(id) {
            const p = PrayerContentProvider.prayers.find(x => x.id === id);
            if (!p) return;
            const isFav = AppState.favorites.includes('prayer_' + id);
            const modal = document.getElementById('modal-container');
            modal.innerHTML = \`
                <div class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl border border-slate-200 dark:border-slate-800 relative">
                    <div class="absolute top-6 right-6 flex items-center gap-2">
                        <button onclick="toggleFavorite('prayer_\${p.id}')" class="p-2 rounded-xl text-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center cursor-pointer" title="Favoritar">
                            \${isFav ? '<svg class="w-5 h-5 text-amber-500 fill-amber-500" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>' : '<svg class="w-5 h-5 text-slate-400 hover:text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>'}
                        </button>
                        <button onclick="closeModal()" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <div class="pr-16 space-y-1">
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
        }`,
    '9. Updated openPrayerModal with SVG icons'
);

// 10. UPDATE openIntentionPrayerModal (vector image & SVG icons)
const intentionStart = html.indexOf('function openIntentionPrayerModal(id) {');
const intentionEnd = html.indexOf('window.openIntentionPrayerModal = openIntentionPrayerModal;', intentionStart);
if (intentionStart === -1 || intentionEnd === -1) throw new Error('openIntentionPrayerModal bounds not found');

const newIntentionModalFunc = `function openIntentionPrayerModal(id) {
            const item = (PrayerContentProvider.intentions || []).find(x => x.id === id);
            if (!item) return;
            const isFav = (AppState.favorites || []).includes('intention_' + id);
            const modal = document.getElementById('modal-container');
            if (!modal) return;

            modal.innerHTML = \`
                <div class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl border border-slate-200 dark:border-slate-800 relative">
                    <div class="absolute top-6 right-6 flex items-center gap-2">
                        <button onclick="toggleFavorite('intention_\${item.id}')" class="p-2 rounded-xl text-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center cursor-pointer" title="Favoritar">
                            \${isFav ? '<svg class="w-5 h-5 text-amber-500 fill-amber-500" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>' : '<svg class="w-5 h-5 text-slate-400 hover:text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>'}
                        </button>
                        <button onclick="closeModal()" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>

                    <!-- Header da Intenção com Tipo e Subtipo em destaque -->
                    <div class="pr-20 space-y-1.5">
                        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 shadow-2xs">
                            <span>\${getIntentionIconSvg(item.categoria_slug)}</span>
                            <span>\${item.tipo}</span>
                        </div>
                        <p class="text-xs text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1.5">
                            <svg class="w-3.5 h-3.5 text-cgold dark:text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z"/></svg>
                            <span>\${item.subtipo}</span>
                        </p>
                        <h3 class="font-serif text-2xl md:text-3xl font-bold text-mariana dark:text-amber-200 mt-1 leading-tight">\${item.titulo_oracao}</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Fonte canônica: \${item.autor_fonte}</p>
                    </div>

                    <!-- Card do Santo Padroeiro Intercessor (imagem vetorial padronizada) -->
                    <div class="bg-gradient-to-br from-amber-50/80 to-amber-100/50 dark:from-slate-800/80 dark:to-amber-950/20 rounded-2xl p-4 sm:p-5 border border-amber-300/70 dark:border-amber-700/60 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        <img src="\${item.vector_imagem ? \`./assets/img/temas/\${item.vector_imagem}\` : item.santo_imagem}" 
                             alt="\${item.santo_nome}" 
                             class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-400 dark:border-amber-500 shadow-md shrink-0" 
                             onerror="this.onerror=null; this.src='\${item.santo_imagem}';">
                        <div class="space-y-1.5 text-center sm:text-left min-w-0 flex-1">
                            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                                <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cgreen text-white dark:bg-amber-400 dark:text-mariana-dark">Santo Padroeiro</span>
                                <h4 class="font-serif text-lg sm:text-xl font-bold text-mariana dark:text-amber-300">\${item.santo_nome}</h4>
                            </div>
                            <p class="text-xs text-slate-600 dark:text-slate-300 font-medium">\${item.santo_titulo}</p>
                            <div class="bg-white/80 dark:bg-slate-900/60 p-3 rounded-xl border border-amber-200/60 dark:border-slate-700 mt-2">
                                <span class="text-[10px] font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider block mb-0.5">Por que é o Padroeiro desta causa?</span>
                                <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">"\${item.por_que_padroeiro}"</p>
                            </div>
                        </div>
                    </div>

                    <!-- Texto Oficial da Oração -->
                    <div class="space-y-2">
                        <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <svg class="w-4 h-4 text-cgold dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            <span>Texto Litúrgico / Canônico</span>
                        </span>
                        <div class="bg-slate-50 dark:bg-slate-800/70 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <p class="font-serif text-base sm:text-lg text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line select-text">\${item.texto_oracao}</p>
                        </div>
                    </div>

                    <!-- Jaculatória em Destaque -->
                    <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-center space-y-1">
                        <span class="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block">Invocação / Jaculatória</span>
                        <p class="font-serif text-base font-bold text-amber-900 dark:text-amber-200 italic">"\${item.jaculatoria}"</p>
                    </div>

                    <!-- Ações -->
                    <div class="flex flex-col sm:flex-row gap-3 pt-2">
                        <button onclick="concludeIntentionPrayer('\${item.id}', '\${item.santo_nome.replace(/'/g, "\\\\'")}')" class="flex-1 py-3.5 px-4 gold-gradient text-mariana-dark rounded-xl text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer">
                            <svg class="w-4 h-4 text-mariana-dark shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3c-1.5 2-3 4-3 7 0 2.5 1.5 4 3 6 1.5-2 3-3.5 3-6 0-3-1.5-5-3-7zm-7 9c3 0 5.5-1.5 7-3-1.5 4-4.5 7-7 7v-4zm14 0c-3 0-5.5-1.5-7-3 1.5 4 4.5 7 7 7v-4z"/></svg>
                            <span>Rezei com a Intercessão de \${item.santo_nome.split('&')[0].trim()} (+10 XP)</span>
                        </button>
                        <button onclick="copyPrayerText('\${item.id}')" class="py-3.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer">
                            <svg class="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                            <span>Copiar</span>
                        </button>
                    </div>
                </div>
            \`;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
        `;

html = html.substring(0, intentionStart) + newIntentionModalFunc + html.substring(intentionEnd);
console.log('[OK] 10. Updated openIntentionPrayerModal with vector images & SVGs.');

// 11. Top Bar Header & Drawer icons
replaceOnce(
    `<button onclick="toggleMobileMenu()" class="lg:hidden text-2xl text-cgreen dark:text-csage p-1 hover:bg-cline/40 dark:hover:bg-slate-800 rounded-lg transition" title="Abrir Menu">☰</button>`,
    `<button onclick="toggleMobileMenu()" class="lg:hidden text-cgreen dark:text-csage p-1.5 hover:bg-cline/40 dark:hover:bg-slate-800 rounded-xl transition flex items-center justify-center cursor-pointer" title="Abrir Menu">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
                    </button>`,
    '11a. Replaced hamburger ☰ with SVG'
);

replaceOnce(
    `<span class="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>`,
    `<span class="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none flex items-center justify-center">
                            <svg class="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        </span>`,
    '11b. Replaced header search lupa 🔍 with SVG'
);

replaceOnce(
    `<span class="absolute right-4 top-3 text-slate-400">🔍</span>`,
    `<span class="absolute right-4 top-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
                                    <svg class="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                </span>`,
    '11c. Replaced pesquisa view lupa with SVG'
);

replaceOnce(
    `<span class="text-xs text-cgold">♡</span>`,
    `<svg class="w-3.5 h-3.5 text-cgold dark:text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`,
    '11d. Replaced Meu Espaço heart with SVG'
);

replaceOnce(
    `<span class="text-xs">☁️</span>`,
    `<svg class="w-3.5 h-3.5 text-cgreen dark:text-csage shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z"/></svg>`,
    '11e. Replaced Nuvem emoji with SVG'
);

replaceOnce(
    `<span class="text-xs">📤</span>`,
    `<svg class="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>`,
    '11f. Replaced Share button with SVG'
);

replaceOnce(
    `<span class="text-xs">📲</span>`,
    `<svg class="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>`,
    '11g. Replaced Install button with SVG'
);

replaceOnce(
    `<button onclick="toggleMobileMenu()" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-lg font-bold transition cursor-pointer">✕</button>`,
    `<button onclick="toggleMobileMenu()" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>`,
    '11h. Replaced Drawer close ✕ with SVG'
);

fs.writeFileSync('D:/Catecismo/index.html', html, 'utf8');
console.log('ALL PATCHES APPLIED! New index.html size:', html.length);
