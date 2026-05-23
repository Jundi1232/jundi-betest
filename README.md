# Express TypeScript Basecode

Clean Architecture basecode untuk Node.js + Express + TypeScript.

## Struktur

```
src/
├── index.ts              # Entry point
├── definitions/          # Global type definitions
├── entities/             # Domain entities + mapper
├── usecases/             # Business logic (ts-mixer)
├── repositories/         # Data access layer
├── drivers/              # External adapters (MongoDB, Redis)
├── helpers/              # Utilities (errors, etc)
└── interfaces/
    ├── http/             # Express HTTP API
    │   ├── controllers/
    │   ├── middlewares/
    │   └── routes/
    └── cron/             # Scheduled jobs
```

## Setup

```bash
cp .env.example .env
npm install
npm run dev:http
```

## Scripts

- `npm run dev:http` — Development mode (HTTP)
- `npm run dev:cron` — Development mode (CRON)
- `npm run build` — Build TypeScript
- `npm start` — Run production
- `npm run lint` — Lint
- `npm run format` — Format code

## Example Endpoint

- `GET /v1/ping` — Health check
- `GET /v1/example` — List examples
- `POST /v1/example` — Create example `{ name, description? }`
- `GET /v1/example/:id` — Detail example
