import { NextFunction, Request, Response } from 'express'
import ExampleUsecase from '../../../../../usecases/example'

const detailController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params
    const usecase = new ExampleUsecase()
    const result = await usecase.detail(id)

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

export = detailController
