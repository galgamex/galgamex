'use server'

import { z } from 'zod'
import { getUserInfoSchema } from '~/validations/user'
import { verifyHeaderCookie } from '~/utils/actions/verifyHeaderCookie'
import { safeParseSchema } from '~/utils/actions/safeParseSchema'
import { getNSFWHeader } from '~/utils/actions/getNSFWHeader'
import { getUserPatchResource } from '~/app/api/user/profile/resource/route'

export const kunGetActions = async (
  params: z.infer<typeof getUserInfoSchema>
) => {
  const input = safeParseSchema(getUserInfoSchema, params)
  if (typeof input === 'string') {
    return input
  }
  const payload = await verifyHeaderCookie()
  if (!payload) {
    return '用户登陆失效'
  }

  const nsfwEnable = await getNSFWHeader()

  const response = await getUserPatchResource(input, nsfwEnable)
  return response
}
