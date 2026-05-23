import UserRepository from '../../repositories/user'
import { UserModel } from '../../drivers/mongoose/models/user'
import CacheDriver from '../../drivers/redis/cache'
import KafkaPublisher from '../../drivers/kafka/publisher'
import { CustomError } from '../../helpers/errors'
import { userCacheKey } from './cache-keys'

type ParamsCreate = {
  userName: string
  accountNumber: string
  emailAddress: string
  identityNumber: string
}

class Create {
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

  async create(params: ParamsCreate) {
    const [byAccount, byEmail, byIdentity] = await Promise.all([
      this.userRepo.findByAccountNumber(params.accountNumber),
      this.userRepo.findByEmailAddress(params.emailAddress),
      this.userRepo.findByIdentityNumber(params.identityNumber),
    ])

    if (byAccount) {
      throw new CustomError({
        code: 'USER_ACCOUNT_NUMBER_TAKEN',
        message: 'accountNumber already exists',
      })
    }
    if (byEmail) {
      throw new CustomError({
        code: 'USER_EMAIL_TAKEN',
        message: 'emailAddress already exists',
      })
    }
    if (byIdentity) {
      throw new CustomError({
        code: 'USER_IDENTITY_NUMBER_TAKEN',
        message: 'identityNumber already exists',
      })
    }

    const result = await this.userRepo.create(params)
    await this.cache.del(userCacheKey.list())

    await this.kafka.publish({
      topic: this.topic,
      key: result?.id,
      value: { event: 'user.created', data: result },
    })

    return result
  }
}

export = Create
