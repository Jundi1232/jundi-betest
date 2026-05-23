import z from 'zod'
import { NextFunction, Request, Response } from 'express'
import UserUsecase from '../../../../../usecases/user'

const createValidator = z.object({
  userName: z.string().min(1),
  accountNumber: z.string().min(1),
  emailAddress: z.string().email(),
  identityNumber: z.string().min(1),
})

const createController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await createValidator.parseAsync(req.body)
    const usecase = new UserUsecase()
    const result = await usecase.create(data)

    const response: HttpResponse = {
      message: 'Created',
      meta: null,
      data: result,
    }
    res.status(201).send(response)
  } catch (error) {
    next(error)
  }
}

export = createController
