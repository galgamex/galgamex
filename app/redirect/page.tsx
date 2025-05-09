import { kunMetadata } from './metadata'
import { KunRedirectContainer } from '~/components/redirect/Container'
import type { Metadata } from 'next'

export const metadata: Metadata = kunMetadata

export default function Kun() {
  return <KunRedirectContainer />
}
