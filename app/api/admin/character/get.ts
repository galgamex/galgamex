import { z } from 'zod'
import { prisma } from '~/prisma/index'
import { adminPaginationSchema } from '~/validations/admin'
import type { AdminCharacter } from '~/types/api/admin'
import { Prisma } from '@prisma/client'

export const getCharacters = async (
    input: z.infer<typeof adminPaginationSchema>
) => {
    const { page, limit, search } = input
    const offset = (page - 1) * limit

    // 构建搜索条件
    const where = search
        ? {
            name: {
                contains: search,
                mode: 'insensitive' as const
            }
        }
        : {}

    try {
        // 获取所有角色
        const [data, total] = await Promise.all([
            prisma.patch_character.findMany({
                where,
                take: limit,
                skip: offset,
                orderBy: { created: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true
                        }
                    },
                    patch: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }),
            prisma.patch_character.count({ where })
        ])

        // 转换为前端需要的格式
        const characters: AdminCharacter[] = data.map((character: any) => ({
            id: character.id,
            name: character.name,
            image: character.image,
            description: character.description,
            status: character.status,
            traits: character.traits,
            voiceActor: character.voice_actor,
            alias: character.alias || [],
            age: character.age || '',
            height: character.height || '',
            birthday: character.birthday || '',
            bloodType: character.blood_type || '',
            threeSizes: character.three_sizes || '',
            hobby: character.hobby || [],
            favorite: character.favorite || [],
            roleType: character.role_type || '',
            personality: character.personality || [],
            relationship: character.relationship || '',
            isLatest: true,
            originalId: character.original_id || null,
            userId: character.user_id,
            patchId: character.patch_id,
            patchName: character.patch.name,
            created: String(character.created),
            updated: String(character.updated),
            user: {
                id: character.user.id,
                name: character.user.name,
                avatar: character.user.avatar
            }
        }))

        return { characters, total }
    } catch (error) {
        console.error('获取角色列表失败:', error)
        return { characters: [], total: 0 }
    }
} 