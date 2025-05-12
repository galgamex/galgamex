import { exec } from 'child_process'
import { mkdir, readdir, copyFile, access } from 'fs/promises'
import { constants } from 'fs'
import path from 'path'
import os from 'os'

const isWindows: boolean = os.platform() === 'win32'

// 检查目录是否存在
const directoryExists = async (dirPath: string): Promise<boolean> => {
  try {
    await access(dirPath, constants.F_OK)
    return true
  } catch {
    return false
  }
}

const copyDirectory = async (src: string, dest: string): Promise<void> => {
  try {
    await mkdir(dest, { recursive: true })
    const entries = await readdir(src, { withFileTypes: true })

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name)
      const destPath = path.join(dest, entry.name)

      if (entry.isDirectory()) {
        await copyDirectory(srcPath, destPath)
      } else {
        await copyFile(srcPath, destPath)
      }
    }
  } catch (error) {
    console.error(`Error copying directory from ${src} to ${dest}:`, error)
    throw error
  }
}

const copyFiles = async () => {
  exec('pnpm build:sitemap', async (error, stdout, stderr) => {
    if (error) {
      console.error('Error generating sitemap:', error)
      process.exit(1)
    }
    if (stdout) console.log(stdout)
    if (stderr) console.error(stderr)

    try {
      // 检查是否存在out目录（是否使用export输出模式）
      const exportExists = await directoryExists('out')

      if (!exportExists) {
        console.log('Export output directory not found, using standalone mode.')

        // 检查是否存在standalone目录（是否使用standalone输出模式）
        const standaloneExists = await directoryExists('.next/standalone')

        if (!standaloneExists) {
          console.log('Standalone output not found either. Check your build configuration.')
          return
        }

        if (isWindows) {
          console.log('Detected Windows OS. Using fs module for copying files.')

          // 确保目标目录存在
          await mkdir('.next/standalone/.next', { recursive: true })

          // 复制public目录
          await copyDirectory('public', '.next/standalone/public')

          // 复制全部静态资源，而不仅仅是static目录
          await copyDirectory('.next/static', '.next/standalone/.next/static')

          // 复制server端和客户端构建文件，确保动态路由能正确加载js
          await copyDirectory('.next/server', '.next/standalone/.next/server')

          // 确保必要的缓存和其他资源也被复制
          if (await directoryExists('.next/cache')) {
            await copyDirectory('.next/cache', '.next/standalone/.next/cache')
          }

          // 复制其他重要文件
          if (await directoryExists('.next/chunks')) {
            await copyDirectory('.next/chunks', '.next/standalone/.next/chunks')
          }

          // 确保构建信息也被复制，包括routes-manifest
          await copyFile('.next/routes-manifest.json', '.next/standalone/.next/routes-manifest.json')
            .catch(err => console.warn('Warning: routes-manifest.json not found', err))

          await copyFile('.next/build-manifest.json', '.next/standalone/.next/build-manifest.json')
            .catch(err => console.warn('Warning: build-manifest.json not found', err))

          console.log('Files copied successfully for standalone mode.')
        } else {
          console.log('Detected non-Windows OS. Using cp command for copying files.')

          const commands: string[] = [
            'cp -r public .next/standalone/',
            'cp -r .next/static .next/standalone/.next/',
            'cp -r .next/server .next/standalone/.next/',
            'mkdir -p .next/standalone/.next/cache && cp -r .next/cache/* .next/standalone/.next/cache/ || true',
            'cp -r .next/chunks .next/standalone/.next/ || true',
            'cp .next/routes-manifest.json .next/standalone/.next/ || true',
            'cp .next/build-manifest.json .next/standalone/.next/ || true'
          ]

          for (const command of commands) {
            exec(command, (error, stdout, stderr) => {
              if (error) {
                console.error(`Error executing command "${command}":`, error)
                // 非关键错误不终止程序
                if (command.includes('|| true')) {
                  console.warn('Continuing despite error on optional copy.')
                } else {
                  process.exit(1)
                }
              }
              if (stdout) console.log(stdout)
              if (stderr) console.error(stderr)
            })
          }
        }
      } else {
        console.log('Export output detected, no additional file copying needed.')
      }
    } catch (fsError) {
      console.error('Error managing build files:', fsError)
      process.exit(1)
    }
  })
}

copyFiles()
