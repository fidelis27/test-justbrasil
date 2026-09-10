# Functional Specification: Busca Jurídica

> **Status:** aguardando aprovação
>
> Esta especificação deve ser aprovada antes da criação da Technical Specification. Nenhum build ou implementação deve começar antes das duas aprovações.

## Contexto

Temos aproximadamente 60 minutos para entregar um protótipo funcional. O Jusbrasil quer melhorar a experiência de pesquisa de informações jurídicas, permitindo que a pessoa encontre documentos e consulte seus detalhes em uma interface simples e eficiente.

## Requisitos

Construa uma aplicação web que tenha:

**1. Campo de busca**

O usuário deve conseguir pesquisar por:

-  nome de uma pessoa; 
-  número de processo; 
-  palavra-chave. 

**2. Resultados**

Após realizar a busca, exiba uma lista de resultados contendo:

-  título; 
-  tipo do documento; 
-  data; 
-  uma breve descrição. 

**3. Detalhes**

Ao selecionar um resultado, o usuário deve conseguir visualizar mais informações sobre aquele item.

**4. Estados da aplicação**

Considere pelo menos:

-  loading; 
-  nenhum resultado; 
-  erro; 
-  resultado encontrado. 

**5. UX**

A aplicação deve funcionar bem em desktop e mobile.

---

## Contrato de referência

O protótipo usará mocks locais, mas seguirá este contrato para manter a camada de dados preparada para uma futura API.

### Busca

```http
GET /api/search?q={query}
```

Resposta:

```json
{
  "results": [
    {
      "id": "123",
      "title": "Processo de indenização",
      "type": "Processo",
      "date": "2026-08-20",
      "description": "Ação relacionada a..."
    }
  ]
}
```

### Detalhes

```http
GET /api/documents/{id}
```

Resposta do mock:

```json
{
  "id": "123",
  "title": "Processo de indenização",
  "type": "Processo",
  "date": "2026-08-20",
  "description": "Ação relacionada a...",
  "processNumber": "0000000-00.2026.8.26.0000",
  "parties": ["Parte autora", "Parte ré"],
  "court": "Tribunal de Justiça",
  "status": "Em andamento",
  "summary": "Resumo do documento jurídico."
}
```

---

## Functional Specification

### 1. Objetivo do MVP

Permitir que uma pessoa pesquise documentos jurídicos por nome, número de processo ou palavra-chave e consulte os detalhes de um resultado, em uma interface responsiva para desktop e mobile.

### 2. Premissas adotadas

- Os dados serão fornecidos por mocks locais, mantendo o contrato dos endpoints apresentados e permitindo simular sucesso, ausência de resultados e falhas.
- A busca será executada ao enviar o formulário, pelo botão de busca ou pela tecla Enter.
- A consulta deverá conter pelo menos 2 caracteres depois da remoção de espaços nas extremidades.
- Não haverá filtros separados por tipo: o campo único pesquisará nome, número de processo e palavra-chave.
- Os mocks serão responsáveis pela relevância e pela ordenação dos resultados, mantendo uma ordem determinística para a demonstração.
- As datas serão exibidas no formato brasileiro `dd/mm/aaaa`.
- A interface exibirá no máximo 10 resultados por busca. Paginação não fará parte do MVP.
- O loading dos mocks terá um atraso controlado de aproximadamente 600 ms para tornar o estado observável durante a demonstração.
- A consulta `vazio` simulará uma resposta sem resultados.
- A consulta `erro` simulará uma falha de busca.
- As consultas `processo`, `indenização` e `ana` simularão respostas com resultados.
- O identificador `999` simulará uma falha ao carregar os detalhes.
- Um identificador inexistente deverá exibir a mensagem "Documento não encontrado" e uma ação para retornar à busca.
- Consultas válidas serão comparadas sem diferenciação entre maiúsculas e minúsculas e com espaços externos ignorados.

### 3. Fluxo principal

1. A pessoa acessa a tela de busca e visualiza o campo de consulta.
2. Informa um nome, número de processo ou palavra-chave.
3. Envia a busca.
4. A aplicação exibe o estado de carregamento enquanto consulta a camada de mocks.
5. Em caso de resultados, exibe uma lista contendo título, tipo, data e descrição.
6. A pessoa seleciona um resultado.
7. A aplicação consulta os detalhes pelo `id` e exibe as informações adicionais.
8. A pessoa pode retornar à lista preservando obrigatoriamente a consulta e os resultados anteriores por meio do histórico do navegador.

### 4. Estados funcionais

- **Estado inicial:** nenhuma busca foi realizada; o campo está pronto para receber uma consulta.
- **Loading da busca:** a lista fica identificada como carregando e novas submissões são evitadas até a resposta.
- **Resultado encontrado:** cada item mostra título, tipo do documento, data e descrição breve.
- **Nenhum resultado:** mensagem clara informando que nada foi encontrado para a consulta e permitindo uma nova busca.
- **Erro na busca:** mensagem genérica, sem expor detalhes técnicos, com ação para tentar novamente.
- **Loading dos detalhes:** o local destinado aos detalhes indica carregamento.
- **Erro nos detalhes:** para o cenário simulado pelo id `999`, exibir mensagem informando que os detalhes não puderam ser carregados, com ações para tentar novamente ou retornar à lista.
- **Documento inexistente:** para um id que não esteja nos mocks, exibir "Documento não encontrado" e uma ação para retornar à busca.

### 5. Experiência da pessoa usuária

- **Busca:** a tela inicial apresenta um campo em destaque, um botão com ação clara e exemplos de consultas válidas. A busca pode ser enviada pelo botão ou pela tecla Enter.
- **Resultados:** a consulta permanece visível no topo da lista. Cada resultado é um alvo clicável com hierarquia visual clara, tipo e data fáceis de localizar e descrição limitada para manter a leitura escaneável.
- **Nenhum resultado:** exibir uma mensagem contextual com a consulta realizada, sugerir revisar a grafia ou tentar termos mais amplos e manter o campo pronto para nova tentativa.
- **Erro:** explicar que a busca não pôde ser concluída, oferecer o botão de tentar novamente e preservar a consulta digitada.
- **Detalhes:** abrir em `/documento/:id`, com botão de retorno para `/`. A navegação de retorno usará o histórico do navegador para preservar a consulta e a lista quando o usuário veio de um resultado.
- **Loading:** usar uma estrutura visual estável, com indicador de carregamento no conteúdo que será substituído, evitando mudanças bruscas de layout.
- **Mobile:** priorizar uma coluna, áreas de toque confortáveis e quebra segura de números de processo e textos longos.
- **Acessibilidade:** manter foco visível, foco no título ao carregar uma nova tela, mensagens anunciadas por tecnologias assistivas e controles operáveis por teclado.

### 6. Detalhes do documento

Os detalhes serão exibidos em uma rota própria (`/documento/:id`). Além dos campos da lista, serão exibidos exatamente `processNumber`, `parties`, `court`, `status` e `summary`. O título, o tipo, a data e o identificador permanecerão visíveis para contextualização. O botão de retorno deverá levar a pessoa de volta à busca sem apagar seu contexto.

### 7. Requisitos de UX e acessibilidade

- Layout responsivo para larguras de desktop e mobile.
- Campo de busca com label acessível e indicação de erro quando a consulta for inválida.
- Fluxo utilizável por teclado, com foco visível e ordem de navegação coerente.
- Mensagens de loading, erro e ausência de resultados perceptíveis também para tecnologias assistivas.
- Botões e links com nomes que descrevam sua ação.
- Textos longos deverão ser apresentados sem quebrar o layout.

### 8. Critérios de aceitação

- É possível pesquisar por uma consulta válida e visualizar os resultados retornados.
- Cada resultado apresenta título, tipo, data e descrição.
- A consulta vazia ou menor que 2 caracteres não dispara a camada de dados e informa o problema à pessoa.
- O loading é apresentado durante a busca e durante o carregamento dos detalhes.
- Uma resposta sem resultados apresenta o estado correspondente.
- Uma falha na camada de dados apresenta uma mensagem de erro e uma ação de nova tentativa.
- É possível selecionar um resultado e visualizar seus detalhes.
- É possível voltar aos resultados sem perder o contexto da busca, da consulta ou da lista exibida.
- A interface permanece utilizável em desktop e mobile.
- O fluxo principal pode ser executado usando teclado.

### 9. Fora do escopo do MVP

- Autenticação e autorização.
- Filtros avançados por tipo, tribunal, período ou assunto.
- Ordenação manual.
- Paginação ou carregamento infinito.
- Histórico persistente de buscas.
- Favoritos, compartilhamento e exportação.
- Edição ou criação de documentos.
- Integração com dados jurídicos reais além da API fornecida.

### 10. Decisões confirmadas para a Technical Specification

- **Frontend:** React com TypeScript e Vite, criado do zero.
- **Dados:** mocks locais determinísticos, isolados em uma camada de acesso a dados.
- **Contrato:** resultados com `id`, `title`, `type`, `date` e `description`; detalhes com esses campos mais `processNumber`, `parties`, `court`, `status` e `summary`.
- **Rotas:** `/` para busca e `/documento/:id` para detalhes.
- **Estados demonstráveis:** estado inicial, loading de aproximadamente 600 ms, resultados, consulta `vazio` e erro com consulta `erro`.
- **Consultas demonstráveis:** `processo`, `indenização` e `ana` retornam resultados; `vazio` retorna lista vazia; `erro` simula falha na busca; o id `999` simula falha nos detalhes.
- **Documento inexistente:** qualquer id não encontrado exibe "Documento não encontrado" e ação para retornar à busca.
- **Interface:** CSS próprio, sem biblioteca visual externa, com estética profissional e foco em legibilidade, contraste e responsividade.
- **Navegação:** retorno pelo histórico do navegador, preservando obrigatoriamente a consulta e os resultados da busca.
- **Limites:** no máximo 10 resultados; sem paginação, autenticação ou filtros avançados.

### 11. Nível de confiança

O nível de confiança na completude da Functional Specification é **alto: 95%**. Os requisitos funcionais, estados, experiências, contrato dos mocks, navegação e critérios de aceitação estão definidos. Os 5% restantes correspondem apenas a ajustes visuais e decisões técnicas de implementação que serão detalhados na Technical Specification, após esta aprovação.

Esta Functional Specification está completa e aguarda aprovação. A Technical Specification e a implementação somente começarão após a aprovação explícita desta etapa.

