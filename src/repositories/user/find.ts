import { UserModel } from '../../drivers/mongoose/models/user'
import { toUserEntity } from '../../entities/user'

class Find {
  model: typeof UserModel

  constructor(model: typeof UserModel) {
    this.model = model
  }

  async find() {
    const results = await this.model.find().sort({ createdAt: -1 })
    return results.map(toUserEntity)
  }

  async findById(id: string) {
    const result = await this.model.findById(id)
    return toUserEntity(result)
  }

  async findByAccountNumber(accountNumber: string) {
    const result = await this.model.findOne({ account_number: accountNumber })
    return toUserEntity(result)
  }

  async findByIdentityNumber(identityNumber: string) {
    const result = await this.model.findOne({
      identity_number: identityNumber,
    })
    return toUserEntity(result)
  }

  async findByEmailAddress(emailAddress: string) {
    const result = await this.model.findOne({
      email_address: emailAddress.toLowerCase(),
    })
    return toUserEntity(result)
  }
}

export = Find
