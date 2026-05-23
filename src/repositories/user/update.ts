import { UserModel } from '../../drivers/mongoose/models/user'
import { toUserEntity } from '../../entities/user'

type ParamsUpdate = {
  userName?: string
  accountNumber?: string
  emailAddress?: string
  identityNumber?: string
}

class Update {
  model: typeof UserModel

  constructor(model: typeof UserModel) {
    this.model = model
  }

  async update(id: string, params: ParamsUpdate) {
    const payload: Record<string, unknown> = {}
    if (params.userName !== undefined) payload.user_name = params.userName
    if (params.accountNumber !== undefined) {
      payload.account_number = params.accountNumber
    }
    if (params.emailAddress !== undefined) {
      payload.email_address = params.emailAddress
    }
    if (params.identityNumber !== undefined) {
      payload.identity_number = params.identityNumber
    }

    const result = await this.model.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    })
    return toUserEntity(result)
  }
}

export = Update
