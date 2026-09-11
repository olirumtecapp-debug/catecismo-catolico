import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const now = new Date();
const currentYear = now.getFullYear();
const years = [currentYear, currentYear + 1];

function run(script, year){
  return new Promise((resolve,reject)=>{
    const child = spawn(process.execPath, [path.join(__dirname, script), String(year)], {
      cwd: ROOT,
      stdio: 'inherit'
    });
    child.on('error', reject);
    child.on('close', code => code === 0 ? resolve() : reject(new Error(`${script} terminou com código ${code}`)));
  });
}

for (const year of years) {
  console.log(`\n=== SANTOS ${year} ===`);
  try {
    await run('verificar-santos.mjs', year);
    console.log(`Banco ${year} já está válido; preservado.`);
  } catch {
    console.log(`Banco ${year} ausente/inválido; gerando/atualizando...`);
    await run('build-santos.mjs', year);
    await run('verificar-santos.mjs', year);
  }
}

console.log('\nAtualização de Santos concluída.');
