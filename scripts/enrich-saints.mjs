import fs from 'fs';
import path from 'path';

const saintsData = {
  "2026-10-01": {
    name: "Santa Teresa do Menino Jesus e da Sagrada Face (Santa Terezinha)",
    vocation: "Virgem carmelita descalça, Doutora da Igreja e Padroeira Universal das Missões",
    biography: `Maria Francisca Teresa Martin nasceu em Alençon, França, em 2 de janeiro de 1873, no seio de uma família profundamente cristã — filha dos santos Luís e Zélia Martin. Desde a mais tenra infância sentiu o chamado irresistível para consagrar-se inteiramente a Deus no Carmelo de Lisieux, onde já se encontravam duas de suas irmãs mais velhas.

Com apenas 15 anos de idade, demonstrando uma audácia e maturidade espiritual extraordinárias, viajou a Roma e, em audiência com o Papa Leão XIII, ajoelhou-se aos seus pés pedindo autorização especial para ingressar no claustro antes da idade canônica. Autorizada por seu bispo, entrou no Carmelo em abril de 1888, adotando o nome de Irmã Teresa do Menino Jesus e da Sagrada Face.

No recolhimento do mosteiro, sem jamais cruzar suas portas ou realizar grandes viagens, Teresinha descobriu a sua genial "Pequena Via" (a infância espiritual): o caminho da santidade ao alcance de todas as almas, baseado na humildade, no abandono filial nos braços de Deus Pai e na realização com amor divino das mais ínfimas tarefas cotidianas. Ao meditar o capítulo 13 da Primeira Carta aos Coríntios, exclamou em êxtase: "No coração da Igreja, minha Mãe, eu serei o amor!".

Acometida pela tuberculose aos 23 anos, suportou com serenidade e fé heroica o sofrimento atroz da doença e uma profunda "noite escura da fé", na qual se assentou à mesa dos pecadores e dos sem-fé para oferecer seu sofrimento por eles. Expirou santamente em 30 de setembro de 1897, aos 24 anos de idade, sussurrando suas últimas palavras: "Meu Deus, eu Vos amo!". Antes de partir, fez a celestial promessa: "Passarei o meu Céu fazendo o bem na terra. Do Céu, farei cair uma chuva de rosas!". Proclamada Doutora da Igreja pelo Papa São João Paulo II em 1997, seus manuscritos autobiográficos reunidos em "História de uma Alma" iluminam e convertem corações em todo o planeta.`,
    reflection: `Santa Terezinha nos ensina que a perfeição evangélica não consiste em realizar obras extraordinárias aos olhos humanos, mas em colocar um amor infinito em cada pequeno ato do dia a dia: sorrir perante uma contrariedade, aceitar o silêncio nos momentos de provação e confiar cegamente que Deus é um Pai de ternura infinita.`,
    prayer: `Santíssima Trindade: Pai, Filho e Espírito Santo, nós Vos agradecemos por todos os dons e graças com que cumulastes a vida terrena de Santa Terezinha do Menino Jesus. Pelos méritos de seu abandono amoroso e de sua Pequena Via, concedei-nos a graça de amar a Jesus com a pureza e a fidelidade de uma criança nos braços do Pai. Fazei cair sobre a nossa vida, sobre as nossas famílias e sobre as missões da Igreja a vossa chuva de rosas espirituais e temporais. Santa Terezinha do Menino Jesus, rogai por nós!`,
    patronage: "Missões Universais, Missionários, Vocações Sacerdotais, Floristas, Doentes de Tuberculose e França"
  },
  "2026-10-02": {
    name: "Santos Anjos da Guarda",
    vocation: "Mensageiros celestes, protetores perpétuos e ministros da Providência Divina",
    biography: `A memória obrigatória dos Santos Anjos da Guarda remonta à mais sólida tradição bíblica e apostólica da Santa Igreja. Desde a criação do mundo invisível por Deus, os santos anjos foram designados para contemplar face a face a glória do Todo-Poderoso (Mt 18,10) e desempenhar a sublime missão de ministros da Providência junto à humanidade.

A doutrina católica, reiterada com clareza pelo Catecismo da Igreja Católica (§ 336), ensina que: "Desde o início até à morte, a vida humana é cercada pela sua proteção e pela sua intercessão. Cada fiel é ladeado por um anjo como protetor e pastor para o conduzir à vida".

Na Sagrada Escritura, o Salmo 90 (91) canta com certeza consoladora: "Pois Ele dará ordem a Seus anjos a teu respeito, para que te guardem em todos os teus caminhos. Eles te levarão em suas mãos, para que teu pé não tropece em nenhuma pedra". Jesus Cristo adverte os discípulos a respeito do valor infinito de cada alma aos olhos de Deus: "Guardai-vos de desprezar um só destes pequeninos; porque eu vos digo que os seus anjos nos céus vêem continuamente a face de meu Pai celestial".

Ao longo dos séculos, grandes santos e doutores — como São Basílio Magno, Santo Tomás de Aquino, São Bernardo de Claraval e São Pio de Pietrelcina — cultivaram uma terna e contínua amizade com os seus Santos Anjos da Guarda. Padre Pio recomendava com insistência aos seus filhos espirituais: "Invoca o teu Anjo da Guarda nos perigos, pois ele jamais te abandonará e te ajudará a resistir às seduções do maligno". A celebração litúrgica universal foi estendida a toda a Cristandade pelo Papa Paulo V em 1608 e fixada pelo Papa Clemente X em 2 de outubro.`,
    reflection: `Ter um Anjo da Guarda é a prova constante de que Deus nunca nos deixa sós. Ele caminha ao nosso lado nas ruas, inspira bons pensamentos em nossa mente, acalma a nossa agitação interior e apresenta as nossas preces diante do trono do Todo-Poderoso. Cultivemos a piedade de saudar diariamente o nosso companheiro invisível.`,
    prayer: `Santo Anjo do Senhor, meu zeloso guardador, se a ti me confiou a piedade divina, sempre me rege, me guarde, me governe, me ilumine. Defendei-me nas tentações, amparai-me nos tropeços e conduzi com segurança os meus passos para a Pátria Celeste. Amém.`,
    patronage: "Proteção contra perigos da alma e do corpo, viajantes, crianças, motoristas e guarda espiritual"
  },
  "2026-10-04": {
    name: "São Francisco de Assis",
    vocation: "Diácono, Fundador da Ordem dos Frades Menores (Franciscanos) e Padroeiro da Ecologia",
    biography: `Giovanni di Pietro di Bernardone, carinhosamente chamado de Francisco, nasceu em Assis, Itália, em 1182. Filho de um próspero comerciante de tecidos, viveu uma juventude mundana e sonhava com a glória da cavalaria militar. No entanto, após participar da guerra entre Assis e Perúgia e ser aprisionado, experimentou uma profunda crise existencial que preparou o solo para a graça de Deus.

Rezando diante do crucifixo bizantino na decadente igrejinha de São Damião, ouviu a voz viva de Cristo que lhe disse três vezes: "Francisco, vai e reconstrói a minha Igreja, que como vês está em ruínas!". Tomando a ordem a princípio ao pé da letra, reparou a ermida; logo em seguida, compreendeu que o Senhor o chamava para reconstruir a Igreja viva mediante a pobreza evangélica radical, o desapego total e a caridade sem limites.

Desfez-se de todos os bens diante do bispo de Assis e de seu pai furioso, despindo-se das próprias roupas e proclamando: "Doravante não direi mais 'meu pai Pedro Bernardone', mas sim 'Pai nosso que estais nos céus'!". Atraiu inúmeros companheiros com os quais fundou a Ordem dos Frades Menores, e junto com Santa Clara deu início à Ordem das Clarissas. 

Francisco via em toda a criação o reflexo luminoso da beleza divina, compondo o imortal "Cântico das Criaturas" (irmão Sol, irmã Lua, irmã Terra). Em 1224, em profunda oração no Monte Alverne, recebeu em seu próprio corpo os sagrados Estigmas da Paixão do Senhor — sendo o primeiro santo da história a ser marcado visivelmente com as chagas de Cristo nas mãos, pés e lado. Faleceu em 3 de outubro de 1226, deitado nu sobre a terra nua ao som do Salmo 141, acolhendo em paz a "irmã Morte corporal". Foi canonizado pelo Papa Gregório IX em 1228.`,
    reflection: `São Francisco não foi um mero amante da natureza, mas um apaixonado absoluto por Jesus Cristo Crucificado. Ele nos convida à sobriedade evangélica, à fraternidade sincera com todos os homens e ao cuidado generoso com a criação que Deus nos confiou.`,
    prayer: `Senhor, fazei-me instrumento de vossa paz. Onde houver ódio, que eu leve o amor; onde houver ofensa, que eu leve o perdão; onde houver discórdia, que eu leve a união; onde houver dúvida, que eu leve a fé; onde houver erro, que eu leve a verdade; onde houver desespero, que eu leve a esperança; onde houver tristeza, que eu leve a alegria; onde houver trevas, que eu leve a luz. Ó Mestre, fazei que eu procure mais consolar que ser consolado, compreender que ser compreendido, amar que ser amado. Pois é dando que se recebe, é perdoando que se é perdoado, e é morrendo que se vive para a vida eterna. Amém!`,
    patronage: "Ecologia, Animais, Meio Ambiente, Paz Universal, Itália e Ação Franciscana"
  },
  "2026-10-05": {
    name: "Santa Maria Faustina Kowalska e São Benedito o Mouro",
    vocation: "Apóstola e Secretária da Divina Misericórdia / Religioso Franciscano e Modelo de Humildade",
    biography: `Neste dia 5 de outubro, a Santa Igreja celebra a memória de dois insignes luminares da santidade cristã:

Santa Maria Faustina Kowalska (1905-1938), nascida Helena Kowalska na Polônia, ingressou na Congregação das Irmãs de Nossa Senhora da Misericórdia. Em Plock e Cracóvia, o próprio Jesus Cristo apareceu-lhe repetidas vezes com vestes brancas e dois raios luminosos (um vermelho simbolizando o Sangue que é a vida das almas e um pálido simbolizando a Água que justifica as almas) saindo do Seu Coração transpassado. Jesus encarregou-a de ser a "Secretária e Apóstola da Minha Misericórdia", transmitindo ao mundo a imagem milagrosa com a legenda "Jesus, eu confio em Vós", a Festa da Divina Misericórdia (no 2º Domingo da Páscoa), a Novena e o Terço da Divina Misericórdia e a comemoração da Hora da Misericórdia (às três horas da tarde). Seu 'Diário: A Misericórdia Divina na Minha Alma' tornou-se um dos maiores clássicos místicos do século XX. Foi canonizada no Grande Jubileu do ano 2000 por São João Paulo II.

São Benedito o Mouro (1526-1589), também comemorado no Brasil nesta data, nasceu na Sicília de pais escravizados procedentes da África. Liberto ao nascer, abraçou com ardor a vida eremítica franciscana. Embora analfabeto e exercendo humildemente a função de cozinheiro no convento de Santa Maria de Jesus em Palermo, sua sabedoria sobrenatural, sua santidade translúcida e seus milagres de multiplicação de alimentos eram tão insignes que teólogos, prelados e o povo acorriam a ele em busca de conselho e oração. Tornou-se um dos santos mais populares e amados das comunidades brasileiras e padroeiro dos afrodescendentes e cozinheiros.`,
    reflection: `A mensagem de Santa Faustina e de São Benedito convergem para uma verdade central do Evangelho: diante de Deus, não contam os títulos humanos ou a condição social, mas a pureza de um coração humilde que confia cegamente na misericórdia e se faz servo de todos.`,
    prayer: `Ó Deus de misericórdia infinita, que Vos dignastes manifestar à Santa Faustina os tesouros inesgotáveis do Vosso amor e cumulastes São Benedito com a sabedoria dos humildes: concedei-nos a graça de nunca desconfiar do Vosso perdão e de servir aos nossos irmãos com caridade paciente e despretensiosa. Jesus, eu confio em Vós! São Benedito, rogai por nós!`,
    patronage: "Apóstolos da Misericórdia, Cozinheiros, Pobres, Afrodescendentes e Famílias Humildes"
  },
  "2026-10-12": {
    name: "Nossa Senhora da Conceição Aparecida",
    vocation: "Rainha e Padroeira Principal do Brasil",
    biography: `A história de Nossa Senhora Aparecida teve início em outubro de 1717, quando o governador das capitanias de São Paulo e Minas de Ouro, Dom Pedro de Almeida (o Conde de Assumar), passava pela vila de Santo Antônio de Guaratinguetá a caminho de Vila Rica. A câmara local incumbiu três pescadores — Domingos Garcia, Filipe Pedroso e João Alves — de conseguirem peixes no Rio Paraíba do Sul para o banquete oficial.

Após horas de tentativas frustradas e com as redes vazias, os pescadores chegaram ao Porto de Itaguaçu. Ao lançar novamente a rede, João Alves recolheu o corpo de uma imagem de terracota da Imaculada Conceição, sem a cabeça. Lançando a rede mais adiante, apanhou a cabeça da mesma imagem, que se encaixou com perfeita exatidão. A partir daquele instante solene, as redes dos humildes pescadores se encheram de uma quantidade tão portentosa de peixes que os barcos quase afundaram.

Guardada inicialmente na casa de Filipe Pedroso, a humilde imagem escura atraía diariamente os vizinhos para rezar o terço. Ali multiplicaram-se prodígios: as velas apagadas acenderam-se espontaneamente, as correntes do escravizado Zacarias quebraram-se diante do altar, e o cavaleiro orgulhoso viu as patas de seu cavalo grudarem na pedra da igreja.

Em 1904 a imagem foi solenemente coroada, e em 1930 o Papa Pio XI proclamou Nossa Senhora Aparecida como Padroeira Principal do Brasil. Seu Santuário Nacional em Aparecida do Norte acolhe anualmente mais de 12 milhões de peregrinos, consolidando-se como o maior templo mariano do mundo católico e o coração espiritual da nação brasileira.`,
    reflection: `A Virgem Aparecida manifestou o amor de Deus pelos humildes ao escolher as águas lamacentas de um rio e as mãos calejadas de três pobres pescadores. Na sua pele morena de terracota, Maria abraça todas as dores, esperanças e lutas do povo brasileiro, convocando-nos à unidade, à paz e à justiça social.`,
    prayer: `Ó incomparável Senhora da Conceição Aparecida, Mãe de Deus e nossa Mãe, Rainha e Padroeira do Brasil: prostrados diante de vossa imagem milagrosa, nós vos consagramos as nossas famílias, as nossas crianças e a nossa Pátria. Protegei o nosso país contra todos os males, curai os enfermos, consolai os aflitos e conduzi todos os brasileiros ao caminho da concórdia e do Evangelho de Vosso Filho Jesus. Nossa Senhora Aparecida, rogai por nós!`,
    patronage: "Padroeira Principal do Brasil, Pescadores, Famílias Brasileiras e Proteção da Nação"
  },
  "2026-10-15": {
    name: "Santa Teresa de Jesus (Teresa de Ávila)",
    vocation: "Virgem carmelita, Fundadora do Carmelo Descalço e Primeira Doutora da Igreja",
    biography: `Teresa Sánchez de Cepeda y Ahumada nasceu em Ávila, Espanha, em 28 de março de 1515. Dotada de inteligência brilhante, vigor de espírito e grande sensibilidade, ingressou no Mosteiro da Encarnação aos 20 anos. Após anos de lutas interiores e doenças severas, experimentou diante de uma imagem de Cristo chagado uma profunda "segunda conversão" mística que revolucionou para sempre a sua existência.

Inspirada pelo Espírito Santo e amparada por grandes diretores espirituais como São Pedro de Alcântara e São João da Cruz, Teresa empreendeu a colossal Reforma do Carmelo, restaurando o rigor da clausura, o silêncio, a pobreza autêntica e a oração contemplativa contínua. Descalça e enfrentando incompreensões, perseguições e a oposição de poderosos, fundou 17 conventos de carmelitas descalças por toda a Espanha.

Como mística extraordinária, Teresa alcançou os mais elevados graus de união transformante com Deus, vivenciando o célebre fenômeno da Transverberação do Coração por um anjo com um dardo de ouro em brasa. Deixou escritas obras-primas incomparáveis da teologia e da literatura universal: 'Livro da Vida', 'Caminho de Perfeição' e 'Castelo Interior (ou Moradas)'.

Faleceu em Alba de Tormes em 4 de outubro de 1582, pronunciando as célebres palavras de fidelidade e júbilo: "Enfim, morro como filha da Igreja!". Foi canonizada em 1622 por Gregório XV e proclamada, em 1970 pelo Papa São Paulo VI, a primeira mulher Doutora da Igreja da história cristã.`,
    reflection: `Santa Teresa nos ensina a essência da oração cristã: "A oração mental não é outra coisa senão um trato de amizade, estando muitas vezes a sós com Quem sabemos que nos ama". Orar não é multiplicar palavras vazias, mas estar com o Amigo Jesus.`,
    prayer: `Nada te turbe, nada te espante; tudo passa, Deus não muda. A paciência tudo alcança; a quem tem Deus, nada lhe falta: só Deus basta! Ó Santa Teresa de Ávila, ensinai-nos a cultivar uma amizade íntima com Jesus na oração diária e a viver inteiramente para a glória de Deus e a edificação da Santa Igreja. Amém!`,
    patronage: "Pessoas em busca de vida de oração, Escritores católicos, Professores, Doentes de coração e Espanha"
  },
  "2026-10-28": {
    name: "São Judas Tadeu e São Simão Apóstolos",
    vocation: "Apóstolos de Jesus Cristo, Mártires da Fé e Patronos das Causas Impossíveis",
    biography: `Nesta data litúrgica, a Santa Igreja celebra conjuntamente o martírio glorioso de dois dos Doze Apóstolos escolhidos pessoalmente por Cristo: São Judas Tadeu e São Simão, o Zelota.

São Judas Tadeu, irmão de Tiago Menor e parente consanguíneo de Jesus e de São José, esteve presente na Última Ceia, onde dirigiu a célebre pergunta a Jesus: "Senhor, por que te hás de manifestar a nós e não ao mundo?" (Jo 14,22). É o autor da inspirada Epístola de Judas no Novo Testamento, onde exorta os fiéis a combaterem com ardor pelas verdades da fé transmitida aos santos.

São Simão, cognominado o Zelota pelo zelo ardente com que observava a Lei e o Evangelho, consagrou todo o seu entusiasmo patriótico à proclamação do Reino de Deus.

Após a descida do Espírito Santo em Pentecostes, ambos os Apóstolos partiram juntos em missão apostólica pela Mesopotâmia, Síria, Líbia e Pérsia, pregando o Evangelho, realizando curas e convertendo multidões ao Batismo. Em Suanir, na Pérsia, foram cercados por sacerdotes idólatras e carrascos pagos. Intimados a renunciar a Cristo e a queimar incenso aos falsos deuses pagãos, responderam com santa valentia que adoravam unicamente o Deus vivo. Foram cruelmente martirizados: São Judas foi golpeado com um machado e decapitado, e São Simão foi supliciado com uma serra. 

As relíquias de ambos repousam na Basílica de São Pedro no Vaticano. Desde a Idade Média, Santa Brígida da Suécia e São Bernardo receberam de Cristo a revelação de que São Judas Tadeu é o patrono especial para socorrer as causas mais desesperadas e de difícil solução.`,
    reflection: `São Judas Tadeu e São Simão demonstram que o seguimento de Cristo exige coragem e fidelidade até o derramamento de sangue. Quando nos deparamos com problemas familiares, financeiros ou de saúde aparentemente insolúveis, a intercessão apostólica nos recorda que Deus nunca abandona os que clamam com fé.`,
    prayer: `São Judas Tadeu, glorioso Apóstolo e servo fiel de Jesus, a Igreja vos honra e invoca universalmente como patrono dos casos desesperados e das causas sem remédio. Rogai por mim que estou tão desamparado e aflito. Fazei uso, eu vos suplico, desse privilégio particular que vos foi concedido de trazer alívio visível e imediato onde o socorro parece quase impossível. Vinde em meu auxílio nesta grande necessidade para que eu possa receber a consolação e o socorro do Céu em todas as minhas tribulações, e possa louvar a Deus convosco por toda a eternidade. São Judas Tadeu, rogai por nós!`,
    patronage: "Causas Perdidas, Casos Desesperados, Desempregados, Trabalhadores e Aflições Extremas"
  }
};

let updatedCount = 0;
for (const [dateStr, sData] of Object.entries(saintsData)) {
  const filePath = path.resolve(`data/santos/2026/${dateStr}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`! Arquivo não encontrado: ${filePath}`);
    continue;
  }
  const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (Array.isArray(fileContent.saints) && fileContent.saints.length > 0) {
    const s = fileContent.saints[0];
    s.biography = sData.biography;
    s.reflection = sData.reflection;
    s.prayer = sData.prayer;
    s.patronage = sData.patronage;
    s.vocation = sData.vocation;
    if (sData.name) s.name = sData.name;
    
    // Assegura campos de enriquecimento
    if (!s.enrichment) s.enrichment = {};
    s.enrichment.canonicalEnriched = true;
    s.enrichment.enrichedAt = new Date().toISOString();

    fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2), 'utf8');
    console.log(`✓ Enriquecido com sucesso: ${dateStr} — ${s.name}`);
    updatedCount++;
  }
}

console.log(`\nConcluído! ${updatedCount} arquivos de santos enriquecidos com biografias, reflexões e orações.`);
