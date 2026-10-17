const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('D:/Catecismo/index.html', 'utf8');
const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
let m;
let count = 0;
while ((m = scriptRegex.exec(html)) !== null) {
    count++;
    if (m[0].includes('type="module"')) {
        console.log(`Script #${count} (ES Module) skipped vm check`);
        continue;
    }
    try {
        new vm.Script(m[1]);
        console.log(`Script #${count} OK`);
    } catch (e) {
        console.error(`Script #${count} Error:`, e.message);
    }
}
console.log('Total scripts checked:', count);
