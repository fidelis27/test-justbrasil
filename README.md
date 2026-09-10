# Busca Jurídica

Protótipo funcional desenvolvido para um desafio técnico do LexRadar.

## Sobre o desafio

O objetivo era criar, em aproximadamente 60 minutos, uma experiência simples para pesquisar informações jurídicas e consultar os detalhes de cada resultado.

A aplicação permite pesquisar por:

- Nome de uma pessoa
- Número de processo
- Palavra-chave

Os resultados exibem título, tipo, número do processo, data e descrição. Cada item pode ser aberto para consultar informações complementares.

## Resultado

O protótipo contempla:

- Busca responsiva para desktop e mobile
- Resultados mockados e determinísticos
- Tela de detalhes do documento
- Loading durante as consultas
- Estado inicial
- Estado de nenhum resultado
- Estado de erro na busca
- Erro de carregamento dos detalhes
- Documento inexistente
- Preservação da consulta ao voltar dos detalhes
- Navegação por teclado e foco acessível

## Tecnologias

- React
- TypeScript
- Vite
- React Router
- CSS próprio
- Vitest
- Testing Library
- JSDOM

## Como executar

### Pré-requisitos

- Node.js
- npm

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Depois, acesse a URL exibida pelo Vite, normalmente `http://localhost:5173`.

### Build de produção

```bash
npm run build
```

### Testes

```bash
npm test
```

### Cobertura

```bash
npm run test:coverage
```

O relatório gera cobertura em texto e também em HTML na pasta `coverage/`, que é ignorada pelo Git.

## Cenários de demonstração

| Consulta ou rota | Comportamento |
| --- | --- |
| `processo` | Retorna resultados de processos e acórdãos |
| `indenização` | Retorna documentos relacionados à indenização |
| `ana` | Retorna resultados relacionados à pessoa Ana |
| `vazio` | Simula uma busca sem resultados |
| `erro` | Simula uma falha na busca |
| `/documento/123` | Exibe um documento válido |
| `/documento/999` | Simula falha ao carregar detalhes |
| `/documento/qualquer-id` | Exibe documento não encontrado |

## Arquitetura

```text
src/
	components/
		DocumentDetails.tsx
		SearchForm.tsx
		SearchResultCard.tsx
		SearchState.tsx
	data/
		documents.ts
		mockApi.ts
		mockApi.test.ts
	types/
		document.ts
	App.tsx
	App.test.tsx
	main.tsx
	styles.css
	testSetup.ts
```

### Camada de dados

O arquivo `src/data/mockApi.ts` concentra o acesso aos dados. Ele expõe duas operações assíncronas:

- `searchDocuments(query)`
- `getDocumentById(id)`

Os componentes não dependem diretamente do array de documentos. Isso mantém o mock substituível por uma API real no futuro.

### Rotas

- `/`: tela de busca
- `/documento/:id`: detalhes do documento

A consulta enviada também é refletida em `?q=` para preservar o contexto da pesquisa.

## Testes e qualidade

A suíte atual possui **22 testes passando** em três arquivos:

- Testes da camada de mocks
- Testes dos componentes de formulário, estados, cards e detalhes
- Testes dos fluxos principais da aplicação e das rotas

Último relatório de cobertura:

- Linhas: **100%**
- Statements: **95,95%**
- Branches: **90,14%**
- Funções: **91,42%**

O build de produção também foi validado com `npm run build`.

## Processo passo a passo

1. Analisamos os requisitos e identificamos ambiguidades, especialmente contrato da API, estados, detalhes e comportamento mobile.
2. Criamos uma Functional Specification com fluxo principal, MVP, critérios de aceitação e fora do escopo.
3. Fechamos as decisões: React, mocks locais, rotas, cenários de erro, limite de resultados e comportamento responsivo.
4. Separamos a documentação em `context.md`, `func.spec.md` e `tec.spec.md`.
5. Criamos a base React com TypeScript e Vite.
6. Implementamos os dados mockados e os estados da busca e dos detalhes.
7. Implementamos a interface responsiva com CSS próprio.
8. Adicionamos busca por número de processo e destaque visual do número nos cards.
9. Criamos testes unitários e de integração leve para os principais fluxos.
10. Medimos a cobertura e removemos artefatos gerados do controle de versão.
11. Executamos os testes, o build e publicamos o projeto na branch `main`.

## O que descobrimos no caminho

Durante a implementação, alguns pontos importantes não estavam explícitos nas especificações originais:

- **Número do processo nos resultados:** a busca precisava consultar também `processNumber`, e o card precisava exibir esse valor com o rótulo `Processo`.
- **Cobertura de testes:** o primeiro relatório indicava 100% porque media apenas os arquivos importados pelos testes. Configuramos a cobertura para incluir todo o código relevante de `src` e identificamos a necessidade de testar a interface.
- **Testes de interface:** além dos mocks, foi necessário testar formulário, estados, cards, detalhes, rotas, documento inexistente e falha de carregamento.
- **Isolamento do ambiente de testes:** o DOM precisava ser limpo entre os casos para evitar que elementos de um teste interferissem no seguinte.
- **Acessibilidade:** os estados vazio e erro precisavam de anúncios explícitos para tecnologias assistivas, e o foco dos detalhes precisava ir diretamente para o título.
- **Arquivos gerados:** relatórios de coverage e arquivos `.tsbuildinfo` estavam sendo rastreados e foram removidos do versionamento e adicionados ao `.gitignore`.
- **Dependências:** o Vitest inicialmente apresentou um alerta de segurança; ele foi atualizado e a auditoria terminou sem vulnerabilidades.
- **Git:** o repositório já possuía histórico, branch `master` e um remoto diferente. A branch foi ajustada para `main` e o remoto foi configurado para o repositório de entrega.

Esses ajustes aumentaram a confiabilidade do protótipo sem ampliar o escopo funcional definido para o MVP.

## Documentação

- [Contexto do desafio](context.md)
- [Functional Specification](func.spec.md)
- [Technical Specification](tec.spec.md)

## Tempo do desafio

- Tempo previsto: aproximadamente 60 minutos
- Criação da pasta do projeto: 10/09/2026 às 13:01:16
- Última alteração registrada: 10/09/2026 às 14:02:24
- Tempo de trabalho registrado: aproximadamente 1 hora, 1 minuto e 8 segundos