import express from 'express'

const routers = () => {
  const router = express.Router()

  router.get('/', (req, res) => {
    res.json({ message: 'pong', timestamp: new Date().toISOString() })
  })

  return router
}

export = routers
