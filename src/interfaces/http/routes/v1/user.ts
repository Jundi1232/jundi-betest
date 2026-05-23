import express from 'express'
import userController from '../../controllers/v1/user'
import auth from '../../middlewares/auth'

const routers = () => {
  const router = express.Router()

  router.use(auth)

  router.get('/', userController.list)
  router.post('/', userController.create)
  router.get(
    '/account-number/:accountNumber',
    userController.detailByAccountNumber,
  )
  router.get(
    '/identity-number/:identityNumber',
    userController.detailByIdentityNumber,
  )
  router.get('/:id', userController.detail)
  router.put('/:id', userController.update)
  router.delete('/:id', userController.remove)

  return router
}

export = routers
