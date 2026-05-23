import UserRepository from '../../repositories/user'
import { UserModel } from '../../drivers/mongoose/models/user'
import CacheDriver from '../../drivers/redis/cache'
import KafkaPublisher from '../../drivers/kafka/publisher'
import { CustomError } from '../../helpers/errors'
import { userCacheKey } from './cache-keys'

type ParamsUpdate = {
  userName?: string
  accountNumber?: string
  emailAddress?: string
  identityNumber?: string
}

class Update {
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

  async update(id: string, params: ParamsUpdate) {
    const existing = await this.userRepo.findById(id)
    if (!existing) {
      throw new CustomError({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      })
    }

    if (
      params.accountNumber &&
      params.accountNumber !== existing.accountNumber
    ) {
      const dup = await this.userRepo.findByAccountNumber(params.accountNumber)
      if (dup && dup.id !== id) {
        throw new CustomError({
          code: 'USER_ACCOUNT_NUMBER_TAKEN',
          message: 'accountNumber already exists',
        })
      }
    }
    if (params.emailAddress && params.emailAddress !== existing.emailAddress) {
      const dup = await this.userRepo.findByEmailAddress(params.emailAddress)
      if (dup && dup.id !== id) {
        throw new CustomError({
          code: 'USER_EMAIL_TAKEN',
          message: 'emailAddress already exists',
        })
      }
    }
    if (
      params.identityNumber &&
      params.identityNumber !== existing.identityNumber
    ) {
      const dup = await this.userRepo.findByIdentityNumber(
        params.identityNumber,
      )
      if (dup && dup.id !== id) {
        throw new CustomError({
          code: 'USER_IDENTITY_NUMBER_TAKEN',
          message: 'identityNumber already exists',
        })
      }
    }

    const result = await this.userRepo.update(id, params)

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
      value: { event: 'user.updated', data: result },
    })

    return result
  }
}

export = Update
