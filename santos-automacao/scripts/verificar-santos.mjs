import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'santos');

const argv = process.argv.slice(2);
const yearArg = argv.find(a => /^\d{4}$/.test(a));
const year = Number(yearArg || new Date().getFullYear());

function pad(n){ return String(n).padStart(2,'0'); }
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

const dates=expectedDates(year);
let ok=0, fail=0;
const problems=[];

for(const date of dates){
  const file=path.join(OUT,String(year),`${date}.json`);
  try{
    const j=JSON.parse(await fs.readFile(file,'utf8'));
    const saints=Array.isArray(j?.saints) ? j.saints : [];
    const issues=[];
    if(j?.date !== date) issues.push(`date inválida (${j?.date ?? 'ausente'})`);
    if(!nonEmpty(j?.source)) issues.push('source ausente');
    if(!saints.length) issues.push('nenhum santo encontrado');
    saints.forEach((s,i)=>{
      if(!nonEmpty(s?.name)) issues.push(`santo ${i+1}: nome ausente`);
      if(!nonEmpty(s?.profileUrl)) issues.push(`santo ${i+1}: profileUrl ausente`);
      if(!nonEmpty(s?.sourceUrl)) issues.push(`santo ${i+1}: sourceUrl ausente`);
      if(s?.sourceText && !Array.isArray(s.sourceText.paragraphs)) issues.push(`santo ${i+1}: paragraphs inválidos`);
    });
    if(issues.length){ fail++; problems.push({date,issues}); }
    else ok++;
  }catch(e){
    fail++;
    problems.push({date,issues:[e.code==='ENOENT'?'arquivo ausente':`arquivo inválido: ${e.message}`]});
  }
}

console.log(`\nValidação Santos ${year}`);
console.log(`Esperados: ${dates.length}`);
console.log(`OK: ${ok}`);
console.log(`Problemas: ${fail}`);
if(problems.length){
  console.log('\nProblemas encontrados:');
  for(const p of problems) console.log(`- ${p.date}: ${p.issues.join('; ')}`);
  process.exitCode=1;
}else{
  console.log('VALIDAÇÃO OK: todas as datas possuem pelo menos um perfil de santo e fonte identificada.');
}
