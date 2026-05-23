import { Mixin } from 'ts-mixer'
import List from './list'
import Create from './create'
import Detail from './detail'

class ExampleUsecase extends Mixin(class {}, List, Create, Detail) {
  constructor() {
    super()
  }
}

export = ExampleUsecase
