import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/prisma/index'
import { verifyHeaderCookie } from '~/middleware/_verifyHeaderCookie'
import {
    kunParseDeleteQuery,
    kunParseGetQuery,
    kunParsePostBody,
    kunParsePutBody
} from '~/app/api/utils/parseQuery'
import { getCharactersByPatchId } from './get'

// 获取角色列表
const patchIdSchema = z.object({
    patchId: z.coerce.number().min(1)
})

export const GET = async (req: NextRequest) => {
    const input = kunParseGetQuery(req, patchIdSchema)
    if (typeof input === 'string') {
        return NextResponse.json(input)
    }

    const response = await getCharactersByPatchId(input)
    return NextResponse.json(response)
}

// 创建角色
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

export const POST = async (req: NextRequest) => {
    const input = await kunParsePostBody(req, characterCreateSchema)
    if (typeof input === 'string') {
        return NextResponse.json(input)
    }

    const payload = await verifyHeaderCookie(req)
    if (!payload) {
        return NextResponse.json('用户未登录')
    }

    try {
        // 检查用户是否有权限添加角色
        const pendingCount = await prisma.patch_character.count({
            where: {
                patch_id: input.patchId,
                user_id: payload.uid,
                status: 0 // 待审核状态
            }
        })

        if (pendingCount >= 3) {
            return NextResponse.json('您已有3个待审核角色，请等待审核通过后再添加新角色')
        }

        // 检查补丁是否存在
        const patch = await prisma.patch.findUnique({
            where: { id: input.patchId }
        })

        if (!patch) {
            return NextResponse.json('未找到对应游戏')
        }

        // 使用类型断言以避免TypeScript错误
        const character = await prisma.patch_character.create({
            data: {
                name: input.name,
                image: input.image,
                description: input.description,
                traits: input.traits,
                voice_actor: input.voiceActor,
                patch_id: input.patchId,
                user_id: payload.uid,
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
            } as any,
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
            await prisma.user_message.create({
                data: {
                    type: 'character_review',
                    content: `用户 ${character.user.name} 为游戏 ${patch.name} 添加了一个新角色 ${input.name}，请审核`,
                    sender_id: payload.uid,
                    recipient_id: admin.id,
                    link: `/admin/character?id=${character.id}`
                }
            })
        }

        return NextResponse.json({
            id: character.id,
            name: character.name,
            image: character.image,
            description: character.description,
            status: character.status,
            traits: character.traits,
            voiceActor: character.voice_actor,
            alias: character.alias,
            age: character.age,
            height: character.height,
            birthday: character.birthday,
            bloodType: character.blood_type,
            threeSizes: character.three_sizes,
            hobby: character.hobby,
            favorite: character.favorite,
            roleType: character.role_type,
            personality: character.personality,
            relationship: character.relationship,
            userId: character.user_id,
            patchId: character.patch_id,
            created: String(character.created),
            updated: String(character.updated),
            user: {
                id: character.user.id,
                name: character.user.name,
                avatar: character.user.avatar
            }
        })
    } catch (error) {
        console.error('创建角色失败:', error)
        return NextResponse.json('创建角色失败，请稍后重试')
    }
}

// 更新角色
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

export const PUT = async (req: NextRequest) => {
    const input = await kunParsePutBody(req, characterUpdateSchema)
    if (typeof input === 'string') {
        return NextResponse.json(input)
    }

    const payload = await verifyHeaderCookie(req)
    if (!payload) {
        return NextResponse.json('用户未登录')
    }

    // 转换参数以匹配updateCharacter函数期望的格式
    // 添加id字段来解决不匹配问题
    const updateInput = {
        ...input,
        id: input.characterId
    }

    try {
        // 检查角色是否存在
        const existingCharacter = await prisma.patch_character.findUnique({
            where: { id: input.characterId }
        })

        if (!existingCharacter) {
            return NextResponse.json('未找到对应角色')
        }

        // 检查用户是否有权限更新角色
        const user = await prisma.user.findUnique({
            where: { id: payload.uid }
        })
        const isAdmin = user && user.role >= 3

        if (existingCharacter.user_id !== payload.uid && !isAdmin) {
            return NextResponse.json('您没有权限更新此角色')
        }

        // 角色更新时，如果不是管理员进行的更新，需要重新进入审核状态
        const shouldResetStatus = existingCharacter.user_id === payload.uid && !isAdmin

        // 使用类型断言避免TypeScript错误
        const characterData: any = {
            name: input.name,
            image: input.image,
            description: input.description,
            traits: input.traits,
            voice_actor: input.voiceActor,
            // 如果是普通用户更新，则重置状态为待审核
            status: shouldResetStatus ? 0 : existingCharacter.status,
            // 添加新字段
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
                        sender_id: payload.uid,
                        recipient_id: admin.id,
                        link: `/admin/character?id=${character.id}`
                    }
                })
            }
        }

        return NextResponse.json({
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
            userId: character.user_id,
            patchId: character.patch_id,
            created: String(character.created),
            updated: String(character.updated),
            user: character.user
        })
    } catch (error) {
        console.error('更新角色失败:', error)
        return NextResponse.json('更新角色失败，请稍后重试')
    }
}

// 删除角色
const characterIdSchema = z.object({
    characterId: z.coerce.number().min(1)
})

export const DELETE = async (req: NextRequest) => {
    const input = kunParseDeleteQuery(req, characterIdSchema)
    if (typeof input === 'string') {
        return NextResponse.json(input)
    }

    const payload = await verifyHeaderCookie(req)
    if (!payload) {
        return NextResponse.json('用户未登录')
    }

    try {
        // 检查角色是否存在
        const character = await prisma.patch_character.findUnique({
            where: { id: input.characterId }
        })

        if (!character) {
            return NextResponse.json('未找到对应角色')
        }

        // 检查用户是否有权限删除角色
        const user = await prisma.user.findUnique({
            where: { id: payload.uid }
        })
        const isAdmin = user && user.role >= 3

        if (character.user_id !== payload.uid && !isAdmin) {
            return NextResponse.json('您没有权限删除此角色')
        }

        // 删除角色
        await prisma.patch_character.delete({
            where: { id: input.characterId }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('删除角色失败:', error)
        return NextResponse.json('删除角色失败，请稍后重试')
    }
}