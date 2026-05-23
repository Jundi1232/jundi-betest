# Skill: Create New API Endpoint

## Deskripsi

Membuat endpoint API baru lengkap dari route hingga usecase.

## Input yang Dibutuhkan

- Nama domain (contoh: "payment", "notification")
- HTTP method dan path
- Request body / query params
- Business logic yang diinginkan
- API version (v1/v2/v3)

## Steps

### 1. Entity

Buat file `src/entities/<domain>.ts`:

- Definisikan `type <Domain>Entity`
- Buat mapper `to<Domain>Entity()`

### 2. Repository (jika perlu DB)

Buat folder `src/repositories/<domain>/`:

- `create.ts` - Create operation
- `find.ts` - Find/list operation
- `find-one.ts` - Find single record
- `update.ts` - Update operation
- `delete.ts` - Delete operation
- `index.ts` - Export composed class

### 3. Usecase

Buat folder `src/usecases/<domain>/`:

- `<action>.ts` - Business logic per action
- `index.ts` - Mixin class yang compose semua actions

### 4. Controller

Buat folder `src/interfaces/http/controllers/<version>/<domain>/`:

- `<action>.ts` - Handler dengan Zod validation
- `index.ts` - Export semua handlers

### 5. Route

Buat file `src/interfaces/http/routes/<version>/<domain>.ts`:

- Register routes ke Express Router
- Apply middlewares jika perlu

## Template Controller

```typescript
import z from 'zod'
import { NextFunction, Request, Response } from 'express'
import DomainUsecase from '../../../../../usecases/<domain>'

const validator = z.object({
  // define fields
})

const handler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await validator.parseAsync(req.body)
    const usecase = new DomainUsecase()
    const result = await usecase.action(data)

    const response: HttpResponse = {
      message: 'OK',
      meta: null,
      data: result,
    }
    res.send(response)
  } catch (error) {
    next(error)
  }
}

export = handler
```

## Template Route

```typescript
import express from 'express'
import controller from '../../controllers/<version>/<domain>'
import auth from '../../middlewares/auth'

const routers = () => {
  const router = express.Router()
  router.get('/', auth, controller.list)
  router.post('/', auth, controller.create)
  router.get('/:id', auth, controller.detail)
  return router
}

export = routers
```
