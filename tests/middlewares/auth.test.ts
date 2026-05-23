import auth from '../../src/interfaces/http/middlewares/auth'
import JwtDriver from '../../src/drivers/jwt'

const runMiddleware = (req: any) => {
  return new Promise<{ err: any; req: any }>((resolve) => {
    auth(req, {} as any, (err: any) => resolve({ err, req }))
  })
}

describe('auth middleware', () => {
  it('rejects when authorization header is missing', async () => {
    const { err } = await runMiddleware({ headers: {} })
    expect(err).toBeDefined()
    expect(err.status).toBe(401)
  })

  it('rejects an invalid token', async () => {
    const { err } = await runMiddleware({
      headers: { authorization: 'Bearer invalid.token.here' },
    })
    expect(err).toBeDefined()
    expect(err.status).toBe(401)
  })

  it('passes through when token is valid and attaches decoded user', async () => {
    const token = new JwtDriver().sign({ payload: { sub: 'u1' } })
    const { err, req } = await runMiddleware({
      headers: { authorization: `Bearer ${token}` },
    })
    expect(err).toBeUndefined()
    expect(req.user).toBeDefined()
    expect(req.user.sub).toBe('u1')
  })
})
