import { NextFunction, Request, Response } from 'express'
import UserUsecase from '../../../../../usecases/user'

const deleteController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params
    const usecase = new UserUsecase()
    const result = await usecase.delete(id)

    const response: HttpResponse = {
      message: 'Deleted',
      meta: null,
      data: result,
    }
    res.send(response)
  } catch (error) {
    next(error)
  }
}

export = deleteController
