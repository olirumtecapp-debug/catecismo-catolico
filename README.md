# CATECISMO — camada local de dados

Esta pasta inicia a migração do aplicativo para uma arquitetura de dados locais.

## Fontes verificadas

- Bíblia: `Dancrf/biblia-db` — Bíblia Católica em português, tradução de 1956 de Padre Manuel de Matos Soares. O repositório disponibiliza `biblia.json`, livros separados em `antigotestamento` e `novotestamento` e `listalivros.json`.
- Liturgia: `Dancrf/liturgia-diaria` — API de orações e leituras da Santa Missa. A documentação atual informa v2 como estável e v3 como beta, com suporte a múltiplas celebrações e leituras em array.
- Liturgia alternativa: `JosueSantos/api_liturgia_diaria` — API que recebe `?date=AAAA-MM-DD` e informa como fontes Sagrada Liturgia e Canção Nova.
- Santo do Dia: `https://api-liturgia-diaria.vercel.app/santo-do-dia` — endpoint em português. Importante: esta rota não aceita uma data histórica; ela representa o conteúdo atual retornado pela fonte. Portanto, ela não será tratada como banco histórico por data.

## Objetivo

O site deverá consumir arquivos locais para as telas normais, usando APIs apenas no processo de atualização/ingestão.

Estrutura:

- `data/biblia/` — Bíblia local
- `data/liturgia/` — liturgia normalizada por data
- `data/santos/` — santos/celebrações normalizados por data, quando houver fonte histórica adequada
- `data/catecismo/` — conteúdo pedagógico e referências

## Licenciamento

Não assumir que um repositório público concede automaticamente direito de redistribuir todo o conteúdo. O processo registra a origem de cada conjunto. Antes de publicar qualquer texto integral de terceiro, revisar a licença/direitos da obra e da tradução.

## Próxima etapa

Executar o script de ingestão da Bíblia e, separadamente, o script de ingestão da liturgia para os anos desejados. O Santo do Dia histórico deve ser abastecido somente depois de escolher uma fonte que aceite consulta por data ou disponibilize arquivo histórico.
