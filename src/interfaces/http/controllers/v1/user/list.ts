import { NextFunction, Request, Response } from 'express'
import UserUsecase from '../../../../../usecases/user'

const listController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const usecase = new UserUsecase()
    const result = await usecase.list()

    const response: HttpResponse = {
      message: 'OK',
      meta: null,
      data: result,
    }
    res.send(response)
  } catch (error) {
    next(error)
  }
}

export = listController
