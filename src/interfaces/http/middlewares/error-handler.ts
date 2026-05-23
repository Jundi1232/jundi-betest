import { ZodError } from 'zod'
import { CustomError } from '../../../helpers/errors'

const errorHandler = (err: any, req: any, res: any, _next: any) => {
  const { message } = err
  const { status } = err

  switch (true) {
    case err instanceof ZodError: {
      const vError = err?.issues?.[0]
      const errMessage = vError
        ? `"${vError.path?.[0] || '-'}" ${vError.message.toLowerCase()}`
        : 'Validation Error'

      return res.status(status || 400).json({
        status: false,
        message: errMessage,
        errors: err.issues,
      })
    }
    case err instanceof CustomError:
      return res.status(status || 400).json({
        status: false,
        code: (err as CustomError).code || '',
        message: (err as CustomError).message,
        errors: (err as CustomError).details || [],
      })
    default:
      return res.status(status || 500).json({
        status: false,
        message: message || 'Internal Server Error',
        errors: [],
      })
  }
}

export = errorHandler
