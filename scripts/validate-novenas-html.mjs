import fs from 'fs';
import vm from 'vm';

const c = fs.readFileSync('novenas.html', 'utf8');
const scriptMatches = c.match(/<script[\s\S]*?<\/script>/gi) || [];
console.log('Scripts in novenas.html:', scriptMatches.length);
scriptMatches.forEach((s, idx) => {
    const srcMatch = s.match(/src=["'](.*?)["']/i);
    if (srcMatch) {
        console.log(`Script #${idx+1} (external): ${srcMatch[1]}`);
    } else {
        const code = s.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
        try {
            new vm.Script(code);
            console.log(`Script #${idx+1} (inline): OK (${code.length} chars)`);
        } catch(e) {
            console.error(`Script #${idx+1} ERROR:`, e.message);
        }
    }
});
