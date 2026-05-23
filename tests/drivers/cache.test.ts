import CacheDriver from '../../src/drivers/redis/cache'

const makeFakeRedis = () => {
  const store = new Map<string, string>()
  return {
    store,
    client: {
      get: jest.fn(async (key: string) => store.get(key) ?? null),
      set: jest.fn(async (key: string, value: string) => {
        store.set(key, value)
        return 'OK'
      }),
      del: jest.fn(async (...keys: string[]) => {
        let count = 0
        keys.forEach((k) => {
          if (store.delete(k)) count += 1
        })
        return count
      }),
    } as any,
  }
}

describe('CacheDriver', () => {
  it('returns null when key is missing', async () => {
    const fake = makeFakeRedis()
    const cache = new CacheDriver(fake.client)
    await expect(cache.get('missing')).resolves.toBeNull()
  })

  it('serializes objects on set and parses on get', async () => {
    const fake = makeFakeRedis()
    const cache = new CacheDriver(fake.client)
    await cache.set('user:1', { id: '1', name: 'jane' }, 30)

    expect(fake.client.set).toHaveBeenCalledWith(
      'user:1',
      JSON.stringify({ id: '1', name: 'jane' }),
      'EX',
      30,
    )

    const result = await cache.get<{ id: string; name: string }>('user:1')
    expect(result).toEqual({ id: '1', name: 'jane' })
  })

  it('deletes multiple keys', async () => {
    const fake = makeFakeRedis()
    fake.store.set('a', '1')
    fake.store.set('b', '2')

    const cache = new CacheDriver(fake.client)
    await cache.del('a', 'b')

    expect(fake.client.del).toHaveBeenCalledWith('a', 'b')
    expect(fake.store.has('a')).toBe(false)
    expect(fake.store.has('b')).toBe(false)
  })

  it('does nothing on del when no keys provided', async () => {
    const fake = makeFakeRedis()
    const cache = new CacheDriver(fake.client)
    await cache.del()
    expect(fake.client.del).not.toHaveBeenCalled()
  })
})
