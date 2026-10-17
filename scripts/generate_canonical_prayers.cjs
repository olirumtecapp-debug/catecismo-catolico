const fs = require('fs');

const canonicalPrayers = [
    // ==========================================
    // 1. FUNDAMENTAIS (7)
    // ==========================================
    {
        id: 'p_1',
        title: 'Pai-Nosso',
        latinTitle: 'Pater Noster',
        category: 'Fundamentais',
        text: `Pai nosso, que estais nos céus,
santificado seja o vosso nome;
venha a nós o vosso reino,
seja feita a vossa vontade,
assim na terra como no céu.
O pão nosso de cada dia nos dai hoje;
perdoai-nos as nossas ofensas,
assim como nós perdoamos a quem nos tem ofendido;
e não nos deixeis cair em tentação,
mas livrai-nos do mal.
Amém.`
    },
    {
        id: 'p_2',
        title: 'Ave-Maria',
        latinTitle: 'Ave Maria',
        category: 'Fundamentais',
        text: `Ave Maria, cheia de graça,
o Senhor é convosco,
bendita sois vós entre as mulheres,
e bendito é o fruto do vosso ventre, Jesus.
Santa Maria, Mãe de Deus,
rogai por nós, pecadores,
agora e na hora da nossa morte.
Amém.`
    },
    {
        id: 'p_4',
        title: 'Glória ao Pai',
        latinTitle: 'Gloria Patri',
        category: 'Fundamentais',
        text: `Glória ao Pai, e ao Filho, e ao Espírito Santo.
Como era no princípio, agora e sempre.
Amém.`
    },
    {
        id: 'p_5',
        title: 'Credo (Símbolo dos Apóstolos)',
        latinTitle: 'Symbolum Apostolorum',
        category: 'Fundamentais',
        text: `Creio em Deus Pai todo-poderoso,
criador do céu e da terra;
e em Jesus Cristo, seu único Filho, nosso Senhor;
que foi concebido pelo poder do Espírito Santo;
nasceu da Virgem Maria,
padeceu sob Pôncio Pilatos,
foi crucificado, morto e sepultado;
desceu à mansão dos mortos;
ressuscitou ao terceiro dia;
subiu aos céus,
está sentado à direita de Deus Pai todo-poderoso,
de onde há de vir a julgar os vivos e os mortos.
Creio no Espírito Santo,
na santa Igreja católica,
na comunhão dos santos,
na remissão dos pecados,
na ressurreição da carne,
na vida eterna.
Amém.`
    },
    {
        id: 'p_credo_niceno',
        title: 'Credo Niceno-Constantinopolitano',
        latinTitle: 'Symbolum Nicaenum Constantinopolitanum',
        category: 'Fundamentais',
        text: `Creio em um só Deus, Pai todo-poderoso,
Criador do céu e da terra,
de todas as coisas visíveis e invisíveis.
Creio em um só Senhor, Jesus Cristo, Filho Unigênito de Deus,
nascido do Pai antes de todos os séculos:
Deus de Deus, Luz da Luz, Deus verdadeiro de Deus verdadeiro,
gerado, não criado, consubstancial ao Pai.
Por Ele todas as coisas foram feitas.
E por nós, homens, e para nossa salvação, desceu dos céus:
e encarnou pelo Espírito Santo, no seio da Virgem Maria, e se fez homem.
Também por nós foi crucificado sob Pôncio Pilatos;
padeceu e foi sepultado.
Ressuscitou ao terceiro dia, conforme as Escrituras,
e subiu aos céus, onde está sentado à direita do Pai.
E de novo há de vir, em sua glória, para julgar os vivos e os mortos;
e o seu reino não terá fim.
Creio no Espírito Santo, Senhor que dá a vida,
e procede do Pai e do Filho;
e com o Pai e o Filho é adorado e glorificado:
Ele que falou pelos profetas.
Creio na Igreja, una, santa, católica e apostólica.
Professo um só batismo para a remissão dos pecados.
E espero a ressurreição dos mortos
e a vida do mundo que há de vir.
Amém.`
    },
    {
        id: 'p_santo_anjo',
        title: 'Santo Anjo do Senhor',
        latinTitle: 'Angele Dei',
        category: 'Fundamentais',
        text: `Santo Anjo do Senhor,
meu zeloso guardião,
se a ti me confiou a piedade divina,
sempre me rege, me guarde,
me governe e me ilumine.
Amém.`
    },
    {
        id: 'p_sinal_cruz',
        title: 'Sinal da Cruz & Oferecimento do Dia',
        latinTitle: 'Signum Crucis & Oblatio Diei',
        category: 'Fundamentais',
        text: `Pelo sinal da Santa Cruz, livrai-nos, Deus, nosso Senhor, dos nossos inimigos.
Em nome do Pai e do Filho e do Espírito Santo. Amém.

Ofereço-Vos, ó meu Deus, em união com o Santíssimo Coração de Jesus e por meio do Imaculado Coração de Maria, todas as orações, obras, sofrimentos e alegrias deste dia, por todas as intenções pelas quais o Vosso Divino Filho se oferece continuamente no Altar.
Amém.`
    },

    // ==========================================
    // 2. MARIA (10)
    // ==========================================
    {
        id: 'p_6',
        title: 'Salve Rainha',
        latinTitle: 'Salve Regina',
        category: 'Maria',
        text: `Salve, Rainha, Mãe de misericórdia,
vida, doçura e esperança nossa, salve!
A vós bradamos, os degredados filhos de Eva;
a vós suspiramos, gemendo e chorando neste vale de lágrimas.
Eia, pois, advogada nossa,
esses vossos olhos misericordiosos a nós volvei;
e depois deste desterro mostrai-nos Jesus,
bendito fruto do vosso ventre.
Ó clemente, ó piedosa, ó doce sempre Virgem Maria.
Rogai por nós, santa Mãe de Deus,
para que sejamos dignos das promessas de Cristo.
Amém.`
    },
    {
        id: 'p_magnificat',
        title: 'Magnificat (Cântico de Maria)',
        latinTitle: 'Canticum B. Mariae Virginis (Lc 1, 46-55)',
        category: 'Maria',
        text: `A minha alma engrandece o Senhor
e o meu espírito se alegra em Deus, meu Salvador,
porque olhou para a humildade de sua serva.
Doravante todas as gerações me chamarão bem-aventurada,
porque o Todo-Poderoso fez em mim grandes coisas.
Santo é o seu nome!
A sua misericórdia se estende de geração em geração
sobre os que o temem.
Manifestou o poder do seu braço:
dispersou os soberbos de coração.
Derrubou os poderosos de seus tronos
e exaltou os humildes.
Encheu de bens os famintos
e despediu os ricos de mãos vazias.
Acolheu a Israel, seu servidor,
fiel à sua misericórdia,
como havia prometido a nossos pais,
em favor de Abraão e de sua descendência para sempre.
Glória ao Pai, ao Filho e ao Espírito Santo.
Como era no princípio, agora e sempre.
Amém.`
    },
    {
        id: 'p_angelus',
        title: 'Angelus Domini (O Anjo do Senhor)',
        latinTitle: 'Angelus Domini',
        category: 'Maria',
        text: `V. O Anjo do Senhor anunciou a Maria.
R. E Ela concebeu do Espírito Santo.
Ave Maria...

V. Eis aqui a serva do Senhor.
R. Faça-se em mim segundo a vossa palavra.
Ave Maria...

V. E o Verbo se fez carne.
R. E habitou entre nós.
Ave Maria...

V. Rogai por nós, Santa Mãe de Deus.
R. Para que sejamos dignos das promessas de Cristo.

Oremos: Infundi, Senhor, a vossa graça em nossas almas, para que nós, que pela anunciação do Anjo conhecemos a encarnação de Jesus Cristo, vosso Filho, pela sua paixão e cruz sejamos conduzidos à glória da ressurreição. Por Cristo, nosso Senhor.
Amém.`
    },
    {
        id: 'p_regina_caeli',
        title: 'Regina Caeli (Rainha do Céu)',
        latinTitle: 'Regina Caeli (Tempo Pascal)',
        category: 'Maria',
        text: `Rainha do Céu, alegrai-Vos, aleluia!
Porque Aquele que merecestes trazer em vosso seio, aleluia!
Ressuscitou como disse, aleluia!
Rogai por nós a Deus, aleluia!

V. Alegrai-vos e exultai, ó Virgem Maria, aleluia!
R. Porque o Senhor ressuscitou verdadeiramente, aleluia!

Oremos: Ó Deus, que Vos dignastes alegrar o mundo com a ressurreição do Vosso Filho, Nosso Senhor Jesus Cristo, concedei-nos, Vos suplicamos, a graça de alcançarmos pela proteção da Virgem Maria, Sua Mãe, as alegrias da vida eterna. Pelo mesmo Cristo, Nosso Senhor.
Amém.`
    },
    {
        id: 'p_lembrai_vos',
        title: 'Lembrai-vos (Memorare)',
        latinTitle: 'Memorare (São Bernardo de Claraval)',
        category: 'Maria',
        text: `Lembrai-vos, ó puríssima Virgem Maria,
que nunca se ouviu dizer
que algum daqueles que tenham recorrido à vossa proteção,
implorado a vossa assistência
e reclamado o vosso socorro,
fosse por vós desamparado.
Animado eu, pois, com igual confiança,
a vós, ó Virgem das virgens, como a Mãe recorro;
a vós me apresento, e, gemendo sob o peso dos meus pecados,
me prostro a vossos pés.
Não desprezeis as minhas súplicas,
ó Mãe do Verbo encarnado,
mas dignai-vos de as ouvir propícia e de me alcançar o que vos peço.
Amém.`
    },
    {
        id: 'p_sub_tuum',
        title: 'Sob a Vossa Proteção',
        latinTitle: 'Sub Tuum Praesidium (Séc. III)',
        category: 'Maria',
        text: `Sob a vossa proteção nos refugiamos, Santa Mãe de Deus.
Não desprezeis as nossas súplicas em nossas necessidades,
mas livrai-nos sempre de todos os perigos,
ó Virgem gloriosa e bendita.
Senhora nossa, Medianeira nossa, Advogada nossa!
Com vosso Filho reconciliai-nos,
ao vosso Filho recomendai-nos,
ao vosso Filho apresentai-nos.
Amém.`
    },
    {
        id: 'p_consagracao_nossa_senhora',
        title: 'Consagração a Nossa Senhora',
        latinTitle: 'Actus Consecrationis B.M.V.',
        category: 'Maria',
        text: `Ó minha Senhora, ó minha Mãe,
eu me ofereço todo a vós,
e em prova da minha devoção para convosco,
vos consagro neste dia e para sempre,
meus olhos, meus ouvidos, minha boca, meu coração
e inteiramente todo o meu ser.
E porque assim sou vosso, ó incomparável Mãe,
guardai-me e defendei-me como coisa e propriedade vossa.
Amém.`
    },
    {
        id: 'p_consagracao_montfort',
        title: 'Consagração da Escravidão de Amor',
        latinTitle: 'São Luís Maria Grignion de Montfort',
        category: 'Maria',
        text: `Eu, pecador infiel, renovo e ratifico hoje, em vossas mãos, ó Maria Imaculada, as promessas do meu Batismo:
Renuncio para sempre a Satanás, às suas pompas e às suas obras, e dou-me inteiramente a Jesus Cristo, Sabedoria Encarnada, para levar a minha cruz atrás d'Ele, todos os dias de minha vida.

E para Lhe ser mais fiel do que tenho sido até aqui, escolho-vos hoje, ó Maria, na presença de toda a corte celeste, por minha Mãe e Senhora.
Entrego-vos e consagro-vos, como vosso escravo de amor, meu corpo e minha alma, meus bens interiores e exteriores, e até o próprio valor de minhas boas obras, passadas, presentes e futuras, deixando-vos inteiro e pleno direito de dispor de mim e de tudo o que me pertence, sem exceção, segundo o vosso beneplácito, para a maior glória de Deus, no tempo e na eternidade.
Amém.`
    },
    {
        id: 'p_desatadora_nos',
        title: 'Oração a Nossa Senhora Desatadora dos Nós',
        latinTitle: 'Sancta Maria Desatadora dos Nós',
        category: 'Maria',
        text: `Virgem Maria, Mãe do belo amor, Mãe que nunca recusa socorrer um filho necessitado,
Mãe cujas mãos não cessam de servir aos vossos amados filhos, pois são movidas pelo amor divino e pela imensa misericórdia que existe em vosso Coração:
Volvei o vosso olhar compassivo sobre mim e vede o nó das dificuldades que sufocam a minha vida.

Vós bem conheceis o meu desespero e a minha dor. Vós sabeis o quanto esses nós me paralisam.
Maria, Mãe que Deus encarregou de desatar os nós da vida dos seus filhos, confio hoje a fita da minha existência em vossas mãos maternas.
Ninguém, nem mesmo o maligno, pode tirá-la do vosso precioso amparo.
Em vossas mãos não há nó que não possa ser desfeito.
Mãe poderosa, por vossa graça e vosso poder intercessor junto a vosso Filho Jesus, meu Salvador, recebei hoje em vossas mãos este nó... (mencione a intenção).
Desatai-o, ó Mãe amável, para a glória de Deus e para sempre!
Vós sois a minha esperança, a minha consolação e a minha força.
Nossa Senhora Desatadora dos Nós, rogai por nós.
Amém.`
    },
    {
        id: 'p_aparecida',
        title: 'Oração a Nossa Senhora Aparecida',
        latinTitle: 'Padroeira do Brasil',
        category: 'Maria',
        text: `Ó incomparável Senhora da Conceição Aparecida,
Mãe de Deus e nossa Mãe,
Rainha dos Anjos, Advogada dos pecadores,
refúgio e consolação dos aflitos e atribulados:
Prostrado aos vossos pés, com a mais viva confiança,
dirijo-vos a minha humilde oração.

Alcançai-me de vosso amado Filho o perdão de todos os meus pecados,
a graça de uma verdadeira conversão,
a paz para a minha família e para a Santa Igreja,
e o alívio nas aflições corporais e espirituais que me afligem.
Abençoai a nossa Pátria, sede o amparo dos pobres e necessitados,
e guiai os nossos passos no caminho da fidelidade ao Evangelho.
Protegei-me em todos os perigos da alma e do corpo,
e assisti-me na hora da minha morte.
Nossa Senhora Aparecida, Padroeira do Brasil, rogai por nós!
Amém.`
    },

    // ==========================================
    // 3. MISERICÓRDIA (6)
    // ==========================================
    {
        id: 'p_terco_misericordia',
        title: 'Terço da Divina Misericórdia',
        latinTitle: 'Coronilla Divinae Misericordiae (Sta. Faustina)',
        category: 'Misericórdia',
        text: `Inicia-se com o Sinal da Cruz, um Pai-Nosso, uma Ave-Maria e o Credo.

Nas contas grandes do Pai-Nosso, reza-se:
"Eterno Pai, eu Vos ofereço o Corpo e o Sangue, a Alma e a Divindade de Vosso diletíssimo Filho, Nosso Senhor Jesus Cristo, em expiação dos nossos pecados e dos do mundo inteiro."

Nas dez contas pequenas da Ave-Maria, reza-se:
"Pela Sua dolorosa Paixão, tende misericórdia de nós e do mundo inteiro."

Ao final das 5 dezenas, repete-se três vezes:
"Deus Santo, Deus Forte, Deus Imortal, tende piedade de nós e do mundo inteiro."

Jaculatórias finais:
"Ó Sangue e Água que jorrastes do Coração de Jesus como fonte de misericórdia para nós, eu confio em Vós!"
"Jesus, eu confio em Vós!"
Amém.`
    },
    {
        id: 'p_tres_horas',
        title: 'Oração das Três Horas (Hora da Misericórdia)',
        latinTitle: 'Hora Misericordiae (15h00)',
        category: 'Misericórdia',
        text: `Ó Jesus, Vós expirastes, mas a fonte da vida brotou para as almas e o mar de misericórdia se abriu para o mundo inteiro.
Ó Fonte de Vida, insondável Misericórdia Divina, envolvei o mundo todo e derramai-Vos sobre nós!

Ó Sangue e Água, que jorrastes do Coração de Jesus como fonte de misericórdia para nós, eu confio em Vós!

Deus Santo, Deus Forte, Deus Imortal, tende piedade de nós e do mundo inteiro.
Jesus, manso e humilde de coração, fazei o nosso coração semelhante ao Vosso.
Amém.`
    },
    {
        id: 'p_abandono_dolindo',
        title: 'Ato de Abandono à Divina Providência',
        latinTitle: 'Pe. Dolindo Ruotolo',
        category: 'Misericórdia',
        text: `Por que vos confundis e vos agitais? Deixai-me o cuidado das vossas coisas e tudo se acalmará.
Em verdade vos digo que cada ato de verdadeiro, cego e completo abandono em Mim produz o efeito que desejais e resolve as situações mais espinhosas.
Abandonar-se não significa afligir-se, perturbar-se e desesperar-se, dirigindo-me depois uma oração agitada.
Abandonar-se significa fechar serenamente os olhos da alma, afastar os pensamentos da tribulação e confiar em Mim, dizendo com o coração:

"Ó Jesus, eu me abandono em Ti, cuida Tu de tudo!"
(Repetir com fé: Ó Jesus, eu me abandono em Ti, cuida Tu de tudo!)

Nos momentos de aflição, descanse no Meu Coração e deixe que a Minha graça reine soberana sobre a sua vida.
Amém.`
    },
    {
        id: 'p_miserere',
        title: 'Salmo 50 (Miserere)',
        latinTitle: 'Miserere mei, Deus (Salmo Penitencial)',
        category: 'Misericórdia',
        text: `Tende piedade de mim, ó Deus, segundo a vossa grande misericórdia;
segundo a vossa imensa bondade, apagai a minha iniquidade.
Lavai-me completamente da minha culpa e purificai-me do meu pecado.
Reconheço a minha maldade e o meu pecado está sempre diante de mim.
Foi contra Vós, só contra Vós que eu pequei e cometi o mal diante dos vossos olhos.

Criai em mim, ó Deus, um coração puro e renovai no meu íntimo um espírito reto.
Não me afasteis da vossa presença e não retireis de mim o vosso Santo Espírito.
Dai-me de novo a alegria da vossa salvação e sustentai-me com um espírito generoso.
Senhor, abri os meus lábios e a minha boca proclamará o vosso louvor.
Pois não Vos comprazeis em sacrifícios: se eu Vos oferecesse um holocausto, não o aceitaríeis.
O sacrifício aceito por Deus é um espírito contrito; um coração contrito e humilhado, ó Deus, não haveis de desprezar.
Glória ao Pai, ao Filho e ao Espírito Santo.
Como era no princípio, agora e sempre.
Amém.`
    },
    {
        id: 'p_invocacao_sangue_agua',
        title: 'Invocação a Jesus Misericordioso',
        latinTitle: 'Confiteor Divinae Misericordiae',
        category: 'Misericórdia',
        text: `Senhor Jesus, acolhei-me em vossa misericórdia insondável.
Mesmo que os meus pecados fossem negros como a noite, a vossa misericórdia é mais forte que a minha miséria.
Apenas vos peço uma coisa: não permitais que eu duvide da vossa bondade.

Ó Coração amabilíssimo de Jesus, fornalha ardente de amor e de caridade, abri para mim a vossa chaga bendita, refúgio seguro dos pecadores.
Jesus, eu confio em Vós!
Jesus, eu confio em Vós!
Jesus, eu confio em Vós!
Amém.`
    },
    {
        id: 'p_oracao_perdao_ofensas',
        title: 'Oração pelo Perdão e Reconciliação',
        latinTitle: 'Oratio pro Pace et Venia',
        category: 'Misericórdia',
        text: `Senhor Jesus Cristo, que na Cruz perdoastes aos vossos algozes, dizendo: "Pai, perdoa-lhes, pois não sabem o que fazem":
Dai-me a graça de perdoar de coração a todos os que me ofenderam, caluniaram ou feriram.
Retirai de minha alma todo resquício de ressentimento, amargura ou desejo de vingança.

Concedei-lhes a vossa bênção e a luz da salvação, e a mim a doce liberdade que brota do Vosso Sagrado Coração manso e humilde.
Fazei que eu ame como Vós amastes e acolha a misericórdia que cura todas as feridas.
Amém.`
    },

    // ==========================================
    // 4. EUCARISTIA (8)
    // ==========================================
    {
        id: 'p_8',
        title: 'Anima Christi (Alma de Cristo)',
        latinTitle: 'Anima Christi (Tradicional)',
        category: 'Eucaristia',
        text: `Alma de Cristo, santificai-me.
Corpo de Cristo, salvai-me.
Sangue de Cristo, inebriai-me.
Água do lado de Cristo, lavai-me.
Paixão de Cristo, confortai-me.
Ó bom Jesus, ouvi-me.
Dentro de vossas chagas, escondei-me.
Não permitais que me separe de vós.
Do inimigo maligno, defendei-me.
Na hora da minha morte, chamai-me.
E mandai-me ir para vós,
para que com os vossos santos vos louve
por todos os séculos dos séculos.
Amém.`
    },
    {
        id: 'p_tantum_ergo',
        title: 'Tão Sublime Sacramento (Tantum Ergo)',
        latinTitle: 'Tantum Ergo Sacramentum (Sto. Tomás de Aquino)',
        category: 'Eucaristia',
        text: `Tão sublime Sacramento adoremos neste altar,
pois o Antigo Testamento deu ao Novo seu lugar.
Venha a fé por suplemento os sentidos completar.

Ao eterno Pai cantemos e a Jesus, o Salvador,
ao Espírito exaltemos, na Trindade eterno amor;
ao Deus Uno e Trino demos a alegria do louvor.
Amém.

V. Do céu lhes destes o pão.
R. Que contém em si todo o deleite.

Oremos: Deus, que neste admirável sacramento nos deixastes o memorial da vossa paixão, concedei-nos tal veneração pelos sagrados mistérios do vosso Corpo e Sangue, que experimentemos sempre em nós o fruto da vossa redenção. Vós que viveis e reinais pelos séculos dos séculos.
Amém.`
    },
    {
        id: 'p_adoro_te_devote',
        title: 'Adoro Te Devote (Eu Te Adoro Devotamente)',
        latinTitle: 'Adoro Te Devote (Santo Tomás de Aquino)',
        category: 'Eucaristia',
        text: `Eu Te adoro com afeto, Deus oculto,
que sob estas figuras Te escondes verdadeiramente.
A Ti meu coração se submete por inteiro,
pois contemplando-Te, todo ele desfalece.

A vista, o tato e o gosto iludem-se a Teu respeito,
mas somente o ouvido é digno de fé:
creio em tudo quanto disse o Filho de Deus,
nada há mais verdadeiro que esta palavra da Verdade.

Na cruz estava oculta apenas a Divindade,
mas aqui se esconde também a Humanidade.
Eu, contudo, crendo e confessando ambas,
peço o que pediu o ladrão arrependido.

Não vejo as chagas como Tomé,
contudo confesso-Te como meu Deus.
Faze-me crer em Ti cada vez mais,
esperar em Ti e amar-Te.

Ó memorial da morte do Senhor,
Pão vivo que dás a vida aos homens,
concede à minha alma que de Ti viva
e que sempre sinta a Tua doçura.
Jesus, a quem agora contemplo sob véus,
suplico-Te que se cumpra o que tanto desejo:
que, contemplando-Te face a face,
eu seja eternamente feliz na visão da Tua glória.
Amém.`
    },
    {
        id: 'p_o_sacrum_convivium',
        title: 'Ó Sagrado Banquete (O Sacrum Convivium)',
        latinTitle: 'Antiphona de Sanctissimo Sacramento',
        category: 'Eucaristia',
        text: `Ó Sagrado Banquete, em que se recebe Cristo,
renova-se a memória da Sua Paixão,
a alma se enche de graça
e nos é dado o penhor da glória futura!

V. Vós lhes destes, Senhor, o pão do Céu.
R. Que contém em si toda a doçura.

Oremos: Senhor Jesus Cristo, que neste admirável sacramento nos deixastes a memória viva da vossa Paixão, fazei que celebremos de tal modo os santos mistérios do vosso Corpo e Sangue, que sintamos continuamente em nós o penhor da redenção. Vós que sois Deus com o Pai na unidade do Espírito Santo.
Amém.`
    },
    {
        id: 'p_oracao_afonso_santissimo',
        title: 'Visita ao Santíssimo Sacramento',
        latinTitle: 'Santo Afonso Maria de Ligório',
        category: 'Eucaristia',
        text: `Meu Senhor Jesus Cristo, que por amor dos homens estais noite e dia neste Sacramento, cheio de piedade e de amor, esperando, chamando e acolhendo todos os que Vos vêm visitar:
Eu creio que estais presente no Sacramento do Altar.
Adoro-Vos do abismo do meu nada e dou-Vos graças por todos os benefícios que me tendes feito, especialmente por Vos terdes dado a Vós mesmo a mim neste Sacramento, por me terdes concedido como advogada vossa Mãe Maria Santíssima e por me terdes chamado a visitar-Vos nesta Igreja.

Saúdo hoje o vosso amantíssimo Coração com a tríplice intenção: primeiro, em ação de graças por este grande dom; segundo, para reparar todas as ofensas que tendes recebido neste Sacramento dos hereges e maus cristãos; terceiro, com a intenção de adorar-Vos, por esta visita, em todos os lugares da terra onde estais menos reverenciado e mais abandonado.
Meu Jesus, amo-Vos de todo o meu coração.
Arrependo-me de ter tantas vezes ofendido a vossa infinita bondade.
Proponho com a vossa graça nunca mais Vos ofender para o futuro.
Amém.`
    },
    {
        id: 'p_comunhao_espiritual',
        title: 'Ato de Comunhão Espiritual',
        latinTitle: 'Actus Communionis Spiritualis',
        category: 'Eucaristia',
        text: `Meu Jesus, eu creio que estais presente no Santíssimo Sacramento.
Amo-Vos sobre todas as coisas e desejo receber-Vos em minha alma.
Visto que agora não posso receber-Vos sacramentalmente,
vinde pelo menos espiritualmente ao meu coração.

Como já presente, eu Vos abraço e me uno inteiramente a Vós;
não permitais que eu jamais me separe de Vós.
Jesus, Sumo Bem e doce Amor meu,
inflamai meu coração para que arda sempre de amor por Vós!
Amém.`
    },
    {
        id: 'p_pos_comunhao_aquino',
        title: 'Ação de Graças pós-Comunhão',
        latinTitle: 'Santo Tomás de Aquino',
        category: 'Eucaristia',
        text: `Graças Vos dou, Senhor santo, Pai todo-poderoso, Deus eterno, que, sem merecimento meu, mas por pura misericórdia da vossa bondade, Vos dignastes saciar a mim, pecador e vosso indigno servo, com o Corpo e o Sangue precioso do vosso Filho, Nosso Senhor Jesus Cristo.

Suplico-Vos que esta santa comunhão não seja para mim motivo de condenação, mas penhor salutar de perdão.
Seja ela a armadura da minha fé e o escudo da minha boa vontade.
Faça-me exterminar os vícios, extirpar as paixões desordenadas, aumentar a caridade e a paciência, a humildade e a obediência, e todas as outras virtudes.
Seja a minha firme defesa contra as ciladas de todos os inimigos, visíveis e invisíveis.
Conduza-me a Vós, único e verdadeiro Deus, e faça-me alcançar a felicidade perfeita.
Dignai-Vos levar a mim, pecador, àquele inefável banquete onde Vós, com o vosso Filho e o Espírito Santo, sois para os vossos santos luz verdadeira, saciedade plena, alegria eterna, júbilo consumado e felicidade perfeita.
Por Cristo, nosso Senhor.
Amém.`
    },
    {
        id: 'p_pos_comunhao_boaventura',
        title: 'Transpassai meu Coração',
        latinTitle: 'São Boaventura (Doutor Seráfico)',
        category: 'Eucaristia',
        text: `Transpassai, dulcíssimo Jesus, o mais íntimo da minha alma com a ferida suave e salutar do vosso amor, com a verdadeira, serena e apostólica caridade, para que ela desfaleça e se derreta sempre em Vos amar e desejar.
Tenha ela sede de Vós, Fonte da vida, Fonte da sabedoria e da ciência, Fonte da luz eterna, torrente de delícias, riqueza da casa de Deus.

A Vós sempre aspire, a Vós procure, a Vós encontre, para Vós caminhe, a Vós alcance, em Vós medite, de Vós fale e tudo realize para honra e glória do vosso nome, com humildade e discrição, com amor e deleite, com facilidade e perseverança final.
Sede Vós só sempre a minha esperança, a minha confiança, a minha riqueza, o meu deleite, a minha alegria, o meu descanso e a minha paz!
Amém.`
    },

    // ==========================================
    // 5. CONFISSÃO & PENITÊNCIA (6)
    // ==========================================
    {
        id: 'p_3',
        title: 'Ato de Contrição Tradicional',
        latinTitle: 'Actus Contritionis',
        category: 'Confissão',
        text: `Meu Deus, me arrependo de todo o coração de vos ter ofendido,
porque sois tão bom e amável.
Prometo, com a vossa graça, esforçar-me para ser bom,
confessar-me, cumprir a penitência e evitar as ocasiões de pecado.
Meu Deus, misericórdia, perdoai os meus pecados.
Amém.`
    },
    {
        id: 'p_contrition_perfeita',
        title: 'Ato de Contrição Perfeita',
        latinTitle: 'São João Maria Vianney (Cura d’Ars)',
        category: 'Confissão',
        text: `Senhor meu Jesus Cristo, Deus e Homem verdadeiro, Criador e Redentor meu:
Por serdes Vós quem sois, sumamente bom e digno de ser amado sobre todas as coisas,
e porque Vos amo de todo o meu coração, pesa-me, Senhor, de Vos ter ofendido.
Pesa-me também porque posso perder o Céu e merecer o inferno.

Mas proponho firmemente, ajudado com os auxílios da vossa divina graça,
nunca mais pecar, confessar-me inteiramente e cumprir a penitência que me for imposta.
Confio que pela vossa infinita bondade e misericórdia me perdoareis pelos merecimentos da vossa sagrada Paixão e Morte.
Amém.`
    },
    {
        id: 'p_confiteor',
        title: 'Confiteor (Confesso a Deus Todo-Poderoso)',
        latinTitle: 'Confiteor Deo Omnipotenti',
        category: 'Confissão',
        text: `Confesso a Deus todo-poderoso e a vós, irmãos e irmãs,
que pequei muitas vezes por pensamentos e palavras,
atos e omissões,
por minha culpa, minha tão grande culpa.
E peço à Virgem Maria, aos Anjos e Santos,
e a vós, irmãos e irmãs,
que rogueis por mim a Deus, nosso Senhor.

Deus todo-poderoso tenha compaixão de nós,
perdoe os nossos pecados e nos conduza à vida eterna.
Amém.`
    },
    {
        id: 'p_antes_confissao',
        title: 'Oração para antes da Confissão',
        latinTitle: 'Oratio ante Confessionem',
        category: 'Confissão',
        text: `Senhor Deus, Luz de toda a verdade e Pai de infinita ternura:
Enviai o vosso Espírito Santo sobre mim para que ilumine as trevas da minha inteligência e amoleça a dureza do meu coração.
Fazei-me conhecer com clareza todos os meus pecados de pensamentos, palavras, atos e omissões cometidos contra a vossa santa lei e contra o meu próximo.

Dai-me uma dor sincera por ter ofendido a Vós, meu Pai tão bom e amoroso.
Concedei-me a coragem de confessar com humildade, verdade e transparência as minhas faltas diante do vosso sacerdote, e dai-me a firme resolução de nunca mais pecar.
Maria, Refúgio dos Pecadores, rogai por mim nesta confissão.
Santo Anjo da Guarda, assisti-me.
Amém.`
    },
    {
        id: 'p_depois_confissao',
        title: 'Ação de Graças pós-Confissão',
        latinTitle: 'Oratio post Confessionem',
        category: 'Confissão',
        text: `Bendito sejais, ó Senhor Deus de misericórdia, que pelo Sangue precioso de Jesus e pelas palavras da absolvição sacramental, lavastes a minha alma de toda a mancha do pecado!
Restaurastes em mim a vossa graça e a paz que o mundo não pode dar.

Renovo diante de Vós a minha determinação: renuncio ao mal, às ocasiões de queda e às falsas promessas do pecado.
Ajudai-me, Senhor, a perseverar até o fim. Dai-me forças para cumprir prontamente a penitência recebida e reparar o mal que pratiquei.
Jesus, Maria e José, abençoai o meu novo caminho na graça divina.
Amém.`
    },
    {
        id: 'p_de_profundis',
        title: 'De Profundis (Salmo 129)',
        latinTitle: 'De Profundis clamavi ad Te, Domine',
        category: 'Confissão',
        text: `Das profundezas clamo a Vós, Senhor; Senhor, ouvi a minha voz!
Estejam vossos ouvidos atentos ao clamor da minha prece.
Se considerardes as nossas culpas, Senhor, quem poderá subsistir?
Mas em Vós se encontra o perdão, para que sejais temido com respeito.

Confio no Senhor, a minha alma confia na sua palavra.
A minha alma espera pelo Senhor mais do que os vigias pela aurora.
Mais do que as sentinelas pela manhã, espere Israel pelo Senhor,
porque no Senhor está a misericórdia e junto d'Ele copiosa redenção.
E Ele há de redimir a Israel de todas as suas iniquidades.
Glória ao Pai, ao Filho e ao Espírito Santo.
Como era no princípio, agora e sempre.
Amém.`
    },

    // ==========================================
    // 6. ESPÍRITO SANTO (6)
    // ==========================================
    {
        id: 'p_7',
        title: 'Vinde, Espírito Santo (Invocação Tradicional)',
        latinTitle: 'Veni Sancte Spiritus',
        category: 'Espírito Santo',
        text: `Vinde, Espírito Santo,
enchei os corações dos vossos fiéis
e acendei neles o fogo do vosso amor.
Enviai o vosso Espírito e tudo será criado,
e renovareis a face da terra.

Oremos: Ó Deus, que instruístes os corações dos vossos fiéis com a luz do Espírito Santo, fazei que apreciemos retamente todas as coisas segundo o mesmo Espírito e gozemos sempre da sua consolação. Por Cristo, Senhor nosso.
Amém.`
    },
    {
        id: 'p_veni_creator',
        title: 'Vinde, Espírito Criador (Veni Creator Spiritus)',
        latinTitle: 'Hymnus Veni Creator Spiritus (Rabanus Maurus)',
        category: 'Espírito Santo',
        text: `Vinde, Espírito Criador, as nossas almas visitai,
e enchei os nossos corações com vossos dons celestiais.

Vós sois chamado o Paráclito, do Deus excelso dom sem par,
fonte viva, fogo e caridade, e unção divina e salutar.

Sois doador dos sete dons, da destra de Deus o dedo,
do Pai prometido solene que a nossa boca faz falar.

Iluminai os sentidos e o coração com o vosso amor,
e a nossa carne tão frágil firmai com vosso eterno vigor.

O inimigo para longe expulsai e dai-nos vossa paz sem fim;
sendo Vós o nosso guia, evitemos todo o mal assim.

Fazei-nos conhecer o Pai e também o Filho Salvador,
e em Vós, Espírito de ambos, crer com perene e vivo ardor.

A Deus Pai seja a glória e ao Filho que ressuscitou,
e ao Espírito Paráclito por séculos sem fim.
Amém.`
    },
    {
        id: 'p_sequencia_pentecostes',
        title: 'Sequência de Pentecostes',
        latinTitle: 'Sequentia Pentecostes (Séc. XIII)',
        category: 'Espírito Santo',
        text: `Espírito de Deus, enviai dos céus um raio de luz!
Vinde, Pai dos pobres, dai aos corações vossos dons celestes.
Consolador perfeito, doce hóspede da alma, suave refrigério.
No trabalho sois repouso, no calor sois calma, no pranto consolo.

Ó Luz venturosa, enchei o mais íntimo dos vossos fiéis.
Sem a vossa graça, nada há no homem, nada de inocente.
Lavai o que é impuro, regai o que é seco, sarai o enfermo.
Dobrai o que é duro, abrasai o frio, reconduzi o transviado.

Concedei aos vossos fiéis, que em Vós confiam, os sete dons sagrados.
Dai-lhes o mérito da virtude, o dom da salvação final e a alegria eterna.
Amém. Aleluia.`
    },
    {
        id: 'p_sete_dons',
        title: 'Oração pelos Sete Dons do Espírito Santo',
        latinTitle: 'São Boaventura',
        category: 'Espírito Santo',
        text: `Espírito Santo, Divino Consolador, concedei-me os vossos preciosos dons:
O Dom da Sabedoria, para que eu saboreie as coisas de Deus e ordene toda a minha vida segundo a Sua santa vontade;
O Dom do Entendimento, para que eu compreenda a verdade da Revelação e aprofunde as grandezas do vosso amor;
O Dom do Conselho, para que eu escolha sempre o caminho mais seguro e evite os laços do pecado;
O Dom da Fortaleza, para que eu supere com paciência as tribulações e enfrente corajosamente as adversidades pela fé;
O Dom da Ciência, para que eu veja a mão de Deus na criação e reconheça a vacuidade das coisas passageiras;
O Dom da Piedade, para que eu ame a Deus como terno Pai e trate a todos os homens com caridade fraternal;
O Dom do Temor de Deus, para que eu guarde profundo respeito diante da Majestade divina e tema sobre tudo desagradar ao Seu infinito amor.
Amém.`
    },
    {
        id: 'p_consagracao_espirito_santo',
        title: 'Consagração ao Divino Espírito Santo',
        latinTitle: 'Actus Consecrationis Spiritui Sancto',
        category: 'Espírito Santo',
        text: `Recebei, ó Espírito Santo, a consagração absoluta e perfeita de todo o meu ser, que Vos faço neste dia, para que Vos digneis ser, doravante, em cada um dos meus momentos e em cada uma das minhas ações, o meu Diretor, a minha Luz, a minha Guia, a minha Força e todo o Amor do meu coração.
Eu me abandono sem reserva às vossas divinas inspirações e quero ser-Vos sempre dócil.
Ó Espírito Santo, transformai-me com Maria e em Maria, no modelo perfeitíssimo de Cristo Jesus, para a glória do Pai e a salvação do mundo.
Amém.`
    },
    {
        id: 'p_respirar_espirito',
        title: 'Respiração da Alma no Espírito Santo',
        latinTitle: 'Santo Agostinho de Hipona',
        category: 'Espírito Santo',
        text: `Respirai em mim, ó Espírito Santo, para que todos os meus pensamentos sejam santos.
Atuai em mim, ó Espírito Santo, para que o meu trabalho também seja santo.
Atraí o meu coração, ó Espírito Santo, para que eu ame apenas o que é santo.
Fortalecei-me, ó Espírito Santo, para que eu defenda tudo o que é santo.
Guardai-me, pois, ó Espírito Santo, para que eu nunca perca o que é santo.
Amém.`
    },

    // ==========================================
    // 7. SANTOS & INTERCESSÕES (10)
    // ==========================================
    {
        id: 'p_sao_miguel',
        title: 'Oração a São Miguel Arcanjo',
        latinTitle: 'Sancte Michael Archangele (Papa Leão XIII)',
        category: 'Santos',
        text: `São Miguel Arcanjo, defendei-nos no combate,
sede o nosso refúgio contra as maldades e ciladas do demônio.
Ordene-lhe Deus, instantemente o pedimos,
e vós, príncipe da milícia celeste,
pelo divino poder, precipitai no inferno a Satanás
e aos outros espíritos malignos
que andam pelo mundo para perder as almas.
Amém.`
    },
    {
        id: 'p_sao_jose',
        title: 'Oração a São José (Terror dos Demônios)',
        latinTitle: 'Ad Te, Beate Ioseph (Papa Leão XIII)',
        category: 'Santos',
        text: `A vós, São José, recorremos em nossa tribulação e, depois de ter implorado o auxílio de vossa Santíssima Esposa, cheios de confiança solicitamos também o vosso patrocínio.

Por aquele laço sagrado de caridade que vos uniu à Imaculada Virgem Mãe de Deus, e pelo amor paternal que tivestes ao Menino Jesus, ardentemente vos suplicamos que lanceis um olhar benigno sobre a herança que Jesus Cristo conquistou com o seu Sangue, e nos socorrais em nossas necessidades com o vosso auxílio e poder.

Protegei, ó guarda providente da Sagrada Família, a raça eleita de Jesus Cristo. Afastai para longe de nós, ó pai amantíssimo, todo contágio de erros e corrupções.
Do alto do céu sede-nos propício, ó nosso fortíssimo libertador, na luta contra o poder das trevas.
E assim como outrora salvastes da morte a vida ameaçada do Menino Jesus, defendei agora a Santa Igreja de Deus das ciladas do inimigo e de toda a adversidade.
Amparai a cada um de nós com o vosso perpétuo patrocínio.
Amém.`
    },
    {
        id: 'p_sao_bento',
        title: 'Oração da Cruz de São Bento',
        latinTitle: 'Crux Sacra Sit Mihi Lux',
        category: 'Santos',
        text: `A Cruz Sagrada seja a minha Luz,
não seja o dragão o meu guia.
Retira-te, Satanás!
Nunca me aconselhes coisas vãs.
É mau o que tu me ofereces,
bebe tu mesmo o teu veneno!

(Em latim canônico):
Crux Sacra Sit Mihi Lux!
Non Draco Sit Mihi Dux!
Vade Retro Satana!
Numquam Suade Mihi Vana!
Sunt Mala Quae Libas,
Ipse Venena Bibas!
Amém.`
    },
    {
        id: 'p_sao_francisco',
        title: 'Oração pela Paz (São Francisco de Assis)',
        latinTitle: 'Oratio Pacis Sancti Francisci',
        category: 'Santos',
        text: `Senhor, fazei-me instrumento de vossa paz.
Onde houver ódio, que eu leve o amor;
onde houver ofensa, que eu leve o perdão;
onde houver discórdia, que eu leve a união;
onde houver dúvida, que eu leve a fé;
onde houver erro, que eu leve a verdade;
onde houver desespero, que eu leve a esperança;
onde houver tristeza, que eu leve a alegria;
onde houver trevas, que eu leve a luz.

Ó Mestre, fazei que eu procure mais
consolar que ser consolado;
compreender que ser compreendido;
amar que ser amado.
Pois é dando que se recebe,
é perdoando que se é perdoado,
e é morrendo que se vive para a vida eterna.
Amém.`
    },
    {
        id: 'p_santo_inacio',
        title: 'Suscipe (Tomai, Senhor, e Recebei)',
        latinTitle: 'Suscipe Domine (Santo Inácio de Loyola)',
        category: 'Santos',
        text: `Tomai, Senhor, e recebei
toda a minha liberdade,
a minha memória, o meu entendimento
e toda a minha vontade.
Tudo o que tenho e possuo,
Vós mo destes;
a Vós, Senhor, o restituo.
Tudo é vosso: disponde de tudo
segundo a vossa inteira vontade.
Dai-me apenas o vosso amor e a vossa graça,
pois esta me basta.
Amém.`
    },
    {
        id: 'p_santa_teresa',
        title: 'Nada te Turbe (Santa Teresa de Jesus)',
        latinTitle: 'Santa Teresa d’Ávila (Doutora da Igreja)',
        category: 'Santos',
        text: `Nada te turbe,
nada te espante,
tudo passa:
Deus não muda.

A paciência tudo alcança.
Quem a Deus tem, nada lhe falta:
Só Deus basta!
Amém.`
    },
    {
        id: 'p_padre_pio',
        title: 'Fica Comigo, Senhor',
        latinTitle: 'São Padre Pio de Pietrelcina',
        category: 'Santos',
        text: `Fica comigo, Senhor, porque é necessário ter-Te presente para não Te esquecer. Tu sabes com que facilidade Te abandono.
Fica comigo, Senhor, porque sou fraco e preciso da Tua força para não cair tantas vezes.
Fica comigo, Senhor, porque Tu és a minha vida, e sem Ti esmoreço no fervor.
Fica comigo, Senhor, porque Tu és a minha luz, e sem Ti estou nas trevas.
Fica comigo, Senhor, para me dares a conhecer a Tua vontade.
Fica comigo, Senhor, para que ouça a Tua voz e a siga.
Fica comigo, Senhor, porque desejo amar-Te muito e estar sempre em Tua companhia.

Fica comigo, Jesus, porque, por mais pobre que seja a minha alma, deseja ser para Ti um lugar de consolação e um ninho de amor.
Fica comigo, Jesus, porque se faz tarde e o dia declina... a vida passa, a morte, o juízo e a eternidade se aproximam!
Preciso redobrar as minhas forças para não parar no caminho, e para isso preciso de Ti.
Fica comigo, Jesus, na vida e na morte.
Amém.`
    },
    {
        id: 'p_sao_judas',
        title: 'Oração a São Judas Tadeu',
        latinTitle: 'Padroeiro das Causas Aflitas e Desesperadas',
        category: 'Santos',
        text: `São Judas Tadeu, glorioso Apóstolo, fiel servo e amigo de Jesus:
O nome do traidor tem sido a causa de que sejais esquecido por muitos, mas a Igreja vos honra e invoca universalmente como o patrono dos casos desesperados, das causas sem remédio.

Rogai por mim, que sou tão miserável. Fazei uso, eu vos rogo, desse privilégio particular que vos foi concedido, de trazer alívio visível e pronto onde o socorro é quase impossível.
Vinde em meu auxílio nesta grande necessidade, para que eu possa receber o consolo e o socorro do Céu em todas as minhas tribulações, aflições e sofrimentos, particularmente... (apresente a intenção), e possa louvar a Deus convosco e com todos os eleitos por toda a eternidade.
Eu vos prometo, bendito São Judas, lembrar-me sempre deste grande favor, honrar-vos sempre como meu especial e poderoso padroeiro e com gratidão fomentar a vossa devoção.
São Judas Tadeu, rogai por nós e por todos os que vos invocam.
Amém.`
    },
    {
        id: 'p_santo_antonio',
        title: 'Si Quaeris Miracula (Responsório de Santo Antônio)',
        latinTitle: 'Doutor Evangélico',
        category: 'Santos',
        text: `Se milagres desejais,
recorrei a Santo Antônio;
vereis fugir o demônio
e as tentações infernais.

Recupera-se o perdido,
rompe-se a dura prisão
e no auge do furacão
cede o mar embravecido.

Pela sua intercessão
foge a peste, o erro, a morte,
o fraco torna-se forte
e torna-se são o ferido.

Glória ao Pai, ao Filho e ao Espírito Santo.
Rogai por nós, bem-aventurado Antônio,
para que sejamos dignos das promessas de Cristo.
Amém.`
    },
    {
        id: 'p_charles_foucauld',
        title: 'Oração de Abandono',
        latinTitle: 'São Charles de Foucauld',
        category: 'Santos',
        text: `Meu Pai,
eu me entrego em vossas mãos;
fazei de mim o que for do vosso agrado.
O que de mim fizerdes, eu vos agradeço.
Estou pronto para tudo, aceito tudo,
contanto que a vossa vontade se faça em mim
e em todas as vossas criaturas.
Não desejo outra coisa, meu Deus.

Em vossas mãos entrego a minha alma;
dou-vo-la com todo o amor de que sou capaz,
porque vos amo, ó meu Deus,
e para mim é uma necessidade de amor dar-me,
entregar-me em vossas mãos, sem medida,
com infinita confiança,
porque sois o meu Pai.
Amém.`
    },

    // ==========================================
    // 8. LADAINHAS OFICIAIS (6)
    // ==========================================
    {
        id: 'p_ladainha_lauretana',
        title: 'Ladainha Lauretana (Nossa Senhora)',
        latinTitle: 'Litaniae Lauretanae',
        category: 'Ladainhas',
        text: `Senhor, tende piedade de nós.
Cristo, tende piedade de nós.
Senhor, tende piedade de nós.
Jesus Cristo, ouvi-nos.
Jesus Cristo, atendei-nos.

Deus Pai dos céus, tende piedade de nós.
Deus Filho Redentor do mundo, tende piedade de nós.
Deus Espírito Santo, tende piedade de nós.
Santíssima Trindade, que sois um só Deus, tende piedade de nós.

Santa Maria, rogai por nós.
Santa Mãe de Deus, rogai por nós.
Santa Virgem das virgens, rogai por nós.
Mãe de Cristo, rogai por nós.
Mãe da Igreja, rogai por nós.
Mãe da misericórdia, rogai por nós.
Mãe da divina graça, rogai por nós.
Mãe da esperança, rogai por nós.
Mãe puríssima, rogai por nós.
Mãe castíssima, rogai por nós.
Mãe sempre virgem, rogai por nós.
Mãe imaculada, rogai por nós.
Mãe amável, rogai por nós.
Mãe admirável, rogai por nós.
Mãe do bom conselho, rogai por nós.
Mãe do Criador, rogai por nós.
Mãe do Salvador, rogai por nós.

Virgem prudentíssima, rogai por nós.
Virgem venerável, rogai por nós.
Virgem louvável, rogai por nós.
Virgem poderosa, rogai por nós.
Virgem benigna, rogai por nós.
Virgem fiel, rogai por nós.

Espelho de justiça, rogai por nós.
Sede de sabedoria, rogai por nós.
Causa de nossa alegria, rogai por nós.
Vaso espiritual, rogai por nós.
Vaso honorífico, rogai por nós.
Vaso insigne de devoção, rogai por nós.
Rosa mística, rogai por nós.
Torre de Davi, rogai por nós.
Torre de marfim, rogai por nós.
Casa de ouro, rogai por nós.
Arca da aliança, rogai por nós.
Porta do céu, rogai por nós.
Estrela da manhã, rogai por nós.
Saúde dos enfermos, rogai por nós.
Refúgio dos pecadores, rogai por nós.
Consolo dos migrantes, rogai por nós.
Consoladora dos aflitos, rogai por nós.
Auxílio dos cristãos, rogai por nós.

Rainha dos Anjos, rogai por nós.
Rainha dos Patriarcas, rogai por nós.
Rainha dos Profetas, rogai por nós.
Rainha dos Apóstolos, rogai por nós.
Rainha dos Mártires, rogai por nós.
Rainha dos Confessores, rogai por nós.
Rainha das Virgens, rogai por nós.
Rainha de todos os Santos, rogai por nós.
Rainha concebida sem pecado original, rogai por nós.
Rainha assunta ao céu, rogai por nós.
Rainha do Santo Rosário, rogai por nós.
Rainha da família, rogai por nós.
Rainha da paz, rogai por nós.

Cordeiro de Deus, que tirais os pecados do mundo, perdoai-nos, Senhor.
Cordeiro de Deus, que tirais os pecados do mundo, ouvi-nos, Senhor.
Cordeiro de Deus, que tirais os pecados do mundo, tende piedade de nós.
Rogai por nós, Santa Mãe de Deus, para que sejamos dignos das promessas de Cristo.
Amém.`
    },
    {
        id: 'p_ladainha_sagrado_coracao',
        title: 'Ladainha do Sagrado Coração de Jesus',
        latinTitle: 'Litaniae Sanctissimi Cordis Iesu',
        category: 'Ladainhas',
        text: `Senhor, tende piedade de nós.
Cristo, tende piedade de nós.
Senhor, tende piedade de nós.
Jesus Cristo, ouvi-nos.
Jesus Cristo, atendei-nos.

Coração de Jesus, Filho do Pai Eterno, tende piedade de nós.
Coração de Jesus, formado pelo Espírito Santo no seio da Virgem Mãe, tende piedade de nós.
Coração de Jesus, unido substancialmente ao Verbo de Deus, tende piedade de nós.
Coração de Jesus, de majestade infinita, tende piedade de nós.
Coração de Jesus, templo santo de Deus, tende piedade de nós.
Coração de Jesus, tabernáculo do Altíssimo, tende piedade de nós.
Coração de Jesus, casa de Deus e porta do Céu, tende piedade de nós.
Coração de Jesus, fornalha ardente de caridade, tende piedade de nós.
Coração de Jesus, santuário de justiça e de amor, tende piedade de nós.
Coração de Jesus, cheio de bondade e de amor, tende piedade de nós.
Coração de Jesus, abismo de todas as virtudes, tende piedade de nós.
Coração de Jesus, digníssimo de todo o louvor, tende piedade de nós.
Coração de Jesus, Rei e centro de todos os corações, tende piedade de nós.
Coração de Jesus, no qual estão todos os tesouros da sabedoria e da ciência, tende piedade de nós.
Coração de Jesus, no qual habita toda a plenitude da divindade, tende piedade de nós.
Coração de Jesus, no qual o Pai pôs as suas complacências, tende piedade de nós.
Coração de Jesus, de cuja plenitude todos nós recebemos, tende piedade de nós.
Coração de Jesus, paciente e de muita misericórdia, tende piedade de nós.
Coração de Jesus, rico para todos os que Vos invocam, tende piedade de nós.
Coração de Jesus, fonte de vida e de santidade, tende piedade de nós.
Coração de Jesus, propiciação pelos nossos pecados, tende piedade de nós.
Coração de Jesus, saturado de opróbrios, tende piedade de nós.
Coração de Jesus, esmagado de dor por causa dos nossos crimes, tende piedade de nós.
Coração de Jesus, feito obediente até à morte, tende piedade de nós.
Coração de Jesus, trespassado pela lança, tende piedade de nós.
Coração de Jesus, fonte de toda a consolação, tende piedade de nós.
Coração de Jesus, nossa vida e ressurreição, tende piedade de nós.
Coração de Jesus, nossa paz e reconciliação, tende piedade de nós.
Coração de Jesus, vítima dos pecadores, tende piedade de nós.
Coração de Jesus, salvação dos que em Vós esperam, tende piedade de nós.
Coração de Jesus, esperança dos que morrem em Vós, tende piedade de nós.
Coração de Jesus, delícia de todos os santos, tende piedade de nós.

Cordeiro de Deus, que tirais os pecados do mundo, perdoai-nos, Senhor.
Cordeiro de Deus, que tirais os pecados do mundo, ouvi-nos, Senhor.
Cordeiro de Deus, que tirais os pecados do mundo, tende piedade de nós.
Jesus, manso e humilde de coração, fazei o nosso coração semelhante ao Vosso.
Amém.`
    },
    {
        id: 'p_ladainha_sao_jose',
        title: 'Ladainha de São José',
        latinTitle: 'Litaniae Sancti Ioseph',
        category: 'Ladainhas',
        text: `Senhor, tende piedade de nós.
Cristo, tende piedade de nós.
Senhor, tende piedade de nós.
Jesus Cristo, ouvi-nos.
Jesus Cristo, atendei-nos.

São José, rogai por nós.
Ilustre filho de Davi, rogai por nós.
Luz dos Patriarcas, rogai por nós.
Esposo da Mãe de Deus, rogai por nós.
Casto guarda da Virgem, rogai por nós.
Sustentador do Filho de Deus, rogai por nós.
Zeloso defensor de Cristo, rogai por nós.
Chefe da Sagrada Família, rogai por nós.
José justíssimo, rogai por nós.
José castíssimo, rogai por nós.
José prudentíssimo, rogai por nós.
José fortíssimo, rogai por nós.
José obedientíssimo, rogai por nós.
José fidelíssimo, rogai por nós.
Espelho de paciência, rogai por nós.
Amante da pobreza, rogai por nós.
Modelo dos trabalhadores, rogai por nós.
Honra da vida doméstica, rogai por nós.
Guarda das virgens, rogai por nós.
Sustento das famílias, rogai por nós.
Consolo dos aflitos, rogai por nós.
Esperança dos doentes, rogai por nós.
Padroeiro dos moribundos, rogai por nós.
Terror dos demônios, rogai por nós.
Protetor da Santa Igreja, rogai por nós.

Cordeiro de Deus, que tirais os pecados do mundo, perdoai-nos, Senhor.
Cordeiro de Deus, que tirais os pecados do mundo, ouvi-nos, Senhor.
Cordeiro de Deus, que tirais os pecados do mundo, tende piedade de nós.
Ele o constituiu senhor de sua casa e fê-lo príncipe de todos os seus bens.
Amém.`
    },
    {
        id: 'p_ladainha_nome_jesus',
        title: 'Ladainha do Santíssimo Nome de Jesus',
        latinTitle: 'Litaniae Sanctissimi Nominis Iesu',
        category: 'Ladainhas',
        text: `Senhor, tende piedade de nós.
Cristo, tende piedade de nós.
Senhor, tende piedade de nós.
Jesus, ouvi-nos.
Jesus, atendei-nos.

Jesus, Filho de Deus vivo, tende piedade de nós.
Jesus, esplendor do Pai, tende piedade de nós.
Jesus, pureza da luz eterna, tende piedade de nós.
Jesus, Rei da glória, tende piedade de nós.
Jesus, sol de justiça, tende piedade de nós.
Jesus, Filho da Virgem Maria, tende piedade de nós.
Jesus amável, tende piedade de nós.
Jesus admirável, tende piedade de nós.
Jesus, Deus forte, tende piedade de nós.
Jesus, Pai do século futuro, tende piedade de nós.
Jesus, Anjo do grande conselho, tende piedade de nós.
Jesus poderosíssimo, tende piedade de nós.
Jesus pacientíssimo, tende piedade de nós.
Jesus obedientíssimo, tende piedade de nós.
Jesus, manso e humilde de coração, tende piedade de nós.
Jesus, amante da castidade, tende piedade de nós.
Jesus, nosso amor, tende piedade de nós.
Jesus, Deus da paz, tende piedade de nós.
Jesus, autor da vida, tende piedade de nós.
Jesus, exemplo das virtudes, tende piedade de nós.
Jesus, zelador das almas, tende piedade de nós.
Jesus, nosso Deus, tende piedade de nós.
Jesus, nosso refúgio, tende piedade de nós.
Jesus, Pai dos pobres, tende piedade de nós.
Jesus, tesouro dos fiéis, tende piedade de nós.
Jesus, bom Pastor, tende piedade de nós.
Jesus, luz verdadeira, tende piedade de nós.
Jesus, sabedoria eterna, tende piedade de nós.
Jesus, bondade infinita, tende piedade de nós.
Jesus, nosso caminho e nossa vida, tende piedade de nós.
Jesus, alegria dos Anjos, tende piedade de nós.
Jesus, Rei dos Patriarcas, tende piedade de nós.
Jesus, Mestre dos Apóstolos, tende piedade de nós.
Jesus, Doutor dos Evangelistas, tende piedade de nós.
Jesus, fortaleza dos Mártires, tende piedade de nós.
Jesus, luz dos Confessores, tende piedade de nós.
Jesus, pureza das Virgens, tende piedade de nós.
Jesus, coroa de todos os Santos, tende piedade de nós.

Sede-nos propício, perdoai-nos, Jesus.
Sede-nos propício, ouvi-nos, Jesus.
Pelo mistério da vossa santa Encarnação, livrai-nos, Jesus.
Pela vossa Natividade, livrai-nos, Jesus.
Pela vossa paixão e cruz, livrai-nos, Jesus.
Pela vossa morte e sepultura, livrai-nos, Jesus.
Pela vossa gloriosa Ressurreição e Ascensão, livrai-nos, Jesus.
Pela vossa instituição da santíssima Eucaristia, livrai-nos, Jesus.
Pelas vossas alegrias e pela vossa glória, livrai-nos, Jesus.
Cordeiro de Deus, que tirais os pecados do mundo, perdoai-nos, Jesus.
Cordeiro de Deus, que tirais os pecados do mundo, ouvi-nos, Jesus.
Cordeiro de Deus, que tirais os pecados do mundo, tende piedade de nós, Jesus.
Bendito seja o Nome do Senhor, agora e por todos os séculos!
Amém.`
    },
    {
        id: 'p_ladainha_preciosissimo_sangue',
        title: 'Ladainha do Preciosíssimo Sangue de Jesus',
        latinTitle: 'Litaniae Pretiosissimi Sanguinis D.N.I.C.',
        category: 'Ladainhas',
        text: `Senhor, tende piedade de nós.
Cristo, tende piedade de nós.
Senhor, tende piedade de nós.
Jesus Cristo, ouvi-nos.
Jesus Cristo, atendei-nos.

Sangue de Cristo, Unigênito do Pai Eterno, salvai-nos.
Sangue de Cristo, Verbo de Deus encarnado, salvai-nos.
Sangue de Cristo, da Nova e Eterna Aliança, salvai-nos.
Sangue de Cristo, a escorrer na agonia do Horto, salvai-nos.
Sangue de Cristo, a verter na flagelação, salvai-nos.
Sangue de Cristo, a gotejar na coroação de espinhos, salvai-nos.
Sangue de Cristo, derramado na Cruz, salvai-nos.
Sangue de Cristo, preço da nossa salvação, salvai-nos.
Sangue de Cristo, sem o qual não há remissão, salvai-nos.
Sangue de Cristo, bebida e purificação das almas na Eucaristia, salvai-nos.
Sangue de Cristo, torrente de misericórdia, salvai-nos.
Sangue de Cristo, vencedor dos demônios, salvai-nos.
Sangue de Cristo, fortaleza dos mártires, salvai-nos.
Sangue de Cristo, alento dos confessores, salvai-nos.
Sangue de Cristo, fonte de virgindade, salvai-nos.
Sangue de Cristo, sustento dos que perigam, salvai-nos.
Sangue de Cristo, alívio dos que sofrem, salvai-nos.
Sangue de Cristo, consolo nas lágrimas, salvai-nos.
Sangue de Cristo, esperança dos penitentes, salvai-nos.
Sangue de Cristo, conforto dos moribundos, salvai-nos.
Sangue de Cristo, penhor da vida eterna, salvai-nos.

Remistes-nos, Senhor, com o vosso Sangue, e fizestes de nós um reino para o nosso Deus.
Amém.`
    },
    {
        id: 'p_ladainha_todos_santos',
        title: 'Ladainha de Todos os Santos (Canônica Breve)',
        latinTitle: 'Litaniae Sanctorum',
        category: 'Ladainhas',
        text: `Senhor, tende piedade de nós.
Cristo, tende piedade de nós.
Senhor, tende piedade de nós.

Santa Maria, Mãe de Deus, rogai por nós.
São Miguel, São Gabriel e São Rafael, rogai por nós.
Todos os Santos Anjos de Deus, rogai por nós.
São João Batista, rogai por nós.
São José, rogai por nós.
São Pedro e São Paulo, rogai por nós.
Santo André e São João, rogai por nós.
Santa Maria Madalena, rogai por nós.
Santo Estêvão e São Lourenço, rogai por nós.
Santo Inácio de Antioquia, rogai por nós.
Santa Perpétua e Santa Felicidade, rogai por nós.
Santa Inês e Santa Cecília, rogai por nós.
São Gregório e Santo Agostinho, rogai por nós.
Santo Atanásio e São Basílio, rogai por nós.
São Martinho e São Bento, rogai por nós.
São Francisco e São Domingos, rogai por nós.
Santo Inácio de Loyola e São Francisco Xavier, rogai por nós.
São João Maria Vianney, rogai por nós.
Santa Catarina de Sena e Santa Teresa de Jesus, rogai por nós.
Todos os Santos e Santas de Deus, rogai por nós.

Sede-nos propício, livrai-nos, Senhor.
De todo o mal e de todo o pecado, livrai-nos, Senhor.
Da morte eterna, livrai-nos, Senhor.
Pela vossa Encarnação, pela vossa Morte e Ressurreição, livrai-nos, Senhor.
Pelo envio do Espírito Santo, livrai-nos, Senhor.
Apesar de nossos pecados, ouvi-nos, Senhor.
Para que governeis e conserveis a vossa santa Igreja, ouvi-nos, Senhor.
Para que conserveis no vosso santo serviço o Papa e todos os membros do clero, ouvi-nos, Senhor.
Cristo, ouvi-nos. Cristo, atendei-nos.
Amém.`
    },

    // ==========================================
    // 9. DIA A DIA & VIDA CRISTÃ (8)
    // ==========================================
    {
        id: 'p_oracao_manha',
        title: 'Oração da Manhã (Oferecimento)',
        latinTitle: 'Oratio Matutina',
        category: 'Dia a dia',
        text: `Senhor Deus, Pai de infinita bondade:
Dou-Vos graças por me terdes criado, conservado e guardado nesta noite que passou, trazendo-me à luz de um novo dia.
Ofereço-Vos todos os meus pensamentos, palavras, obras, trabalhos e sofrimentos deste dia, em união com o Sacrifício de Cristo no Calvário e nos altares do mundo inteiro.

Livrai-me hoje de todo pecado, de todo perigo da alma e do corpo, e dai-me a graça de amar e servir a todos os que cruzarem o meu caminho.
Senhor, seja feita em tudo a vossa santa vontade.
Santo Anjo do Senhor, sede a minha guarda.
Amém.`
    },
    {
        id: 'p_oracao_noite',
        title: 'Oração da Noite (Completas)',
        latinTitle: 'Oratio Vespertina (Completas)',
        category: 'Dia a dia',
        text: `Em vossas mãos, Senhor, entrego o meu espírito.
Vós me redimistes, Senhor, Deus da verdade!

Senhor, antes de fechar os olhos no sono reparador, coloco-me em vossa santa presença.
Examino o meu dia: peço perdão por todas as faltas, palavras duras, omissões e fraquezas que cometi.
Agradeço por cada bênção, cada sustento e cada consolo recebido.
Guardai-me, Senhor, como a pupila dos vossos olhos; protegei-me à sombra das vossas asas.
Dignai-Vos conservar-me nesta noite sem pecado.
Repousem em paz os enfermos, os atribulados e as almas do purgatório.
Visite, Senhor, esta habitação e afaste dela todas as ciladas do inimigo.
A vossa santa bênção permaneça sempre conosco.
Em nome do Pai, do Filho e do Espírito Santo.
Amém.`
    },
    {
        id: 'p_nunc_dimittis',
        title: 'Cântico de Simeão (Nunc Dimittis)',
        latinTitle: 'Canticum Simeonis (Lc 2, 29-32)',
        category: 'Dia a dia',
        text: `Agora, Senhor, podeis deixar partir em paz o vosso servo,
segundo a vossa palavra;
porque os meus olhos viram a vossa salvação,
que preparastes diante de todos os povos:
luz para iluminar as nações
e glória de vosso povo, Israel.

Glória ao Pai, ao Filho e ao Espírito Santo.
Como era no princípio, agora e sempre.
Amém.`
    },
    {
        id: 'p_bencao_mesa_antes',
        title: 'Bênção da Mesa antes da Refeição',
        latinTitle: 'Benedictio Mensae',
        category: 'Dia a dia',
        text: `Abençoai-nos, Senhor, a nós e a este alimento que por vossa generosidade vamos tomar.
Dai pão a quem tem fome e fome de justiça a quem tem pão.
Por Cristo, nosso Senhor.
Amém.`
    },
    {
        id: 'p_bencao_mesa_depois',
        title: 'Ação de Graças após a Refeição',
        latinTitle: 'Gratiarum Actio post Mensam',
        category: 'Dia a dia',
        text: `Nós Vos damos graças, Deus Onipotente, por todos os vossos benefícios,
Vós que viveis e reinais pelos séculos dos séculos.
E as almas dos fiéis defuntos, pela misericórdia de Deus, descansem em paz.
Amém.`
    },
    {
        id: 'p_familia_lar',
        title: 'Oração pela Família e pelo Lar',
        latinTitle: 'Benedictio Familiae et Domus',
        category: 'Dia a dia',
        text: `Senhor Deus, Criador de todas as coisas, que instituístes a família humana como santuário de vida e de amor:
Abençoai o nosso lar. Fazei dele uma réplica da Sagrada Família de Nazaré.
Reinem em nossa casa a paz, a pureza, a fidelidade, o respeito mútuo e a caridade que tudo perdoa e supera.

Afastai de nossa família toda divisão, inveja, orgulho e discórdia.
Protegei os nossos pais, filhos e familiares; dai pão com honra às nossas mesas e guiai os nossos corações no caminho dos vossos Mandamentos.
Sagrada Família de Nazaré — Jesus, Maria e José — santificai as nossas famílias!
Amém.`
    },
    {
        id: 'p_trabalho_estudo',
        title: 'Oração pelo Trabalho e Estudos',
        latinTitle: 'Oratio pro Labore et Studiis',
        category: 'Dia a dia',
        text: `Senhor Jesus, que quisestes trabalhar com vossas próprias mãos na oficina de Nazaré, santificando o suor e o trabalho humano:
Consagro a Vós o meu estudo, a minha profissão e as tarefas que hoje tenho de realizar.
Dai-me inteligência para aprender, diligência para executar com zelo e paciência para vencer as dificuldades.

Não permitais que a soberba ou a preguiça me dominem, mas que todo o meu esforço seja feito com retidão de intenção, para servir ao meu próximo e dar glória ao Vosso Santo Nome.
São José Operário, rogai por nós.
Amém.`
    },
    {
        id: 'p_requiem_aeternam',
        title: 'Oração pelos Fiéis Defuntos (Requiem)',
        latinTitle: 'Requiem Aeternam',
        category: 'Dia a dia',
        text: `Dai-lhes, Senhor, o repouso eterno,
e brilhe para eles a vossa luz perpétua!
Descansem em paz.
Amém.

Oremos: Deus, Criador e Redentor de todos os fiéis, concedei às almas de todos os fiéis defuntos a remissão de todos os seus pecados, para que obtenham, pelas nossas piedosas súplicas, a indulgência que sempre desejaram. Vós que viveis e reinais pelos séculos dos séculos.
Amém.`
    },

    // ==========================================
    // 10. GRANDES DEVOÇÕES (7)
    // ==========================================
    {
        id: 'p_ato_desagravo_sagrado_coracao',
        title: 'Ato de Desagravo ao Sagrado Coração',
        latinTitle: 'Actus Reparationis (Papa Pio XI)',
        category: 'Grandes Devoções',
        text: `Dulcíssimo Jesus, cuja infinita caridade para com os homens é tão ingratamente correspondida pelo esquecimento, negligência e desprezo:
Eis-nos aqui prostrados diante do vosso altar, com o desejo de desagravar, com especiais homenagens, a tão criminosa tibieza e as ofensas com que os homens ultrajam em toda a parte o vosso amantíssimo Coração.

Lembrados, porém, de que nós mesmos tantas vezes nos manchamos com semelhante indignidade, imploramos antes de tudo a vossa misericórdia para com as nossas almas.
Queremos reparar, com voluntária penitência, não só os nossos pecados, mas também os daqueles que, errando longe do caminho da salvação, recusam seguir-Vos como Pastor e Guia.

Recebei, ó benigníssimo Jesus, pela intercessão da Bem-Aventurada Virgem Maria Reparadora, a homenagem espontânea do nosso desagravo; e guardai-nos fiéis até à morte no vosso santo serviço, para que alcancemos todos aquela pátria celeste onde, com o Pai e o Espírito Santo, viveis e reinais por todos os séculos dos séculos.
Amém.`
    },
    {
        id: 'p_consagracao_imaculado_coracao',
        title: 'Consagração ao Imaculado Coração de Maria',
        latinTitle: 'Fátima',
        category: 'Grandes Devoções',
        text: `Ó Virgem Maria, Mãe de Deus e nossa Mãe amantíssima:
Ao vosso Imaculado Coração nós nos consagramos em filial amor e total dedicação.
Por esta consagração, nós nos propomos a viver como verdadeiros filhos de Deus, obedientes aos ensinamentos de Jesus e da Santa Igreja.

Queremos oferecer reparação pelos ultrajes, indiferenças e ofensas que ferem o Vosso Coração Materno e o Sagrado Coração de Jesus.
Prometemos rezar diariamente o Santo Rosário, acolher com fervor os Sacramentos da Confissão e da Eucaristia nos Primeiros Sábados, e oferecer sacrifícios pela conversão dos pecadores.
Guiai a nossa vida no meio das provações deste mundo e conduzi-nos com segurança ao porto da salvação eterna.
Coração Imaculado de Maria, sede a nossa salvação!
Amém.`
    },
    {
        id: 'p_oracao_santa_cruz',
        title: 'Oração à Santa Cruz de Cristo',
        latinTitle: 'Adoratio Sanctae Crucis',
        category: 'Grandes Devoções',
        text: `Nós Vos adoramos, Senhor Jesus Cristo, e Vos bendizemos,
porque pela vossa Santa Cruz remistes o mundo!

Deus Todo-Poderoso, que sofrestes a morte sobre o madeiro sagrado da Cruz por todos os nossos pecados:
Sede comigo, Santa Cruz de Jesus Cristo, derramai sobre mim toda a vossa bênção.
Santa Cruz de Jesus Cristo, afastai de mim todo o mal e todo temor.
Santa Cruz de Jesus Cristo, fazei que eu siga o caminho da salvação e da graça.
Jesus de Nazaré crucificado, tende piedade de mim.
Em nome do Pai, do Filho e do Espírito Santo.
Amém.`
    },
    {
        id: 'p_sete_dores_maria',
        title: 'As Sete Dores de Nossa Senhora',
        latinTitle: 'Septem Dolores B.M.V.',
        category: 'Grandes Devoções',
        text: `Virgem Dolorosíssima, Mãe de Jesus e nossa Mãe:
Recordamos com profunda compaixão as Sete Dores que traspassaram a vossa alma pura:
1ª Dor: A profecia do santo velho Simeão no Templo;
2ª Dor: A fuga precipitada para o Egito diante da perseguição de Herodes;
3ª Dor: A perda do Menino Jesus durante três dias em Jerusalém;
4ª Dor: O doloroso encontro com vosso Filho carregando a pesada Cruz rumo ao Calvário;
5ª Dor: A crucifixão, agonia e morte de Jesus na Cruz;
6ª Dor: A descida da Cruz e o Corpo sem vida de Jesus depositado em vossos braços maternos;
7ª Dor: O sepultamento de Jesus e a vossa imensa solidão.

Por todas essas vossas dores indizíveis, alcançai-nos uma verdadeira contrição dos nossos pecados, a pureza de coração e a graça de vos consolar em todas as nossas cruzes diárias.
Nossa Senhora das Dores, rogai por nós!
Amém.`
    },
    {
        id: 'p_jesus_crucificado',
        title: 'Oração diante de Jesus Crucificado',
        latinTitle: 'En ego, o bone et dulcissime Iesu',
        category: 'Grandes Devoções',
        text: `Eis-me aqui, ó bom e dulcíssimo Jesus!
De joelhos me prostro em vossa presença e vos suplico, com o mais vivo fervor, que imprimais em meu coração sentimentos de fé, esperança e caridade, verdadeiro arrependimento dos meus pecados e propósito firme de nunca mais vos ofender.
Enquanto isso, considero em mim mesmo e contemplo em espírito com grande afeto e dor as vossas cinco chagas, tendo diante dos olhos o que já de vós disse o profeta Davi:
"Trespassaram minhas mãos e meus pés; contaram todos os meus ossos."
Amém.`
    },
    {
        id: 'p_coroinha_sao_miguel',
        title: 'Coroinha Angélica de São Miguel Arcanjo',
        latinTitle: 'Corona Angelica Sancti Michaelis',
        category: 'Grandes Devoções',
        text: `Deus, vinde em meu auxílio; Senhor, apressai-vos em me socorrer.
Glória ao Pai, ao Filho e ao Espírito Santo...

Pela intercessão de São Miguel e do Coro Celeste dos Serafins, o Senhor nos faça dignos do fogo da perfeita caridade.
Pela intercessão de São Miguel e do Coro Celeste dos Querubins, o Senhor nos conceda a graça de abandonar o caminho do pecado.
Pela intercessão de São Miguel e do Coro Celeste dos Tronos, o Senhor derrame em nossos corações o espírito da verdadeira humildade.
Pela intercessão de São Miguel e do Coro Celeste das Dominações, o Senhor nos dê a graça de dominar os sentidos e vencer as paixões.
Pela intercessão de São Miguel e do Coro Celeste das Potestades, o Senhor proteja as nossas almas contra as ciladas do demônio.
Pela intercessão de São Miguel e do Coro Celeste das Virtudes, o Senhor nos livre do mal e não nos deixe cair em tentação.
Pela intercessão de São Miguel e do Coro Celeste dos Principados, o Senhor encha as nossas almas do espírito da verdadeira obediência.
Pela intercessão de São Miguel e do Coro Celeste dos Arcanjos, o Senhor nos conceda a perseverança na fé e nas boas obras.
Pela intercessão de São Miguel e do Coro Celeste dos Anjos, o Senhor nos conceda sermos guardados por eles nesta vida e conduzidos à glória eterna.
Amém.`
    },
    {
        id: 'p_oracao_jubileu',
        title: 'Oração dos Peregrinos da Esperança',
        latinTitle: 'Oratio Peregrini Spei',
        category: 'Grandes Devoções',
        text: `Pai que estás nos céus,
a fé que nos deste no teu Filho Jesus Cristo, nosso irmão,
e a chama da caridade derramada nos nossos corações pelo Espírito Santo
despertem em nós a bem-aventurada esperança na vinda do teu Reino.

A tua graça nos transforme em cultivadores diligentes das sementes evangélicas
que fermentem a humanidade e o cosmos,
na espera confiante dos novos céus e da nova terra.
A luz da esperança cristã alcance cada homem e mulher,
como mensagem do teu amor dirigido a todos,
e a Igreja testemunhe com alegria a beleza do Evangelho.
Por Cristo, nosso Senhor.
Amém.`
    }
];

console.log('Total canonical prayers prepared:', canonicalPrayers.length);
const categoriesCount = {};
canonicalPrayers.forEach(p => {
    categoriesCount[p.category] = (categoriesCount[p.category] || 0) + 1;
});
console.log('Distribution across categories:', categoriesCount);

// Save JSON for injection
fs.writeFileSync('D:/Catecismo/data/canonical_prayers.json', JSON.stringify(canonicalPrayers, null, 2), 'utf8');
console.log('Successfully saved to D:/Catecismo/data/canonical_prayers.json');
