import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'liturgia');

const argv = process.argv.slice(2);
const yearArg = argv.find(a => /^--year=\d{4}$/.test(a));
const year = Number(yearArg ? yearArg.split('=')[1] : (argv[0] || new Date().getFullYear()));

function pad(n){ return String(n).padStart(2, '0'); }
function isoDate(y,m,d){ return `${y}-${pad(m)}-${pad(d)}`; }
function expectedDates(y){
  const dates=[];
  const d=new Date(Date.UTC(y,0,1));
  while(d.getUTCFullYear()===y){
    dates.push(isoDate(y,d.getUTCMonth()+1,d.getUTCDate()));
    d.setUTCDate(d.getUTCDate()+1);
  }
  return dates;
}

function nonEmpty(v){ return typeof v === 'string' && v.trim().length > 0; }

const dates = expectedDates(year);
let ok = 0;
let fail = 0;
const problems = [];
const sources = new Map();

for (const date of dates) {
  const file = path.join(OUT, String(year), `${date}.json`);
  try {
    const raw = await fs.readFile(file, 'utf8');
    const j = JSON.parse(raw);
    const r = j?.readings;
    const issues = [];
    if (j?.date !== date) issues.push(`date inválida (${j?.date ?? 'ausente'})`);
    if (!nonEmpty(j?.source)) issues.push('source ausente');
    // heading é opcional: algumas fontes não fornecem título/heading separado.
    if (!r || !nonEmpty(r?.firstReading?.reference) || !nonEmpty(r?.firstReading?.text)) issues.push('primeira leitura incompleta');
    if (!r || !nonEmpty(r?.psalm?.reference) || !nonEmpty(r?.psalm?.text)) issues.push('salmo incompleto');
    if (!r || !nonEmpty(r?.gospel?.reference) || !nonEmpty(r?.gospel?.text)) issues.push('evangelho incompleto');
    if (r?.secondReading !== null && r?.secondReading !== undefined) {
      if (!nonEmpty(r?.secondReading?.reference) || !nonEmpty(r?.secondReading?.text)) issues.push('segunda leitura incompleta');
    }
    if (issues.length) {
      fail++;
      problems.push({date, issues});
      continue;
    }
    ok++;
    sources.set(j.source, (sources.get(j.source) || 0) + 1);
  } catch (e) {
    fail++;
    problems.push({date, issues:[e.code === 'ENOENT' ? 'arquivo ausente' : `arquivo inválido: ${e.message}`]});
  }
}

console.log(`\nValidação Liturgia ${year}`);
console.log(`Esperados: ${dates.length}`);
console.log(`OK: ${ok}`);
console.log(`Problemas: ${fail}`);
for (const [source,count] of sources) console.log(`Fonte: ${source} = ${count}`);
if (problems.length) {
  console.log('\nProblemas encontrados:');
  for (const p of problems) console.log(`- ${p.date}: ${p.issues.join('; ')}`);
  process.exitCode = 1;
} else {
  console.log('VALIDAÇÃO OK: todos os dias possuem estrutura mínima válida.');
}
