import { UserModel } from '../../drivers/mongoose/models/user'
import { toUserEntity } from '../../entities/user'

type ParamsCreate = {
  userName: string
  accountNumber: string
  emailAddress: string
  identityNumber: string
}

class Create {
  model: typeof UserModel

  constructor(model: typeof UserModel) {
    this.model = model
  }

  async create(params: ParamsCreate) {
    const result = await this.model.create({
      user_name: params.userName,
      account_number: params.accountNumber,
      email_address: params.emailAddress,
      identity_number: params.identityNumber,
    })
    return toUserEntity(result)
  }
}

export = Create
