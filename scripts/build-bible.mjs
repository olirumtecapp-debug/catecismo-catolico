import fs from 'node:fs/promises';
import path from 'node:path';

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'biblia');
const BASE = 'https://raw.githubusercontent.com/Dancrf/biblia-db/main/';
const listUrl = BASE + 'listalivros.json';
const sleep = ms => new Promise(r => setTimeout(r, ms));

const OLD = new Set([
  'Gn','Ex','Lv','Nm','Dt','Js','Ju','Rt','1Sm','2Sm','1Rs','2Rs','1Pa','2Pa','Esd','Ne','Tob','Jdi','Est','Job','Ps','Pv','Ees','Cc','Sa','Eus','Is','Je','Lm','Ba','Ez','Dn','Os','Jl','Am','Ab','Jn','Mic','Na','Hc','So','Ag','Zc','Ml','1Ma','2Ma'
]);

function safeName(code){ return code.replaceAll('/','_').toLowerCase(); }
async function getJson(url){
  const res = await fetch(url, {headers:{'User-Agent':'CATECISMO-data-builder/1.0'}});
  if(!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res.json();
}

await fs.mkdir(OUT,{recursive:true});
const books = await getJson(listUrl);
await fs.writeFile(path.join(OUT,'listalivros.json'), JSON.stringify(books,null,2), 'utf8');

const errors=[];
for(let i=0;i<books.length;i++){
  const b=books[i];
  const folder=OLD.has(b.livro) ? 'antigotestamento' : 'novotestamento';
  const filename = safeName(b.livro) + '.json';
  const url=BASE+folder+'/'+encodeURIComponent(filename);
  try{
    const data=await getJson(url);
    await fs.writeFile(path.join(OUT,filename), JSON.stringify(data,null,2), 'utf8');
    console.log(`[${i+1}/${books.length}] ${b.livro} OK`);
  }catch(e){
    errors.push({livro:b.livro,error:String(e)});
    console.error(`[${i+1}/${books.length}] ${b.livro} FALHOU: ${e.message}`);
  }
  await sleep(60);
}
const report = {books: books.length, downloaded: books.length - errors.length, errors, generatedAt: new Date().toISOString()};
await fs.writeFile(path.join(OUT,'build-report.json'), JSON.stringify(report,null,2));
if(errors.length) process.exitCode=2;
