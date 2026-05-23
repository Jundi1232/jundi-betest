import Redis, { RedisOptions } from 'ioredis'

export let redisClient: Redis

export const connectRedis = () => {
  const options: RedisOptions = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD,
    keyPrefix: process.env.REDIS_PREFIX,
  }

  if (String(process.env.REDIS_TLS).toLowerCase() === 'true') {
    options.tls = {}
  }

  redisClient = new Redis(options)

  redisClient.on('connect', () => {
    console.log('[redis] connected')
  })

  redisClient.on('error', (err) => {
    console.error('[redis] error:', err.message)
  })

  return redisClient
}
