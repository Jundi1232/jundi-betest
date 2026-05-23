import { Mixin } from 'ts-mixer'
import Create from './create'
import Find from './find'
import Update from './update'
import Delete from './delete'
import { UserModel } from '../../drivers/mongoose/models/user'

class UserRepository extends Mixin(Create, Find, Update, Delete) {
  constructor(model: typeof UserModel) {
    super(model)
  }
}

export = UserRepository
