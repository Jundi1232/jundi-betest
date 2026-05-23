import UserRepository from '../../repositories/user'
import { UserModel } from '../../drivers/mongoose/models/user'
import CacheDriver from '../../drivers/redis/cache'
import { UserEntity } from '../../entities/user'
import { CustomError } from '../../helpers/errors'
import { userCacheKey } from './cache-keys'

class Detail {
  userRepo: UserRepository
  cache: CacheDriver

  constructor() {
    this.userRepo = new UserRepository(UserModel)
    this.cache = new CacheDriver()
  }

  async detail(id: string) {
    const cacheKey = userCacheKey.byId(id)
    const cached = await this.cache.get<UserEntity>(cacheKey)
    if (cached) return cached

    const result = await this.userRepo.findById(id)
    if (!result) {
      throw new CustomError({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      })
    }

    await this.cache.set(cacheKey, result)
    return result
  }

  async detailByAccountNumber(accountNumber: string) {
    const cacheKey = userCacheKey.byAccountNumber(accountNumber)
    const cached = await this.cache.get<UserEntity>(cacheKey)
    if (cached) return cached

    const result = await this.userRepo.findByAccountNumber(accountNumber)
    if (!result) {
      throw new CustomError({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      })
    }

    await this.cache.set(cacheKey, result)
    return result
  }

  async detailByIdentityNumber(identityNumber: string) {
    const cacheKey = userCacheKey.byIdentityNumber(identityNumber)
    const cached = await this.cache.get<UserEntity>(cacheKey)
    if (cached) return cached

    const result = await this.userRepo.findByIdentityNumber(identityNumber)
    if (!result) {
      throw new CustomError({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      })
    }

    await this.cache.set(cacheKey, result)
    return result
  }
}

export = Detail
