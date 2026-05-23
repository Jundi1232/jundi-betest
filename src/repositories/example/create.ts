import { ExampleModel } from '../../drivers/mongoose/models/example'
import { toExampleEntity } from '../../entities/example'

type ParamsCreate = {
  name: string
  description?: string
}

class Create {
  model: typeof ExampleModel

  constructor(model: typeof ExampleModel) {
    this.model = model
  }

  async create(params: ParamsCreate) {
    const result = await this.model.create({
      name: params.name,
      description: params.description,
    })
    return toExampleEntity(result)
  }
}

export = Create
