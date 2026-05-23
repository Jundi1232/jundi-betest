---
inclusion: always
---

# Coding Standards

## TypeScript Rules

### Exports

- Gunakan `export =` untuk default export (CommonJS-compatible)
- Contoh:

```typescript
class MyClass { ... }
export = MyClass
```

### Types

- Gunakan `type` bukan `interface` (enforced by ESLint)

```typescript
type ParamsCreate = {
  name: string
  age: number
}
```

### Validation

- Gunakan Zod untuk request validation di controller

```typescript
const validator = z.object({
  field_name: z.string(),
})
const data = await validator.parseAsync(req.body)
```

### Naming

- Variables/functions: camelCase
- Classes/Types: PascalCase
- DB fields: snake_case
- Files: kebab-case (contoh: `create-patient.ts`)
- Folders: kebab-case

### Error Handling

- Selalu wrap controller logic dalam try-catch
- Gunakan `next(error)` untuk forward error ke middleware
- Gunakan `CustomError` dari `src/helpers/errors.ts` untuk business errors

```typescript
import { CustomError } from '../helpers/errors'
throw new CustomError({ code: 'ERR_001', message: 'Something went wrong' })
```

## File Patterns

### Controller Pattern

```typescript
import z from 'zod'
import { NextFunction, Request, Response } from 'express'

const validator = z.object({
  /* ... */
})

const handler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await validator.parseAsync(req.body)
    const usecase = new SomeUsecase()
    const result = await usecase.doSomething(data)

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

### Usecase Pattern

```typescript
import { Mixin } from 'ts-mixer'
import ActionA from './action-a'
import ActionB from './action-b'
import SomeDriver from '../../drivers/some-driver'

class DomainUsecase extends Mixin(class {}, ActionA, ActionB) {
  driver: SomeDriver
  constructor() {
    super()
    this.driver = new SomeDriver()
  }
}

export = DomainUsecase
```

### Repository Pattern

```typescript
import { SomeModel } from '../../drivers/mongoose/models/some-model'
import { toSomeEntity } from '../../entities/some-entity'

type ParamsCreate = {
  /* ... */
}

class Create {
  model: typeof SomeModel
  constructor(model: typeof SomeModel) {
    this.model = model
  }

  async create(params: ParamsCreate) {
    const result = await this.model.create({
      /* mapped fields */
    })
    return toSomeEntity(result)
  }
}

export = Create
```

### Route Pattern

```typescript
import express from 'express'
import controller from '../../controllers/v1/domain'

const routers = () => {
  const router = express.Router()
  router.get('/', controller.list)
  router.post('/', controller.create)
  router.get('/:id', controller.detail)
  return router
}

export = routers
```

### Entity Pattern

```typescript
export type SomeEntity = {
  id?: string
  name: string
  createdAt?: string
}

export const toSomeEntity = (params: SomeSchema | null): SomeEntity | null => {
  if (!params) return null
  return {
    id: params.id,
    name: params.name,
    createdAt: params.createdAt?.toISOString(),
  }
}
```

## Formatting (Prettier)

- Print width: 80
- Single quotes: true
- Trailing comma: all
- Semicolons: false
