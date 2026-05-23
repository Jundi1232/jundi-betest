import UserRepository from '../../repositories/user'
import { UserModel } from '../../drivers/mongoose/models/user'
import JwtDriver from '../../drivers/jwt'
import { CustomError } from '../../helpers/errors'

type ParamsGenerateToken = {
  accountNumber?: string
  identityNumber?: string
}

class GenerateToken {
  userRepo: UserRepository
  jwt: JwtDriver

  constructor() {
    this.userRepo = new UserRepository(UserModel)
    this.jwt = new JwtDriver()
  }

  async generateToken(params: ParamsGenerateToken) {
    if (!params.accountNumber && !params.identityNumber) {
      throw new CustomError({
        code: 'AUTH_IDENTIFIER_REQUIRED',
        message: 'accountNumber or identityNumber is required',
      })
    }

    const user = params.accountNumber
      ? await this.userRepo.findByAccountNumber(params.accountNumber)
      : await this.userRepo.findByIdentityNumber(params.identityNumber || '')

    if (!user) {
      throw new CustomError({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      })
    }

    const token = this.jwt.sign({
      payload: {
        sub: user.id,
        accountNumber: user.accountNumber,
        identityNumber: user.identityNumber,
      },
    })

    return {
      token,
      user,
    }
  }
}

export = GenerateToken
