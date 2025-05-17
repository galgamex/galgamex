import sharp from 'sharp'

import { uploadImageToS3 } from '~/lib/s3'
import { checkBufferSize } from '~/app/api/utils/checkBufferSize'

export const uploadPatchBanner = async (image: ArrayBuffer, id: number) => {
  // 获取图片信息
  const imageInfo = await sharp(image).metadata();

  // 保留原始比例，但限制最大尺寸以控制文件大小
  const maxWidth = 1920;
  const maxHeight = 1920;

  // 计算调整后的尺寸，保持原始比例
  let resizeOptions = {};

  if (imageInfo.width && imageInfo.height) {
    if (imageInfo.width > maxWidth || imageInfo.height > maxHeight) {
      const aspectRatio = imageInfo.width / imageInfo.height;

      if (imageInfo.width > imageInfo.height) {
        // 横向图片
        resizeOptions = {
          width: Math.min(imageInfo.width, maxWidth),
          height: Math.round(Math.min(imageInfo.width, maxWidth) / aspectRatio),
          fit: 'inside',
          withoutEnlargement: true
        };
      } else {
        // 纵向图片
        resizeOptions = {
          width: Math.round(Math.min(imageInfo.height, maxHeight) * aspectRatio),
          height: Math.min(imageInfo.height, maxHeight),
          fit: 'inside',
          withoutEnlargement: true
        };
      }
    } else {
      // 如果图片尺寸已经小于最大限制，保持原始尺寸
      resizeOptions = {
        width: imageInfo.width,
        height: imageInfo.height,
        fit: 'inside',
        withoutEnlargement: true
      };
    }
  }

  // 生成主图，保持原始比例
  const banner = await sharp(image)
    .resize(resizeOptions)
    .avif({ quality: 70 })
    .toBuffer()

  // 生成缩略图，保持原始比例但尺寸更小
  const miniWidth = 460;
  const miniHeight = imageInfo.height && imageInfo.width
    ? Math.round(miniWidth * (imageInfo.height / imageInfo.width))
    : 259;

  const miniBanner = await sharp(image)
    .resize({
      width: miniWidth,
      height: miniHeight,
      fit: 'inside',
      withoutEnlargement: true
    })
    .avif({ quality: 60 })
    .toBuffer()

  if (!checkBufferSize(miniBanner, 1.007)) {
    return '图片体积过大'
  }

  const bucketName = `patch/${id}/banner`

  try {
    await uploadImageToS3(`${bucketName}/banner.avif`, banner)
    await uploadImageToS3(`${bucketName}/banner-mini.avif`, miniBanner)
    return true
  } catch (error) {
    console.error('上传图片到S3出错:', error)
    return '上传图片失败，请稍后重试'
  }
}
