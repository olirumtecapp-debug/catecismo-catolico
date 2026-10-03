# Prompt para o Antigravity — Melhorias locais do Catecismo

## Regra principal: trabalhar somente no ambiente local

Você deve trabalhar **exclusivamente no projeto local**, acessado por:

```text
http://localhost:3000/
```

O site publicado é apenas referência visual e funcional:

```text
https://catecismo.creativeam.com.br/
```

## Proibição de alteração em produção

**Não faça deploy, publicação, push, alteração de domínio, alteração de banco remoto ou qualquer mudança em `https://catecismo.creativeam.com.br/` nesta etapa.**

As melhorias devem ser desenvolvidas, testadas e revisadas localmente antes de qualquer decisão de publicação.

Se o ambiente local não estiver disponível, não altere a produção para compensar. Informe o bloqueio e aguarde instruções.

# Contexto do projeto

O site é uma plataforma católica gratuita para:

- liturgia diária;
- Bíblia Sagrada;
- Catecismo e doutrina;
- orações;
- santos e intenções;
- novenas;
- diário espiritual;
- quizzes;
- planos de estudo;
- progresso e conquistas;
- favoritos;
- compartilhamento;
- salvamento de progresso na nuvem;
- Escola da Fé.

A monetização é feita por **apoio voluntário**, via PIX, para ajudar a manter servidores, acervos e ferramentas do projeto.

## Objetivo geral

Melhorar a experiência para que:

1. uma pessoa nova entenda rapidamente o que pode fazer;
2. o usuário consiga iniciar uma prática de fé em poucos segundos;
3. o site incentive o retorno diário sem pressão;
4. o cadastro por e-mail tenha uma justificativa clara;
5. o pedido de apoio seja sutil, transparente e contextual;
6. o conteúdo continue gratuito;
7. não haja anúncios invasivos;
8. o produto não se torne um sistema complexo ou difícil de manter.

# Diretrizes obrigatórias de simplicidade

- Não criar microsserviços.
- Não fazer refatoração ampla sem necessidade.
- Não criar um sistema complexo de CRM, marketing ou automação.
- Não criar cobrança recorrente.
- Não bloquear conteúdo religioso por falta de apoio.
- Não obrigar cadastro antes de entregar valor.
- Não abrir modal de apoio automaticamente na primeira visita.
- Não adicionar dezenas de configurações.
- Não substituir o layout atual inteiro sem necessidade.
- Preservar os recursos e dados que já funcionam.
- Preferir pequenas melhorias de UX e textos claros.
- Usar componentes e estilos já existentes no projeto.
- Implementar primeiro o essencial e deixar melhorias opcionais separadas.

# Fase 1 — Melhorar o primeiro acesso

Na tela inicial, reduzir a sensação de excesso de opções sem remover os recursos existentes.

## Destaques principais

Dar prioridade visual a três ações:

1. **Liturgia de hoje**;
2. **Continuar de onde parei**;
3. **Rezar por uma intenção**.

Manter os demais recursos no menu e nas seções existentes:

- Bíblia;
- Catecismo;
- Santos;
- Novenas;
- Diário;
- Quizzes;
- Progresso;
- Conquistas;
- Favoritos;
- Escola da Fé;
- Nuvem;
- Pesquisa.

## Mensagem para novos usuários

Se não houver progresso, evitar destacar apenas “Catecismo 0%”. Preferir:

```text
Comece sua jornada de fé
```

ou:

```text
Primeiro passo: conhecer os fundamentos da fé
```

O botão pode continuar levando ao Catecismo, mas a linguagem deve acolher e orientar.

## Orientação inicial simples

Se for possível sem criar um tutorial complexo, mostrar uma pequena orientação:

```text
O que você deseja fazer agora?

Rezar por uma intenção
Acessar a liturgia de hoje
Começar o Catecismo
Fazer uma novena
```

Essa orientação deve ser discreta, dispensável e não reaparecer de forma insistente.

# Fase 2 — Melhorar o retorno diário

A plataforma já possui jornada, XP, novenas e progresso. Usar esses recursos sem transformar a experiência em uma competição.

Implementar ou ajustar apenas mensagens simples:

- “Continue de onde parou”;
- “Dia 2 de 9”;
- “Sua próxima oração está pronta”;
- “Volte amanhã para continuar sua jornada de fé”;
- “Você completou esta etapa.”

Priorizar:

- liturgia diária;
- novena em andamento;
- última oração acessada;
- último capítulo ou plano de estudo;
- intenção salva.

Evitar gamificação exagerada, rankings, notificações invasivas ou excesso de medalhas.

# Fase 3 — Cadastro e nuvem

O salvamento por e-mail deve continuar opcional e simples.

## Texto recomendado

No modal da Nuvem, usar linguagem semelhante a:

```text
Quer continuar de onde parou?

Salve seu progresso, orações e reflexões para não perder nada ao trocar de aparelho.

Digite apenas seu e-mail. Não é necessário criar uma senha complexa.
```

Botões:

```text
Salvar e sincronizar
Já possui dados salvos? Restaurar
Continuar sem nuvem
```

## Transparência mínima

Adicionar uma pequena explicação, sem criar fluxo burocrático:

```text
Seu e-mail é usado apenas para localizar e sincronizar seu progresso. Não vendemos seus dados.
```

Se já houver uma Política de Privacidade, adicionar link visível. Caso não exista, criar apenas uma página simples ou seção com:

- quais dados são salvos;
- finalidade;
- como solicitar exclusão;
- contato do projeto.

Não pedir mais dados do que o necessário.

# Fase 4 — Melhorar mensagens de carregamento

Substituir mensagens técnicas ou frias quando possível.

Em vez de:

```text
Aguardando API…
Carregando santo do dia…
Consultando a fonte litúrgica…
Preparando as conexões de hoje…
```

Preferir mensagens acolhedoras:

```text
Estamos preparando a liturgia de hoje.

Você já pode continuar sua oração ou abrir o Catecismo.
```

ou:

```text
Estamos carregando o conteúdo do dia. Obrigado por aguardar.
```

Sempre que possível, oferecer um conteúdo alternativo ou botão útil caso a API demore.

Não deixar a tela parecer quebrada ou vazia.

# Fase 5 — Apoio voluntário ao projeto

O apoio deve ser apresentado de forma sutil, honesta e não invasiva.

## Princípios

- O conteúdo continua gratuito.
- O apoio não é obrigatório.
- Não condicionar oração, leitura, progresso ou recursos básicos ao pagamento.
- Não abrir o modal automaticamente no primeiro acesso.
- Não usar linguagem de culpa ou pressão religiosa.
- Não criar cobrança recorrente.
- Não enviar mensagens de cobrança.
- Manter PIX e valores transparentes.

## Botão permanente

Manter no menu ou rodapé:

```text
Apoiar o projeto
```

O botão pode continuar aparecendo no cabeçalho, mas deve ser visualmente secundário em relação ao conteúdo principal.

## Texto principal do modal

Usar uma versão semelhante a:

```text
Apoie o Catecismo

O Catecismo é gratuito, sem anúncios invasivos e mantido de forma independente.

Se este conteúdo ajudou sua caminhada de fé, você pode contribuir voluntariamente para manter os servidores, os acervos e as ferramentas funcionando.

Qualquer valor ajuda. O apoio não é obrigatório.
```

## Opções de apoio

Manter valores simples:

```text
Um cafezinho — R$ 5
Um lanche — R$ 10
Um apoio maior — R$ 15
Escolher outro valor
```

Pode manter a ideia de “Pagar um Cafezinho”, “Pão na Chapa com Pingado” e “Misto Quente”, mas o texto principal deve explicar que se trata de apoio voluntário ao projeto.

## Momento adequado para sugerir apoio

Priorizar chamadas contextuais, sem interrupção automática:

- após concluir uma oração;
- após terminar um dia de novena;
- após responder um quiz;
- depois de alguns acessos;
- após salvar uma reflexão;
- após completar uma sequência de 7 dias;
- quando o usuário clicar em compartilhar.

A chamada pode ser um pequeno card ou texto discreto:

```text
Gostou desta experiência?

O projeto é mantido por apoio voluntário. Se desejar, conheça as formas de apoiar.
```

Botões:

```text
Conhecer formas de apoio
Agora não
```

## Frequência

Implementar controle simples para não incomodar:

- não mostrar a sugestão mais de uma vez a cada 30 dias após fechamento;
- após apoio, não mostrar novamente por pelo menos 90 dias;
- não interromper oração, leitura ou navegação principal;
- manter o botão permanente no menu/rodapé.

Se já existir algum controle de exibição, reutilizá-lo.

## Favorecido e transparência

No modal de apoio, manter o favorecido informado de forma clara:

```text
Favorecido responsável pelo projeto: Murilo Ferreira Silva
Processamento seguro via Asaas PIX
```

Adicionar link para uma área simples de transparência com:

- quem mantém o projeto;
- para que servem os apoios;
- hospedagem e servidores;
- acervos e manutenção;
- contato;
- política de privacidade.

Não afirmar que o apoio é dedutível, institucional ou beneficente se isso não tiver comprovação legal.

# Fase 6 — Divulgação para cadastrados e novos usuários

Criar, se fizer sentido, textos reutilizáveis na área de contato/compartilhamento, sem disparar automaticamente.

## Mensagem para usuários já cadastrados

```text
Paz e bem!

O Catecismo recebeu novos recursos de oração, liturgia, novenas e formação.

Acesse gratuitamente e continue sua jornada de fé:
https://catecismo.creativeam.com.br/

Se o projeto ajudar você, compartilhe com alguém que também possa se beneficiar.
```

Não começar a comunicação pedindo dinheiro.

## Texto para novos usuários

```text
Uma companhia diária para sua vida de fé

Liturgia, Bíblia, Catecismo, orações, santos e novenas em um só lugar.

Comece gratuitamente, sem anúncios invasivos.
```

Depois da pessoa conhecer o conteúdo, o apoio pode ser apresentado como voluntário.

Não enviar mensagens reais durante o desenvolvimento local.

# Fase 7 — Métricas simples

Não criar uma plataforma complexa de analytics.

Se já existir estrutura para métricas, acompanhar apenas:

- acessos;
- retorno em 7 dias;
- início de oração;
- início de novena;
- salvamento de e-mail;
- compartilhamento;
- abertura do modal de apoio;
- clique em apoiar;
- conclusão de apoio.

O indicador principal deve ser:

```text
A pessoa voltou e usou novamente?
```

Não registrar dados pessoais desnecessários.

# Fase 8 — Revisão visual e responsiva

Testar localmente em:

- desktop;
- celular estreito;
- tablet, se já houver suporte.

Confirmar:

- botão Apoiar não cobre conteúdo;
- modal cabe na tela do celular;
- PIX Copia e Cola continua copiável;
- valores aparecem corretamente;
- textos não ficam cortados;
- menu continua simples;
- foco de teclado funciona;
- contraste e tamanho de fonte permanecem adequados;
- fechar modal é fácil;
- “Agora não” não parece uma punição.

# Critérios de aceite

Considerar a implementação local aprovada somente se:

1. o projeto continuar funcionando em `http://localhost:3000/`;
2. a versão publicada não tiver sido alterada;
3. recursos existentes continuarem acessíveis;
4. o primeiro acesso ficar mais claro;
5. o usuário puder começar sem cadastro;
6. a nuvem continuar opcional;
7. o apoio aparecer de forma voluntária e sutil;
8. nenhum conteúdo ficar bloqueado por falta de apoio;
9. o modal não aparecer repetidamente;
10. o PIX continuar funcionando em modo local/teste sem pagamento real;
11. mensagens de carregamento ficarem mais acolhedoras;
12. a experiência funcionar no celular;
13. não houver erros no console ou falhas de navegação;
14. não houver novas estruturas difíceis de manter.

# Testes locais obrigatórios

Executar no ambiente local:

1. abrir a home sem dados;
2. iniciar liturgia, Catecismo, oração e novena;
3. verificar “continuar de onde parei”;
4. abrir e fechar modal de nuvem;
5. fechar sem cadastro;
6. abrir Apoiar;
7. trocar entre R$ 5, R$ 10 e R$ 15;
8. verificar atualização do QR Code e do PIX Copia e Cola, sem pagar;
9. fechar o modal;
10. simular uma ação de valor e verificar a chamada sutil de apoio;
11. confirmar que a chamada não reaparece imediatamente;
12. testar no celular;
13. recarregar a página;
14. confirmar que não há perda indevida de progresso local;
15. confirmar que nenhuma requisição real de envio ou cobrança foi executada.

# Entrega obrigatória

Ao concluir, informe:

1. arquivos alterados;
2. mudanças feitas no primeiro acesso;
3. mudanças feitas no cadastro/nuvem;
4. mudanças feitas no apoio;
5. mudanças feitas nas mensagens de carregamento;
6. testes locais executados;
7. teste responsivo executado;
8. confirmação de que a produção não foi alterada;
9. problemas ainda pendentes;
10. sugestões opcionais que ficaram fora da primeira implementação.

Retornar:

```text
STATUS LOCAL: APROVADO
```

ou

```text
STATUS LOCAL: NÃO APROVADO
```

Não publicar nada. A publicação só será autorizada em uma etapa posterior, após revisão do ambiente local.
