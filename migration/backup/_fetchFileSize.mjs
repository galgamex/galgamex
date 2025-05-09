import fs from 'fs'
import { access, unlink } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const MARKDOWN_DIR = path.join(__dirname, './markdown')

const getMarkdownFiles = (dir) => {
  let results = []
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat && stat.isDirectory()) {
      results = results.concat(getMarkdownFiles(filePath))
    } else if (file.endsWith('.md')) {
      results.push(filePath)
    }
  })
  return results
}

const extractLinks = (fileContent) => {
  const linkRegex = /https:\/\/pan\.touchgal\.net\/s\/\w+/g
  return fileContent.match(linkRegex) || []
}

const fetchLinkData = async (link) => {
  const key = link.split('/').pop()
  const apiUrl = `https://pan.touchgal.net/api/v3/share/info/${key}`
  try {
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching data for link: ${link}`, error)
    return null
  }
}

const fetchListData = async (key) => {
  const apiUrl = `https://pan.touchgal.net/api/v3/share/list/${key}`
  try {
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch list: ${response.statusText}`)
    }
    const data = await response.json()
    if (data.code === 0 && data.data.objects && data.data.objects.length > 0) {
      const largestObject = data.data.objects.reduce(
        (max, obj) => (obj.size > max.size ? obj : max),
        { size: 0 }
      )
      return largestObject.size
    }
    return null
  } catch (error) {
    console.error(`Error fetching list data for key: ${key}`, error)
    return null
  }
}

const processMarkdownFiles = async (folderPath) => {
  const markdownFiles = getMarkdownFiles(folderPath)
  const linksSet = new Set()

  markdownFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8')
    const links = extractLinks(content)
    links.forEach((link) => linksSet.add(link))
  })

  const linksArray = Array.from(linksSet)
  fs.writeFileSync(`${__dirname}/link.txt`, linksArray.join('\n'), 'utf-8')

  const sizes = {}
  const batchSize = 50
  for (let i = 0; i < linksArray.length; i += batchSize) {
    const batch = linksArray.slice(i, i + batchSize)

    const fetchPromises = batch.map(async (link) => {
      const data = await fetchLinkData(link)
      if (data && data.code === 0) {
        let sizeInGB
        if (data.data.source.size > 0) {
          sizeInGB = (data.data.source.size / 1024 ** 3).toFixed(3)
        } else {
          const listSize = await fetchListData(data.data.key)
          sizeInGB = listSize ? (listSize / 1024 ** 3).toFixed(3) : '未知大小'
        }
        sizes[link] = `${sizeInGB} GB`
      } else {
        sizes[link] = '未知大小'
      }
    })

    await Promise.all(fetchPromises)

    console.log(`Batch ${Math.floor(i / batchSize) + 1} processed.`)
  }

  fs.writeFileSync(
    `${__dirname}/size.json`,
    JSON.stringify(sizes, null, 2),
    'utf-8'
  )

  console.log('Processing complete. Check link.txt and size.json for results.')
}

const safeUnlink = async (filePath) => {
  try {
    await access(filePath)
    await unlink(filePath)
    console.log(`Deleted: ${filePath}`)
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`File not found: ${filePath}`)
    } else {
      console.error(`Error deleting file: ${filePath}`, error)
    }
  }
}

const kun = async () => {
  const file1 = path.join(__dirname, 'size.json')
  const file2 = path.join(__dirname, 'link.txt')

  await safeUnlink(file1)
  await safeUnlink(file2)
  await processMarkdownFiles(MARKDOWN_DIR).catch((error) =>
    console.error('Error:', error)
  )
}

kun()
