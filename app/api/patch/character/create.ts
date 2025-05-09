import { z } from 'zod'
import { prisma } from '~/prisma/index'
import { createDedupMessage } from '~/app/api/utils/message'
import type { PatchCharacter } from '~/types/api/patch'
import { MESSAGE_TYPE } from '~/constants/message'

const characterCreateSchema = z.object({
    name: z.string().min(1).max(100),
    image: z.string().min(1),
    description: z.string().min(1).max(10000),
    traits: z.array(z.string()),
    voiceActor: z.string().max(100),
    patchId: z.number().min(1),
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

export const createCharacter = async (
    input: z.infer<typeof characterCreateSchema>,
    uid: number
): Promise<PatchCharacter | string> => {
    // 检查用户是否有权限添加角色
    const pendingCount = await prisma.patch_character.count({
        where: {
            patch_id: input.patchId,
            user_id: uid,
            status: 0 // 待审核状态
        }
    })

    if (pendingCount >= 3) {
        return '您已有3个待审核角色，请等待审核通过后再添加新角色'
    }

    // 检查补丁是否存在
    const patch = await prisma.patch.findUnique({
        where: { id: input.patchId }
    })

    if (!patch) {
        return '未找到对应游戏'
    }

    try {
        // 创建角色
        // 使用类型断言避免TypeScript错误
        const characterData: any = {
            name: input.name,
            image: input.image,
            description: input.description,
            traits: input.traits,
            voice_actor: input.voiceActor,
            patch_id: input.patchId,
            user_id: uid,
            status: 0, // 待审核状态
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
            relationship: input.relationship || ''
        }

        const character = await prisma.patch_character.create({
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

        // 发送消息给管理员
        const adminUsers = await prisma.user.findMany({
            where: {
                role: {
                    gte: 3 // 管理员及以上
                }
            }
        })

        for (const admin of adminUsers) {
            await createDedupMessage({
                type: 'character_review',
                content: `用户 ${character.user.name} 为游戏 ${patch.name} 添加了一个新角色 ${input.name}，请审核`,
                sender_id: uid,
                recipient_id: admin.id,
                link: `/admin/character?id=${character.id}`
            })
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
        console.error('创建角色失败:', error)
        return '创建角色失败，请稍后重试'
    }
} 