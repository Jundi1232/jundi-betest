import { UserSchema } from '../drivers/mongoose/models/user'

export type UserEntity = {
  id?: string
  userName: string
  accountNumber: string
  emailAddress: string
  identityNumber: string
  createdAt?: string
  updatedAt?: string
}

export const toUserEntity = (params: UserSchema | null): UserEntity | null => {
  if (!params) return null
  return {
    id: params.id,
    userName: params.user_name,
    accountNumber: params.account_number,
    emailAddress: params.email_address,
    identityNumber: params.identity_number,
    createdAt: params.createdAt?.toISOString(),
    updatedAt: params.updatedAt?.toISOString(),
  }
}
