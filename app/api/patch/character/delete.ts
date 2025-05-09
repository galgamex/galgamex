import { z } from 'zod'
import { prisma } from '~/prisma/index'

const characterIdSchema = z.object({
    characterId: z.coerce.number().min(1)
})

export const deleteCharacter = async (
    input: z.infer<typeof characterIdSchema>,
    uid: number
): Promise<{} | string> => {
    // 检查角色是否存在
    const character = await prisma.patch_character.findUnique({
        where: { id: input.characterId }
    })

    if (!character) {
        return '未找到对应角色'
    }

    // 检查用户权限
    const user = await prisma.user.findUnique({
        where: { id: uid }
    })

    // 只有角色创建者或管理员可以删除角色
    if (!user || (character.user_id !== uid && user.role < 3)) {
        return '您没有权限删除此角色'
    }

    try {
        await prisma.patch_character.delete({
            where: { id: input.characterId }
        })

        // 如果是管理员删除，通知创建者
        if (user.role >= 3 && character.user_id !== uid) {
            // 获取游戏信息
            const patch = await prisma.patch.findUnique({
                where: { id: character.patch_id }
            })

            await prisma.user_message.create({
                data: {
                    type: 'system',
                    content: `管理员 ${user.name} 删除了您在游戏 ${patch?.name || '未知游戏'} 中创建的角色 ${character.name}`,
                    sender_id: uid,
                    recipient_id: character.user_id,
                    link: `/${patch?.unique_id || ''}`
                }
            })
        }

        return {}
    } catch (error) {
        console.error('删除角色失败:', error)
        return '删除角色失败，请稍后重试'
    }
} 