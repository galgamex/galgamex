import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const rootDir = path.resolve(__dirname, '..')
const nextDir = path.join(rootDir, '.next')
const pagesDir = path.join(rootDir, 'pages')

// 删除.next目录
console.log('清理 .next 目录...')
if (fs.existsSync(nextDir)) {
    try {
        fs.rmSync(nextDir, { recursive: true, force: true })
        console.log('✅ .next 目录已删除')
    } catch (error) {
        console.error('❌ 删除 .next 目录失败:', error)
    }
}

// 检查并移动pages目录（如果存在）
console.log('检查旧的 pages 目录...')
if (fs.existsSync(pagesDir)) {
    try {
        const backupDir = path.join(rootDir, 'pages_backup_' + Date.now())
        fs.renameSync(pagesDir, backupDir)
        console.log(`✅ pages 目录已移动到 ${backupDir}`)
    } catch (error) {
        console.error('❌ 移动 pages 目录失败:', error)
    }
}

// 执行构建
console.log('开始执行构建...')
try {
    execSync('pnpm build', { stdio: 'inherit' })
    console.log('✅ 构建成功完成!')
} catch (error) {
    console.error('❌ 构建失败:', error)
    process.exit(1)
} 