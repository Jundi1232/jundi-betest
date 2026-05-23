import { toUserEntity } from '../../src/entities/user'
import { UserSchema } from '../../src/drivers/mongoose/models/user'

describe('toUserEntity', () => {
  it('returns null when input is null', () => {
    expect(toUserEntity(null)).toBeNull()
  })

  it('maps snake_case schema fields to camelCase entity fields', () => {
    const now = new Date('2026-05-23T00:00:00.000Z')
    const fake = {
      id: 'abc123',
      user_name: 'jdoe',
      account_number: '111',
      email_address: 'jdoe@example.com',
      identity_number: '999',
      createdAt: now,
      updatedAt: now,
    } as unknown as UserSchema

    const result = toUserEntity(fake)
    expect(result).toEqual({
      id: 'abc123',
      userName: 'jdoe',
      accountNumber: '111',
      emailAddress: 'jdoe@example.com',
      identityNumber: '999',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    })
  })
})
