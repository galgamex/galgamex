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

try {
  envSchema.safeParse(process.env)

  console.log('Environment variables are valid.')
  console.log('Executing the commands...')

  if (process.env.KUN_VISUAL_NOVEL_TEST_SITE_LABEL) {
    console.log('DANGEROUS❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗')
    console.log(
      'You website is running on a test environment now, it will be disable any search engine indexing!'
    )
  }

  // 执行git pull
  execSync('git pull', { stdio: 'inherit' })

  // 执行prisma数据库推送
  execSync('pnpm prisma:push', { stdio: 'inherit' })

  // 构建应用
  execSync('pnpm build', { stdio: 'inherit' })

  // 尝试停止已存在的PM2进程，忽略错误
  try {
    execSync('pnpm stop', { stdio: 'inherit' })
  } catch (error) {
    console.log('No existing process found or failed to stop, continuing with startup...')
  }

  // 启动应用
  execSync('pnpm start', { stdio: 'inherit' })
} catch (e) {
  console.error('Invalid environment variables')
  process.exit(1)
}
