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

          await copyDirectory('public', '.next/standalone/public')
          await copyDirectory('.next/static', '.next/standalone/.next/static')
          console.log('Files copied successfully for standalone mode.')
        } else {
          console.log('Detected non-Windows OS. Using cp command for copying files.')

          const commands: string[] = [
            'cp -r public .next/standalone/',
            'cp -r .next/static .next/standalone/.next/'
          ]

          for (const command of commands) {
            exec(command, (error, stdout, stderr) => {
              if (error) {
                console.error(`Error executing command "${command}":`, error)
                process.exit(1)
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
