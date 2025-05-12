/**
 * 此脚本用于修复JavaScript资源加载问题
 * 主要聚焦于文档页和排行榜页的资源路径问题
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 目标页面
const TARGET_PAGES = [
    'doc',
    'leaderboard'
];

// 检查是否在Next.js输出目录中
function checkNextDir() {
    const nextDir = path.resolve(process.cwd(), '.next');
    if (!fs.existsSync(nextDir)) {
        console.error('Error: .next directory not found!');
        console.error('Please run this script after building the app.');
        process.exit(1);
    }
    return nextDir;
}

// 确保生成的HTML文件包含正确的资源路径
function fixHtmlReferences(nextDir) {
    console.log('> 检查HTML引用...');

    const serverDir = path.join(nextDir, 'server', 'app');
    if (!fs.existsSync(serverDir)) {
        console.warn('Warning: Server directory not found, skipping HTML fix');
        return;
    }

    // 处理每个目标页面
    TARGET_PAGES.forEach(page => {
        // 修复主页面
        const pagePath = path.join(serverDir, page, 'page.js');
        if (fs.existsSync(pagePath)) {
            console.log(`> 处理 ${page} 页面...`);
            fixPageReferences(pagePath, page);
        }

        // 处理动态路由页面 (如 [slug])
        const dynamicDirs = fs.readdirSync(path.join(serverDir, page), { withFileTypes: true })
            .filter(dirent => dirent.isDirectory() && dirent.name.includes('['))
            .map(dirent => dirent.name);

        dynamicDirs.forEach(dir => {
            const dynamicPagePath = path.join(serverDir, page, dir, 'page.js');
            if (fs.existsSync(dynamicPagePath)) {
                console.log(`> 处理 ${page}/${dir} 动态页面...`);
                fixPageReferences(dynamicPagePath, `${page}/${dir}`);
            }
        });
    });
}

// 修复单个页面的引用
function fixPageReferences(filePath, pageName) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // 检查是否需要修复相对路径
        if (content.includes('/_next/static') && !content.includes('src="/_next/static')) {
            console.log(`> 修复 ${pageName} 的资源引用...`);

            // 替换资源路径，确保使用绝对路径
            content = content.replace(/(['"])_next\//g, '$1/_next/');

            // 保存修改后的文件
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`> 已修复 ${pageName} 的资源路径`);
        } else {
            console.log(`> ${pageName} 的资源路径正常，无需修复`);
        }
    } catch (error) {
        console.error(`Error fixing ${pageName}:`, error);
    }
}

// 修复客户端组件的引用
function fixClientComponents(nextDir) {
    console.log('> 检查客户端组件引用...');

    const clientComponentsDir = path.join(nextDir, 'static', 'chunks', 'app');
    if (!fs.existsSync(clientComponentsDir)) {
        console.warn('Warning: Client components directory not found, skipping client fix');
        return;
    }

    // 查找与目标页面相关的客户端组件
    TARGET_PAGES.forEach(page => {
        const pageDir = path.join(clientComponentsDir, page);
        if (fs.existsSync(pageDir)) {
            console.log(`> 处理 ${page} 的客户端组件...`);

            // 递归处理所有JS文件
            processClientDir(pageDir);
        } else {
            console.log(`> ${page} 没有客户端组件，或使用了不同的路径`);
        }
    });
}

// 递归处理客户端组件目录
function processClientDir(dirPath) {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });

    files.forEach(file => {
        const fullPath = path.join(dirPath, file.name);

        if (file.isDirectory()) {
            processClientDir(fullPath);
        } else if (file.name.endsWith('.js')) {
            fixClientReferences(fullPath);
        }
    });
}

// 修复客户端JavaScript的引用
function fixClientReferences(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // 检查是否需要修复动态导入路径
        if (content.includes('import(') && !content.includes('import("/_next/')) {
            console.log(`> 修复客户端脚本: ${path.basename(filePath)}`);

            // 替换动态导入路径
            content = content.replace(/import\((['"])_next\//g, 'import($1/_next/');

            // 保存修改后的文件
            fs.writeFileSync(filePath, content, 'utf8');
        }
    } catch (error) {
        console.error(`Error fixing client reference ${filePath}:`, error);
    }
}

// 主函数
function main() {
    console.log('===== 开始修复JavaScript加载问题 =====');

    const nextDir = checkNextDir();
    fixHtmlReferences(nextDir);
    fixClientComponents(nextDir);

    // 更新package.json中的脚本
    updatePackageJson();

    console.log('\n✅ JavaScript加载问题修复完成!');
    console.log('  在生产环境部署前，请确保运行: node scripts/fixJsLoading.js');
}

// 更新package.json
function updatePackageJson() {
    console.log('> 更新package.json...');

    try {
        const packageJsonPath = path.resolve(process.cwd(), 'package.json');
        const packageJson = require(packageJsonPath);

        // 检查是否已经有修复脚本
        if (!packageJson.scripts['build:fix-js']) {
            packageJson.scripts['build:fix-js'] = 'node scripts/fixJsLoading.js';

            // 更新postbuild脚本，加入修复步骤
            if (packageJson.scripts.postbuild) {
                if (!packageJson.scripts.postbuild.includes('build:fix-js')) {
                    packageJson.scripts.postbuild = `${packageJson.scripts.postbuild} && npm run build:fix-js`;
                }
            } else {
                packageJson.scripts.postbuild = 'npm run build:fix-js';
            }

            // 写入更新后的package.json
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
            console.log('> package.json已更新，添加了build:fix-js脚本');
        } else {
            console.log('> package.json中已有build:fix-js脚本，无需更新');
        }
    } catch (error) {
        console.error('Error updating package.json:', error);
    }
}

// 执行主函数
main(); 