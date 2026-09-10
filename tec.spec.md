# Technical Specification: Busca Jurídica

> **Status:** aguardando aprovação
>
> Nenhum código ou build será iniciado antes da aprovação explícita desta especificação.

## Stack

- React com TypeScript.
- Vite.
- React Router.
- CSS próprio, sem biblioteca visual externa.
- Mocks locais, sem chamadas HTTP.

## Estrutura proposta

```text
src/
  components/
    SearchForm.tsx
    SearchResultCard.tsx
    SearchState.tsx
    DocumentDetails.tsx
  data/
    documents.ts
    mockApi.ts
  pages/
    SearchPage.tsx
    DocumentPage.tsx
  types/
    document.ts
  App.tsx
  main.tsx
  styles.css
```

## Modelos

```ts
type SearchResult = {
  id: string;
  title: string;
  type: string;
  date: string;
  description: string;
};

type DocumentDetails = SearchResult & {
  processNumber: string;
  parties: string[];
  court: string;
  status: string;
  summary: string;
};
```

## Camada de mocks

`mockApi.ts` será a única camada responsável pelo acesso aos dados:

- `searchDocuments(query: string): Promise<SearchResult[]>`
- `getDocumentById(id: string): Promise<DocumentDetails>`

Comportamento:

- Atraso de aproximadamente 600 ms.
- Comparação case-insensitive e remoção de espaços externos.
- `processo`, `indenização` e `ana` retornam documentos correspondentes.
- `vazio` retorna lista vazia.
- `erro` rejeita a busca com erro controlado.
- `999` rejeita os detalhes com erro controlado.
- Ids inexistentes resultam em documento não encontrado.
- No máximo 10 resultados são retornados.

## Rotas e navegação

- `/`: `SearchPage`, contendo busca, estados e resultados.
- `/documento/:id`: `DocumentPage`, contendo loading, detalhes, erro e retorno.
- O resultado será um link navegável por teclado.
- A consulta será refletida em `?q=` para permitir restauração ao voltar ou atualizar.
- A navegação de retorno preservará consulta e resultados.

## Estado

O estado será local às páginas, sem biblioteca global:

- `query`: valor atual do campo.
- `submittedQuery`: última consulta enviada.
- `results`: resultados retornados.
- `searchStatus`: `idle`, `loading`, `success`, `empty` ou `error`.
- `searchError`: erro da busca, quando existir.
- `detailsStatus`: `loading`, `success`, `not-found` ou `error`.
- `document`: detalhes carregados, quando existirem.

## Validação

- Remover espaços externos.
- Impedir submissão com menos de 2 caracteres.
- Exibir mensagem próxima ao campo quando inválido.
- Desabilitar o botão durante o loading.
- Manter a consulta em estados vazio e erro.
- Oferecer nova tentativa em erros de busca e detalhes.

## Componentes

- `SearchForm`: campo, label, botão, validação e submissão.
- `SearchResultCard`: apresentação de resultado e link para detalhes.
- `SearchState`: estados inicial, loading, vazio e erro.
- `DocumentDetails`: campos completos do documento.
- `SearchPage`: coordenação da busca.
- `DocumentPage`: carregamento e estados do detalhe.

## Responsividade e acessibilidade

- Uma coluna em mobile e conteúdo limitado em desktop.
- Elementos semânticos: `header`, `main`, `form`, `article` e `nav`.
- Label associado ao campo por `htmlFor` e `id`.
- `aria-live` para loading, erro e ausência de resultados.
- Foco visível e foco inicial no título dos detalhes.
- Operação completa pelo teclado.
- Quebra segura para números de processo e textos extensos.

## Estilo visual

- Interface clara, profissional e orientada à leitura jurídica.
- Hierarquia por tipografia, espaçamento, bordas discretas e contraste.
- Fundo claro, texto escuro e cor de destaque para ações e links.
- Cards com borda e estados de hover/foco.
- Botões com dimensões estáveis e áreas de toque confortáveis.

## Validação técnica após aprovação

- Instalar dependências e executar o servidor de desenvolvimento.
- Executar `npm run build`.
- Testar `processo`, `vazio` e `erro`.
- Testar detalhe válido, id `999` e id inexistente.
- Verificar teclado, desktop e mobile.

A implementação somente começará após a aprovação explícita desta Technical Specification.
