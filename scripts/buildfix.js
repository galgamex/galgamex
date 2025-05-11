const fs = require('fs');
const path = require('path');

// 项目根目录
const rootDir = path.resolve(__dirname, '../');

// 确保 .prisma/client 目录存在
const prismaClientDir = path.join(rootDir, '.prisma', 'client');
if (!fs.existsSync(prismaClientDir)) {
    fs.mkdirSync(prismaClientDir, { recursive: true });
    console.log(`创建目录: ${prismaClientDir}`);
}

// 创建 default.js 文件
const defaultJsContent = `/**
 * Prisma 默认导出文件
 * 兼容 .prisma/client/default 导入路径
 */
const { PrismaClient } = require('../../prisma/generated/client');

module.exports = {
  PrismaClient
}`;

fs.writeFileSync(path.join(prismaClientDir, 'default.js'), defaultJsContent);
console.log(`创建文件: ${path.join(prismaClientDir, 'default.js')}`);

// 创建 index.js 文件
const indexJsContent = `/**
 * Prisma 客户端索引文件
 * 兼容 .prisma/client 导入路径
 */
module.exports = require('./default');`;

fs.writeFileSync(path.join(prismaClientDir, 'index.js'), indexJsContent);
console.log(`创建文件: ${path.join(prismaClientDir, 'index.js')}`);

// 确保 node_modules/.prisma 目录也存在
const nodeModulesPrismaDir = path.join(rootDir, 'node_modules', '.prisma', 'client');
if (!fs.existsSync(nodeModulesPrismaDir)) {
    fs.mkdirSync(nodeModulesPrismaDir, { recursive: true });
    console.log(`创建目录: ${nodeModulesPrismaDir}`);
}

// 复制文件到 node_modules/.prisma/client
fs.copyFileSync(path.join(prismaClientDir, 'default.js'), path.join(nodeModulesPrismaDir, 'default.js'));
fs.copyFileSync(path.join(prismaClientDir, 'index.js'), path.join(nodeModulesPrismaDir, 'index.js'));
console.log(`复制文件到: ${nodeModulesPrismaDir}`);

// 处理 pnpm 特殊目录
// 查找 node_modules/.pnpm/client@*_prisma@* 目录
const pnpmDir = path.join(rootDir, 'node_modules', '.pnpm');
if (fs.existsSync(pnpmDir)) {
    const clientDirs = fs.readdirSync(pnpmDir)
        .filter(dir => dir.startsWith('client@') && dir.includes('_prisma@'));

    for (const clientDir of clientDirs) {
        const clientModuleDir = path.join(pnpmDir, clientDir, 'node_modules', 'client');
        if (fs.existsSync(clientModuleDir)) {
            // 创建 .prisma/client 目录
            const pnpmPrismaDir = path.join(clientModuleDir, '.prisma', 'client');
            if (!fs.existsSync(pnpmPrismaDir)) {
                fs.mkdirSync(pnpmPrismaDir, { recursive: true });
            }

            // 复制文件
            fs.copyFileSync(path.join(prismaClientDir, 'default.js'), path.join(pnpmPrismaDir, 'default.js'));
            fs.copyFileSync(path.join(prismaClientDir, 'index.js'), path.join(pnpmPrismaDir, 'index.js'));
            console.log(`复制文件到 pnpm 目录: ${pnpmPrismaDir}`);
        }
    }
}

console.log('构建修复完成！'); 