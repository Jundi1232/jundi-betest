# Skill: Create External Driver

## Deskripsi

Membuat driver/adapter baru untuk integrasi dengan external service (API, third-party, dll).

## Input yang Dibutuhkan

- Nama service (contoh: "payment-gateway", "email-service")
- Base URL / endpoint
- Methods yang dibutuhkan
- Authentication type (jika ada)

## Steps

### 1. Buat Driver Folder

Path: `src/drivers/<service-name>/`

### 2. Buat Index File

```typescript
import axios, { AxiosInstance } from 'axios'
import ActionA from './action-a'
import ActionB from './action-b'
import { Mixin } from 'ts-mixer'

class <ServiceName> extends Mixin(class {}, ActionA, ActionB) {
  client: AxiosInstance

  constructor() {
    super()
    this.client = axios.create({
      baseURL: process.env.<SERVICE_NAME>_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export = <ServiceName>
```

### 3. Buat Action Files

Satu file per operasi/endpoint:

```typescript
// src/drivers/<service-name>/action-a.ts
class ActionA {
  client: any

  async actionA(params: ParamsType) {
    const { data } = await this.client.post('/endpoint', params)
    return data
  }
}

export = ActionA
```

## Catatan

- Selalu gunakan environment variables untuk base URL dan credentials
- Handle error dari external service dengan try-catch
- Log request/response jika diperlukan untuk debugging
