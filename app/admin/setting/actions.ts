'use server'

import { getRedirectConfig } from '~/app/api/admin/setting/redirect/getRedirectConfig'
import { getDisableRegisterStatus } from '~/app/api/admin/setting/register/route'

export const kunGetRedirectConfigActions = async () => {
  const response = await getRedirectConfig()
  return response
}

export const kunGetDisableRegisterStatusActions = async () => {
  const response = await getDisableRegisterStatus()
  return response
}
