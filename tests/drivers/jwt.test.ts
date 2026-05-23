import JwtDriver from '../../src/drivers/jwt'

describe('JwtDriver', () => {
  it('signs and verifies a token round-trip', () => {
    const driver = new JwtDriver()
    const token = driver.sign({ payload: { sub: 'user-1', role: 'admin' } })

    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3)

    const decoded = driver.verify<{ sub: string; role: string }>(token)
    expect(decoded.sub).toBe('user-1')
    expect(decoded.role).toBe('admin')
  })

  it('throws on invalid token', () => {
    const driver = new JwtDriver()
    expect(() => driver.verify('not-a-token')).toThrow()
  })
})
