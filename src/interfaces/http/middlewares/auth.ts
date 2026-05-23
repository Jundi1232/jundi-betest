import { NextFunction, Request, Response } from 'express'
import httpErrors from 'http-errors'

const auth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace(/bearer/gi, '').trim()

    if (!token) {
      throw httpErrors.Unauthorized('Token is required')
    }

    // TODO: verify token logic here
    // req.user = decoded

    next()
  } catch (error) {
    next(httpErrors.Unauthorized('Unauthorized'))
  }
}

export = auth
