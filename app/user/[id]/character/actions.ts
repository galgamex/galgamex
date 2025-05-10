'use server'

import { prisma } from '~/prisma'
import { cache } from 'react'

export type CharacterWithPatch = Awaited<ReturnType<typeof getUserCharacters>>[0]

export const getUserCharacters = cache(async (userId: number, page: number = 1, limit: number = 15) => {
    const skip = (page - 1) * limit

    const characters = await prisma.patch_character.findMany({
        where: {
            user_id: userId
        },
        orderBy: {
            created: 'desc'
        },
        take: limit,
        skip,
        select: {
            id: true,
            name: true,
            image: true,
            description: true,
            status: true,
            created: true,
            patch: {
                select: {
                    id: true,
                    name: true,
                    unique_id: true,
                    banner: true
                }
            }
        }
    })

    return characters.map(character => ({
        id: character.id,
        name: character.name,
        image: character.image,
        description: character.description,
        status: character.status,
        created: String(character.created),
        patch: character.patch ? {
            id: character.patch.id,
            name: character.patch.name,
            uniqueId: character.patch.unique_id,
            banner: character.patch.banner
        } : null
    }))
})

export const getUserCharacterCount = cache(async (userId: number) => {
    return await prisma.patch_character.count({
        where: {
            user_id: userId
        }
    })
}) 