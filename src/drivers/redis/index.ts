import Redis from 'ioredis'

export let redisClient: Redis

export const connectRedis = () => {
  redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD,
    keyPrefix: process.env.REDIS_PREFIX,
  })

  redisClient.on('connect', () => {
    console.log('[redis] connected')
  })

  redisClient.on('error', (err) => {
    console.error('[redis] error:', err.message)
  })

  return redisClient
}
