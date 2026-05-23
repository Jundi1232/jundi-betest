import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken'

type SignParams = {
  payload: string | object | Buffer
  expiresIn?: string | number
}

class JwtDriver {
  secret: string
  defaultExpiresIn: string

  constructor() {
    this.secret = process.env.JWT_SECRET || 'change-me'
    this.defaultExpiresIn = process.env.JWT_EXPIRES_IN || '1h'
  }

  sign(params: SignParams): string {
    const options: SignOptions = {
      expiresIn: (params.expiresIn ||
        this.defaultExpiresIn) as SignOptions['expiresIn'],
    }
    return jwt.sign(params.payload, this.secret, options)
  }

  verify<T = JwtPayload>(token: string): T {
    return jwt.verify(token, this.secret) as T
  }
}

export = JwtDriver
