const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 检查是否存在.next目录，如果存在就删除
function cleanNextDir() {
    const nextDir = path.resolve(process.cwd(), '.next');
    if (fs.existsSync(nextDir)) {
        console.log('> 删除旧的.next目录...');
        try {
            if (process.platform === 'win32') {
                execSync('rmdir /s /q .next', { stdio: 'inherit' });
            } else {
                execSync('rm -rf .next', { stdio: 'inherit' });
            }
        } catch (error) {
            console.warn('警告: 无法完全删除.next目录，可能有一些文件被锁定。继续执行构建...');
        }
    }
}

// 创建.next/static目录
function createStaticDir() {
    const staticDir = path.resolve(process.cwd(), '.next', 'static');
    if (!fs.existsSync(staticDir)) {
        console.log('> 创建.next/static目录...');
        fs.mkdirSync(staticDir, { recursive: true });
    }
}

// 创建必要的React兼容性文件
function createReactShim() {
    console.log('> 创建React兼容性文件...');
    const shimFile = path.resolve(process.cwd(), '.next', 'react-shim.js');
    const content = `
// React兼容性垫片
if (typeof React === 'undefined') {
  window.React = require('react');
}
  `;
    fs.writeFileSync(shimFile, content);
}

// 构建应用
function buildApp() {
    console.log('> 开始构建应用...');
    try {
        execSync('next build', { stdio: 'inherit' });
        console.log('> 构建完成!');
        return true;
    } catch (error) {
        console.error('构建失败:', error.message);
        return false;
    }
}

// 检查API目录
function checkApiDir() {
    const apiDir = path.resolve(process.cwd(), 'app', 'api');
    if (fs.existsSync(apiDir)) {
        console.log('> 检查API路由，确保配置正确...');

        // 确保auth目录配置正确
        const authDir = path.resolve(apiDir, 'auth');
        if (fs.existsSync(authDir)) {
            console.log('> 发现auth API路由，检查配置...');

            // 检查next-auth配置
            const nextAuthDir = path.resolve(authDir, '[...nextauth]');
            if (fs.existsSync(nextAuthDir)) {
                console.log('> 找到next-auth配置目录，确保路由文件存在...');

                const routeFile = path.resolve(nextAuthDir, 'route.ts');
                if (!fs.existsSync(routeFile)) {
                    console.warn('警告: 未找到next-auth路由文件，可能会导致认证问题!');
                }
            }
        }
    }
}

// 主函数
async function main() {
    console.log('===== 开始修复构建问题 =====');

    // 1. 清理旧的构建
    cleanNextDir();

    // 2. 准备目录结构
    createStaticDir();

    // 3. 创建兼容性文件
    createReactShim();

    // 4. 检查API目录
    checkApiDir();

    // 5. 构建应用
    const buildSuccess = buildApp();

    if (buildSuccess) {
        console.log('\n✅ 构建修复成功! 现在可以使用以下命令启动应用:');
        console.log('   npm run start');
        console.log('   或');
        console.log('   node scripts/runServer.js');
    } else {
        console.log('\n❌ 构建修复失败。请检查错误信息并手动修复问题。');
    }
}

main().catch(console.error); 