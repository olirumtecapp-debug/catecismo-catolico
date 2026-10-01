import fs from 'fs';
import vm from 'vm';

const c = fs.readFileSync('novenas.html', 'utf8');
const sStart = 20934;
const tagOpenEnd = c.indexOf('>', sStart);
const sEnd = c.indexOf('</script>', tagOpenEnd);
const code = c.substring(tagOpenEnd + 1, sEnd);

console.log('Testing Script #5 module syntax (length:', code.length, 'chars)...');
try {
    const mod = new vm.SourceTextModule(code);
    console.log('✓ Script #5 (module): 100% VÁLIDO SEM ERROS DE SINTAXE!');
} catch (e) {
    console.error('❌ Script #5 ERROR:', e);
}
