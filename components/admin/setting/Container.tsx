import { Divider } from '@nextui-org/divider'
import { RedirectSetting } from './RedirectSetting'
import { DisableRegisterSetting } from './DisableRegisterSetting'
import type { AdminRedirectConfig } from '~/types/api/admin'

interface Props {
  setting: AdminRedirectConfig
  disableRegister: boolean
}

export const AdminSetting = ({ setting, disableRegister }: Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">网站设置</h1>
      </div>

      <RedirectSetting setting={setting} />

      <Divider />

      <DisableRegisterSetting disableRegister={disableRegister} />
    </div>
  )
}
