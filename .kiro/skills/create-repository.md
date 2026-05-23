# Skill: Create Repository

## Deskripsi

Membuat repository layer baru untuk domain entity dengan operasi CRUD.

## Input yang Dibutuhkan

- Nama domain (contoh: "invoice", "notification")
- Operasi yang dibutuhkan (create, find, find-one, update, delete)
- Fields yang akan disimpan

## Steps

### 1. Buat Mongoose Model

File: `src/drivers/mongoose/models/<domain>.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose'

export type <Domain>Schema = Document & {
  field_name: string
  created_at: Date
}

const schema = new Schema(
  {
    field_name: { type: String, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
)

export const <Domain>Model = mongoose.model<<Domain>Schema>('<domain>', schema)
```

### 2. Buat Entity

File: `src/entities/<domain>.ts`

### 3. Buat Repository Files

Folder: `src/repositories/<domain>/`

- `create.ts`
- `find.ts`
- `find-one.ts`
- `update.ts`
- `delete.ts`
- `index.ts`

### 4. Index File Pattern

```typescript
import { Mixin } from 'ts-mixer'
import Create from './create'
import Find from './find'
import FindOne from './find-one'
import Update from './update'
import Delete from './delete'
import { <Domain>Model } from '../../drivers/mongoose/models/<domain>'

class <Domain>Repository extends Mixin(Create, Find, FindOne, Update, Delete) {
  constructor() {
    super(<Domain>Model)
  }
}

export = <Domain>Repository
```
