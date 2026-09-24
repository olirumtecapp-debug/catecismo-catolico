import fs from 'fs';

const html = fs.readFileSync('C:/Users/Murilo Pai/.gemini/antigravity/brain/56b3c9d7-ba3d-4533-b7e1-be87de251bf4/.system_generated/steps/10405/content.md', 'utf8');

// Find all occurrences of "dia"
const regex = /(?:<h[1-6][^>]*>(.*?)<\/h[1-6]>|<p[^>]*>(.*?)<\/p>)/gi;
let match;
const lines = [];

while ((match = regex.exec(html)) !== null) {
    const text = (match[1] || match[2] || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    if (text) {
        lines.push(text);
    }
}

// Find where "1º dia" or "1° dia" or "Novena das Rosas" appears
const startIndex = lines.findIndex(l => /1[º°]\s*dia/i.test(l));
console.log('Start index:', startIndex);

if (startIndex !== -1) {
    const relevant = lines.slice(Math.max(0, startIndex - 5), startIndex + 150);
    fs.writeFileSync('D:/Catecismo/scripts/extracted-novena.txt', relevant.join('\n\n'), 'utf8');
    console.log('Saved extracted novena to D:/Catecismo/scripts/extracted-novena.txt');
} else {
    console.log('1º dia not found. Printing some lines:');
    console.log(lines.slice(0, 30));
}
