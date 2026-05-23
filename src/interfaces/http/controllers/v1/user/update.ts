import z from 'zod'
import { NextFunction, Request, Response } from 'express'
import UserUsecase from '../../../../../usecases/user'

const updateValidator = z
  .object({
    userName: z.string().min(1).optional(),
    accountNumber: z.string().min(1).optional(),
    emailAddress: z.string().email().optional(),
    identityNumber: z.string().min(1).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: 'At least one field is required',
  })

const updateController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params
    const data = await updateValidator.parseAsync(req.body)
    const usecase = new UserUsecase()
    const result = await usecase.update(id, data)

    const response: HttpResponse = {
      message: 'Updated',
      meta: null,
      data: result,
    }
    res.send(response)
  } catch (error) {
    next(error)
  }
}

export = updateController
