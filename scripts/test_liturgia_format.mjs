import fs from 'fs';

const bookAbbrMap = {
  'Gênesis': 'Gn', 'Genesis': 'Gn', 'Êxodo': 'Ex', 'Exodo': 'Ex', 'Levítico': 'Lv', 'Levitico': 'Lv',
  'Números': 'Nm', 'Numeros': 'Nm', 'Deuteronômio': 'Dt', 'Deuteronomio': 'Dt', 'Josué': 'Js', 'Josue': 'Js',
  'Juízes': 'Jz', 'Juizes': 'Jz', 'Rute': 'Rt', '1 Samuel': '1Sm', '2 Samuel': '2Sm', '1 Reis': '1Rs', '2 Reis': '2Rs',
  '1 Crônicas': '1Cr', '2 Crônicas': '2Cr', 'Esdras': 'Esd', 'Neemias': 'Ne', 'Tobias': 'Tb', 'Judite': 'Jdt', 'Ester': 'Est',
  '1 Macabeus': '1Mc', '2 Macabeus': '2Mc', 'Jó': 'Jó', 'Salmos': 'Sl', 'Salmo': 'Sl', 'Provérbios': 'Pr', 'Proverbios': 'Pr',
  'Eclesiastes': 'Ecl', 'Qohelet': 'Ecl', 'Cântico dos Cânticos': 'Ct', 'Cantico dos Canticos': 'Ct', 'Sabedoria': 'Sb',
  'Eclesiástico': 'Eclo', 'Eclesiastico': 'Eclo', 'Sirácida': 'Eclo', 'Isaías': 'Is', 'Isaias': 'Is', 'Jeremias': 'Jr',
  'Lamentações': 'Lm', 'Lamentacoes': 'Lm', 'Baruc': 'Br', 'Ezequiel': 'Ez', 'Daniel': 'Dn', 'Oseias': 'Os', 'Joel': 'Jl',
  'Amós': 'Am', 'Amos': 'Am', 'Abdias': 'Ab', 'Jonas': 'Jn', 'Miqueias': 'Mq', 'Naum': 'Na', 'Habacuc': 'Hab', 'Sofonias': 'Sf',
  'Ageu': 'Ag', 'Zacarias': 'Zc', 'Malaquias': 'Ml', 'Mateus': 'Mt', 'São Mateus': 'Mt', 'Marcos': 'Mc', 'São Marcos': 'Mc',
  'Lucas': 'Lc', 'São Lucas': 'Lc', 'João': 'Jo', 'São João': 'Jo', 'Atos': 'At', 'Atos dos Apóstolos': 'At', 'Romanos': 'Rm',
  '1 Coríntios': '1Cor', '2 Coríntios': '2Cor', 'Gálatas': 'Gl', 'Galatas': 'Gl', 'Efésios': 'Ef', 'Efesios': 'Ef',
  'Filipenses': 'Fl', 'Colossenses': 'Cl', '1 Tessalonicenses': '1Ts', '2 Tessalonicenses': '2Ts',
  '1 Timóteo': '1Tm', '2 Timóteo': '2Tm', 'Tito': 'Tt', 'Filêmon': 'Fm', 'Filemon': 'Fm', 'Hebreus': 'Hb',
  'Tiago': 'Tg', '1 Pedro': '1Pd', '2 Pedro': '2Pd', '1 João': '1Jo', '2 João': '2Jo', '3 João': '3Jo', 'Judas': 'Jd', 'Apocalipse': 'Ap'
};

function formatReference(rawRef, kind) {
  if (!rawRef) return '';
  let ref = rawRef.trim();
  // e.g. "Eclesiastes,3,1-11" -> "Ecl 3,1-11"
  // e.g. "Evangelho de Jesus Cristo segundo São Lucas 9, 18-22" -> "Lc 9,18-22"
  // e.g. "Salmo 143 (144)" -> "Sl 143(144)"
  
  if (kind === 'evangelho') {
    const match = ref.match(/(Lucas|Mateus|Marcos|João)[\s,]+(\d+)[\s,]+([\d\-–.,\s]+)/i);
    if (match) {
      const book = bookAbbrMap[match[1]] || match[1];
      const chap = match[2];
      const verses = match[3].replace(/\s+/g, '');
      return `${book} ${chap},${verses}`;
    }
  }
  
  if (kind === 'salmo') {
    return ref.replace(/^Salmo\s+/i, 'Sl ');
  }
  
  // Standard reading
  const parts = ref.split(/[,:]/);
  if (parts.length >= 2) {
    const rawBook = parts[0].trim();
    const book = bookAbbrMap[rawBook] || rawBook;
    const rest = parts.slice(1).join(',').replace(/\s+/g, '');
    return `${book} ${rest}`;
  }
  return ref;
}

function getReadingIntro(rawRef) {
  if (!rawRef) return '';
  const firstWord = rawRef.split(/[,:\s]/)[0].trim();
  const bookName = Object.keys(bookAbbrMap).find(k => k.toLowerCase() === firstWord.toLowerCase()) || firstWord;
  
  const cartas = ['Romanos', 'Coríntios', 'Gálatas', 'Efésios', 'Filipenses', 'Colossenses', 'Tessalonicenses', 'Timóteo', 'Tito', 'Filêmon', 'Filemon', 'Hebreus', 'Tiago', 'Pedro', 'João', 'Judas'];
  const profetas = ['Isaías', 'Jeremias', 'Baruc', 'Ezequiel', 'Daniel', 'Oseias', 'Joel', 'Amós', 'Abdias', 'Jonas', 'Miqueias', 'Naum', 'Habacuc', 'Sofonias', 'Ageu', 'Zacarias', 'Malaquias'];
  
  if (cartas.some(c => bookName.includes(c))) {
    if (bookName.includes('Hebreus')) return 'Leitura da Carta aos Hebreus.';
    return `Leitura da Carta de São Paulo aos ${bookName}.`;
  }
  if (profetas.some(p => bookName.includes(p))) {
    return `Leitura do Livro do Profeta ${bookName}.`;
  }
  if (bookName.includes('Atos')) return 'Leitura dos Atos dos Apóstolos.';
  if (bookName.includes('Apocalipse')) return 'Leitura do Livro do Apocalipse de São João.';
  return `Leitura do Livro do ${bookName}.`;
}

function formatVersesHtml(text) {
  if (!text) return '';
  let clean = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  // Converte números de versículos no texto (ex: "1Tudo" -> "<b>1</b> Tudo", " 18Jesus" -> " <b>18</b> Jesus")
  clean = clean.replace(/(^|[\s:;.,])(\d+)(['"“‘]?)([a-zA-ZÀ-ÿ])/gu, (match, prefix, num, quote, letter) => {
    if (num.length >= 4) return match;
    const q = quote ? quote : '';
    return `${prefix}<strong class="liturgical-verse-num">${num}</strong> ${q}${letter}`;
  });
  clean = clean.replace(/(^|[\s:;.,])(\d+)(\s+)(['"“‘]?)([a-zA-ZÀ-ÿ])/gu, (match, prefix, num, space, quote, letter) => {
    if (num.length >= 4) return match;
    const q = quote ? quote : '';
    return `${prefix}<strong class="liturgical-verse-num">${num}</strong> ${q}${letter}`;
  });
  return clean;
}

function formatUnifiedCommentary(extraArray) {
  if (!Array.isArray(extraArray) || extraArray.length === 0) return null;
  
  let raw = extraArray.join('\n');
  
  // Extract author from <b>...</b>
  let author = '';
  const authorMatch = raw.match(/<b>\s*([\s\S]*?)\s*<\/b>/i);
  if (authorMatch) {
    author = authorMatch[1].replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim();
    raw = raw.replace(/<b>[\s\S]*?<\/b>/i, '');
  }
  
  // Typo corrections from scraped source
  raw = raw
    .replace(/\bPesia\b/g, 'Poesia')
    .replace(/\batrirei\b/g, 'atrairei')
    .replace(/\bconnoco\b/g, 'conosco');
    
  // Clean tags and split lines
  const rawLines = raw.split(/<br\s*\/?>|\n/)
    .map(l => l.replace(/<[^>]*>/g, '').trim())
    .filter(Boolean);
    
  if (rawLines.length === 0 && !author) return null;
  
  // Header details (e.g. Poesia 52, biblical quotes)
  const headerLines = [];
  const bodyLines = [];
  let pastHeaders = false;
  
  for (const line of rawLines) {
    if (!pastHeaders && (line.startsWith('Poesia') || line.startsWith('«') || line.startsWith('Comentário sobre') || line.startsWith('Teólogo') || line.startsWith('O nosso título'))) {
      headerLines.push(line);
    } else {
      pastHeaders = true;
      bodyLines.push(line);
    }
  }
  
  const isPoem = bodyLines.length > 5 && bodyLines.slice(0, 5).every(l => l.length < 55);
  
  let bodyHtml = '';
  if (isPoem) {
    let currentStanza = [];
    const stanzas = [];
    for (const line of bodyLines) {
      currentStanza.push(line);
      if (currentStanza.length === 4) {
        stanzas.push(currentStanza.join('<br>'));
        currentStanza = [];
      }
    }
    if (currentStanza.length > 0) stanzas.push(currentStanza.join('<br>'));
    bodyHtml = stanzas.map(s => `<p class="italic pl-4 border-l-2 border-amber-400/60 my-3 leading-relaxed">${s}</p>`).join('\n');
  } else {
    bodyHtml = (bodyLines.length ? bodyLines : rawLines).map(p => `<p class="leading-relaxed my-2">${p}</p>`).join('\n');
  }
  
  return { author, headerLines, bodyHtml };
}

const d25 = JSON.parse(fs.readFileSync('D:/Catecismo/data/liturgia/2026/2026-09-25.json', 'utf8'));
const comm25 = formatUnifiedCommentary(d25.extra);
console.log('\n--- COMENTÁRIO 25/09 ---');
console.log('Autor:', comm25.author);
console.log('Headers:', comm25.headerLines);
console.log('Body HTML:\n', comm25.bodyHtml.slice(0, 350));

const d26 = JSON.parse(fs.readFileSync('D:/Catecismo/data/liturgia/2026/2026-09-26.json', 'utf8'));
const comm26 = formatUnifiedCommentary(d26.extra);
console.log('\n--- COMENTÁRIO 26/09 ---');
console.log('Autor:', comm26.author);
console.log('Headers:', comm26.headerLines);
console.log('Body HTML:\n', comm26.bodyHtml.slice(0, 260));

