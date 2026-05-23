import z from 'zod'
import { NextFunction, Request, Response } from 'express'
import ExampleUsecase from '../../../../../usecases/example'

const createValidator = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
})

const createController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await createValidator.parseAsync(req.body)
    const usecase = new ExampleUsecase()
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
