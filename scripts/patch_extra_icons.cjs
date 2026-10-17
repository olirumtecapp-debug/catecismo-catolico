const fs = require('fs');
const path = require('path');
const vm = require('vm');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

console.log('Original index.html length:', html.length);

// 1. Quatro Pilares on Home Page (under Aprender e aprofundar)
// Replace ✝️, 🍷, 📜, 🕊️ with getPillarIconSvg calls
const oldPilaresBlock = `<div class="grid grid-cols-2 gap-1.5 my-2.5">
                                            <div class="bg-[#f7f6f0] dark:bg-slate-700/60 p-2 rounded-xl border border-cline/70 dark:border-slate-600/70 flex items-center gap-1.5">
                                                <span class="text-xs">✝️</span>
                                                <div class="min-w-0 leading-tight">
                                                    <div class="text-[11px] font-bold text-cgreen dark:text-white truncate">I. Credo</div>
                                                    <div class="text-[8px] text-[#788579] dark:text-slate-400">Professada</div>
                                                </div>
                                            </div>
                                            <div class="bg-[#f7f6f0] dark:bg-slate-700/60 p-2 rounded-xl border border-cline/70 dark:border-slate-600/70 flex items-center gap-1.5">
                                                <span class="text-xs">🍷</span>
                                                <div class="min-w-0 leading-tight">
                                                    <div class="text-[11px] font-bold text-cgreen dark:text-white truncate">II. Sacramentos</div>
                                                    <div class="text-[8px] text-[#788579] dark:text-slate-400">Celebrada</div>
                                                </div>
                                            </div>
                                            <div class="bg-[#f7f6f0] dark:bg-slate-700/60 p-2 rounded-xl border border-cline/70 dark:border-slate-600/70 flex items-center gap-1.5">
                                                <span class="text-xs">📜</span>
                                                <div class="min-w-0 leading-tight">
                                                    <div class="text-[11px] font-bold text-cgreen dark:text-white truncate">III. Mandamentos</div>
                                                    <div class="text-[8px] text-[#788579] dark:text-slate-400">Vivida</div>
                                                </div>
                                            </div>
                                            <div class="bg-[#f7f6f0] dark:bg-slate-700/60 p-2 rounded-xl border border-cline/70 dark:border-slate-600/70 flex items-center gap-1.5">
                                                <span class="text-xs">🕊️</span>
                                                <div class="min-w-0 leading-tight">
                                                    <div class="text-[11px] font-bold text-cgreen dark:text-white truncate">IV. Oração</div>
                                                    <div class="text-[8px] text-[#788579] dark:text-slate-400">Orada</div>
                                                </div>
                                            </div>
                                        </div>`;

const newPilaresBlock = `<div class="grid grid-cols-2 gap-1.5 my-2.5">
                                            <div class="bg-[#f7f6f0] dark:bg-slate-700/60 p-2 rounded-xl border border-cline/70 dark:border-slate-600/70 flex items-center gap-2">
                                                <span class="shrink-0 text-cgreen dark:text-csage">${'${getPillarIconSvg("creio", "w-3.5 h-3.5")}'}</span>
                                                <div class="min-w-0 leading-tight">
                                                    <div class="text-[11px] font-bold text-cgreen dark:text-white truncate">I. Credo</div>
                                                    <div class="text-[8px] text-[#788579] dark:text-slate-400">Professada</div>
                                                </div>
                                            </div>
                                            <div class="bg-[#f7f6f0] dark:bg-slate-700/60 p-2 rounded-xl border border-cline/70 dark:border-slate-600/70 flex items-center gap-2">
                                                <span class="shrink-0 text-cgreen dark:text-csage">${'${getPillarIconSvg("celebro", "w-3.5 h-3.5")}'}</span>
                                                <div class="min-w-0 leading-tight">
                                                    <div class="text-[11px] font-bold text-cgreen dark:text-white truncate">II. Sacramentos</div>
                                                    <div class="text-[8px] text-[#788579] dark:text-slate-400">Celebrada</div>
                                                </div>
                                            </div>
                                            <div class="bg-[#f7f6f0] dark:bg-slate-700/60 p-2 rounded-xl border border-cline/70 dark:border-slate-600/70 flex items-center gap-2">
                                                <span class="shrink-0 text-cgreen dark:text-csage">${'${getPillarIconSvg("vivo", "w-3.5 h-3.5")}'}</span>
                                                <div class="min-w-0 leading-tight">
                                                    <div class="text-[11px] font-bold text-cgreen dark:text-white truncate">III. Mandamentos</div>
                                                    <div class="text-[8px] text-[#788579] dark:text-slate-400">Vivida</div>
                                                </div>
                                            </div>
                                            <div class="bg-[#f7f6f0] dark:bg-slate-700/60 p-2 rounded-xl border border-cline/70 dark:border-slate-600/70 flex items-center gap-2">
                                                <span class="shrink-0 text-cgreen dark:text-csage">${'${getPillarIconSvg("rezo", "w-3.5 h-3.5")}'}</span>
                                                <div class="min-w-0 leading-tight">
                                                    <div class="text-[11px] font-bold text-cgreen dark:text-white truncate">IV. Oração</div>
                                                    <div class="text-[8px] text-[#788579] dark:text-slate-400">Orada</div>
                                                </div>
                                            </div>
                                        </div>`;

if (html.includes(oldPilaresBlock)) {
    html = html.replace(oldPilaresBlock, newPilaresBlock);
    console.log('✓ Replaced Quatro Pilares emojis with getPillarIconSvg in Home');
} else {
    // CRLF normalized try
    const normHtml = html.replace(/\r\n/g, '\n');
    const normOld = oldPilaresBlock.replace(/\r\n/g, '\n');
    if (normHtml.includes(normOld)) {
        html = normHtml.replace(normOld, newPilaresBlock.replace(/\r\n/g, '\n')).replace(/\n/g, '\r\n');
        console.log('✓ Replaced Quatro Pilares emojis (normalized CRLF) in Home');
    } else {
        console.warn('⚠️ Could not find exact oldPilaresBlock');
    }
}

// 2. Remaining Lupas / Search icons
// 2a. Line 8669: 🔎 Abrir referência
const oldBibleRef = `<button onclick="openBibleReference()" class="px-5 py-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold">🔎 Abrir referência</button>`;
const newBibleRef = `<button onclick="openBibleReference()" class="px-5 py-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-amber-100 transition cursor-pointer">
    <svg class="w-4 h-4 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
    <span>Abrir referência</span>
</button>`;
if (html.includes(oldBibleRef)) {
    html = html.replace(oldBibleRef, newBibleRef);
    console.log('✓ Replaced 🔎 in openBibleReference button');
}

// 2b. Line 8771: <span class="absolute left-3 top-3.5 text-slate-400 text-sm">🔎</span>
const oldCccLupa = `<span class="absolute left-3 top-3.5 text-slate-400 text-sm">🔎</span>`;
const newCccLupa = `<span class="absolute left-3 top-3.5 text-slate-400 text-sm flex items-center justify-center pointer-events-none">
    <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
</span>`;
if (html.includes(oldCccLupa)) {
    html = html.replace(oldCccLupa, newCccLupa);
    console.log('✓ Replaced 🔎 in Catecismo Completo search input');
}

// 2c. Line 17201: <span>🔍</span> <span>Transparência do Projeto</span>
const oldTransp = `<span>🔍</span> <span>Transparência do Projeto</span>`;
const newTransp = `<svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> <span>Transparência do Projeto</span>`;
if (html.includes(oldTransp)) {
    html = html.replace(oldTransp, newTransp);
    console.log('✓ Replaced 🔍 in Transparência do Projeto button');
}

// 3. Dawn and Night placeholders on Home
// <span class="text-3xl mb-1 filter drop-shadow">🌅</span>
const oldDawn = `<span class="text-3xl mb-1 filter drop-shadow">🌅</span>`;
const newDawn = `<span class="mb-1 text-amber-300 filter drop-shadow flex items-center justify-center">
    <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
        <circle cx="12" cy="12" r="4" fill="currentColor" fill-opacity="0.3"></circle>
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
    </svg>
</span>`;
if (html.includes(oldDawn)) {
    html = html.replace(oldDawn, newDawn);
    console.log('✓ Replaced 🌅 in Oração da Manhã placeholder');
}

// <span class="text-3xl mb-1 filter drop-shadow">🌙</span>
const oldNight = `<span class="text-3xl mb-1 filter drop-shadow">🌙</span>`;
const newNight = `<span class="mb-1 text-indigo-300 filter drop-shadow flex items-center justify-center">
    <svg class="w-8 h-8" fill="currentColor" fill-opacity="0.25" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
    </svg>
</span>`;
if (html.includes(oldNight)) {
    html = html.replace(oldNight, newNight);
    console.log('✓ Replaced 🌙 in Oração da Noite placeholder');
}

// 4. Lectio Divina step panels on Home
// Passo 1: <span class="text-xl shrink-0">📖</span>
const oldLectioP1 = `<div class="p-4 bg-[#f4eee0] dark:bg-slate-800/80 rounded-[18px] border border-[#e8ddc9] dark:border-slate-700 flex items-start gap-3">
                                    <span class="text-xl shrink-0">📖</span>`;
const newLectioP1 = `<div class="p-4 bg-[#f4eee0] dark:bg-slate-800/80 rounded-[18px] border border-[#e8ddc9] dark:border-slate-700 flex items-start gap-3">
                                    <span class="p-2 rounded-xl bg-cgreen text-dourado-light shrink-0 flex items-center justify-center"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg></span>`;
if (html.includes(oldLectioP1)) {
    html = html.replace(oldLectioP1, newLectioP1);
    console.log('✓ Replaced 📖 in Lectio Divina Passo 1');
}

// Passo 2: <span class="text-xl shrink-0">💭</span>
const oldLectioP2 = `<div class="p-4 bg-[#ecefe7] dark:bg-slate-800/80 rounded-[18px] border border-[#d6dbd1] dark:border-slate-700 flex items-start gap-3">
                                    <span class="text-xl shrink-0">💭</span>`;
const newLectioP2 = `<div class="p-4 bg-[#ecefe7] dark:bg-slate-800/80 rounded-[18px] border border-[#d6dbd1] dark:border-slate-700 flex items-start gap-3">
                                    <span class="p-2 rounded-xl bg-cgreen text-dourado-light shrink-0 flex items-center justify-center"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg></span>`;
if (html.includes(oldLectioP2)) {
    html = html.replace(oldLectioP2, newLectioP2);
    console.log('✓ Replaced 💭 in Lectio Divina Passo 2');
}

// Passo 3: <span class="text-xl shrink-0">🙏</span>
const oldLectioP3 = `<div class="p-4 bg-[#f4eee0] dark:bg-slate-800/80 rounded-[18px] border border-[#e8ddc9] dark:border-slate-700 flex items-start gap-3">
                                    <span class="text-xl shrink-0">🙏</span>`;
const newLectioP3 = `<div class="p-4 bg-[#f4eee0] dark:bg-slate-800/80 rounded-[18px] border border-[#e8ddc9] dark:border-slate-700 flex items-start gap-3">
                                    <span class="p-2 rounded-xl bg-cgreen text-dourado-light shrink-0 flex items-center justify-center"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3c-1.5 2-3 4-3 7 0 2.5 1.5 4 3 6 1.5-2 3-3.5 3-6 0-3-1.5-5-3-7zm-7 9c3 0 5.5-1.5 7-3-1.5 4-4.5 7-7 7v-4zm14 0c-3 0-5.5-1.5-7-3 1.5 4 4.5 7 7 7v-4z"/></svg></span>`;
if (html.includes(oldLectioP3)) {
    html = html.replace(oldLectioP3, newLectioP3);
    console.log('✓ Replaced 🙏 in Lectio Divina Passo 3');
}

// Passo 4: <span class="text-xl shrink-0">✨</span>
const oldLectioP4 = `<div class="p-4 bg-[#ecefe7] dark:bg-slate-800/80 rounded-[18px] border border-[#d6dbd1] dark:border-slate-700 flex items-start gap-3">
                                    <span class="text-xl shrink-0">✨</span>`;
const newLectioP4 = `<div class="p-4 bg-[#ecefe7] dark:bg-slate-800/80 rounded-[18px] border border-[#d6dbd1] dark:border-slate-700 flex items-start gap-3">
                                    <span class="p-2 rounded-xl bg-cgreen text-dourado-light shrink-0 flex items-center justify-center"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.286L13 21l-2.286-6.857L5 12l5.714-2.286L13 3z"/></svg></span>`;
if (html.includes(oldLectioP4)) {
    html = html.replace(oldLectioP4, newLectioP4);
    console.log('✓ Replaced ✨ in Lectio Divina Passo 4');
}

// Diário Espiritual header: <span>✍️</span>
const oldDiario = `<span>✍️</span> <span>Seu Diário Espiritual (Fruto da Lectio Divina)</span>`;
const newDiario = `<svg class="w-4 h-4 text-cgold dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg> <span>Seu Diário Espiritual (Fruto da Lectio Divina)</span>`;
if (html.includes(oldDiario)) {
    html = html.replace(oldDiario, newDiario);
    console.log('✓ Replaced ✍️ in Diário Espiritual header');
}

// Botões Diário: <span>📖</span> <span>Ver Minhas Reflexões Gravadas</span>
const oldVerRef = `<span>📖</span> <span>Ver Minhas Reflexões Gravadas</span>`;
const newVerRef = `<svg class="w-3.5 h-3.5 text-cgreen dark:text-csage" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg> <span>Ver Minhas Reflexões Gravadas</span>`;
if (html.includes(oldVerRef)) {
    html = html.replace(oldVerRef, newVerRef);
    console.log('✓ Replaced 📖 in Ver Minhas Reflexões button');
}

// <span>💾</span> <span>Gravar Reflexão &amp; Propósito</span>
const oldGravar = `<span>💾</span> <span>Gravar Reflexão &amp; Propósito</span>`;
const newGravar = `<svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg> <span>Gravar Reflexão &amp; Propósito</span>`;
if (html.includes(oldGravar)) {
    html = html.replace(oldGravar, newGravar);
    console.log('✓ Replaced 💾 in Gravar Reflexão button');
}

// Write back
fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully wrote updated index.html! New length:', html.length);
