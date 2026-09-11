import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'santos');
const LITURGIA = path.join(ROOT, 'data', 'liturgia');

const VATICAN_BASE = 'https://www.vaticannews.va/pt/santo-do-dia';
const A12_BASE = 'https://www.a12.com/reze-no-santuario/santo-do-dia';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36';

const argv = process.argv.slice(2);
const yearArg = argv.find(a => /^\d{4}$/.test(a));
const year = Number(yearArg || new Date().getFullYear());
const dateIdx = argv.indexOf('--date');
const onlyDate = dateIdx >= 0 ? argv[dateIdx + 1] : null;
const force = argv.includes('--force');
const noA12 = argv.includes('--no-a12');

const sleep = ms => new Promise(r => setTimeout(r, ms));
const pad = n => String(n).padStart(2, '0');
const isoDate = (y,m,d) => `${y}-${pad(m)}-${pad(d)}`;

function listDates(y) {
  const out=[]; const d=new Date(Date.UTC(y,0,1));
  while (d.getUTCFullYear()===y) { out.push(isoDate(y,d.getUTCMonth()+1,d.getUTCDate())); d.setUTCDate(d.getUTCDate()+1); }
  return out;
}
function clean(v='') { return String(v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim(); }
function normalizeName(v='') {
  return clean(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/^s\.?\s+/i,'').replace(/^sta\.?\s+/i,'').replace(/^st\.?\s+/i,'')
    .replace(/^santo\s+/i,'sao ').replace(/^santa\s+/i,'santa ')
    .replace(/\bvirgem\b|\bmartires?\b|\breligiosas?\b|\breligiosos?\b|\bduquesa da silesia\b|\bda ordem .+$/gi,'')
    .replace(/\s+/g,' ').replace(/[,.]+$/g,'').trim();
}
function abs(href,base) { try { return href ? new URL(href,base).href : ''; } catch { return ''; } }
async function fetchHtml(url,attempts=3) {
  let last;
  for(let i=1;i<=attempts;i++){
    try{
      const r=await fetch(url,{headers:{'User-Agent':UA,Accept:'text/html,application/xhtml+xml'},redirect:'follow'});
      const body=await r.text(); if(!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`); return body;
    }catch(e){ last=e; if(i<attempts) await sleep(1000*i); }
  }
  throw last;
}
function parts(date){ const [year,month,day]=date.split('-').map(Number); return {year,month,day}; }

async function loadLocalLiturgy(date){
  const file=path.join(LITURGIA,date.slice(0,4),`${date}.json`);
  try{return JSON.parse(await fs.readFile(file,'utf8'));}catch{return null;}
}
function extractLiturgicalCelebration(liturgy,date){
  if(!liturgy || typeof liturgy!=='object') return null;
  const candidates=[liturgy.celebration,liturgy.celebrationName,liturgy.liturgicalCelebration,liturgy.liturgicalTitle,liturgy.feast,liturgy.feastName,liturgy.title];
  for(const c of candidates){
    if(typeof c==='string' && clean(c)) return {name:clean(c),source:'Liturgia local',sourceFile:`data/liturgia/${date.slice(0,4)}/${date}.json`};
    if(c && typeof c==='object' && typeof c.name==='string' && clean(c.name)) return {...c,source:c.source||'Liturgia local',sourceFile:c.sourceFile||`data/liturgia/${date.slice(0,4)}/${date}.json`};
  }
  return null;
}

function parseVaticanPage(html,date){
  const $=cheerio.load(html); const saints=[];
  $('.section.section--evidence.section--isStatic').each((_,section)=>{
    const $s=$(section); let name=clean($s.find('.section__head h2').first().text()); if(!name)return;
    if(/^S\.\s+Edviges\b/i.test(name)) name=name.replace(/^S\.\s+/i,'Santa ');
    else if(/^S\.\s+(Margarida Maria Alacoque)\b/i.test(name)) name=name.replace(/^S\.\s+/i,'Santa ');
    else if(/^S\.\s+(Geraldo Majella)\b/i.test(name)) name=name.replace(/^S\.\s+/i,'São ');
    else if(/^S\.\s+/.test(name)) name=name.replace(/^S\.\s+/,/\b(virgem|religiosa|freira|duquesa|rainha|abadessa|madre)\b/i.test(name)?'Santa ':'São ');
    const profileHref=abs($s.find('a.saintReadMore[href]').first().attr('href'),'https://www.vaticannews.va');
    const img=$s.find('img[data-original]').first().attr('data-original') || $s.find('img[src]').first().attr('src') || '';
    saints.push({date,name,normalizedName:normalizeName(name),imageUrl:abs(img,'https://www.vaticannews.va'),profileUrl:profileHref||null,source:'Vatican News',sourceUrl:profileHref||null,sourceText:clean($s.find('.section__content p').first().text())||null});
  });
  return {date,calendarUrl:`${VATICAN_BASE}/${date.slice(5,7)}/${date.slice(8,10)}.html`,saints};
}
async function loadVaticanDate(date){
  const {month,day}=parts(date); const url=`${VATICAN_BASE}/${pad(month)}/${pad(day)}.html`;
  const p=parseVaticanPage(await fetchHtml(url),date); if(!p.saints.length) throw new Error('Vatican News não encontrou santos para a data');
  return {...p,source:'Vatican News'};
}

function parseA12ListPage(html){
  const $=cheerio.load(html);
  const title=clean($('h1.feature__name').first().text());
  const img=$('.feature .feature__portrait').first().attr('src')||'';
  const paragraphs=$('.wg-text p').map((_,e)=>clean($(e).text())).get().filter(Boolean);
  return {title,imageUrl:abs(img,'https://www.a12.com'),paragraphs};
}
async function loadA12ForDate(date){
  const {month,day}=parts(date); const url=`${A12_BASE}?day=${day}&month=${month}`; const p=parseA12ListPage(await fetchHtml(url));
  if(!p.title)return [];
  return [{date,name:p.title,normalizedName:normalizeName(p.title),imageUrl:p.imageUrl||null,profileUrl:url,source:'A12 — Portal A12',sourceUrl:url,sourceText:{paragraphs:p.paragraphs}}];
}
function enrichSaints(v,a){
  return v.map(s=>{ const t=normalizeName(s.name); const m=a.find(x=>normalizeName(x.name)===t || normalizeName(x.name).startsWith(t+' ') || t.startsWith(normalizeName(x.name)+' '));
    if(!m)return {...s,enrichment:{a12Found:false}};
    return {...s,imageUrl:s.imageUrl||m.imageUrl||null,a12:{profileUrl:m.profileUrl||null,source:m.source,sourceUrl:m.sourceUrl,sourceText:m.sourceText},enrichment:{a12Found:true}};
  });
}
async function loadDate(date){
  const {year,month,day}=parts(date);
  const [v,l,a]=await Promise.all([loadVaticanDate(date),loadLocalLiturgy(date),noA12?Promise.resolve([]):loadA12ForDate(date).catch(e=>{console.warn(`WARN A12 ${date}: ${e.message}`);return[];})]);
  return {date,year,month,day,source:'Vatican News',calendarUrl:v.calendarUrl,liturgicalCelebration:extractLiturgicalCelebration(l,date),methodology:{primarySaintSource:'Vatican News',enrichmentSource:noA12?null:'A12 — Portal A12',liturgySource:l?`data/liturgia/${year}/${date}.json`:null,rule:'A celebração litúrgica e a lista de santos são dados distintos. Vatican News define os santos associados à data; a Liturgia local define a celebração quando o JSON possui campo explícito; o A12 apenas enriquece perfis.'},saints:enrichSaints(v.saints,a)};
}
async function main(){
  await fs.mkdir(OUT,{recursive:true}); const dates=onlyDate?[onlyDate]:listDates(year); let ok=0,fail=0,skipped=0,withLiturgy=0;
  for(const date of dates){
    const dir=path.join(OUT,date.slice(0,4)), out=path.join(dir,`${date}.json`);
    if(!force){try{await fs.access(out);skipped++;console.log(`SKIP ${date} (já existe)`);continue;}catch{}}
    try{const data=await loadDate(date); await fs.mkdir(dir,{recursive:true}); await fs.writeFile(out,JSON.stringify(data,null,2),'utf8'); ok++; if(data.liturgicalCelebration)withLiturgy++; console.log(`OK ${date}: ${data.saints.map(s=>s.name).join(' | ')}`);}
    catch(e){fail++; const dir2=path.join(OUT,date.slice(0,4)); await fs.mkdir(dir2,{recursive:true}); await fs.writeFile(path.join(dir2,`debug-${date}.json`),JSON.stringify({date,error:e?.message||String(e),generatedAt:new Date().toISOString()},null,2),'utf8'); console.log(`FALHOU ${date}: ${e?.message||e}`);}
  }
  console.log(`\nConcluído: ${ok} gerados; ${skipped} preservados; ${fail} falhas.`); console.log(`Liturgia associada por campo explícito: ${withLiturgy}`); if(onlyDate)console.log(`Modo teste: ${onlyDate}`); if(fail)process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exit(1);});
