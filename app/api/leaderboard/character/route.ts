import { NextResponse } from 'next/server'
import { prisma } from '~/prisma'

export async function GET() {
    try {
        const characterCounts = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                avatar: true,
                patch_character: {
                    select: {
                        id: true
                    }
                }
            },
            take: 100 // 获取更多用户以便筛选有角色的用户
        })

        // 计算每个用户的角色数并排序
        const rankings = characterCounts
            .map(user => ({
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                score: user.patch_character.length
            }))
            .filter(user => user.score > 0) // 只保留有角色的用户
            .sort((a, b) => b.score - a.score) // 降序排序
            .slice(0, 50) // 只取前50名

        return NextResponse.json(rankings)
    } catch (error) {
        console.error('Failed to get character rankings:', error)
        return NextResponse.json(
            { error: '获取角色排行榜失败' },
            { status: 500 }
        )
    }
} 