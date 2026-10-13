# 🍓 Celeste Golden Berry Tracker

Projeto desenvolvido em conjunto para as disciplinas **PTAS — Programação e Tecnologias para Aplicações Servidor** e **PTAC — Programação e Tecnologias para Aplicações Cliente**.

## Autor

Guilherme Henrique Marques Bastos ([@sddsBanjo](https://github.com/sddsBanjo/))

## Tema do projeto

Rastreador de progresso de **Golden Berries** no jogo *Celeste*, composto por uma API REST (backend, Node.js/Express) e uma aplicação web (frontend, React) que a consome.

## Resumo do problema

*Celeste* é um jogo de plataforma conhecido pela dificuldade e por um colecionável especial em cada capítulo: a Golden Berry, obtida ao concluir o capítulo inteiro sem morrer uma única vez. O jogo base não guarda nenhum histórico de tentativas: não é possível saber quantas mortes ou quanto tempo foram investidos em cada capítulo, nem acompanhar esse progresso em diferentes campanhas (jogo base, mods, speedruns, coletâneas como a Strawberry Jam).

O projeto resolve isso criando um sistema próprio de acompanhamento: o jogador registra cada sessão de jogo (capítulo, duração, mortes e se a Golden foi obtida), agrupadas em "playthroughs" (campanhas independentes), e a aplicação deriva estatísticas e um painel de progresso a partir desse histórico — algo que o jogo em si nunca ofereceu.

## Requisitos Funcionais

- **RF01** — Cadastrar, listar, editar e remover capítulos (chapters) de um catálogo, identificados por origem (jogo/mod), número e lado (A/B/C...).
- **RF02** — Filtrar o catálogo de capítulos por origem, lado e número.
- **RF03** — Cadastrar, listar, editar e remover playthroughs (campanhas de acompanhamento independentes).
- **RF04** — Associar capítulos do catálogo a uma playthrough específica, e remover essa associação.
- **RF05** — Listar os capítulos associados a uma playthrough, em ordem de capítulo/lado.
- **RF06** — Registrar sessões de jogo (data, duração, número de mortes e se a Golden foi obtida) vinculadas a um capítulo dentro de uma playthrough.
- **RF07** — Listar e consultar o histórico de sessões, com filtro por associação capítulo–playthrough.
- **RF08** — Remover um registro de sessão.
- **RF09** — Exibir, na aplicação cliente, um painel ("journal") com o status de Golden Berry (obtida ou não) de cada capítulo de uma playthrough, derivado do histórico de sessões.
- **RF10** — Exibir estatísticas derivadas do histórico (total de sessões, mortes, tempo jogado, Goldens obtidas, médias por sessão, entre outras), tanto por capítulo quanto por playthrough.
- **RF11** — Validar os dados de entrada em todas as operações de escrita, retornando mensagens de erro claras quando o formato for inválido ou o recurso referenciado não existir.

## Requisitos Não Funcionais

- **RNF01** — A comunicação entre cliente e servidor deve seguir o padrão REST, trocando dados em JSON.
- **RNF02** — O backend deve ser desenvolvido em Node.js com o framework Express, organizado em camadas (rotas, middlewares, controllers, repositórios).
- **RNF03** — O frontend deve ser desenvolvido em React, consumindo a API exclusivamente via HTTP.
- **RNF04** — A persistência de dados deve ser feita em um banco NoSQL (MongoDB).
- **RNF05** — O histórico de sessões deve ser preservado integralmente (sem exclusão automática ou agregação destrutiva), servindo de fonte única para o cálculo de estatísticas.
- **RNF06** — O código-fonte deve ser versionado em Git/GitHub, com commits atômicos seguindo o padrão Conventional Commits e desenvolvimento organizado em branches por funcionalidade.
- **RNF07** — A API deve responder com os códigos de status HTTP apropriados (200, 201, 204, 400, 404, 409) e corpo de erro padronizado para falhas de validação, recurso não encontrado e conflito.
- **RNF08** — A interface do frontend deve ser responsiva, funcionando em diferentes tamanhos de tela.

## Estrutura do repositório

```text
celeste-golden-berry-tracker/
├── backend/     # API REST (PTAS) — Node.js, Express
├── frontend/    # Aplicação web (PTAC) — React
└── README.md    # Este arquivo
```

## Documentação técnica

- [`backend/docs/api.md`](./backend/docs/api.md) — referência completa dos endpoints