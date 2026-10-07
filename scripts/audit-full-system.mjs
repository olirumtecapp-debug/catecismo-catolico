import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

console.log('====================================================');
console.log(' BATERIA DE TESTES DE INTEGRIDADE CANÔNICA DO SISTEMA');
console.log('====================================================\n');

let errors = 0;
let warnings = 0;

function assert(condition, message) {
    if (!condition) {
        console.error('❌ ERRO:', message);
        errors++;
    } else {
        console.log('✅ OK:', message);
    }
}

function warn(condition, message) {
    if (!condition) {
        console.warn('⚠️ AVISO:', message);
        warnings++;
    } else {
        console.log('✅ OK:', message);
    }
}

// 1. TESTE DE IMAGENS DAS NOVENAS
console.log('\n--- 1. Verificando data/novenas.json ---');
const novenasPath = path.join(ROOT, 'data', 'novenas.json');
assert(fs.existsSync(novenasPath), 'data/novenas.json existe');
const novenas = JSON.parse(fs.readFileSync(novenasPath, 'utf8'));
assert(novenas.length === 20, `20 novenas oficiais cadastradas (atual: ${novenas.length})`);

novenas.forEach(n => {
    assert(n.id && n.titulo, `Novena ${n.id} possui ID e Título`);
    assert(n.imagem, `Novena ${n.id} possui imagem definida: ${n.imagem}`);
    if (n.imagem) {
        const fullImgPath = path.join(ROOT, n.imagem);
        assert(fs.existsSync(fullImgPath), `Arquivo físico existe: ${n.imagem}`);
    }
    assert(Array.isArray(n.dias) && n.dias.length === 9, `Novena ${n.id} possui exatamente 9 dias estruturados`);
});

// 2. TESTE DE ÍNDICE DE SANTOS
console.log('\n--- 2. Verificando assets/data/santos_images_index.js ---');
const indexJsPath = path.join(ROOT, 'assets', 'data', 'santos_images_index.js');
assert(fs.existsSync(indexJsPath), 'santos_images_index.js existe');
const indexContent = fs.readFileSync(indexJsPath, 'utf8');
assert(indexContent.includes('window.resolveLocalSaintImage'), 'window.resolveLocalSaintImage está definida');
assert(indexContent.includes('window.LOCAL_SAINTS_IMAGES'), 'window.LOCAL_SAINTS_IMAGES está preenchida');

// Teste de resolução canônica em ambiente simulado
global.window = {};
eval(indexContent);
assert(typeof global.window.resolveLocalSaintImage === 'function', 'resolveLocalSaintImage é uma função válida');

const apRes1 = global.window.resolveLocalSaintImage("Novena Oficial de Nossa Senhora Aparecida");
assert(apRes1 === 'assets/img/santos/10-12-nossa-senhora-aparecida.png', `Aparecida (título completo) resolve para imagem canônica auditada: ${apRes1}`);

const apRes2 = global.window.resolveLocalSaintImage("Nossa Senhora Aparecida");
assert(apRes2 === 'assets/img/santos/10-12-nossa-senhora-aparecida.png', `Aparecida (nome curto) resolve para imagem canônica auditada: ${apRes2}`);

// Validação de todas as 20 novenas
let perfectResolutions = 0;
novenas.forEach(n => {
    const res = global.window.resolveLocalSaintImage(n.titulo, n.festa_liturgica);
    if (res === n.imagem) perfectResolutions++;
});
assert(perfectResolutions === novenas.length, `100% das 20 novenas resolvem para suas imagens canônicas auditadas (${perfectResolutions}/${novenas.length})`);


// 3. TESTE DO SERVICE WORKER (Network-First)
console.log('\n--- 3. Verificando sw.js ---');
const swPath = path.join(ROOT, 'sw.js');
assert(fs.existsSync(swPath), 'sw.js existe');
const swContent = fs.readFileSync(swPath, 'utf8');
assert(swContent.includes('catecismo-v2'), 'sw.js possui versão incrementada v2');
assert(swContent.includes('/api/'), 'sw.js ignora rotas /api/ para nunca travar sincronização');
assert(swContent.includes('no-cache'), 'sw.js busca rede primeiro para dados frescos');

// 4. TESTE DE ESTABILIDADE DO BANNER E SINCRONIZAÇÃO NO index.html
console.log('\n--- 4. Verificando index.html ---');
const indexPath = path.join(ROOT, 'index.html');
assert(fs.existsSync(indexPath), 'index.html existe');
const indexHtml = fs.readFileSync(indexPath, 'utf8');
assert(indexHtml.includes('min-width:56px;max-width:56px'), 'Trava rígida de 56x56px presente nas imagens de novena no banner');
assert(indexHtml.includes('visibilitychange'), 'Sincronização reativa ao alternar abas (visibilitychange) configurada');
assert(indexHtml.includes('data.appState.liturgicalRead'), 'Mesclagem não-destrutiva de liturgia diária presente no SmartSync');

// 5. TESTE DE INTEGRIDADE DO novenas.html
console.log('\n--- 5. Verificando novenas.html ---');
const novenasHtmlPath = path.join(ROOT, 'novenas.html');
assert(fs.existsSync(novenasHtmlPath), 'novenas.html existe');
const novenasHtml = fs.readFileSync(novenasHtmlPath, 'utf8');
assert(novenasHtml.includes('resolveLocalSaintImage'), 'novenas.html consulta banco de santos auditado');
assert(novenasHtml.includes('cristo_bencao.jpg'), 'Fallback canônico presente para novenas sem imagem específica');

console.log('\n====================================================');
console.log(` RESULTADO FINAL: ${errors} ERRO(S), ${warnings} AVISO(S)`);
console.log('====================================================');

if (errors > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
