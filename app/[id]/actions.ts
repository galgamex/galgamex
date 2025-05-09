'use server'

import { z } from 'zod'
import { verifyHeaderCookie } from '~/utils/actions/verifyHeaderCookie'
import { safeParseSchema } from '~/utils/actions/safeParseSchema'
import { getPatchById } from '~/app/api/patch/get'
import { getPatchIntroduction } from '~/app/api/patch/introduction/route'

const uniqueIdSchema = z.object({
  uniqueId: z.string().min(8).max(8)
})

export const kunGetPatchActions = async (
  params: z.infer<typeof uniqueIdSchema>
) => {
  const input = safeParseSchema(uniqueIdSchema, params)
  if (typeof input === 'string') {
    return input
  }
  const payload = await verifyHeaderCookie()

  const response = await getPatchById(input, payload?.uid ?? 0)
  return response
}

export const kunGetPatchIntroductionActions = async (
  params: z.infer<typeof uniqueIdSchema>
) => {
  const input = safeParseSchema(uniqueIdSchema, params)
  if (typeof input === 'string') {
    return input
  }

  const response = await getPatchIntroduction(input)
  return response
}
