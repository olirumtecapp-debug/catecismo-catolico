import fs from 'fs';
import path from 'path';

const novenasFilePath = path.resolve('data/novenas.json');
const currentNovenas = JSON.parse(fs.readFileSync(novenasFilePath, 'utf8'));

const existingIds = new Set(currentNovenas.map(n => n.id));

const newNovenas = [
  {
    id: "santa-rita-de-cassia",
    titulo: "Novena Tradicional de Santa Rita de Cássia",
    subtitulo: "Padroeira das Causas Impossíveis, Desesperadas e dos Casos Perdidos",
    tipo: "fixa",
    padroeiro_de: "Causas Impossíveis, Casamentos em Crise, Mães de Família, Casos Desesperados e Perdão Heróico",
    festa_liturgica: {
      dia: 22,
      mes: 5,
      nome: "Festa Litúrgica de Santa Rita de Cássia, Religiosa Agostiniana"
    },
    simbolo: "🌹",
    cor: "rose",
    imagem: "assets/img/santos/05-22-santa-rita-de-cassia-religiosa-agostiniana.png",
    instrucoes: "A Novena de Santa Rita de Cássia prepara o coração para recorrer à intercessão da 'Santa dos Impossíveis'. Em cada um dos 9 dias, inicia-se com o Sinal da Cruz e a Oração Inicial, reza-se a Reflexão e a Oração própria do dia com a intenção pessoal, e conclui-se com a Oração Final, 3 Pai-Nossos, 3 Ave-Marias e 3 Glórias ao Pai.",
    oracao_inicial: "Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\nÓ gloriosa Santa Rita de Cássia, vós que fostes digna de participar da dolorosa Paixão de Nosso Senhor Jesus Cristo trazendo na fronte a chaga de um dos seus sagrados espinhos: acolhei as nossas súplicas e intercedei por nós junto ao trono de Deus. Ensinai-nos a virtude da paciência nas cruzes, do perdão sincero e da confiança inabalável na Providência Divina.",
    oracao_padrao_dia: "Ó poderosa advogada dos aflitos, Santa Rita de Cássia, a vossa vida na terra foi um hino contínuo de fé, mansidão e fidelidade evangélica. Como esposa paciente, mãe abnegada e religiosa recolhida no claustro agostiniano, nunca duvidastes do amor de Deus, mesmo nas noites mais escuras.\n\nCom filial confiança recorro a vós nesta hora de grande angústia e provação. Apresentai diante de Jesus esta minha necessidade premente que aos olhos humanos parece impossível: (mencione com fervor a sua intenção).\n\nAlcançai-me, ó Santa dos Impossíveis, se for para a maior glória de Deus e a salvação da minha alma, a graça que tão humildemente vos suplico.",
    oracao_final: "Santa Rita de Cássia, que por vosso heróico amor a Deus e aos irmãos fostes coroada com os dons celestes: rogai por nós!\n\nRezar com devoção:\n3 Pai-Nossos, 3 Ave-Marias e 3 Glórias ao Pai.\n\nJaculatória: Ó Santa Rita de Cássia, advogada dos casos desesperados e das causas impossíveis, rogai por nós que a vós recorremos!",
    dias: [
      {
        dia: 1,
        tema: "A Fé e a Obediência na Juventude de Rita",
        intencao: "Rezemos hoje pela graça de acolher a vontade de Deus em nossas vidas, mesmo quando ela contraria nossos planos humanos.",
        reflexao: "1º dia – Obediência e Humildade\nDesde a infância em Roccaporena, Santa Rita desejou consagrar-se inteiramente a Deus. No entanto, em espírito de obediência filial a seus pais idosos, aceitou o matrimônio cristão. Ela nos ensina que o primeiro passo para a santidade é a docilidade à vontade do Pai.",
        oracao: "Ó Santa Rita, concedei-me a virtude da santa obediência e da paciência humilde, para que eu aprenda a silenciar as minhas revoltas interiores e confiar que os caminhos do Senhor são sempre mais altos que os meus."
      },
      {
        dia: 2,
        tema: "A Mansidão e o Perdão Heroico no Casamento",
        intencao: "Rezemos pelas famílias feridas, pelos casamentos em crise e pela graça de perdoar os que nos ofendem.",
        reflexao: "2º dia – Mansidão que Converte\nPor quase duas décadas, Santa Rita suportou com ternura, oração e lágrimas a dureza de coração de seu esposo Paulo, até alcançar de Deus a sua total conversão e arrependimento antes de sua morte trágica.",
        oracao: "Senhor Jesus, pelo exemplo heróico de Santa Rita, desarmai o meu coração de todo ressentimento. Dai-me a força de pagar o mal com o bem e de ser instrumento de paz e reconciliação em minha família."
      },
      {
        dia: 3,
        tema: "O Amor Maternal que Prefere o Céu",
        intencao: "Rezemos por todas as mães e pais de família, para que zelem pela salvação eterna e pela pureza de seus filhos.",
        reflexao: "3º dia – Amor que Salva a Alma\nAo ver seus dois jovens filhos tentados pelo espírito de vingança da época, Santa Rita suplicou a Deus que preferia vê-los acolhidos na glória do Céu antes que manchassem suas almas com um pecado mortal. Amou seus filhos com amor eterno.",
        oracao: "Ó Santa Rita, protegei os nossos jovens e crianças das ciladas do pecado e das seduções do mundo. Ajudai os pais a educarem seus filhos para a santidade e para a vida eterna."
      },
      {
        dia: 4,
        tema: "A Perseverança na Entrada do Convento",
        intencao: "Rezemos pela constância na fé, para que jamais desanimemos diante das portas fechadas e das recusas humanas.",
        reflexao: "4º dia – Confiança Inabalável\nRejeitada três vezes pelas freiras agostinianas por sua condição de viúva, Rita não se revoltou. Intensificou suas orações até que, por intervenção milagrosa de São João Batista, Santo Agostinho e São Nicolau de Tolentino, as portas do convento se abriram milagrosamente durante a noite.",
        oracao: "Ó Deus misericordioso, quando todas as portas da terra parecerem fechadas para as minhas causas aflitivas, abri para mim as portas da Vossa infinita bondade, pela intercessão de Santa Rita de Cássia."
      },
      {
        dia: 5,
        tema: "O Mistério da Chaga do Espinho",
        intencao: "Rezemos pela graça de unir os nossos sofrimentos e dores cotidianas à Santa Cruz redentora de Jesus.",
        reflexao: "5º dia – Participação na Cruz de Cristo\nAjoelhada diante do Crucifixo, Santa Rita pediu para partilhar ao menos de um espinho da coroa de Jesus. O Senhor atendeu sua prece: um raio luminoso destacou-se da coroa do Crucificado e cravou-se em sua fronte, deixando uma ferida que ela suportou com amor por 15 anos.",
        oracao: "Senhor Jesus Cristo, gravai no meu peito o amor à Vossa Santa Cruz. Que os meus sofrimentos não sejam motivos de murmuração, mas instrumentos de santificação e expiação dos pecados."
      },
      {
        dia: 6,
        tema: "A Caridade para com os Pobres e Doentes",
        intencao: "Rezemos pelos enfermos abandonados, pelos indigentes e por um coração generoso nas obras de misericórdia.",
        reflexao: "6º dia – Amor sem Limites\nNo convento de Cássia, Santa Rita cuidava dos doentes mais graves e dos leprosos com ternura de mãe. Em cada irmão sofredor, ela contemplava a face dolorosa de Cristo.",
        oracao: "Ó Santa Rita, acendei em minha alma a chama da viva caridade. Livrai-me da indiferença e do egoísmo, para que eu estenda a mão aos mais necessitados com o coração de Cristo."
      },
      {
        dia: 7,
        tema: "O Milagre da Rosa e dos Figos no Inverno",
        intencao: "Rezemos pela certeza viva de que para Deus nada é impossível, mesmo nos invernos mais rigorosos da alma.",
        reflexao: "7º dia – O Florescer da Graça\nNo leito de morte, em pleno inverno rigoroso e sob a neve de Cássia, Santa Rita pediu a uma prima que lhe trouxesse uma rosa e dois figos de sua antiga horta. A prima encontrou no jardim coberto de gelo uma rosa vermelha desabrochada e figos maduros, sinal da fidelidade de Deus a quem Nele confia.",
        oracao: "Ó Santa Rita, fazei florescer no jardim seco do meu coração a rosa viva da fé, da esperança e da caridade, concedendo-me a graça impossível que tanto suplico."
      },
      {
        dia: 8,
        tema: "A Santa Morte e a Entrada na Glória Celeste",
        intencao: "Rezemos pela graça de uma boa morte, pelos agonizantes deste dia e pelas almas do purgatório.",
        reflexao: "8º dia – O Abraço do Esposo Celeste\nEm 22 de maio de 1457, aos 76 anos de idade, Santa Rita entregou sua alma em paz. A ferida repugnante de sua fronte transformou-se em um ponto luminoso e suave perfume espalhou-se por todo o convento e pela cidade de Cássia.",
        oracao: "Pai celeste, concedei-me a graça da perseverança final. Que no último instante da minha passagem terrena eu esteja reconciliado convosco, amparado por Maria Santíssima e Santa Rita."
      },
      {
        dia: 9,
        tema: "O Triunfo dos Impossíveis junto de Deus",
        intencao: "Rezemos com fervor e gratidão renovada pela graça pedida nesta novena, louvando o Senhor que opera maravilhas.",
        reflexao: "9º dia – A Intercessão que Nunca Falha\nHá mais de cinco séculos, multidões de fiéis em todo o mundo atestam que nenhuma oração sincera confiada a Santa Rita fica sem resposta consoladora. Deus glorifica os seus santos que o amaram até o fim.",
        oracao: "Ó Santa Rita de Cássia, acolhei sob o vosso manto a minha vida, a minha família e a causa que vos confiei. Prometo testemunhar com renovado zelo a Vossa intercessão e viver uma vida cristã autêntica para a glória do Pai, do Filho e do Espírito Santo. Amém!"
      }
    ]
  },
  {
    id: "sagrado-coracao-de-jesus",
    titulo: "Novena de Confiança ao Sagrado Coração de Jesus",
    subtitulo: "A Fonte Inesgotável de Misericórdia, Reparação e Amor Divino",
    tipo: "fixa",
    padroeiro_de: "Aflitos, Desanimados, Reparação dos Pecados, Santificação das Famílias e Paz Interior",
    festa_liturgica: {
      dia: 19,
      mes: 6,
      nome: "Solenidade do Sagrado Coração de Jesus (Sexta-feira após a Oitava de Corpus Christi)"
    },
    simbolo: "❤️‍🔥",
    cor: "amber",
    imagem: "assets/img/santos/10-16-santa-margarida-maria-alacoque-virgem-da-ordem-da-visitacao.png",
    instrucoes: "A Novena da Confiança ao Sagrado Coração de Jesus baseia-se nas revelações a Santa Margarida Maria Alacoque. Reze em cada um dos nove dias o Oferecimento, a Meditação Bíblica, a Oração da Confiança Irrestrita e a Ladainha ou Invocação Final.",
    oracao_inicial: "Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\nÓ Jesus misericordioso, que dissestes: 'Vinde a mim todos vós que estais cansados e fatigados sob o peso dos vossos fardos, e Eu vos aliviarei': eis-me prostrado diante do Vosso Coração aberto na Cruz pela lança do soldado. A Vós consagro o meu coração, as minhas angústias e todas as minhas esperanças.",
    oracao_padrao_dia: "Ó Divino Coração de Jesus, fonte perene de toda consolação: a Vós recorro com filial e irrestrita confiança. Vós bem conheceis as minhas misérias, a minha fraqueza e as grandes aflições que me cercam.\n\nOlhai com misericórdia para esta prece que do fundo da minha alma Vos apresento: (faça aqui o seu pedido com profunda fé).\n\nCoração Eucarístico de Jesus, manso e humilde, transformai o meu coração para que seja semelhante ao Vosso, e concedei-me a graça que ardentemente vos suplico.",
    oracao_final: "Sagrado Coração de Jesus, que fizestes a Santa Margarida Maria a promessa de abençoar as casas onde a imagem do Vosso Coração for exposta e honrada, reinai sobre a nossa família e concedei-nos a paz.\n\nInvocação:\nSagrado Coração de Jesus, eu confio e espero em Vós! (3 vezes)\nDoce Coração de Maria, sede a nossa salvação!",
    dias: [
      {
        dia: 1,
        tema: "O Coração que Tanto Amou os Homens",
        intencao: "Pela reparação das ofensas contra o amor de Deus e pelo dom de corresponder ao Seu afeto divino.",
        reflexao: "1º dia – A Queixa de Jesus a Santa Margarida Maria\n'Eis aqui o Coração que tanto amou os homens, que nada poupou até se esgotar e consumir para lhes testemunhar o seu amor; e em reconhecimento, não recebo da maior parte deles senão ingratidões, desrespeitos, sacrilégios e friezas'. Jesus nos convida a amá-lo por aqueles que não o amam.",
        oracao: "Ó Jesus, perdoai as nossas ingratidões. Acendei em nossa alma um fogo ardente de caridade, para que consolemos o Vosso Coração amoroso através de uma vida fiel e generosa."
      },
      {
        dia: 2,
        tema: "A Mansidão e a Humildade do Coração de Cristo",
        intencao: "Pela cura do orgulho, da soberba e da cólera em nossas atitudes diárias.",
        reflexao: "2º dia – Aprendei de Mim\n'Aprendei de Mim, que sou manso e humilde de coração, e encontrareis repouso para as vossas almas' (Mt 11,29). A mansidão de Cristo é a força serena que tudo suporta por amor ao Pai.",
        oracao: "Jesus manso e humilde, tirai de nós todo espírito de julgamento, amargura e vaidade. Ensinai-nos a servir aos irmãos com simplicidade e pureza de intenção."
      },
      {
        dia: 3,
        tema: "O Refúgio Seguro nas Tempestades da Vida",
        intencao: "Por todos os que estão mergulhados no medo, na ansiedade, na depressão ou na desesperança.",
        reflexao: "3º dia – O Porto da Salvação\nQuando as tempestades do mundo abalam nossa barca, o Coração traspassado de Jesus é o refúgio seguro onde nenhuma aflição humana pode nos afogar.",
        oracao: "Senhor Jesus, quando a tribulação bater à minha porta, acolhei-me na fenda adorável do Vosso Lado aberto. Que eu encontre ali a paz sobrenatural que o mundo não pode dar."
      },
      {
        dia: 4,
        tema: "A Promessa da Paz nas Famílias",
        intencao: "Pela concórdia, reconciliação e restauração da paz em todos os lares cristãos.",
        reflexao: "4º dia – Entronização do Coração no Lar\n'Estabelecerei e guardarei a paz em suas famílias'. Onde Jesus reina como centro do lar, a discórdia recua, o perdão renasce e o amor mútuo floresce.",
        oracao: "Sagrado Coração de Jesus, entrai em nossa casa. Abençoai nossos relacionamentos, afastai o egoísmo e dai aos pais e filhos o dom do mútuo respeito e entendimento."
      },
      {
        dia: 5,
        tema: "O Socorro dos Pecadores e a Graça do Retorno",
        intencao: "Pela conversão dos pecadores obstinados e pelo retorno daqueles que se afastaram da Santa Igreja.",
        reflexao: "5º dia – O Bom Pastor que Procura a Ovelha Perdida\n'Os pecadores encontrarão em meu Coração a fonte e o oceano infinito de misericórdia'. Não há pecado que a misericórdia de Cristo não possa perdoar quando há arrependimento.",
        oracao: "Ó Salvador amantíssimo, atraí com a doçura da Vossa graça os corações endurecidos. Concedei-lhes a coragem da confissão sacramental e a alegria da Vossa comunhão."
      },
      {
        dia: 6,
        tema: "A Consolação nas Aflições e Tribulações",
        intencao: "Por todos os doentes, hospitalizados, enlutados e abandonados pela sociedade.",
        reflexao: "6º dia – 'Serei seu consolo em todas as suas penas'\nJesus não é indiferente às nossas lágrimas. No Getsêmani e no Calvário, Ele carregou cada uma das nossas dores para transformá-las em sementes de ressurreição.",
        oracao: "Ó Divino Consolador, visitai os que sofrem solidão e dores incuráveis. Derramai o bálsamo da Vossa presença em seus corações e sustentai-os com a esperança do Céu."
      },
      {
        dia: 7,
        tema: "A Graça do Fervor Espiritual",
        intencao: "Pelo fim da tibieza e indiferença religiosa em nossa própria vida e na Igreja.",
        reflexao: "7º dia – 'As almas tíbias se tornarão fervorosas'\nA tibieza espiritual é o desleixo com as coisas de Deus. O contato com a fornalha viva do Coração de Jesus derrete o gelo de nossa alma e reacende o ardor vocacional.",
        oracao: "Coração ardente de Jesus, purificai minha alma da preguiça e do conformismo espiritual. Que eu vos busque na oração, na Santa Missa e na Eucaristia com profunda devoção."
      },
      {
        dia: 8,
        tema: "A Grande Promessa da Comunhão Reparadora",
        intencao: "Pela perseverança na devoção das Primeiras Sextas-feiras do Mês e amor à Eucaristia.",
        reflexao: "8º dia – A Grande Promessa da Graça Final\n'Prometo, na excessiva misericórdia do meu Coração, a graça da penitência final a todos os que comungarem na primeira sexta-feira de nove meses consecutivos; eles não morrerão sem receber os santos sacramentos'.",
        oracao: "Senhor Eucarístico, dai-me a fidelidade inquebrantável à Sagrada Comunhão. Guardai-me sob a Vossa graça para que eu nunca me separe de Vós nesta vida e na eternidade."
      },
      {
        dia: 9,
        tema: "O Triunfo do Amor e a Plena Confiança",
        intencao: "Pela certeza absoluta na misericórdia de Jesus e consagração irrevogável ao Seu Coração.",
        reflexao: "9º dia – 'Eu reinarei apesar dos meus inimigos'\nNada pode vencer o amor infinito de Deus. Aquele que se abandona no Sagrado Coração de Jesus já é mais que vencedor em Cristo Jesus.",
        oracao: "Sagrado Coração de Jesus, eu me entrego a Vós por inteiro: o meu passado à Vossa misericórdia, o meu presente ao Vosso amor, e o meu futuro à Vossa santíssima Providência. Amém!"
      }
    ]
  },
  {
    id: "nossa-senhora-de-fatima",
    titulo: "Novena de Nossa Senhora de Fátima",
    subtitulo: "A Mensagem de Oração, Penitência e Reparação ao Imaculado Coração",
    tipo: "fixa",
    padroeiro_de: "A Paz no Mundo, Conversão dos Pecadores, Famílias e Reparação dos Primeiros Sábados",
    festa_liturgica: {
      dia: 13,
      mes: 5,
      nome: "Festa Litúrgica de Nossa Senhora de Fátima (Aparições da Cova da Iria, 1917)"
    },
    simbolo: "🕊️",
    cor: "mariana",
    imagem: "assets/img/santos/05-13-nossa-senhora-de-fatima.png",
    instrucoes: "A Novena de Nossa Senhora de Fátima comemora as aparições da Santíssima Virgem aos três pastorinhos (Lúcia, Francisco e Jacinta) na Cova da Iria em 1917. Reze cada dia com o Santo Rosário, meditação da Mensagem de Fátima e a oração reparadora do Anjo da Paz.",
    oracao_inicial: "Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\nÓ Santíssima Virgem Maria, Rainha do Santo Rosário e Mãe de Misericórdia, que descestes do Céu para lembrar à humanidade a urgência da oração, da conversão dos costumes e da penitência: acolhei com benevolência a nossa súplica e ensinai-nos a amar a Jesus com o Vosso Imaculado Coração.",
    oracao_padrao_dia: "Ó Virgem Imaculada de Fátima, Senhora do Rosário, volvei para nós os vossos olhos cheios de ternura maternal. Ao verdes a terra ameaçada pelas guerras, pela discórdia e pelo esquecimento dos mandamentos divinos, viestes pedir a oração perseverante do Terço e a consagração dos nossos lares.\n\nAnimados pela Vossa promessa consoladora de que 'por fim, o meu Imaculado Coração triunfará', nós Vos confiamos a nossa vida, a nossa família e esta necessidade urgente que trazemos no íntimo da alma: (apresente o seu pedido).\n\nConcedei-nos, Mãe querida, a fidelidade à graça de Deus e a coragem de sermos apóstolos da paz e da esperança no meio do mundo.",
    oracao_final: "Oração do Anjo da Paz de Fátima:\n'Meu Deus, eu creio, adoro, espero e amo-Vos. Peço-Vos perdão para os que não crêem, não adoram, não esperam e não Vos amam.' (3 vezes)\n\nSantíssima Trindade: Pai, Filho e Espírito Santo, adoro-Vos profundamente e ofereço-Vos o preciosíssimo Corpo, Sangue, Alma e Divindade de Jesus Cristo, presente em todos os sacrários da terra, em reparação dos ultrajes, sacrilégios e indiferenças com que Ele mesmo é ofendido.\n\nNossa Senhora de Fátima, rogai por nós e pela paz no mundo inteiro!",
    dias: [
      {
        dia: 1,
        tema: "A Primeira Aparição: 'Vindes do Céu'",
        intencao: "Pela graça de aspirar sempre às realidades celestes e valorizar a vida eterna acima dos bens passageiros.",
        reflexao: "1º dia – 13 de Maio de 1917\nA Senhora mais brilhante que o sol pergunta aos pastorinhos: 'Quereis oferecer-vos a Deus para suportar todos os sofrimentos que Ele quiser enviar-vos, em ato de reparação pelos pecados e de súplica pela conversão dos pecadores?' Os pastorinhos responderam com generosidade: 'Sim, queremos!'.",
        oracao: "Ó Mãe de Fátima, dai-nos a generosidade de coração para dizer 'sim' à vontade do Senhor em todos os momentos de nossa existência."
      },
      {
        dia: 2,
        tema: "O Imaculado Coração Cercado de Espinhos",
        intencao: "Pela reparação dos pecados contra o Coração Imaculado de Maria e pela devoção dos Primeiros Sábados.",
        reflexao: "2º dia – 13 de Junho de 1917\nNossa Senhora mostra aos pastorinhos o seu Coração rodeado de espinhos cravados pelos pecados da humanidade ingrata. Ela promete a Lúcia: 'O meu Imaculado Coração será o teu refúgio e o caminho que te conduzirá até Deus'.",
        oracao: "Virgem Maria, nós queremos retirar os espinhos do vosso coração mediante a oração humilde, a Santa Comunhão e a fidelidade aos ensinamentos de Jesus."
      },
      {
        dia: 3,
        tema: "O Santo Rosário como Arma da Paz",
        intencao: "Pelo fim dos conflitos, violências e perseguições religiosas em todos os continentes.",
        reflexao: "3º dia – 13 de Julho de 1917\n'Rezai o Terço todos os dias para alcançardes a paz para o mundo e o fim da guerra'. O Rosário não é uma oração mecânica, mas a contemplação dos mistérios da redenção com os olhos de Maria.",
        oracao: "Rainha da Paz, fazei com que em nossos lares e comunidades o Santo Terço seja rezado com amor e recolhimento todos os dias, alcançando a concórdia entre os povos."
      },
      {
        dia: 4,
        tema: "A Oração pelos Pobres Pecadores",
        intencao: "Pelos que vivem em pecado mortal e não têm quem reze por eles.",
        reflexao: "4º dia – 19 de Agosto de 1917\n'Rezai, rezai muito e fazei sacrifícios pelos pecadores, que vão muitas almas para o inferno por não haver quem se sacrifique e peça por elas'. A compaixão pelas almas é o sinal dos verdadeiros discípulos.",
        oracao: "Ó meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu e socorrei principalmente as que mais precisarem da Vossa misericórdia."
      },
      {
        dia: 5,
        tema: "A Pureza e a Santidade das Crianças",
        intencao: "Pela inocência e guarda moral de todas as crianças contra a corrupção do mundo contemporâneo.",
        reflexao: "5º dia – A Escolha dos Pequeninos\nDeus revelou os segredos de Sua graça a três crianças pobres e iletradas da serra portuguesa, porque os olhos puros e os corações humildes sabem enxergar as maravilhas divinas.",
        oracao: "Senhor, guardai as nossas crianças na inocência batismal. Protegei seus olhos, ouvidos e corações, concedendo aos educadores sabedoria e compromisso cristão."
      },
      {
        dia: 6,
        tema: "A Penitência e a Aceitação da Cruz Cotidiana",
        intencao: "Pela força espiritual de aceitar os deveres diários com espírito de penitência e amor.",
        reflexao: "6º dia – A Penitência que Deus Pede\nIrmã Lúcia explicava que a penitência que o Senhor mais pede é o cumprimento generoso dos deveres de cada dia e a aceitação pacífica dos cansaços e contrariedades inevitáveis.",
        oracao: "Ó Mãe querida, livrai-me da preguiça espiritual e do comodismo. Que eu cumpra com zelo o meu trabalho e os meus deveres familiares em louvor a Deus."
      },
      {
        dia: 7,
        tema: "O Milagre do Sol e a Confirmação da Fé",
        intencao: "Pela vitória da fé sobre as dúvidas, o secularismo e o relativismo moderno.",
        reflexao: "7º dia – 13 de Outubro de 1917\nDiante de mais de 70 mil pessoas sob chuva torrencial, o sol dançou no céu, secando instantaneamente roupas e terra, atestando diante de crentes e ateus a autenticidade da Mensagem celeste.",
        oracao: "Deus eterno e fiel, que confirmais as Vossas palavras com prodígios de amor: fortalecei a nossa fé nos momentos de dúvida e treva interior."
      },
      {
        dia: 8,
        tema: "O Exemplo dos Santos Pastorinhos Francisco e Jacinta",
        intencao: "Pelos enfermos e sofredores, para que encontrem consolo na oferta de suas dores a Cristo.",
        reflexao: "8º dia – Francisco o Contemplativo e Jacinta a Compassiva\nSão Francisco Marto passava horas consolando 'Jesus escondido no sacrário'. Santa Jacinta oferecia todas as dores de sua enfermidade pela salvação dos pecadores e pelo Santo Padre.",
        oracao: "Santos Francisco e Jacinta Marto, alcançai-nos o vosso amor apaixonado por Jesus Eucarístico e a vossa fidelidade inquebrantável à Igreja e ao Papa."
      },
      {
        dia: 9,
        tema: "A Esperança Certa: 'O Meu Imaculado Coração Triunfará'",
        intencao: "Pelo triunfo do amor, da justiça e da verdade cristã em nossos corações e em toda a Igreja.",
        reflexao: "9º dia – O Triunfo da Graça\nA promessa de Fátima não é de derrota, mas de esperança luminosa. Por maiores que sejam as tempestades da história, o Reino de Deus prevalecerá e Maria nos conduzirá com segurança a Cristo.",
        oracao: "Ó Senhora de Fátima, consagramos a Vós os nossos corpos, as nossas famílias e os destinos do nosso país. Reinai em nossos corações até o encontro definitivo na glória celeste. Amém!"
      }
    ]
  },
  {
    id: "sao-peregrino",
    titulo: "Novena Tradicional de São Peregrino Laziosi",
    subtitulo: "Padroeiro e Protetor Especial contra o Câncer, Úlceras e Doenças Incuráveis",
    tipo: "fixa",
    padroeiro_de: "Portadores de Câncer, Tumores, Doenças da Pele, Úlceras, Doentes Graves e Médicos Oncologistas",
    festa_liturgica: {
      dia: 1,
      mes: 5,
      nome: "Festa Litúrgica de São Peregrino Laziosi, Religioso Servita"
    },
    simbolo: "🌿",
    cor: "mariana",
    imagem: "assets/img/santos/ns_sao-peregrino.jpg",
    instrucoes: "São Peregrino Laziosi (1265-1345) é o grande intercessor católico contra o câncer e as enfermidades graves. Na véspera de ter sua perna amputada por um tumor maligno, rezou a noite inteira diante do Crucifixo e foi milagrosamente curado pelo toque da mão de Jesus. Reze a novena com fé fervorosa pelo enfermo.",
    oracao_inicial: "Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\nÓ glorioso São Peregrino, que fostes chamado pelo toque curador do Crucificado e vos tornastes modelo de paciência e oração fervorosa: acolhei com benevolência a nossa oração e levai as nossas lágrimas ao Médico dos médicos, Nosso Senhor Jesus Cristo.",
    oracao_padrao_dia: "Ó admirável São Peregrino, que experimentastes na própria carne o terrível peso de uma enfermidade maligna e dolorosa, e fostes milagrosamente curado na véspera da amputação de vossa perna pela mão estendida de Cristo Crucificado:\n\nRecorro a vós com profunda fé e esperança filial. Vede o sofrimento que aflige o meu corpo (ou o corpo de meu querido irmão/irmã: mencione o nome do doente e a enfermidade).\n\nApresentai a Jesus Salvador as nossas dores, os nossos receios e o tratamento que realizamos. Se for da vontade de Deus, alcançai-nos a graça da cura completa, e acima de tudo dai-nos a força da paciência e da fé inabalável em meio ao tratamento.",
    oracao_final: "São Peregrino, consolador dos doentes e esperança dos que sofrem de câncer: rogai por nós!\n\nRezar:\n1 Pai-Nosso, 1 Ave-Maria e 1 Glória ao Pai.\n\nJaculatória: São Peregrino, padroeiro dos que sofrem com câncer e enfermidades graves, intercedei pela nossa cura junto a Jesus Cristo!",
    dias: [
      {
        dia: 1,
        tema: "A Graça da Conversão e a Transformação de Vida",
        intencao: "Rezemos pela cura espiritual de nossa alma, para que a enfermidade seja ocasião de encontro com a misericórdia de Deus.",
        reflexao: "1º dia – Da Rebeldia à Santidade\nNa juventude em Forlì, Peregrino militou contra o Papa e chegou a agredir São Filipe Benizi com uma bofetada. A mansidão santa com que Filipe ofereceu a outra face tocou o coração de Peregrino tão profundamente que ele caiu em lágrimas, converteu-se e abraçou a vida religiosa.",
        oracao: "Ó São Peregrino, curai a dureza do meu coração. Dai-me a coragem de pedir perdão e de reconhecer que a saúde do corpo deve caminhar unida à pureza da alma."
      },
      {
        dia: 2,
        tema: "A Penitência e a Vida de Oração Contínua",
        intencao: "Rezemos pela força de perseverar na oração durante as consultas, exames e tratamentos médicos.",
        reflexao: "2º dia – Fidelidade no Claustro\nIngressando na Ordem dos Servos de Maria, Peregrino consagrou-se à penitência e à oração aos pés de Nossa Senhora das Dores, passando noites inteiras em colóquio amoroso com Deus.",
        oracao: "Senhor Jesus, quando o desânimo e o cansaço dos tratamentos pesarem sobre os meus ombros, dai-me a perseverança de São Peregrino para encontrar alívio na oração sincera."
      },
      {
        dia: 3,
        tema: "A Provação da Enfermidade Dolorosa",
        intencao: "Por todos os que receberam recentemente um diagnóstico difícil e estão sentindo angústia ou medo.",
        reflexao: "3º dia – A Dor Aceita com Amor\nAos 60 anos, surgiu na perna de Peregrino uma úlcera maligna e cancerosa que se espalhou pelos ossos com dores atrozes. Peregrino nunca murmurou contra Deus, mas ofereceu suas dores pela salvação do mundo.",
        oracao: "Ó São Peregrino, vós que bem conheceis a dor física e a aflição da incerteza, visitai com vossa intercessão os enfermos que sofrem nos leitos de dor."
      },
      {
        dia: 4,
        tema: "A Noite de Vigília aos Pés da Cruz",
        intencao: "Rezemos pela confiança de entregar todas as nossas causas desesperadas aos pés de Cristo Crucificado.",
        reflexao: "4º dia – O Refúgio na Cruz\nQuando o médico Paolo Salazio anunciou que a perna teria de ser amputada na manhã seguinte para salvar-lhe a vida, Peregrino arrastou-se até a sala capitular do convento e prostrou-se diante da imagem de Jesus Crucificado em vigília orante.",
        oracao: "Jesus Crucificado, Fonte de toda a vida e saúde, a Vós me entrego nesta hora. Se for Vosso beneplácito, afastai de mim este cálice de sofrimento, mas faça-se a Vossa vontade."
      },
      {
        dia: 5,
        tema: "O Milagre: A Mão do Crucificado que Cura",
        intencao: "Rezemos pela graça da restauração da saúde e pelo sucesso dos medicamentos e cirurgias.",
        reflexao: "5º dia – O Toque Divino\nDurante a oração na calada da noite, Peregrino adormeceu de exaustão e viu em sonho Jesus desprender o braço direito da Cruz e tocar na sua perna enferma. Ao acordar, a chaga estava totalmente cicatrizada e não restava sinal algum da doença.",
        oracao: "Ó Divino Salvador, que tocastes com a Vossa mão sagrada a perna de São Peregrino, tocai hoje com o Vosso poder regenerador nas células, órgãos e tecidos do nosso corpo enfermo."
      },
      {
        dia: 6,
        tema: "O Louvor dos Médicos e a Gratidão a Deus",
        intencao: "Rezemos por todos os médicos oncologistas, enfermeiros e equipes de saúde que cuidam dos enfermos graves.",
        reflexao: "6º dia – A Ciência que Reconhece o Milagre\nAo amanhecer, o médico cirurgião constatou com espanto a cura inexplicável e caiu de joelhos glorificando o poder do Deus Altíssimo. Peregrino viveu mais 20 anos em perfeita saúde.",
        oracao: "Senhor Deus, iluminai a mente das equipes médicas, guiai as mãos dos cirurgiões e abençoai as pesquisas científicas contra o câncer e as doenças incuráveis."
      },
      {
        dia: 7,
        tema: "A Caridade Incansável para com os Pobres",
        intencao: "Pelos enfermos desprovidos de recursos financeiros, que aguardam tratamento ou cirurgia.",
        reflexao: "7º dia – O Apóstolo dos Aflitos\nCurado milagrosamente, São Peregrino dedicou o resto de sua longa vida a acolher os doentes e necessitados de Forlì, multiplicando milagrosamente o pão e o vinho nas horas de carestia.",
        oracao: "Ó São Peregrino, alcançai a providência divina para as famílias que enfrentam dificuldades materiais e falta de recursos para arcar com remédios e exames."
      },
      {
        dia: 8,
        tema: "A Intercessão pelos Portadores de Câncer",
        intencao: "Por todos os homens, mulheres e crianças que neste momento realizam quimioterapia ou radioterapia.",
        reflexao: "8º dia – O Patrono Universal da Oncologia\nReconhecido pela Igreja Católica como padroeiro contra as afecções cancerígenas, São Peregrino atrai milhões de devotos em todo o mundo que encontram alívio e curas pela sua prece constante.",
        oracao: "Ó São Peregrino, abrandai os efeitos colaterais dos tratamentos, renovai as energias dos enfermos e infundi neles uma serenidade sobrenatural que vença todo abatimento."
      },
      {
        dia: 9,
        tema: "A Esperança da Vitória Definitiva",
        intencao: "Por uma vida inteiramente consagrada ao amor de Deus e de gratidão perpétua pela Sua misericórdia.",
        reflexao: "9º dia – O Triunfo da Vida Eterna\nNo dia 1º de maio de 1345, aos 80 anos, São Peregrino entrou no repouso do Senhor. Sua vida nos lembra que a última palavra nunca pertence à doença ou à morte, mas à Ressurreição de Jesus Cristo.",
        oracao: "Ó Deus todo-poderoso, que em São Peregrino nos destes um refúgio admirável na provação do câncer, concedei-nos a saúde da alma e do corpo para que Vos sirvamos com alegria todos os dias de nossa vida. Por Cristo, Nosso Senhor. Amém!"
      }
    ]
  },
  {
    id: "medalha-milagrosa",
    titulo: "Novena Perpétua de Nossa Senhora das Graças e da Medalha Milagrosa",
    subtitulo: "A Dispensadora Universal de Todas as Graças de Deus",
    tipo: "fixa",
    padroeiro_de: "Proteção contra Males, Conversões Difíceis, Bênçãos Materiais e Espirituais e Proteção das Famílias",
    festa_liturgica: {
      dia: 27,
      mes: 11,
      nome: "Festa Litúrgica de Nossa Senhora das Graças e da Medalha Milagrosa"
    },
    simbolo: "⭐",
    cor: "mariana",
    imagem: "assets/img/santos/01-01-santa-maria-mae-de-deus.png",
    instrucoes: "A Novena de Nossa Senhora das Graças recorda as aparições a Santa Catarina Labouré na Rue du Bac, em Paris, em 1830. A Virgem Maria prometeu: 'Todas as pessoas que usarem a Medalha com confiança no pescoço receberão grandes graças'. Reze com o coração aberto.",
    oracao_inicial: "Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\nÓ Virgem Imaculada da Medalha Milagrosa, que vos manifestastes radiante de luz, tendo as mãos abertas de onde brotavam raios luminosos sobre a terra: acolhei a nossa súplica filial e alcançai-nos de Jesus as graças celestes e temporais de que tanto necessitamos.",
    oracao_padrao_dia: "Ó Mãe Imaculada das Graças, que revelastes a Santa Catarina Labouré que os raios que saíam de vossas mãos simbolizavam as bênçãos que derramais sobre aqueles que vos pedem, e que os raios apagados representavam as graças que as pessoas deixam de receber por não as pedirem:\n\nCom profunda fé e arrependimento dos meus pecados, venho pedir a vossa intercessão materna nesta necessidade: (mencione com filial confiança a graça que deseja).\n\nFazei, ó Maria, que o vosso Coração Imaculado seja o meu amparo em todas as tentações e o caminho seguro que me leva a Deus.",
    oracao_final: "Invocação da Medalha Milagrosa:\n'Ó Maria concebida sem pecado, rogai por nós que recorremos a Vós!' (3 vezes)\n\nRezar:\n1 Pai-Nosso, 1 Ave-Maria e 1 Glória ao Pai.\n\nLembrai-vos, ó puríssima Virgem Maria, que nunca se ouviu dizer que algum daqueles que recorreram à vossa proteção tenha sido por vós desamparado. Amém!",
    dias: [
      {
        dia: 1,
        tema: "A Virgem que Esmaga a Cabeça da Serpente",
        intencao: "Pela vitória da graça divina sobre as ciladas e tentações do demônio em nossas vidas.",
        reflexao: "1º dia – A Imaculada Conceição\nNossa Senhora apareceu de pé sobre o globo terrestre, pisando com o pé virginal a cabeça da serpente infernal. Ela é a Nova Eva que nos traz o Salvador e esmaga o poder das trevas.",
        oracao: "Ó Virgem Vitoriosa, defendei-nos dos assaltos do inimigo. Guardai a nossa mente e os nossos sentidos na pureza evangélica."
      },
      {
        dia: 2,
        tema: "As Mãos Abertas que Derramam Graças",
        intencao: "Pela confiança irrestrita na generosidade de Maria como Medianeira de todas as graças.",
        reflexao: "2º dia – Os Raios de Luz\nDas mãos sagradas de Maria saem feixes de luz que cobrem o mundo inteiro. Ela deseja cumulá-nos com o socorro divino, bastando que recorramos a Ela com fé humilde.",
        oracao: "Mãe amantíssima, derramai sobre a minha vida os raios da Vossa graça, iluminando as minhas decisões e curando as feridas da minha alma."
      },
      {
        dia: 3,
        tema: "A Invocação da Fé: 'Concebida sem Pecado'",
        intencao: "Pela renovação da graça do nosso Santo Batismo e horror a todo pecado.",
        reflexao: "3º dia – A Jaculatória Santa\nEm volta da imagem lia-se em letras de ouro: 'Ó Maria concebida sem pecado, rogai por nós que recorremos a Vós'. Esta prece prepara a proclamação do Dogma da Imaculada Conceição pelo Papa Pio IX.",
        oracao: "Purificai, Senhor, o nosso coração de toda mancha de pecado. Fazei-nos amantes da verdade e imitadores das virtudes da Virgem Imaculada."
      },
      {
        dia: 4,
        tema: "O M de Maria Unido à Cruz de Cristo",
        intencao: "Pela fidelidade à Cruz nos momentos de incompreensão e provação.",
        reflexao: "4º dia – O Verso da Medalha\nNo verso da Medalha resplandece o monograma 'M' de Maria, sustentando a Cruz de Cristo. Maria esteve de pé junto à Cruz e permanece inseparável do sacrifício redentor de seu Filho.",
        oracao: "Ó Mãe das Dores, ensinai-me a abraçar a minha cruz com amor sereno, permanecendo fiel a Jesus até a glória da ressurreição."
      },
      {
        dia: 5,
        tema: "Os Dois Sagrados Corações",
        intencao: "Pela união indissolúvel dos nossos lares aos Corações de Jesus e de Maria.",
        reflexao: "5º dia – O Coração com Espinhos e o Coração Traspassado\nAbaixo da Cruz, a Medalha traz o Coração de Jesus coroado de espinhos e o Coração de Maria traspassado por uma espada de dor. Dois corações unidos no amor redentor.",
        oracao: "Sagrado Coração de Jesus e Imaculado Coração de Maria, acolhei as nossas famílias e fazei dos nossos lares um refúgio de santidade e concórdia."
      },
      {
        dia: 6,
        tema: "As Doze Estrelas da Santa Igreja",
        intencao: "Pela fidelidade inabalável à Santa Igreja Católica, ao Papa e à Tradição apostólica.",
        reflexao: "6º dia – A Mulher Revestida de Sol\nAs doze estrelas da Medalha representam os Doze Apóstolos e as tribos de Israel: Maria é a Mãe da Igreja e a Rainha dos Apóstolos que protege a Barca de Pedro.",
        oracao: "Senhor Jesus Cristo, sustentai e santificai a Vossa Igreja. Dai ao Papa e aos bispos a coragem profética de pastorear o Vosso rebanho na fidelidade ao Evangelho."
      },
      {
        dia: 7,
        tema: "A Proteção nas Epidemias e Calamidades",
        intencao: "Por todos os que estão enfermos, atribulados ou necessitados de socorro urgente.",
        reflexao: "7º dia – O Título de 'Milagrosa'\nOriginalmente chamada de 'Medalha da Imaculada', o povo francês passou a chamá-la espontaneamente de 'Medalha Milagrosa' devido à incontável multidão de curas e conversões repentinas durante a peste da cólera de 1832.",
        oracao: "Ó Senhora da Medalha Milagrosa, livrai o nosso lar de toda peste espiritual e corporal, e guardai-nos sob a vossa perpétua proteção."
      },
      {
        dia: 8,
        tema: "A Graça da Conversão dos Corações Endurecidos",
        intencao: "Pela conversão daqueles por quem choramos e rezamos há tanto tempo.",
        reflexao: "8º dia – O Milagre de Afonso Ratisbonne\nA conversão instantânea do judeu agnóstico Afonso Ratisbonne em Roma, ao usar a Medalha Milagrosa, atesta que o amor da Mãe de Deus alcança os corações mais distantes.",
        oracao: "Mãe clemente, tomai em vossas mãos os nossos familiares afastados da fé. Que a luz de Cristo penetre em suas almas e os reconduza à casa do Pai."
      },
      {
        dia: 9,
        tema: "A Promessa Cumprida: 'Receberão Grandes Graças'",
        intencao: "Pela consagração perpétua à Santíssima Virgem e pelo testemunho de uma vida santa.",
        reflexao: "9º dia – O Triunfo da Devoção\n'Todas as pessoas que usarem a Medalha ao pescoço com confiança receberão grandes graças'. Não é um amuleto, mas um sinal exterior de pertença e consagração filial a Maria.",
        oracao: "Ó Virgem da Medalha Milagrosa, acolhei o meu coração e a minha vida inteira. Que ao trazer a vossa santa medalha eu me lembre sempre de agir como verdadeiro filho de Deus. Amém!"
      }
    ]
  }
];

let addedCount = 0;
for (const novena of newNovenas) {
  if (!existingIds.has(novena.id)) {
    currentNovenas.push(novena);
    addedCount++;
    console.log(`+ Adicionada: ${novena.titulo} (${novena.id})`);
  } else {
    console.log(`= Já existe: ${novena.id}`);
  }
}

fs.writeFileSync(novenasFilePath, JSON.stringify(currentNovenas, null, 2), 'utf8');
console.log(`\nSucesso! ${addedCount} novas novenas adicionadas. Total de novenas no sistema: ${currentNovenas.length}`);
