import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

// 文件夹路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const MARKDOWN_DIR = path.join(__dirname, './markdown')
const FOLDERS = {
  SFW: 'SFW',
  NSFW: 'NSFW'
}

// 存储已处理的 uniqueId 和文件路径的 Map
const uniqueIdMap = new Map()

// 处理 Markdown 文件
const processMarkdownFile = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data } = matter(fileContent)

  const uniqueId = data.abbrlink
  const banner = data.cover || ''

  if (!banner) {
    console.warn(`文件缺少 banner: ${filePath}`)
    return
  }

  if (!uniqueId) {
    console.warn(`文件缺少 uniqueId: ${filePath}`)
    return
  }

  // 检查 uniqueId 是否已存在
  if (uniqueIdMap.has(uniqueId)) {
    const existingFile = uniqueIdMap.get(uniqueId)
    console.log(`发现重复 uniqueId: ${uniqueId}`)
    console.log(`文件路径1: ${existingFile}`)
    console.log(`文件路径2: ${filePath}`)
  } else {
    // 记录 uniqueId 和文件路径
    uniqueIdMap.set(uniqueId, filePath)
  }
}

// 遍历文件夹
const processFolder = (folderPath) => {
  const files = fs.readdirSync(folderPath)

  for (const file of files) {
    const filePath = path.join(folderPath, file)

    if (fs.statSync(filePath).isDirectory()) {
      processFolder(filePath) // 递归处理子文件夹
    } else if (path.extname(file) === '.md') {
      processMarkdownFile(filePath)
    }
  }
}

// 主函数
const kun = async () => {
  const sfwPath = path.join(MARKDOWN_DIR, FOLDERS.SFW)
  if (fs.existsSync(sfwPath)) {
    console.log('开始处理 SFW 文件夹...')
    processFolder(sfwPath)
  }

  const nsfwPath = path.join(MARKDOWN_DIR, FOLDERS.NSFW)
  if (fs.existsSync(nsfwPath)) {
    console.log('开始处理 NSFW 文件夹...')
    processFolder(nsfwPath)
  }
}

kun()
