import { Mixin } from 'ts-mixer'
import List from './list'
import Create from './create'
import Detail from './detail'
import Update from './update'
import Delete from './delete'
import GenerateToken from './generate-token'

class UserUsecase extends Mixin(
  class {},
  List,
  Create,
  Detail,
  Update,
  Delete,
  GenerateToken,
) {
  constructor() {
    super()
  }
}

export = UserUsecase
