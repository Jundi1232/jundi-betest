import { ExampleModel } from '../../drivers/mongoose/models/example'
import { toExampleEntity } from '../../entities/example'

class Find {
  model: typeof ExampleModel

  constructor(model: typeof ExampleModel) {
    this.model = model
  }

  async find() {
    const results = await this.model.find()
    return results.map(toExampleEntity)
  }

  async findOne(id: string) {
    const result = await this.model.findById(id)
    return toExampleEntity(result)
  }
}

export = Find
