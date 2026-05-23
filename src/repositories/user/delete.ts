import { UserModel } from '../../drivers/mongoose/models/user'
import { toUserEntity } from '../../entities/user'

class Delete {
  model: typeof UserModel

  constructor(model: typeof UserModel) {
    this.model = model
  }

  async delete(id: string) {
    const result = await this.model.findByIdAndDelete(id)
    return toUserEntity(result)
  }
}

export = Delete
