/**
 * 全局 Prisma 客户端适配器
 * 用于确保所有文件都可以正确导入 Prisma 客户端
 */
const { PrismaClient } = require('./prisma/generated/client')

module.exports = {
    PrismaClient
} 