import { NextFunction, Request, Response } from 'express'
import ExampleUsecase from '../../../../../usecases/example'

const listController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const usecase = new ExampleUsecase()
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
