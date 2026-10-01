import fs from 'fs';
import vm from 'vm';

const html = fs.readFileSync('index.html', 'utf8');
const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
let errors = 0;

while ((match = scriptRegex.exec(html)) !== null) {
  const attrs = match[1];
  const code = match[2];
  if (!code.trim()) continue;
  count++;
  try {
    if (attrs.includes('type="module"')) {
      new vm.SourceTextModule(code);
      console.log(`Script #${count} (module): OK (${code.length} chars)`);
    } else {
      new vm.Script(code);
      console.log(`Script #${count} (script): OK (${code.length} chars)`);
    }
  } catch (err) {
    errors++;
    console.error(`Script #${count}: ERROR ->`, err.message);
  }
}

if (errors === 0) {
  console.log(`\nTODOS OS ${count} SCRIPTS DO INDEX.HTML ESTÃO 100% VÁLIDOS SEM ERROS DE SINTAXE!`);
} else {
  console.error(`\nFORAM ENCONTRADOS ${errors} ERROS NOS SCRIPTS!`);
}
