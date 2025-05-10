import { NextResponse } from 'next/server'
import { prisma } from '~/prisma'

export async function GET() {
    try {
        const patchCounts = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                avatar: true,
                patch: {
                    select: {
                        id: true
                    }
                }
            },
            take: 100 // 获取更多用户以便筛选有补丁的用户
        })

        // 计算每个用户的补丁数并排序
        const rankings = patchCounts
            .map(user => ({
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                score: user.patch.length
            }))
            .filter(user => user.score > 0) // 只保留有补丁的用户
            .sort((a, b) => b.score - a.score) // 降序排序
            .slice(0, 50) // 只取前50名

        return NextResponse.json(rankings)
    } catch (error) {
        console.error('Failed to get patch rankings:', error)
        return NextResponse.json(
            { error: '获取补丁排行榜失败' },
            { status: 500 }
        )
    }
} 