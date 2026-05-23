import { NextFunction, Request, Response } from 'express'
import UserUsecase from '../../../../../usecases/user'

const detailByIdentityNumberController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { identityNumber } = req.params
    const usecase = new UserUsecase()
    const result = await usecase.detailByIdentityNumber(identityNumber)

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

export = detailByIdentityNumberController
