---
inclusion: fileMatch
fileMatchPattern: 'src/drivers/mongoose/**,src/repositories/**'
---

# Database Patterns

## MongoDB (Mongoose)

### Model Definition

- Models didefinisikan di `src/drivers/mongoose/models/`
- Gunakan Mongoose Schema dengan TypeScript type untuk schema
- Export model dan schema type

### Repository Rules

- Repository class menerima model via constructor
- Satu file per operasi CRUD
- Selalu return entity yang sudah di-map (bukan raw document)
- Gunakan `toXxxEntity()` mapper dari entities folder
- Index file mengexport composed class

### Naming Convention

- DB fields: snake_case (`transaction_id`, `created_at`)
- Entity fields: camelCase (`transactionId`, `createdAt`)
- Mapper function: `toXxxEntity()`

### Query Patterns

```typescript
// Find with filter
async find(filter: FilterType) {
  const results = await this.model.find(filter)
  return results.map(toXxxEntity)
}

// Upsert pattern
async createOrUpdate(id: string, params: ParamsType) {
  const result = await this.model.findOneAndUpdate(
    { _id: id },
    { $set: { /* mapped fields */ } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )
  return toXxxEntity(result)
}
```

## Redis

- Helper functions di `src/helpers/redis/`
- Operasi: get, set, delete, increment, get-timeout
- Driver connection di `src/drivers/redis/`
