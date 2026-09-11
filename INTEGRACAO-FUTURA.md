# Integração futura do site

1. O JavaScript do site deverá consumir `/data/biblia/*.json` para leitura bíblica.
2. O módulo Liturgia deverá consumir `/data/liturgia/YYYY/YYYY-MM-DD.json`.
3. A UI não deve calcular a celebração do dia quando existir registro local da data.
4. Requisições externas serão usadas somente por um processo de atualização/ingestão, não pelo fluxo normal do usuário.
5. O Santo do Dia só será convertido para banco local histórico depois de adotada uma fonte que realmente permita consultar a data histórica.
