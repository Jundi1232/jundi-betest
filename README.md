# ms-yourname-betest

User CRUD microservice (Node.js + Express + TypeScript) with JWT authorization
and Redis cache strategy. Built on top of a Clean Architecture basecode.

> Replace `yourname` placeholder in `package.json`, `.env`, `docker-compose.yml`,
> and Mongo/Redis prefixes with your actual name before submitting.

## Tech Stack

- Node.js + TypeScript
- Express.js
- MongoDB (Mongoose)
- Redis (ioredis)
- JWT (jsonwebtoken)
- Zod for request validation
- Jest + ts-jest for unit tests

## Project Structure

```
src/
├── definitions/         # Global types
├── entities/            # Domain entities + mappers
│   └── user.ts
├── usecases/user/       # Business logic per action
├── repositories/user/   # Data access (Mongoose)
├── drivers/
│   ├── jwt/             # JWT sign/verify
│   ├── mongoose/        # Mongo connection + models
│   └── redis/           # Redis client + cache helper
├── helpers/errors.ts    # CustomError
└── interfaces/http/
    ├── controllers/v1/
    │   ├── auth/
    │   └── user/
    ├── middlewares/
    └── routes/v1/
```

## Setup

```bash
cp .env.example .env
npm install
npm run dev:http
```

Make sure MongoDB and Redis are reachable using the values in `.env`.

## Scripts

- `npm run dev:http` — Watch mode, HTTP interface
- `npm run build` — Compile TypeScript
- `npm start` — Run compiled output
- `npm test` — Run unit tests
- `npm run lint` — ESLint
- `npm run format` — Prettier

## Environment Variables

| Key                 | Description                                |
| ------------------- | ------------------------------------------ |
| `INTERFACE`         | `HTTP` or `CRON`                           |
| `HTTP_PORT`         | HTTP port (default 3000)                   |
| `BASE_PATH`         | API base path                              |
| `CORS`              | Comma-separated allowed origins            |
| `MONGODB_URI`       | Mongo connection string                    |
| `REDIS_HOST/PORT`   | Redis host/port                            |
| `REDIS_PASSWORD`    | Optional                                   |
| `REDIS_PREFIX`      | Key prefix (e.g. `redis_yourname_betest:`) |
| `JWT_SECRET`        | JWT signing secret                         |
| `JWT_EXPIRES_IN`    | Token expiry (e.g. `1h`)                   |
| `CACHE_TTL_SECONDS` | Default cache TTL                          |
| `KAFKA_ENABLED`     | `true` to publish user events              |
| `KAFKA_BROKERS`     | Comma-separated brokers                    |
| `KAFKA_CLIENT_ID`   | Client id (e.g. `ms-yourname-betest`)      |
| `KAFKA_USER_TOPIC`  | Topic name (e.g. `kafka_yourname_betest`)  |

## API

### Auth

| Method | Path             | Auth | Body                                          |
| ------ | ---------------- | ---- | --------------------------------------------- |
| POST   | `/v1/auth/token` | —    | `{ accountNumber }` _or_ `{ identityNumber }` |

Response: `{ message, meta, data: { token, user } }`

### Users (all routes require `Authorization: Bearer <token>`)

| Method | Path                                        | Notes                   |
| ------ | ------------------------------------------- | ----------------------- |
| GET    | `/v1/users`                                 | List all users (cached) |
| POST   | `/v1/users`                                 | Create user             |
| GET    | `/v1/users/:id`                             | Get by `_id`            |
| GET    | `/v1/users/account-number/:accountNumber`   | Get by accountNumber    |
| GET    | `/v1/users/identity-number/:identityNumber` | Get by identityNumber   |
| PUT    | `/v1/users/:id`                             | Partial update          |
| DELETE | `/v1/users/:id`                             | Delete                  |

User payload:

```json
{
  "userName": "string",
  "accountNumber": "string",
  "emailAddress": "string (email)",
  "identityNumber": "string"
}
```

## Cache Strategy (Redis)

Read-through with key invalidation on writes.

- `user:list` — full list
- `user:id:<id>`
- `user:account_number:<accountNumber>`
- `user:identity_number:<identityNumber>`
- `user:email_address:<emailAddress>`

Write/update/delete invalidate the related keys.

## Database Constraints & Indexes

The `user` collection enforces unique indexes on:

- `account_number`
- `email_address`
- `identity_number`

Defined directly on the Mongoose schema (`src/drivers/mongoose/models/user.ts`).

## Run with Docker

```bash
docker compose up --build
```

This brings up MongoDB, Redis, Kafka, and the HTTP service on port 3000.

## Kafka Producer (optional)

When `KAFKA_ENABLED=true`, every successful user `create`, `update`, and
`delete` publishes an event to `KAFKA_USER_TOPIC` (default
`kafka_yourname_betest`):

```json
{ "event": "user.created", "data": { "id": "...", "userName": "...", ... } }
```

Publishing failures are logged but never break the request, so the API still
works when Kafka is down.

## Testing

```bash
npm test
```

Unit tests cover entity mapping, JWT driver, Redis cache helper, auth
middleware, and the user usecases (create, detail/cache, generate-token).
