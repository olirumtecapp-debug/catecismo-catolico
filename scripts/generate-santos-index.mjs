import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const saintsDir = path.join(ROOT, 'assets', 'img', 'santos');
const targetFile = path.join(ROOT, 'assets', 'data', 'santos_images_index.js');
const novenasJsonPath = path.join(ROOT, 'data', 'novenas.json');
const buildNovenasScriptPath = path.join(ROOT, 'scripts', 'build-novenas-json.mjs');
const saintsDataPath = path.join(ROOT, 'assets', 'data', 'santos_data.js');
const versionJsonPath = path.join(ROOT, 'data', 'version.json');

// 1. Carrega e ordena todos os arquivos de santos
const rawFiles = fs.readdirSync(saintsDir).filter(f => /\.(png|jpe?g|webp)$/i.test(f));

// Regra de ordenação canônica de excelência:
// 1º: Arquivos canônicos datados (MM-DD-...) em formato .png de alta resolução
// 2º: Outros arquivos .png
// 3º: Arquivos datados (MM-DD-...) em .jpg/.jpeg
// 4º: Arquivos legados (ns_...)
rawFiles.sort((a, b) => {
    const aIsMMDD = /^\d{2}-\d{2}-/.test(a) ? 1 : 0;
    const bIsMMDD = /^\d{2}-\d{2}-/.test(b) ? 1 : 0;
    if (aIsMMDD !== bIsMMDD) return bIsMMDD - aIsMMDD;
    const aIsPng = a.toLowerCase().endsWith('.png') ? 1 : 0;
    const bIsPng = b.toLowerCase().endsWith('.png') ? 1 : 0;
    if (aIsPng !== bIsPng) return bIsPng - aIsPng;
    return a.localeCompare(b);
});

// Remove duplicatas que possuam mesma base, priorizando estritamente .png
const byBase = new Map();
for (const f of rawFiles) {
    const ext = path.extname(f).toLowerCase();
    const base = f.slice(0, -ext.length);
    if (!byBase.has(base)) {
        byBase.set(base, f);
    } else {
        const existing = byBase.get(base);
        const existingExt = path.extname(existing).toLowerCase();
        if (ext === '.png' && (existingExt === '.jpg' || existingExt === '.jpeg' || existingExt === '.webp')) {
            byBase.set(base, f);
        }
    }
}
const files = Array.from(byBase.values());

const jsContent = `/* =========================================================================
   ÍNDICE CANÔNICO DE IMAGENS LOCAIS DE SANTOS (${files.length} ARQUIVOS)
   Garante carregamento 100% autêntico, dinâmico e offline da base de santos
   Atualizado automaticamente pelo assistente e painel de auditoria
   ========================================================================= */
(function() {
    const IMAGES = ${JSON.stringify(files)};
    window.LOCAL_SAINTS_IMAGES = IMAGES;
    window.SANTOS_CATALOG_VERSION = "${Date.now()}";

    function norm(s) {
        let str = String(s || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase();
        str = str.replace(/\\bmajella\\b/g, 'magela')
                 .replace(/\\bmagela\\b/g, 'majella')
                 .replace(/\\bedwiges\\b/g, 'edviges')
                 .replace(/\\bedviges\\b/g, 'edwiges')
                 .replace(/\\bpadre pio\\b/g, 'pio de pietrelcina')
                 .replace(/\\bdivina misericordia\\b/g, 'faustina kowalska');
        return str.replace(/[^a-z0-9]/g, '');
    }

    const index = IMAGES.map(file => ({
        file,
        norm: norm(file),
        isMMDD: /^\\d{2}-\\d{2}-/.test(file),
        isPng: file.toLowerCase().endsWith('.png')
    }));

    window.resolveLocalSaintImage = function(saintName, dateStr) {
        if (!saintName && !dateStr) return 'assets/img/liturgia/cristo_bencao.jpg';

        // 1. Prioridade absoluta por data litúrgica (ex: 2026-12-13 -> 12-13)
        if (dateStr && /^\\d{4}-\\d{2}-\\d{2}$/.test(dateStr)) {
            const mmdd = dateStr.slice(5);
            const dateMatches = index.filter(it => it.file.startsWith(mmdd));
            if (saintName) {
                const sNorm = norm(saintName).replace(/^sao|^santa|^santo|^beato|^beata|^ss/, '');
                for (const dm of dateMatches) {
                    if (sNorm && dm.norm.includes(sNorm)) {
                        return 'assets/img/santos/' + dm.file;
                    }
                }
            }
            if (dateMatches.length > 0) {
                return 'assets/img/santos/' + dateMatches[0].file;
            }
        }

        if (!saintName) return null;

        const clean = norm(saintName)
            .replace(/^sao|^santa|^santo|^beato|^beata|^ss/, '')
            .trim();

        // 2. Busca exata ou por substring de alta especificidade
        if (clean.length >= 4) {
            // Prioriza arquivos canônicos datados e .png
            const exact = index.find(it => it.isMMDD && (it.norm.includes(clean) || (clean.length > 6 && clean.includes(it.norm.replace(/^\\d{4}/, '')))));
            if (exact) return 'assets/img/santos/' + exact.file;

            const anyExact = index.find(it => it.norm.includes(clean) || (clean.length > 6 && clean.includes(it.norm.replace(/^\\d{4}/, ''))));
            if (anyExact) return 'assets/img/santos/' + anyExact.file;
        }

        // 3. Busca por tokens/palavras-chave representativas do santo
        const stopWords = ['santo', 'santa', 'sao', 'beato', 'beata', 'ss', 'padroeiro', 'padroeira', 'bispo', 'papa', 'virgem', 'martir', 'martires', 'doutor', 'doutora', 'igreja', 'padre', 'frei', 'irmao', 'irma', 'de', 'da', 'do', 'dos', 'das', 'e', 'em', 'o', 'a', 'com', 'pela', 'pelo', 'fundador', 'fundadora', 'apostolo', 'apostolos'];
        const words = String(saintName)
            .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9\\s]/g, '')
            .split(/\\s+/)
            .filter(w => w.length >= 4 && !stopWords.includes(w));

        for (const w of words) {
            const match = index.find(it => it.isMMDD && it.norm.includes(w)) || index.find(it => it.norm.includes(w));
            if (match) return 'assets/img/santos/' + match.file;
        }

        // 4. Fallback no catálogo do window.SAINTS_DATA se disponível
        if (window.SAINTS_DATA && Array.isArray(window.SAINTS_DATA.catalog)) {
            const found = window.SAINTS_DATA.catalog.find(s => {
                const sn = norm(s.name);
                return sn && (sn.includes(clean) || clean.includes(sn));
            });
            if (found && found.image) return found.image;
        }

        return null;
    };

    window.handleSaintImageError = function(imgEl, saintName, dateStr) {
        if (!imgEl || imgEl.dataset.hasTriedLocalFallback) {
            imgEl.onerror = null;
            imgEl.src = 'assets/img/liturgia/cristo_bencao.jpg';
            return;
        }
        imgEl.dataset.hasTriedLocalFallback = 'true';
        const resolved = window.resolveLocalSaintImage(saintName, dateStr);
        if (resolved && !imgEl.src.endsWith(resolved)) {
            imgEl.src = resolved;
        } else {
            imgEl.src = 'assets/img/liturgia/cristo_bencao.jpg';
        }
    };
})();
`;

fs.writeFileSync(targetFile, jsContent, 'utf8');
console.log('✓ santos_images_index.js gerado com sucesso! Total de imagens:', files.length);

// Helper local para resolver santo dentro deste script
function normLocal(s) {
    let str = String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    str = str.replace(/\bmajella\b/g, 'magela')
             .replace(/\bmagela\b/g, 'majella')
             .replace(/\bedwiges\b/g, 'edviges')
             .replace(/\bedviges\b/g, 'edwiges')
             .replace(/\bpadre pio\b/g, 'pio de pietrelcina')
             .replace(/\bdivina misericordia\b/g, 'faustina kowalska');
    return str.replace(/[^a-z0-9]/g, '');
}

const localIndex = files.map(f => ({
    file: f,
    norm: normLocal(f),
    isMMDD: /^\d{2}-\d{2}-/.test(f),
    isPng: f.toLowerCase().endsWith('.png')
}));

function resolveLocal(saintName, dateStr) {
    if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const mmdd = dateStr.slice(5);
        const dateMatches = localIndex.filter(it => it.file.startsWith(mmdd));
        if (dateMatches.length > 0) return 'assets/img/santos/' + dateMatches[0].file;
    }
    const clean = normLocal(saintName).replace(/^sao|^santa|^santo|^beato|^beata|^ss/, '').trim();
    if (clean.length >= 4) {
        const exact = localIndex.find(it => it.isMMDD && (it.norm.includes(clean) || (clean.length > 6 && clean.includes(it.norm.replace(/^\d{4}/, '')))));
        if (exact) return 'assets/img/santos/' + exact.file;
        const anyExact = localIndex.find(it => it.norm.includes(clean) || (clean.length > 6 && clean.includes(it.norm.replace(/^\d{4}/, ''))));
        if (anyExact) return 'assets/img/santos/' + anyExact.file;
    }
    return null;
}

// Mapa canônico garantido para as novenas oficiais
const canonicalNovenaImages = {
    'nossa-senhora-aparecida': 'assets/img/santos/10-12-nossa-senhora-aparecida.png',
    'santa-teresinha': 'assets/img/santos/10-01-santa-teresa-do-menino-jesus-virgem-carmelita-doutora-da-igreja-padroeira-das-missoes.png',
    'padre-pio': 'assets/img/santos/09-23-sao-pio-de-pietrelcina-presbitero.png',
    'sao-geraldo-magela': 'assets/img/santos/10-16-sao-geraldo-majella-irmao-leigo-redentorista.png',
    'santa-edwiges': 'assets/img/santos/10-16-santa-edviges-duquesa-da-silesia-religiosa.png',
    'santa-luzia': 'assets/img/santos/12-13-santa-luzia-virgem-e-martir-de-siracusa.png',
    'sao-judas-tadeu': 'assets/img/santos/10-28-ss-simao-e-judas-tadeu-apostolos.png',
    'nossa-senhora-desatadora-dos-nos': 'assets/img/santos/ns_nossa-senhora-desatadora-dos-nos.png',
    'divina-misericordia': 'assets/img/santos/10-05-santa-faustina-kowalska.png',
    'pentecostes': 'assets/img/liturgia/cristo_bencao.jpg',
    'sao-bento': 'assets/img/santos/07-11-sao-bento-abade-padroeiro-da-europa.png',
    'santo-antonio': 'assets/img/santos/06-13-santo-antonio-de-padua-sacerdote-franciscano-e-doutor-da-igreja.png',
    'sao-jose': 'assets/img/santos/03-19-santa-jose-esposo-da-santissima-virgem-maria-padroeiro-da-igreja-universal.png',
    'sao-miguel-arcanjo': 'assets/img/santos/09-29-sao-miguel-arcanjo.png',
    'novena-de-natal': 'assets/img/liturgia/adoracao_pastores.jpg',
    'santa-rita-de-cassia': 'assets/img/santos/05-22-santa-rita-de-cassia-religiosa-agostiniana.png',
    'sagrado-coracao-de-jesus': 'assets/img/liturgia/cristo_bencao.jpg',
    'nossa-senhora-de-fatima': 'assets/img/santos/05-13-nossa-senhora-de-fatima.png',
    'sao-peregrino': 'assets/img/santos/ns_sao-peregrino.jpg',
    'medalha-milagrosa': 'assets/img/santos/01-01-santa-maria-mae-de-deus.png'
};

// 2. Auto-sincroniza data/novenas.json com garantia canônica
if (fs.existsSync(novenasJsonPath)) {
    try {
        const novenas = JSON.parse(fs.readFileSync(novenasJsonPath, 'utf8'));
        let updatedNovenas = 0;
        for (const n of novenas) {
            const canonical = canonicalNovenaImages[n.id] || resolveLocal(n.titulo, n.festa_liturgica?.data);
            if (canonical && n.imagem !== canonical && fs.existsSync(canonical)) {
                console.log(`  [Novena Auto-Sync] ${n.id}: ${n.imagem} -> ${canonical}`);
                n.imagem = canonical;
                updatedNovenas++;
            }
        }
        if (updatedNovenas > 0) {
            fs.writeFileSync(novenasJsonPath, JSON.stringify(novenas, null, 2), 'utf8');
            console.log(`✓ data/novenas.json atualizado automaticamente com ${updatedNovenas} novenas!`);
        }
    } catch (e) {
        console.warn('Aviso ao sincronizar novenas.json:', e.message);
    }
}

// 3. Auto-sincroniza scripts/build-novenas-json.mjs
if (fs.existsSync(buildNovenasScriptPath)) {
    try {
        let content = fs.readFileSync(buildNovenasScriptPath, 'utf8');
        let changed = false;
        for (const f of files) {
            if (f.endsWith('.png')) {
                const baseName = f.replace(/\.png$/, '');
                const oldJpgPattern = new RegExp(`assets/img/santos/${baseName}\\.jpg`, 'g');
                if (oldJpgPattern.test(content)) {
                    content = content.replace(oldJpgPattern, `assets/img/santos/${f}`);
                    changed = true;
                }
            }
        }
        if (changed) {
            fs.writeFileSync(buildNovenasScriptPath, content, 'utf8');
            console.log('✓ scripts/build-novenas-json.mjs atualizado com novas imagens .png');
        }
    } catch(e) {}
}

// 4. Auto-sincroniza assets/data/santos_data.js
if (fs.existsSync(saintsDataPath)) {
    try {
        let content = fs.readFileSync(saintsDataPath, 'utf8');
        let changedCount = 0;
        for (const f of files) {
            if (f.endsWith('.png') && /^\d{2}-\d{2}-/.test(f)) {
                const cleanSlug = f.replace(/^\d{2}-\d{2}-/, '').replace(/\.png$/, '');
                // Procura se tem ns_ com o mesmo slug em .jpg
                const legacySearch = new RegExp(`assets/img/santos/ns_${cleanSlug}\\.(jpg|jpeg|webp)`, 'g');
                if (legacySearch.test(content)) {
                    content = content.replace(legacySearch, `assets/img/santos/${f}`);
                    changedCount++;
                }
            }
        }
        if (changedCount > 0) {
            fs.writeFileSync(saintsDataPath, content, 'utf8');
            console.log(`✓ assets/data/santos_data.js atualizado com ${changedCount} imagens canônicas em .png!`);
        }
    } catch(e) {}
}

// 5. Gera arquivo de versão para cache-busting
try {
    const versionPayload = {
        version: Date.now(),
        updatedAt: new Date().toISOString(),
        totalImages: files.length
    };
    fs.writeFileSync(versionJsonPath, JSON.stringify(versionPayload, null, 2), 'utf8');
    console.log('✓ data/version.json gerado para controle de cache!');
} catch (e) {}
