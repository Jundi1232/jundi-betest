# Skill: Create Cron Job

## Deskripsi

Membuat scheduled job baru yang berjalan pada interface CRON.

## Input yang Dibutuhkan

- Nama job
- Schedule (cron expression)
- Business logic yang dijalankan

## Steps

### 1. Buat Controller

Path: `src/interfaces/cron/controllers/<job-name>.ts`

```typescript
import cron from 'node-cron'

const jobName = () => {
  cron.schedule('<cron-expression>', async () => {
    try {
      // business logic here
      console.log('[CRON] <job-name> executed')
    } catch (error) {
      console.error('[CRON] <job-name> failed:', error)
    }
  })
}

export = jobName
```

### 2. Register di Cron Index

File: `src/interfaces/cron/index.ts`

Tambahkan import dan panggil function job.

## Cron Expression Reference

- `* * * * *` - Setiap menit
- `0 * * * *` - Setiap jam
- `0 0 * * *` - Setiap hari jam 00:00
- `0 */6 * * *` - Setiap 6 jam
- `0 0 * * 1` - Setiap Senin jam 00:00
