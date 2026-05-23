import { CustomError } from '../../src/helpers/errors'

jest.mock('../../src/repositories/user', () => {
  return jest.fn().mockImplementation(() => ({
    findById: jest.fn(),
    findByAccountNumber: jest.fn(),
    findByIdentityNumber: jest.fn(),
  }))
})

jest.mock('../../src/drivers/redis/cache', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  }))
})

jest.mock('../../src/drivers/mongoose/models/user', () => ({
  UserModel: {},
}))

import Detail from '../../src/usecases/user/detail'

describe('Detail user usecase', () => {
  const user = {
    id: 'u1',
    userName: 'jdoe',
    accountNumber: '111',
    emailAddress: 'jdoe@example.com',
    identityNumber: '999',
  }

  it('returns cached value when present', async () => {
    const usecase = new Detail()
    ;(usecase.cache.get as jest.Mock).mockResolvedValue(user)

    const result = await usecase.detail('u1')
    expect(result).toEqual(user)
    expect(usecase.userRepo.findById).not.toHaveBeenCalled()
  })

  it('falls back to repo when cache miss and stores in cache', async () => {
    const usecase = new Detail()
    ;(usecase.cache.get as jest.Mock).mockResolvedValue(null)
    ;(usecase.userRepo.findById as jest.Mock).mockResolvedValue(user)

    const result = await usecase.detail('u1')
    expect(result).toEqual(user)
    expect(usecase.cache.set).toHaveBeenCalledWith('user:id:u1', user)
  })

  it('throws not found when user does not exist', async () => {
    const usecase = new Detail()
    ;(usecase.cache.get as jest.Mock).mockResolvedValue(null)
    ;(usecase.userRepo.findById as jest.Mock).mockResolvedValue(null)

    await expect(usecase.detail('nope')).rejects.toBeInstanceOf(CustomError)
  })

  it('detailByAccountNumber uses correct cache key', async () => {
    const usecase = new Detail()
    ;(usecase.cache.get as jest.Mock).mockResolvedValue(null)
    ;(usecase.userRepo.findByAccountNumber as jest.Mock).mockResolvedValue(user)

    await usecase.detailByAccountNumber('111')
    expect(usecase.cache.get).toHaveBeenCalledWith('user:account_number:111')
  })

  it('detailByIdentityNumber uses correct cache key', async () => {
    const usecase = new Detail()
    ;(usecase.cache.get as jest.Mock).mockResolvedValue(null)
    ;(usecase.userRepo.findByIdentityNumber as jest.Mock).mockResolvedValue(
      user,
    )

    await usecase.detailByIdentityNumber('999')
    expect(usecase.cache.get).toHaveBeenCalledWith('user:identity_number:999')
  })
})
