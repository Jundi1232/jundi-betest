declare global {
  type Meta = {
    page: number
    perPage: number
    totalPage: number
    total: number
  }
  type HttpResponse = {
    message: string
    meta: Meta | null
    data: any
  }
}

export = {}
