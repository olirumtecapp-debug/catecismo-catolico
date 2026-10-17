const fs = require('fs');
const html = fs.readFileSync('D:/Catecismo/index.html', 'utf8');

const checks = [
    'filterPrayers',
    'filterPrayersBySearch',
    'openIntentionPrayerModal',
    'openPrayerModal',
    'getPillarIconSvg',
    'getIntentionIconSvg'
];

checks.forEach(fn => {
    console.log(`${fn} present?`, html.includes(`function ${fn}`));
});

// Check prayers
console.log('p_1 present?', html.includes('"id": "p_1"'));
console.log('p_oracao_jubileu present?', html.includes('"id": "p_oracao_jubileu"'));
console.log('p_miserere present?', html.includes('"id": "p_miserere"'));
console.log('p_adoro_te_devote present?', html.includes('"id": "p_adoro_te_devote"'));
console.log('vector_imagem used in openIntentionPrayerModal?', html.includes('item.vector_imagem ? `./assets/img/temas/${item.vector_imagem}` : item.santo_imagem'));
console.log('prayer-search-input present?', html.includes('id="prayer-search-input"'));
console.log('saints-tab-today has SVG?', html.includes('<button id="saints-tab-today"') && html.includes('M8 7V3m8 4V3m-9 8h10M5 21h14'));
console.log('Quatro Pilares Fonte has SVG?', html.includes('d="M3 8V5h12v3M9 5v14M16 13h5v2M18.5 13v6"'));
console.log('Planos de Estudo card has SVG?', html.includes('polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"'));
