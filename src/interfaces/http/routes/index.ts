import express from 'express'
import ping from './v1/ping'
import auth from './v1/auth'
import user from './v1/user'

const routers = express.Router()

routers.get('/', (_req: any, res: any) =>
  res.send(`API Service for ${process.env.NODE_ENV}`),
)

routers.get('/healthz', (_req: any, res: any) =>
  res.status(200).json({ status: 'ok' }),
)

routers.use('/v1/ping', ping())
routers.use('/v1/auth', auth())
routers.use('/v1/users', user())

export = routers
