import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetFile = path.join(__dirname, '..', 'data', 'oracoes_intencoes.json');

const items = [
    // 1. FAMÍLIA (São José & Santo Antônio)
    {
        id: "intencao-familia-sao-jose",
        categoria_slug: "familia",
        intencao: "Família",
        icone: "👨‍👩‍👧‍👦",
        cor: "mariana",
        santo_nome: "São José",
        santo_titulo: "Esposo da Virgem Maria e Chefe da Sagrada Família",
        santo_imagem: "assets/img/santos/03-19-santa-jose-esposo-da-santissima-virgem-maria-padroeiro-da-igreja-universal.png",
        por_que_padroeiro: "Escolhido pelo próprio Deus para ser o guardião, provedor e protetor da Sagrada Família de Nazaré. É o modelo máximo de paternidade virtuosa, fidelidade conjugal e guarda do lar.",
        titulo_oracao: "Oração a São José pela Família (Ad Te, Beate Joseph)",
        autor_fonte: "Papa Leão XIII (Encíclica Quamquam Pluries, 1889)",
        texto_oracao: "A vós, bem-aventurado São José, recorremos em nossa tribulação e, depois de ter implorado o auxílio de vossa santíssima Esposa, cheios de confiança solicitamos também o vosso patrocínio.\n\nPor aquele laço sagrado de caridade que vos uniu à Imaculada Virgem Mãe de Deus, e pelo amor paternal que tivestes ao Menino Jesus, ardentemente vos suplicamos que lanceis um olhar benigno para a herança que Jesus Cristo conquistou com o seu Sangue, e nos assistais em nossas necessidades com o vosso auxílio e poder.\n\nDefendei, ó providentíssimo Guarda da divina Família, a nossa família e os lares cristãos; afastai para longe de nós a peste dos erros e dos vícios; assisti-nos do alto do céu, ó nosso fortíssimo sustentáculo, na luta contra o poder das trevas; e assim como outrora livrastes da morte a vida ameaçada do Menino Jesus, defendei hoje a santa Igreja de Deus e as nossas famílias das ciladas do inimigo e de toda adversidade.\n\nAmparai a cada um de nós com o vosso perpétuo patrocínio, a fim de que, a vosso exemplo e sustentados pelo vosso auxílio, possamos viver santamente, morrer piedosamente e alcançar a eterna bem-aventurança no Céu.\n\nAmém.",
        jaculatoria: "São José, chefe da Sagrada Família e terror dos demônios, protegei as nossas famílias!",
        botao_texto: "Rezar com São José"
    },
    {
        id: "intencao-familia-santo-antonio",
        categoria_slug: "familia",
        intencao: "Família",
        icone: "👨‍👩‍👧‍👦",
        cor: "mariana",
        santo_nome: "Santo Antônio de Pádua",
        santo_titulo: "Doutor Evangélico e Intercessor da Paz nos Lares",
        santo_imagem: "assets/img/santos/06-13-sao-antonio-de-padua-sacerdote-franciscano-e-.jpg",
        por_que_padroeiro: "Tradicionalmente invocado para abençoar os lares, restabelecer a reconciliação entre casais e proteger os filhos sob a bênção do Menino Jesus que ele carregou nos braços.",
        titulo_oracao: "Oração de Santo Antônio pela Paz e Bênção da Família",
        autor_fonte: "Tradição Franciscana Secular e Devocionário Antoniano",
        texto_oracao: "Glorioso Santo Antônio, amigo do Menino Jesus e servo fiel da Mãe de Deus, a vós recorro com o coração cheio de confiança em vosso poderoso patrocínio.\n\nOlhai com amor para a nossa família. Abençoai os pais, iluminai os filhos e guardai a todos nós na concórdia, no respeito e no mútuo perdão. Afastai do nosso teto toda discórdia, desentendimento, violência e desamor.\n\nQue a presença de Cristo seja o fundamento da nossa casa, assim como foi no humilde lar de Nazaré. Alcançai-nos a saúde da alma e do corpo, o pão do sustento honesto e a graça de crescermos juntos na fé cristã e na caridade com os necessitados.\n\nSanto Antônio, consolador dos aflitos, rogai por nós e por nossas famílias hoje e sempre.\n\nAmém.",
        jaculatoria: "Santo Antônio de Pádua, abençoai o nosso lar e guardai a nossa família!",
        botao_texto: "Rezar com Santo Antônio"
    },

    // 2. TRABALHO & SUSTENTO (São José Operário & Santa Edwiges)
    {
        id: "intencao-trabalho-sao-jose-operario",
        categoria_slug: "trabalho",
        intencao: "Trabalho & Sustento",
        icone: "💼",
        cor: "dourado",
        santo_nome: "São José Operário",
        santo_titulo: "Protetor dos Trabalhadores e do Ofício Honesto",
        santo_imagem: "assets/img/santos/05-01-sao-jose-operario-esposo-da-santissima-virgem-maria-protetor-dos-trabalhadores.png",
        por_que_padroeiro: "Com o suor do seu rosto na carpintaria de Nazaré sustentou o Filho de Deus encarnado, santificando o trabalho manual e tornando-se o patrono perpétuo de todos os que buscam e realizam seu sustento.",
        titulo_oracao: "Oração do Trabalhador a São José Operário",
        autor_fonte: "Papa São Pio X (1906)",
        texto_oracao: "Glorioso São José, modelo de todos os que se dedicam ao trabalho, alcançai-me a graça de trabalhar com espírito de penitência para expiação de meus muitos pecados; de trabalhar com consciência, pondo o dever acima de minhas inclinações;\n\nde trabalhar com recolhimento e alegria, considerando como uma honra empregar e desenvolver pelo trabalho os dons recebidos de Deus; de trabalhar com ordem, paz, moderação e paciência, sem jamais recuar diante do cansaço e das dificuldades;\n\nde trabalhar, sobretudo, com pureza de intenção e desapego de mim mesmo, tendo sempre diante dos olhos a morte e a conta que deverei prestar do tempo perdido, dos talentos inutilizados, do bem omitido e das vãs complacências no sucesso, tão funestas à obra de Deus.\n\nTudo por Jesus, tudo por Maria, tudo à vossa imitação, ó Patriarca São José! Tal será a minha divisa na vida e na hora da morte.\n\nAmém.",
        jaculatoria: "São José Operário, dignificai o nosso labor e abençoai o nosso sustento!",
        botao_texto: "Rezar com São José Operário"
    },
    {
        id: "intencao-trabalho-santa-edwiges",
        categoria_slug: "trabalho",
        intencao: "Trabalho & Sustento",
        icone: "💼",
        cor: "dourado",
        santo_nome: "Santa Edwiges",
        santo_titulo: "Padroeira dos Pobres, Endividados e do Emprego Digno",
        santo_imagem: "assets/img/santos/10-16-santa-edviges-duquesa-da-silesia-religiosa.png",
        por_que_padroeiro: "Duquesa da Silésia que usou toda a sua riqueza para resgatar os endividados e alimentar os desamparados. É venerada universalmente como socorro nas aflições materiais e financeiras.",
        titulo_oracao: "Oração a Santa Edwiges pelo Trabalho e Alívio nas Dívidas",
        autor_fonte: "Devocionário Canônico Católico",
        texto_oracao: "Ó Santa Edwiges, vós que neste mundo fostes o amparo dos pobres, o desterro dos endividados e o socorro dos desamparados, no Céu desfrutais do prêmio eterno da caridade que praticastes em vida.\n\nCheio de confiança em vossa intercessão, peço-vos com fervor: alcançai de Deus para mim o trabalho honrado, a bênção nas minhas atividades profissionais e a sabedoria para administrar com retidão os bens materiais.\n\nLivrai-me das aflições financeiras, ajudai-me a solver as dívidas e concedei-me a serenidade no sustento do meu lar, para que nunca falte o pão em nossa mesa nem a generosidade de partilhar com os mais pobres.\n\nPor nosso Senhor Jesus Cristo, vosso Filho, que convosco vive e reina na unidade do Espírito Santo.\n\nAmém.",
        jaculatoria: "Santa Edwiges, amparo dos que trabalham e socorro nas dívidas, rogai por nós!",
        botao_texto: "Rezar com Santa Edwiges"
    },

    // 3. CAUSAS DIFÍCEIS (São Judas Tadeu & Santa Rita de Cáscia)
    {
        id: "intencao-causas-dificeis-sao-judas",
        categoria_slug: "causas-dificeis",
        intencao: "Causas Difíceis & Impossíveis",
        icone: "⚖️",
        cor: "vinho",
        santo_nome: "São Judas Tadeu",
        santo_titulo: "Apóstolo de Cristo e Padroeiro dos Casos Desesperados",
        santo_imagem: "assets/img/santos/10-28-ss-simao-e-judas-tadeu-apostolos.png",
        por_que_padroeiro: "Apóstolo mártir de Jesus Cristo. Por séculos invocado pela Igreja como o advogado das causas onde todos os recursos humanos parecem esgotados e o desespero tenta se instalar.",
        titulo_oracao: "Oração a São Judas Tadeu nas Aflições Extremas",
        autor_fonte: "Tradição Apostólica e Prática Devocional Canônica",
        texto_oracao: "São Judas Tadeu, apóstolo glorioso, fiel servo e amigo de Jesus! O nome do traidor tem sido a causa de que fostes esquecido por muitos, mas a Igreja vos honra e invoca universalmente como o patrono das causas desesperadas e dos casos sem remédio.\n\nIntercedei por mim, que me sinto tão desamparado e aflito. Fazei uso, eu vos rogo, daquele privilégio particular a vós concedido, de trazer socorro visível e rápido onde o socorro é quase impossível de esperar.\n\nVinde em meu auxílio nesta grande necessidade, para que eu possa receber a consolação e o socorro do Céu em todas as minhas tribulações e sofrimentos, particularmente na causa que agora coloco em vossas mãos, e para que possa louvar a Deus convosco e com todos os eleitos por toda a eternidade.\n\nEu vos prometo, ó bendito São Judas, lembrar-me sempre deste grande favor, nunca deixar de vos honrar como meu especial e poderoso patrono, e fazer tudo o que estiver em meu alcance para incentivar a devoção a vós.\n\nAmém.",
        jaculatoria: "São Judas Tadeu, apóstolo de Cristo e socorro nas causas desesperadas, rogai por nós!",
        botao_texto: "Rezar com São Judas Tadeu"
    },
    {
        id: "intencao-causas-dificeis-santa-rita",
        categoria_slug: "causas-dificeis",
        intencao: "Causas Difíceis & Impossíveis",
        icone: "⚖️",
        cor: "vinho",
        santo_nome: "Santa Rita de Cáscia",
        santo_titulo: "A Santa dos Casos Impossíveis e do Perdão Heróico",
        santo_imagem: "assets/img/santos/05-22-santa-rita-de-cassia-religiosa-agostiniana.png",
        por_que_padroeiro: "Suportou com mansidão e heroísmo as maiores cruzes conjugais, familiares e corporais (o espinho na fronte). Deus honrou sua fé concedendo-lhe o título de advogada dos impossíveis.",
        titulo_oracao: "Oração a Santa Rita nas Causas Desesperadas",
        autor_fonte: "Tradição Agostiniana e Enchiridion Devocional",
        texto_oracao: "Ó poderosa e gloriosa Santa Rita de Cáscia, eis a vossos pés uma alma desamparada que, necessitando de auxílio, a vós recorre com a doce esperança de ser atendida por vós que tendes o incomparável título de Santa dos Casos Impossíveis e Desesperados.\n\nÓ santa face de Cristo crucificado, que vos imprimiu na fronte o sagrado estigma de Sua Paixão, compadecei-vos de minha aflição. Intercedei junto ao Trono da Divina Providência por esta causa que tanto me angustia e que humanamente parece não ter saída.\n\nNão permitais que eu me desvie dos caminhos do Senhor. Alcançai-me a força de perdoar os que me ofenderam, a paciência nas cruzes cotidianas e a graça inestimável de contemplar a vitória da misericórdia divina em minha vida.\n\nSanta Rita, rogai por mim e consolai meu coração aflito.\n\nAmém.",
        jaculatoria: "Santa Rita de Cáscia, advogada das causas impossíveis, rogai por nós!",
        botao_texto: "Rezar com Santa Rita"
    },

    // 4. PROTEÇÃO ESPIRITUAL (São Miguel Arcanjo & São Bento)
    {
        id: "intencao-protecao-sao-miguel",
        categoria_slug: "protecao",
        intencao: "Proteção Espiritual & Combate",
        icone: "🛡️",
        cor: "mariana",
        santo_nome: "São Miguel Arcanjo",
        santo_titulo: "Príncipe da Milícia Celeste e Guardião do Povo de Deus",
        santo_imagem: "assets/img/santos/09-29-sao-miguel-arcanjo.png",
        por_que_padroeiro: "Líder supremo dos anjos fiéis que expulsou Lúcifer do Paraíso com o brado 'Quem como Deus?'. É o protetor da Igreja Universal contra as investidas, tentações e ciladas do demônio.",
        titulo_oracao: "Oração a São Miguel Arcanjo",
        autor_fonte: "Papa Leão XIII (1886)",
        texto_oracao: "São Miguel Arcanjo, defendei-nos no combate, sede o nosso refúgio contra as maldades e ciladas do demônio.\n\nOrdene-lhe Deus, instantemente o pedimos, e vós, príncipe da milícia celeste, pela virtude divina, precipitai no inferno a Satanás e aos outros espíritos malignos, que andam pelo mundo para perder as almas.\n\nAmém.",
        jaculatoria: "São Miguel Arcanjo, com vossa espada de fogo, defendei-nos e protegei-nos de todo o mal!",
        botao_texto: "Rezar com São Miguel Arcanjo"
    },
    {
        id: "intencao-protecao-sao-bento",
        categoria_slug: "protecao",
        intencao: "Proteção Espiritual & Combate",
        icone: "🛡️",
        cor: "mariana",
        santo_nome: "São Bento de Núrsia",
        santo_titulo: "Patriarca dos Monges do Ocidente e Mestre do Exorcismo",
        santo_imagem: "assets/img/santos/07-11-sao-bento-abade-padroeiro-da-europa.jpg",
        por_que_padroeiro: "Sua vida foi marcada pela vitória sobrenatural da Cruz sobre venenos, tentações diabólicas e feitiçarias. A Santa Sé aprovou sua Medalha como um dos maiores sacramentais de proteção.",
        titulo_oracao: "Oração da Cruz Sagrada de São Bento",
        autor_fonte: "Tradição Beneditina / Breviário Monástico",
        texto_oracao: "A Cruz Sagrada seja a minha luz,\nnão seja o dragão o meu guia.\n\nRetira-te, Satanás!\nNunca me aconselhes coisas vãs.\nÉ mau o que tu me ofereces,\nbebe tu mesmo o teu veneno!\n\nEm nome do Pai, do Filho e do Espírito Santo.\n\nAmém.",
        jaculatoria: "Crux Sacra Sit Mihi Lux! São Bento abade, livrai-nos de toda cilada maligna!",
        botao_texto: "Rezar com São Bento"
    },

    // 5. SAÚDE & ENFERMOS (São Rafael, São Camilo & São Brás)
    {
        id: "intencao-saude-sao-rafael",
        categoria_slug: "saude",
        intencao: "Saúde & Cura dos Enfermos",
        icone: "🌿",
        cor: "emerald",
        santo_nome: "São Rafael Arcanjo",
        santo_titulo: "Medicina de Deus e Consolador dos Aflitos",
        santo_imagem: "assets/img/santos/09-29-san-rafael-arcanjo.png",
        por_que_padroeiro: "No Livro de Tobias foi enviado por Deus para curar a cegueira do ancião Tobit e libertar Sara. Seu próprio nome hebraico significa 'Deus cura'. É o patrono dos médicos, cirurgiões e doentes.",
        titulo_oracao: "Oração a São Rafael Arcanjo pela Saúde e Cura",
        autor_fonte: "Livro de Tobias e Ritual Romano dos Santos Anjos",
        texto_oracao: "Glorioso Arcanjo São Rafael, que tivestes a missão de guiar o jovem Tobias e trazer a cura da cegueira ao seu pai Tobit, a vós recorro como humilde suplicante.\n\nVós sois o médico celeste enviado pela misericórdia do Pai para sarar as enfermidades do corpo e da alma. Olhai com piedade para as minhas dores e fraquezas corporais, bem como pelas enfermidades de todos os meus entes queridos.\n\nEstendei vossas asas luminosas sobre nós. Afastai as dores, iluminai as decisões dos médicos que nos tratam, abençoai os remédios e alcançai-nos, se for da santa vontade de Deus, a recuperação plena da saúde.\n\nE, acima de tudo, curai as feridas ocultas de nossa alma, para que vivamos na pureza, na fé e no amor de Cristo Jesus.\n\nAmém.",
        jaculatoria: "São Rafael Arcanjo, Medicina de Deus, curai as nossas enfermidades do corpo e do espírito!",
        botao_texto: "Rezar com São Rafael Arcanjo"
    },
    {
        id: "intencao-saude-sao-camilo",
        categoria_slug: "saude",
        intencao: "Saúde & Cura dos Enfermos",
        icone: "🌿",
        cor: "emerald",
        santo_nome: "São Camilo de Lellis",
        santo_titulo: "Padroeiro Universal dos Enfermos e dos Profissionais de Saúde",
        santo_imagem: "assets/img/santos/07-14-sao-camilo-de-lelis-sacerdote-fundador-dos-cl.jpg",
        por_que_padroeiro: "Fundador da Ordem dos Ministros dos Enfermos (Camilianos). Dedicou toda a vida aos doentes incuráveis e aos leitos de hospital, enxergando em cada sofredor a própria pessoa de Cristo crucificado.",
        titulo_oracao: "Oração de São Camilo de Lellis pelos Doentes",
        autor_fonte: "Liturgia Romana e Espiritualidade Camiliana",
        texto_oracao: "Ó São Camilo, que tendo sofrido por longos anos em vosso próprio corpo as dores da doença, aprendestes na Cruz a amar os enfermos como ao próprio Cristo Crucificado,\n\nvolvei o vosso olhar caridoso sobre todos os que hoje se encontram acamados, desfalecidos, hospitalizados ou enfrentando diagnósticos difíceis.\n\nAlcançai para eles o alívio das dores, a paciência santa nos momentos de desânimo, o carinho generoso dos cuidadores e a graça inestimável da cura corporal e espiritual.\n\nEnsinai-nos a unir nossos sofrimentos à Paixão de Cristo para a redenção do mundo e para o renascimento de uma fé viva e inabalável.\n\nAmém.",
        jaculatoria: "São Camilo de Lellis, protetor carinhoso dos doentes, rogai pelos que sofrem!",
        botao_texto: "Rezar com São Camilo"
    },
    {
        id: "intencao-saude-sao-bras",
        categoria_slug: "saude",
        intencao: "Saúde & Cura dos Enfermos",
        icone: "🌿",
        cor: "emerald",
        santo_nome: "São Brás",
        santo_titulo: "Bispo Mártir e Protetor contra os Males da Garganta e do Corpo",
        santo_imagem: "assets/img/santos/02-03-sao-bras-bispo-de-sebaste-e-martir.png",
        por_que_padroeiro: "Médico e bispo mártir armênio do século IV que salvou milagrosamente uma criança que morria asfixiada com uma espinha na garganta. Famoso por sua bênção tradicional de saúde.",
        titulo_oracao: "Oração e Bênção de São Brás pela Saúde",
        autor_fonte: "Bênção Litúrgica Tradicional da Igreja Católica",
        texto_oracao: "Ó Deus misericordioso, que concedestes a São Brás a graça de testemunhar a fé no martírio e o poder de socorrer os doentes em suas aflições mais dolorosas,\n\npor sua intercessão vos pedimos: livrai-nos de todos os males da garganta, das doenças respiratórias, das asfixias e de qualquer outro mal que aflija o nosso corpo mortal.\n\nDai-nos a saúde necessária para bendizer o vosso Santo Nome, proclamar o vosso Evangelho e servir com amor aos irmãos mais necessitados.\n\nPor intercessão de São Brás, bispo e mártir, livre-nos Deus do mal da garganta e de qualquer outro mal. Em nome do Pai, do Filho e do Espírito Santo.\n\nAmém.",
        jaculatoria: "Por intercessão de São Brás, livrai-nos Deus dos males da garganta e de todo mal!",
        botao_texto: "Rezar com São Brás"
    },

    // 6. CONVERSÃO (Santa Mônica & Santo Agostinho)
    {
        id: "intencao-conversao-santa-monica",
        categoria_slug: "conversao",
        intencao: "Conversão & Retorno à Fé",
        icone: "🕊️",
        cor: "mariana",
        santo_nome: "Santa Mônica",
        santo_titulo: "Mãe de Santo Agostinho e Padroeira das Mães que Choram",
        santo_imagem: "assets/img/santos/08-27-sao-monica-mae-de-s-agostinho-bispo.jpg",
        por_que_padroeiro: "Rezou, jejuou e chorou por mais de 30 anos sem esmorecer pela conversão de seu marido e de seu filho Agostinho. Santo Ambrósio profetizou: 'É impossível que se perca um filho de tantas lágrimas'.",
        titulo_oracao: "Súplica de Santa Mônica pela Conversão dos Filhos e Parentes",
        autor_fonte: "Tradição Agostiniana e Espiritualidade das Confissões",
        texto_oracao: "Santa Mônica, esposa exemplar e mãe dolorosa que tantas lágrimas derramastes diante do altar do Senhor pela conversão de vosso esposo Patrício e de vosso amado filho Agostinho,\n\na vós confio hoje o meu coração angustiado pelos meus familiares e amigos que se afastaram da Igreja, perderam a luz da fé ou se encontram enredados nos caminhos do pecado e da indiferença espiritual.\n\nEnsinai-me a vossa paciência heróica, a vossa fé inabalável e a vossa oração silenciosa e perseverante que nunca se cansa de esperar a misericórdia de Deus.\n\nLevai aos pés de Jesus as minhas preces e lágrimas. Que a luz do Espírito Santo toque o íntimo de suas consciências, desfaça toda cegueira espiritual e lhes conceda a graça da verdadeira conversão e da vida nova em Cristo Jesus.\n\nAmém.",
        jaculatoria: "Santa Mônica, que não vos cansastes de rezar e chorar, convertei os nossos parentes a Deus!",
        botao_texto: "Rezar com Santa Mônica"
    },
    {
        id: "intencao-conversao-santo-agostinho",
        categoria_slug: "conversao",
        intencao: "Conversão & Retorno à Fé",
        icone: "🕊️",
        cor: "mariana",
        santo_nome: "Santo Agostinho de Hipona",
        santo_titulo: "Doutor da Graça e Testemunho do Coração Inquieto",
        santo_imagem: "assets/img/santos/08-28-sao-agostinho-bispo-de-hipona-e-doutor-da-igr.jpg",
        por_que_padroeiro: "Após anos no erro e nas paixões mundanas, rendeu-se à Graça divina e declarou: 'Tarde te amei, ó Beleza tão antiga e tão nova!'. É o grande patrono dos pecadores em busca da Verdade.",
        titulo_oracao: "Oração de Santo Agostinho pelo Retorno a Deus",
        autor_fonte: "Confissões de Santo Agostinho (Livro X)",
        texto_oracao: "Tarde Te amei, ó Beleza tão antiga e tão nova, tarde Te amei!\n\nEis que estavas dentro de mim e eu fora, e aí Te procurava; e, disforme, lançava-me sobre as belas formas que criaste. Estavas comigo, e eu não estava Contigo. Retinham-me longe de Ti aquelas coisas que não existiriam se não existissem em Ti.\n\nChamaste-me, clamaste por mim e rompeste a minha surdez. Brilhaste, resplandeceste e dissipaste a minha cegueira. Exalaste o Teu perfume: aspirei-o e suspiro por Ti. Provei-Te: tenho fome e sede de Ti. Tocaste-me: e abrasei-me na Tua paz.\n\nConvertei-nos, Senhor, a Vós, pois nos fizestes para Vós e o nosso coração permanece inquieto enquanto não descansar em Vós.\n\nAmém.",
        jaculatoria: "Santo Agostinho, doutor da graça, guiai os corações transviados ao encontro com a Verdade!",
        botao_texto: "Rezar com Santo Agostinho"
    },

    // 7. PAZ NA ALMA & SERENIDADE (São Francisco & Santa Teresa d'Ávila)
    {
        id: "intencao-paz-sao-francisco",
        categoria_slug: "paz",
        intencao: "Paz na Alma & Reconciliação",
        icone: "🕊️",
        cor: "emerald",
        santo_nome: "São Francisco de Assis",
        santo_titulo: "O Pobrezinho de Assis e Mensageiro da Paz e do Bem",
        santo_imagem: "assets/img/santos/10-04-sao-francisco-de-assis-fundador-da-ordem-franciscana-padroeiro-da-italia.png",
        por_que_padroeiro: "Abraçou a perfeita alegria e o desapego total por amor a Cristo pobre. Dedicou sua pregação a levar a paz evangélica entre inimigos e a fraternidade universal com toda a criação.",
        titulo_oracao: "Oração da Paz de São Francisco",
        autor_fonte: "Tradição Franciscana Universal",
        texto_oracao: "Senhor, fazei-me instrumento de vossa paz!\n\nOnde houver ódio, que eu leve o amor;\nonde houver ofensa, que eu leve o perdão;\nonde houver discórdia, que eu leve a união;\nonde houver dúvida, que eu leve a fé;\nonde houver erro, que eu leve a verdade;\nonde houver desespero, que eu leve a esperança;\nonde houver tristeza, que eu leve a alegria;\nonde houver trevas, que eu leve a luz.\n\nÓ Mestre, fazei que eu procure mais:\nconsolar, que ser consolado;\ncompreender, que ser compreendido;\namar, que ser amado.\n\nPois é dando que se recebe,\né perdoando que se é perdoado,\ne é morrendo que se vive para a Vida Eterna.\n\nAmém.",
        jaculatoria: "Paz e Bem! São Francisco de Assis, pacificai os nossos corações em Cristo!",
        botao_texto: "Rezar com São Francisco"
    },
    {
        id: "intencao-paz-santa-teresa",
        categoria_slug: "paz",
        intencao: "Paz na Alma & Serenidade",
        icone: "🕊️",
        cor: "emerald",
        santo_nome: "Santa Teresa de Jesus (d'Ávila)",
        santo_titulo: "Doutora Mística da Igreja e Mestra da Serenidade",
        santo_imagem: "assets/img/santos/10-15-santa-teresa-de-jesus-virgem-doutora-da-igreja-carmelita-descalca.png",
        por_que_padroeiro: "Ensinou que a oração é um 'trato íntimo de amizade com Quem sabemos que nos ama'. Carregava em seu breviário o famoso poema de serenidade que tranquiliza qualquer angústia interior.",
        titulo_oracao: "Nada te perturbe (Solo Dios Basta)",
        autor_fonte: "Santa Teresa de Jesus (Poema Místico, Carmelo Descalço)",
        texto_oracao: "Nada te perturbe,\nnada te espante,\ntudo passa,\nDeus não muda.\n\nA paciência tudo alcança.\nQuem a Deus tem,\nnada lhe falta:\nSó Deus basta!\n\nElevai vosso pensamento e ao céu subi;\npor nada vos inquieteis, nada vos turbe.\nSegui a Jesus Cristo com peito forte,\ne venha o que vier, nada vos espante.\n\nVedes a glória do mundo? É glória vã;\nnada tem de estável, tudo se acaba.\nAspirai ao celeste que dura sempre;\nrico de fé e de amor, só Deus basta.\n\nAmém.",
        jaculatoria: "Só Deus basta! Santa Teresa de Jesus, trazei serenidade à nossa alma!",
        botao_texto: "Rezar com Santa Teresa"
    },

    // 8. RELACIONAMENTOS & MATRIMÔNIO (Santo Antônio & São Rafael)
    {
        id: "intencao-relacionamentos-santo-antonio",
        categoria_slug: "relacionamentos",
        intencao: "Relacionamentos & Matrimônio",
        icone: "💍",
        cor: "vinho",
        santo_nome: "Santo Antônio de Pádua",
        santo_titulo: "Doutor da Igreja e Patrono do Amor Santo e dos Namorados",
        santo_imagem: "assets/img/santos/06-13-sao-antonio-de-padua-sacerdote-franciscano-e-.jpg",
        por_que_padroeiro: "Abençoava donzelas pobres com dotes para o matrimônio digno e reconciliava casais rompidos. É venerado como o intercessor para quem busca uma vocação matrimonial santa.",
        titulo_oracao: "Oração de Santo Antônio pela Harmonia e União Matrimonial",
        autor_fonte: "Tradição Devocional Antoniana Aprovada",
        texto_oracao: "Santo Antônio, que sois conhecido pela vossa bondade e pelo vosso coração sempre aberto aos aflitos que buscam o amor sincero e a concórdia no lar,\n\na vós entrego os meus sentimentos, meus relacionamentos e a minha vocação ao matrimônio.\n\nAfastai de nós as intrigas, a vaidade, a desconfiança e o egoísmo que destroem a união. Se é da vontade de Deus que eu viva a santidade no matrimônio, guiai-me ao encontro de uma pessoa virtuosa, temente a Deus e fiel, com quem eu possa construir uma família sólida sob os princípios do Evangelho.\n\nE àqueles que já estão unidos pelo santo sacramento do matrimônio, renovai a fidelidade, a paciência recíproca e o amor abnegado de Cristo por Sua Igreja.\n\nAmém.",
        jaculatoria: "Santo Antônio, abençoai o nosso amor e consolidai a paz em nosso relacionamento!",
        botao_texto: "Rezar com Santo Antônio"
    },
    {
        id: "intencao-relacionamentos-sao-rafael",
        categoria_slug: "relacionamentos",
        intencao: "Relacionamentos & Matrimônio",
        icone: "💍",
        cor: "vinho",
        santo_nome: "São Rafael Arcanjo",
        santo_titulo: "Guia Providencial dos Cônjuges e da Bênção Matrimonial",
        santo_imagem: "assets/img/santos/09-29-san-rafael-arcanjo.png",
        por_que_padroeiro: "No Livro de Tobias, o Arcanjo Rafael libertou Sara das forças malignas e conduziu Tobias ao casamento santo e protegido pela oração unânime de ambos diante de Deus.",
        titulo_oracao: "Oração a São Rafael para Encontrar e Proteger o Santo Matrimônio",
        autor_fonte: "Livro de Tobias (Tb 8, 4-8)",
        texto_oracao: "Senhor Deus de nossos pais, bendito seja o vosso Nome para sempre. Louvem-vos os céus e toda a vossa criação por todos os séculos!\n\nFizestes Adão do pó da terra e destes-lhe Eva por companheira e auxílio; e de ambos nasceu a estirpe humana. Vós dissestes: 'Não é bom que o homem esteja só; façamos-lhe uma companheira semelhante a ele'.\n\nAgora, Senhor, bem sabeis que não é por paixão desordenada que buscamos a união, mas com o desejo puro de fundar um lar que vos dê glória e onde reine a vossa santa Lei.\n\nEnviai-nos o vosso santo anjo Rafael para guardar nossos passos, afastar todo o mal e nos conceder a graça de envelhecermos juntos em mútua fidelidade e paz.\n\nAmém.",
        jaculatoria: "São Rafael Arcanjo, guiai os nossos passos para a união santa que agrada a Deus!",
        botao_texto: "Rezar com São Rafael"
    },

    // 9. NECESSIDADES URGENTES (Santo Expedito & Maria Desatadora dos Nós)
    {
        id: "intencao-urgentes-santo-expedito",
        categoria_slug: "urgentes",
        intencao: "Necessidades Urgentes & Aflições",
        icone: "⚡",
        cor: "vinho",
        santo_nome: "Santo Expedito",
        santo_titulo: "Mártir da Fé e Advogado das Causas de Última Hora",
        santo_imagem: "assets/img/santos/04-19-sao-expedito.png",
        por_que_padroeiro: "Comandante da legião romana martirizado sob Diocleciano. Ao converter-se, o demônio gritava 'Cras!' (Amanhã!), mas ele pisou no corvo gritando 'Hodie!' (Hoje!). É o padroeiro das soluções imediatas.",
        titulo_oracao: "Oração a Santo Expedito nas Causas Urgentes",
        autor_fonte: "Tradição Litúrgica e Piedade Romana",
        texto_oracao: "Meu Santo Expedito das causas justas e urgentes, intercedei por mim junto a Nosso Senhor Jesus Cristo, para que venha em meu socorro nesta hora de aflição e desespero.\n\nVós que sois um Santo Guerreiro, vós que sois o Santo dos Aflitos, vós que sois o Santo dos Desesperados, vós que sois o Santo das Causas Urgentes, protegei-me, ajudai-me, concedei-me força, coragem e serenidade.\n\nAtendei ao meu pedido com a rapidez que vos caracteriza. Ajudai-me a superar estas horas difíceis, protegei-me de todos os que me possam prejudicar, protegei a minha família e devolvei a paz ao meu coração.\n\nSerei agradecido pelo resto de minha vida e propagarei o vosso nome a todos os que tiverem fé.\n\nAmém.",
        jaculatoria: "Santo Expedito, atendei a nossa causa com presteza e socorrei-nos hoje mesmo!",
        botao_texto: "Rezar com Santo Expedito"
    },
    {
        id: "intencao-urgentes-desatadora",
        categoria_slug: "urgentes",
        intencao: "Necessidades Urgentes & Aflições",
        icone: "⚡",
        cor: "vinho",
        santo_nome: "Nossa Senhora Desatadora dos Nós",
        santo_titulo: "Mãe de Deus e Socorro nos Emaranhados da Vida",
        santo_imagem: "assets/img/santos/ns_nossa-senhora-desatadora-dos-nos.png",
        por_que_padroeiro: "Baseada na teologia de Santo Irineu: 'O nó da desobediência de Eva foi desatado pela obediência de Maria'. É invocada quando os problemas se emaranham de tal forma que parecem sem solução.",
        titulo_oracao: "Oração a Maria Desatadora dos Nós",
        autor_fonte: "Devocionário Mariano de Augsburgo (1700)",
        texto_oracao: "Santa Maria, cheia da presença de Deus, durante os dias de vossa vida aceitastes com toda a humildade a vontade do Pai, e o maligno nunca foi capaz de vos envolver com suas confusões.\n\nJunto a vosso Filho intercedestes por nossas dificuldades e, com exemplar paciência, nos destes o exemplo de como desenredar as linhas da nossa vida.\n\nAo vos constituir para sempre nossa Mãe, pondes em ordem e fazeis mais claros os laços que nos unem ao Senhor. Santa Maria, Mãe de Deus e nossa Mãe, a vós que com coração maternal desatais os nós que asfixiam a nossa vida, vos peço que acolhais em vossas mãos este nó que tanto me aflige.\n\nPor vossa graça e vosso poder de intercessão junto a Jesus, nosso Salvador, desatai este nó. Para a glória de Deus, e para sempre, desatai-o!\n\nAmém.",
        jaculatoria: "Nossa Senhora Desatadora dos Nós, rogai por nós e desatai as nossas aflições!",
        botao_texto: "Rezar com a Desatadora dos Nós"
    },

    // 10. AGRADECIMENTO & AÇÃO DE GRAÇAS (Sagrado Coração & Padre Pio)
    {
        id: "intencao-agradecimento-sagrado-coracao",
        categoria_slug: "agradecimento",
        intencao: "Agradecimento & Ação de Graças",
        icone: "❤️",
        cor: "vinho",
        santo_nome: "Sagrado Coração de Jesus",
        santo_titulo: "Fonte Inesgotável de Toda Graça e Misericórdia",
        santo_imagem: "assets/img/liturgia/cristo_bencao.jpg",
        por_que_padroeiro: "Centro do amor divino pelo homem. Todas as graças recebidas emanam do Coração trespassado de Cristo no Calvário e presente no Santíssimo Sacramento da Eucaristia.",
        titulo_oracao: "Hino Solene de Ação de Graças (Te Deum laudamus)",
        autor_fonte: "Liturgia das Horas (Atribuído a Santo Ambrósio e Santo Agostinho)",
        texto_oracao: "A Vós, ó Deus, louvamos; a Vós, Senhor, bendizemos!\nA Vós, eterno Pai, venera toda a Terra!\nA Vós os Anjos, os Céus e todas as Potestades clavam sem cessar:\n\nSanto, Santo, Santo é o Senhor Deus do Universo!\nOs céus e a terra estão cheios da majestade da vossa glória.\nO glorioso coro dos Apóstolos Vos louva,\na nobre falange dos Profetas Vos canta,\no fúlgido exército dos Mártires Vos glorifica.\n\nPor toda a redondeza da terra a Santa Igreja confessa o vosso Nome:\nPai de infinita majestade,\nadorável e verdadeiro Filho único,\ne o Santo Espírito consolador.\n\nVós sois o Rei da glória, ó Cristo; Vós sois o Filho eterno do Pai.\nSalvai o vosso povo, Senhor, e abençoai a vossa herança!\nDia a dia Vos bendizemos e louvamos o vosso Nome pelos séculos dos séculos.\n\nDignai-Vos, Senhor, guardar-nos neste dia sem pecado.\nTende piedade de nós, Senhor, tende piedade de nós!\nEm Vós esperei, ó Senhor: não serei confundido eternamente.\n\nAmém.",
        jaculatoria: "Coração de Jesus, que tanto nos amais, recebei a nossa filial e eterna gratidão!",
        botao_texto: "Rezar o Te Deum com Cristo"
    },
    {
        id: "intencao-agradecimento-padre-pio",
        categoria_slug: "agradecimento",
        intencao: "Agradecimento & Ação de Graças",
        icone: "❤️",
        cor: "vinho",
        santo_nome: "São Padre Pio de Pietrelcina",
        santo_titulo: "Frei Capuchinho, Estigmatizado e Apóstolo da Confiança",
        santo_imagem: "assets/img/santos/09-23-sao-pio-de-pietrelcina-presbitero.png",
        por_que_padroeiro: "Viveu em contínua oração de ação de graças mesmo nas dores atrozes dos estigmas de Cristo. Ensinava: 'Reza, espera e não te preocupes; Deus é misericordioso e ouvirá a tua prece'.",
        titulo_oracao: "Oração de Abandono e Gratidão de São Padre Pio",
        autor_fonte: "Testamentos Espirituais de São Pio de Pietrelcina",
        texto_oracao: "Fica comigo, Senhor, porque é preciso ter-Te presente para não Te esquecer. Sabes com que facilidade Te abandono.\n\nFica comigo, Senhor, porque sou fraco e preciso da Tua fortaleza para não cair tantas vezes. Fica comigo, Senhor, porque és a minha vida e sem Ti esmorece o meu fervor. Fica comigo, Senhor, para me dares a conhecer a Tua vontade.\n\nSenhor, hoje Te agradeço por todas as graças recebidas, visíveis e ocultas; pelas preces atendidas e também por aquelas que não foram concedidas conforme a minha vontade, mas segundo a Tua infinita sabedoria que sabe melhor o que é bom para mim.\n\nO meu passado, ó Senhor, confio-o à Tua Misericórdia; o meu presente, ao Teu Amor; e o meu futuro, à Tua Providência.\n\nAmém.",
        jaculatoria: "Reza, espera e não te preocupes! Obrigado, Senhor Jesus, por vosso amor infalível!",
        botao_texto: "Rezar com São Padre Pio"
    },

    // 11. EXAME DE CONSCIÊNCIA (Santo Inácio & São João Maria Vianney)
    {
        id: "intencao-exame-santo-inacio",
        categoria_slug: "exame",
        intencao: "Exame de Consciência & Perdão",
        icone: "🕯️",
        cor: "mariana",
        santo_nome: "Santo Inácio de Loyola",
        santo_titulo: "Fundador da Companhia de Jesus e Mestre do Discernimento",
        santo_imagem: "assets/img/santos/07-31-sao-inacio-de-loiola-presbitero-fundador-da-c.jpg",
        por_que_padroeiro: "Nos seus 'Exercícios Espirituais' formulou o método clássico do exame de consciência diário (gratidão, luz, revisão das faltas, perdão e emenda de vida).",
        titulo_oracao: "Método Inaciano de Exame de Consciência e Ato de Contrição",
        autor_fonte: "Exercícios Espirituais de Santo Inácio (n. 43) e Concílio de Trento",
        texto_oracao: "1. Agradecimento: Dou graças a Deus nosso Senhor pelos benefícios recebidos hoje.\n\n2. Luz do Espírito Santo: Peço graça para conhecer meus pecados e rejeitá-los com sincero arrependimento.\n\n3. Revisão do Dia: Examino a minha consciência desde a hora em que acordei até o momento presente: em pensamentos, em palavras, em obras e em omissões da caridade.\n\n4. Pedido de Perdão: Peço perdão a Deus nosso Senhor por todas as faltas cometidas, pela falta de paciência e pelo egoísmo.\n\n5. Propósito Firme de Emenda: Proponho com a graça divina não mais pecar e evitar as ocasiões de queda.\n\n(Ato de Contrição Perfeito)\nMeu Deus, eu me arrependo de todo o meu coração de vos ter ofendido, porque sois infinitamente bom e digno de ser amado sobre todas as coisas. Prometo firmemente, com a ajuda de vossa graça, fazer penitência, confessar-me, e nunca mais pecar. Meu Jesus, misericórdia!\n\nAmém.",
        jaculatoria: "Senhor Jesus Cristo, Filho de Deus vivo, tende compaixão de mim, que sou pecador!",
        botao_texto: "Fazer Exame com Santo Inácio"
    },
    {
        id: "intencao-exame-cura-d-ars",
        categoria_slug: "exame",
        intencao: "Exame de Consciência & Perdão",
        icone: "🕯️",
        cor: "mariana",
        santo_nome: "São João Maria Vianney (Cura d'Ars)",
        santo_titulo: "Padroeiro Universal dos Sacerdotes e Mestre da Confissão",
        santo_imagem: "assets/img/santos/08-04-sao-joao-maria-vianney-cura-de-ars-padroeiro-.jpg",
        por_que_padroeiro: "Passava até 16 horas por dia no confessionário acolhendo pecadores arrependidos com lágrimas de compaixão e levando milhares à santidade e à graça dos sacramentos.",
        titulo_oracao: "Oração do Cura d'Ars pelo Santo Arrependimento e Amor a Deus",
        autor_fonte: "São João Maria Vianney (Ato de Amor e Contrição)",
        texto_oracao: "Eu Vos amo, meu Deus, e o meu único desejo é amar-Vos até o último suspiro da minha vida.\n\nEu Vos amo, ó Deus infinitamente amável, e prefiro morrer amando-Vos a viver um só instante sem Vos amar. Amo-Vos, Senhor, e a única graça que Vos peço é a de amar-Vos eternamente.\n\nMeu Deus, se a minha língua não pode dizer a cada instante que Vos amo, quero que o meu coração o repita tantas vezes quantas respiro.\n\nDai-me a dor viva de ter ofendido a vossa infinita bondade. Concedei-me a lágrima do verdadeiro arrependimento que lava a alma e a prepara para o santo sacramento da Reconciliação.\n\nFazei-me a graça de morrer em vosso amor e sentindo que Vos amo.\n\nAmém.",
        jaculatoria: "Cura d'Ars, patrono dos confessores, alcançai-nos contrição perfeita e amor sincero a Deus!",
        botao_texto: "Rezar com o Cura d'Ars"
    }
];

fs.writeFileSync(targetFile, JSON.stringify(items, null, 2), 'utf8');
console.log(`✅ Sucesso: ${items.length} orações canônicas com imagens sacras do Santo do Dia gravadas em ${targetFile}!`);
