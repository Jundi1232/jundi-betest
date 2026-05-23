import ExampleRepository from '../../repositories/example'
import { ExampleModel } from '../../drivers/mongoose/models/example'
import { CustomError } from '../../helpers/errors'

class Detail {
  exampleRepo: ExampleRepository

  constructor() {
    this.exampleRepo = new ExampleRepository(ExampleModel)
  }

  async detail(id: string) {
    const result = await this.exampleRepo.findOne(id)

    if (!result) {
      throw new CustomError({
        code: 'NOT_FOUND',
        message: 'Example not found',
      })
    }

    return result
  }
}

export = Detail
