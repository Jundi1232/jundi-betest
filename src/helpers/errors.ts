export class CustomError extends Error {
  code: string | undefined
  message: string
  details: unknown
  constructor(params: { code?: string; message: string; details?: unknown }) {
    super()
    this.code = params.code
    this.message = params.message
    this.details = params.details
  }
}
