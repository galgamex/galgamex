import { z } from 'zod'
import { prisma } from '~/prisma/index'
import type { PatchCharacter } from '~/types/api/patch'

const characterUpdateSchema = z.object({
    characterId: z.number().min(1),
    name: z.string().min(1).max(100),
    image: z.string().min(1),
    description: z.string().min(1).max(10000),
    traits: z.array(z.string()),
    voiceActor: z.string().max(100),
    alias: z.array(z.string()).optional().default([]),
    age: z.string().max(50).optional().default(''),
    height: z.string().max(50).optional().default(''),
    birthday: z.string().max(50).optional().default(''),
    bloodType: z.string().max(10).optional().default(''),
    threeSizes: z.string().max(50).optional().default(''),
    hobby: z.array(z.string()).optional().default([]),
    favorite: z.array(z.string()).optional().default([]),
    roleType: z.string().max(100).optional().default(''),
    personality: z.array(z.string()).optional().default([]),
    relationship: z.string().max(1000).optional().default('')
})

export const updateCharacter = async (
    input: z.infer<typeof characterUpdateSchema>,
    uid: number
): Promise<PatchCharacter | string> => {
    // 检查角色是否存在
    const existingCharacter = await prisma.patch_character.findUnique({
        where: { id: input.characterId }
    })

    if (!existingCharacter) {
        return '未找到对应角色'
    }

    // 检查用户是否有权限更新角色
    if (existingCharacter.user_id !== uid && await isNotAdmin(uid)) {
        return '您没有权限更新此角色'
    }

    try {
        // 角色更新时，如果不是管理员进行的更新，需要重新进入审核状态
        const shouldResetStatus = existingCharacter.user_id === uid && await isNotAdmin(uid)

        // 使用类型断言避免TypeScript错误
        const characterData: any = {
            name: input.name,
            image: input.image,
            description: input.description,
            traits: input.traits,
            voice_actor: input.voiceActor,
            // 如果是普通用户更新，则重置状态为待审核
            status: shouldResetStatus ? 0 : existingCharacter.status,
            alias: input.alias || [],
            age: input.age || '',
            height: input.height || '',
            birthday: input.birthday || '',
            blood_type: input.bloodType || '',
            three_sizes: input.threeSizes || '',
            hobby: input.hobby || [],
            favorite: input.favorite || [],
            role_type: input.roleType || '',
            personality: input.personality || [],
            relationship: input.relationship || '',
            original_id: existingCharacter.id
        }

        const character = await prisma.patch_character.update({
            where: { id: input.characterId },
            data: characterData,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                }
            }
        }) as any;

        // 如果需要重新审核，通知管理员
        if (shouldResetStatus) {
            const adminUsers = await prisma.user.findMany({
                where: {
                    role: {
                        gte: 3 // 管理员及以上
                    }
                }
            })

            // 获取游戏信息
            const patch = await prisma.patch.findUnique({
                where: { id: existingCharacter.patch_id }
            })

            for (const admin of adminUsers) {
                await prisma.user_message.create({
                    data: {
                        type: 'system',
                        content: `用户 ${character.user.name} 更新了游戏 ${patch?.name || '未知游戏'} 的角色 ${input.name}，请重新审核`,
                        sender_id: uid,
                        recipient_id: admin.id,
                        link: `/admin/character?id=${character.id}`
                    }
                })
            }
        }

        // 返回PatchCharacter类型的对象
        return {
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
            created: String(character.created),
            updated: String(character.updated),
            user: character.user
        }
    } catch (error) {
        console.error('更新角色失败:', error)
        return '更新角色失败，请稍后重试'
    }
}

// 检查用户是否不是管理员
const isNotAdmin = async (uid: number): Promise<boolean> => {
    const user = await prisma.user.findUnique({
        where: { id: uid }
    })
    return !user || user.role < 3
} 