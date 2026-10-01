const body = {
  title: 'Grande Atualização Devocional: Guia Canônico de Lectio Divina, Novas Novenas da Igreja, Tesouros da Tradição e Santos Enriquecidos',
  tag: 'Novidades & Espiritualidade',
  sender: 'Coordenação Geral — Catecismo Católico',
  content: `Paz e bem a todos os irmãos e fiéis da nossa comunidade!

Temos a imensa alegria de entregar uma grande atualização espiritual no Catecismo Católico, enriquecendo a nossa plataforma com preciosos tesouros da Tradição e do Magistério da Santa Igreja:

1. 📖 Guia Interativo de Lectio Divina (Leitura Orante Diária):
A seção 'Oração & Lectio' foi totalmente renovada com o método canônico dos 4 passos tradicionais baseados no Evangelho do Dia:
• 1. Lectio: Leitura atenta e reverente da Palavra de Deus com chave de compreensão;
• 2. Meditatio: Perguntas guiadas de reflexão para tocar o coração e a vida concreta;
• 3. Oratio: Diálogo filial e oração inspirada na proclamação do dia;
• 4. Contemplatio & Actio: Momento de silêncio na presença do Senhor e formulação do propósito prático para o dia, gravado diretamente no seu Diário Espiritual.
Além disso, a Liturgia Diária agora conta com acesso direto para meditar o Evangelho com um único toque!

2. 🌹 5 Novas Grandes Novenas Católicas (Total de 20 Novenas Canônicas):
Expandimos o nosso acervo de novenas tradicionais dos 9 dias com devoções centrais da piedade católica:
• Santa Rita de Cássia (Padroeira das Causas Impossíveis e Desesperadas);
• Sagrado Coração de Jesus (Novena de Confiança Irrestrita e Reparação);
• Nossa Senhora de Fátima (Mensagem da Cova da Iria e Reparação ao Imaculado Coração);
• São Peregrino Laziosi (Patrono e Protetor especial contra o Câncer e Doenças Graves);
• Nossa Senhora das Graças e da Medalha Milagrosa (As Graças da Imaculada da Rue du Bac).

3. 📜 Devocionário Tradicional Ampliado (28 Orações e Ladainhas):
Adicionamos orações veneráveis da Tradição Católica à nossa Biblioteca de Orações:
• A Via-Sacra Completa (as 14 Estações da Paixão do Senhor com meditações);
• O Ofício da Imaculada Conceição (todas as horas canônicas completas);
• O Angelus Domini e o Regina Caeli (para saudar a Virgem Maria ao longo do dia);
• As Ladainhas Maiores: Ladainha Lauretana, Ladainha do Sagrado Coração e Ladainha de São José;
• A Oração a São Miguel Arcanjo (Papa Leão XIII) e a Oração da Medalha de São Bento;
• O hino solene Te Deum e o Tantum Ergo (Bênção do Santíssimo Sacramento).

4. 👑 Santos do Dia com Biografias Aprofundadas e Orações Canônicas:
Aprofundamos o acervo hagiográfico dos Santos do Dia com biografias detalhadas, virtudes, patronatos e as orações oficiais da Igreja.

Que estes recursos alimentem a sua alma, fortaleçam a sua família e renovem diariamente o seu amor a Nosso Senhor Jesus Cristo e à Virgem Maria!`
};

const res = await fetch('http://localhost:3000/api/admin/broadcasts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});

const json = await res.json();
console.log('Resultado da publicação do comunicado:', json);
