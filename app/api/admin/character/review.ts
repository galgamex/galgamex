import { prisma } from '~/prisma/index'
import { createMessage } from '~/app/api/utils/message'

export const reviewCharacter = async (
    characterId: number,
    approve: boolean,
    adminUid: number
) => {
    try {
        // 查找角色
        const character = await prisma.patch_character.findUnique({
            where: { id: characterId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                patch: {
                    select: {
                        id: true,
                        name: true,
                        unique_id: true  // 添加unique_id用于生成正确的链接
                    }
                }
            }
        })

        if (!character) {
            return '未找到对应角色'
        }

        if (character.status !== 0) {
            return '该角色已经审核过了'
        }

        // 更新角色状态
        const newStatus = approve ? 1 : 2 // 1-通过 2-拒绝
        await prisma.patch_character.update({
            where: { id: characterId },
            data: { status: newStatus }
        })

        // 发送通知给角色创建者
        const message = approve
            ? `您创建的角色 "${character.name}" 已通过审核，现在可以在 ${character.patch.name} 的角色列表中看到。`
            : `很遗憾，您创建的角色 "${character.name}" 未通过审核。`

        // 使用patch的unique_id来创建链接
        await createMessage({
            type: 'system',
            content: message,
            sender_id: adminUid,
            recipient_id: character.user_id,
            link: `/${character.patch.unique_id}?tab=characters`
        })

        // 记录管理日志
        const action = approve ? '通过' : '拒绝'
        await prisma.admin_log.create({
            data: {
                type: 'character',
                content: `${action}了用户 ${character.user.name} 创建的角色 "${character.name}"`,
                user_id: adminUid
            }
        })

        return approve ? '角色审核通过' : '角色审核被拒绝'
    } catch (error) {
        console.error('角色审核失败:', error)
        return '操作失败，请重试'
    }
} 