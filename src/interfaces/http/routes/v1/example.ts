import express from 'express'
import exampleController from '../../controllers/v1/example'

const routers = () => {
  const router = express.Router()

  router.get('/', exampleController.list)
  router.post('/', exampleController.create)
  router.get('/:id', exampleController.detail)

  return router
}

export = routers
