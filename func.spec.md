# Functional Specification: Busca Jurídica

> **Status:** aguardando aprovação
>
> Nenhuma Technical Specification ou implementação deve começar antes da aprovação desta especificação.

## Contexto e objetivo

O LexRadar quer melhorar a pesquisa de informações jurídicas. O MVP permitirá pesquisar documentos por nome, número de processo ou palavra-chave e consultar os detalhes de um resultado em desktop e mobile. O prazo estimado para o protótipo é de aproximadamente 60 minutos.

## Requisitos

- Campo de busca para nome, número de processo ou palavra-chave.
- Lista com título, tipo do documento, data e descrição breve.
- Visualização dos detalhes de um resultado selecionado.
- Estados de loading, nenhum resultado, erro e resultado encontrado.
- Interface responsiva para desktop e mobile.

## Premissas e decisões

- Os dados serão fornecidos por mocks locais determinísticos.
- A busca ocorrerá pelo botão ou pela tecla Enter.
- A consulta deve conter pelo menos 2 caracteres após remover espaços externos.
- Não haverá filtros separados por tipo.
- Os mocks definirão a relevância e a ordem dos resultados.
- As datas serão exibidas como `dd/mm/aaaa`.
- Cada busca retornará no máximo 10 resultados.
- O loading dos mocks terá aproximadamente 600 ms.
- `processo`, `indenização` e `ana` retornarão resultados.
- `vazio` retornará uma lista vazia.
- `erro` simulará falha na busca.
- O id `999` simulará falha ao carregar detalhes.
- Ids inexistentes exibirão "Documento não encontrado".
- Consultas serão comparadas sem diferenciar maiúsculas e minúsculas.

## Fluxo principal

1. A pessoa acessa a busca.
2. Informa um nome, número de processo ou palavra-chave.
3. Envia a consulta.
4. Visualiza o loading.
5. Visualiza os resultados ou o estado correspondente.
6. Seleciona um resultado.
7. Visualiza os detalhes.
8. Retorna à lista preservando consulta e resultados pelo histórico do navegador.

## Experiência da pessoa usuária

- **Busca:** campo em destaque, botão claro e exemplos de consultas válidas.
- **Resultados:** consulta visível no topo; itens clicáveis com título, tipo, data e descrição fáceis de escanear.
- **Nenhum resultado:** mensagem contextual e sugestão de termos mais amplos.
- **Erro:** mensagem amigável, botão de nova tentativa e consulta preservada.
- **Detalhes:** rota `/documento/:id`, botão de retorno e contexto preservado.
- **Loading:** indicador no conteúdo que será substituído, sem mudança brusca de layout.
- **Mobile:** uma coluna, áreas de toque confortáveis e quebra segura de textos longos.
- **Acessibilidade:** foco visível, navegação por teclado, mensagens anunciadas e foco inicial no título dos detalhes.

## Contrato de dados

### Resultado

```json
{
  "id": "123",
  "title": "Processo de indenização",
  "type": "Processo",
  "date": "2026-08-20",
  "description": "Ação relacionada a..."
}
```

### Detalhes

Além dos campos do resultado, o detalhe terá exatamente `processNumber`, `parties`, `court`, `status` e `summary`.

## Estados

- Estado inicial sem busca realizada.
- Loading durante a busca.
- Resultados encontrados.
- Nenhum resultado para `vazio`.
- Erro de busca para `erro`.
- Loading dos detalhes.
- Erro de detalhes para o id `999`.
- Documento inexistente para ids não encontrados.

## Critérios de aceitação

- Consultas válidas exibem resultados com título, tipo, data e descrição.
- Consultas vazias ou menores que 2 caracteres não acessam a camada de dados.
- Loading aparece na busca e nos detalhes.
- `vazio` exibe o estado sem resultados.
- `erro` exibe erro e ação de nova tentativa.
- Um resultado abre seus detalhes completos.
- O retorno preserva consulta, lista e contexto.
- O layout funciona em desktop e mobile.
- O fluxo principal funciona por teclado.

## Fora do escopo

- Autenticação e autorização.
- Filtros avançados.
- Ordenação manual.
- Paginação ou carregamento infinito.
- Histórico persistente.
- Favoritos, compartilhamento e exportação.
- Edição ou criação de documentos.
- Integração com dados jurídicos reais.

## Nível de confiança

**95%**, porque requisitos, estados, experiências, contrato dos mocks, navegação e critérios de aceitação estão definidos. Os 5% restantes correspondem a ajustes visuais e decisões técnicas da implementação.
