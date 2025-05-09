import { CreatePatch } from '~/components/edit/create/CreatePatch'
import { kunMetadata } from './metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = kunMetadata

export default function Create() {
  return <CreatePatch />
}
