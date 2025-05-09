import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { calculateFileStreamHash } from '../resourceUtils'
import { verifyHeaderCookie } from '~/middleware/_verifyHeaderCookie'
import { sanitizeFileName } from '~/utils/sanitizeFileName'
import { uploadImageToS3 } from '~/lib/s3'

// 允许的图片文件扩展名
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

const getFileExtension = (filename: string) => {
    return filename.slice(filename.lastIndexOf('.')).toLowerCase()
}

const checkRequestValid = async (req: NextRequest) => {
    const formData = await req.formData()
    const file = formData.get('file')
    const patchId = formData.get('patchId')

    // 只检查用户登录状态
    const payload = await verifyHeaderCookie(req)
    if (!payload) {
        return '用户未登录，请先登录'
    }

    if (!file || !(file instanceof File)) {
        return '错误的文件输入'
    }

    if (!patchId) {
        return '缺少游戏ID参数'
    }

    const fileExtension = getFileExtension(file.name)
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
        return `不支持的文件类型: ${fileExtension}，仅支持 jpg, jpeg, png, webp, avif 格式`
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileSizeInMB = buffer.length / (1024 * 1024)

    if (fileSizeInMB > 10) {
        return '文件大小超过限制, 最大为 10 MB'
    }

    return {
        buffer,
        file,
        fileSizeInMB,
        patchId: Number(patchId),
        userId: payload.uid
    }
}

export async function POST(req: NextRequest) {
    const validData = await checkRequestValid(req)
    if (typeof validData === 'string') {
        return NextResponse.json(validData)
    }

    const { buffer, file, patchId, userId } = validData

    try {
        // 优化图片
        const optimizedBuffer = await sharp(buffer)
            .resize(800, 1200, { fit: 'inside', withoutEnlargement: true })
            .avif({ quality: 80 })
            .toBuffer()

        // 生成文件哈希和路径
        const fileName = sanitizeFileName(file.name.replace(/\.[^/.]+$/, '.avif'))
        const { fileHash } = await calculateFileStreamHash(optimizedBuffer, 'uploads', fileName)

        // 上传到S3
        const s3Key = `patch/${patchId}/character/${fileHash}/${fileName}`
        await uploadImageToS3(s3Key, optimizedBuffer)

        // 构建完整URL，使用图片站点URL
        const imageBedUrl = process.env.KUN_VISUAL_NOVEL_IMAGE_BED_URL
        const imageUrl = `${imageBedUrl}/${s3Key}`

        return NextResponse.json({
            url: imageUrl,
            hash: fileHash
        })
    } catch (error) {
        console.error('角色图片上传失败:', error)
        return NextResponse.json('图片处理或上传失败，请重试')
    }
} 