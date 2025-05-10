import { NextResponse } from 'next/server'
import { prisma } from '~/prisma'

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            where: {
                daily_check_in: {
                    gt: 0
                }
            },
            select: {
                id: true,
                name: true,
                avatar: true,
                daily_check_in: true
            },
            orderBy: {
                daily_check_in: 'desc'
            },
            take: 50
        })

        const rankings = users.map((user: {
            id: number;
            name: string;
            avatar: string;
            daily_check_in: number;
        }) => ({
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            score: user.daily_check_in
        }))

        return NextResponse.json(rankings)
    } catch (error) {
        console.error('Failed to get check-in rankings:', error)
        return NextResponse.json(
            { error: '获取签到排行榜失败' },
            { status: 500 }
        )
    }
} 