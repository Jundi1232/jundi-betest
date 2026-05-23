import ExampleRepository from '../../repositories/example'
import { ExampleModel } from '../../drivers/mongoose/models/example'

class List {
  exampleRepo: ExampleRepository

  constructor() {
    this.exampleRepo = new ExampleRepository(ExampleModel)
  }

  async list() {
    return this.exampleRepo.find()
  }
}

export = List
