import UserRepository from '../../repositories/user'
import { UserModel } from '../../drivers/mongoose/models/user'
import CacheDriver from '../../drivers/redis/cache'
import KafkaPublisher from '../../drivers/kafka/publisher'
import { CustomError } from '../../helpers/errors'
import { userCacheKey } from './cache-keys'

class Delete {
  userRepo: UserRepository
  cache: CacheDriver
  kafka: KafkaPublisher
  topic: string

  constructor() {
    this.userRepo = new UserRepository(UserModel)
    this.cache = new CacheDriver()
    this.kafka = new KafkaPublisher()
    this.topic = process.env.KAFKA_USER_TOPIC || 'kafka_yourname_betest'
  }

  async delete(id: string) {
    const existing = await this.userRepo.findById(id)
    if (!existing) {
      throw new CustomError({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      })
    }

    const result = await this.userRepo.delete(id)

    await this.cache.del(
      userCacheKey.list(),
      userCacheKey.byId(id),
      userCacheKey.byAccountNumber(existing.accountNumber),
      userCacheKey.byIdentityNumber(existing.identityNumber),
      userCacheKey.byEmailAddress(existing.emailAddress),
    )

    await this.kafka.publish({
      topic: this.topic,
      key: id,
      value: { event: 'user.deleted', data: result },
    })

    return result
  }
}

export = Delete
