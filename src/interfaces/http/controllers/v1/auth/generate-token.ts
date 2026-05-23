import z from 'zod'
import { NextFunction, Request, Response } from 'express'
import UserUsecase from '../../../../../usecases/user'

const generateTokenValidator = z
  .object({
    accountNumber: z.string().min(1).optional(),
    identityNumber: z.string().min(1).optional(),
  })
  .refine((v) => !!(v.accountNumber || v.identityNumber), {
    message: 'accountNumber or identityNumber is required',
  })

const generateTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await generateTokenValidator.parseAsync(req.body)
    const usecase = new UserUsecase()
    const result = await usecase.generateToken(data)

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

export = generateTokenController
