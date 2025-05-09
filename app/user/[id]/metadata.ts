import { generateNullMetadata } from '~/utils/noIndex'
import type { Metadata } from 'next'
import type { UserInfo } from '~/types/api/user'

export const generateKunMetadataTemplate = (user: UserInfo): Metadata => {
  return generateNullMetadata(`${user.name} 的主页`)
}
