'use server'

import { z } from 'zod'
import { safeParseSchema } from '~/utils/actions/safeParseSchema'
import { getCharacters } from '~/app/api/admin/character/get'
import { reviewCharacter } from '~/app/api/admin/character/review'
import { adminPaginationSchema } from '~/validations/admin'

export const kunGetActions = async (
    params: z.infer<typeof adminPaginationSchema>
) => {
    const input = safeParseSchema(adminPaginationSchema, params)
    if (typeof input === 'string') {
        return input
    }

    const response = await getCharacters(input)
    return response
}

export const kunReviewCharacterActions = async (characterId: number, approve: boolean, adminUid: number) => {
    const response = await reviewCharacter(characterId, approve, adminUid)
    return response
} 