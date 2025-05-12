import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { NextApiRequest, NextApiResponse } from 'next'

// 创建一个包含错误处理的处理器
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createSafeHandler = (handler: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (req: any, res: any) => {
        try {
            return await handler(req, res)
        } catch (error) {
            console.error('NextAuth Error:', error)

            // 返回一个友好的错误响应而不是500
            return NextResponse.json(
                {
                    error: 'Auth service temporarily unavailable',
                    status: 'error'
                },
                { status: 200 } // 返回200而不是500，以避免客户端报错
            )
        }
    }
}

const handler = NextAuth(authOptions)

// 使用安全处理器包装原始处理器
const safeGET = createSafeHandler(handler)
const safePOST = createSafeHandler(handler)

export { safeGET as GET, safePOST as POST } 