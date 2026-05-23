import { CustomError } from '../../src/helpers/errors'

jest.mock('../../src/repositories/user', () => {
  return jest.fn().mockImplementation(() => ({
    findByAccountNumber: jest.fn(),
    findByIdentityNumber: jest.fn(),
  }))
})

jest.mock('../../src/drivers/mongoose/models/user', () => ({
  UserModel: {},
}))

import GenerateToken from '../../src/usecases/user/generate-token'
import JwtDriver from '../../src/drivers/jwt'

describe('GenerateToken usecase', () => {
  const user = {
    id: 'u1',
    userName: 'jdoe',
    accountNumber: '111',
    emailAddress: 'jdoe@example.com',
    identityNumber: '999',
  }

  it('throws when no identifier provided', async () => {
    const usecase = new GenerateToken()
    await expect(usecase.generateToken({})).rejects.toBeInstanceOf(CustomError)
  })

  it('throws not found when user does not exist', async () => {
    const usecase = new GenerateToken()
    ;(usecase.userRepo.findByAccountNumber as jest.Mock).mockResolvedValue(null)
    await expect(
      usecase.generateToken({ accountNumber: '000' }),
    ).rejects.toBeInstanceOf(CustomError)
  })

  it('returns a verifiable token when account number matches', async () => {
    const usecase = new GenerateToken()
    ;(usecase.userRepo.findByAccountNumber as jest.Mock).mockResolvedValue(user)

    const result = await usecase.generateToken({ accountNumber: '111' })
    expect(result.user).toEqual(user)
    expect(typeof result.token).toBe('string')

    const decoded = new JwtDriver().verify<{
      sub: string
      accountNumber: string
    }>(result.token)
    expect(decoded.sub).toBe(user.id)
    expect(decoded.accountNumber).toBe(user.accountNumber)
  })

  it('looks up by identityNumber when accountNumber not provided', async () => {
    const usecase = new GenerateToken()
    ;(usecase.userRepo.findByIdentityNumber as jest.Mock).mockResolvedValue(
      user,
    )

    const result = await usecase.generateToken({ identityNumber: '999' })
    expect(usecase.userRepo.findByIdentityNumber).toHaveBeenCalledWith('999')
    expect(result.user).toEqual(user)
  })
})
