import { CustomError } from '../../src/helpers/errors'

jest.mock('../../src/repositories/user', () => {
  return jest.fn().mockImplementation(() => ({
    create: jest.fn(),
    findByAccountNumber: jest.fn(),
    findByEmailAddress: jest.fn(),
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

jest.mock('../../src/drivers/kafka/publisher', () => {
  return jest.fn().mockImplementation(() => ({
    publish: jest.fn(),
  }))
})

jest.mock('../../src/drivers/mongoose/models/user', () => ({
  UserModel: {},
}))

import Create from '../../src/usecases/user/create'

describe('Create user usecase', () => {
  const baseParams = {
    userName: 'jdoe',
    accountNumber: '111',
    emailAddress: 'jdoe@example.com',
    identityNumber: '999',
  }

  it('creates a user when no duplicates exist', async () => {
    const usecase = new Create()
    ;(usecase.userRepo.findByAccountNumber as jest.Mock).mockResolvedValue(null)
    ;(usecase.userRepo.findByEmailAddress as jest.Mock).mockResolvedValue(null)
    ;(usecase.userRepo.findByIdentityNumber as jest.Mock).mockResolvedValue(
      null,
    )
    ;(usecase.userRepo.create as jest.Mock).mockResolvedValue({
      id: 'new',
      ...baseParams,
    })

    const result = await usecase.create(baseParams)
    expect(result).toMatchObject({ id: 'new', userName: 'jdoe' })
    expect(usecase.cache.del).toHaveBeenCalled()
  })

  it('rejects duplicate accountNumber', async () => {
    const usecase = new Create()
    ;(usecase.userRepo.findByAccountNumber as jest.Mock).mockResolvedValue({
      id: 'x',
    })
    ;(usecase.userRepo.findByEmailAddress as jest.Mock).mockResolvedValue(null)
    ;(usecase.userRepo.findByIdentityNumber as jest.Mock).mockResolvedValue(
      null,
    )

    await expect(usecase.create(baseParams)).rejects.toBeInstanceOf(CustomError)
    expect(usecase.userRepo.create).not.toHaveBeenCalled()
  })

  it('rejects duplicate emailAddress', async () => {
    const usecase = new Create()
    ;(usecase.userRepo.findByAccountNumber as jest.Mock).mockResolvedValue(null)
    ;(usecase.userRepo.findByEmailAddress as jest.Mock).mockResolvedValue({
      id: 'x',
    })
    ;(usecase.userRepo.findByIdentityNumber as jest.Mock).mockResolvedValue(
      null,
    )

    await expect(usecase.create(baseParams)).rejects.toBeInstanceOf(CustomError)
  })

  it('rejects duplicate identityNumber', async () => {
    const usecase = new Create()
    ;(usecase.userRepo.findByAccountNumber as jest.Mock).mockResolvedValue(null)
    ;(usecase.userRepo.findByEmailAddress as jest.Mock).mockResolvedValue(null)
    ;(usecase.userRepo.findByIdentityNumber as jest.Mock).mockResolvedValue({
      id: 'x',
    })

    await expect(usecase.create(baseParams)).rejects.toBeInstanceOf(CustomError)
  })
})
