import express from 'express'
import authController from '../../controllers/v1/auth'

const routers = () => {
  const router = express.Router()

  router.post('/token', authController.generateToken)

  return router
}

export = routers
