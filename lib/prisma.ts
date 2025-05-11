import { PrismaClient } from '../prisma/generated/client'

// 创建Prisma客户端单例
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['error']
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 