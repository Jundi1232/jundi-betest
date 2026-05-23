---
inclusion: always
---

# Project Architecture - Express TypeScript Basecode

## Overview
Basecode ini adalah template backend service berbasis **TypeScript + Express.js** dengan arsitektur **Clean Architecture** (layered). Bisa digunakan untuk membuat berbagai macam program/service.

## Tech Stack
- Runtime: Node.js + TypeScript
- Framework: Express.js
- Database: MongoDB (Mongoose 7.x)
- Cache: Redis (ioredis)
- Validation: Zod
- Linting: ESLint (airbnb-typescript) + Prettier
- Mixin: ts-mixer (untuk compose usecase)

## Struktur Folder

```
src/
├── index.ts              # Entry point, switch interface (HTTP/CRON)
├── definitions/          # Global type definitions
├── entities/             # Domain entities + mapper functions (toXxxEntity)
├── usecases/             # Business logic (per domain, ts-mixer Mixin)
├── repositories/         # Data access layer (CRUD via Mongoose models)
├── drivers/              # External adapters (MongoDB, Redis, third-party APIs)
├── helpers/              # Utilities (errors, etc)
└── interfaces/
    ├── http/             # Public HTTP API
    │   ├── controllers/  # Request handlers (v1/)
    │   ├── middlewares/  # Express middlewares
    │   └── routes/       # Route definitions (v1/)
    └── cron/             # Scheduled jobs
```

## Pola & Konvensi

### Routes
- File route mengembalikan function yang return `express.Router()`
- Versioning: `/v1/`

### Controllers
- Satu file per action (list.ts, create.ts, detail.ts)
- Index file mengexport semua actions sebagai object
- Pattern: validate (Zod) → instantiate usecase → call method → return response
- Response format: `{ message, meta, data }`

### Usecases
- Menggunakan `ts-mixer` Mixin untuk compose multiple capabilities
- Satu file per business action

### Repositories
- Satu folder per domain entity
- Satu file per operasi (create.ts, find.ts, update.ts, delete.ts)
- Class-based, menerima Mongoose model via constructor
- Return entity yang sudah di-map via `toXxxEntity()`

### Entities
- Type definitions untuk domain objects
- Mapper functions: `toXxxEntity(dbSchema) → Entity`

### Drivers
- Adapter untuk external services
- Class-based dengan methods per operasi

### Error Handling
- Custom `CustomError` class dengan `code`, `message`, `details`
- Zod validation errors di-handle di error-handler middleware

## Environment Variables
- `INTERFACE`: HTTP | CRON
- `HTTP_PORT`: Port server (default: 3000)
- `BASE_PATH`: Base path API
- `CORS`: Comma-separated allowed origins
- `NODE_ENV`: Environment name
- `MONGODB_URI`: MongoDB connection string
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_PREFIX`: Redis config

## Build & Run
- Build: `npm run build`
- Dev: `npm run dev:http` atau `npm run dev:cron`
- Lint: `npm run lint`
- Format: `npm run format`
