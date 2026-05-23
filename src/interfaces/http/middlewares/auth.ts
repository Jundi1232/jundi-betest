import { NextFunction, Request, Response } from 'express'
import httpErrors from 'http-errors'
import JwtDriver from '../../../drivers/jwt'

const auth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization
    if (!header) {
      throw httpErrors.Unauthorized('Authorization header is required')
    }

    const token = header.replace(/bearer/gi, '').trim()
    if (!token) {
      throw httpErrors.Unauthorized('Token is required')
    }

    const jwtDriver = new JwtDriver()
    const decoded = jwtDriver.verify(token)
    req.user = decoded

    next()
  } catch (error: any) {
    if (error?.status) return next(error)
    return next(httpErrors.Unauthorized(error?.message || 'Unauthorized'))
  }
}

export = auth
