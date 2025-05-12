import { NextResponse } from 'next/server'

// 禁用Next Auth，直接返回空会话
export async function GET() {
    return NextResponse.json({
        user: null,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    })
}

export async function POST() {
    return NextResponse.json({
        user: null,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    })
} 