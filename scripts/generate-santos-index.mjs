import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const saintsDir = path.join(ROOT, 'assets', 'img', 'santos');
const targetFile = path.join(ROOT, 'assets', 'data', 'santos_images_index.js');

// Remove duplicatas mantendo SEMPRE a imagem em alta resolução .png quando existir
const rawFiles = fs.readdirSync(saintsDir).filter(f => /\.(png|jpe?g|webp)$/i.test(f));
const byBase = new Map();
for (const f of rawFiles) {
    const ext = path.extname(f).toLowerCase();
    const base = f.slice(0, -ext.length);
    if (!byBase.has(base)) {
        byBase.set(base, f);
    } else {
        const existing = byBase.get(base);
        const existingExt = path.extname(existing).toLowerCase();
        if (ext === '.png' && (existingExt === '.jpg' || existingExt === '.jpeg')) {
            byBase.set(base, f);
        }
    }
}
const files = Array.from(byBase.values()).sort();

const jsContent = `/* =========================================================================
   ÍNDICE CANÔNICO DE IMAGENS LOCAIS DE SANTOS (${files.length} ARQUIVOS)
   Garante carregamento 100% autêntico e offline da base de santos
   ========================================================================= */
(function() {
    const IMAGES = ${JSON.stringify(files)};
    window.LOCAL_SAINTS_IMAGES = IMAGES;

    function norm(s) {
        return String(s || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    const index = IMAGES.map(file => ({ file, norm: norm(file) }));

    window.resolveLocalSaintImage = function(saintName, dateStr) {
        if (!saintName && !dateStr) return 'assets/img/liturgia/cristo_bencao.jpg';

        // 1. Prioridade por data (ex: 2026-09-22 -> 09-22)
        if (dateStr && /^\\d{4}-\\d{2}-\\d{2}$/.test(dateStr)) {
            const mmdd = dateStr.slice(5);
            if (saintName) {
                const sNorm = norm(saintName).replace(/^sao|^santa|^santo|^beato|^beata|^ss/, '');
                const dateMatches = index.filter(it => it.file.startsWith(mmdd));
                // Prioriza sempre .png sobre .jpg
                dateMatches.sort((a, b) => (b.file.endsWith('.png') ? 1 : 0) - (a.file.endsWith('.png') ? 1 : 0));
                for (const dm of dateMatches) {
                    if (sNorm && dm.norm.includes(sNorm)) {
                        return 'assets/img/santos/' + dm.file;
                    }
                }
                if (dateMatches.length > 0) {
                    return 'assets/img/santos/' + dateMatches[0].file;
                }
            }
        }

        if (!saintName) return null;

        const clean = norm(saintName)
            .replace(/^sao|^santa|^santo|^beato|^beata|^ss/, '')
            .trim();

        // 2. Busca exata ou substring robusta
        if (clean.length >= 4) {
            const exact = index.find(it => it.norm.includes(clean) || (clean.length > 6 && clean.includes(it.norm.replace(/^\\d{2}\\d{2}/, ''))));
            if (exact) return 'assets/img/santos/' + exact.file;
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
            const match = index.find(it => it.norm.includes(w));
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
console.log('santos_images_index.js gerado com sucesso! Total de imagens indexadas:', files.length);
