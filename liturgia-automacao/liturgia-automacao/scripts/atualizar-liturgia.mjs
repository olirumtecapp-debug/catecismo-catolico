import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'liturgia');
const BUILDER = path.join(__dirname, 'build-liturgia.mjs');
const VALIDATOR = path.join(__dirname, 'verificar-liturgia.mjs');

const argv = process.argv.slice(2);
const has = flag => argv.includes(flag);
const valueOf = flag => {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : null;
};

function localYear(timeZone='America/Sao_Paulo') {
  return Number(new Intl.DateTimeFormat('en-US', { timeZone, year:'numeric' }).format(new Date()));
}
function expectedDayCount(year){
  const a=Date.UTC(year,0,1), b=Date.UTC(year+1,0,1);
  return Math.round((b-a)/86400000);
}
async function yearLooksComplete(year){
  const dir=path.join(OUT,String(year));
  try {
    const files=await fs.readdir(dir);
    const json=files.filter(f=>/^\d{4}-\d{2}-\d{2}\.json$/.test(f));
    return json.length===expectedDayCount(year);
  } catch { return false; }
}

function runNode(script,args=[]){
  return new Promise((resolve,reject)=>{
    const p=spawn(process.execPath,[script,...args],{cwd:ROOT,stdio:'inherit'});
    p.on('error',reject);
    p.on('close',code=> code===0 ? resolve() : reject(new Error(`${path.basename(script)} terminou com código ${code}`)));
  });
}

async function main(){
  const explicit=valueOf('--year');
  const current=localYear();
  const start=explicit ? Number(explicit) : current;
  if (!Number.isInteger(start) || start<2000 || start>2100) throw new Error('Ano inválido. Use --year 2027, por exemplo.');

  // Por padrão mantém a base atual íntegra e prepara o ano seguinte com antecedência.
  const targets = explicit ? [start] : [start, start+1];
  const force=has('--force');

  await fs.mkdir(OUT,{recursive:true});
  console.log(`Atualização Liturgia | ano local: ${current}`);
  console.log(`Alvos: ${targets.join(', ')}`);

  for(const year of targets){
    const complete=await yearLooksComplete(year);
    if(complete && !force){
      console.log(`SKIP ${year}: base completa, mantendo arquivos existentes.`);
      continue;
    }
    console.log(`\nBUILD ${year}: coletando fontes e gerando JSON...`);
    await runNode(BUILDER,[String(year),String(year)]);
  }

  console.log('\nVALIDANDO...');
  for(const year of targets){
    await runNode(VALIDATOR,[String(year)]);
  }
  console.log('\nAtualização concluída com validação OK.');
}

main().catch(e=>{ console.error(`\nERRO: ${e.message}`); process.exit(1); });
