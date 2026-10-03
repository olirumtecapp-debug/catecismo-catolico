import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const dir = path.join(ROOT, 'data', 'santos', '2026');
const saintsImgDir = path.join(ROOT, 'assets', 'img', 'santos');
const saintsDataPath = path.join(ROOT, 'assets', 'data', 'santos_data.js');

const FEMALE_EXPLICIT = new Map([
    ['Marcela, romana, discípula de S. Jerônimo', 'Santa Marcela, romana, discípula de S. Jerônimo'],
    ['Flávia Domitila, mártir romana', 'Santa Flávia Domitila, mártir romana'],
    ['Áurea, mártir de Óstia', 'Santa Áurea, mártir de Óstia'],
    ['Lídia, discípula de S. Paulo', 'Santa Lídia, discípula de S. Paulo'],
    ['Susana, romana, na igreja homônima', 'Santa Susana, romana, na igreja homônima'],
    ['Emilìa de Vialar', 'Santa Emília de Vialar'],
    ['Sabina, romana, cujo título, fundado no monte Aventino, venera o seu nome', 'Santa Sabina, romana, cujo título, fundado no monte Aventino, venera o seu nome'],
    ['Basila, mártir, na via Salária Antiga', 'Santa Basila, mártir, na via Salária Antiga'],
    ['Filipina Rosa Duchesne', 'Santa Filipina Rosa Duchesne'],
    ['Petronila', 'Santa Petronila'],
    ['Marina de Bitinia', 'Santa Marina de Bitinia'],
]);

const BEATA_NAMES = [
    'Ludovica Albertoni', 'Isabel Canóri Mora', 'Maria Gabriela Saghéddu', 
    'Ana Maria Taigi', 'Maria Teresa Ledóchowska', 'Columba Gabriel', 
    'Maria de Jesus do Bom Pastor', 'Maria dos Apóstolos'
];

function slugify(text) {
    return text.toString().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function normalizeSaintName(v = '') {
    let norm = String(v || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    norm = norm
        .replace(/\b(s|sao|santo|santa|sta|sto|st)\b/gi, 'sao')
        .replace(/\b(beato|beata|bto|bta)\b/gi, 'beato')
        .replace(/[,;:.!?]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    return norm;
}

export function getCanonicalName(name) {
    name = String(name || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
    if (name === 'SÃO JOSÉ VAZ') return 'São José Vaz';
    if (name === 'São JOSAFÁ KUNCEWICZ, BISPO E MÁRTIR') return 'São Josafá Kuncewicz, bispo e mártir';
    if (name.startsWith('San Gabriel')) return name.replace(/^San\s+/i, 'São ');
    if (name.startsWith('San Rafael')) return name.replace(/^San\s+/i, 'São ');
    if (name.startsWith('s. ')) {
        const rest = name.replace(/^s\.\s+/i, '').trim();
        return FEMALE_EXPLICIT.has(rest) ? FEMALE_EXPLICIT.get(rest) : 'Santa ' + rest;
    }
    if (name.startsWith('Santa Antônio Maria Claret')) {
        return name.replace(/^Santa\s+/i, 'Santo ');
    }
    if (/^BB\.\s+/i.test(name)) {
        return name.replace(/^BB\.\s+/i, 'Beatos ');
    }
    if (/^(B\.|b\.)\s+/i.test(name)) {
        const rest = name.replace(/^(B\.|b\.)\s+/i, '').trim();
        const isFem = BEATA_NAMES.some(b => rest.startsWith(b));
        return (isFem ? 'Beata ' : 'Beato ') + rest;
    }
    if (/^São\s+/i.test(name)) {
        const rest = name.replace(/^São\s+/i, '').trim();
        if (FEMALE_EXPLICIT.has(rest)) {
            return FEMALE_EXPLICIT.get(rest);
        }
        const firstChar = rest[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
        if (['A','E','I','O','U','H'].includes(firstChar)) {
            return 'Santo ' + rest;
        }
    }
    return name;
}

async function run() {
    console.log('--- INICIANDO APLICAÇÃO CANÔNICA DE NOMES E PREFIXOS ---');
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();
    let totalUpdatedSaints = 0;
    let totalUpdatedFiles = 0;
    let renamedImages = 0;

    for (const file of files) {
        const filePath = path.join(dir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (!data.saints || !Array.isArray(data.saints)) continue;

        let fileModified = false;

        for (const s of data.saints) {
            const canonical = getCanonicalName(s.name);
            if (canonical !== s.name) {
                const oldName = s.name;
                s.name = canonical;
                s.normalizedName = normalizeSaintName(canonical);
                totalUpdatedSaints++;
                fileModified = true;

                // Atualizar imagens físicas e URLs
                if (s.imageUrl) {
                    const oldRelPath = s.imageUrl.replace(/^\.\//, '');
                    const oldBaseName = path.basename(oldRelPath);
                    const ext = path.extname(oldBaseName);
                    const mmdd = data.date.slice(5);
                    const newBaseName = `${mmdd}-${slugify(canonical)}${ext}`;
                    const oldDiskFile = path.join(saintsImgDir, oldBaseName);
                    const newDiskFile = path.join(saintsImgDir, newBaseName);

                    if (fs.existsSync(oldDiskFile) && oldBaseName !== newBaseName) {
                        try {
                            if (!fs.existsSync(newDiskFile)) {
                                fs.renameSync(oldDiskFile, newDiskFile);
                                renamedImages++;
                            }
                            s.imageUrl = `./assets/img/santos/${newBaseName}`;
                        } catch (err) {
                            console.error(`Erro ao renomear imagem ${oldBaseName}:`, err.message);
                        }
                    } else if (fs.existsSync(newDiskFile)) {
                        s.imageUrl = `./assets/img/santos/${newBaseName}`;
                    }

                    // Também verificar se existia versão correspondente .jpg/.png legada e renomear
                    const otherExt = ext.toLowerCase() === '.png' ? '.jpg' : '.png';
                    const oldBaseOther = oldBaseName.replace(ext, otherExt);
                    const newBaseOther = newBaseName.replace(ext, otherExt);
                    const oldDiskOther = path.join(saintsImgDir, oldBaseOther);
                    const newDiskOther = path.join(saintsImgDir, newBaseOther);
                    if (fs.existsSync(oldDiskOther) && !fs.existsSync(newDiskOther)) {
                        try {
                            fs.renameSync(oldDiskOther, newDiskOther);
                            renamedImages++;
                        } catch (e) {}
                    }
                }

                console.log(`[${data.date}] ${oldName} ---> ${canonical}`);
            }
        }

        if (fileModified) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
            totalUpdatedFiles++;
        }
    }

    console.log(`\n✓ Concluído com sucesso!`);
    console.log(`  Arquivos JSON modificados: ${totalUpdatedFiles}`);
    console.log(`  Santos atualizados canonicamente: ${totalUpdatedSaints}`);
    console.log(`  Arquivos de imagem renomeados no disco: ${renamedImages}`);

    // 2. Atualizar santos_data.js
    if (fs.existsSync(saintsDataPath)) {
        let content = fs.readFileSync(saintsDataPath, 'utf8');
        let mod = false;
        if (content.includes('São Agostinho de Cantuária')) {
            content = content.replace(/São Agostinho de Cantuária/g, 'Santo Agostinho de Cantuária');
            mod = true;
        }
        if (content.includes('São Adrião de Alexandria')) {
            content = content.replace(/São Adrião de Alexandria/g, 'Santo Adrião de Alexandria');
            mod = true;
        }
        if (mod) {
            fs.writeFileSync(saintsDataPath, content, 'utf8');
            console.log('✓ assets/data/santos_data.js atualizado com formas canônicas!');
        }
    }
}

run();
