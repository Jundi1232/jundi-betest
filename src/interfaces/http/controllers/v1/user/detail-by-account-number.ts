import { NextFunction, Request, Response } from 'express'
import UserUsecase from '../../../../../usecases/user'

const detailByAccountNumberController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { accountNumber } = req.params
    const usecase = new UserUsecase()
    const result = await usecase.detailByAccountNumber(accountNumber)

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

export = detailByAccountNumberController
