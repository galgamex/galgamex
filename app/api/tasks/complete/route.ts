import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/prisma/index'
import { verifyHeaderCookie } from '~/middleware/_verifyHeaderCookie'

// 任务奖励配置
const TASK_REWARDS = {
    daily: {
        comment: 1,
        patch: 3,
        character: 2,
        favorite: 1
    },
    weekly: {
        comment: 5,
        patch: 5
    },
    achievements: {
        comment: 20,
        patch: 20,
        character: 20,
        favorite: 20
    }
} as const

type TaskCategory = keyof typeof TASK_REWARDS
type TaskType = 'comment' | 'patch' | 'character' | 'favorite'

export async function POST(req: NextRequest) {
    try {
        const payload = await verifyHeaderCookie(req)
        if (!payload) {
            return NextResponse.json(
                { message: '用户登陆失效' },
                { status: 401 }
            )
        }

        const body = await req.json()
        const taskType = body.taskType as TaskType
        const taskCategory = body.taskCategory as TaskCategory

        if (!taskType || !taskCategory || !TASK_REWARDS[taskCategory]?.[taskType as keyof typeof TASK_REWARDS[typeof taskCategory]]) {
            return NextResponse.json(
                { message: '无效的任务类型' },
                { status: 400 }
            )
        }

        const userId = payload.uid

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

            // 获取任务完成情况
            // 这里假设从当天0点开始计算
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            // 验证任务是否已完成
            let isCompleted = false
            let reward = 0

            if (taskCategory === 'daily') {
                const count = await getTaskCompletionCount(userId, taskType, today)
                isCompleted = count >= 1
                reward = TASK_REWARDS.daily[taskType]
            } else if (taskCategory === 'weekly') {
                const lastWeek = new Date()
                lastWeek.setDate(lastWeek.getDate() - 7)
                const count = await getTaskCompletionCount(userId, taskType, lastWeek)

                if (taskType === 'comment') {
                    isCompleted = count >= 20
                } else if (taskType === 'patch') {
                    isCompleted = count >= 5
                }

                reward = TASK_REWARDS.weekly[taskType as keyof typeof TASK_REWARDS.weekly]
            } else if (taskCategory === 'achievements') {
                const count = await getTaskCompletionCount(userId, taskType)

                let threshold = 0
                if (taskType === 'comment') {
                    threshold = 100
                } else if (taskType === 'patch') {
                    threshold = 30
                } else if (taskType === 'character') {
                    threshold = 50
                } else if (taskType === 'favorite') {
                    threshold = 100
                }

                isCompleted = count >= threshold
                reward = TASK_REWARDS.achievements[taskType]
            }

            if (!isCompleted) {
                return NextResponse.json(
                    { message: '任务尚未完成' },
                    { status: 400 }
                )
            }

            // 获取用户的已完成任务
            // 如果Prisma模型中没有claimed_tasks字段，使用类型断言访问
            const userWithMetadata = user as any;
            const claimedTasks = Array.isArray(userWithMetadata.claimed_tasks)
                ? userWithMetadata.claimed_tasks
                : [];

            const taskKey = `${taskCategory}_${taskType}`

            if (claimedTasks.includes(taskKey)) {
                return NextResponse.json(
                    { message: '已领取该任务奖励' },
                    { status: 400 }
                )
            }

            // 尝试更新用户的萌萌点，如果claimed_tasks不存在则通过原始SQL更新
            try {
                // 使用Prisma的原生查询来更新用户数据
                const updatedUser = await prisma.$executeRaw`
                    UPDATE "user" 
                    SET moemoepoint = moemoepoint + ${reward},
                        claimed_tasks = array_append(
                            CASE WHEN claimed_tasks IS NULL THEN ARRAY[]::text[] 
                            ELSE claimed_tasks END, 
                            ${taskKey}
                        )
                    WHERE id = ${userId}
                    RETURNING *;
                `;

                return NextResponse.json({
                    message: '领取成功',
                    moemoepoint: user.moemoepoint + reward,
                    reward
                });
            } catch (updateError) {
                console.error('更新用户数据失败:', updateError);
                return NextResponse.json(
                    { message: '更新用户数据失败' },
                    { status: 500 }
                );
            }
        } catch (prismaError) {
            console.error('Prisma查询错误:', prismaError);
            return NextResponse.json(
                { message: '数据库查询失败' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('领取任务奖励失败:', error)
        return NextResponse.json(
            { message: '领取任务奖励失败' },
            { status: 500 }
        )
    }
}

// 获取任务完成次数
async function getTaskCompletionCount(userId: number, taskType: TaskType, startDate?: Date) {
    type WhereClause = {
        user_id: number;
        created?: {
            gte: Date;
        };
    }

    let query: { where: WhereClause } = {
        where: {
            user_id: userId
        }
    }

    if (startDate) {
        query.where.created = { gte: startDate }
    }

    switch (taskType) {
        case 'comment':
            return prisma.patch_comment.count(query)
        case 'patch':
            return prisma.patch_resource.count(query)
        case 'character':
            return prisma.patch_character.count(query)
        case 'favorite':
            return prisma.user_patch_favorite_folder_relation.count({
                where: {
                    folder: {
                        user_id: userId
                    },
                    ...(startDate && { created: { gte: startDate } })
                }
            })
        default:
            return 0
    }
} 