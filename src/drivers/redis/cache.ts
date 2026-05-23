import { Redis } from 'ioredis'
import { redisClient } from './index'

class CacheDriver {
  client: Redis
  defaultTtl: number

  constructor(client?: Redis) {
    this.client = client || redisClient
    this.defaultTtl = Number(process.env.CACHE_TTL_SECONDS || 300)
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    const raw = await this.client.get(key)
    if (!raw) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return raw as unknown as T
    }
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const payload =
      typeof value === 'string' ? value : JSON.stringify(value ?? null)
    await this.client.set(key, payload, 'EX', ttl ?? this.defaultTtl)
  }

  async del(...keys: string[]): Promise<void> {
    if (keys.length === 0) return
    await this.client.del(...keys)
  }
}

export = CacheDriver
