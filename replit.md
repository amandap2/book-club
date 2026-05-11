# Clube do Livro Caxias

Site do clube do livro que reúne o acervo de livros lidos, estatísticas de leitura e sugestões personalizadas geradas por IA.

## Tecnologias

### Monorepo
- **pnpm workspaces** — gerenciamento de pacotes e workspaces
- **Node.js 24** — runtime
- **TypeScript 5.9** — tipagem estática em todos os pacotes

### Backend (API)
- **Express 5** — servidor HTTP
- **PostgreSQL + Drizzle ORM** — banco de dados relacional com ORM tipado
- **Zod (zod/v4)** — validação de schemas
- **drizzle-zod** — geração de schemas Zod a partir das tabelas Drizzle
- **OpenAI via Replit AI Integrations** — recomendações de leitura por IA (modelo gpt-5.1)
- **pino + pino-http** — logging estruturado em JSON
- **esbuild** — build do servidor (bundle CJS)

### Frontend
- **React 19** — biblioteca de UI
- **Vite** — bundler e dev server
- **Tailwind CSS** — utilitários de estilo
- **shadcn/ui** — componentes de UI acessíveis
- **TanStack React Query** — gerenciamento de estado assíncrono e cache
- **wouter** — roteamento leve no cliente
- **Orval** — geração de hooks React Query e schemas Zod a partir do spec OpenAPI

### Contrato de API
- **OpenAPI 3.1** — spec em `lib/api-spec/openapi.yaml`
- Codegen gera automaticamente hooks e schemas tipados para frontend e backend

## Estrutura do projeto

```
artifacts/
  api-server/        → API Express (porta 8080, serve em /api)
  book-club/         → Frontend React + Vite (porta configurada via $PORT)
lib/
  api-spec/          → Spec OpenAPI (source of truth da API)
  api-client-react/  → Hooks React Query gerados (não editar manualmente)
  api-zod/           → Schemas Zod gerados (não editar manualmente)
  db/                → Schema Drizzle + cliente PostgreSQL
  integrations-openai-ai-server/ → Cliente OpenAI pré-configurado
```

## Páginas do site

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial com logo, estatísticas do clube e resumo por ano |
| `/arquivo` | Acervo completo com filtro por ano e notas |
| `/sugestoes` | Recomendações de leitura geradas por IA |

## Como rodar localmente

### Pré-requisitos
- Node.js 24+
- pnpm
- PostgreSQL (ou usar a variável `DATABASE_URL` apontando para um banco existente)

### Variáveis de ambiente necessárias

```env
DATABASE_URL=           # String de conexão PostgreSQL
SESSION_SECRET=         # Secret para sessões
AI_INTEGRATIONS_OPENAI_BASE_URL=  # Provido pelo Replit AI Integrations
AI_INTEGRATIONS_OPENAI_API_KEY=   # Provido pelo Replit AI Integrations
```

### Instalação

```bash
pnpm install
```

### Banco de dados

```bash
# Criar as tabelas
pnpm --filter @workspace/db run push
```

### Rodar em desenvolvimento

O frontend exige `PORT` e `BASE_PATH` para iniciar — sem elas o Vite lança um erro e o CSS não carrega. Defina-as antes de rodar:

```bash
# Terminal 1 — API
pnpm --filter @workspace/api-server run dev

# Terminal 2 — Frontend (variáveis obrigatórias)
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/book-club run dev
```

Ou crie um arquivo `.env` dentro de `artifacts/book-club/`:

```env
PORT=3000
BASE_PATH=/
```

A API roda na porta `8080` e serve sob o prefixo `/api`.
O frontend roda em `http://localhost:3000` (ou a porta que você definir em `PORT`).

### Build para produção

```bash
pnpm run build
```

### Outros comandos úteis

```bash
# Typecheck completo em todos os pacotes
pnpm run typecheck

# Regenerar hooks e schemas a partir do spec OpenAPI
pnpm --filter @workspace/api-spec run codegen

# Forçar push do schema (útil em conflitos de coluna)
pnpm --filter @workspace/db run push-force
```

## Arquitetura

- O contrato da API é definido primeiro no OpenAPI spec (`lib/api-spec/openapi.yaml`) e os tipos são gerados via Orval — nunca escreva tipos manualmente para endpoints existentes.
- O frontend usa exclusivamente os hooks gerados (`@workspace/api-client-react`) para chamadas à API.
- O servidor valida inputs e outputs com os schemas Zod gerados (`@workspace/api-zod`).
- As recomendações de IA são geradas no servidor para proteger as credenciais e evitar latência no cliente.
- Não usar `console.log` no servidor — usar `req.log` em handlers e `logger` fora do contexto de request.

## Gotchas

- Nunca editar manualmente os arquivos em `lib/api-client-react/src/generated/` ou `lib/api-zod/src/generated/` — são sobrescritos pelo codegen.
- Ao adicionar novos endpoints, sempre rodar `pnpm --filter @workspace/api-spec run codegen` após editar o spec.
- Não rodar `pnpm run dev` na raiz do monorepo — cada artifact deve ser iniciado individualmente ou via workflows do Replit.
- `@import url(...)` do Google Fonts deve ser a **primeira linha** do `index.css`, antes do `@import "tailwindcss"`.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._
