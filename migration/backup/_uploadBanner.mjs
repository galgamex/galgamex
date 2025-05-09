import dotenv from 'dotenv'
import sharp from 'sharp'
import { S3Client } from '@aws-sdk/client-s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'

dotenv.config()

// 初始化 S3 客户端
const s3 = new S3Client({
  endpoint: process.env.KUN_VISUAL_NOVEL_S3_STORAGE_ENDPOINT,
  region: process.env.KUN_VISUAL_NOVEL_S3_STORAGE_REGION,
  requestHandler: {
    connectionTimeout: 30000,
    socketTimeout: 90000
  },
  credentials: {
    accessKeyId: process.env.KUN_VISUAL_NOVEL_S3_STORAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.KUN_VISUAL_NOVEL_S3_STORAGE_SECRET_ACCESS_KEY
  }
})

// 上传图片到 S3
const uploadImageToS3 = async (key, fileBuffer) => {
  const uploadCommand = new PutObjectCommand({
    Bucket: process.env.KUN_VISUAL_NOVEL_S3_STORAGE_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: 'application/octet-stream'
  })
  await s3.send(uploadCommand)
}

// 上传并处理图片函数
const uploadPatchBanner = async (imageBuffer, id) => {
  try {
    // 处理大图
    const banner = await sharp(imageBuffer)
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .avif({ quality: 60 })
      .toBuffer()

    // 处理小图
    const miniBanner = await sharp(imageBuffer)
      .resize(460, 259, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .avif({ quality: 60 })
      .toBuffer()

    const bucketName = `patch/${id}/banner`

    // 上传到 S3
    await uploadImageToS3(`${bucketName}/banner.avif`, banner)
    await uploadImageToS3(`${bucketName}/banner-mini.avif`, miniBanner)

    const imageLink = `${process.env.KUN_VISUAL_NOVEL_IMAGE_BED_URL}/patch/${id}/banner/banner.avif`

    return { imageLink }
  } catch (error) {
    console.error('Error uploading banner:', error)
    throw error
  }
}

export const uploadImageFromURL = async (
  imageUrl,
  id,
  maxRetries = 20,
  timeout = 2000,
  minDelay = 100,
  maxDelay = 1000
) => {
  if (!imageUrl) {
    return ''
  }

  const fetchWithTimeout = (url, options = {}, timeout) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), timeout)
      )
    ])
  }

  const randomDelay = (min, max) => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min
    return new Promise((resolve) => setTimeout(resolve, delay))
  }

  let attempt = 0
  while (attempt < maxRetries) {
    attempt++
    try {
      if (attempt > 1) {
        console.log(`Attempt ${attempt} to fetch image from URL`)
      }

      // 添加随机延迟
      await randomDelay(minDelay, maxDelay)

      // 使用 fetch 获取图片，带超时
      const response = await fetchWithTimeout(imageUrl, {}, timeout)
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`)
      }

      // 将图片转换为 Buffer
      const blob = await response.blob()
      const arrayBuffer = await blob.arrayBuffer()
      const imageBuffer = Buffer.from(arrayBuffer)

      // 调用上传函数
      const result = await uploadPatchBanner(imageBuffer, id)
      if (typeof result === 'string') {
        return
      } else {
        return result.imageLink
      }
    } catch (error) {
      console.log(`ERROR URL ADDRESS: ${imageUrl}`)
      console.error(`Error on attempt ${attempt}:`, error)

      if (attempt >= maxRetries) {
        console.error('Max retries reached. Upload failed.')
        return ''
      }
    }
  }
}
