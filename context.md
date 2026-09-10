Você é meu parceiro de engenharia durante este desafio técnico.

Recebemos a especificação abaixo. Temos aproximadamente 60 minutos para entregar um protótipo funcional.

IMPORTANTE:
- Não implemente código ainda.
- Não crie componentes ainda.
- Não faça o build ainda.
- Primeiro quero criar uma Functional Specification.
- Depois que eu aprovar a Functional Specification, criaremos uma Technical Specification.
- Somente depois da minha aprovação da Technical Specification poderemos iniciar a implementação.

Objetivo desta primeira etapa:
1. Analisar os requisitos fornecidos.
2. Identificar ambiguidades ou informações que precisam de decisão.
3. Propor o fluxo principal do usuário.
4. Definir o MVP para caber no tempo disponível.
5. Definir critérios de aceitação.
6. Identificar explicitamente o que ficará fora do escopo.
7. Criar uma Functional Specification curta e objetiva.

Não tome decisões importantes silenciosamente. Quando houver uma ambiguidade que possa impactar o produto, apresente a questão e uma recomendação.

No final, aguarde minha aprovação antes de prosseguir.

 **Contexto**
O Jusbrasil quer melhorar a experiência de pesquisa de informações jurídicas.
Atualmente, o usuário precisa realizar uma busca e navegar por diferentes páginas para encontrar informações relevantes.
Queremos um protótipo que permita ao usuário pesquisar informações jurídicas e visualizar os resultados de maneira simples e eficiente.

### Requisitos

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

### API

Para o desafio, você recebeu uma API fictícia:

```
```

```
GET /api/search?q={query}
```

Exemplo:

```
```

```
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

Detalhes:

```
```

```
GET /api/documents/{id}
```

---

## Functional Specification

### 1. Objetivo do MVP

Permitir que uma pessoa pesquise documentos jurídicos por nome, número de processo ou palavra-chave e consulte os detalhes de um resultado, em uma interface responsiva para desktop e mobile.

### 2. Premissas adotadas

- A API será consumida por meio dos endpoints apresentados. Caso não exista um backend disponível durante o desenvolvimento, os dados serão simulados localmente mantendo o mesmo contrato.
- A busca será executada ao enviar o formulário, pelo botão de busca ou pela tecla Enter.
- A consulta deverá conter pelo menos 2 caracteres depois da remoção de espaços nas extremidades.
- Não haverá filtros separados por tipo: o campo único pesquisará nome, número de processo e palavra-chave.
- A API será responsável pela relevância e pela ordenação dos resultados.
- As datas serão exibidas no formato brasileiro `dd/mm/aaaa`.
- A interface exibirá uma quantidade limitada de resultados por busca. Paginação não fará parte do MVP.

### 3. Fluxo principal

1. A pessoa acessa a tela de busca e visualiza o campo de consulta.
2. Informa um nome, número de processo ou palavra-chave.
3. Envia a busca.
4. A aplicação exibe o estado de carregamento enquanto consulta a API.
5. Em caso de resultados, exibe uma lista contendo título, tipo, data e descrição.
6. A pessoa seleciona um resultado.
7. A aplicação consulta os detalhes pelo `id` e exibe as informações adicionais.
8. A pessoa pode retornar à lista preservando a consulta e os resultados anteriores quando possível.

### 4. Estados funcionais

- **Estado inicial:** nenhuma busca foi realizada; o campo está pronto para receber uma consulta.
- **Loading da busca:** a lista fica identificada como carregando e novas submissões são evitadas até a resposta.
- **Resultado encontrado:** cada item mostra título, tipo do documento, data e descrição breve.
- **Nenhum resultado:** mensagem clara informando que nada foi encontrado para a consulta e permitindo uma nova busca.
- **Erro na busca:** mensagem genérica, sem expor detalhes técnicos, com ação para tentar novamente.
- **Loading dos detalhes:** o local destinado aos detalhes indica carregamento.
- **Erro nos detalhes:** mensagem informando que os detalhes não puderam ser carregados, com ação para tentar novamente ou retornar à lista.

### 5. Detalhes do documento

Os detalhes serão exibidos em uma visualização própria, como página ou painel, desde que permitam retorno claro à lista. Além dos campos exibidos no resultado, serão apresentados todos os campos adicionais devolvidos pelo endpoint de detalhes. O título e o identificador do documento deverão permanecer visíveis para contextualização.

### 6. Requisitos de UX e acessibilidade

- Layout responsivo para larguras de desktop e mobile.
- Campo de busca com label acessível e indicação de erro quando a consulta for inválida.
- Fluxo utilizável por teclado, com foco visível e ordem de navegação coerente.
- Mensagens de loading, erro e ausência de resultados perceptíveis também para tecnologias assistivas.
- Botões e links com nomes que descrevam sua ação.
- Textos longos deverão ser apresentados sem quebrar o layout.

### 7. Critérios de aceitação

- É possível pesquisar por uma consulta válida e visualizar os resultados retornados.
- Cada resultado apresenta título, tipo, data e descrição.
- A consulta vazia ou menor que 2 caracteres não dispara a API e informa o problema à pessoa.
- O loading é apresentado durante a busca e durante o carregamento dos detalhes.
- Uma resposta sem resultados apresenta o estado correspondente.
- Uma falha da API apresenta uma mensagem de erro e uma ação de nova tentativa.
- É possível selecionar um resultado e visualizar seus detalhes.
- É possível voltar aos resultados sem perder o contexto da busca.
- A interface permanece utilizável em desktop e mobile.
- O fluxo principal pode ser executado usando teclado.

### 8. Fora do escopo do MVP

- Autenticação e autorização.
- Filtros avançados por tipo, tribunal, período ou assunto.
- Ordenação manual.
- Paginação ou carregamento infinito.
- Histórico persistente de buscas.
- Favoritos, compartilhamento e exportação.
- Edição ou criação de documentos.
- Integração com dados jurídicos reais além da API fornecida.

### 9. Decisões pendentes para a Technical Specification

- URL base e disponibilidade da API.
- Contrato completo da resposta de detalhes.
- Formato de erro e códigos HTTP esperados.
- Estratégia de mock caso a API não esteja acessível.
- Tecnologia, estrutura de rotas e biblioteca visual a serem utilizadas.

Esta Functional Specification aguarda aprovação antes da elaboração da Technical Specification e do início da implementação.

