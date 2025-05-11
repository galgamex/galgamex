/**
 * Prisma 兼容层
 * 确保 Next.js 应用能够找到 Prisma 客户端
 * 这个文件会被 Next.js 的服务器端代码自动导入
 */

// 重新导出 Prisma 客户端
module.exports = require('../prisma/generated/client'); 