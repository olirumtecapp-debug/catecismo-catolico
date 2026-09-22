import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetFile = path.join(__dirname, '..', 'data', 'novenas.json');

const novenas = [
  {
    id: "santa-teresinha",
    titulo: "Novena Milagrosa de Santa Terezinha do Menino Jesus (A Novena das Rosas)",
    subtitulo: "Doutora da Igreja e Padroeira das Missões",
    tipo: "fixa",
    padroeiro_de: "Missões Universais, Missionários, Vocações, Sacerdotes e Causas de Conversão",
    festa_liturgica: {
      dia: 1,
      mes: 10,
      nome: "Festa Litúrgica de Santa Teresinha do Menino Jesus"
    },
    simbolo: "🌹",
    cor: "rose",
    imagem: "assets/img/santos/ns_santa-teresinha-do-menino-jesus.png",
    instrucoes: "A Novena das Rosas comemora os 24 anos de Santa Terezinha na terra. Em cada um dos 9 dias reza-se a Intenção do Dia, a Oração da Novena à Santíssima Trindade pedindo a graça e o sinal de uma rosa, 24 vezes o Glória ao Pai com a invocação a Santa Terezinha por cada ano de sua vida terrena, e finaliza-se com 1 Ave-Maria e 1 Pai-Nosso.",
    oracao_inicial: "Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\nÓ Santa Terezinha do Menino Jesus e da Sagrada Face, modelo de pureza, de humildade e de abandono filial aos braços do Pai: colocamo-nos sob a vossa proteção e vos pedimos que sejais nossa intercessora no Céu.",
    oracao_padrao_dia: "Santíssima Trindade: Pai, Filho e Espírito Santo: eu vos agradeço por todas as graças com que enriqueceste a vida de vossa serva, Santa Terezinha do Menino Jesus e da Sagrada Face, nestes 24 anos que passou na terra. E pelos méritos de tão querida santinha, concedei-me a graça que ardentemente vos peço … (faça aqui o pedido), se for conforme a Vossa Santíssima Vontade e para a salvação de minha alma (ou da pessoa por quem está rezando).\n\nAjudai minha fé e minha esperança, Santa Terezinha, cumprindo mais uma vez vossa promessa de que ficareis no Céu a fazer o bem na terra, permitindo que eu ganhe um rosa em sinal de que alcançarei a graça pedida.",
    oracao_final: "Em seguida rezar 24 vezes, por cada ano de Santa Terezinha na terra:\n“Glória ao Pai, ao Filho e ao Espírito Santo como era no princípio, agora e sempre. Amém.”\nSanta Terezinha do Menino Jesus e da Sagrada Face, rogai por mim (ou o nome da pessoa por quem está intercedendo).\n\nPara finalizar rezar:\n1 Ave-Maria e 1 Pai-Nosso.\n\n\"Do céu eu farei cair sobre a Terra uma chuva de Rosas.\"",
    dias: [
      {
        dia: 1,
        tema: "Santa Terezinha doutora e amante da Igreja",
        intencao: "Neste dia rezemos pelos que exercem o ministério sacerdotal, pela santificação do Clero e pelas intenções do coração do Santo Padre.",
        reflexao: "1º dia – Pelo Clero\n\nSanta Terezinha compreendeu a grandeza inestimável do sacerdócio e consagrou sua vida no Carmelo para sustentar os sacerdotes em sua santidade e fidelidade ministerial.",
        oracao: "Senhor Jesus Cristo, Sumo e Eterno Sacerdote, pelo amor filial que Santa Terezinha devotou à Vossa Igreja, santificai os Vossos sacerdotes, fortalecei os bispos e iluminai as intenções do coração do Santo Padre."
      },
      {
        dia: 2,
        tema: "Santa Terezinha padroeira das missões",
        intencao: "Neste dia rezemos pelos missionários espalhados no mundo inteiro e suas necessidades espirituais e materiais.",
        reflexao: "2º dia – Pelos Missionários\n\nSem jamais cruzar as portas do claustro de Lisieux, Santa Terezinha abraçou todos os confins da terra em suas orações e sacrifícios, sendo proclamada Padroeira Universal das Missões.",
        oracao: "Ó Deus de amor, sustentai com a força do Espírito Santo todos os missionários e missionárias do Evangelho no mundo inteiro. Providenciai o sustento de suas necessidades e frutificai seu trabalho para a salvação dos povos."
      },
      {
        dia: 3,
        tema: "Santa Terezinha que teve uma vida de sacrifícios pelas almas",
        intencao: "Neste dia rezemos pelos Cristãos que são perseguidos e martirizados por sua fidelidade e amor a Cristo.",
        reflexao: "3º dia – Pelos Cristãos perseguidos e martirizados\n\nTeresinha descobriu que o sofrimento aceito com paciência e amor é redenção oculta que fecunda a Igreja nas provações.",
        oracao: "Senhor Jesus, concedei a graça da fortaleza, a consolação celeste e a firmeza da fé a todos os Vossos fiéis que sofrem ameaças, prisões, torturas e martírio em defesa do Vosso Santo Nome."
      },
      {
        dia: 4,
        tema: "Santa Terezinha que viveu em uma família santa",
        intencao: "Neste dia rezemos pela união e santificação das famílias.",
        reflexao: "4º dia – Pelas Famílias\n\nEducada no santuário doméstico dos santos pais Luís e Zélia Martin, Teresinha nos ensina a beleza da ternura, da oração em família e do testemunho cristão no lar.",
        oracao: "Jesus, Maria e José, Sagrada Família de Nazaré, santificai os nossos lares. Restabelecei a união onde há discórdia, a fidelidade onde há incerteza e a fé viva em todas as famílias cristãs."
      },
      {
        dia: 5,
        tema: "Santa Terezinha padroeira dos jovens",
        intencao: "Neste dia rezemos pelos jovens do Projeto Juventude para Jesus e pela juventude do mundo inteiro.",
        reflexao: "5º dia – Pelos Jovens\n\nEntrando no Carmelo ainda adolescente e partindo para o Céu aos 24 anos, Teresinha demonstra que a juventude é o tempo propício para doar a vida com radicalidade a Deus.",
        oracao: "Pai de bondade, guardai o coração de todos os jovens. Despertai neles o ardor vocacional, a pureza dos sentimentos e a alegria de construir uma civilização do amor alicerçada no Evangelho."
      },
      {
        dia: 6,
        tema: "Santa Terezinha que foi curada pelo sorriso de Maria",
        intencao: "Neste dia rezemos pelos que sofrem de depressão, pelos que vivem oprimidos e sem sentido de vida.",
        reflexao: "6º dia – Pelos que sofrem de depressão\n\nNa infância, quando uma grave e obscura enfermidade roubava suas forças, Santa Terezinha foi milagrosamente curada pelo afetuoso sorriso da Virgem Maria.",
        oracao: "Ó Virgem Maria do Sorriso, estendei o Vosso manto de amor e esperança sobre todos os que padecem de depressão, angústia, solidão e crises emocionais, restituindo-lhes a alegria do viver e a paz de espírito."
      },
      {
        dia: 7,
        tema: "Santa Terezinha apaixonada por Jesus",
        intencao: "Neste dia rezemos para que todos tenham um coração inflamado de amor a Cristo.",
        reflexao: "7º dia – Para que todos amem a Cristo\n\n'Minha vocação é o Amor! No coração da Igreja serei o Amor!' Teresinha viveu consumida no propósito de consolar Jesus e atrair almas para o Seu Sagrado Coração.",
        oracao: "Espírito Santo consolador, abrasai nosso coração com a mesma chama viva de amor que consumiu Santa Terezinha, para que amemos a Cristo com total pureza e dedicação em cada ato do nosso dia."
      },
      {
        dia: 8,
        tema: "Santa Terezinha próxima dos prisioneiros",
        intencao: "Neste dia rezemos por todos os encarcerados e pelos que se encontram presos em si mesmo, pelo pecado.",
        reflexao: "8º dia – Pelos prisioneiros\n\nComovida com a alma do prisioneiro Pranzini, ofereceu preces ardentes até vê-lo beijar o crucifixo no cadafalso, confiando cegamente no perdão divino.",
        oracao: "Deus de infinita compaixão, libertai os cativos de todas as prisões espirituais, materiais e dos vícios. Concedei-lhes a graça do arrependimento sincero e o reencontro com a Vossa misericórdia paterna."
      },
      {
        dia: 9,
        tema: "Santa Terezinha solidária aos incrédulos",
        intencao: "Neste último dia da Novena de Santa Terezinha, rezemos pelos que não creem, não esperam e não confiam em Deus.",
        reflexao: "9º dia – Pelos incrédulos\n\nNos últimos meses de vida na terra, suportou a noite escura da fé em comunhão de sacrifício pelos ateus e incrédulos, para que a luz de Deus os iluminasse.\n\n\"Do céu eu farei cair sobre a Terra uma chuva de Rosas.\"",
        oracao: "Senhor Deus, Luz indefectível, iluminai as mentes e tocai os corações dos que vivem distantes da fé e da esperança cristã. E dignai-Vos atender a graça que com fé viva vos suplicamos nesta novena por intercessão de Santa Terezinha. Amém."
      }
    ]
  },
  {
    id: "padre-pio",
    titulo: "Novena Oficial de São Pio de Pietrelcina (Padre Pio)",
    subtitulo: "Estigmatizado de San Giovanni Rotondo e Apóstolo da Confissão",
    tipo: "fixa",
    padroeiro_de: "Voluntários da Defesa Civil, Adolescentes, Confessores e Alívio do Sofrimento",
    festa_liturgica: {
      dia: 23,
      mes: 9,
      nome: "Memória Litúrgica de São Pio de Pietrelcina, Presbítero"
    },
    simbolo: "✝️",
    cor: "amber",
    imagem: "assets/img/santos/ns_sao-padre-pio-de-pietrelcina.jpeg",
    instrucoes: "A Novena a São Padre Pio celebra o capuchinho que carregou em seu corpo os estigmas da Paixão de Cristo por 50 anos. Tradicionalmente rezada de 14 a 22 de setembro (com festa litúrgica em 23 de setembro), culmina com a célebre oração 'Fica Comigo, Senhor' e a Coroinha ao Sagrado Coração de Jesus que o santo rezava diariamente por todos os que lhe pediam orações.",
    oracao_inicial: "Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\nÓ Deus, que a São Pio de Pietrelcina, sacerdote capuchinho, concedestes o privilégio insigne de participar, de modo admirável, da Paixão de Vosso Filho: concedei-nos, por sua virtuosa intercessão, a graça de nos unirmos à Cruz de Cristo para alcançarmos a glória da ressurreição.",
    oracao_padrao_dia: "Ó São Padre Pio, amado protetor das almas que sofrem, vós que passáveis até 16 horas diárias no confessionário acolhendo os pecadores e enxugando as lágrimas dos aflitos: olhai com benevolência para mim. Vós que prometestes estar à porta do Paraíso esperando até que o último de vossos filhos espirituais entre: acolhei a súplica que com tanta confiança vos apresento (faça aqui o seu pedido pessoal)... 'Reza, tem fé e não te preocupes. A preocupação é inútil. Deus é misericordioso e ouvirá a tua oração'.",
    oracao_final: "Oração de São Padre Pio: 'Fica comigo, Senhor, pois preciso da Tua presença para não Te esquecer. Tu sabes com que facilidade eu Te abandono. Fica comigo, Senhor, porque sou fraco e preciso da Tua força para não cair tantas vezes. Fica comigo, Jesus, porque na hora da morte quero estar unido a Ti, se não pela comunhão, ao menos pela graça e pelo amor. Fica comigo, Senhor!' São Pio de Pietrelcina, rogai por nós. Pai Nosso, Ave Maria e Glória ao Pai. Amém.",
    dias: [
      {
        dia: 1,
        tema: "A Oração Incessante e o Santo Rosário",
        intencao: "Pelo fervor na oração diária e devoção filial ao Santo Terço.",
        reflexao: "Padre Pio andava dia e noite com o terço nas mãos e costumava dizer: 'O Rosário é a arma para estes tempos'. Para ele, a oração não era um dever pesado, mas o oxigênio da alma.",
        oracao: "São Padre Pio, ensinai-me a rezar sem cessar e com o coração desarmado. Que o Santo Terço seja a minha fortaleza diária contra o pecado e o desânimo."
      },
      {
        dia: 2,
        tema: "Os Santos Estigmas e o Amor à Cruz",
        intencao: "Pelos que carregam pesadas enfermidades no corpo e na alma.",
        reflexao: "Em 20 de setembro de 1918, diante do crucifixo do coro velho, Padre Pio recebeu no corpo as chagas visíveis de Jesus. Ele não pediu alívio da dor, mas suportou tudo por amor às almas.",
        oracao: "Ó santo estigmatizado do Gargano, ajudai-me a não desperdiçar as minhas dores na revolta. Concedei-me a virtude de unir meus sofrimentos à Paixão redentora de Nosso Senhor."
      },
      {
        dia: 3,
        tema: "O Sacramento da Penitência e o Confessionário",
        intencao: "Pela santa confissão de todos os fiéis e santidade dos sacerdotes confessores.",
        reflexao: "Milhares de pessoas viajavam do mundo inteiro para San Giovanni Rotondo para confessar-se com ele. Ele lia os corações e arrancava os pecadores mais endurecidos das garras do inferno.",
        oracao: "Alcançai-me, São Padre Pio, a graça de um arrependimento sincero de todas as minhas culpas. Dai-me a coragem de me confessar com frequência e com inteira sinceridade de alma."
      },
      {
        dia: 4,
        tema: "O Amor Ardente pela Santa Missa",
        intencao: "Pela reverência e recolhimento diante do Santo Sacrifício do Altar.",
        reflexao: "A Missa do Padre Pio durava horas e era uma verdadeira subida mística ao Monte Calvário. Quem assistia à sua celebração via lágrimas brotarem de seus olhos no momento da consagração.",
        oracao: "Senhor Jesus, pelo exemplo de São Pio, renovai em nós o amor ao mistério eucarístico. Que participemos de cada Santa Missa com adoração profunda e tremor sagrado."
      },
      {
        dia: 5,
        tema: "A Casa Alívio do Sofrimento e a Caridade",
        intencao: "Pelos médicos, enfermeiros e todos os doentes internados em hospitais.",
        reflexao: "Para além da vida espiritual, Padre Pio fundou a 'Casa Sollievo della Sofferenza', um dos hospitais mais modernos da Europa, ensinando que em cada doente se serve ao próprio Cristo padecente.",
        oracao: "Abençoai os hospitais e os profissionais da saúde. Fazei que a ciência médica caminhe sempre unida ao amor cristão e ao respeito sagrado pela vida humana."
      },
      {
        dia: 6,
        tema: "A Obediência Heroica nas Provações da Igreja",
        intencao: "Pela fidelidade filial à Santa Igreja e paciência nas injustiças.",
        reflexao: "Quando foi proibido de celebrar a Missa em público e de atender confissões durante anos por investigações e falsas acusações, Padre Pio obedeceu em silêncio absoluto, dizendo: 'A Igreja é nossa Mãe'.",
        oracao: "Livrai-me da rebeldia e do espírito de murmuração. Concedei-me, São Padre Pio, a paciência heroica para suportar calúnias e incompreensões com o coração em paz."
      },
      {
        dia: 7,
        tema: "O Amor Filial a Nossa Senhora das Graças",
        intencao: "Pela consagração de nossas vidas ao Imaculado Coração de Maria.",
        reflexao: "Padre Pio chamava a Virgem Santíssima carinhosamente de 'Minha Mamãezinha'. Era Ela quem cuidava de suas feridas e o consolava nas noites escuras de combate espiritual.",
        oracao: "Ó doce Mãe de Deus, a quem São Pio tanto amou: guardai minha família sob o Vosso manto maternal e não permitais que eu me perca eternamente."
      },
      {
        dia: 8,
        tema: "O Combate Vitorioso contra as Trevas",
        intencao: "Pela libertação de toda tentação demoníaca, medo e opressão espiritual.",
        reflexao: "O demônio atacava Padre Pio fisicamente em sua cela durante a noite, mas o santo ria-se das ameaças do maligno, refugiando-se no Nome Santíssimo de Jesus e de Maria.",
        oracao: "São Padre Pio, defendei-me dos ardis do diabo. Quando a tentação for violenta e a angústia quiser me dominar, socorrei-me com a vossa poderosa bênção sacerdotal."
      },
      {
        dia: 9,
        tema: "O Santo Abandono: 'Reza, tem Fé e não te Preocupes!'",
        intencao: "Pela paz profunda da alma, entrega confiante a Deus e atendimento da nossa súplica.",
        reflexao: "No dia 22 de setembro de 1968, Padre Pio celebrou sua última Santa Missa e na madrugada de 23 de setembro expirou sussurrando: 'Jesus, Maria...'. Ele partiu deixando-nos o segredo da santidade.",
        oracao: "Ó amado São Padre Pio de Pietrelcina, neste nono dia de prece fervorosa, tomo posse de vosso bendito conselho: não quero mais me preocupar com o amanhã, mas descansar na Providência Divina. Apresentai ao Coração Sagrado de Jesus a súplica desta novena e alcançai-me a graça que vos pedi. Sede o meu pai espiritual e guiai-me até o Céu. Amém."
      }
    ]
  },
  {
    id: "sao-geraldo-magela",
    titulo: "Novena Oficial de São Geraldo Magela",
    subtitulo: "Padroeiro das Mães, das Gestantes e das Vocações Religiosas",
    tipo: "fixa",
    padroeiro_de: "Mães grávidas, Gestantes em perigo de parto, Mulheres estéreis e Crianças",
    festa_liturgica: {
      dia: 16,
      mes: 10,
      nome: "Festa Litúrgica de São Geraldo Magela"
    },
    simbolo: "👶",
    cor: "amber",
    imagem: "assets/img/santos/10-16-sao-geraldo-majella-irmao-leigo-redentorista.jpg",
    instrucoes: "São Geraldo Magela (1726-1755), irmão leigo da Congregação do Santíssimo Redentor (Redentoristas), é celebrado universalmente pela Igreja como o grande padroeiro das mães e das gestantes devido aos incontáveis milagres de partos abençoados e proteção de bebês em gestação de alto risco.",
    oracao_inicial: "Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\nÓ Deus Todo-Poderoso, que em São Geraldo Magela destes à Vossa Igreja um exemplo magnífico de humildade, de pureza e de ardente caridade para com os necessitados, concedei-nos, por sua poderosa intercessão, a graça de vivermos inteiramente consagrados à Vossa santa vontade.",
    oracao_padrao_dia: "Ó glorioso São Geraldo, amigo dos pequeninos e dos aflitos, vós que na vossa vida terrena nunca deixastes sem amparo uma mãe angustiada ou uma criança em perigo: olhai benignamente para mim e obtende-me de Jesus a graça que vos suplico (faça o pedido particular, especialmente a bênção da gestação, da maternidade e do lar). Mostrai que sois meu protetor vigilante e meu advogado diante do Trono da Graça.",
    oracao_final: "São Geraldo, protetor das mães e das famílias, rogai por nós, abençoai as gestantes, protegei as criancinhas no seio de suas mães e guardai nossas famílias em santidade e amor cristão. Pai Nosso, Ave Maria e Glória ao Pai. Amém.",
    dias: [
      {
        dia: 1,
        tema: "A Pureza de Coração e a Infância Espiritual",
        intencao: "Pelas crianças e pela pureza de sentimentos na família cristã.",
        reflexao: "Desde a sua infância humilde em Muro Lucano, Geraldo buscava a companhia de Jesus Sacramentado com um coração despojado de qualquer apego terreno.",
        oracao: "São Geraldo, rogai pelas crianças de nosso tempo. Livrai-as dos perigos do mundo e fazei que os pais saibam educá-las na santa fé católica com doçura e prudência."
      },
      {
        dia: 2,
        tema: "A Conformidade com a Vontade de Deus",
        intencao: "Pela aceitação serena das provas e enfermidades da vida.",
        reflexao: "Sobre a porta do seu quarto de enfermo, Geraldo escreveu: 'Aqui se faz a vontade de Deus, como Ele quer e por todo o tempo que Ele quiser'. Essa era a fonte de sua invicta alegria.",
        oracao: "Ensinai-me, ó Santo Redentorista, a acolher os desígnios de Deus na minha vida, mesmo quando a cruz parecer pesada. Que minha única vontade seja agradar a Nosso Senhor."
      },
      {
        dia: 3,
        tema: "A Caridade Incansável para com os Pobres",
        intencao: "Pelos lares carentes de pão, abrigo e trabalho digno.",
        reflexao: "Geraldo não hesitava em repartir o próprio alimento e as roupas do convento com os mendigos, reconhecendo em cada irmão necessitado o rosto vivo de Jesus Cristo.",
        oracao: "Ó São Geraldo, ajudai-nos a cultivar um coração compassivo. Abri as portas da providência divina para as famílias que sofrem privações materiais e espirituais."
      },
      {
        dia: 4,
        tema: "O Silêncio Heroico diante da Calúnia",
        intencao: "Pela restauração da honra dos falsamente acusados e pela justiça.",
        reflexao: "Quando falsamente acusado de conduta indigna, Geraldo suportou as censuras em silêncio absoluto e oração, imitando Jesus diante dos juízes, até que a própria verdade triunfasse.",
        oracao: "Intercedei, virtuoso São Geraldo, por todos os que são vítimas de maledicências, mentiras e injustiças. Dai-nos serenidade nas incompreensões e firmeza na defesa da honra cristã."
      },
      {
        dia: 5,
        tema: "O Padroeiro das Mães e das Gestantes",
        intencao: "Por todas as mulheres grávidas, especialmente aquelas com gestações de risco.",
        reflexao: "O lenço que São Geraldo esqueceu na casa de uma jovem salvou a vida dela e de seu bebê em um parto desenganado pelos médicos. Desde então, a Igreja confia as gestantes ao seu patrocínio.",
        oracao: "Ó querido São Geraldo, colocamos sob o vosso manto sagrado todas as mães grávidas. Abençoai seus corpos, protegei o desenvolvimento dos fetos, livrai-os de abortos e concedei um parto seguro e abençoado."
      },
      {
        dia: 6,
        tema: "A Bênção da Fecundidade e da Esperança",
        intencao: "Pelos casais que enfrentam a provação da esterilidade e sonham em ter filhos.",
        reflexao: "Inúmeros casais que a medicina considerava incapazes de gerar filhos alcançaram o milagre da conceição pela intercessão fervorosa junto à relíquia de São Geraldo.",
        oracao: "Consolai os esposos que sofrem pela ausência de filhos. Se for da vontade divina, impetrai para eles a bênção da paternidade e da maternidade, ou a coragem bendita da adoção amorosa."
      },
      {
        dia: 7,
        tema: "O Zelo pelas Vocações Sacerdotais e Religiosas",
        intencao: "Pelo clero redentorista e pelo despertar de santas vocações para a Igreja.",
        reflexao: "Como irmão coadjutor redentorista, Geraldo foi braço fiel de Santo Afonso de Ligório, vivendo a obediência perfeita e inspirando dezenas de jovens a se consagrarem a Deus.",
        oracao: "Suscitai, São Geraldo, vocações generosas nos seminários e mosteiros. Dai aos jovens o entusiasmo de deixar as ilusões do século para seguir a Cristo nos conselhos evangélicos."
      },
      {
        dia: 8,
        tema: "A Adoração ao Santíssimo Sacramento",
        intencao: "Por uma fé profunda no mistério da Santa Eucaristia.",
        reflexao: "São Geraldo passava noites inteiras ajoelhado diante do Sacrário em êxtase de amor, chamando o Santíssimo Sacramento de seu 'Amigo Prisioneiro de Amor'.",
        oracao: "Aumentai em nossas almas a reverência diante de Jesus Hóstia. Livrai-nos das distrações no templo e fazei que a Comunhão seja o alimento indispensável de nossa caminhada."
      },
      {
        dia: 9,
        tema: "A Morte Santa e a Glória Eterna",
        intencao: "Pela perseverança final de nossas famílias e entrada na glória do Céu.",
        reflexao: "São Geraldo entregou sua alma a Deus aos 29 anos de idade, sereno, cantando as misericórdias do Senhor. Ele partiu deste mundo para ser nosso intercessor perpétuo junto de Deus.",
        oracao: "Ó São Geraldo Magela, acolhei sob a vossa proteção perpétua a mim, aos meus filhos e a toda a minha parentela. Alcançai-nos a graça solicitada nesta novena e conduzi-nos à pátria celeste onde contemplaremos convosco o esplendor de Deus por todos os séculos dos séculos. Amém."
      }
    ]
  },
  {
    id: "santa-edwiges",
    titulo: "Novena Tradicional de Santa Edwiges",
    subtitulo: "Padroeira dos Pobres, dos Endividados e dos Desvalidos",
    tipo: "fixa",
    padroeiro_de: "Endividados, Falidos, Moradores de rua, Prisioneiros por dívidas e Mães de família",
    festa_liturgica: {
      dia: 16,
      mes: 10,
      nome: "Festa Litúrgica de Santa Edwiges, Religiosa"
    },
    simbolo: "🏰",
    cor: "amber",
    imagem: "assets/img/santos/ns_santa-edwiges.webp",
    instrucoes: "Santa Edwiges (1174-1243), duquesa da Silésia e depois religiosa no convento de Trebnitz, usava sua fortuna para libertar os prisioneiros endividados, pagar as contas dos pobres e garantir que nenhuma família ficasse desabrigada.",
    oracao_inicial: "Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\nÓ Deus, que ensinastes a Santa Edwiges a preferir com alegria a pobreza do Evangelho às delícias e grandezas de um reino ducal, concedei-nos, por suas preces e méritos, a graça de desapegar nossos corações dos bens transitórios e confiar unicamente na Vossa Providência Divina.",
    oracao_padrao_dia: "Ó Santa Edwiges, vós que na terra fostes o amparo dos desvalidos, a mãe carinhosa dos órfãos e o refúgio seguro dos endividados: olhai com benevolência para as aflições materiais e financeiras de meu lar. Vós bem sabeis o desespero e a dor de quem não consegue saldar suas dívidas ou sustentar dignamente os seus. Intercedei por mim diante de Nosso Senhor Jesus Cristo para que eu obtenha o socorro necessário (faça o pedido de trabalho, quitação de dívidas ou bênção financeira)... e a graça suprema da salvação da minha alma.",
    oracao_final: "Santa Edwiges, rogai por nós e livrai nossas famílias das dívidas, do desemprego, do desespero e da ruína espiritual. Pai Nosso, Ave Maria e Glória ao Pai. Amém.",
    dias: [
      {
        dia: 1,
        tema: "A Humildade nas Honrarias e Riquezas",
        intencao: "Pelo desapego do luxo e sabedoria na administração do dinheiro familiar.",
        reflexao: "Mesmo cercada de criados e da nobreza real, Edwiges vestia roupas singelas e usava o ouro da corte para vestir os nus e saciar a fome dos miseráveis.",
        oracao: "Santa Edwiges, curai nosso coração do apego excessivo às coisas materiais e concedei-nos prudência para administrar retamente os recursos que Deus colocou em nossas mãos."
      },
      {
        dia: 2,
        tema: "O Socorro aos Prisioneiros e Endividados",
        intencao: "Pela libertação das dívidas asfixiantes e paz de espírito nos lares.",
        reflexao: "Na Idade Média, quem não pagava suas dívidas era lançado em masmorras escuras. Santa Edwiges pagava as dívidas desses homens e os devolvia livres a seus lares.",
        oracao: "Ó santa protetora dos endividados, vinde em socorro de minhas finanças. Que eu consiga honrar todos os meus compromissos legítimos e viver sem a angústia dos débitos."
      },
      {
        dia: 3,
        tema: "A Prontidão no Perdão e na Pacificação",
        intencao: "Pela concórdia e cessação de brigas e disputas por heranças e bens.",
        reflexao: "Quando seu esposo e seus filhos se viram envolvidos em conflitos políticos, Santa Edwiges colocou-se de joelhos como pacificadora incansável, unindo a justiça ao perdão.",
        oracao: "Afastai de nossas famílias toda discórdia originada pelo dinheiro. Que o amor de Deus reine em nossos lares acima de qualquer interesse pecuniário passageiro."
      },
      {
        dia: 4,
        tema: "A Solidariedade com os Desempregados",
        intencao: "Pela abertura de postos de trabalho justos e dignos para quem procura sustento.",
        reflexao: "Edwiges não dava apenas esmolas, criava oficinas e obras beneficentes onde os trabalhadores encontravam dignidade para ganhar o pão com o suor de sua fronte.",
        oracao: "Abençoai os pais e mães de família desempregados. Abri portas de trabalho honesto e abençoado para quem está sem perspectiva de sustento neste dia."
      },
      {
        dia: 5,
        tema: "A Paciência no Luto e na Provação Familiar",
        intencao: "Pelo consolo das mães e pais que perderam seus filhos.",
        reflexao: "Santa Edwiges viu morrer quase todos os seus seis filhos, inclusive o valente Henrique, morto na batalha contra os tártaros. Ela não blasfemou, antes disse: 'Deus me deu, Deus tirou, louvado seja Seu Santo Nome.'",
        oracao: "Dai-nos, ó Santa Edwiges, a fortaleza cristã para suportar os golpes da vida. Acolhei sob a vossa intercessão as famílias feridas pela dor do luto."
      },
      {
        dia: 6,
        tema: "A Oração e o Jejum Fervorosos",
        intencao: "Pelo crescimento na oração perseverante e espírito penitencial.",
        reflexao: "Para além de suas esmolas, Edwiges sustentava suas obras na oração noturna ininterrupta e no jejum austero, sabendo que sem a graça divina nada se constrói de duradouro.",
        oracao: "Despertai em minha alma o zelo pela oração diária. Que eu não busque a Deus apenas nas horas de aperto material, mas O adore em espírito e verdade todos os dias."
      },
      {
        dia: 7,
        tema: "A Proteção aos Órfãos e Viúvas",
        intencao: "Pelas instituições de caridade e lares que acolhem idosos e crianças abandonadas.",
        reflexao: "O Convento de Trebnitz fundado por Edwiges tornou-se um refúgio celestial para as mulheres indefesas, viúvas e filhas de famílias pobres que não tinham onde morar.",
        oracao: "Ó Santa Edwiges, multiplicai a caridade cristã no mundo. Que nunca faltem corações generosos dispostos a socorrer os que não têm ninguém por eles."
      },
      {
        dia: 8,
        tema: "O Desapego na Vida Religiosa",
        intencao: "Pela fidelidade aos votos batismais e pureza de consciência.",
        reflexao: "Após o falecimento de seu marido, Edwiges ingressou no mosteiro e assumiu com humildade a obediência sob a autoridade da abadessa, que era sua própria filha Gertrude.",
        oracao: "Ajudai-me a vencer o orgulho e o apego aos meus próprios caprichos. Que eu aprenda a obedecer à lei santa do Senhor com alegria e mansidão de espírito."
      },
      {
        dia: 9,
        tema: "A Confiança Total na Divina Providência",
        intencao: "Pela graça da fé inabalável de que Deus jamais abandona os Seus filhos.",
        reflexao: "'Deus provê, Deus proverá, Sua Misericórdia não faltará.' Esta certeza inabalável sustentou Santa Edwiges até a sua páscoa definitiva rumo ao Reino dos Céus.",
        oracao: "Ó gloriosa Santa Edwiges, padroeira dos necessitados e dos endividados, coloco em vossas mãos generosas esta minha prece urgente. Apresentai-a a Nosso Senhor Jesus Cristo e obtende-me o alívio que necessito. Prometo ser grato à vossa intercessão e testemunhar a bondade de Deus em minha vida. Por Cristo, Nosso Senhor. Amém."
      }
    ]
  },
  {
    id: "santa-luzia",
    titulo: "Novena Tradicional de Santa Luzia de Siracusa",
    subtitulo: "Virgem, Mártir e Padroeira da Visão e da Saúde dos Olhos",
    tipo: "fixa",
    padroeiro_de: "Oftalmologistas, Cegos, Pessoas com doenças oculares e Vítimas de perseguição religiosa",
    festa_liturgica: {
      dia: 13,
      mes: 12,
      nome: "Memória Litúrgica de Santa Luzia, Virgem e Mártir"
    },
    simbolo: "👀",
    cor: "emerald",
    imagem: "assets/img/santos/ns_santa-luzia.jpg",
    instrucoes: "Santa Luzia (283-304), nascida em Siracusa na Sicília, preferiu derramar seu sangue e sofrer o martírio durante a perseguição de Diocleciano antes de manchar sua virgindade ou renegar a fé cristã. Seu próprio nome significa 'Cheia de Luz', sendo invocada há 17 séculos como defensora da vista corpórea e espiritual.",
    oracao_inicial: "Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\nÓ Deus, que alegrais a Vossa Igreja com a celebração da santa virgem e mártir Luzia, concedei-nos, por sua virtuosa intercessão, a graça de uma vida santa e luminosa neste mundo e a posse da luz eterna na glória do Céu.",
    oracao_padrao_dia: "Ó Santa Luzia, virgem sapientíssima e mártir gloriosa, que preferistes que vossos olhos fossem vazados e arrancados antes de renegar o Cristo Salvador e manchar vossa pureza de fé: olhai com compaixão para mim. Vinde em socorro da saúde de meus olhos e preservai-me de toda enfermidade na visão (faça aqui o pedido de cura da vista ou intenção particular). Mas, acima de tudo, livrai minha alma das trevas do pecado e da cegueira espiritual, para que meus passos sejam sempre iluminados pelo Evangelho da verdade.",
    oracao_final: "Santa Luzia, defensora da visão e espelho da fé pura, guardai a luz dos nossos olhos para que possamos contemplar as maravilhas da criação, e guardai a luz de nossa alma para que nunca nos desviemos do caminho do Céu. Pai Nosso, Ave Maria e Glória ao Pai. Amém.",
    dias: [
      {
        dia: 1,
        tema: "A Luz da Fé nas Trevas da Perseguição",
        intencao: "Pela saúde dos olhos e firmeza na fé dos cristãos perseguidos.",
        reflexao: "Mesmo em meio ao paganismo hostil do Império Romano, Luzia guardou acesa no peito a lâmpada da fé cristã, alimentada pela oração assídua e pelos ensinamentos dos apóstolos.",
        oracao: "Santa Luzia, preservai meus olhos físicos de qualquer moléstia ou cegueira, e concedei-me a coragem de professar abertamente minha fé católica onde quer que eu esteja."
      },
      {
        dia: 2,
        tema: "A Peregrinação e a Cura de Dona Eutíquia",
        intencao: "Pela saúde de nossos pais, mães e familiares enfermos.",
        reflexao: "Com amor filial imenso, Luzia conduziu sua mãe enferma ao túmulo de Santa Águeda em Catânia, onde obtiveram a cura milagrosa por meio de preces fervorosas e lágrimas de esperança.",
        oracao: "Concedei-nos, Senhor, pela prece de Santa Luzia, a cura dos membros enfermos de nossa família e um espírito de amorosa gratidão por cada graça recebida."
      },
      {
        dia: 3,
        tema: "A Consagração da Pureza a Cristo",
        intencao: "Pela castidade e santidade de costumes dos jovens e noivos.",
        reflexao: "Agradecida pela cura da mãe, Luzia consagrou irrevogavelmente sua virgindade ao Divino Esposo Jesus, recusando as propostas mundanas e os cortejos de pretendentes idólatras.",
        oracao: "Ó doce mártir Luzia, protegei o pudor e a pureza das nossas crianças e jovens. Que eles não sejam fascinados pelas ilusões passageiras e imorais do mundo."
      },
      {
        dia: 4,
        tema: "A Distribuição dos Bens aos Pobres",
        intencao: "Pelos que sofrem miséria material e pelas obras caritativas católicas.",
        reflexao: "Com o consentimento da mãe, Luzia vendeu todas as ricas propriedades e joias da herança e distribuiu cada moeda aos necessitados, às viúvas e aos doentes de Siracusa.",
        oracao: "Livrai-me, Santa Luzia, do egoísmo e da avareza. Ensinai-me a ver com os olhos da misericórdia aqueles que sofrem à minha porta e a repartir o que tenho com generosidade."
      },
      {
        dia: 5,
        tema: "A Sabedoria Inspirada pelo Espírito Santo",
        intencao: "Pela sabedoria dos juízes, governantes e educadores.",
        reflexao: "Levada perante o tirano Pascásio, Luzia respondeu com palavras tão sábias e irrefutáveis que o governador ficou confuso, cumprindo-se a promessa de Jesus: 'O Espírito Santo falará por vós.'",
        oracao: "Espírito Consolador, iluminai meu entendimento. Dai-me discernimento para não cair nas armadilhas do erro e coragem para defender a verdade moral da Igreja."
      },
      {
        dia: 6,
        tema: "A Inabalável Fortaleza do Templo de Deus",
        intencao: "Pela proteção contra as investidas do demônio e do pecado.",
        reflexao: "Quando o tirano ordenou que ela fosse arrastada a um lugar de pecado infame, o corpo de Luzia tornou-se mais pesado que chumbo e imóvel como uma rocha, pois era templo inviolável do Espírito de Deus.",
        oracao: "Guardai meu corpo e minha alma em santidade, Santa Luzia. Que nenhuma tentação consiga me arrastar para longe do estado de graça."
      },
      {
        dia: 7,
        tema: "O Fogo que não Consome os Santos",
        intencao: "Pelos que passam pela fornalha de tentações, calúnias e escândalos.",
        reflexao: "Acenderam ao redor de Luzia uma fogueira de piche e enxofre, mas as chamas não a tocaram, demonstrando visivelmente a proteção dos anjos sobre a serva de Cristo.",
        oracao: "Nas fornalhas de tribulações que enfrento, dai-me serenidade. Que as chamas da maldade humana não queimem a paz de meu espírito nem diminuam minha esperança em Deus."
      },
      {
        dia: 8,
        tema: "A Vitória Gloriosa da Mártir",
        intencao: "Por todos os oftalmologistas e cirurgiões que cuidam da vista humana.",
        reflexao: "Antes de receber o golpe de espada final, Luzia profetizou a queda do tirano e a paz que logo floresceria para os cristãos, expirando em doce comunhão de amor divino.",
        oracao: "Abençoai os médicos dos olhos, os cirurgiões e todos os que se dedicam à ciência oftalmológica. Que suas mãos sejam instrumentos de Deus para devolver a visão a quem precisa."
      },
      {
        dia: 9,
        tema: "A Luz Eterna da Visão Beatífica",
        intencao: "Pela cura de toda cegueira física e espiritual e salvação eterna.",
        reflexao: "Santa Luzia agora contempla para sempre, face a face, a beleza infinita da Santíssima Trindade. Ela é nossa intercessora fiel na terra até o encontro definitivo na glória.",
        oracao: "Ó Santa Luzia, virgem e mártir, protegei a luz dos meus olhos, curai qualquer fraqueza visual ou enfermidade que me aflija, e concedei-me a graça que com fé vos pedi nesta novena. Acima de tudo, guiai-me para que eu viva na luz de Deus e mereça contemplar convosco no Paraíso o Salvador. Amém."
      }
    ]
  },
  {
    id: "nossa-senhora-aparecida",
    titulo: "Novena Oficial de Nossa Senhora Aparecida",
    subtitulo: "Rainha e Padroeira Principal do Brasil",
    tipo: "fixa",
    padroeiro_de: "Povo Brasileiro, Pescadores, Famílias e Causas da Pátria",
    festa_liturgica: {
      dia: 12,
      mes: 10,
      nome: "Solenidade de Nossa Senhora da Conceição Aparecida, Padroeira do Brasil"
    },
    simbolo: "👑",
    cor: "blue",
    imagem: "assets/img/santos/ns_nossa-senhora-aparecida.png",
    instrucoes: "A Novena da Padroeira do Brasil é rezada anualmente de 3 a 11 de outubro no Santuário Nacional de Aparecida e em todas as paróquias do Brasil, celebrando o encontro milagroso da imagem nas águas do Rio Paraíba do Sul em 1717.",
    oracao_inicial: "Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\nÓ Maria Santíssima, Mãe de Deus e nossa Mãe, que nas águas do Rio Paraíba vos dignastes manifestar o vosso carinho maternal pelo povo brasileiro: acolhei os vossos filhos que hoje se prostram cheios de confiança diante de vossa bendita imagem.",
    oracao_padrao_dia: "Ó Virgem Imaculada, Senhora da Conceição Aparecida, vós que quebrastes as correntes do escravo Zacarias, devolvestes a visão à menina cega e amparastes os humildes pescadores: olhai para a nossa família e para a nossa pátria. Apresentai a Jesus a súplica sincera que neste dia vos apresento (faça o seu pedido pessoal)... Guardai nossos lares no amor, na fidelidade e na paz de Cristo.",
    oracao_final: "Nossa Senhora Aparecida, Padroeira do Brasil, rogai por nós, protegei as nossas famílias e abençoai o nosso Brasil! Pai Nosso, 3 Ave Marias e Glória ao Pai. Amém.",
    dias: [
      {
        dia: 1,
        tema: "A Graça das Águas do Rio Paraíba",
        intencao: "Pelas famílias brasileiras e pelo fim da escassez e da fome.",
        reflexao: "Após horas sem pescar nada, os pescadores encontraram primeiro o corpo da imagem e depois a cabeça. Em seguida, as redes se encheram de peixes até quase romperem.",
        oracao: "Mãe Aparecida, enchei nossas redes de bênçãos quando as forças humanas parecerem esgotadas. Dai-nos pão digno e perseverança na esperança cristã."
      },
      {
        dia: 2,
        tema: "A Luz das Velas que se Acendem Sozinhas",
        intencao: "Pela fé inabalável em meio às trevas da dúvida e da angústia.",
        reflexao: "No humilde oratório dos pescadores, o vento apagou a vela, mas ela reacendeu-se prodigiosamente diante dos devotos, sinal visível da presença celestial de Maria.",
        oracao: "Acendei em nossos corações, Virgem Santa, o fogo da fé viva. Não permitais que o vento do pecado ou da indiferença apague a luz de Cristo em nós."
      },
      {
        dia: 3,
        tema: "A Libertação dos Cativos e Oprimidos",
        intencao: "Pelos que estão presos a vícios, dependências e desespero.",
        reflexao: "As pesadas correntes do escravo Zacarias se desprenderam sozinhas de seus braços quando ele se ajoelhou diante de Nossa Senhora, e seu senhor o acolheu como irmão livre.",
        oracao: "Ó Mãe de Misericórdia, quebrai as correntes espirituais que nos prendem ao pecado e aos maus hábitos. Fazei-nos livres para amar e servir a Deus."
      },
      {
        dia: 4,
        tema: "A Cura da Menina Cega de Nascença",
        intencao: "Pela saúde dos enfermos, especialmente crianças e deficientes visuais.",
        reflexao: "Vinda de longe com a mãe, a menina cega de nascença exclamou maravilhada diante do santuário: 'Mamãe, que linda igreja!' A fé simples alcançou a luz da visão.",
        oracao: "Nossa Senhora Aparecida, abri os nossos olhos para a beleza de Deus e curai as enfermidades que afligem o corpo e o espírito de quem vos suplica."
      },
      {
        dia: 5,
        tema: "A Ferradura Presa na Pedra",
        intencao: "Pela conversão dos zombadores, incrédulos e perseguidores da fé.",
        reflexao: "O cavaleiro descrente que tentou entrar a cavalo na capela para zombar dos devotos viu a pata de seu animal cravar-se na pedra, reconhecendo ali o poder de Deus.",
        oracao: "Convertei, Mãe amável, os corações empedernidos. Dai-lhes a graça do arrependimento e mostrai que o amor de Cristo é mais forte que o orgulho humano."
      },
      {
        dia: 6,
        tema: "O Resgate do Menino no Redemoinho",
        intencao: "Pela salvação e proteção das crianças e dos jovens contra as drogas e os vícios.",
        reflexao: "O menino caíra no rio bravio e era puxado por um redemoinho mortal. A mãe clamou a Nossa Senhora Aparecida e a criança flutuou ilesa até a margem.",
        oracao: "Guardai nossos filhos, Virgem Protetora. Livrai a juventude dos abismos da criminalidade, das más companhias e da perda da fé."
      },
      {
        dia: 7,
        tema: "O Manto Azul e a Coroa Imperial",
        intencao: "Pela paz, pela justiça social e pelos governantes de nosso país.",
        reflexao: "A Princesa Isabel consagrou o Brasil a Nossa Senhora Aparecida, oferecendo-lhe a coroa de ouro e o manto cravejado de pedras que cobrem a sagrada imagem até hoje.",
        oracao: "Rainha do Brasil, velai pela nossa pátria. Iluminai os magistrados e legisladores para que governem com justiça, honestidade e respeito à vida humana desde a concepção."
      },
      {
        dia: 8,
        tema: "A Reconstrução da Imagem Partida",
        intencao: "Pela restauração dos casamentos em crise e das famílias dilaceradas.",
        reflexao: "Quando a sagrada imagem foi covardemente despedaçada em 1978, mãos pacientes de restauradores juntaram cada pedaço sob a proteção de Deus, tornando-a ainda mais querida ao povo.",
        oracao: "Mãe restauradora, ajuntai os pedaços quebrados do nosso coração e das nossas famílias. Curai as mágoas do divórcio, do abandono e restaurai o amor conjugal."
      },
      {
        dia: 9,
        tema: "Acolhimento no Santuário Celeste",
        intencao: "Pela perseverança final de todos os devotos e salvação das almas.",
        reflexao: "Milhões de romeiros chegam a Aparecida descalços, com velas e lágrimas nos olhos. Nenhum filho jamais voltou de lá sem o consolo da Mãe.",
        oracao: "Ó incomparável Senhora da Conceição Aparecida, Mãe de Deus, Rainha dos Anjos, Advogada dos pecadores: neste nono dia vos agradeço a graça de rezar convosco. Atendei a súplica do meu coração e guiai os meus passos até que eu vos contemple um dia na glória celestial. Amém."
      }
    ]
  },
  {
    id: "sao-judas-tadeu",
    titulo: "Novena Canônica de São Judas Tadeu",
    subtitulo: "Apóstolo de Cristo e Patrono das Causas Desesperadas e Aflitas",
    tipo: "fixa",
    padroeiro_de: "Causas impossíveis, Casos desesperados, Doentes desenganados e Conflitos graves",
    festa_liturgica: {
      dia: 28,
      mes: 10,
      nome: "Festa Litúrgica dos Santos Apóstolos Simão e Judas Tadeu"
    },
    simbolo: "🔥",
    cor: "emerald",
    imagem: "assets/img/santos/ns_sao-judas-tadeu.jpg",
    instrucoes: "São Judas Tadeu, parente de Jesus segundo a carne e irmão de São Tiago Menor, é universalmente invocado quando todos os recursos humanos falham. O próprio Nosso Senhor revelou a Santa Brígida da Suécia que recorresse com confiança a São Judas para causas aflitas.",
    oracao_inicial: "Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\nÓ glorioso Apóstolo São Judas Tadeu, servo fiel e amigo de Jesus, a Igreja vos honra e invoca por todo o mundo como o patrono dos casos desesperados, das coisas quase desenganadas. Rogai por mim, que me sinto tão desamparado.",
    oracao_padrao_dia: "São Judas Tadeu, apóstolo amado, valei-me nesta grande necessidade espiritual e temporal (apresente aqui com fervor a sua causa impossível ou aflição profunda). Prometo, ó bendito São Judas, lembrar-me sempre deste grande favor, nunca deixar de vos honrar como meu padroeiro especial e poderoso, e fazer tudo o que estiver em meu alcance para incentivar a devoção para convosco.",
    oracao_final: "São Judas Tadeu, apóstolo glorioso, fazei que as nossas dores se transformem em cânticos de alegria e testemunho da misericórdia de Deus. Rogai por nós e por todos os que invocam o vosso socorro. Pai Nosso, Ave Maria e Glória ao Pai. Amém.",
    dias: [
      {
        dia: 1,
        tema: "O Chamado Apostólico e o Parentesco com Jesus",
        intencao: "Pela santidade de nossa família e fidelidade ao Evangelho.",
        reflexao: "São Judas era primo-irmão de Jesus pela linhagem de Maria e José. Deixou tudo para seguir os passos do Divino Mestre sem reservas.",
        oracao: "Ó São Judas, fazei com que nossa família viva em harmonia com Cristo, abandonando as vaidades passageiras do mundo."
      },
      {
        dia: 2,
        tema: "A Pergunta na Última Ceia",
        intencao: "Por um conhecimento íntimo do mistério do amor de Deus.",
        reflexao: "Na Santa Ceia, Judas perguntou: 'Senhor, por que te manifestarás a nós e não ao mundo?' E Jesus lhe ensinou que o amor guarda a Sua palavra.",
        oracao: "Ensinai-me a guardar a Palavra de Deus em meu coração e a amá-Lo acima de todas as coisas visíveis e invisíveis."
      },
      {
        dia: 3,
        tema: "O Zelo Missionário e a Pregação Destemida",
        intencao: "Pela coragem de dar testemunho da fé no trabalho e na sociedade.",
        reflexao: "Judas pregou o Evangelho pela Judeia, Samaria, Mesopotâmia e Pérsia, levando a luz da cruz a povos mergulhados no erro.",
        oracao: "Concedei-me, bendito apóstolo, intrepidez santa para não me envergonhar da minha fé diante das críticas do mundo."
      },
      {
        dia: 4,
        tema: "A Epístola Canônica de São Judas",
        intencao: "Pela proteção contra falsas doutrinas e enganos morais.",
        reflexao: "Na sua epístola bíblica, Judas exorta a lutar pela fé que de uma vez por todas foi transmitida aos santos, mantendo a caridade.",
        oracao: "Protegei-me das ideologias contrárias à lei divina e dai-me clareza moral para seguir a doutrina imutável da Santa Igreja."
      },
      {
        dia: 5,
        tema: "O Patrono dos Desenganados e sem Esperança",
        intencao: "Pelos que estão à beira do desespero ou de cometer loucuras contra a vida.",
        reflexao: "Santa Brígida escreveu que o Céu reservou o nome de São Judas para ser invocado nas causas que parecem de todo perdidas.",
        oracao: "Vinde em meu auxílio, São Judas! Quando tudo parecer escuro e sem saída, sede o farol da minha esperança em Jesus."
      },
      {
        dia: 6,
        tema: "A Paciência diante das Calúnias e Perseguições",
        intencao: "Pela paz nas disputas judiciais e reconciliação entre parentes.",
        reflexao: "Judas suportou com doçura as perseguições dos sacerdotes idólatras, orando continuamente pela conversão dos que o odiavam.",
        oracao: "Ajudai-me a perdoar a quem me magoou e dai-me serenidade nas tribulações e cobranças difíceis do dia a dia."
      },
      {
        dia: 7,
        tema: "O Poder de Curar Enfermos no Nome de Jesus",
        intencao: "Pela cura de doenças graves e alívio dos doentes hospitalizados.",
        reflexao: "O Rei Abgar de Edessa foi curado milagrosamente de lepra através do ministério apostólico de São Judas Tadeu no nome de Cristo.",
        oracao: "Estendei vossas mãos cheias de bênçãos sobre os que padecem dores físicas incuráveis, obtendo de Deus o alívio e a saúde."
      },
      {
        dia: 8,
        tema: "O Martírio Glorioso com a Maça e o Machado",
        intencao: "Pela fortaleza espiritual nas horas de solidão e agonia.",
        reflexao: "São Judas selou seu amor a Cristo com o próprio sangue na Pérsia, sendo martirizado com golpes de clava por não queimar incenso aos ídolos.",
        oracao: "Ó mártir invencível, dai-me fidelidade até a morte. Que nada neste mundo, nem perigo, nem dor, me separe do amor de Cristo."
      },
      {
        dia: 9,
        tema: "A Coroa Eterna no Céu",
        intencao: "Pela graça impossível que foi suplicada nesta novena e salvação eterna.",
        reflexao: "São Judas reina com os doze apóstolos junto ao Cordeiro imolado. De lá, ele ouve sem cessar os clamores dos que na terra suplicam socorro.",
        oracao: "Glorioso São Judas Tadeu, acolhei com ternura as lágrimas e as preces desta novena. Apresentai o meu pedido ao Coração Sagrado de Jesus e alcançai-me a graça que vos peço. Serei eternamente vosso devoto e cantarei as misericórdias de Deus para sempre. Amém."
      }
    ]
  },
  {
    id: "nossa-senhora-desatadora-dos-nos",
    titulo: "Novena de Nossa Senhora Desatadora dos Nós",
    subtitulo: "A Devoção Mariana que Desfaz os Emaranhados da Nossa Vida",
    tipo: "atemporal",
    padroeiro_de: "Casamentos em crise, Lares em conflito, Vícios e Dificuldades insolúveis",
    festa_liturgica: {
      dia: null,
      mes: null,
      nome: "Devoção Contínua Atemporal (Celebrada frequentemente em 28 de Setembro ou em qualquer época de aflição)"
    },
    simbolo: "🎀",
    cor: "blue",
    imagem: "assets/img/santos/ns_nossa-senhora-desatadora-dos-nos.png",
    instrucoes: "Propagada com carinho pelo Papa Francisco a partir do célebre quadro pintado por Johann Schmidtner em 1700 em Augsburgo, esta novena pode ser feita em qualquer época do ano. Em cada dia, apresenta-se a Nossa Senhora um nó específico (da incompreensão, das mágoas, das dívidas, do desespero) para que Suas mãos maternais o desatem sob a ação do Espírito Santo.",
    oracao_inicial: "Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\nSanta Maria, cheia da presença de Deus, durante os dias de tua vida aceitaste com toda a humildade a vontade do Pai, e o maligno nunca foi capaz de envolver-te em suas confusões. Junto a teu Filho intercedeste por nossas dificuldades e, com toda a paciência, nos deste exemplo de como desenredar as linhas de nossa vida. Ao constituir-te para sempre nossa Mãe, pões em ordem os nossos laços.",
    oracao_padrao_dia: "Mãe amada, Santa Maria, que desatas os nós que sufocam teus filhos: estende tuas mãos misericordiosas para mim. Entrego-te hoje este nó de minha vida (mencione com sinceridade o problema específico: no casamento, na saúde, na vida financeira ou interior)... e todas as consequências nefastas que ele provoca. Entrego-te este nó que me atormenta, me impede de ser feliz e me afasta de Jesus. Recorro a ti, Maria, Desatadora dos Nós, porque confio em ti e sei que jamais desprezas o filho aflito que te pede socorro.",
    oracao_final: "Maria, Mãe do amor formoso, Desatadora dos Nós, rogai por nós. Desatai os nós da discórdia em nossas famílias, desatai as amarras do pecado e guiai-nos até Jesus. Pai Nosso, Ave Maria e Glória ao Pai. Amém.",
    dias: [
      {
        dia: 1,
        tema: "O Primeiro Nó: A Incredulidade e a Perda da Fé",
        intencao: "Pelo desatar das dúvidas espirituais e frieza religiosa.",
        reflexao: "Eva, por sua desobediência e desconfiança, atou o nó da desgraça para a humanidade. Maria, por sua fé obediente no Anúncio do Anjo, desatou esse nó para todo o sempre.",
        oracao: "Mãe Querida, acolhei em vossas mãos este primeiro nó. Afastai da minha mente o ceticismo, o cansaço interior e reacendei em mim a certeza consoladora de que Deus está no comando."
      },
      {
        dia: 2,
        tema: "O Segundo Nó: As Mágoas e o Ressentimento Guardado",
        intencao: "Pela graça do perdão sincero no seio da família.",
        reflexao: "Guardar mágoa é como alimentar um espinho venenoso no peito. As mãos ternas de Maria são remédio suave para desatar os nós do rancor que nos impedem de abraçar o irmão.",
        oracao: "Desatai, Virgem Clemente, o nó do ódio e da mágoa em meu coração. Concedei-me a força de perdoar a quem me ofendeu e de pedir perdão com sinceridade a quem magoei."
      },
      {
        dia: 3,
        tema: "O Terceiro Nó: A Desunião Conjugal e Familiar",
        intencao: "Pelos casais em vias de separação e pelos filhos desestruturados.",
        reflexao: "O quadro original de Augsburgo foi pintado em ação de graças pelo milagroso salvamento do matrimônio de Wolfgang Langenmantel, cujos laços conjugais foram desatados e reconciliados por Maria.",
        oracao: "Ó Mãe das Famílias, desatai os nós da incompreensão entre os esposos. Trazei de volta o diálogo, o respeito, a pureza conjugal e o carinho mútuo abençoado por Deus."
      },
      {
        dia: 4,
        tema: "O Quarto Nó: O Medo do Futuro e a Ansiedade",
        intencao: "Pela cura da depressão, do pânico e da ansiedade generalizada.",
        reflexao: "A ansiedade e o pavor das incertezas sufocam o sopro do Espírito Santo em nosso peito. Maria nos lembra: 'Não temas, porventura não estou eu aqui, que sou tua Mãe?'",
        oracao: "Maria Santíssima, desatai os nós da angústia e da depressão que tiram o meu sono. Coloco meu amanhã em vossas mãos virginais e descanso em vossa maternal proteção."
      },
      {
        dia: 5,
        tema: "O Quinto Nó: As Dívidas e o Caos Financeiro",
        intencao: "Pela providência material e sabedoria na administração do lar.",
        reflexao: "Muitos lares se encontram enredados em dívidas que tiram a paz e geram humilhações. Maria, que conheceu a pobreza de Belém e Nazaré, compadece-se de nossa carência.",
        oracao: "Desatai, Mãe Providente, o emaranhado das dificuldades financeiras que ameaçam a serenidade de minha casa. Abençoai nosso trabalho e concedei-nos o necessário para viver com dignidade."
      },
      {
        dia: 6,
        tema: "O Sexto Nó: Os Vícios e as Amarras do Pecado",
        intencao: "Pela libertação de álcool, drogas, pornografia e maus hábitos.",
        reflexao: "O pecado atrai a alma como um nó cego, que a criatura não consegue soltar com suas próprias forças humanas sem o auxílio divino da graça.",
        oracao: "Com a vossa autoridade de Rainha do Céu, pisai a cabeça da serpente infernal e desatai os vícios e tentações que acorrentam a mim ou aos meus entes queridos."
      },
      {
        dia: 7,
        tema: "O Sétimo Nó: A Doença Física e a Fragilidade do Corpo",
        intencao: "Pela cura e conforto dos enfermos que padecem dores graves.",
        reflexao: "Como Maria esteve ao pé da Cruz amparando o Corpo doloroso de Seu Filho, Ela permanece junto aos leitos dos doentes para suavizar cada sofrimento.",
        oracao: "Mãe da Saúde, tomai com amor o nó das dores e enfermidades que pesam sobre nós. Se for da vontade de Deus, alcançai-nos a cura; se for a cruz, concedei-nos paciência e méritos celestes."
      },
      {
        dia: 8,
        tema: "O Oitavo Nó: A Solidão e o Sentimento de Abandono",
        intencao: "Pelos idosos abandonados, pelas viúvas e pelos que se sentem esquecidos.",
        reflexao: "Nenhum ser humano está verdadeiramente sozinho no mundo enquanto tiver a Virgem Santíssima por Mãe e Advogada perpétua diante de Deus.",
        oracao: "Acolhei em vosso regaço materno, ó Mãe, a minha solidão. Fazei-me experimentar a vossa companhia acolhedora e enviai para o meu caminho corações fraternos que me amem em Cristo."
      },
      {
        dia: 9,
        tema: "O Nono Nó: A Fita Lisa nas Mãos da Mãe",
        intencao: "Pela fidelidade até a morte e louvor perpétuo na glória celeste.",
        reflexao: "No quadro milagroso, a fita que entrava cheia de nós e emaranhados nas mãos de Maria sai do outro lado completamente lisa, alva e luminosa. Assim faz a Mãe com a vida de quem nEla confia.",
        oracao: "Ó Virgem Desatadora dos Nós, admirável e bendita entre todas as mulheres! Ao concluir esta novena, vejo com lágrimas de esperança a fita de minha existência sendo renovada por tuas mãos. Obrigado por teres acolhido minha prece. Guarda-me para sempre sob teu manto até que eu chegue contigo à glória eterna de Jesus. Amém."
      }
    ]
  },
  {
    id: "divina-misericordia",
    titulo: "Novena da Divina Misericórdia",
    subtitulo: "Ditada por Jesus a Santa Faustina Kowalska",
    tipo: "movel",
    calculo_inicio: {
      base: "pascoa",
      offset_dias_inicio: -2,
      offset_dias_festa: 7
    },
    padroeiro_de: "Pecadores, Almas do Purgatório, Agonizantes e Toda a Humanidade",
    festa_liturgica: {
      dia: null,
      mes: null,
      nome: "Domingo da Divina Misericórdia (2º Domingo da Páscoa)"
    },
    simbolo: "✨",
    cor: "red",
    imagem: "assets/img/santos/ns_santa-faustina-kowalska.png",
    instrucoes: "Esta novena foi ditada pelo próprio Jesus a Santa Maria Faustina Kowalska, conforme registrado em seu Diário (parágrafos 1209-1229). Jesus pediu que começasse na Sexta-feira Santa e se concluísse no Sábado da Oitava da Páscoa, véspera da Festa da Misericórdia. Em cada dia, Jesus pede para trazer ao Seu Coração um grupo diferente de almas.",
    oracao_inicial: "Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\nExpirastes, Jesus, mas a fonte da vida brotou para as almas e o oceano da misericórdia abriu-se para o mundo inteiro. Ó Fonte de Vida, insondável Misericórdia Divina, envolvei o mundo todo e derramai-Vos sobre nós.\n\nÓ Sangue e Água que brotastes do Coração de Jesus como fonte de misericórdia para nós, eu confio em Vós!",
    oracao_padrao_dia: "Eterno Pai, eu Vos ofereço o Corpo e o Sangue, a Alma e a Divindade de Vosso diletíssimo Filho, Nosso Senhor Jesus Cristo, em expiação dos nossos pecados e dos do mundo inteiro. Pela Sua dolorosa Paixão, tende misericórdia de nós e do mundo inteiro.",
    oracao_final: "Deus Santo, Deus Forte, Deus Imortal, tende piedade de nós e do mundo inteiro. (3x)\n\nJesus, eu confio em Vós! Jesus, eu confio em Vós! Jesus, eu confio em Vós! Amém.",
    dias: [
      {
        dia: 1,
        tema: "Toda a Humanidade, especialmente os Pecadores",
        intencao: "Palavras de Jesus: 'Hoje, traze-Me a humanidade inteira, especialmente todos os pecadores, e mergulha-os no oceano da Minha misericórdia.'",
        reflexao: "Na Sexta-feira Santa, início desta santa novena, Cristo Se oferece no Calvário para que nenhum pecador, por mais desfigurado que esteja, perca a esperança do perdão divino.",
        oracao: "Misericordiosíssimo Jesus, cuja natureza é ter compaixão de nós e nos perdoar, não olheis para os nossos pecados, mas para a confiança que depositamos na Vossa infinita bondade. Acolhei-nos a todos na morada do Vosso compassivo Coração."
      },
      {
        dia: 2,
        tema: "As Almas dos Sacerdotes e Religiosos",
        intencao: "Palavras de Jesus: 'Hoje, traze-Me as almas dos sacerdotes e religiosos, e mergulha-as na Minha insondável misericórdia.'",
        reflexao: "Eles são os canais pelos quais a misericórdia de Deus se derrama sobre o mundo. Quando um sacerdote é santo, milhares de almas encontram o Céu.",
        oracao: "Jesus Misericordioso, de Quem provém tudo o que é bom, multiplicai a graça nos sacerdotes e consagrados, para que pratiquem dignas obras de misericórdia e todos glorifiquem o Pai Celeste."
      },
      {
        dia: 3,
        tema: "Todas as Almas Devotas e Fiéis",
        intencao: "Palavras de Jesus: 'Hoje, traze-Me todas as almas devotas e fiéis, e mergulha-as no oceano da Minha misericórdia.'",
        reflexao: "Estas almas consolaram Jesus no caminho do Calvário, como gotas de alívio no cálice de Sua amargura.",
        oracao: "Jesus compassivo, que a todos concedeis profusamente Vossas graças, acolhei todos os cristãos fiéis e não permitais que jamais se afastem do Vosso sagrado amor."
      },
      {
        dia: 4,
        tema: "Aqueles que não Crêem e os que não Conhecem a Jesus",
        intencao: "Palavras de Jesus: 'Hoje, traze-Me aqueles que não crêem em Mim e aqueles que ainda não Me conhecem.'",
        reflexao: "Na Sua agonia mortal, Jesus pensava amorosamente também nas almas que ainda não ouviram a Boa-Nova do Evangelho.",
        oracao: "Ó Luz do Mundo, acolhei no Vosso Coração as almas dos que ainda não crêem e dos pagãos. Que os raios da Vossa graça os iluminem para que, unidos a nós, celebrem Vossa misericórdia."
      },
      {
        dia: 5,
        tema: "As Almas dos que se Separaram da Igreja",
        intencao: "Palavras de Jesus: 'Hoje, traze-Me as almas dos que se separaram da Minha Igreja e mergulha-as no oceano da Minha misericórdia.'",
        reflexao: "A divisão entre os cristãos dilacera o Corpo Místico de Cristo. Jesus anseia por atrair todos à unidade de um só rebanho sob um só Pastor.",
        oracao: "Misericordioso Jesus, que sois a própria Bondade, não recuseis a luz àqueles que se afastaram da Vossa Igreja. Atraí-os com os Vossos raios à comunhão com a Vossa Esposa Imaculada."
      },
      {
        dia: 6,
        tema: "As Almas Mansas, Humildes e as Criancinhas",
        intencao: "Palavras de Jesus: 'Hoje, traze-Me as almas mansas e humildes, e as almas das criancinhas.'",
        reflexao: "Estas almas são as mais semelhantes ao Coração de Jesus. Elas exalam um suave perfume diante do trono de Deus e o próprio Deus Se deleita nelas.",
        oracao: "Jesus amantíssimo, que dissestes: 'Aprendei de Mim, que sou manso e humilde de coração', acolhei as criancinhas e todas as almas inocentes que perfumam Vosso altar."
      },
      {
        dia: 7,
        tema: "As Almas que Glorificam a Misericórdia Divina",
        intencao: "Palavras de Jesus: 'Hoje, traze-Me as almas que veneram e glorificam de maneira especial a Minha misericórdia.'",
        reflexao: "Estas almas sentem vivamente os sofrimentos de Cristo e vivem do Seu espírito de compaixão. Elas brilharão na glória futura com esplendor particular.",
        oracao: "Protegei, Senhor, as almas que propagam a Vossa infinita misericórdia. Na hora da morte delas, não sejais para elas Juiz, mas Salvador compassivo."
      },
      {
        dia: 8,
        tema: "As Almas Retidas no Purgatório",
        intencao: "Palavras de Jesus: 'Hoje, traze-Me as almas que estão no Purgatório e mergulha-as no abismo da Minha misericórdia.'",
        reflexao: "Estas almas amam a Deus, mas cumprem a purificação pelas faltas do passado. O Sangue de Jesus alivia suas penas e apaga suas chamas ardentes.",
        oracao: "Eterno Pai, olhai com misericórdia para as almas padecentes no Purgatório pelos méritos da Paixão de Jesus. Fazei que os rios de Sangue e Água extingam os ardores daquele fogo purificador."
      },
      {
        dia: 9,
        tema: "As Almas Tíbias e Indiferentes",
        intencao: "Palavras de Jesus: 'Hoje, traze-Me as almas tíbias e mergulha-as no abismo da Minha misericórdia.'",
        reflexao: "Estas almas foram as que causaram mais dor a Jesus no Horto das Oliveiras, arrancando-Lhe a queixa: 'Pai, afasta de Mim este cálice.'",
        oracao: "Fogo de Puro Amor, abrasai na Vossa compaixão estas almas frias e indiferentes. Despertai-as para a vida da graça, para que não se percam eternamente. Amém."
      }
    ]
  },
  {
    id: "pentecostes",
    titulo: "Novena Solene de Pentecostes",
    subtitulo: "A Primeira Novena da História da Igreja — Aos 7 Dons do Espírito Santo",
    tipo: "movel",
    calculo_inicio: {
      base: "pascoa",
      offset_dias_inicio: 40,
      offset_dias_festa: 49
    },
    padroeiro_de: "Igreja Universal, Crismanos, Renovação Espiritual e Vocações",
    festa_liturgica: {
      dia: null,
      mes: null,
      nome: "Solenidade de Pentecostes (50º dia após a Páscoa)"
    },
    simbolo: "🕊️",
    cor: "red",
    imagem: "assets/img/liturgia/cristo_bencao.jpg",
    instrucoes: "A Novena de Pentecostes é a novena original estabelecida por ordem do próprio Cristo Ressuscitado, que mandou os Apóstolos não se afastarem de Jerusalém, mas perseverarem juntos em oração com Maria, a Mãe de Jesus, durante os 9 dias que antecederam a descida do Divino Paráclito.",
    oracao_inicial: "Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\nVinde, Espírito Santo, enchei os corações dos Vossos fiéis e acendei neles o fogo do Vosso amor. Enviai o Vosso Espírito e tudo será criado, e renovareis a face da terra.\n\nOremos: Ó Deus, que haveis instruído os corações dos Vossos fiéis com a luz do Espírito Santo, concedei-nos, pelo mesmo Espírito, apreciar retamente todas as coisas e gozar sempre de Sua divina consolação. Por Cristo, Nosso Senhor. Amém.",
    oracao_padrao_dia: "Divino Espírito Santo, Terceira Pessoa da Santíssima Trindade, Amor subsistente do Pai e do Filho: derramai sobre mim os Vossos dons celestiais. Renovai a minha vida espiritual, purificai a minha mente e concedei-me a graça que ardentemente vos suplico nesta novena de Pentecostes (faça o seu pedido espiritual e temporal). Vinde, Pai dos pobres; vinde, Doador das graças; vinde, Luz dos corações!",
    oracao_final: "Veni Creator Spiritus (Vinde, Espírito Criador, visitai a alma dos Vossos servos e enchei de graça celestial os corações que criastes). Glória ao Pai, ao Filho e ao Espírito Santo, agora e por todos os séculos dos séculos. Amém.",
    dias: [
      {
        dia: 1,
        tema: "O Dom da Sabedoria",
        intencao: "Pelo gosto pelas coisas de Deus e desapego das futilidades mundanas.",
        reflexao: "A Sabedoria ilumina a mente para saborear as verdades eternas e julgar tudo à luz do Evangelho de Cristo.",
        oracao: "Vinde, Espírito de Sabedoria! Desprendei o meu coração das honras ilusórias da terra e fazei-me amar unicamente a Deus e as Suas promessas celestes."
      },
      {
        dia: 2,
        tema: "O Dom do Entendimento (Inteligência)",
        intencao: "Pela compreensão profunda dos Mistérios da Fé e das Sagradas Escrituras.",
        reflexao: "O Entendimento faz penetrar o sentido profundo da Palavra de Deus, desfazendo as trevas da ignorância espiritual.",
        oracao: "Vinde, Espírito de Entendimento! Iluminai minha inteligência para que eu compreenda a Santa Doutrina Católica e viva em perfeita obediência aos mandamentos de Deus."
      },
      {
        dia: 3,
        tema: "O Dom do Conselho",
        intencao: "Pelo discernimento nas decisões difíceis da vida e das famílias.",
        reflexao: "O Conselho orienta a alma nas encruzilhadas morais, indicando o caminho mais agradável à vontade divina.",
        oracao: "Vinde, Espírito de Conselho! Guiainos em todas as nossas dúvidas e indecisões. Não permitais que eu dê passos precipitados contrários à vontade do Senhor."
      },
      {
        dia: 4,
        tema: "O Dom da Fortaleza",
        intencao: "Pela vitória sobre as tentações e paciência heroica nas cruzes diárias.",
        reflexao: "A Fortaleza dá vigor à vontade humana para enfrentar o martírio, vencer o pecado e suportar com santa alegria as dores da vida.",
        oracao: "Vinde, Espírito de Fortaleza! Revesti a minha fraqueza com a Vossa força invencível, para que nenhuma tribulação ou tentação me separe do caminho da salvação."
      },
      {
        dia: 5,
        tema: "O Dom da Ciência",
        intencao: "Para ver a presença de Deus na criação e não idolatrar as criaturas.",
        reflexao: "A Ciência ensina a descobrir nas criaturas a grandeza do Criador, utilizando os bens temporais como pontes para a vida eterna.",
        oracao: "Vinde, Espírito de Ciência! Livrai-me da cegueira de amar as criaturas mais do que o Criador. Que em tudo o que vejo eu contemple a mão bondosa de Deus."
      },
      {
        dia: 6,
        tema: "O Dom da Piedade",
        intencao: "Pela doçura na oração e ternura filial no relacionamento com Deus Pai.",
        reflexao: "A Piedade cura o coração da dureza e da frieza religiosa, inspirando um amor terno a Deus como o mais amável dos Pais e a todos os homens como irmãos.",
        oracao: "Vinde, Espírito de Piedade! Despertai em minha alma um amor fervoroso pela Santa Missa, pelo Santo Rosário e uma sincera compaixão por quem sofre."
      },
      {
        dia: 7,
        tema: "O Dom do Santo Temor de Deus",
        intencao: "Pelo horror ao pecado e reverência sincera diante da Majestade do Senhor.",
        reflexao: "O Temor de Deus não é pavor de escravo, mas o receio reverente e amoroso de um filho que não quer entristecer o Pai que tanto o ama.",
        oracao: "Vinde, Espírito do Santo Temor! Gravai em minha alma uma aversão total a qualquer mancha de pecado venial ou mortal, mantendo-me fiel em estado de graça."
      },
      {
        dia: 8,
        tema: "Os 12 Frutos do Espírito Santo",
        intencao: "Por um testemunho cristão marcado por caridade, alegria e paz.",
        reflexao: "Quem vive no Espírito produz frutos duradouros: caridade, alegria, paz, paciência, benignidade, bondade, fidelidade, mansidão e continência.",
        oracao: "Fazei florescer em minha vida, Divino Paráclito, os Vossos frutos celestes, para que quem se aproximar de mim encontre a doçura e a paz do Senhor Jesus."
      },
      {
        dia: 9,
        tema: "O Cenáculo com Maria e o Fogo Renovador",
        intencao: "Pelo Pentecostes pessoal e renovação completa da Santa Igreja Católica.",
        reflexao: "Em Pentecostes, línguas de fogo pousaram sobre os Apóstolos reunidos com a Santíssima Virgem, transformando homens tímidos em colunas invencíveis da verdade.",
        oracao: "Ó Divino Espírito Santo, acolhei-me neste Cenáculo com a Virgem Maria! Batizai o meu coração com o Vosso fogo sagrado. Concedei-me a graça desta novena e fazei de mim uma testemunha corajosa do Evangelho por toda a minha vida. Amém."
      }
    ]
  },
  {
    id: "sao-bento",
    titulo: "Novena Tradicional de São Bento Abade",
    subtitulo: "Patriarca dos Monges do Ocidente e Defensor contra as Ciladas do Mal",
    tipo: "fixa",
    padroeiro_de: "Exorcistas, Envenenados, Estudantes, Engenheiros e Proteção de Lares",
    festa_liturgica: {
      dia: 11,
      mes: 7,
      nome: "Festa Litúrgica de São Bento, Abade, Padroeiro da Europa"
    },
    simbolo: "🛡️",
    cor: "amber",
    imagem: "assets/img/santos/ns_sao-bento-de-nursia.jpg",
    instrucoes: "São Bento de Núrsia (480-547), pai da civilização monástica ocidental e autor da célebre Regra 'Ora et Labora' (Reza e Trabalha), é patrono supremo da proteção espiritual contra as opressões demoníacas e feitiçarias, através da Santa Cruz.",
    oracao_inicial: "Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\nÓ glorioso São Bento, que sempre fostes modelo de vida evangélica e de vitória inabalável contra o demônio e o pecado: protegei-nos de todos os males da alma e do corpo, e ensinai-nos a buscar a Deus sobre todas as coisas terrenas.",
    oracao_padrao_dia: "Ó São Bento, patriarca dos monges e amigo de Deus, vós que quebrastes com o sinal da Santa Cruz a taça de veneno e fizestes voar o pão contaminado que vos queriam dar: livrai a mim, minha casa e minha família de toda influência maligna, cilada, inveja e malefício (apresente aqui a sua intenção e pedido de libertação). Que a Vossa Santa Cruz seja a minha luz e meu escudo perpétuo.",
    oracao_final: "Crux Sacra Sit Mihi Lux! Non Draco Sit Mihi Dux! Vade Retro Satana, Nunquam Suade Mihi Vana! Sunt Mala Quae Libas, Ipse Venena Bibas!\n(A Santa Cruz seja a minha luz! Não seja o dragão meu guia! Retira-te, Satanás! Nunca me aconselhes coisas vãs! É mau o que tu me ofereces, bebe tu mesmo o teu veneno!). São Bento, rogai por nós. Amém.",
    dias: [
      {
        dia: 1,
        tema: "O Silêncio e a Fuga das Ilusões de Roma",
        intencao: "Pela purificação dos pensamentos e libertação dos entretenimentos nocivos.",
        reflexao: "Jovem ainda, Bento abandonou os estudos na Roma corrupta para viver na solidão da caverna de Subiaco, procurando apenas a face de Deus.",
        oracao: "Ensinai-me, ó São Bento, a guardar momentos de recolhimento e oração, calando os barulhos do mundo para escutar a voz do Espírito Santo."
      },
      {
        dia: 2,
        tema: "A Vitória sobre a Tentação da Carne",
        intencao: "Pela virtude da castidade e modéstia nos lares.",
        reflexao: "Quando violentamente tentado contra a pureza, Bento atirou-se em um espinheiro ardente, trocando a ferida do pecado pelas chagas da mortificação.",
        oracao: "Livrai-me das paixões desordenadas da carne. Fortalecei a minha vontade nos momentos de tentação para que eu preserve a pureza de minha alma."
      },
      {
        dia: 3,
        tema: "O Sinal da Cruz que Quebra a Taça de Veneno",
        intencao: "Pela proteção contra invejas, ciúmes e traições no trabalho e na família.",
        reflexao: "Monges rebeldes quiseram matá-lo oferecendo uma taça envenenada. Bento traçou o sinal da cruz sobre o cálice e este estilhaçou-se imediatamente.",
        oracao: "Que o sinal da Santa Cruz despedace toda malícia, calúnia e plano oculto dos inimigos de minha salvação e de minha família."
      },
      {
        dia: 4,
        tema: "A Caridade no Monte Cassino",
        intencao: "Pela perseverança na oração e fidelidade no trabalho diário.",
        reflexao: "No Monte Cassino, Bento destruiu o templo pagão de Apolo e fundou o mosteiro que se tornou berço da fé, da oração e do trabalho civilizador da Europa.",
        oracao: "Ajudai-me a aplicar a máxima 'Ora et Labora'. Que meu trabalho seja santificado e que eu nunca descuide dos deveres da oração cotidiana."
      },
      {
        dia: 5,
        tema: "A Obediência Pronta e sem Murmuração",
        intencao: "Pela docilidade à Igreja e aos ensinamentos dos legítimos pastores.",
        reflexao: "Na Santa Regra, Bento ensina que a obediência prestada aos superiores é prestada ao próprio Deus, sem queixas e de coração generoso.",
        oracao: "Curai meu coração do orgulho e da soberba. Dai-me mansidão para acolher a verdade e para respeitar as autoridades justas com caridade cristã."
      },
      {
        dia: 6,
        tema: "A Hospitalidade: Acolher a Cristo no Peregrino",
        intencao: "Pelos pobres, refugiados e viajantes necessitados de abrigo.",
        reflexao: "'Todos os hóspedes que chegarem sejam acolhidos como o próprio Cristo.' Essa lei beneditina transformou o mundo bárbaro em terra de acolhida cristã.",
        oracao: "Abri meus olhos para reconhecer a presença de Jesus nos doentes e desamparados, praticando as obras de misericórdia corporal e espiritual."
      },
      {
        dia: 7,
        tema: "A Visão de Santa Escolástica e a Caridade Maior",
        intencao: "Pela harmonia entre irmãos e comunhão espiritual entre parentes.",
        reflexao: "Santa Escolástica, irmã de São Bento, orou a Deus e fez chover torrencialmente para passar a noite conversando com ele sobre as delícias do Céu: venceu porque amou mais.",
        oracao: "Derramai sobre nossas famílias o amor sincero e a concórdia. Que nossas conversas edifiquem e aproximem todos do Reino de Deus."
      },
      {
        dia: 8,
        tema: "A Glória Eterna do Mundo Visto em um Raio de Sol",
        intencao: "Pelo desapego do mundo e anseio da Pátria Celeste.",
        reflexao: "Em uma visão mística sublime, Deus fez passar diante dos olhos de Bento o mundo inteiro reunido num único raio de luz divina, mostrando quão pequenina é a terra comparada ao Céu.",
        oracao: "Fazei-me aspirar aos bens eternos, ó Patriarca São Bento. Que as aflições presentes não apaguem de meu horizonte a promessa da coroa incorruptível da glória."
      },
      {
        dia: 9,
        tema: "A Morte de Pé e a Entrada Triunfal no Paraíso",
        intencao: "Pela graça de uma boa morte e libertação definitiva de todo o mal.",
        reflexao: "São Bento morreu de pé na capela, sustentado pelos braços de seus monges, após comungar o Santo Viático, com as mãos erguidas aos céus em oração ininterrupta.",
        oracao: "Glorioso São Bento, alcançai-me a graça que vos suplico nesta novena e sede meu protetor na hora da morte. Que a vossa santa medalha e a Cruz de Cristo me defendam dos ardis do demônio até o meu último suspiro. Amém."
      }
    ]
  },
  {
    id: "santo-antonio",
    titulo: "Trezena e Novena Tradicional de Santo Antônio de Pádua",
    subtitulo: "Doutor Evangélico, Amigo do Menino Jesus e Pai dos Pobres",
    tipo: "fixa",
    padroeiro_de: "Famílias, Casamentos, Encontrar Coisas Perdidas, Pobres e Padeiros",
    festa_liturgica: {
      dia: 13,
      mes: 6,
      nome: "Festa Litúrgica de Santo Antônio de Pádua, Doutor da Igreja"
    },
    simbolo: "🍞",
    cor: "amber",
    imagem: "assets/img/santos/ns_santo-antonio-de-padua.jpg",
    instrucoes: "Santo Antônio de Lisboa e Pádua (1195-1231), frade menor franciscano, é um dos santos mais populares e amados da Cristandade. Rezada frequentemente sob a forma de Novena (9 dias) ou Trezena (13 dias), a oração invoca seu poder de intercessão junto ao Menino Jesus.",
    oracao_inicial: "Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\nÓ admirável Santo Antônio, luzeiro brilhante da Santa Igreja e glória da Ordem Franciscana: com o Menino Jesus em vossos braços e o lírio da pureza em vossas mãos, olhai com carinho para as necessidades do meu coração.",
    oracao_padrao_dia: "Ó Santo Antônio, que recebestes de Deus o dom extraordinário de restituir as coisas perdidas e socorrer os necessitados: recuperai para a minha vida a graça santificante, a paz e a concórdia familiar. Apresentai com bondade a Jesus Menino a súplica que hoje vos confio (faça o seu pedido pessoal ou familiar). Se milagres desejais, recorrei a Santo Antônio e vereis o poder de Deus manifestado na vossa vida!",
    oracao_final: "Responsório de Santo Antônio: 'Se milagres desejais, recorrei a Santo Antônio; vereis fugir o demônio e as tentações infernais. Recupera-se o perdido, rompe-se a dura prisão e no auge do furacão cede o mar embravecido.' Rogai por nós, bem-aventurado Santo Antônio, para que sejamos dignos das promessas de Cristo. Amém.",
    dias: [
      {
        dia: 1,
        tema: "A Pureza de Vida e o Amor à Palavra",
        intencao: "Pela pureza de coração dos jovens e perseverança no Evangelho.",
        reflexao: "Nascido em Lisboa sob o nome de Fernando, consagrou sua juventude a Deus entre os cônegos regulares, devorando as Sagradas Escrituras dia e noite.",
        oracao: "Ó Santo Antônio, purificai minha mente de pensamentos mundanos e acendei em mim o gosto assíduo pela leitura dos Santos Evangelhos."
      },
      {
        dia: 2,
        tema: "O Zelo Apostólico e o Ideal Franciscano",
        intencao: "Por todas as vocações sacerdotais e missionárias.",
        reflexao: "Comovido pelo martírio dos primeiros frades franciscanos no Marrocos, Antônio vestiu o hábito da pobreza para derramar o sangue por Cristo onde fosse enviado.",
        oracao: "Despertai na juventude o ardor de servir a Deus na vida religiosa. Dai-nos coragem para não vivermos comodamente enquanto tantas almas perecem longe da graça."
      },
      {
        dia: 3,
        tema: "A Humildade nas Tarefas Esquecidas",
        intencao: "Pela cura do orgulho e da vaidade de querer aparecer.",
        reflexao: "Antônio passou meses em silêncio no eremitério de Montepaolo, lavando pratos e varrendo o chão, até que uma ordem de obediência revelou sua genialidade oratória.",
        oracao: "Livrai-me, querido Santo Antônio, da ambição desmedida. Ensinai-me a amar o trabalho humilde e a servir sem buscar aplausos humanos."
      },
      {
        dia: 4,
        tema: "O Menino Jesus nos Braços do Santo",
        intencao: "Pela ternura nas famílias e acolhimento das criancinhas.",
        reflexao: "O conde Tiso espiou pelo buraco da porta e viu Santo Antônio em êxtase, segurando nos braços o Menino Jesus, que acariciava Seu rosto e falava-lhe de amor divino.",
        oracao: "Ó afortunado Santo Antônio, que acolhestes o Filho de Deus vivo em vossos braços: trazei Jesus para o centro de minha casa e do meu lar."
      },
      {
        dia: 5,
        tema: "O Pregador e o Milagre dos Peixes",
        intencao: "Pela conversão dos hereges e pela vitória sobre o ateísmo.",
        reflexao: "Quando os hereges de Rímini se recusaram a escutar a pregação, Antônio foi à praia e pregou aos peixes, que colocaram as cabeças fora da água para ouvir a Palavra de Deus.",
        oracao: "Que a Palavra de Deus toque os corações dos mais rebeldes e endurecidos de nossa sociedade, fazendo-os regressar ao aprisco da Mãe Igreja."
      },
      {
        dia: 6,
        tema: "A Restituição das Coisas Perdidas",
        intencao: "Pela recuperação da paz, da fé perdida e das coisas materiais extraviadas.",
        reflexao: "O noviço que fugira levando o saltério de orações de Antônio foi obrigado por um prodígio a devolvê-lo, nascendo ali a tradição de pedir o resgate do que se perdeu.",
        oracao: "Santo Antônio, ajudai-me a encontrar não apenas os objetos materiais que perdi, mas sobretudo a paz de consciência e a comunhão sincera com Deus."
      },
      {
        dia: 7,
        tema: "O Martelo dos Tiranos e o Pão dos Pobres",
        intencao: "Pela justiça aos oprimidos e esmola abençoada em favor dos desvalidos.",
        reflexao: "Antônio enfrentou tiranos sanguinários como Ezzelino para defender o povo oprimido, criando a santa tradição do 'Pão de Santo Antônio' que até hoje alimenta os famintos.",
        oracao: "Multiplai, Santo Antônio, o pão em nossas mesas e abri nossos bolsos para ajudar as famílias empobrecidas e sem sustento."
      },
      {
        dia: 8,
        tema: "O Patrono dos Noivos e da União Familiar",
        intencao: "Pelos noivos que se preparam para o matrimônio e pelos lares em paz.",
        reflexao: "Com compaixão admirável, Antônio socorria as jovens pobres que não tinham dote para se casar dignamente, livrando-as de perigos morais e abençoando suas núpcias.",
        oracao: "Abençoai os relacionamentos, livrai os jovens das ilusões efêmeras e concedei aos lares cristãos fidelidade, paciência e amor verdadeiro."
      },
      {
        dia: 9,
        tema: "A Morte Santa: 'Vejo o Meu Senhor!'",
        intencao: "Pela graça da boa morte e concessão do favor suplicado nesta novena.",
        reflexao: "Aos 36 anos, ao expirar no convento de Arcella perto de Pádua, perguntaram-lhe o que via e ele respondeu em júbilo: 'Vejo o meu Senhor!'",
        oracao: "Ó Santo Antônio de Pádua, rogai por nós a Jesus, atendei a súplica fervorosa desta novena e guiai-nos até a posse da bem-aventurança eterna no Céu. Amém."
      }
    ]
  },
  {
    id: "sao-jose",
    titulo: "Novena Tradicional de São José",
    subtitulo: "Patrono Universal da Igreja, Terror dos Demônios e Protetor das Famílias",
    tipo: "fixa",
    padroeiro_de: "Famílias, Pais, Trabalhadores, Moribundos, Igreja Católica e Habitação",
    festa_liturgica: {
      dia: 19,
      mes: 3,
      nome: "Solenidade de São José, Esposo da Bem-Aventurada Virgem Maria"
    },
    simbolo: "🪵",
    cor: "amber",
    imagem: "assets/img/santos/ns_sao-jose.jpg",
    instrucoes: "São José, o justo carpinteiro da linhagem de Davi, foi escolhido pelo Pai Eterno como guarda fiel dos Seus maiores tesouros na terra: Jesus e Maria. Santa Teresa de Ávila afirmava que nunca pediu uma graça a São José sem ser prontamente atendida.",
    oracao_inicial: "Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\nA vós, São José, recorremos em nossa tribulação e, depois de ter implorado o auxílio de vossa santíssima Esposa, cheios de confiança solicitamos também o vosso patrocínio. Por aquele laço sagrado de caridade que vos uniu à Virgem Imaculada Mãe de Deus e pelo amor paternal que tivestes ao Menino Jesus, vos suplicamos que lanceis um olhar benigno para a herança que Jesus Cristo adquiriu com Seu sangue.",
    oracao_padrao_dia: "Ó São José, guarda da Sagrada Família, socorrei-me em minhas necessidades temporais e espirituais (apresente aqui o seu pedido de moradia, sustento, família ou graça espiritual). Vós a quem o próprio Filho de Deus chamou de pai na terra e obedeceu com amor filial: apresentai a Ele a minha súplica e alcançai-me a virtude do vosso silêncio, da vossa obediência e da vossa pureza.",
    oracao_final: "Lembrai-vos, ó puríssimo Esposo da Virgem Maria, São José, meu doce protetor, que nunca se ouviu dizer que alguém tivesse invocado a vossa proteção e implorado o vosso socorro sem ser consolado. Cheio de confiança, me apresento a vós. Não desprezeis as minhas preces, ó pai nutrício do Redentor, mas atendei-as propício. Amém.",
    dias: [
      {
        dia: 1,
        tema: "O Homem Justo Escolhido por Deus",
        intencao: "Pela integridade moral e honra dos chefes de família.",
        reflexao: "A Sagrada Escritura resume todas as virtudes de José em uma só palavra inspirada: ele era 'justo'. Homem reto, temente a Deus e de consciência imaculada.",
        oracao: "São José, alcançai para os pais de família a sabedoria divina e o senso de dever cristão para conduzirem seus lares na justiça e no amor."
      },
      {
        dia: 2,
        tema: "O Esposo Virginal de Maria Santíssima",
        intencao: "Pela santidade e fidelidade nos casamentos cristãos.",
        reflexao: "Unido à Mãe de Deus por um matrimônio sagrado e perpétuo, José foi o guardião leal de sua virgindade e o consolador prudente de seu Imaculado Coração.",
        oracao: "Protegei os noivos e esposos contra as ciladas do adultério, do desamor e da incompreensão mútua. Guardai os lares na paz de Deus."
      },
      {
        dia: 3,
        tema: "A Noite Santa de Belém e o Acolhimento do Salvador",
        intencao: "Pelos casais sem teto e famílias que buscam a bênção da casa própria.",
        reflexao: "Rejeitado nas hospedarias de Belém, José preparou com desvelo o presépio pobre para aquecer o Rei do Universo recém-nascido.",
        oracao: "Ó São José, providenciai um teto digno e tranquilo para as famílias que sofrem com aluguéis extorsivos e falta de moradia segura."
      },
      {
        dia: 4,
        tema: "A Fuga para o Egito diante da Tirania",
        intencao: "Pelos refugiados, migrantes e famílias que fogem da violência.",
        reflexao: "Avisado pelo anjo em sonhos, José levantou-se no meio da noite e levou o Menino e Sua Mãe para o desterro do Egito, livrando Jesus da espada de Herodes.",
        oracao: "Defendei nossas crianças contra as investidas sanguinárias e imorais do mundo moderno. Sede nosso refúgio nas horas de perseguição."
      },
      {
        dia: 5,
        tema: "O Santo Trabalhador da Oficina de Nazaré",
        intencao: "Por trabalho digno e salário justo para todos os operários.",
        reflexao: "No silêncio da carpintaria de Nazaré, o Criador do Universo aprendeu com José a manejar a serra, a madeira e o martelo, dignificando o suor humano.",
        oracao: "Abençoai os trabalhadores, São José Operário. Livrai os lares do desemprego e concedei que nosso labor diário seja oferecido para a glória de Deus."
      },
      {
        dia: 6,
        tema: "A Perda e o Reencontro no Templo",
        intencao: "Pelo resgate dos jovens que se afastaram da Igreja e dos Sacramentos.",
        reflexao: "Com dor profunda, José e Maria procuraram Jesus por três dias até encontrá-Lo no Templo entre os doutores, ensinando com autoridade celestial.",
        oracao: "Ajudai os pais que choram pelos filhos perdidos nos descaminhos do pecado. Fazei que esses jovens reencontrem o caminho da casa do Pai."
      },
      {
        dia: 7,
        tema: "A Autoridade que o Filho de Deus Obedeceu",
        intencao: "Pela virtude da obediência filial e respeito dos filhos para com os pais.",
        reflexao: "O Evangelho declara solenemente sobre o Filho de Deus: 'E era-lhes submisso.' Jesus obedeceu com reverência às ordens do carpinteiro José.",
        oracao: "Dai aos filhos o espírito de reverência, gratidão e respeito aos pais, fortalecendo a hierarquia sagrada e o afeto dentro do lar cristão."
      },
      {
        dia: 8,
        tema: "O Terror dos Demônios",
        intencao: "Pela libertação espiritual contra opressões e ataques do maligno.",
        reflexao: "A ladainha oficial de São José proclama seu título terrível para o inferno: 'Terror dos demônios'. A pureza e a obediência de José esmagam as forças do mal.",
        oracao: "Afastai de minha casa e de minha família toda perturbação diabólica, feitiçaria, pesadelos e vícios. Guardai nossa mente na serenidade da graça."
      },
      {
        dia: 9,
        tema: "A Morte Santa nos Braços de Jesus e Maria",
        intencao: "Pela graça da boa morte para nós e pelos moribundos deste dia.",
        reflexao: "Nenhum homem na terra teve morte tão feliz e santa: São José expirou docemente adormecendo nos braços amorosos de Jesus e de Maria Santíssima.",
        oracao: "Ó glorioso São José, patrono dos moribundos e da boa morte: atendei a graça que com fé vos suplico nesta novena. Quando chegar a minha hora derradeira, vinde com Jesus e Maria receber a minha alma para a vida eterna. Amém."
      }
    ]
  },
  {
    id: "sao-miguel-arcanjo",
    titulo: "Novena e Coroa Angélica de São Miguel Arcanjo",
    subtitulo: "Príncipe da Milícia Celeste e Defensor do Povo de Deus",
    tipo: "fixa",
    padroeiro_de: "Policiais, Militares, Radiologistas, Pessoas em Combate Espiritual e Moribundos",
    festa_liturgica: {
      dia: 29,
      mes: 9,
      nome: "Festa Litúrgica dos Santos Arcanjos Miguel, Gabriel e Rafael"
    },
    simbolo: "⚔️",
    cor: "red",
    imagem: "assets/img/santos/ns_sao-miguel-arcanjo.png",
    instrucoes: "A Novena a São Miguel Arcanjo é tradicionalmente rezada de 20 a 28 de setembro (precedendo a festa dos Santos Arcanjos em 29 de setembro) ou durante a Quaresma de São Miguel (iniciada em 15 de agosto). Cada dia invoca a intercessão do Arcanjo junto a um dos Nove Coros Celestes.",
    oracao_inicial: "Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\nÓ Deus, vinde em meu auxílio. Senhor, apressai-Vos em me socorrer. Glória ao Pai, ao Filho e ao Espírito Santo, como era no princípio, agora e sempre. Amém.\n\nSão Miguel Arcanjo, defendei-nos no combate, sede o nosso refúgio contra as maldades e as ciladas do demônio. Ordene-lhe Deus, instantemente o pedimos, e vós, príncipe da milícia celeste, pela virtude divina, precipitai no inferno a Satanás e a todos os espíritos malignos que andam pelo mundo para perder as almas. Amém.",
    oracao_padrao_dia: "Gloriosíssimo Príncipe da Milícia Celeste, São Miguel Arcanjo, terror dos demônios e protetor do povo de Deus: olhai com benevolência para as minhas angústias e provações (apresente aqui o seu combate espiritual ou necessidade pessoal). Pelo vosso brado vitorioso 'Quem como Deus?!', protegei a minha alma e dai-me a vitória sobre as forças do mal.",
    oracao_final: "Pela intercessão de São Miguel e do Coro Celeste, conceda-nos o Senhor a graça do arrependimento perfeito e a coroa da glória imortal. Pai Nosso, 3 Ave Marias e Glória ao Pai. Amém.",
    dias: [
      {
        dia: 1,
        tema: "A Intercessão com o Coro dos Serafins",
        intencao: "Pelo fogo ardente da caridade divina e amor puro a Deus.",
        reflexao: "Os Serafins ardem no mais íntimo amor a Deus diante do trono celestial. São Miguel convida a nossa alma a deixar a tibieza e arder em santidade.",
        oracao: "Pela intercessão de São Miguel e do Coro Celeste dos Serafins, o Senhor nos torne dignos de arder na chama da perfeita caridade. Amém."
      },
      {
        dia: 2,
        tema: "A Intercessão com o Coro dos Querubins",
        intencao: "Pela libertação do pecado e pelo conhecimento profundo da verdade divina.",
        reflexao: "Os Querubins contemplam com inteligência cristalina a sabedoria inefável do Criador, repelindo toda ilusão enganosa das trevas.",
        oracao: "Pela intercessão de São Miguel e do Coro dos Querubins, o Senhor nos conceda a graça de abandonar o pecado e correr na via da perfeição cristã. Amém."
      },
      {
        dia: 3,
        tema: "A Intercessão com o Coro dos Tronos",
        intencao: "Pela paz de consciência e virtude da verdadeira humildade cristã.",
        reflexao: "Os Tronos manifestam a majestade da paz de Deus, onde a alma se torna morada serena para a habitação do Rei dos reis.",
        oracao: "Pela intercessão de São Miguel e do Coro dos Tronos, o Senhor derrame em nossos corações o espírito da verdadeira e sincera humildade. Amém."
      },
      {
        dia: 4,
        tema: "A Intercessão com o Coro das Dominações",
        intencao: "Pelo domínio dos sentidos e vitória sobre as más inclinações.",
        reflexao: "As Dominações ensinam o governo de si mesmo, ensinando o homem a subordinar a carne ao espírito e o espírito a Deus.",
        oracao: "Pela intercessão de São Miguel e do Coro das Dominações, o Senhor nos conceda a graça de dominar nossos sentidos e corrigir as más paixões. Amém."
      },
      {
        dia: 5,
        tema: "A Intercessão com o Coro das Potestades",
        intencao: "Pela proteção contra os assaltos do demônio na mente e no corpo.",
        reflexao: "As Potestades freiam o poder dos demônios e impedem que eles tentem os servos de Deus acima de suas forças espirituais.",
        oracao: "Pela intercessão de São Miguel e do Coro das Potestades, o Senhor guarde as nossas almas das armadilhas e das tentações do maligno. Amém."
      },
      {
        dia: 6,
        tema: "A Intercessão com o Coro das Virtudes",
        intencao: "Pela fortaleza nas enfermidades e graça de suportar as tribulações.",
        reflexao: "As Virtudes operam maravilhas e milagres na criação, concedendo força heróica nas horas de maior fraqueza humana.",
        oracao: "Pela intercessão de São Miguel e do Coro das admiráveis Virtudes, o Senhor não nos deixe cair na tentação, mas nos livre de todo o mal. Amém."
      },
      {
        dia: 7,
        tema: "A Intercessão com o Coro dos Principados",
        intencao: "Pela fidelidade dos governantes civis e pastores eclesiais ao bem comum.",
        reflexao: "Os Principados velam sobre as nações, cidades e povos, orientando o destino da história para o cumprimento do plano redentor.",
        oracao: "Pela intercessão de São Miguel e do Coro dos Principados, o Senhor encha as nossas almas do espírito da verdadeira obediência à Santa Igreja. Amém."
      },
      {
        dia: 8,
        tema: "A Intercessão com o Coro dos Arcanjos",
        intencao: "Pela perseverança final na fé católica até o último alento de vida.",
        reflexao: "Os Arcanjos são os grandes mensageiros de Deus, capitaneados por Miguel, Gabriel e Rafael, que guiam os combatentes da fé.",
        oracao: "Pela intercessão de São Miguel e do Coro dos Arcanjos, o Senhor nos conceda o dom da perseverança final na fé e nas boas obras. Amém."
      },
      {
        dia: 9,
        tema: "A Intercessão com o Coro dos Anjos da Guarda",
        intencao: "Pela proteção contínua em nossas viagens, lares e na passagem para a eternidade.",
        reflexao: "Os Santos Anjos da Guarda caminham ao nosso lado desde o nascimento até a morte, iluminando, guardando, governando e protegendo nossa alma.",
        oracao: "Pela intercessão de São Miguel e do Coro Celeste de todos os Anjos, o Senhor nos conceda a proteção de Seus santos mensageiros nesta vida e a entrada no Céu. Amém."
      }
    ]
  },
  {
    id: "novena-de-natal",
    titulo: "Tradicional Novena de Natal",
    subtitulo: "Os 9 Dias da Espera e Nascimento do Menino Deus",
    tipo: "fixa",
    padroeiro_de: "Famílias, Crianças, Gestantes, Paz no Mundo e Lares Cristãos",
    festa_liturgica: {
      dia: 25,
      mes: 12,
      nome: "Solenidade do Natal de Nosso Senhor Jesus Cristo"
    },
    simbolo: "⭐",
    cor: "amber",
    imagem: "assets/img/liturgia/adoracao_pastores.jpg",
    instrucoes: "A Novena de Natal é celebrada anualmente de 16 a 24 de dezembro em preparação imediata para a Noite Santa da Vigília e Solenidade do Natal de Nosso Senhor Jesus Cristo, inspirada nas solenes Antífonas do Ó e nas meditações de Santo Afonso de Ligório.",
    oracao_inicial: "Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\nÓ Verbo Eterno de Deus, que por amor a nós pecadores Vos fizestes Menino frágil nas palhas da manjedoura de Belém: nós Vos adoramos com os anjos e pastores e Vos oferecemos o nosso coração como abrigo humilde para o Vosso nascimento sagrado.",
    oracao_padrao_dia: "Ó Doce Menino Jesus, Emanuel, Deus Conosco: vinde nascer em nosso lar, afugentai as trevas da desunião e do pecado e trazei a nós a luz da Vossa graça celestial (faça o pedido de paz, conversão e união familiar). Glória a Deus nas alturas e paz na terra aos homens por Ele amados!",
    oracao_final: "Menino Jesus, manso e humilde de coração, fazei o nosso coração semelhante ao Vosso. Abençoai as nossas crianças, protegei as nossas famílias e dai a paz ao mundo inteiro. Pai Nosso, Ave Maria e Glória ao Pai. Amém.",
    dias: [
      {
        dia: 1,
        tema: "A Promessa Antiga e a Espera dos Patriarcas",
        intencao: "Pelo despertar da esperança nos corações cansados e desiludidos.",
        reflexao: "Por séculos, os profetas e os justos da Antiga Aliança suspiraram: 'Céus, orvalhai do alto, e as nuvens façam chover o Justo!' Agora a promessa está prestes a se cumprir.",
        oracao: "Ó Divino Redentor, vinde libertar o Vosso povo. Curai o mundo da apatia espiritual e fazei-nos esperar com ardor a Vossa santa vinda."
      },
      {
        dia: 2,
        tema: "A Viagem de Nazaré a Belém",
        intencao: "Por paciência nas viagens, cansaços e contratempos da vida diária.",
        reflexao: "José e Maria, grávida do Salvador, enfrentaram dias penosos de marcha pelas montanhas da Judeia sob o frio do inverno, sem nunca murmurar.",
        oracao: "Concedei-nos, Senhor, serenidade para enfrentar as estradas difíceis e as exigências da vida com o mesmo amor obediente da Sagrada Família."
      },
      {
        dia: 3,
        tema: "As Portas Fechadas e a Falta de Acolhimento",
        intencao: "Pela conversão das cidades egoístas e acolhimento dos necessitados.",
        reflexao: "'Veio para o que era Seu, e os Seus não O receberam.' Todas as hospedarias de Belém bateram as portas na face de São José e da Santíssima Virgem.",
        oracao: "Perdoai-nos, Senhor, pelas vezes em que fechamos as portas do nosso coração à Vossa graça ou ao irmão necessitado. Entrai em nossa casa, pois Ela é Vossa."
      },
      {
        dia: 4,
        tema: "A Gruta Pobre e a Manjedoura dos Animais",
        intencao: "Pela virtude do desapego e valorização da simplicidade cristã.",
        reflexao: "Aquele a quem o Céu e a Terra não podem conter escolheu nascer num estábulo e repousar sobre feno e palhas, para nos ensinar o desapego do luxo mundano.",
        oracao: "Jesus pequenino, curai nossa vaidade. Fazei que compreendamos que a verdadeira nobreza está na humildade e no amor a Deus."
      },
      {
        dia: 5,
        tema: "A Noite Santa e o Canto dos Anjos",
        intencao: "Pela paz entre os povos e fim das guerras sangrentas no mundo.",
        reflexao: "Ao bater da meia-noite, a glória de Deus iluminou a escuridão e os anjos entoaram: 'Glória a Deus no mais alto dos céus e na terra paz aos homens amados por Ele!'",
        oracao: "Príncipe da Paz, calai os canhões e as armas de discórdia. Derramai o bálsamo da reconciliação nas nações conflagradas e nas famílias em guerra."
      },
      {
        dia: 6,
        tema: "A Anunciação aos Pastores Pobres",
        intencao: "Pelos trabalhadores do campo, operários simples e seus filhos.",
        reflexao: "Deus não enviou Seus anjos aos palácios de Roma ou aos reis arrogantes, mas aos humildes pastores que vigiavam os rebanhos no silêncio da noite.",
        oracao: "Abençoai os simples e os esquecidos da sociedade. Fazei-nos ter a prontidão dos pastores para correr ao Vosso encontro e Vos adorar."
      },
      {
        dia: 7,
        tema: "As Fraldas e Lágrimas do Menino Deus",
        intencao: "Por todas as criancinhas no ventre e bebês recém-nascidos.",
        reflexao: "O Rei dos anjos chora de frio nas palhas, e Suas primeiras lágrimas são já oferecidas pela remissão dos nossos pecados.",
        oracao: "Ó Jesus Menino, enxugai as lágrimas dos que choram e defendei com amor todas as crianças que sofrem abandono ou violência."
      },
      {
        dia: 8,
        tema: "O Olhar Doce de Maria e os Cuidados de José",
        intencao: "Pela consagração de todos os lares ao exemplo da Sagrada Família.",
        reflexao: "Com que adoração inefável a Virgem Maria contemplava o Rosto Divino de Seu Filho e com que ternura São José O cobria e protegia!",
        oracao: "Jesus, Maria e José, sagrada e admirável família: fazei das nossas casas um reflexo bendito de vosso amor, paz e fidelidade mútua."
      },
      {
        dia: 9,
        tema: "A Vigília Sagrada: O Verbo se Fez Carne e Habitou entre Nós!",
        intencao: "Pela santa celebração da Noite de Natal em família e graça do renascimento espiritual.",
        reflexao: "Chegou o grande dia da salvação! O Salvador nasceu para nós! A Luz resplandece nas trevas e as trevas não puderam sufocá-la.",
        oracao: "Vinde, ó Divino Menino Jesus, e não tardeis mais! Nascei em nossos corações, renovai a nossa fé, abençoai nossa ceia e nossa família, e dai-nos um dia a graça de Vos contemplar na festa eterna do Vosso Reino Celestial. Amém."
      }
    ]
  }
];

fs.writeFileSync(targetFile, JSON.stringify(novenas, null, 2), 'utf-8');
console.log(`✅ Sucesso: ${novenas.length} novenas canônicas gravadas em ${targetFile}!`);
