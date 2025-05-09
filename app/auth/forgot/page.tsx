import { ForgotPassword } from '~/components/auth/forgot/Forgot'
import { kunMetadata } from './metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = kunMetadata

export default function Kun() {
  return <ForgotPassword />
}
