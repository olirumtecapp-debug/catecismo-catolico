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
  const abbrToName = {
    'Gn': 'Gênesis', 'Ex': 'Êxodo', 'Lv': 'Levítico', 'Nm': 'Números', 'Dt': 'Deuteronômio',
    'Js': 'Josué', 'Jz': 'Juízes', 'Rt': 'Rute', '1Sm': '1 Samuel', '2Sm': '2 Samuel',
    '1Rs': '1 Reis', '2Rs': '2 Reis', '1Cr': '1 Crônicas', '2Cr': '2 Crônicas', 'Esd': 'Esdras',
    'Ne': 'Neemias', 'Tb': 'Tobias', 'Jdt': 'Judite', 'Est': 'Ester', '1Mc': '1 Macabeus',
    '2Mc': '2 Macabeus', 'Jó': 'Jó', 'Sl': 'Salmos', 'Pr': 'Provérbios', 'Ecl': 'Eclesiastes',
    'Ct': 'Cântico dos Cânticos', 'Sb': 'Sabedoria', 'Eclo': 'Eclesiástico', 'Is': 'Isaías',
    'Jr': 'Jeremias', 'Lm': 'Lamentações', 'Br': 'Baruc', 'Ez': 'Ezequiel', 'Dn': 'Daniel',
    'Os': 'Oseias', 'Jl': 'Joel', 'Am': 'Amós', 'Ab': 'Abdias', 'Jn': 'Jonas', 'Mq': 'Miqueias',
    'Na': 'Naum', 'Hab': 'Habacuc', 'Sf': 'Sofonias', 'Ag': 'Ageu', 'Zc': 'Zacarias', 'Ml': 'Malaquias',
    'Mt': 'Mateus', 'Mc': 'Marcos', 'Lc': 'Lucas', 'Jo': 'João', 'At': 'Atos dos Apóstolos',
    'Rm': 'Romanos', '1Cor': '1 Coríntios', '2Cor': '2 Coríntios', 'Gl': 'Gálatas', 'Ef': 'Efésios',
    'Fl': 'Filipenses', 'Cl': 'Colossenses', '1Ts': '1 Tessalonicenses', '2Ts': '2 Tessalonicenses',
    '1Tm': '1 Timóteo', '2Tm': '2 Timóteo', 'Tt': 'Tito', 'Fm': 'Filêmon', 'Hb': 'Hebreus',
    'Tg': 'Tiago', '1Pd': '1 Pedro', '2Pd': '2 Pedro', '1Jo': '1 João', '2Jo': '2 João', '3Jo': '3 João',
    'Jd': 'Judas', 'Ap': 'Apocalipse'
  };

  const firstToken = rawRef.split(/[,:\s]/)[0].trim();
  const bookName = abbrToName[firstToken] || Object.keys(bookAbbrMap).find(k => k.toLowerCase() === firstToken.toLowerCase()) || firstToken;
  
  if (/^(\d)?\s*Jo[ãa]o/i.test(bookName) && !/^Jo[ãa]o/i.test(bookName)) {
    const num = bookName.match(/^(\d)/)?.[1] || '1';
    const ord = num === '1' ? 'Primeira' : (num === '2' ? 'Segunda' : 'Terceira');
    return `Leitura da ${ord} Carta de São João.`;
  }
  if (/^(\d)?\s*Pedro/i.test(bookName)) {
    const num = bookName.match(/^(\d)/)?.[1] || '1';
    const ord = num === '1' ? 'Primeira' : 'Segunda';
    return `Leitura da ${ord} Carta de São Pedro.`;
  }
  if (/^(\d)?\s*Cor[ií]ntios/i.test(bookName)) {
    const num = bookName.match(/^(\d)/)?.[1] || '1';
    const ord = num === '1' ? 'Primeira' : 'Segunda';
    return `Leitura da ${ord} Carta de São Paulo aos Coríntios.`;
  }
  if (/^(\d)?\s*Tessalonicenses/i.test(bookName)) {
    const num = bookName.match(/^(\d)/)?.[1] || '1';
    const ord = num === '1' ? 'Primeira' : 'Segunda';
    return `Leitura da ${ord} Carta de São Paulo aos Tessalonicenses.`;
  }
  if (/^(\d)?\s*Tim[oó]teo/i.test(bookName)) {
    const num = bookName.match(/^(\d)/)?.[1] || '1';
    const ord = num === '1' ? 'Primeira' : 'Segunda';
    return `Leitura da ${ord} Carta de São Paulo a Timóteo.`;
  }
  if (/^Tito/i.test(bookName)) return 'Leitura da Carta de São Paulo a Tito.';
  if (/^Fil[eê]mon/i.test(bookName)) return 'Leitura da Carta de São Paulo a Filêmon.';

  const cartas = ['Romanos', 'Gálatas', 'Efésios', 'Filipenses', 'Colossenses', 'Hebreus', 'Tiago', 'Judas'];
  const profetas = ['Isaías', 'Jeremias', 'Baruc', 'Ezequiel', 'Daniel', 'Oseias', 'Joel', 'Amós', 'Abdias', 'Jonas', 'Miqueias', 'Naum', 'Habacuc', 'Sofonias', 'Ageu', 'Zacarias', 'Malaquias'];
  
  if (cartas.some(c => bookName.includes(c))) {
    if (bookName.includes('Hebreus')) return 'Leitura da Carta aos Hebreus.';
    if (bookName.includes('Tiago')) return 'Leitura da Carta de São Tiago.';
    if (bookName.includes('Judas')) return 'Leitura da Carta de São Judas.';
    return `Leitura da Carta de São Paulo aos ${bookName}.`;
  }
  if (profetas.some(p => bookName.includes(p))) {
    return `Leitura do Livro do Profeta ${bookName}.`;
  }
  if (bookName.includes('Atos')) return 'Leitura dos Atos dos Apóstolos.';
  if (bookName.includes('Apocalipse')) return 'Leitura do Livro do Apocalipse de São João.';
  return `Leitura do Livro do ${bookName}.`;
}

function extractEvangelist(rawRef) {
  if (!rawRef) return 'Lucas';
  const match = rawRef.match(/(Mateus|Marcos|Lucas|João)/i);
  return match ? match[1] : 'Lucas';
}

function formatVersesHtml(text) {
  if (!text) return '';
  let clean = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Format numbers to bold verse indicators
  clean = clean.replace(/(^|[\s:;.,])(\d+)(['"“‘]?)([a-zA-ZÀ-ÿ])/gu, (match, prefix, num, quote, letter) => {
    if (num.length >= 4) return match;
    const q = quote ? quote : '';
    return `${prefix}<strong class="liturgical-verse-num font-bold text-mariana dark:text-amber-400">${num}</strong> ${q}${letter}`;
  });
  clean = clean.replace(/(^|[\s:;.,])(\d+)(\s+)(['"“‘]?)([a-zA-ZÀ-ÿ])/gu, (match, prefix, num, space, quote, letter) => {
    if (num.length >= 4) return match;
    const q = quote ? quote : '';
    return `${prefix}<strong class="liturgical-verse-num font-bold text-mariana dark:text-amber-400">${num}</strong> ${q}${letter}`;
  });
  return clean;
}

function cleanReadingBody(rawText, kind, reference) {
  if (!rawText) return { intro: '', text: '', acclamation: null, refrain: '' };
  
  let text = String(rawText).trim();
  let intro = '';
  let acclamation = null;
  let refrain = '';
  
  // Strip liturgical rubric markers like ℣. and ℟. from start/end
  text = text.replace(/^[℣℟\.\s-]+/, '');
  
  // Check for acclamation at beginning of Gospel
  if (kind === 'evangelho') {
    // Matches patterns like "Hb 1,1-2 ℟. Aleluia... ℣. Depois de ter falado... EVANGELHO ... Proclamação..."
    const acclMatch = text.match(/^(?:([A-Za-z0-9,\s]+?)\s*)?[℟R]\.?\s*(Aleluia[^\n.]+[\n.]+)(?:[℣V]\.?\s*([^\n.]+?[\n.]+))?(?:EVANGELHO[\s.:\-]*)?(?:[^\n.]+?[\n.]+)?(?:Proclamação[^\n.:]*[\n.:]+)?/i);
    if (acclMatch) {
      acclamation = {
        title: acclMatch[2]?.replace(/[℣℟]/g, '').trim() || 'Aleluia, Aleluia, Aleluia.',
        verse: acclMatch[3]?.replace(/[℣℟]/g, '').trim() || ''
      };
      text = text.slice(acclMatch[0].length).trim();
    } else {
      // Remove any loose "Proclamação do Evangelho..."
      text = text.replace(/^(\+?\s*proclama[cç][aã]o\s+do\s+evangelho[^\n.:]*[\n.:]+)/i, '').trim();
    }
  } else if (kind === 'salmo') {
    // Check if psalm starts with refrain
    const refMatch = text.match(/^(?:[A-Za-z0-9(),.\s-]+\s*)?[℟R]\.?\s*([^\n.]+[\n.]+)/i);
    if (refMatch) {
      refrain = refMatch[1].trim();
      text = text.slice(refMatch[0].length).trim();
    } else if (text.startsWith('- ')) {
      const firstDash = text.indexOf('\n\n');
      if (firstDash > 0) {
        refrain = text.substring(2, text.indexOf('\n')).replace(/^-\s*/, '').trim();
      }
    }
  } else {
    // 1st / 2nd reading: check if intro is in text
    const introMatch = text.match(/^(?:[^\n.]+\.\s*)?(Leitura (?:do Livro|da Carta|dos Atos|do Profeta)[^\n.:]*[\n.:]+)/i);
    if (introMatch) {
      intro = introMatch[1].trim();
      text = text.slice(introMatch[0].length).trim();
    } else {
      intro = getReadingIntro(reference);
    }
  }
  
  // Strip ending formulas from text so they don't duplicate
  text = text.replace(/(?:[℣℟—\-]\s*)?Palavra d[oa] (?:Senhor|Salvação)[\s\S]*$/i, '').trim();
  text = text.replace(/[℣℟]\.?\s*$/g, '').trim();
  
  return { intro, text, acclamation, refrain };
}

console.log('Testing 2026-09-25...');
const d25 = JSON.parse(fs.readFileSync('D:/Catecismo/data/liturgia/2026/2026-09-25.json', 'utf8'));
const r1 = cleanReadingBody(d25.readings.firstReading.text, 'leitura', d25.readings.firstReading.reference);
console.log('First reading intro:', r1.intro);
console.log('First reading ref:', formatReference(d25.readings.firstReading.reference, 'leitura'));
console.log('First reading verses start:', formatVersesHtml(r1.text).slice(0, 150));

const g25 = cleanReadingBody(d25.readings.gospel.text, 'evangelho', d25.readings.gospel.reference);
console.log('\nGospel ref:', formatReference(d25.readings.gospel.reference, 'evangelho'));
console.log('Gospel evangelist:', extractEvangelist(d25.readings.gospel.reference));
console.log('Gospel verses start:', formatVersesHtml(g25.text).slice(0, 150));

console.log('\nTesting 2026-01-02 (CNBB format with rubrics)...');
const d02 = JSON.parse(fs.readFileSync('D:/Catecismo/data/liturgia/2026/2026-01-02.json', 'utf8'));
const r02 = cleanReadingBody(d02.readings.firstReading.text, 'leitura', d02.readings.firstReading.reference);
console.log('02 First reading intro:', r02.intro);
console.log('02 First reading text end:', r02.text.slice(-100));

const g02 = cleanReadingBody(d02.readings.gospel.text, 'evangelho', d02.readings.gospel.reference);
console.log('02 Gospel acclamation:', g02.acclamation);
console.log('02 Gospel text start:', g02.text.slice(0, 100));
