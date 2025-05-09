import { EmailSetting } from '~/components/admin/email/Container'
import { kunMetadata } from './metadata'
import type { Metadata } from 'next'

export const revalidate = 3

export const metadata: Metadata = kunMetadata

export default function Kun() {
  return <EmailSetting />
}
