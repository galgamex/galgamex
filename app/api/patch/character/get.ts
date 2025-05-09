import { z } from 'zod'
import { prisma } from '~/prisma/index'
import type { PatchCharacter } from '~/types/api/patch'
import { Prisma } from '@prisma/client'

const patchIdSchema = z.object({
    patchId: z.coerce.number().min(1)
})

export const getCharactersByPatchId = async (
    input: z.infer<typeof patchIdSchema>
): Promise<{ characters: PatchCharacter[] }> => {
    const { patchId } = input

    const charactersData = await prisma.patch_character.findMany({
        where: {
            patch_id: patchId,
            status: 1 // 只返回已审核通过的角色
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true
                }
            }
        },
        orderBy: {
            created: 'desc'
        }
    })

    const characters: PatchCharacter[] = charactersData.map((char: any) => ({
        id: char.id,
        name: char.name,
        image: char.image,
        description: char.description,
        status: char.status,
        traits: char.traits,
        voiceActor: char.voice_actor,
        alias: char.alias || [],
        age: char.age || '',
        height: char.height || '',
        birthday: char.birthday || '',
        bloodType: char.blood_type || '',
        threeSizes: char.three_sizes || '',
        hobby: char.hobby || [],
        favorite: char.favorite || [],
        roleType: char.role_type || '',
        personality: char.personality || [],
        relationship: char.relationship || '',
        isLatest: true,
        originalId: char.original_id || null,
        userId: char.user_id,
        patchId: char.patch_id,
        created: String(char.created),
        updated: String(char.updated),
        user: {
            id: char.user.id,
            name: char.user.name,
            avatar: char.user.avatar
        }
    }))

    return { characters }
}

export const getPendingCharactersByUser = async (
    patchId: number,
    userId: number
): Promise<number> => {
    const pendingCount = await prisma.patch_character.count({
        where: {
            patch_id: patchId,
            user_id: userId,
            status: 0 // 待审核状态
        }
    })

    return pendingCount
} 