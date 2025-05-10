import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/prisma/index'
import { verifyHeaderCookie } from '~/middleware/_verifyHeaderCookie'

export async function GET(req: NextRequest) {
    try {
        const payload = await verifyHeaderCookie(req)
        if (!payload) {
            return NextResponse.json(
                { message: '用户登陆失效' },
                { status: 401 }
            )
        }

        const userId = payload.uid
        // 使用try-catch包裹Prisma操作
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId }
            })

            if (!user) {
                return NextResponse.json(
                    { message: '未找到用户' },
                    { status: 404 }
                )
            }

            // 获取用户的任务完成情况
            // 这里假设从当天0点开始计算
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            // 获取今日评论数
            const todayComments = await prisma.patch_comment.count({
                where: {
                    user_id: userId,
                    created: {
                        gte: today
                    }
                }
            })

            // 获取今日上传补丁数
            const todayPatches = await prisma.patch_resource.count({
                where: {
                    user_id: userId,
                    created: {
                        gte: today
                    }
                }
            })

            // 获取今日创建角色数
            const todayCharacters = await prisma.patch_character.count({
                where: {
                    user_id: userId,
                    created: {
                        gte: today
                    }
                }
            })

            // 获取今日收藏游戏数（假设通过favorite_folder表计算）
            const todayFavorites = await prisma.user_patch_favorite_folder_relation.count({
                where: {
                    folder: {
                        user_id: userId
                    },
                    created: {
                        gte: today
                    }
                }
            })

            // 计算过去7天的数据（每周任务）
            const lastWeek = new Date()
            lastWeek.setDate(lastWeek.getDate() - 7)

            const weeklyComments = await prisma.patch_comment.count({
                where: {
                    user_id: userId,
                    created: {
                        gte: lastWeek
                    }
                }
            })

            const weeklyPatches = await prisma.patch_resource.count({
                where: {
                    user_id: userId,
                    created: {
                        gte: lastWeek
                    }
                }
            })

            // 获取总数据（成就任务）
            const totalComments = await prisma.patch_comment.count({
                where: {
                    user_id: userId
                }
            })

            const totalPatches = await prisma.patch_resource.count({
                where: {
                    user_id: userId
                }
            })

            const totalCharacters = await prisma.patch_character.count({
                where: {
                    user_id: userId
                }
            })

            const totalFavorites = await prisma.user_patch_favorite_folder_relation.count({
                where: {
                    folder: {
                        user_id: userId
                    }
                }
            })

            // 获取用户已领取的任务
            const userWithClaims = user as any;
            const claimedTasks = Array.isArray(userWithClaims.claimed_tasks) ? userWithClaims.claimed_tasks : [];

            return NextResponse.json({
                moemoepoint: user.moemoepoint,
                claimed_tasks: claimedTasks,
                tasks: {
                    daily: {
                        comment: { progress: todayComments, total: 1 },
                        patch: { progress: todayPatches, total: 1 },
                        character: { progress: todayCharacters, total: 1 },
                        favorite: { progress: todayFavorites, total: 1 }
                    },
                    weekly: {
                        comment: { progress: weeklyComments, total: 5 },
                        patch: { progress: weeklyPatches, total: 3 }
                    },
                    achievements: {
                        comment: { progress: totalComments, total: 100 },
                        patch: { progress: totalPatches, total: 30 },
                        character: { progress: totalCharacters, total: 50 },
                        favorite: { progress: totalFavorites, total: 100 }
                    }
                }
            })
        } catch (prismaError) {
            console.error('Prisma查询错误:', prismaError)
            return NextResponse.json(
                { message: '数据库查询失败' },
                { status: 500 }
            )
        }
    } catch (error) {
        console.error('获取任务数据失败:', error)
        return NextResponse.json(
            { message: '获取任务数据失败' },
            { status: 500 }
        )
    }
} 