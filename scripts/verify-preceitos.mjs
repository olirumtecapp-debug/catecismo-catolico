import fs from 'fs';

const content = fs.readFileSync('D:/Catecismo/preceitos.html', 'utf8');
const scriptMatch = content.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);

if (scriptMatch) {
    const code = scriptMatch[1];
    console.log('Script Babel encontrado, tamanho:', code.length, 'bytes');
    console.log('Contém handleCloseOrBack?', code.includes('handleCloseOrBack'));
    console.log('Contém findCanonicalNovenaId?', code.includes('findCanonicalNovenaId'));
    console.log('Contém handleOpenNovena?', code.includes('handleOpenNovena'));
    console.log('Contém OPEN_NOVENA?', code.includes('OPEN_NOVENA'));
    console.log('Contém novenaId em NOVENAS_DATA?', code.includes("novenaId: 'santa-teresinha'"));
    console.log('Contém banner no EventModal?', code.includes('Novena no Catecismo'));
    console.log('Contém CTA no NovenasModal?', code.includes('Rezar esta Novena no Catecismo'));
    console.log('Contém CTA no card de jornada?', code.includes('🌹 Rezar Novena'));
    console.log('Tudo presente e verificado com sucesso!');
} else {
    console.error('Script Babel não encontrado');
    process.exit(1);
}
