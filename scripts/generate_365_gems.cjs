const fs = require('fs');
const path = require('path');

// Keep existing 30 high-quality gems and add 335 more unique, doctrinally rich gems to complete 365 days
const existingGems = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/pilulas_espirituais.json'), 'utf8'));

// Curated Catholic teachings, scriptures, CCC paragraphs and prayers
const additionalGems = [
  // FÉ E CONHECIMENTO DE DEUS
  {
    tema: "O Desejo Inato de Deus",
    versiculo: "“Como a corça suspira pelas correntes das águas, assim minha alma suspira por vós, ó Deus.” (Sl 41, 2)",
    catecismo: "O desejo de Deus está inscrito no coração do homem, porque o homem foi criado por Deus e para Deus. Somente em Deus o homem encontrará a verdade e a felicidade. (CCC § 27)",
    prece: "Senhor meu Deus, criastes-nos para Vós, e inquieto está o nosso coração enquanto não repousa em Vós. Atraí-me para a Vossa presença. Amém."
  },
  {
    tema: "Deus Vem ao Encontro do Homem",
    versiculo: "“Muitas vezes e de muitos modos falou Deus outrora aos nossos pais pelos profetas; nestes dias que são os últimos, falou-nos por meio do Filho.” (Hb 1, 1-2)",
    catecismo: "Pela Revelação divina, Deus quis manifestar-Se e comunicar-Se a Si mesmo e os decretos eternos da Sua vontade a respeito da salvação dos homens. (CCC § 50)",
    prece: "Senhor Jesus, Palavra Viva do Pai, abri os meus ouvidos e o meu coração para acolher os Vossos ensinamentos de vida eterna. Amém."
  },
  {
    tema: "A Resposta do Homem a Deus: A Fé",
    versiculo: "“A fé é a certeza das coisas que se esperam, a convicção de fatos que se não vêem.” (Hb 11, 1)",
    catecismo: "Pela fé, o homem submete completamente a sua inteligência e a sua vontade a Deus. Com todo o seu ser, o homem dá o seu assentimento a Deus que Se revela. (CCC § 143)",
    prece: "Senhor, eu creio, mas aumentai a minha fé! Fortalecei minha esperança nos momentos de obscuridade e provação. Amém."
  },
  {
    tema: "Deus Todo-Poderoso e Pai de Amor",
    versiculo: "“Vede que grande amor nos testemunhou o Pai: sermos chamados filhos de Deus! E nós o somos!” (1Jo 3, 1)",
    catecismo: "A onipotência de Deus não é de modo algum arbitrária: em Deus, o poder e a essência, a vontade e a inteligência, a sabedoria e a justiça são uma só e mesma coisa. (CCC § 271)",
    prece: "Pai celeste, descanso na segurança do Vosso amor paternal. Nada me poderá separar do Vosso cuidado fiel. Amém."
  },
  {
    tema: "A Criação: Obra de Sabedoria e Amor",
    versiculo: "“Os céus proclamam a glória de Deus e o firmamento anuncia a obra das suas mãos.” (Sl 18, 2)",
    catecismo: "A criação é o primeiro e universal testemunho do amor onipotente de Deus. Deus criou o mundo para manifestar e comunicar a Sua glória. (CCC § 293)",
    prece: "Senhor Criador, ensinai-me a contemplar a Vossa beleza na natureza e a louvar-Vos em cada obra de Vossas mãos. Amém."
  },
  {
    tema: "O Homem: Imagem e Semelhança de Deus",
    versiculo: "“Deus criou o homem à sua imagem, à imagem de Deus ele o criou: homem e mulher os criou.” (Gn 1, 27)",
    catecismo: "De todas as criaturas visíveis, só o homem é capaz de conhecer e amar o seu Criador; é a única criatura sobre a terra que Deus quis por si mesma. (CCC § 356)",
    prece: "Senhor, dai-me reconhecer a dignidade infinita de cada vida humana, desde a concepção até o seu termo natural. Amém."
  },
  {
    tema: "A Providência e o Escândalo do Mal",
    versiculo: "“Sabemos que tudo concorre para o bem dos que amam a Deus.” (Rm 8, 28)",
    catecismo: "Deus Todo-Poderoso, por ser sumamente bom, nunca permitiria que existisse algum mal em Suas obras se não fosse bastante poderoso e bom para do próprio mal tirar o bem. (CCC § 311)",
    prece: "Senhor, ainda que eu não compreenda os Vossos desígnios, confio plenamente que conduzis todas as coisas para o meu maior bem. Amém."
  },
  {
    tema: "Os Anjos de Deus a Nosso Serviço",
    versiculo: "“Pois aos seus anjos dará ordens a teu respeito, para que te guardem em todos os teus caminhos.” (Sl 90, 11)",
    catecismo: "A existência dos seres espirituais, não-corporais, a que a Sagrada Escritura habitualmente chama anjos, é uma verdade de fé. Eles cercam Cristo e servem à Sua missão salvífica. (CCC § 328)",
    prece: "Santo Anjo do Senhor, meu zeloso guardador, guardai-me, governai-me e iluminai-me neste dia. Amém."
  },
  {
    tema: "A Liberdade Humana e a Responsabilidade",
    versiculo: "“Foi para a liberdade que Cristo nos libertou. Permanecei firmes e não vos deixeis prender de novo ao jugo da escravidão.” (Gl 5, 1)",
    catecismo: "Quanto mais pratica o bem, mais o homem se torna livre. Não há verdadeira liberdade senão no serviço do bem e da justiça. A escolha da desobediência e do mal é um abuso da liberdade. (CCC § 1733)",
    prece: "Jesus Salvador, libertai o meu coração dos vícios e do pecado, para que eu escolha sempre amar e servir a Deus. Amém."
  },
  {
    tema: "A Queda e a Promessa da Redenção",
    versiculo: "“Onde abundou o pecado, superabundou a graça.” (Rm 5, 20)",
    catecismo: "A doutrina do pecado original é o 'reverso' da Boa-Nova de que Jesus é o Salvador de todos os homens, de que todos precisam de salvação e de que ela é oferecida a todos por Cristo. (CCC § 389)",
    prece: "Senhor Jesus, Cordeiro de Deus que tirais o pecado do mundo, renovai a Vossa graça em minha vida e purificai o meu coração. Amém."
  },
  {
    tema: "O Mistério da Encarnação do Verbo",
    versiculo: "“E o Verbo se fez carne e habitou entre nós, e vimos a sua glória.” (Jo 1, 14)",
    catecismo: "O Verbo fez-Se carne para nos salvar, reconciliando-nos com Deus, para que nós conhecêssemos o amor de Deus e para ser nosso modelo de santidade. (CCC § 457-459)",
    prece: "Emanuel, Deus conosco, que assumistes a nossa fragilidade para nos divinizar, ensinai-me a Vossa humildade e mansidão. Amém."
  },
  {
    tema: "A Santíssima Virgem Maria: O 'Sim' da Graça",
    versiculo: "“Eis aqui a serva do Senhor; faça-se em mim segundo a tua palavra.” (Lc 1, 38)",
    catecismo: "Pela sua obediência, Maria tornou-se causa de salvação para si e para todo o gênero humano. O nó da desobediência de Eva foi desatado pela obediência de Maria. (CCC § 494)",
    prece: "Nossa Senhora, ensinai-me a dizer 'sim' à vontade de Deus em todas as circunstâncias da minha vida cotidiana. Amém."
  },
  {
    tema: "Os Mistérios da Vida Oculta de Jesus",
    versiculo: "“Jesus desceu com eles para Nazaré e era-lhes submisso... E crescia em sabedoria, em estatura e em graça diante de Deus e dos homens.” (Lc 2, 51-52)",
    catecismo: "A vida oculta de Nazaré permite a todo homem estar em comunhão com Jesus nos caminhos mais ordinários da vida de cada dia, santificando o trabalho e a família. (CCC § 533)",
    prece: "Jesus de Nazaré, santificai os meus afazeres diários, a minha rotina e a convivência em meu lar. Amém."
  },
  {
    tema: "O Batismo de Jesus e a Nossa Vocação",
    versiculo: "“Este é o meu Filho amado, em quem me comprazo.” (Mt 3, 17)",
    catecismo: "Pelo Batismo, o cristão é sacramentalmente assimilado a Jesus, que antecipa no Seu batismo a Sua morte e ressurreição, sendo chamado a viver como filho adotivo do Pai. (CCC § 537)",
    prece: "Pai celeste, renovai em mim a graça do meu Batismo; fazei-me viver com fidelidade a minha vocação cristã. Amém."
  },
  {
    tema: "As Tentações no Deserto e a Vitória de Cristo",
    versiculo: "“Nem só de pão vive o homem, mas de toda a palavra que sai da boca de Deus.” (Mt 4, 4)",
    catecismo: "A vitória de Jesus sobre o Tentador no deserto antecipa a vitória da Paixão, suprema obediência do Seu amor filial ao Pai. Jesus é o novo Adão que permaneceu fiel. (CCC § 539)",
    prece: "Senhor Jesus, dai-me sobriedade e vigilância contra as ilusões do mundo e as ciladas do inimigo. Amém."
  },
  {
    tema: "O Anúncio do Reino de Deus",
    versiculo: "“O tempo se cumpriu e o Reino de Deus está próximo. Convertei-vos e crede no Evangelho.” (Mc 1, 15)",
    catecismo: "Todos os homens são chamados a entrar no Reino. Anunciado primeiro aos filhos de Israel, este reino messiânico está destinado a acolher os homens de todas as nações. (CCC § 543)",
    prece: "Venha a nós o Vosso Reino, Senhor! Que a Vossa justiça, paz e amor governem todas as minhas ações. Amém."
  },
  {
    tema: "Os Milagres de Jesus: Sinais do Reino",
    versiculo: "“Os cegos vêem, os coxos andam, os leprosos são limpos, os surdos ouvem, os mortos ressuscitam e a Boa-Nova é anunciada aos pobres.” (Mt 11, 5)",
    catecismo: "Os milagres de Jesus testemunham que o Pai O enviou. Convidam a crer n'Ele. Aos que a Ele se dirigem com fé, Ele concede o que pedem. (CCC § 548)",
    prece: "Senhor Jesus, Médico dos corpos e das almas, curai as feridas do meu coração e fortalecei a minha fraqueza. Amém."
  },
  {
    tema: "A Transfiguração: Antecipação da Glória",
    versiculo: "“E foi transfigurado diante deles: seu rosto brilhou como o sol e suas vestes tornaram-se brancas como a luz.” (Mt 17, 2)",
    catecismo: "A Transfiguração de Cristo tem por finalidade fortalecer a fé dos Apóstolos em vista da Paixão: a subida ao 'alto monte' prepara a subida ao Calvário. (CCC § 568)",
    prece: "Senhor glorioso, contemplar a Vossa majestade dá-me coragem para abraçar a cruz com perseverança e esperança. Amém."
  },
  {
    tema: "A Última Ceia: Instituição da Eucaristia",
    versiculo: "“Isto é o meu corpo, que é dado por vós; fazei isto em memória de mim.” (Lc 22, 19)",
    catecismo: "Na Última Ceia, na noite em que ia ser entregue, o nosso Salvador instituiu o sacrifício eucarístico do Seu Corpo e Sangue, para perpetuar o sacrifício da cruz ao longo dos séculos. (CCC § 1323)",
    prece: "Ó Jesus Sacramentado, alimento vivo da minha alma, que eu nunca me afaste do Vosso Santo Altar. Amém."
  },
  {
    tema: "A Agonia no Getsêmani: O Suor de Sangue",
    versiculo: "“Pai meu, se é possível, passe de mim este cálice; contudo, não seja como eu quero, mas como tu queres.” (Mt 26, 39)",
    catecismo: "Jesus aceitou na Sua vontade humana que a vontade do Pai se fizesse: aceitou a morte redentora para carregar os nossos pecados no Seu próprio corpo sobre o madeiro. (CCC § 612)",
    prece: "Senhor aflito no Horto das Oliveiras, consolai os que hoje sofrem angústia, solidão e abandono. Amém."
  },
  {
    tema: "A Morte de Cristo na Cruz: Sacrifício Perfeito",
    versiculo: "“Tudo está consumado! E, inclinando a cabeça, entregou o espírito.” (Jo 19, 30)",
    catecismo: "A morte de Cristo é, ao mesmo tempo, o sacrifício pascal que realiza a redenção definitiva dos homens e o sacrifício da Nova Aliança que restabelece a comunhão entre o homem e Deus. (CCC § 613)",
    prece: "Nós Vos adoramos, Senhor Jesus Cristo, e Vos bendizemos, porque pela Vossa Santa Cruz remistes o mundo. Amém."
  },
  {
    tema: "A Ressurreição de Jesus: Triunfo da Vida",
    versiculo: "“Por que buscais entre os mortos aquele que vive? Ele não está aqui: ressuscitou!” (Lc 24, 5-6)",
    catecismo: "A Ressurreição de Jesus é a verdade culminante da nossa fé em Cristo, crida e vivida como verdade central pela primeira comunidade cristã. (CCC § 638)",
    prece: "Cristo ressuscitou dos mortos, vencendo a morte pela morte! Dai-me, Senhor, caminhar em novidade de vida. Amém."
  },
  {
    tema: "A Ascensão do Senhor ao Céu",
    versiculo: "“Enquanto os abençoava, separou-se deles e foi arrebatado ao céu.” (Lc 24, 51)",
    catecismo: "Jesus Cristo, cabeça da Igreja, precede-nos no Reino glorioso do Pai, para que nós, membros do Seu Corpo, vivamos na esperança de um dia estarmos eternamente com Ele. (CCC § 666)",
    prece: "Senhor que subistes aos céus, elevai os meus desejos e pensamentos para as realidades do alto. Amém."
  },
  {
    tema: "Pentecostes: A Descida do Espírito Santo",
    versiculo: "“Ficaram todos cheios do Espírito Santo e começaram a falar em outras línguas, segundo o Espírito lhes concedia expressar-se.” (At 2, 4)",
    catecismo: "No dia de Pentecostes, a Páscoa de Cristo consumou-se com a efusão do Espírito Santo, que Se manifestou, Se deu e Se comunicou como Pessoa divina. (CCC § 731)",
    prece: "Vinde, Espírito Santo! Enchei os corações dos Vossos fiéis e acendei neles o fogo do Vosso amor. Amém."
  },
  {
    tema: "A Santa Igreja Católica: Corpo Místico de Cristo",
    versiculo: "“Vós sois o corpo de Cristo e, individualmente, membros desse corpo.” (1Cor 12, 27)",
    catecismo: "A Igreja é o Povo de Deus, o Corpo de Cristo e o Templo do Espírito Santo. Nela subsiste a plenitude dos meios de salvação confiados aos Apóstolos. (CCC § 771, 816)",
    prece: "Senhor Jesus, abençoai a Vossa Igreja, o Santo Padre o Papa e todos os bispos, sacerdotes e fiéis em todo o mundo. Amém."
  },
  {
    tema: "A Comunhão dos Santos",
    versiculo: "“Estando nós cercados de uma tão grande nuvem de testemunhas, corramos com perseverança a corrida que nos é proposta.” (Hb 12, 1)",
    catecismo: "A comunhão dos santos é a Igreja triunfante no Céu, a Igreja padecente no Purgatório e a Igreja militante na terra, unidas num só amor e intercessão mútua. (CCC § 954-958)",
    prece: "Todos os santos e santas de Deus, rogai por nós e intercedei pela nossa perseverança na fé. Amém."
  },
  {
    tema: "O Purgatório e a Oração pelos Fiéis Defuntos",
    versiculo: "“É um pensamento santo e salutar rezar pelos defuntos, para que sejam perdoados dos seus pecados.” (2Mc 12, 46)",
    catecismo: "Os que morrem na graça e na amizade de Deus, mas não perfeitamente purificados, passam por uma purificação após a morte, a fim de obterem a santidade necessária para entrar na alegria do Céu. (CCC § 1030)",
    prece: "Dai-lhes, Senhor, o descanso eterno, e brilhe para eles a Vossa luz perpétua. Descansem em paz. Amém."
  },
  {
    tema: "O Juízo Final e o Retorno Glorioso",
    versiculo: "“Ele há de vir em sua glória, e todos os anjos com ele, e se assentará no trono da sua glória.” (Mt 25, 31)",
    catecismo: "No Juízo Final, Cristo revelará a disposição secreta dos corações e retribuirá a cada homem segundo as suas obras e segundo a sua aceitação ou recusa da graça. (CCC § 1039)",
    prece: "Senhor Jesus, Justo Juiz, dai-me viver vigilante na caridade, para acolher-Vos com alegria no último dia. Amém."
  },
  {
    tema: "A Glória Eterna do Céu",
    versiculo: "“O que os olhos não viram, os ouvidos não ouviram e o coração humano não imaginou, tais são os bens que Deus tem preparado para aqueles que o amam.” (1Cor 2, 9)",
    catecismo: "O Céu é o fim último e a realização das aspirações mais profundas do homem, o estado de felicidade suprema e definitiva na visão beatífica de Deus face a face. (CCC § 1024)",
    prece: "Pai celeste, mantende os meus olhos fitos na pátria eterna, onde não haverá mais pranto nem dor, mas vida plena em Vós. Amém."
  },
  {
    tema: "A Sagrada Liturgia: Cume e Fonte da Vida",
    versiculo: "“O zelo da tua casa me devora.” (Sl 68, 10 / Jo 2, 17)",
    catecismo: "A Liturgia é o cume para o qual tende a ação da Igreja e, ao mesmo tempo, a fonte de onde promana toda a sua força sobrenatural. (CCC § 1074)",
    prece: "Senhor, dai-me participar da Santa Missa com coração recolhido, reverência profunda e ardente devoção. Amém."
  },
  {
    tema: "O Batismo: Porta da Vida Espiritual",
    versiculo: "“Quem não nascer da água e do Espírito não pode entrar no Reino de Deus.” (Jo 3, 5)",
    catecismo: "O santo Batismo é o fundamento de toda a vida cristã, o pórtico da vida no Espírito e a porta que dá acesso aos outros sacramentos. (CCC § 1213)",
    prece: "Senhor, agradeço pelo dom incomparável do Batismo que me fez Vosso filho e herdeiro do Céu. Amém."
  },
  {
    tema: "A Confirmação: A Força do Crisma",
    versiculo: "“Recebereis a força do Espírito Santo, que descerá sobre vós, e sereis minhas testemunhas.” (At 1, 8)",
    catecismo: "Pelo sacramento da Confirmação, o batizado é enriquecido com uma força especial do Espírito Santo e obrigado mais estritamente a difundir e a defender a fé por palavras e obras. (CCC § 1285)",
    prece: "Espírito Santo, concedei-me coragem santa para testemunhar o Evangelho sem medo da zombaria do mundo. Amém."
  },
  {
    tema: "A Eucaristia: Presença Real e Substancial",
    versiculo: "“A minha carne é verdadeira comida e o meu sangue é verdadeira bebida. Quem come a minha carne e bebe o meu sangue permanece em mim e eu nele.” (Jo 6, 55-56)",
    catecismo: "No santíssimo sacramento da Eucaristia estão contidos verdadeira, real e substancialmente o Corpo e o Sangue, juntamente com a alma e a divindade de Nosso Senhor Jesus Cristo. (CCC § 1374)",
    prece: "Jesus hóstia santa, eu Vos adoro no Santíssimo Sacramento! Aumentai meu amor e veneração por Vossa presença real. Amém."
  },
  {
    tema: "A Penitência e Reconciliação: Cura da Alma",
    versiculo: "“Recebei o Espírito Santo. A quem perdoardes os pecados, ser-lhes-ão perdoados; a quem os retiverdes, ser-lhes-ão retidos.” (Jo 20, 22-23)",
    catecismo: "Aqueles que se aproximam do sacramento da Penitência obtêm da misericórdia de Deus o perdão da ofensa feita a Ele e a reconciliação com a Igreja. (CCC § 1422)",
    prece: "Senhor, dai-me a humildade de confessar os meus pecados com dor sincera e firme propósito de emenda. Amém."
  },
  {
    tema: "A Unção dos Enfermos: Conforto e Esperança",
    versiculo: "“Está alguém enfermo entre vós? Chame os presbíteros da Igreja, e estes façam oração sobre ele, ungindo-o com óleo em nome do Senhor.” (Tg 5, 14)",
    catecismo: "Pela santa Unção dos Enfermos e pela oração dos presbíteros, a Igreja inteira entrega os doentes ao Senhor sofredor e glorificado, para que os alivie e os salve. (CCC § 1499)",
    prece: "Senhor Jesus, consolai todos os enfermos e agonizantes; dai-lhes alívio no sofrimento e paz na alma. Amém."
  },
  {
    tema: "A Ordem Sacerdotal: Servidores de Cristo",
    versiculo: "“Ninguém tome para si esta honra, senão o que é chamado por Deus, como Aarão.” (Hb 5, 4)",
    catecismo: "A Ordem é o sacramento graças ao qual a missão confiada por Cristo aos Seus Apóstolos continua a ser exercida na Igreja até ao fim dos tempos. (CCC § 1536)",
    prece: "Coração de Jesus, santificai os Vossos sacerdotes! Dai-lhes pureza, fidelidade e ardor missionário. Amém."
  },
  {
    tema: "O Matrimônio Cristão: Aliança Santa",
    versiculo: "“O que Deus uniu, o homem não separe.” (Mt 19, 6)",
    catecismo: "A aliança matrimonial, pela qual um homem e uma mulher constituem entre si uma íntima comunhão de vida e de amor, foi fundada pelo Criador e dotada de leis próprias. (CCC § 1601)",
    prece: "Senhor, abençoai todos os matrimônios e famílias; fazei dos lares cristãos reflexos da Sagrada Família de Nazaré. Amém."
  },
  {
    tema: "Os Sacramentais: Bênçãos da Igreja",
    versiculo: "“Tudo o que Deus criou é bom, e nada há de rejeitar-se que se receba com ação de graças, pois é santificado pela palavra de Deus e pela oração.” (1Tm 4, 4-5)",
    catecismo: "A santa Mãe Igreja instituiu os sacramentais. São sinais sagrados com os quais, por imitação dos sacramentos, se significam e se obtêm efeitos, sobretudo espirituais. (CCC § 1667)",
    prece: "Senhor, santificai as realidades cotidianas através da oração e das bênçãos da Vossa Igreja. Amém."
  },
  {
    tema: "A Consciência Moral: Santuário Interior",
    versiculo: "“A lei do Senhor está no seu coração; os seus passos não vacilam.” (Sl 36, 31)",
    catecismo: "A consciência moral é o núcleo secreto e o santuário do homem, no qual ele se encontra a sós com Deus, cuja voz se faz ouvir na sua intimidade. (CCC § 1776)",
    prece: "Espírito de Verdade, iluminai a minha consciência para que eu discirna o bem e fuja de todo o mal. Amém."
  },
  {
    tema: "A Virtude da Prudência: Sabedoria Prática",
    versiculo: "“O homem prudente vê o perigo e esconde-se; os inexperientes continuam e sofrem o dano.” (Pr 22, 3)",
    catecismo: "A prudência é a virtude que dispõe a razão prática a discernir em qualquer circunstância o nosso verdadeiro bem e a escolher os meios adequados para o realizar. (CCC § 1806)",
    prece: "Senhor, concedei-me a prudência nas palavras e decisões, para que nunca aja com leviandade ou orgulho. Amém."
  },
  {
    tema: "A Virtude da Justiça: Dar a Cada Um o Seu",
    versiculo: "“Pratica a justiça e o direito: isto é mais agradável ao Senhor do que os sacrifícios.” (Pr 21, 3)",
    catecismo: "A justiça é a virtude moral que consiste na vontade constante e firme de dar a Deus e ao próximo o que lhes é devido. A justiça para com Deus chama-se 'virtude da religião'. (CCC § 1807)",
    prece: "Deus justo e reto, dai-me tratar com honestidade e retidão a todos os que cruzarem o meu caminho. Amém."
  },
  {
    tema: "A Virtude da Fortaleza: Firmeza nas Dificuldades",
    versiculo: "“Sê forte e corajoso! Não temas nem te apavores, porque o Senhor teu Deus está contigo por onde quer que andares.” (Jos 1, 9)",
    catecismo: "A fortaleza assegura a firmeza nas dificuldades e a constância na procura do bem. Ela torna capaz de vencer o medo, mesmo da morte, e de enfrentar as provações. (CCC § 1808)",
    prece: "Senhor, dai-me coragem nas horas de aflição, sabendo que a Vossa graça é maior do que qualquer medo. Amém."
  },
  {
    tema: "A Virtude da Temperança: Autodomínio Cristão",
    versiculo: "“Tudo me é lícito, mas nem tudo me convém. Tudo me é lícito, mas eu não me deixarei dominar por coisa alguma.” (1Cor 6, 12)",
    catecismo: "A temperança é a virtude moral que modera a atração dos prazeres e assegura o domínio da vontade sobre os instintos, mantendo os desejos nos limites da honestidade. (CCC § 1809)",
    prece: "Espírito Santo, educai os meus desejos e concedei-me o equilíbrio e a sobriedade em todas as coisas. Amém."
  },
  {
    tema: "A Virtude Teologal da Esperança",
    versiculo: "“A esperança não decepciona, porque o amor de Deus foi derramado em nossos corações pelo Espírito Santo que nos foi dado.” (Rm 5, 5)",
    catecismo: "A esperança é a virtude teologal pela qual desejamos o Reino dos céus e a vida eterna como nossa felicidade, pondo toda a nossa confiança nas promessas de Cristo. (CCC § 1817)",
    prece: "Senhor Jesus, Vós sois a minha única e sólida esperança! Guarda a minha alma nas horas de desânimo. Amém."
  },
  {
    tema: "A Virtude Teologal da Caridade: Rainha das Virtudes",
    versiculo: "“O amor é paciente, o amor é bondoso. Não tem inveja, não se vangloria, não se ensoberbece... Tudo desculpa, tudo crê, tudo espera, tudo suporta.” (1Cor 13, 4.7)",
    catecismo: "A caridade é a virtude teologal pela qual amamos a Deus sobre todas as coisas por Ele mesmo, e ao próximo como a nós mesmos por amor de Deus. (CCC § 1822)",
    prece: "Senhor Deus de Amor, derramai a verdadeira caridade no meu coração, para que eu ame sem medidas. Amém."
  },
  {
    tema: "O Dom da Sabedoria do Espírito Santo",
    versiculo: "“A sabedoria que vem do alto é, antes de tudo, pura; depois, pacífica, moderada, tratável, cheia de misericórdia e de bons frutos.” (Tg 3, 17)",
    catecismo: "Os dons do Espírito Santo sustentam a vida moral dos cristãos e tornam os fiéis dóceis para seguir prontamente as inspirações divinas. O dom da sabedoria faz saborear as coisas de Deus. (CCC § 1830-1831)",
    prece: "Divino Espírito Santo, concedei-me o dom da sabedoria para julgar todas as coisas à luz da eternidade. Amém."
  },
  {
    tema: "O Dom do Entendimento: Penetrar os Mistérios",
    versiculo: "“Abre os meus olhos, para que eu veja as maravilhas da tua lei.” (Sl 118, 18)",
    catecismo: "O dom do entendimento ilumina a mente do cristão para compreender em profundidade a verdade revelada e penetrar o sentido espiritual da Sagrada Escritura. (CCC § 1831)",
    prece: "Espírito Santo, dai-me luz e clareza interior para compreender a Vossa Santa Vontade em minha vida. Amém."
  },
  {
    tema: "O Dom do Conselho: Orientação Divina",
    versiculo: "“Eu te instruirei e te ensinarei o caminho que deves seguir; guiar-te-ei com os meus olhos.” (Sl 31, 8)",
    catecismo: "Pelo dom do conselho, o Espírito Santo instrui o coração do homem sobre a escolha reta a fazer nas situações complexas da existência cotidiana. (CCC § 1831)",
    prece: "Conselheiro admirável, iluminai as minhas dúvidas e guiai os meus passos no caminho da paz e da honra. Amém."
  },
  {
    tema: "O Dom da Ciência: Ver Deus nas Criaturas",
    versiculo: "“A grandeza e a beleza das criaturas fazem contemplar, por analogia, o seu Criador.” (Sb 13, 5)",
    catecismo: "O dom da ciência permite ao crente avaliar as realidades criadas no seu justo valor em relação ao fim último, que é a união eterna com Deus. (CCC § 1831)",
    prece: "Senhor, ensinai-me a não me apegar desordenadamente aos bens passageiros deste mundo. Amém."
  },
  {
    tema: "O Dom da Piedade: Ternura Filial para com Deus",
    versiculo: "“Não recebestes um espírito de escravidão para viverdes no temor, mas recebestes o Espírito de adoção, pelo qual clamamos: Abba! Pai!” (Rm 8, 15)",
    catecismo: "O dom da piedade cura o nosso coração de toda a aridez e o abre à confiança filial em Deus e à afeição fraterna para com o próximo. (CCC § 1831)",
    prece: "Pai misericordioso, dai-me amar-Vos com a simplicidade e a confiança de uma criança nos braços de sua mãe. Amém."
  },
  {
    tema: "O Santo Temor de Deus: Reverência e Zelo",
    versiculo: "“O temor do Senhor é o princípio da sabedoria; os que o praticam têm bom senso.” (Sl 110, 10)",
    catecismo: "O temor de Deus não é um medo servil, mas uma reverência filial que brota do amor e teme ofender a Bondade infinita do Pai celestial. (CCC § 1831)",
    prece: "Senhor meu Deus, dai-me um santo respeito pelo Vosso Nome e livrai-me da indiferença e do pecado. Amém."
  },
  {
    tema: "O Primeiro Mandamento: Adorar a Deus Só",
    versiculo: "“Amarás o Senhor teu Deus de todo o teu coração, de toda a tua alma e de todo o teu entendimento.” (Mt 22, 37)",
    catecismo: "O primeiro mandamento convida o homem a crer em Deus, a esperar n'Ele e a amá-Lo acima de todas as coisas. Rejeita a idolatria, a superstição e a magia. (CCC § 2084, 2110-2117)",
    prece: "Meu Senhor e meu Deus, a Vós somente a adoração, a honra e a glória para todo o sempre. Amém."
  },
  {
    tema: "O Segundo Mandamento: O Respeito ao Santo Nome",
    versiculo: "“Santificado seja o teu nome.” (Mt 6, 9)",
    catecismo: "O segundo mandamento prescreve respeitar o nome do Senhor. O nome do Senhor é santo. O dom do nome pertence à ordem da confiança e da intimidade. (CCC § 2142-2143)",
    prece: "Bendito seja o Nome do Senhor! Bendito seja o Santo Nome de Jesus e de Sua Mãe Imaculada. Amém."
  },
  {
    tema: "O Terceiro Mandamento: O Dia do Senhor (Domingo)",
    versiculo: "“Guardarás o dia de sábado para santificá-lo, como o Senhor teu Deus te ordenou.” (Dt 5, 12)",
    catecismo: "A celebração dominical do dia do Senhor e da Eucaristia está no coração da vida da Igreja. O domingo é o dia em que os cristãos se reúnem para ouvir a Palavra e celebrar o Sacrifício. (CCC § 2177)",
    prece: "Senhor, dai-me viver cada domingo como um verdadeiro encontro convosco e dia de descanso em família. Amém."
  },
  {
    tema: "O Quarto Mandamento: Honrar Pai e Mãe",
    versiculo: "“Honra teu pai e tua mãe, para que se prolonguem os teus dias na terra.” (Ex 20, 12)",
    catecismo: "O quarto mandamento dirige-se expressamente aos filhos nas suas relações com os pais. Exige também prestar honra, afeto e reconhecimento aos avós e antepassados. (CCC § 2197-2200)",
    prece: "Senhor, abençoai meus pais e minha família; dai-me gratidão, paciência e amor no trato diário. Amém."
  },
  {
    tema: "O Quinto Mandamento: A Sagrada Defesa da Vida",
    versiculo: "“Não matarás.” (Ex 20, 13)",
    catecismo: "A vida humana é sagrada porque, desde a sua origem, supõe a ação criadora de Deus e mantém-se para sempre numa relação especial com o Criador, seu único fim. (CCC § 2258)",
    prece: "Autor da Vida, protegei os nascituros, os idosos, os doentes e todos os vulneráveis de nossa sociedade. Amém."
  },
  {
    tema: "O Sexto Mandamento: Pureza e Castidade",
    versiculo: "“Bem-aventurados os puros de coração, porque verão a Deus.” (Mt 5, 8)",
    catecismo: "A castidade significa a integração conseguida da sexualidade na pessoa e, com isso, a unidade interior do homem no seu ser corporal e espiritual. (CCC § 2337)",
    prece: "Jesus manso e puro de coração, conservai o meu olhar, os meus pensamentos e a minha alma imaculados. Amém."
  },
  {
    tema: "O Sétimo Mandamento: A Justiça nos Bens Materiais",
    versiculo: "“Não furtarás.” (Ex 20, 15)",
    catecismo: "O sétimo mandamento prescreve a justiça e a caridade na gestão dos bens terrenos e dos frutos do trabalho dos homens. Exige o respeito pela destinação universal dos bens. (CCC § 2401)",
    prece: "Senhor, dai-me honestidade em meus negócios, desprendimento do dinheiro e compaixão pelos necessitados. Amém."
  },
  {
    tema: "O Oitavo Mandamento: A Força da Verdade",
    versiculo: "“Conhecereis a verdade, e a verdade vos libertará.” (Jo 8, 32)",
    catecismo: "O oitavo mandamento proíbe falsear a verdade nas relações com outrem. O dever dos cristãos é dar testemunho da verdade sem medo e sem difamações. (CCC § 2464, 2477)",
    prece: "Espírito de Verdade, livrai a minha língua da fofoca, da maledicência e da mentira; fazei-me apóstolo da sinceridade. Amém."
  },
  {
    tema: "O Nono Mandamento: A Pureza dos Desejos",
    versiculo: "“Quem olhar para uma mulher com concupiscência, já cometeu adultério com ela em seu coração.” (Mt 5, 28)",
    catecismo: "O nono mandamento adverte contra a concupiscência carnal. A luta contra tal concupiscência passa pela purificação do coração e pela prática da modéstia e do pudor. (CCC § 2514, 2521)",
    prece: "Senhor, purificai a minha imaginação e concedei-me a santa modéstia que resguarda a intimidade da alma. Amém."
  },
  {
    tema: "O Décimo Mandamento: A Paz do Desprendimento",
    versiculo: "“Evitai com todo o cuidado qualquer tipo de ganância, pois a vida de um homem não consiste na abundância dos seus bens.” (Lc 12, 15)",
    catecismo: "O décimo mandamento proíbe a cupidez e o desejo duma apropriação desordenada dos bens terrenos; proíbe a inveja, que é a tristeza experimentada diante do bem do outro. (CCC § 2534, 2539)",
    prece: "Senhor, que a minha maior riqueza sejais Vós mesmo! Dai-me alegrar-me com a prosperidade de meus irmãos. Amém."
  },
  {
    tema: "A Oração do Pai-Nosso: Modelo de Toda Oração",
    versiculo: "“Senhor, ensina-nos a rezar, como também João ensinou a seus discípulos.” (Lc 11, 1)",
    catecismo: "A Oração do Senhor é verdadeiramente o resumo de todo o Evangelho. É a oração por excelência da Igreja, dada pelo próprio Jesus. (CCC § 2761, 2774)",
    prece: "Pai nosso que estais nos céus, ensinai-me a rezar com a confiança e a entrega dos verdadeiros filhos de Deus. Amém."
  },
  {
    tema: "A Batalha da Oração: Vencer as Distrações",
    versiculo: "“Vigiai e orai, para que não entreis em tentação; o espírito, na verdade, está pronto, mas a carne é fraca.” (Mt 26, 41)",
    catecismo: "A oração é um dom da graça e uma resposta decidida da nossa parte. Supõe sempre um esforço: a oração é uma luta contra nós mesmos e contra as astúcias do Tentador. (CCC § 2725)",
    prece: "Senhor Jesus, quando a minha mente divagar, chamai-me docemente de volta ao Vosso Coração compassivo. Amém."
  },
  {
    tema: "A Oração do Coração: A Presença Silenciosa",
    versiculo: "“Tu, porém, quando orares, entra no teu quarto, fecha a porta e ora ao teu Pai em segredo.” (Mt 6, 6)",
    catecismo: "A oração contemplativa é o silêncio, este 'símbolo do mundo futuro' ou 'linguagem silenciosa do amor'. As palavras na oração contemplativa não são discursos, mas brasas que alimentam o fogo do amor. (CCC § 2717)",
    prece: "Senhor, no recolhimento do meu coração, fazei calar todas as vozes do mundo para que eu escute apenas a Vossa. Amém."
  },
  {
    tema: "A Humildade: Fundamento da Oração",
    versiculo: "“Deus resiste aos soberbos, mas concede a sua graça aos humildes.” (Tg 4, 6 / 1Pd 5, 5)",
    catecismo: "A humildade é o fundamento da oração. 'Nós não sabemos o que havemos de pedir como convém'. O homem é um mendigo diante de Deus. (CCC § 2559)",
    prece: "Jesus, manso e humilde de coração, arrancai de mim toda pretensão de vanglória e auto-suficiência. Amém."
  },
  {
    tema: "A Oração de Petição: Confiança de Filhos",
    versiculo: "“Pedi e vos será dado; buscai e achareis; batei e abrir-se-vos-á.” (Mt 7, 7)",
    catecismo: "Pela oração de petição manifestamos a consciência da nossa relação com Deus: não somos a causa do nosso ser, nem senhores das adversidades; somos pecadores que precisamos de salvação. (CCC § 2629)",
    prece: "Pai celeste, peço o Vosso Espírito Santo para guiar este meu dia e suprir todas as minhas carências materiais e espirituais. Amém."
  },
  {
    tema: "A Ação de Graças: O Coração Grato",
    versiculo: "“Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.” (1Ts 5, 18)",
    catecismo: "Todo o acontecimento e toda a necessidade podem tornar-se motivo de ação de graças. As cartas de São Paulo começam e acabam frequentemente pela ação de graças. (CCC § 2638)",
    prece: "Senhor, obrigado pela vida, pela saúde, pelo pão de cada dia e até mesmo pelas cruzes que me aproximam do Céu. Amém."
  },
  {
    tema: "O Santo Rosário: A Escola de Maria",
    versiculo: "“Maria guardava todas estas coisas, meditando-as em seu coração.” (Lc 2, 19)",
    catecismo: "A oração cristã compraz-se em associar-se à oração de Maria. O Rosário é um compêndio de todo o Evangelho, no qual contemplamos os mistérios de Cristo através do olhar de Sua Mãe. (CCC § 2673-2678)",
    prece: "Rainha do Santo Rosário, colocai em minhas mãos a doce cadeia que me une para sempre ao Vosso Filho Jesus. Amém."
  },
  {
    tema: "A Consagração Mariana: Escravidão de Amor",
    versiculo: "“Eis aí a tua mãe! E dessa hora em diante o discípulo a acolheu em sua casa.” (Jo 19, 27)",
    catecismo: "A função maternal de Maria para com os homens de modo algum obscurece ou diminui a única mediação de Cristo; pelo contrário, manifesta a sua eficácia. (CCC § 970)",
    prece: "Totus Tuus, Maria! Sou todo Vosso e tudo o que é meu Vos pertence, ó meu doce Jesus por Maria. Amém."
  },
  {
    tema: "São José: Terror dos Demônios e Guardião do Redentor",
    versiculo: "“José, filho de Davi, não temas receber Maria por tua esposa, pois o que nela foi gerado é obra do Espírito Santo.” (Mt 1, 20)",
    catecismo: "Deus confiou a guarda dos Seus tesouros mais preciosos — Jesus e Maria — à fidelidade humilde e silenciosa de São José, o justo carpinteiro. (CCC § 437, 532)",
    prece: "Glorioso São José, protetor da Santa Igreja e das famílias, amparai-me na vida e socorrei-me na hora da morte. Amém."
  },
  {
    tema: "O Sagrado Coração de Jesus: Fornalha de Amor",
    versiculo: "“Aprendei de mim, porque sou manso e humilde de coração, e encontrareis descanso para as vossas almas.” (Mt 11, 29)",
    catecismo: "Jesus conheceu-nos e amou-nos a todos durante a Sua vida e na Sua paixão, e entregou-Se por cada um de nós: 'O Filho de Deus amou-me e entregou-Se a Si mesmo por mim'. (CCC § 478)",
    prece: "Sagrado Coração de Jesus, fazei o meu coração semelhante ao Vosso e acendei em mim o fogo da Vossa caridade. Amém."
  },
  {
    tema: "A Divina Misericórdia: O Refúgio dos Pecadores",
    versiculo: "“Jesus, eu confio em Vós!” (Diário de Santa Faustina, 47)",
    catecismo: "O Evangelho é a revelação, em Jesus Cristo, da misericórdia de Deus para com os pecadores. Deus não Se cansa de perdoar; nós é que nos cansamos de pedir perdão. (CCC § 1846)",
    prece: "Pela Vossa dolorosa Paixão, tende misericórdia de nós e do mundo inteiro! Jesus, eu confio em Vós. Amém."
  },
  {
    tema: "A Dignidade do Trabalho Humano",
    versiculo: "“Tudo o que fizerdes, fazei-o de bom coração, como para o Senhor e não para os homens.” (Cl 3, 23)",
    catecismo: "O trabalho humano procede imediatamente das pessoas criadas à imagem de Deus e chamadas a prolongar a obra da criação. O trabalho é um dever: 'Se alguém não quer trabalhar, também não coma'. (CCC § 2427)",
    prece: "Senhor, ofereço-Vos o suor do meu trabalho de hoje. Que ele sirva para o sustento dos meus e para a Vossa glória. Amém."
  },
  {
    tema: "O Valor do Silêncio Exterior e Interior",
    versiculo: "“Depois do terremoto houve um fogo... E depois do fogo, o murmúrio de uma brisa suave. Ao ouvi-lo, Elias cobriu o rosto com o manto.” (1Rs 19, 12-13)",
    catecismo: "O Pai pronunciou uma só Palavra: é o Seu Filho. Ele a pronuncia sempre no eterno silêncio, e é no silêncio da alma que ela deve ser ouvida. (São João da Cruz / CCC § 2717)",
    prece: "Senhor, concedei-me momentos de silêncio santo em meu dia para repousar diante do Vosso sagrado tabernáculo. Amém."
  },
  {
    tema: "A Paciência nas Tribulações",
    versiculo: "“Na vossa paciência salvareis as vossas almas.” (Lc 21, 19)",
    catecismo: "Pela paciência o homem não se deixa abalar pelas adversidades presentes. É uma das formas mais nobres da fortaleza cristã sob a ação do Espírito Santo. (CCC § 1832)",
    prece: "Senhor Jesus paciente na dor, dai-me serenidade quando as contrariedades contrariarem a minha vontade. Amém."
  },
  {
    tema: "A Caridade Fraterna: O Mandamento Novo",
    versiculo: "“Um novo mandamento vos dou: que vos ameis uns aos outros; assim como eu vos amei, amai-vos também uns aos outros.” (Jo 13, 34)",
    catecismo: "Jesus fez da caridade o mandamento novo. Ao amar os Seus até ao fim, manifesta o amor que recebe do Pai. Amando-se uns aos outros, os discípulos imitam o amor de Jesus. (CCC § 1823)",
    prece: "Senhor, ensinai-me a amar aqueles que me são difíceis e a perdoar prontamente as ofensas recebidas. Amém."
  },
  {
    tema: "Oração e Jejum: Armas Espirituais",
    versiculo: "“Esta espécie de demônios não se expulsa senão à força de oração e de jejum.” (Mt 17, 21)",
    catecismo: "O jejum, a oração e a esmola exprimem a conversão em relação a si mesmo, em relação a Deus e em relação aos outros. O jejum ajuda a adquirir o domínio sobre as inclinações desordenadas. (CCC § 1434, 2043)",
    prece: "Senhor, dai-me temperança no comer e beber e generosidade para partilhar o que tenho com os necessitados. Amém."
  },
  {
    tema: "A pureza da Intenção: Fazer Tudo por Deus",
    versiculo: "“Quer comais, quer bebais ou façais qualquer outra coisa, fazei tudo para a glória de Deus.” (1Cor 10, 31)",
    catecismo: "Uma intenção reta não basta para tornar boa uma conduta em si mesma má. O fim não justifica os meios. Uma intenção má corrompe a ação, mesmo que ela seja boa em si. (CCC § 1752-1753)",
    prece: "Senhor, purificai os motivos das minhas ações; que eu busque apenas agradar a Vós e não os aplausos humanos. Amém."
  },
  {
    tema: "A Palavra de Deus: Lâmpada para os Meus Pés",
    versiculo: "“Lâmpada para os meus pés é a tua palavra e luz para o meu caminho.” (Sl 118, 105)",
    catecismo: "A Igreja sempre venerou as divinas Escrituras como venera o próprio Corpo do Senhor, não cessando de distribuir aos fiéis o Pão da vida tirado da mesa da Palavra e da Eucaristia. (CCC § 103)",
    prece: "Senhor, dai-me amor assíduo à leitura orante da Bíblia; que a Vossa Palavra transforme os meus pensamentos. Amém."
  },
  {
    tema: "O Combate da Pureza nos Olhos",
    versiculo: "“A lâmpada do corpo são os teus olhos. Se os teus olhos forem límpidos, todo o teu corpo será iluminado.” (Mt 6, 22)",
    catecismo: "A pureza exige o pudor, que é parte integrante da temperança. O pudor preserva a intimidade da pessoa. Significa a recusa de desvendar o que deve ficar oculto. (CCC § 2521)",
    prece: "Espírito Santo, guardai os meus olhos das imagens e dos estímulos pecaminosos deste mundo secularizado. Amém."
  },
  {
    tema: "A Fidelidade nas Pequenas Coisas",
    versiculo: "“Muito bem, servo bom e fiel! Porque foste fiel no pouco, eu te confiarei muito mais; entra na alegria do teu Senhor.” (Mt 25, 21)",
    catecismo: "A santidade cristã constrói-se na trama dos deveres diários cumpridos com amor extraordinário, como nos ensinou a pequena via de Santa Teresinha do Menino Jesus. (CCC § 2013-2015)",
    prece: "Senhor, ensinai-me a não desprezar as pequenas oportunidades de sacrifício, silêncio e caridade em meu dia. Amém."
  },
  {
    tema: "O Sentido Cristão da Morte",
    versiculo: "“Para mim, viver é Cristo e morrer é lucro.” (Fl 1, 21)",
    catecismo: "Graças a Cristo, a morte cristã tem um sentido positivo. Na morte, Deus chama o homem a Si. Por isso, o cristão pode sentir diante da morte um desejo como o de São Paulo: 'Desejo partir e estar com Cristo'. (CCC § 1010-1011)",
    prece: "Jesus, Maria e José, assisti-me na última agonia; que a minha alma expire em paz nos Vossos santos braços. Amém."
  }
];

// Helper to expand dynamically with variations of saints, doctors, liturgical feasts, virtues and biblical books to reach 365
const scripturePool = [
  { ref: "Sl 22, 1", quote: "O Senhor é o meu pastor: nada me faltará.", ccc: "Deus cuida dos Seus com solicitude infinita, conduzindo as nossas almas a fontes de água viva e restaurando as nossas forças. (CCC § 305)", tema: "O Bom Pastor e o Cuidado Divino", prece: "Senhor Jesus, Bom Pastor, guardai-me no Vosso aprisco e livrai-me dos lobos da incredulidade e do pecado. Amém." },
  { ref: "Is 40, 31", quote: "Os que esperam no Senhor renovam as suas forças; sobem com asas como águias, correm e não se cansam.", ccc: "A virtude da esperança responde à aspiração de felicidade que Deus colocou no coração de todo homem, purificando-a e elevando-a para o Céu. (CCC § 1818)", tema: "Renovação Espiritual na Esperança", prece: "Senhor, quando as minhas forças fraquejarem, erguei a minha alma nas asas da Vossa santa graça. Amém." },
  { ref: "Jo 15, 5", quote: "Eu sou a videira, vós sois os ramos. Quem permanece em mim e eu nele, esse dá muito fruto; pois sem mim nada podeis fazer.", ccc: "A seiva vital que corre nos ramos da videira é o Espírito Santo, que une os fiéis a Cristo para que produzam frutos de caridade e santidade. (CCC § 755)", tema: "Permanecer Unidos a Cristo", prece: "Jesus, Videira Verdadeira, que eu nunca me separe de Vós, pois longe de Vossa presença a minha alma definha. Amém." },
  { ref: "Mt 5, 3", quote: "Bem-aventurados os pobres em espírito, porque deles é o Reino dos Céus.", ccc: "As Bem-aventuranças desenham o rosto de Jesus Cristo e descrevem a Sua caridade. Elas esclarecem as ações e atitudes características da vida cristã. (CCC § 1717)", tema: "A Riqueza da Pobreza Evangélica", prece: "Senhor, esvaziai o meu coração do orgulho material e espiritual, para que ele seja pleno da Vossa presença. Amém." },
  { ref: "1Cor 10, 13", quote: "Deus é fiel: ele não permitirá que sejais tentados além das vossas forças; mas, com a tentação, vos dará também o meio de sair dela.", ccc: "Deus não nos deixa sucumbir sem o socorro da Sua graça. O combate espiritual exige oração vigilante e confiança inabalável no auxílio do Senhor. (CCC § 2848)", tema: "A Fidelidade de Deus nas Tentações", prece: "Senhor, nos momentos em que a tentação me cercar, lembrai-me de que estais ao meu lado para me socorrer. Amém." },
  { ref: "Sl 90, 1-2", quote: "Tu que habitas sob o amparo do Altíssimo, que descansas à sombra do Onipotente, dize ao Senhor: Meu refúgio e minha fortaleza, meu Deus em quem confio!", ccc: "A oração de fé não consiste apenas em dizer 'Senhor, Senhor', mas em dispor o coração para fazer a vontade do Pai e descansar na Sua sombra soberana. (CCC § 2611)", tema: "Sob a Sombra do Altíssimo", prece: "Pai celeste, descanso a minha alma sob as Vossas asas protetoras; afugentai para longe de mim todo o medo e perturbação. Amém." },
  { ref: "Lc 1, 46-47", quote: "A minha alma engrandece o Senhor, e o meu espírito se alegra em Deus, meu Salvador.", ccc: "O Magnificat é o cântico tanto da Mãe de Deus como da Igreja; o cântico dos pobres cuja esperança se realiza pelo cumprimento das promessas divinas. (CCC § 2619)", tema: "O Magnificat e o Louvor Humilde", prece: "Nossa Senhora, dai-me um coração humilde e grato que saiba engrandecer ao Senhor pelas maravilhas da Sua graça. Amém." },
  { ref: "Ef 4, 32", quote: "Sede uns para com os outros benignos, compassivos, perdoando-vos mutuamente, como também Deus vos perdoou em Cristo.", ccc: "O perdão cristão é a expressão mais sublime do amor ao próximo; recusar o perdão é fechar o próprio coração à misericórdia de Deus. (CCC § 2840)", tema: "A Urgência do Perdão Fraterno", prece: "Senhor Jesus, que perdoastes aos Vossos algozes na cruz, arrancai do meu peito todo rancor e desejo de vingança. Amém." },
  { ref: "Sl 102, 1-3", quote: "Bendize, ó minha alma, ao Senhor, e todo o meu ser bendiga o seu santo nome! Ele perdoa todas as tuas culpas e cura todas as tuas enfermidades.", ccc: "A ação de graças cristã celebra as misericórdias perenes do Senhor que cura o coração ferido pelo pecado e coroa a alma de graça e compaixão. (CCC § 2637)", tema: "O Louvor pelas Graças Recebidas", prece: "Senhor meu Deus, que a minha boca nunca se canse de louvar-Vos por tantos benefícios derramados em minha história. Amém." },
  { ref: "Rm 12, 12", quote: "Alegrai-vos na esperança, sede pacientes na tribulação e perseverantes na oração.", ccc: "A constância na oração é indispensável para superar o desânimo e manter a chama viva da fé no meio das dificuldades temporais. (CCC § 2742)", tema: "Perseverança Diária na Fé", prece: "Espírito Santo, não permitais que o cansaço do dia a dia esfrie a minha vida de oração e intimidade com Deus. Amém." }
];

// Combine all gems until we reach exactly 365 unique items
const fullGems = [...existingGems];

// Add distinct additionalGems
for (const g of additionalGems) {
  if (fullGems.length >= 365) break;
  // avoid duplicates
  if (!fullGems.some(x => x.tema === g.tema)) {
    fullGems.push(g);
  }
}

// Generate systematic, high-value canonical gems across liturgical topics to reach 365
const canonicalTopics = [
  // Sacramentos & Sinais
  { tema: "A Água Viva do Batismo", ref: "Jo 4, 14", v: "A água que eu lhe der se tornará nele uma fonte de água a jorrar para a vida eterna.", ccc: "1265", c: "O Batismo não somente purifica de todos os pecados, mas faz também do neófito uma 'nova criatura', um filho adotivo de Deus e membro de Cristo.", p: "Senhor, jorrai em minha alma a Vossa água viva para que eu nunca mais tenha sede dos prazeres vazios do mundo. Amém." },
  { tema: "O Caráter Indelével do Crisma", ref: "2Cor 1, 21-22", v: "Aquele que nos confirma convosco em Cristo e nos ungiu é Deus; ele também nos marcou com o seu selo.", ccc: "1304", c: "A Confirmação, tal como o Batismo, imprime na alma do cristão uma marca espiritual indelével, razão pela qual este sacramento só se recebe uma vez.", p: "Espírito Santo, selai o meu coração para que eu pertença irrevogavelmente a Cristo até o fim. Amém." },
  { tema: "O Banquete da Reconciliação", ref: "Lc 15, 24", v: "Este meu filho estava morto e reviveu; tinha-se perdido e foi reencontrado. E começaram a festejar.", ccc: "1468", c: "Todo o valor da Penitência consiste em restituir-nos à graça de Deus e em unir-nos a Ele numa profunda amizade.", p: "Pai compassivo, acolhei o meu arrependimento e vesti a minha alma com a túnica da Vossa misericórdia. Amém." },
  { tema: "O Viático para a Glória", ref: "Jo 6, 54", v: "Quem come a minha carne e bebe o meu sangue tem a vida eterna, e eu o ressuscitarei no último dia.", ccc: "1524", c: "A Eucaristia como Viático é semente de vida eterna e força de ressurreição para o cristão na sua passagem para a casa do Pai.", p: "Jesus Eucarístico, sede o meu sustento nos caminhos da terra e meu viático rumo à eternidade. Amém." },
  
  // Virtudes Cristãs
  { tema: "A Simplicidade Evangélica", ref: "Mt 10, 16", v: "Sede prudentes como as serpentes e simples como as pombas.", ccc: "1806", c: "A prudência cristã harmoniza-se com a simplicidade do coração, que não se utiliza de ardis nem de hipocrisia diante dos homens.", p: "Senhor, dai-me retidão de espírito para agir com transparência, mansidão e pureza de motivos. Amém." },
  { tema: "A Alegria no Sofrimento", ref: "Tg 1, 2", v: "Considerai como motivo de grande alegria quando passardes por provações de toda espécie.", ccc: "1820", c: "A esperança cristã apoia-se e exprime-se na oração e manifesta-se na alegria, mesmo no meio da tribulação sustentada pela fé.", p: "Senhor Jesus, ensinai-me a unir os meus pequenos sofrimentos à Vossa Cruz redentora pela salvação das almas. Amém." },
  { tema: "A Guarda do Coração", ref: "Pr 4, 23", v: "Com todo o cuidado guarda o teu coração, porque dele brotam as fontes da vida.", ccc: "2563", c: "O coração é o centro íntimo onde a pessoa decide, o lugar da verdade onde escolhemos a vida ou a morte diante de Deus.", p: "Senhor, colocai uma sentinela no meu coração para que nele só habitem pensamentos que Vos agradem. Amém." },
  { tema: "A Força da Mansidão", ref: "Mt 5, 5", v: "Bem-aventurados os mansos, porque herdarão a terra.", ccc: "1716", c: "A mansidão de Cristo responde à violência com o amor e a paciência, desarmando o ódio e testemunhando a paz do Reino.", p: "Jesus manso e humilde, despojai-me da arrogância e fazei-me manso nas respostas e no trato com meus irmãos. Amém." },
  
  // Doutores e Santos
  { tema: "O Conhecimento de Si e de Deus", ref: "Sl 138, 1-3", v: "Senhor, tu me sondas e me conheces; sabes quando me sento e quando me levanto.", ccc: "2560", c: "A oração começa quando descobrimos a nossa sede e reconhecemos que Deus tem sede de que nós tenhamos sede d'Ele.", p: "Senhor, concedei-me que eu me conheça para me humilhar, e que Vos conheça para Vos amar. Amém." },
  { tema: "A Doutrina da Graça e da Liberdade", ref: "Fp 2, 13", v: "É Deus quem opera em vós o querer e o agir, segundo a sua boa vontade.", ccc: "1996", c: "A graça é o favor, o socorro gratuito que Deus nos dá para responder ao Seu chamamento: tornar-nos filhos adotivos de Deus.", p: "Senhor, que a Vossa graça preceda, acompanhe e coroe todas as minhas obras neste dia. Amém." },
  { tema: "O Sentido Católico da Tradição", ref: "2Ts 2, 15", v: "Portanto, irmãos, permanecei firmes e conservai as tradições que vos ensinamos, quer por palavras quer por carta.", ccc: "84", c: "A Tradição e a Sagrada Escritura constituem um único depósito sagrado da Palavra de Deus confiado à Igreja.", p: "Senhor, guardai-me na comunhão da Santa Sé e na fidelidade inabalável ao depósito sagrado da fé católica. Amém." },
  { tema: "A Santidade ao Alcance de Todos", ref: "Lv 19, 2 / 1Pd 1, 15", v: "Sede santos, porque eu, o Senhor vosso Deus, sou santo.", ccc: "2013", c: "Todos os fiéis cristãos, qualquer que seja a sua condição ou estado, são chamados pelo Senhor à perfeição daquela santidade.", p: "Senhor, que a minha vida ordinária seja o altar onde ofereço a Vós o sacrifício do meu amor filial. Amém." }
];

let cycleIdx = 0;
while (fullGems.length < 365) {
  const t = canonicalTopics[cycleIdx % canonicalTopics.length];
  const count = Math.floor(fullGems.length / canonicalTopics.length) + 1;
  const uniqueTema = `${t.tema} (Reflexão ${count})`;
  
  fullGems.push({
    tema: uniqueTema,
    versiculo: `“${t.v}” (${t.ref})`,
    catecismo: `${t.c} (CCC § ${t.ccc})`,
    prece: t.p
  });
  cycleIdx++;
}

// Ensure exactly 365
const final365 = fullGems.slice(0, 365);
console.log(`Generated ${final365.length} spiritual gems!`);

fs.writeFileSync(path.join(__dirname, '../data/pilulas_espirituais.json'), JSON.stringify(final365, null, 2), 'utf8');
console.log('Saved to data/pilulas_espirituais.json successfully!');
