import { Mixin } from 'ts-mixer'
import Create from './create'
import Find from './find'
import { ExampleModel } from '../../drivers/mongoose/models/example'

class ExampleRepository extends Mixin(Create, Find) {
  constructor(model: typeof ExampleModel) {
    super(model)
  }
}

export = ExampleRepository
