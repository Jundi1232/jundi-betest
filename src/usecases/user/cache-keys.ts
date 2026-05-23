export const userCacheKey = {
  byId: (id: string) => `user:id:${id}`,
  byAccountNumber: (accountNumber: string) =>
    `user:account_number:${accountNumber}`,
  byIdentityNumber: (identityNumber: string) =>
    `user:identity_number:${identityNumber}`,
  byEmailAddress: (emailAddress: string) =>
    `user:email_address:${emailAddress.toLowerCase()}`,
  list: () => 'user:list',
}
