import { AdminSetting } from '~/components/admin/setting/Container'
import { kunMetadata } from './metadata'
import {
  kunGetRedirectConfigActions,
  kunGetDisableRegisterStatusActions
} from './actions'
import type { Metadata } from 'next'

export const revalidate = 3

export const metadata: Metadata = kunMetadata

export default async function Kun() {
  const setting = await kunGetRedirectConfigActions()
  const { disableRegister } = await kunGetDisableRegisterStatusActions()

  return <AdminSetting setting={setting} disableRegister={disableRegister} />
}
