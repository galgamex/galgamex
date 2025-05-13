import { execSync } from 'child_process'
import { config } from 'dotenv'
import { envSchema } from '../validations/dotenv-check'
import * as fs from 'fs'
import * as path from 'path'

const envPath = path.resolve(__dirname, '..', '.env')
if (!fs.existsSync(envPath)) {
  console.error('.env file not found in the project root.')
  process.exit(1)
}

config({ path: envPath })

// 安全执行命令，允许失败并继续
const safeExecSync = (command: string, description: string, allowFail = false) => {
  try {
    console.log(`\n==== 执行${description} ====`)
    execSync(command, { stdio: 'inherit' })
    console.log(`==== ${description}完成 ====\n`)
    return true
  } catch (error) {
    console.error(`==== ${description}失败 ====`)
    console.error(error)
    if (!allowFail) throw error
    console.log(`==== 忽略${description}错误，继续执行 ====\n`)
    return false
  }
}

try {
  const envParseResult = envSchema.safeParse(process.env)
  if (!envParseResult.success) {
    console.error('环境变量验证失败:', envParseResult.error)
    process.exit(1)
  }

  console.log('环境变量验证通过.')
  console.log('开始执行部署流程...')

  if (process.env.KUN_VISUAL_NOVEL_TEST_SITE_LABEL) {
    console.log('⚠️ 警告: 测试环境 ⚠️')
    console.log('网站运行在测试环境中，将禁用搜索引擎索引!')
  }

  // 尝试拉取最新代码，允许失败
  safeExecSync('git pull', 'Git代码拉取', true)

  // 执行数据库迁移
  safeExecSync('pnpm prisma:push', '数据库迁移')

  // 清理构建
  safeExecSync('pnpm build:clean', '清理构建')

  // 确保out目录存在
  const outDir = path.resolve(__dirname, '..', 'out')
  if (!fs.existsSync(outDir)) {
    console.log('⚠️ 警告: out目录不存在，可能构建未完成或使用了standalone模式')
  } else {
    console.log('✅ 检测到out目录，使用static export模式')
  }

  // 尝试停止已存在的PM2进程，允许失败
  safeExecSync('pnpm stop', 'PM2进程停止', true)

  // 启动应用
  safeExecSync('pnpm start', '应用启动')

  console.log('✅ 部署完成!\n')
} catch (e) {
  console.error('❌ 部署失败!')
  console.error(e)
  process.exit(1)
}
