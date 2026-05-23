import express from 'express'
import helmet from 'helmet'
import requestIp from 'request-ip'
import cors from 'cors'
import httpErrors from 'http-errors'
import errorHandler from './middlewares/error-handler'
import routers from './routes'

const port = process.env.HTTP_PORT || 3000
const basePath = process.env.BASE_PATH || '/'

const run = () => {
  const corsOptions = {
    origin: String(process.env.CORS || '').split(','),
    optionsSuccessStatus: 200,
  }
  const app = express()
  app.use(helmet())
  app.use(cors(corsOptions))
  app.use(requestIp.mw())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(basePath, routers)
  app.use((req, res, next) => {
    next(httpErrors.NotFound())
  })
  app.use(errorHandler)

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
  })
}

export = run
