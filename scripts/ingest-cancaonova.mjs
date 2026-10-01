/**
 * scripts/ingest-cancaonova.mjs
 * Baixa todos os 365 dias da liturgia do ano diretamente do portal oficial Canção Nova.
 * Usa o endpoint oficial do calendário (widget-ajax) para obter as URLs exatas de cada dia.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'liturgia');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36';

export async function fetchMonthLinks(year, month) {
  const form = new URLSearchParams();
  form.append('action', 'widget-ajax');
  form.append('sMes', String(month));
  form.append('sAno', String(year));
  form.append('title', '');
  form.append('type', 'liturgia');
  form.append('ajax', 'true');

  const res = await fetch('https://liturgia.cancaonova.com/wp-admin/admin-ajax.php', {
    method: 'POST',
    headers: {
      'User-Agent': UA,
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: form
  });

  const html = await res.text();
  const $ = cheerio.load(html);
  const links = [];

  $('a[href*="/liturgia/"]').each((_, el) => {
    const day = Number($(el).text().trim());
    const href = $(el).attr('href');
    if (day && href) {
      const padM = String(month).padStart(2, '0');
      const padD = String(day).padStart(2, '0');
      links.push({ date: `${year}-${padM}-${padD}`, url: href });
    }
  });

  return links.sort((a, b) => a.date.localeCompare(b.date));
}

export function parseCancaoNovaHtml(html, date, url) {
  const $ = cheerio.load(html);

  const heading = $('h1').text().replace(/Canção Nova\s*-\s*Liturgia Diária/i, '').trim().replace(/\s+/g, ' ');

  const paragraphs = [];
  $('.entry-content p').each((_, el) => {
    const t = $(el).text().trim();
    if (t.length > 0 && !t.startsWith('CMS gerado') && !t.startsWith('Conferência Nacional') && !t.startsWith('Com o aplicativo') && !t.startsWith('[:pb]') && !t.startsWith('R$') && !t.startsWith('0%')) {
      paragraphs.push(t);
    }
  });

  let firstReading = null;
  let psalm = null;
  let secondReading = null;
  let gospel = null;

  let currentSection = null;
  let currentLines = [];

  function commitSection() {
    if (!currentSection) return;
    const text = currentLines.join('\n\n').trim();
    if (currentSection.type === '1L') {
      firstReading = { reference: currentSection.ref, text };
    } else if (currentSection.type === '2L') {
      secondReading = { reference: currentSection.ref, text };
    } else if (currentSection.type === 'SL') {
      psalm = { reference: currentSection.ref, refrain: currentSection.refrain || '', text };
    } else if (currentSection.type === 'EV') {
      gospel = {
        reference: currentSection.ref,
        acclamation: currentSection.acclamation,
        text
      };
    }
    currentSection = null;
    currentLines = [];
  }

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];

    const m1 = p.match(/^Primeira Leitura\s*\(([^)]+)\)/i);
    if (m1) {
      commitSection();
      currentSection = { type: '1L', ref: m1[1].trim() };
      continue;
    }

    const m2 = p.match(/^Segunda Leitura\s*\(([^)]+)\)/i);
    if (m2) {
      commitSection();
      currentSection = { type: '2L', ref: m2[1].trim() };
      continue;
    }

    const ms = p.match(/^Respons[óo]rio\s+(?:Sl\s+)?([^\n(]+(?:\([^)]+\))?[^\n]*)/i);
    if (ms) {
      commitSection();
      let ref = ms[1].trim();
      if (!/^Sl\s/i.test(ref)) ref = 'Sl ' + ref;
      currentSection = { type: 'SL', ref, refrain: '' };
      continue;
    }

    const me = p.match(/^Evangelho\s*\(([^)]+)\)/i);
    if (me) {
      commitSection();
      currentSection = { type: 'EV', ref: me[1].trim(), acclamation: null };
      continue;
    }

    if (!currentSection) continue;

    if (/^[—–-]\s*Palavra d[ao] (?:Senhor|Salvação)\.?$/i.test(p) || /^[—–-]\s*Graças a Deus\.?$/i.test(p) || /^[—–-]\s*Glória a vós,\s*Senhor\.?$/i.test(p)) {
      continue;
    }

    if (currentSection.type === '1L' || currentSection.type === '2L') {
      if (/^Leitura d[oa]/i.test(p)) continue;
      currentLines.push(p);
    } else if (currentSection.type === 'SL') {
      if (/^[—–-]\s*/.test(p)) {
        const cleanP = p.replace(/^[—–-]\s*/, '').trim();
        if (!currentSection.refrain) {
          currentSection.refrain = cleanP;
        } else if (cleanP === currentSection.refrain) {
          continue;
        } else {
          currentLines.push(cleanP);
        }
      } else {
        currentLines.push(p);
      }
    } else if (currentSection.type === 'EV') {
      if (/^[—–-]?\s*Aleluia/i.test(p)) {
        const title = p.replace(/^[—–-]\s*/, '').trim();
        const nextP = paragraphs[i + 1] || '';
        let verse = '';
        if (nextP && !nextP.startsWith('Proclamação')) {
          verse = nextP.replace(/^[—–-]\s*/, '').trim();
          i++;
        }
        currentSection.acclamation = { title, verse };
        continue;
      }
      if (/^Proclamação do Evangelho/i.test(p)) continue;
      currentLines.push(p);
    }
  }
  commitSection();

  return {
    date,
    source: 'Canção Nova',
    sourceUrl: url,
    heading,
    color: '',
    readings: {
      firstReading,
      psalm,
      secondReading,
      gospel
    },
    extra: []
  };
}

async function main() {
  const year = Number(process.argv[2] || 2026);
  const targetDir = path.join(OUT, String(year));
  await fs.mkdir(targetDir, { recursive: true });

  console.log(`\n=== INGESTÃO CANÇÃO NOVA ${year} ===`);
  console.log('Obtendo links de todos os meses...');
  
  const allLinks = [];
  for (let m = 1; m <= 12; m++) {
    const monthLinks = await fetchMonthLinks(year, m);
    console.log(`Mês ${m}: ${monthLinks.length} dias`);
    allLinks.push(...monthLinks);
  }

  console.log(`\nTotal de dias encontrados: ${allLinks.length}`);
  if (allLinks.length === 0) {
    console.log(`Canção Nova ainda não possui calendário publicado para ${year}.`);
    return;
  }

  // Baixar e salvar em lote com concorrência
  const CONCURRENCY = 6;
  let cursor = 0;
  let ok = 0, fail = 0;

  async function worker() {
    while (cursor < allLinks.length) {
      const idx = cursor++;
      const item = allLinks[idx];
      try {
        const res = await fetch(item.url, { headers: { 'User-Agent': UA } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        const data = parseCancaoNovaHtml(html, item.date, item.url);
        
        // Validação mínima
        if (!data.readings.firstReading?.text || !data.readings.gospel?.text) {
          throw new Error('Conteúdo incompleto ao processar HTML');
        }

        const dest = path.join(targetDir, `${item.date}.json`);
        await fs.writeFile(dest, JSON.stringify(data, null, 2), 'utf8');
        ok++;
        process.stdout.write(`\rProgresso: ${ok}/${allLinks.length} [OK: ${item.date}]     `);
      } catch (e) {
        fail++;
        console.error(`\nErro em ${item.date} (${item.url}): ${e.message}`);
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  console.log(`\n\nConcluído Canção Nova ${year}: ${ok} salvos, ${fail} falhas.`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
