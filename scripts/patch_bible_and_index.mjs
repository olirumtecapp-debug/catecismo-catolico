import fs from 'fs';
import path from 'path';

const srcPath = 'D:/Catecismo/catecismo-santos-integrado-2026.html';
let content = fs.readFileSync(srcPath, 'utf8');

// 1. Update BibleProvider baseUrl and fileMap
const oldBibleHeader = `        const BibleProvider = {
            version: 'matos-soares',
            versionLabel: 'Matos Soares (1956)',
            baseUrl: 'https://raw.githubusercontent.com/Dancrf/biblia-db/main/',
            sourceUrl: 'https://github.com/Dancrf/biblia-db',
            cachePrefix: 'biblia_db_matos_soares_chapter_v1_',
            fileMap: {
                GEN:'antigotestamento/gn.json', EXO:'antigotestamento/ex.json', LEV:'antigotestamento/lv.json', NUM:'antigotestamento/nm.json', DEU:'antigotestamento/dt.json',
                JOS:'antigotestamento/js.json', JDG:'antigotestamento/ju.json', RUT:'antigotestamento/rt.json', '1SA':'antigotestamento/1sm.json', '2SA':'antigotestamento/2sm.json',
                '1KI':'antigotestamento/1rs.json', '2KI':'antigotestamento/2rs.json', '1CH':'antigotestamento/1pa.json', '2CH':'antigotestamento/2pa.json', EZR:'antigotestamento/esd.json', NEH:'antigotestamento/ne.json',
                TOB:'antigotestamento/tob.json', JDT:'antigotestamento/jdi.json', EST:'antigotestamento/est.json', JOB:'antigotestamento/job.json', PSA:'antigotestamento/ps.json',
                PRO:'antigotestamento/pv.json', ECC:'antigotestamento/ees.json', SNG:'antigotestamento/cc.json', WIS:'antigotestamento/sa.json', SIR:'antigotestamento/eus.json',
                ISA:'antigotestamento/is.json', JER:'antigotestamento/je.json', LAM:'antigotestamento/lm.json', BAR:'antigotestamento/ba.json', EZK:'antigotestamento/ez.json', DAN:'antigotestamento/dn.json',
                HOS:'antigotestamento/os.json', JOL:'antigotestamento/jl.json', AMO:'antigotestamento/am.json', OBA:'antigotestamento/ab.json', JON:'antigotestamento/jn.json', MIC:'antigotestamento/mic.json', NAH:'antigotestamento/na.json',
                HAB:'antigotestamento/hc.json', ZEP:'antigotestamento/so.json', HAG:'antigotestamento/ag.json', ZEC:'antigotestamento/zc.json', MAL:'antigotestamento/ml.json', '1MA':'antigotestamento/1ma.json', '2MA':'antigotestamento/2ma.json',
                MAT:'novotestamento/mt.json', MRK:'novotestamento/mc.json', LUK:'novotestamento/lc.json', JHN:'novotestamento/jo.json', ACT:'novotestamento/act.json', ROM:'novotestamento/rm.json',
                '1CO':'novotestamento/1co.json', '2CO':'novotestamento/2co.json', GAL:'novotestamento/gl.json', EPH:'novotestamento/ef.json', PHP:'novotestamento/fp.json', COL:'novotestamento/cl.json',
                '1TH':'novotestamento/1ts.json', '2TH':'novotestamento/2ts.json', '1TI':'novotestamento/1tm.json', '2TI':'novotestamento/2tm.json', TIT:'novotestamento/tt.json', PHM:'novotestamento/fm.json',
                HEB:'novotestamento/hb.json', JAS:'novotestamento/tg.json', '1PE':'novotestamento/1pe.json', '2PE':'novotestamento/2pe.json', '1JN':'novotestamento/1jo.json', '2JN':'novotestamento/2jo.json', '3JN':'novotestamento/3jo.json', JUD:'novotestamento/jda.json', REV:'novotestamento/ap.json'
            },`;

const newBibleHeader = `        const BibleProvider = {
            version: 'matos-soares',
            versionLabel: 'Matos Soares (1956)',
            baseUrl: './data/biblia/',
            sourceUrl: 'https://github.com/Dancrf/biblia-db',
            cachePrefix: 'biblia_db_matos_soares_chapter_v1_',
            fileMap: {
                GEN:'gn.json', EXO:'ex.json', LEV:'lv.json', NUM:'nm.json', DEU:'dt.json',
                JOS:'js.json', JDG:'ju.json', RUT:'rt.json', '1SA':'1sm.json', '2SA':'2sm.json',
                '1KI':'1rs.json', '2KI':'2rs.json', '1CH':'1pa.json', '2CH':'2pa.json', EZR:'esd.json', NEH:'ne.json',
                TOB:'tob.json', JDT:'jdi.json', EST:'est.json', JOB:'job.json', PSA:'ps.json',
                PRO:'pv.json', ECC:'ees.json', SNG:'cc.json', WIS:'sa.json', SIR:'eus.json',
                ISA:'is.json', JER:'je.json', LAM:'lm.json', BAR:'ba.json', EZK:'ez.json', DAN:'dn.json',
                HOS:'os.json', JOL:'jl.json', AMO:'am.json', OBA:'ab.json', JON:'jn.json', MIC:'mic.json', NAH:'na.json',
                HAB:'hc.json', ZEP:'so.json', HAG:'ag.json', ZEC:'zc.json', MAL:'ml.json', '1MA':'1ma.json', '2MA':'2ma.json',
                MAT:'mt.json', MRK:'mc.json', LUK:'lc.json', JHN:'jo.json', ACT:'act.json', ROM:'rm.json',
                '1CO':'1co.json', '2CO':'2co.json', GAL:'gl.json', EPH:'ef.json', PHP:'fp.json', COL:'cl.json',
                '1TH':'1ts.json', '2TH':'2ts.json', '1TI':'1tm.json', '2TI':'2tm.json', TIT:'tt.json', PHM:'fm.json',
                HEB:'hb.json', JAS:'tg.json', '1PE':'1pe.json', '2PE':'2pe.json', '1JN':'1jo.json', '2JN':'2jo.json', '3JN':'3jo.json', JUD:'jda.json', REV:'ap.json'
            },`;

if (content.includes(oldBibleHeader)) {
    content = content.replace(oldBibleHeader, newBibleHeader);
    console.log("Updated BibleProvider to local data/biblia/ paths!");
}

// 2. Enhanced searchReference to handle liturgical references
const oldSearchReference = `            async searchReference(query) {
                const m=String(query||'').trim().match(/^(.+?)\\s+(\d+)[,:.]\\s*(\d+)?$/i);
                if(!m) return null;
                const rawName=m[1].trim().toLowerCase(); const chapter=Number(m[2]); const verse=m[3]?Number(m[3]):null;
                const aliases={'gn':'GEN','genesis':'GEN','ex':'EXO','êxodo':'EXO','lev':'LEV','nm':'NUM','dt':'DEU','jos':'JOS','jz':'JDG','rt':'RUT','1sm':'1SA','2sm':'2SA','1rs':'1KI','2rs':'2KI','1cr':'1CH','2cr':'2CH','esd':'EZR','ne':'NEH','tb':'TOB','tob':'TOB','jdt':'JDT','est':'EST','1mc':'1MA','2mc':'2MA','jó':'JOB','jo':'JHN','sl':'PSA','pv':'PRO','ec':'ECC','ct':'SNG','sb':'WIS','eclo':'SIR','sir':'SIR','is':'ISA','jr':'JER','lm':'LAM','br':'BAR','ez':'EZK','dn':'DAN','os':'HOS','jl':'JOL','am':'AMO','ob':'OBA','jn':'JON','mq':'MIC','na':'NAH','hab':'HAB','sf':'ZEP','ag':'HAG','zc':'ZEC','ml':'MAL','mt':'MAT','mc':'MRK','lc':'LUK','atos':'ACT','rm':'ROM','1cor':'1CO','2cor':'2CO','gl':'GAL','ef':'EPH','fl':'PHP','cl':'COL','1ts':'1TH','2ts':'2TH','1tm':'1TI','2tm':'2TI','tt':'TIT','fm':'PHM','hb':'HEB','tg':'JAS','1pd':'1PE','2pd':'2PE','1jo':'1JN','2jo':'2JN','3jo':'3JN','jd':'JUD','ap':'REV'};
                const code=aliases[rawName] || this.books.find(b=>b.name.toLowerCase()===rawName)?.code;
                if(!code) return null; const data=await this.fetchChapter(code,chapter); return {data,verse};
            }`;

const newSearchReference = `            async searchReference(query) {
                let clean = String(query || '').trim()
                    .replace(/Evangelho de Jesus Cristo segundo (São|Santo|Santa)?/gi, '')
                    .replace(/Evangelho segundo (São|Santo|Santa)?/gi, '')
                    .replace(/(Primeira|Segunda|Terceira|1ª|2ª|3ª) Carta de (São|Santo)?/gi, '$1')
                    .replace(/Carta de (São|Santo)?/gi, '')
                    .replace(/^(São|Santo|Santa)\\s+/i, '')
                    .trim();

                // Caso especial Salmos: "Salmo 32 (33)" ou "Sl 22"
                const psalmMatch = clean.match(/^Salmo(?:s)?\\s+(\\d+)(?:\\s*\\(\\d+\\))?/i);
                if (psalmMatch) {
                    const chapter = Number(psalmMatch[1]);
                    const data = await this.fetchChapter('PSA', chapter);
                    return { data, verse: 1 };
                }

                // Match padrão: Livro Capítulo, Versículo(s) ex: Lucas 12, 1-7 ou Efésios 1,11-14
                const m = clean.match(/^(.+?)\\s+(\\d+)\\s*[,:.]\\s*(\\d+)(?:\\s*[-–]\\s*\\d+)?/i) || clean.match(/^(.+?)\\s+(\\d+)$/i);
                if (!m) return null;
                const rawName = m[1].trim().toLowerCase();
                const chapter = Number(m[2]);
                const verse = m[3] ? Number(m[3]) : 1;
                const aliases = {
                    'gn':'GEN','gênesis':'GEN','genesis':'GEN','ex':'EXO','êxodo':'EXO','exodo':'EXO','lev':'LEV','levítico':'LEV','levitico':'LEV','nm':'NUM','números':'NUM','numeros':'NUM','dt':'DEU','deuteronômio':'DEU','deuteronomio':'DEU',
                    'jos':'JOS','josué':'JOS','josue':'JOS','jz':'JDG','juízes':'JDG','juizes':'JDG','rt':'RUT','rute':'RUT','1sm':'1SA','1 samuel':'1SA','2sm':'2SA','2 samuel':'2SA','1rs':'1KI','1 reis':'1KI','2rs':'2KI','2 reis':'2KI',
                    '1cr':'1CH','1 crônicas':'1CH','2cr':'2CH','2 crônicas':'2CH','esd':'EZR','esdras':'EZR','ne':'NEH','neemias':'NEH','tb':'TOB','tob':'TOB','tobias':'TOB','jdt':'JDT','judite':'JDT','est':'EST','ester':'EST',
                    '1mc':'1MA','1 macabeus':'1MA','2mc':'2MA','2 macabeus':'2MA','jó':'JOB','jo':'JOB','jó':'JOB','sl':'PSA','salmo':'PSA','salmos':'PSA','pv':'PRO','provérbios':'PRO','proverbios':'PRO','ec':'ECC','eclesiastes':'ECC','ct':'SNG','cântico':'SNG','cantico':'SNG','canticos':'SNG',
                    'sb':'WIS','sabedoria':'WIS','eclo':'SIR','eclesiástico':'SIR','eclesiastico':'SIR','sir':'SIR','is':'ISA','isaías':'ISA','isaias':'ISA','jr':'JER','jeremias':'JER','lm':'LAM','lamentações':'LAM','lamentacoes':'LAM','br':'BAR','baruc':'BAR','ez':'EZK','ezequiel':'EZK','dn':'DAN','daniel':'DAN',
                    'os':'HOS','oseias':'HOS','jl':'JOL','joel':'JOL','am':'AMO','amós':'AMO','amos':'AMO','ob':'OBA','abdias':'OBA','jn':'JON','jonas':'JON','mq':'MIC','miqueias':'MIC','na':'NAH','naum':'NAH','hab':'HAB','habacuc':'HAB','sf':'ZEP','sofonias':'ZEP','ag':'HAG','ageu':'HAG','zc':'ZEC','zacarias':'ZEC','ml':'MAL','malaquias':'MAL',
                    'mt':'MAT','mateus':'MAT','são mateus':'MAT','mc':'MRK','marcos':'MRK','são marcos':'MRK','lc':'LUK','lucas':'LUK','são lucas':'LUK','jhn':'JHN','joão':'JHN','joao':'JHN','são joão':'JHN','atos':'ACT','atos dos apóstolos':'ACT','rm':'ROM','romanos':'ROM',
                    '1cor':'1CO','1 coríntios':'1CO','1 corintios':'1CO','primeira aos coríntios':'1CO','2cor':'2CO','2 coríntios':'2CO','2 corintios':'2CO','segunda aos coríntios':'2CO','gl':'GAL','gálatas':'GAL','galatas':'GAL','ef':'EPH','efésios':'EPH','efesios':'EPH','fl':'PHP','filipenses':'PHP','cl':'COL','colossenses':'COL',
                    '1ts':'1TH','1 tessalonicenses':'1TH','2ts':'2TH','2 tessalonicenses':'2TH','1tm':'1TI','1 timóteo':'1TI','2tm':'2TI','2 timóteo':'2TI','tt':'TIT','tito':'TIT','fm':'PHM','filemom':'PHM','hb':'HEB','hebreus':'HEB','tg':'JAS','tiago':'JAS',
                    '1pd':'1PE','1pe':'1PE','1 pedro':'1PE','2pd':'2PE','2pe':'2PE','2 pedro':'2PE','1jo':'1JN','1 joão':'1JN','2jo':'2JN','2 joão':'2JN','3jo':'3JN','3 joão':'3JN','jd':'JUD','judas':'JUD','ap':'REV','apocalipse':'REV'
                };
                const code = aliases[rawName] || this.books.find(b => b.name.toLowerCase() === rawName)?.code;
                if (!code) return null;
                const data = await this.fetchChapter(code, chapter);
                return { data, verse };
            }`;

if (content.includes(oldSearchReference)) {
    content = content.replace(oldSearchReference, newSearchReference);
    console.log("Updated BibleProvider.searchReference to handle all liturgical reading strings!");
}

// Write back to catecismo-santos-integrado-2026.html
fs.writeFileSync(srcPath, content, 'utf8');
console.log("Updated D:/Catecismo/catecismo-santos-integrado-2026.html");

// Also create/update D:/Catecismo/index.html so npx serve . opens it by default!
const indexPath = 'D:/Catecismo/index.html';
fs.writeFileSync(indexPath, content, 'utf8');
console.log("Created D:/Catecismo/index.html as default entrypoint!");
