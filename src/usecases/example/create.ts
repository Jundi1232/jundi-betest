import ExampleRepository from '../../repositories/example'
import { ExampleModel } from '../../drivers/mongoose/models/example'

type ParamsCreate = {
  name: string
  description?: string
}

class Create {
  exampleRepo: ExampleRepository

  constructor() {
    this.exampleRepo = new ExampleRepository(ExampleModel)
  }

  async create(params: ParamsCreate) {
    return this.exampleRepo.create(params)
  }
}

export = Create
