# API Reference — Celeste Golden Berry Tracker

> **Status:** em desenvolvimento. Os dados ficam em memória e são perdidos ao reiniciar o servidor. A persistência em MongoDB será adicionada depois.

Base URL: `http://localhost:PORT/api` (padrão `PORT=2904`, configurável em `.env`).

---

## Sumário

- [Convenções gerais](#convenções-gerais)
- [Health](#health)
- [Chapters](#chapters)
- [Playthroughs](#playthroughs)
- [Playthrough Chapters](#playthrough-chapters)
- [Sessions](#sessions)

---

## Convenções gerais

### Formato

Todas as requisições e respostas usam JSON. Requisições com body devem enviar o header:

```
Content-Type: application/json
```

### Campos de texto

Campos de texto (`identifier`, `name`, `origin`, `side`, `description`) têm os espaços das pontas removidos (`trim`) antes de serem armazenados.

### Datas

Campos de data (`played_at`, `created_at`) usam o formato ISO 8601 em UTC, ex.: `2026-10-01T14:30:00.000Z`.

### Identificadores (`:id`)

Todo parâmetro de rota `:id` (e `:chapterId`) deve ser um **inteiro positivo**. IDs não são reaproveitados após uma exclusão (comportamento equivalente a um auto-increment).

### Formato de erro

Erros de **validação** (`400`) retornam um objeto com `error` (mensagem geral) e `details` (lista de campos inválidos):

```json
{
  "error": "Invalid chapter! Check documentation for a better understanding of the expected format.",
  "details": [
    { "field": "name", "message": "Name is required and must be a non-empty string." }
  ]
}
```

Erros de **recurso não encontrado** (`404`) ou **conflito** (`409`) retornam apenas `error`:

```json
{ "error": "Couldn't find a chapter of ID 99." }
```

Rotas inexistentes retornam `404` em JSON (e não a página de erro padrão do Express):

```json
{ "error": "Route GET /api/foo not found." }
```

### Códigos de status usados

| Código | Significado |
|---|---|
| `200` | Sucesso (GET) |
| `201` | Recurso criado (POST) |
| `204` | Sucesso sem corpo de resposta (DELETE) |
| `400` | Body, query ou parâmetro de URL inválido |
| `404` | Recurso não encontrado |
| `409` | Conflito com um recurso existente (ex.: duplicidade) |

---

## Health

### `GET /api/health`

Verifica se a API está no ar.

**Resposta `200`**

```json
{ "status": "ok" }
```

---

## Chapters

Um **chapter** é um capítulo específico do jogo base ou de um mod, já considerando o lado (A/B/C/EX...) como uma entidade independente. `identifier` é o campo único que identifica cada chapter (ex.: `Celeste1A`).

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/chapters` | Lista chapters, com filtros opcionais |
| GET | `/api/chapters/:id` | Busca um chapter por ID |
| POST | `/api/chapters` | Cria um chapter |
| PUT | `/api/chapters/:id` | Substitui um chapter existente |
| DELETE | `/api/chapters/:id` | Remove um chapter |

### Modelo

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | integer | Gerado automaticamente |
| `identifier` | string | Único (sem diferenciar maiúsculas/minúsculas). Apenas letras e números, sem espaços (ex.: `Celeste1A`) |
| `name` | string | Nome exibido do capítulo |
| `origin` | string | Jogo/mod de origem (ex.: `Celeste`, `Strawberry Jam`) |
| `number` | integer | Número lógico do capítulo, `>= 0` |
| `side` | string | Lado do capítulo (ex.: `A`, `B`, `C`, `EX`) |
| `created_at` | string (date) | Data de criação |

---

### `GET /api/chapters`

Lista todos os chapters. Devolve `[]` se não houver nenhum.

**Query params** (todos opcionais, combináveis)

| Param | Tipo | Descrição |
|---|---|---|
| `origin` | string | Filtra por origem (sem diferenciar maiúsculas/minúsculas) |
| `side` | string | Filtra por lado (sem diferenciar maiúsculas/minúsculas) |
| `number` | integer | Filtra por número do capítulo |

**Exemplo**

```http
GET /api/chapters?origin=Celeste&side=A
```

**Resposta `200`**

```json
[
  {
    "id": 1,
    "identifier": "Celeste1A",
    "name": "Forsaken City",
    "origin": "Celeste",
    "number": 1,
    "side": "A",
    "created_at": "2026-09-20T14:05:02.599Z"
  }
]
```

**Erros:** `400` se algum filtro vier em formato inválido (ex.: `number` não numérico, ou parâmetro repetido).

---

### `GET /api/chapters/:id`

Busca um chapter específico.

**Resposta `200`:** o chapter.
**Erros:** `404` se não existir; `400` se `:id` não for um inteiro positivo.

---

### `POST /api/chapters`

Cria um chapter.

**Body**

| Campo | Tipo | Obrigatório | Regras |
|---|---|---|---|
| `identifier` | string | sim | Único; apenas letras e números, sem espaços |
| `name` | string | sim | Não vazio |
| `origin` | string | sim | Não vazio |
| `number` | integer | sim | `>= 0` |
| `side` | string | sim | Não vazio |

**Exemplo**

```http
POST /api/chapters
Content-Type: application/json

{
  "identifier": "Celeste1A",
  "name": "Forsaken City",
  "origin": "Celeste",
  "number": 1,
  "side": "A"
}
```

**Respostas**

- `201 Created` — devolve o chapter criado, com `id` e `created_at`.
- `400 Bad Request` — um ou mais campos inválidos.
- `409 Conflict` — já existe um chapter com esse `identifier`.

---

### `PUT /api/chapters/:id`

Substitui todos os campos de um chapter existente. Mesmo formato de body do POST — todos os campos são obrigatórios. `id` e `created_at` não são alterados.

**Respostas**

- `200 OK` — devolve o chapter atualizado.
- `400 Bad Request` — body inválido, ou `:id` inválido.
- `404 Not Found` — chapter não existe.
- `409 Conflict` — o `identifier` enviado já pertence a **outro** chapter (reenviar o próprio `identifier` do chapter em edição é permitido).

---

### `DELETE /api/chapters/:id`

Remove um chapter.

**Respostas**

- `204 No Content`
- `404 Not Found` — chapter não existe.
- `400 Bad Request` — `:id` inválido.

> Remover um chapter não remove automaticamente suas associações em `playthrough_chapters` (ver seção seguinte).

---

## Playthroughs

Uma **playthrough** é uma campanha de acompanhamento independente (ex.: "Celeste Vanilla - Golden Hunt").

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/playthroughs` | Lista todas as playthroughs |
| GET | `/api/playthroughs/:id` | Busca uma playthrough por ID |
| POST | `/api/playthroughs` | Cria uma playthrough |
| PUT | `/api/playthroughs/:id` | Substitui uma playthrough existente |
| DELETE | `/api/playthroughs/:id` | Remove uma playthrough |

### Modelo

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | integer | Gerado automaticamente |
| `name` | string | Nome da playthrough |
| `description` | string | Opcional. `""` quando omitida |
| `created_at` | string (date) | Data de criação |

---

### `GET /api/playthroughs`

Lista todas as playthroughs. Devolve `[]` se não houver nenhuma.

**Resposta `200`**

```json
[
  {
    "id": 1,
    "name": "Celeste Vanilla - Golden Hunt",
    "description": "Todas as goldens do jogo base",
    "created_at": "2026-09-20T14:05:02.599Z"
  }
]
```

---

### `GET /api/playthroughs/:id`

**Resposta `200`:** a playthrough.
**Erros:** `404` se não existir; `400` se `:id` inválido.

---

### `POST /api/playthroughs`

**Body**

| Campo | Tipo | Obrigatório | Regras |
|---|---|---|---|
| `name` | string | sim | Não vazio |
| `description` | string | não | Se omitida ou `null`, é armazenada como `""` |

**Exemplo**

```http
POST /api/playthroughs
Content-Type: application/json

{
  "name": "Celeste Vanilla - Golden Hunt",
  "description": "Todas as goldens do jogo base"
}
```

**Respostas**

- `201 Created` — devolve a playthrough criada.
- `400 Bad Request` — `name` ausente/inválido, ou `description` de tipo inválido.

---

### `PUT /api/playthroughs/:id`

Substitui `name` e `description`. Mesmo formato de body do POST. `id` e `created_at` não são alterados.

**Respostas**

- `200 OK`
- `400 Bad Request`
- `404 Not Found`

---

### `DELETE /api/playthroughs/:id`

**Respostas**

- `204 No Content`
- `404 Not Found`
- `400 Bad Request` — `:id` inválido.

---

## Playthrough Chapters

Associa um **chapter** a uma **playthrough** — ou seja, define quais capítulos estão sendo acompanhados em cada playthrough. É a tabela de ligação entre as duas entidades; sessões (ver próxima seção) apontam para essa associação, não diretamente para um chapter.

Todas as rotas desta seção são aninhadas sob `/api/playthroughs/:id`.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/playthroughs/:id/chapters` | Associa um chapter à playthrough |
| GET | `/api/playthroughs/:id/chapters` | Lista os chapters associados à playthrough |
| DELETE | `/api/playthroughs/:id/chapters/:chapterId` | Remove uma associação |

### Modelo (associação)

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | integer | Gerado automaticamente — identifica a associação (referenciado por `sessions.playthrough_chapter_id`) |
| `playthrough_id` | integer | ID da playthrough |
| `chapter_id` | integer | ID do chapter |
| `created_at` | string (date) | Data de criação |

---

### `POST /api/playthroughs/:id/chapters`

Associa um chapter existente à playthrough `:id`.

**Path params**

| Param | Descrição |
|---|---|
| `id` | ID da playthrough |

**Body**

| Campo | Tipo | Obrigatório | Regras |
|---|---|---|---|
| `chapter_id` | integer | sim | Deve ser um chapter existente |

**Exemplo**

```http
POST /api/playthroughs/1/chapters
Content-Type: application/json

{ "chapter_id": 5 }
```

**Resposta `201`**

```json
{
  "id": 1,
  "playthrough_id": 1,
  "chapter_id": 5,
  "created_at": "2026-10-04T18:00:00.000Z"
}
```

**Respostas**

- `201 Created`
- `400 Bad Request` — `chapter_id` ausente/inválido, ou `:id` inválido.
- `404 Not Found` — a playthrough ou o chapter não existem.
- `409 Conflict` — o chapter já está associado a essa playthrough.

---

### `GET /api/playthroughs/:id/chapters`

Lista os **chapters completos** (não as associações cruas) vinculados à playthrough `:id`, ordenados por `number` e depois `side` (ex.: `1A, 1B, 1C, 2A...`).

**Resposta `200`**

```json
[
  {
    "id": 5,
    "identifier": "Celeste1A",
    "name": "Forsaken City",
    "origin": "Celeste",
    "number": 1,
    "side": "A",
    "created_at": "2026-09-20T14:05:02.599Z"
  }
]
```

**Respostas**

- `200 OK` — devolve `[]` se a playthrough não tiver chapters associados.
- `404 Not Found` — playthrough não existe.
- `400 Bad Request` — `:id` inválido.

---

### `DELETE /api/playthroughs/:id/chapters/:chapterId`

Remove a associação entre a playthrough `:id` e o chapter `:chapterId`. **Não apaga o chapter em si**, apenas o vínculo.

**Path params**

| Param | Descrição |
|---|---|
| `id` | ID da playthrough |
| `chapterId` | ID do chapter a desassociar |

**Respostas**

- `204 No Content`
- `404 Not Found` — playthrough não existe, ou a associação não existe.
- `400 Bad Request` — `:id` ou `:chapterId` inválidos.

---

## Sessions

Uma **session** registra um período de jogo em um chapter dentro de uma playthrough (via `playthrough_chapters`). Uma session pode conter várias tentativas internas — não há uma entidade por tentativa.

`completed: true` significa exclusivamente que a Golden Berry foi obtida **durante aquela sessão**.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/sessions` | Cria uma sessão |
| GET | `/api/sessions` | Lista sessões, com filtro opcional |
| GET | `/api/sessions/:id` | Busca uma sessão por ID |
| DELETE | `/api/sessions/:id` | Remove uma sessão |

### Modelo

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | integer | Gerado automaticamente |
| `playthrough_chapter_id` | integer | ID da associação playthrough↔chapter (ver seção anterior) |
| `played_at` | string (date) | Data/hora de início da sessão. Não pode ser futura |
| `duration_seconds` | integer | Duração em segundos, `> 0` |
| `deaths` | integer | Quantidade de mortes, `>= 0` |
| `completed` | boolean | Se a Golden foi obtida nessa sessão. Padrão `false` |
| `created_at` | string (date) | Data de criação do registro |

---

### `POST /api/sessions`

**Body**

| Campo | Tipo | Obrigatório | Regras |
|---|---|---|---|
| `playthrough_chapter_id` | integer | sim | Inteiro positivo; deve referenciar uma associação existente |
| `played_at` | string (date) | sim | Data válida, não pode ser no futuro |
| `duration_seconds` | integer | sim | Inteiro `> 0` |
| `deaths` | integer | sim | Inteiro `>= 0` |
| `completed` | boolean | não | Padrão `false` |

**Exemplo**

```http
POST /api/sessions
Content-Type: application/json

{
  "playthrough_chapter_id": 1,
  "played_at": "2026-10-01T14:30:00.000Z",
  "duration_seconds": 1800,
  "deaths": 9,
  "completed": true
}
```

**Respostas**

- `201 Created` — devolve a sessão criada.
- `400 Bad Request` — algum campo ausente ou em formato inválido.
- `404 Not Found` — `playthrough_chapter_id` não corresponde a uma associação existente.

---

### `GET /api/sessions`

Lista sessões. Devolve `[]` se não houver nenhuma.

**Query params**

| Param | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `playthrough_chapter_id` | integer | não | Filtra sessões de uma associação específica |

**Exemplo**

```http
GET /api/sessions?playthrough_chapter_id=1
```

**Resposta `200`**

```json
[
  {
    "id": 1,
    "playthrough_chapter_id": 1,
    "played_at": "2026-10-01T14:30:00.000Z",
    "duration_seconds": 1800,
    "deaths": 9,
    "completed": true,
    "created_at": "2026-10-04T18:10:00.000Z"
  }
]
```

---

### `GET /api/sessions/:id`

**Resposta `200`:** a sessão.
**Erros:** `404` se não existir; `400` se `:id` inválido.

---

### `DELETE /api/sessions/:id`

**Respostas**

- `204 No Content`
- `404 Not Found`
- `400 Bad Request` — `:id` inválido.

---

## Estrutura do projeto (backend)

```text
backend/src/
├── routes/         # caminhos e métodos HTTP
├── middlewares/     # validação de entrada (body, query, params)
├── controllers/     # camada HTTP (req/res)
├── repositories/     # acesso aos dados
backend/database/seed/    # dados de seed (ex.: capítulos vanilla)
```
