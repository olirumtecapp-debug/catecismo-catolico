import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'santos');

const A12_BASE = 'https://www.a12.com/reze-no-santuario/santo-do-dia';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36';

const argv = process.argv.slice(2);
const yearArg = argv.find(a => /^\d{4}$/.test(a));
const year = Number(yearArg || new Date().getFullYear());
const dateIdx = argv.indexOf('--date');
const onlyDate = dateIdx >= 0 ? argv[dateIdx + 1] : null;
const force = argv.includes('--force');

const sleep = ms => new Promise(r => setTimeout(r, ms));
const pad = n => String(n).padStart(2,'0');
const isoDate = (y,m,d) => `${y}-${pad(m)}-${pad(d)}`;

function listDates(y) {
  const out = [];
  const d = new Date(Date.UTC(y,0,1));
  while (d.getUTCFullYear() === y) {
    out.push(isoDate(y, d.getUTCMonth()+1, d.getUTCDate()));
    d.setUTCDate(d.getUTCDate()+1);
  }
  return out;
}

function clean(v='') {
  return String(v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();
}

function absoluteUrl(href) {
  if (!href) return '';
  try { return new URL(href, 'https://www.a12.com').href; } catch { return ''; }
}

function imageUrl(src) {
  return absoluteUrl(src);
}

async function fetchHtml(url, attempts=3) {
  let last;
  for (let i=1; i<=attempts; i++) {
    try {
      const r = await fetch(url, {
        headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml' },
        redirect: 'follow'
      });
      const body = await r.text();
      if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
      return body;
    } catch (e) {
      last = e;
      if (i < attempts) await sleep(1200 * i);
    }
  }
  throw last;
}

function parseListPage(html, date) {
  const $ = cheerio.load(html);
  const links = [];
  $('.saints-list a[href]').each((_, el) => {
    const href = absoluteUrl($(el).attr('href'));
    if (href && !links.some(x => x === href)) links.push(href);
  });

  // The A12 date page commonly renders the selected day's profile directly.
  // If a list is present, use the linked profile pages; otherwise parse the page itself.
  const title = clean($('h1.feature__name').first().text());
  const image = imageUrl($('.feature .feature__portrait').first().attr('src') || '');
  const paragraphs = $('.wg-text p').map((_, el) => clean($(el).text())).get().filter(Boolean);

  return { links, title, image, paragraphs };
}

function classifyParagraphs($) {
  const root = $('.wg-text').first();
  const paragraphs = root.find('p').map((_, el) => ({
    text: clean($(el).text()),
    cls: clean($(el).attr('class') || ''),
    parent: clean($(el).parent().text() || '')
  })).get().filter(x => x.text);

  // Preserve source text in a structured form, but do not invent section labels.
  // The A12 scraper used by the referenced MIT API historically treats the final
  // reflection and prayer paragraphs specially. We expose the raw ordered paragraphs
  // and also derive best-effort fields.
  let reflection = '';
  let prayer = '';
  if (paragraphs.length >= 2) {
    const prayerIdx = paragraphs.length - 1;
    prayer = paragraphs[prayerIdx].text;
    const refIdx = paragraphs.length - 3 >= 0 ? paragraphs.length - 3 : Math.max(0, paragraphs.length - 2);
    reflection = paragraphs[refIdx].text;
  }

  const historyCandidates = paragraphs
    .slice(0, Math.max(0, paragraphs.length - 4))
    .map(x => x.text)
    .filter(Boolean);

  return {
    paragraphs: paragraphs.map(x => x.text),
    biographySourceText: historyCandidates.join('\n\n'),
    reflectionSourceText: reflection,
    prayerSourceText: prayer
  };
}

async function parseSaintPage(html, profileUrl, date) {
  const $ = cheerio.load(html);
  const name = clean($('h1.feature__name').first().text());
  const portrait = imageUrl($('.feature .feature__portrait').first().attr('src') || '');
  const location = clean(
    $('.feature .feature__location').first().text() ||
    $('.feature__location').first().text()
  );
  const data = classifyParagraphs($);

  if (!name) throw new Error('A12 não encontrou h1.feature__name');
  if (!data.paragraphs.length) throw new Error('A12 não encontrou texto do perfil');

  return {
    date,
    name,
    imageUrl: portrait,
    location: location || null,
    profileUrl,
    source: 'A12 — Portal A12',
    sourceUrl: profileUrl,
    // Source text is kept separately and explicitly attributed. If this database
    // is redistributed publicly, review permissions/copyright before publishing
    // verbatim source text.
    sourceText: {
      paragraphs: data.paragraphs,
      biography: data.biographySourceText,
      reflection: data.reflectionSourceText,
      prayer: data.prayerSourceText
    }
  };
}

async function loadDate(date) {
  const [y,m,d] = date.split('-').map(Number);
  const listUrl = `${A12_BASE}?day=${d}&month=${m}`;
  const listHtml = await fetchHtml(listUrl);
  const list = parseListPage(listHtml, date);

  if (list.links.length) {
    const results = [];
    for (const href of list.links.slice(0, 5)) {
      await sleep(300);
      try {
        results.push(await parseSaintPage(await fetchHtml(href), href, date));
      } catch (e) {
        console.warn(`WARN ${date} perfil ${href}: ${e.message}`);
      }
    }
    if (results.length) {
      return {
        date,
        year: y,
        month: m,
        day: d,
        source: 'A12 — Portal A12',
        calendarUrl: listUrl,
        saints: results
      };
    }
  }

  if (list.title) {
    return {
      date,
      year: y,
      month: m,
      day: d,
      source: 'A12 — Portal A12',
      calendarUrl: listUrl,
      saints: [await parseSaintPage(listHtml, listUrl, date)]
    };
  }

  throw new Error('A12 não encontrou santo/perfil para a data');
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const dates = onlyDate ? [onlyDate] : listDates(year);
  let ok=0, fail=0, skipped=0;

  for (const date of dates) {
    const targetDir = path.join(OUT, date.slice(0,4));
    const outPath = path.join(targetDir, `${date}.json`);
    if (!force) {
      try { await fs.access(outPath); skipped++; console.log(`SKIP ${date} (já existe)`); continue; }
      catch {}
    }
    try {
      const data = await loadDate(date);
      await fs.mkdir(targetDir, {recursive:true});
      await fs.writeFile(outPath, JSON.stringify(data, null, 2), 'utf8');
      ok++;
      console.log(`OK ${date}: ${data.saints.map(s=>s.name).join(' | ')}`);
    } catch (e) {
      fail++;
      await fs.mkdir(targetDir, {recursive:true});
      await fs.writeFile(
        path.join(targetDir, `debug-${date}.json`),
        JSON.stringify({date, error:e?.message || String(e), generatedAt:new Date().toISOString()}, null, 2),
        'utf8'
      );
      console.log(`FALHOU ${date}: ${e?.message || e}`);
    }
  }

  console.log(`\nConcluído: ${ok} gerados; ${skipped} preservados; ${fail} falhas.`);
  if (onlyDate) console.log(`Modo teste: ${onlyDate}`);
  if (fail) process.exitCode = 1;
}

main().catch(e => { console.error(e); process.exit(1); });
