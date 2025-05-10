import { NextResponse } from 'next/server'
import { prisma } from '~/prisma'

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            where: {
                moemoepoint: {
                    gt: 0
                }
            },
            select: {
                id: true,
                name: true,
                avatar: true,
                moemoepoint: true
            },
            orderBy: {
                moemoepoint: 'desc'
            },
            take: 50
        })

        const rankings = users.map((user: {
            id: number;
            name: string;
            avatar: string;
            moemoepoint: number;
        }) => ({
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            score: user.moemoepoint
        }))

        return NextResponse.json(rankings)
    } catch (error) {
        console.error('Failed to get moemoepoint rankings:', error)
        return NextResponse.json(
            { error: '获取萌萌点排行榜失败' },
            { status: 500 }
        )
    }
} 