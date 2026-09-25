
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'liturgia');

const API_BASE = 'https://api-liturgia-diaria.vercel.app/?date=';
const OSA_BASE = 'https://www.osabrasil.org/liturgia-diaria/';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36';

const argv = process.argv.slice(2);
const y = Number(argv[0] || new Date().getFullYear());
const endYear = Number(argv[1] || y);
const testIdx = argv.indexOf('--date');
const onlyDate = testIdx >= 0 ? argv[testIdx + 1] : null;

function pad(n){ return String(n).padStart(2,'0'); }
function isoDate(y,m,d){ return `${y}-${pad(m)}-${pad(d)}`; }
function listDates(year, endYear){
  const out=[];
  for(let yy=year; yy<=endYear; yy++){
    const d=new Date(Date.UTC(yy,0,1));
    while(d.getUTCFullYear()===yy){
      out.push(isoDate(yy,d.getUTCMonth()+1,d.getUTCDate()));
      d.setUTCDate(d.getUTCDate()+1);
    }
  }
  return out;
}

function decodeEntities(s){
  return s
    .replace(/&nbsp;/gi,' ')
    .replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'")
    .replace(/&apos;/gi,"'").replace(/&lt;/gi,'<').replace(/&gt;/gi,'>')
    .replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCharCode(parseInt(n,16)));
}

function htmlToText(html){
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi,' ')
      .replace(/<style[\s\S]*?<\/style>/gi,' ')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi,' ')
      .replace(/<br\s*\/?>/gi,'\n')
      .replace(/<\/p>/gi,'\n').replace(/<\/div>/gi,'\n')
      .replace(/<[^>]+>/g,' ')
  )
  .replace(/\r/g,'')
  .replace(/[ \t]+/g,' ')
  .replace(/\n[ \t]+/g,'\n')
  .replace(/\n{3,}/g,'\n\n')
  .trim();
}

function clean(s){
  return decodeEntities(s).replace(/\s+/g,' ').trim();
}

function normalizeRef(s){
  return clean(s)
    .replace(/(\d)\s*:\s*/g, '$1,')
    .replace(/,\s*/g, ',')
    .replace(/\s*-\s*/g,'-')
    .replace(/\s+/g,' ');
}

function extractSegment(text, starts, ends){
  let start=-1, startLabel='';
  for(const st of starts){
    const i=text.toLowerCase().indexOf(st.toLowerCase());
    if(i>=0 && (start<0 || i<start)){ start=i; startLabel=st; }
  }
  if(start<0) return null;
  let from=start+startLabel.length;
  let end=text.length;
  for(const en of ends){
    const i=text.toLowerCase().indexOf(en.toLowerCase(), from);
    if(i>=0 && i<end) end=i;
  }
  return text.slice(start,end).trim();
}

function parseOSA(html,date){
  const text=htmlToText(html);

  // More tolerant than CSS selectors: use the section labels rendered on the page.
  const first = extractSegment(text,
    ['Primeira Leitura (','Primeira Leitura'],
    ['Segunda Leitura (','Responsório ','Responsório','Salmo ','Evangelho (']);
  const second = extractSegment(text,
    ['Segunda Leitura (','Segunda Leitura'],
    ['Responsório ','Responsório','Evangelho (']);
  const psalm = extractSegment(text,
    ['Responsório Sl','Responsório','Salmo '],
    ['Evangelho (']);
  const gospel = extractSegment(text,
    ['Evangelho (','Evangelho'],
    ['— Palavra da Salvação','- Palavra da Salvação','Palavra da Salvação']);

  const ref=(seg,label)=>{
    if(!seg) return '';
    const m=seg.match(new RegExp(label.replace(/[()]/g,'\\$&')+'\\s*\\(([^)]+)\\)', 'i'));
    return m ? normalizeRef(m[1]) : '';
  };

  function bodyFromSegment(seg){
    if(!seg) return '';
    return clean(seg
      .replace(/^Primeira Leitura\s*\([^)]+\)\s*/i,'')
      .replace(/^Segunda Leitura\s*\([^)]+\)\s*/i,'')
      .replace(/^Responsório\s*[^-:]*\s*/i,'')
      .replace(/^Evangelho\s*\([^)]+\)\s*/i,'')
    );
  }

  const firstRef=(first?.match(/Primeira Leitura\s*\(([^)]+)\)/i)||[])[1] || '';
  const secondRef=(second?.match(/Segunda Leitura\s*\(([^)]+)\)/i)||[])[1] || '';
  const psalmRef=(psalm?.match(/(?:Responsório|Salmo)\s+([^(\n]+)?\s*\(([^)]+)\)/i)||[]);
  const gospelRef=(gospel?.match(/Evangelho\s*\(([^)]+)\)/i)||[])[1] || '';

  if(!first || !gospel) {
    const diagnostics = {
      date,
      sourceUrl: OSA_BASE+date,
      textStart: text.slice(0,2500),
      markers: {
        primeira: text.search(/Primeira Leitura/i),
        segunda: text.search(/Segunda Leitura/i),
        responsorio: text.search(/Responsório/i),
        salmo: text.search(/Salmo/i),
        evangelho: text.search(/Evangelho/i)
      }
    };
    throw new Error(`OSA não encontrou marcadores principais. Diagnóstico salvo em data/liturgia/debug-${date}.json`);
  }

  const titleMatch = text.match(/\b\d{1,2}\.[A-Za-zçãõéêáíóú]+.*?\|\s*(Domingo|Segunda-feira|Terça-feira|Quarta-feira|Quinta-feira|Sexta-feira|Sábado)/i);
  const heading = titleMatch ? clean(titleMatch[0]) : '';

  return {
    date,
    source: 'OSA Brasil',
    sourceUrl: OSA_BASE+date,
    heading,
    readings: {
      firstReading: { reference: normalizeRef(firstRef), text: bodyFromSegment(first) },
      psalm: { reference: normalizeRef(psalmRef[2] || psalmRef[1] || ''), text: bodyFromSegment(psalm) },
      secondReading: second ? { reference: normalizeRef(secondRef), text: bodyFromSegment(second) } : null,
      gospel: { reference: normalizeRef(gospelRef), text: bodyFromSegment(gospel) }
    }
  };
}

const LIRIO_BASE = 'https://www.liriocatolico.com.br/liturgia_diaria/dia/';

function lirioUrl(date){
  const [yy,mm,dd]=date.split('-');
  return `${LIRIO_BASE}${yy.slice(2)}/${Number(mm)}/${Number(dd)}/`;
}

async function parseLirio(html,date){
  const text=htmlToText(html);

  function findLineAfterLabel(label, stopPattern){
    const m=text.match(new RegExp(label+'[ \t]*[:]?\s*([^\r\n]+)', 'i'));
    if(!m) return '';
    const line=clean(m[1]);
    if(stopPattern && stopPattern.test(line)) return '';
    return line;
  }

  const titleMatch=text.match(/Liturgia Diária - ([^\n]+)\n\(([^\n]+)\)/i);
  const colorMatch=text.match(/Cor Litúrgica\s*:\s*([^\n]+)/i);

  // O Lírio publica as referências em uma única linha, separadas por "•".
  // Ex.: Mq 7,14-15.18-20 • Sl 102(103),1-2... • Lc 15,1-3.11-32
  const refsLabel=/Leituras\s*\(Referências bíblicas\)/i;
  const labelMatch=refsLabel.exec(text);
  let refs=[];
  if(labelMatch){
    const after=text.slice(labelMatch.index+labelMatch[0].length);
    const beforeFirst=after.match(/[:：]?[ \t]*([^\r\n]+)\r?\n?\s*PRIMEIRA LEITURA/i);
    const summaryLine=clean((beforeFirst?.[1]||after.split(/\r?\n/)[0]||'').replace(/^[:：]\s*/,''));
    refs=summaryLine.split(/\s*•\s*/).map(normalizeRef).filter(Boolean);
  }

  // Fallback caso o texto convertido perca a quebra de linha.
  if(refs.length < 3){
    const idx=labelMatch ? labelMatch.index : -1;
    const windowText=idx>=0 ? text.slice(idx, idx+1800) : text.slice(0,1800);
    const candidateLines=windowText.split(/\r?\n/).map(clean).filter(Boolean);
    for(const line of candidateLines){
      if(line.includes('•')){
        const parts=line.split(/\s*•\s*/).map(normalizeRef).filter(Boolean);
        if(parts.length>=3){ refs=parts; break; }
      }
    }
  }

  function section(startLabel, ends){
    const m=text.match(new RegExp(startLabel,'i'));
    if(!m) return '';
    const s=m.index;
    let e=text.length;
    for(const en of ends){
      const x=text.slice(s+m[0].length).search(new RegExp(en,'i'));
      if(x>=0) e=Math.min(e,s+m[0].length+x);
    }
    return text.slice(s,e).trim();
  }

  const first=section('PRIMEIRA LEITURA',['SALMO RESPONSORIAL','SEGUNDA LEITURA','ACLAMAÇÃO AO EVANGELHO','EVANGELHO']);
  const psalm=section('SALMO RESPONSORIAL',['SEGUNDA LEITURA','ACLAMAÇÃO AO EVANGELHO','EVANGELHO']);
  const second=section('SEGUNDA LEITURA',['ACLAMAÇÃO AO EVANGELHO','EVANGELHO']);
  const gospel=section('EVANGELHO',['Palavra da Salvação']);

  if(!first || !gospel){
    throw new Error(`Lírio não encontrou as seções principais (first=${!!first}, gospel=${!!gospel})`);
  }

  const hasSecond=/SEGUNDA LEITURA/i.test(text);
  const expected=hasSecond ? 4 : 3;

  // Releituras de referências também podem ser usadas quando o resumo tiver variações.
  if(refs.length < expected){
    const refPatterns=[
      /\b(?:Gn|Ex|Lv|Nm|Dt|Js|Jz|Rt|1Sm|2Sm|1Rs|2Rs|1Cr|2Cr|Esd|Ne|Tb|Jt|Est|1Mc|2Mc|Jó|Sl|Pr|Ecl|Ct|Is|Jr|Lm|Br|Ez|Dn|Os|Jl|Am|Ab|Jn|Mq|Na|Hab|Sf|Ag|Zc|Ml|Mt|Mc|Lc|Jo|At|Rm|1Cor|2Cor|Gl|Ef|Fl|Cl|1Ts|2Ts|1Tm|2Tm|Tt|Fm|Hb|Tg|1Pd|2Pd|1Jo|2Jo|3Jo|Jd|Ap)\s+[^•\n]+/gi
    ];
    const all=[];
    for(const rp of refPatterns){
      for(const m of text.slice(labelMatch?.index||0,(labelMatch?.index||0)+1800).matchAll(rp)) all.push(normalizeRef(m[0]));
    }
    refs=[...new Set(all)].slice(0,expected);
  }

  if(refs.length < expected){
    const diagnostics={
      date,
      url:lirioUrl(date),
      title:titleMatch?.[0]||'',
      refs,
      textAroundLabel: labelMatch ? text.slice(labelMatch.index, labelMatch.index+900) : text.slice(0,900)
    };
    throw new Error(`Lírio encontrou ${refs.length} referências no resumo; esperado pelo menos ${expected}. Diagnóstico: ${JSON.stringify(diagnostics)}`);
  }

  function stripSection(seg,label){
    if(!seg) return '';
    let s=seg.replace(new RegExp('^'+label+'\s*','i'),'').trim();
    // Remove título curto, linha de leitura/proclamação e imagens, preservando o texto bíblico.
    s=s.replace(/^Image:\s*[^\n]*\n?/i,'').trim();
    s=s.replace(/^(?:Lançará.*?\n)?Leitura[^\n]*\n/i,'').trim();
    s=s.replace(/^Proclamação[^\n]*\n/i,'').trim();
    return clean(s);
  }

  const acclSection=section('ACLAMAÇÃO AO EVANGELHO',['EVANGELHO']);
  let lirioAccl=null;
  if(acclSection){
    const aMatch=acclSection.match(/(?:℟|R\.)\s*(Aleluia[^\n℣]+)(?:[\s\S]*?[℣V]\.?\s*([^\n]+))?/i);
    if(aMatch){
      lirioAccl={
        title: clean(aMatch[1] || 'Aleluia, Aleluia, Aleluia.'),
        verse: clean(aMatch[2] || '')
      };
    }
  }
  let lirioRefrain='';
  const rMatch=psalm.match(/℟\.\s*([^0-9\n*†\r]+)/i) || psalm.match(/(?:^|\n)\s*(?:℟|R\.)\s*([^0-9\n*†\r]+)/i);
  if(rMatch){
    lirioRefrain=clean(rMatch[1]).replace(/^[—–-]\s*/, '').replace(/^(?:℟\.?|R\s*[:.\-])\s*/i, '').trim();
  }

  const gospelRef=refs[hasSecond?3:2]||'';
  return {
    date,
    source:'Lírio Católico / CNBB-Edições CNBB',
    sourceUrl:lirioUrl(date),
    heading:clean(titleMatch?.[1]||''),
    color:clean(colorMatch?.[1]||''),
    readings:{
      firstReading:{reference:refs[0]||'',text:stripSection(first,'PRIMEIRA LEITURA')},
      psalm:{reference:refs[1]||'',refrain:lirioRefrain,text:stripSection(psalm,'SALMO RESPONSORIAL')},
      secondReading:hasSecond ? {reference:refs[2]||'',text:stripSection(second,'SEGUNDA LEITURA')} : null,
      gospel:{reference:gospelRef,acclamation:lirioAccl,text:stripSection(gospel,'EVANGELHO')}
    },
    extra:[]
  };
}

async function fetchText(url){
  const r=await fetch(url,{headers:{'User-Agent':UA},redirect:'follow'});
  const body=await r.text();
  if(!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return body;
}

async function fetchApi(date){
  const r=await fetch(API_BASE+date,{headers:{'User-Agent':UA}});
  const txt=await r.text();
  if(!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  const j=JSON.parse(txt);
  if(!j?.today?.date) throw new Error('Resposta API sem today.date');
  return {api:j, date};
}

async function loadDate(date){
  let apiErr=null;
  try {
    const got=await fetchApi(date);
    const returned=got.api.today.date.split('/').reverse().join('-');
    if(returned===date) return buildFromApi(got.api,date);
    apiErr=`API retornou ${returned} em vez de ${date}`;
  } catch(e){ apiErr=e.message; }

  let lirioErr=null;
  try{
    const html=await fetchText(lirioUrl(date));
    return parseLirio(html,date);
  }catch(e){ lirioErr=e.message; }

  try {
    const html=await fetchText(OSA_BASE+date);
    return parseOSA(html,date);
  } catch(e){
    // Try a second OSA representation without JS-dependent route variation.
    let osaErr=e.message;
    try{
      const html=await fetchText(`https://osabrasil.org/liturgia-diaria/${date}`);
      return parseOSA(html,date);
    }catch(e2){ osaErr += `; domínio alternativo: ${e2.message}`; }
    throw new Error(`API: ${apiErr}; Lírio: ${lirioErr}; OSA: ${osaErr}`);
  }
}

function parseDatePt(s){
  const [d,m,y]=s.split('/');
  const mm=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'].indexOf(m.toLowerCase())+1;
  return mm ? `${y}-${pad(mm)}-${pad(d)}` : null;
}

function buildFromApi(j,date){
  const t=j.today;
  const r=t.readings||{};
  const normalizeText=v=>clean(v||'');
  const refFromTitle=v=>{
    const m=String(v||'').match(/:\s*([^:]+)$/);
    return m ? normalizeRef(m[1]) : '';
  };
  const cleanLeadingHyphen = v => clean(v || '').replace(/^[—–-]\s*/, '').trim();
  const cleanRefrain = v => clean(v || '').replace(/^(?:℟\.?|R\s*[:.\-])\s*/i, '').trim();

  const data = {
    date,
    source:'api-liturgia-diaria / Sagrada Liturgia',
    sourceUrl:t.source||`https://sagradaliturgia.com.br/`,
    heading:clean(String(t.entry_title||'').replace(/<[^>]+>/g,' ')),
    color:clean(t.color||''),
    readings:{
      firstReading:{
        reference:refFromTitle(r.first_reading?.title),
        intro:clean(r.first_reading?.head || ''),
        text:normalizeText(r.first_reading?.text)
      },
      psalm:{
        reference:clean(r.psalm?.title||''),
        refrain:cleanRefrain(r.psalm?.response || ''),
        text:(r.psalm?.content_psalm||[]).map(normalizeText).join('\n\n')
      },
      secondReading:r.second_reading ? {
        reference:refFromTitle(r.second_reading?.title),
        intro:clean(r.second_reading?.head || ''),
        text:normalizeText(r.second_reading?.text)
      } : null,
      gospel:{
        reference:clean(r.gospel?.head_title||''),
        intro:clean(r.gospel?.title || ''),
        acclamation:(r.gospel?.head_response || r.gospel?.head) ? {
          title: cleanLeadingHyphen(r.gospel?.head_response || 'Aleluia, Aleluia, Aleluia.'),
          verse: cleanLeadingHyphen(r.gospel?.head || '').replace(/;$/, '.')
        } : null,
        text:normalizeText(r.gospel?.text)
      }
    },
    extra:Array.isArray(t.extra)?t.extra.map(x=>clean(String(x))).filter(Boolean):[]
  };

  // A resposta da API pode existir, mas vir sem um texto essencial.
  // Nesses casos não aceitamos o registro como válido: loadDate()
  // cairá automaticamente para o Lírio Católico.
  const rr = data.readings;
  const missing = [];
  if(!nonEmpty(rr.firstReading?.reference) || !nonEmpty(rr.firstReading?.text)) missing.push('primeira leitura');
  if(!nonEmpty(rr.psalm?.reference) || !nonEmpty(rr.psalm?.text)) missing.push('salmo');
  if(!nonEmpty(rr.gospel?.reference) || !nonEmpty(rr.gospel?.text)) missing.push('evangelho');
  if(missing.length) throw new Error(`API retornou conteúdo incompleto: ${missing.join(', ')}`);

  return data;
}

function nonEmpty(v){ return typeof v === 'string' && v.trim().length > 0; }

async function main(){
  await fs.mkdir(OUT,{recursive:true});
  const dates=onlyDate?[onlyDate]:listDates(y,endYear);
  let ok=0, fail=0, api=0, osa=0, lirio=0;
  const CONCURRENCY = onlyDate ? 1 : 6;
  let cursor = 0;

  async function worker(){
    while(cursor < dates.length){
      const date = dates[cursor++];
      try{
        const data=await loadDate(date);
        const outPath=path.join(OUT, date.slice(0,4), `${date}.json`);
        await fs.mkdir(path.dirname(outPath),{recursive:true});
        await fs.writeFile(outPath, JSON.stringify(data,null,2),'utf8');
        ok++;
        if(data.source.startsWith('api-')) api++;
        else if(data.source.startsWith('Lírio')) lirio++;
        else osa++;
        console.log(`OK ${date} (${data.source}) [${ok + fail}/${dates.length}]`);
      }catch(e){
        fail++;
        const msg=e.message;
        console.log(`FALHOU ${date}: ${msg}`);
        await fs.mkdir(path.join(OUT,date.slice(0,4)),{recursive:true});
        await fs.writeFile(path.join(OUT, date.slice(0,4), `debug-${date}.json`), JSON.stringify({
          date, error:msg, generatedAt:new Date().toISOString()
        },null,2),'utf8');
      }
    }
  }

  await Promise.all(Array.from({length: CONCURRENCY}, () => worker()));

  console.log(`\nConcluído: ${ok} registros OK; ${fail} falhas.`);
  console.log(`API: ${api}; Lírio: ${lirio}; OSA: ${osa}.`);
  if(onlyDate) console.log(`Modo teste: ${onlyDate}`);
}
main().catch(e=>{console.error(e);process.exit(1);});
