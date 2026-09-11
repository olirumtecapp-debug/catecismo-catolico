# Automação — Santos do Dia

Esta etapa cria uma base local de Santos do Dia usando o Portal A12 como fonte de perfis. O projeto fonte de uma API pública de exemplo documenta os seletores e a origem A12; a página do A12 também permite consultar o santo por dia/mês.

## Instalação

Na raiz de D:\Catecismo:

```powershell
npm install cheerio
```

## Teste inicial

Antes de gerar 365 dias, teste uma única data:

```powershell
node .\scripts\build-santos.mjs 2026 --date 2026-09-10
```

Depois:

```powershell
node .\scripts\verificar-santos.mjs 2026
```

## Geração do ano

```powershell
node .\scripts\build-santos.mjs 2026
```

A atualização automática:

```powershell
node .\scripts\atualizar-santos.mjs
```

verifica o ano atual e o próximo ano. Um ano já válido é preservado; um ano ausente/inválido é reconstruído e validado.

## Estrutura

```text
data/
└── santos/
    ├── 2026/
    │   ├── 2026-01-01.json
    │   └── ...
    └── 2027/
        ├── 2027-01-01.json
        └── ...
```

## Nota de conteúdo/licença

Os JSONs registram explicitamente a origem A12. O script separa o texto de fonte em `sourceText`. Antes de publicar ou redistribuir textos completos de terceiros, revise as permissões/licenças do conteúdo. O A12 é usado aqui como fonte de pesquisa e referência, não como uma declaração de licença de reutilização irrestrita.

O calendário de santos não deve ser confundido automaticamente com o calendário litúrgico: a Liturgia do seu projeto continua sendo alimentada pelo banco local de Liturgia já validado.
