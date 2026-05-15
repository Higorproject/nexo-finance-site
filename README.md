# Fintech App — Monorepo

Estrutura limpa, sem TanStack, sem Cloudflare, sem Wrangler, sem Lovable Cloud.

```
.
├── frontend/   # Vite + React 18 + TypeScript + Tailwind v3 + shadcn/ui + Recharts + Framer Motion
├── backend/    # Node.js + Express + TypeScript + Prisma + PostgreSQL
└── README.md
```

## Pré-requisitos

- Node.js 20+
- pnpm, npm ou bun
- PostgreSQL 14+ (local ou remoto)

## Frontend

```bash
cd frontend
npm install
cp .env.example .env       # ajuste VITE_API_URL se necessário
npm run dev                # http://localhost:5173
npm run build              # build de produção em dist/
npm run preview            # serve o build
```

## Backend

```bash
cd backend
npm install
cp .env.example .env       # configure DATABASE_URL e PORT
npx prisma migrate dev     # cria as tabelas
npx prisma generate
npm run dev                # http://localhost:4000
npm run build && npm start # produção
```

## Endpoints da API

- `GET  /api/health` — healthcheck
- `GET  /api/indicators` — indicadores do dashboard
- `GET  /api/portfolio` — série histórica do portfólio
- `GET  /api/transactions` — últimas transações
- `POST /api/simulate` — simulador de investimento `{ amount, months, rate }`

## Stack

**Frontend:** Vite 5, React 18, TypeScript, Tailwind CSS 3, shadcn/ui, Recharts, Framer Motion, lucide-react, react-router-dom 6.

**Backend:** Express 4, TypeScript, Prisma 5, PostgreSQL, Zod, CORS.

## Deploy

- Frontend: Vercel, Netlify, Cloudflare Pages, ou qualquer host estático (`frontend/dist`).
- Backend: Railway, Render, Fly.io, ou VPS com Node 20.

Sem amarras com plataforma. Código 100% portável.
