# Skill: Create Express Middleware

## Deskripsi

Membuat middleware baru untuk HTTP interface.

## Input yang Dibutuhkan

- Nama middleware
- Tujuan (auth, logging, rate-limit, dll)
- Logic yang dijalankan

## Steps

### 1. Buat Middleware File

Path: `src/interfaces/http/middlewares/<middleware-name>.ts`

```typescript
import { NextFunction, Request, Response } from 'express'
import httpErrors from 'http-errors'

const middlewareName = (req: Request, res: Response, next: NextFunction) => {
  try {
    // middleware logic
    next()
  } catch (error) {
    next(httpErrors.Unauthorized('Unauthorized'))
  }
}

export = middlewareName
```

### 2. Apply di Route

```typescript
import middlewareName from '../../middlewares/<middleware-name>'

router.get('/protected', middlewareName, controller.action)
```

## Catatan

- Middleware untuk auth biasanya check header Authorization
- Gunakan `httpErrors` untuk HTTP error responses
- Selalu panggil `next()` untuk lanjut ke handler berikutnya
- Gunakan `next(error)` untuk forward error ke error-handler
