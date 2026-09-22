import { saveBroadcastToDatabase, getBroadcastsDatabase } from '../api/_db.js';

const novoComunicado = {
  id: 'b_' + Date.now(),
  sender: 'Coordenação Geral — Catecismo Católico',
  tag: 'Novidades & Atualizações',
  title: 'Novidades: Orações por Intenção com Santos Padroeiros, Novenas e Novo Layout da Home',
  date: '2026-09-22',
  content: `Paz e bem a todos os irmãos e fiéis da nossa comunidade!

Temos a imensa alegria de anunciar uma grande atualização espiritual e visual em nossa plataforma, pensada com muito zelo para acolher as suas intenções e necessidades diárias de oração:

1. 🙏 Novo Módulo: Orações por Intenção & Santos Padroeiros:
Agora você encontra um devocionário completo organizado pela sua necessidade imediata (material ou espiritual). São 23 causas canônicas oficiais da Santa Igreja, categorizadas diretamente pela dor e busca do fiel:
• 💼 Emprego & Sustento Digno (São José Operário)
• 💰 Dívidas & Crises Financeiras (Santa Edwiges)
• 🌧️ Depressão, Ansiedade & Angústia da Alma (Santa Teresa d'Ávila)
• 🕊️ Paz Interior & Serenidade (São Francisco de Assis)
• 👨‍👩‍👧‍👦 Família, Harmonia e Bênção do Lar (São José)
• 👨‍👩‍👧‍👦 Reconciliação Familiar (Santo Antônio de Pádua)
• ⚖️ Causas Impossíveis e Milagres (Santa Rita de Cáscia)
• ⚖️ Causas Perdidas e Desesperadas (São Judas Tadeu)
• 🛡️ Proteção Espiritual contra o Inimigo (São Miguel Arcanjo)
• 🛡️ Libertação e Santa Cruz (São Bento)
• 🌿 Saúde do Corpo e da Alma (São Rafael Arcanjo)
• 🌿 Enfermos Graves e Hospitalizados (São Camilo de Lellis)
• 🌿 Proteção da Garganta e Respiração (São Brás)
• 🕊️ Conversão de Filhos e Familiares (Santa Mônica)
• 🕊️ Conversão Pessoal e Superação de Vícios (Santo Agostinho)
• 💍 Namoro Santo e Discernimento Matrimonial (Santo Antônio)
• 💍 Proteção do Casal e Fidelidade (São Rafael)
• ⚡ Causas Urgentes de Última Hora (Santo Expedito)
• ⚡ Desatar Nós Difíceis (Nossa Senhora Desatadora dos Nós)
• ❤️ Ação de Graças por Graça Alcançada (Sagrado Coração de Jesus)
• ❤️ Confiança Total na Providência (Padre Pio)
• 🕯️ Exame Noturno de Consciência em 5 Passos (Santo Inácio de Loyola)
• 🕯️ Arrependimento e Preparação para Boa Confissão (Cura d'Ars)

Cada intenção traz a oração canônica oficial, a fonte histórica/pontifícia, a jaculatória e a explicação de por que aquele Santo é o intercessor da causa.

2. 🎨 Obras Sacras em Alta Resolução da Base dos Santos:
Todas as orações estão ilustradas com as autênticas pinturas e artes sacras em alta definição da nossa galeria de santos, enriquecendo o recolhimento orante.

3. 🌹 Novenas Católicas (Devoção dos 9 Dias):
Acompanhe e reze as grandes novenas da Igreja com persistência diária dos dias rezados e acompanhamento do progresso.

4. 📱 Novo Layout da Tela Inicial (Home) Perfeitamente Alinhado:
A tela inicial foi refinada com harmonia visual: agora a Liturgia de Hoje, os Santos do Dia e as Novenas Católicas formam uma única fileira simétrica de 3 cards lado a lado, com a mesma altura e botões perfeitamente nivelados. Além disso, adicionamos atalhos rápidos com 1 clique para você rezar imediatamente pela sua necessidade mais urgente (Emprego, Depressão, Família, Causas Impossíveis, Proteção e Saúde).

Que o Bom Deus abençoe ricamente a sua vida, a sua família e a sua caminhada de fé!`,
  createdAt: new Date().toISOString()
};

async function main() {
  console.log('Gravando comunicado no banco de dados...');
  const ok = await saveBroadcastToDatabase(novoComunicado);
  console.log('Resultado da gravação:', ok ? '✅ Sucesso!' : '❌ Falhou!');

  const db = await getBroadcastsDatabase();
  console.log(`Total de comunicados no banco: ${db.broadcasts.length}`);
  console.log(`Comunicado mais recente: "${db.broadcasts[0].title}"`);
}

main().catch(console.error);
