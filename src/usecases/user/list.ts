import UserRepository from '../../repositories/user'
import { UserModel } from '../../drivers/mongoose/models/user'
import CacheDriver from '../../drivers/redis/cache'
import { UserEntity } from '../../entities/user'
import { userCacheKey } from './cache-keys'

class List {
  userRepo: UserRepository
  cache: CacheDriver

  constructor() {
    this.userRepo = new UserRepository(UserModel)
    this.cache = new CacheDriver()
  }

  async list() {
    const cacheKey = userCacheKey.list()
    const cached = await this.cache.get<UserEntity[]>(cacheKey)
    if (cached) return cached

    const result = await this.userRepo.find()
    await this.cache.set(cacheKey, result)
    return result
  }
}

export = List
