import express from 'express'
import ping from './v1/ping'
import example from './v1/example'

const routers = express.Router()

routers.get('/', (req: any, res: any) =>
  res.send(`API Service for ${process.env.NODE_ENV}`),
)

routers.use('/v1/ping', ping())
routers.use('/v1/example', example())

export = routers
