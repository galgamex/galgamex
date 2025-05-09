'use server'

import { verifyHeaderCookie } from '~/utils/actions/verifyHeaderCookie'
import { getFolders } from '~/app/api/user/profile/favorite/folder/get'

export const kunGetActions = async (uid: number) => {
  const payload = await verifyHeaderCookie()
  if (!payload) {
    return '用户登陆失效'
  }

  const response = await getFolders({}, uid, payload.uid)
  return { folders: response, currentUserUid: payload.uid }
}
