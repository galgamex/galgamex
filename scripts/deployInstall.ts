import { existsSync, mkdirSync } from 'fs'
import { execSync } from 'child_process'
import { platform } from 'os'

const runCommand = (command: string) => {
  try {
    console.log(`Running command: ${command}`)
    execSync(command, { stdio: 'inherit' })
  } catch (error) {
    console.error(`Error running command: ${command}`)
    process.exit(1)
  }
}

runCommand('pnpm install')

runCommand('pnpx prisma db push')

if (!existsSync('./uploads')) {
  mkdirSync('./uploads')
}

// 根据操作系统设置uploads文件夹权限
const isWindows = platform() === 'win32'
if (isWindows) {
  try {
    console.log('Setting permissions for uploads folder on Windows')
    // Windows上使用icacls来设置权限
    execSync('icacls uploads /grant Everyone:F', { stdio: 'inherit' })
  } catch (error) {
    console.warn('Warning: Could not set permissions for uploads folder on Windows')
    console.warn('You may need to manually ensure the uploads folder has the correct permissions')
  }
} else {
  // 在Unix/Linux系统上使用chmod
  runCommand('chmod 777 uploads')
}
