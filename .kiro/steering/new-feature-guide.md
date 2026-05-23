---
inclusion: manual
---

# Panduan Membuat Feature Baru

## Langkah-langkah

### 1. Buat Entity (`src/entities/`)

Definisikan domain type dan mapper function.

```typescript
// src/entities/example.ts
export type ExampleEntity = {
  id?: string
  name: string
  status: string
  createdAt?: string
}

export const toExampleEntity = (
  params: ExampleSchema | null,
): ExampleEntity | null => {
  if (!params) return null
  return {
    id: params.id,
    name: params.name,
    status: params.status,
    createdAt: params.createdAt?.toISOString(),
  }
}
```

### 2. Buat Mongoose Model (`src/drivers/mongoose/models/`)

Definisikan schema MongoDB.

### 3. Buat Repository (`src/repositories/<domain>/`)

Buat folder dengan file per operasi: `create.ts`, `find.ts`, `update.ts`, `delete.ts`, `index.ts`

### 4. Buat Usecase (`src/usecases/<domain>/`)

Buat folder dengan file per business action + `index.ts` yang menggunakan ts-mixer Mixin.

### 5. Buat Controller (`src/interfaces/http/controllers/<version>/<domain>/`)

Satu file per endpoint action. Gunakan Zod validation.

### 6. Buat Route (`src/interfaces/http/routes/<version>/<domain>.ts`)

Register controller methods ke Express Router.

## Checklist

- [ ] Entity type + mapper function
- [ ] Mongoose model (jika perlu DB)
- [ ] Repository class (jika perlu DB)
- [ ] Usecase class dengan Mixin
- [ ] Controller dengan Zod validation
- [ ] Route registration
- [ ] Error handling dengan CustomError
