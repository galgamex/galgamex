import { KunContainer } from '~/components/auth/email-notice/Container'
import { kunMetadata } from './metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = kunMetadata

export default function Kun() {
  return <KunContainer />
}
