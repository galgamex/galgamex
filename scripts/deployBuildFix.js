/**
 * 部署构建修复脚本
 * 用于在服务器环境中确保 Prisma 客户端能够正确导入
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 项目根目录
const rootDir = process.cwd();
console.log('当前工作目录:', rootDir);

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
// 找到具体的 client 模块目录
try {
    const pnpmClientPath = execSync('find node_modules/.pnpm -name "client@*" -type d | grep "_prisma@"', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore']
    }).trim();

    if (pnpmClientPath) {
        const clientPaths = pnpmClientPath.split('\n');
        console.log('找到以下 client 模块路径:');

        for (const clientPath of clientPaths) {
            console.log(clientPath);
            const fullPath = path.join(rootDir, clientPath, 'node_modules/client');

            if (fs.existsSync(fullPath)) {
                // 创建特定模块下的 .prisma/client 目录
                const modulePrismaDir = path.join(fullPath, '.prisma', 'client');
                if (!fs.existsSync(modulePrismaDir)) {
                    fs.mkdirSync(modulePrismaDir, { recursive: true });
                }

                // 复制文件
                fs.copyFileSync(path.join(prismaClientDir, 'default.js'), path.join(modulePrismaDir, 'default.js'));
                fs.copyFileSync(path.join(prismaClientDir, 'index.js'), path.join(modulePrismaDir, 'index.js'));
                console.log(`已复制文件到: ${modulePrismaDir}`);
            }
        }
    }
} catch (error) {
    console.log('尝试查找 pnpm client 模块时出错，使用备用方法...');

    // 备用方法：直接创建可能的路径
    const clientModuleDir = path.join(rootDir, 'node_modules', '.pnpm', 'client@6.2.1_prisma@6.2.1', 'node_modules', 'client');
    if (fs.existsSync(clientModuleDir)) {
        const pnpmPrismaDir = path.join(clientModuleDir, '.prisma', 'client');
        if (!fs.existsSync(pnpmPrismaDir)) {
            fs.mkdirSync(pnpmPrismaDir, { recursive: true });
        }

        fs.copyFileSync(path.join(prismaClientDir, 'default.js'), path.join(pnpmPrismaDir, 'default.js'));
        fs.copyFileSync(path.join(prismaClientDir, 'index.js'), path.join(pnpmPrismaDir, 'index.js'));
        console.log(`使用备用方法复制文件到: ${pnpmPrismaDir}`);
    }
}

console.log('部署构建修复完成！'); 