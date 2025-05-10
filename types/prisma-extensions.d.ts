import { Prisma, PrismaClient } from '@prisma/client'

declare global {
    // 扩展全局的 Prisma 命名空间
    namespace PrismaJson {
        export type PrismaUser = Prisma.userGetPayload<{}>
    }
}

// 扩展Prisma用户类型，添加claimed_tasks字段
declare module '@prisma/client' {
    interface user {
        claimed_tasks: string[]
    }
}

export { } 