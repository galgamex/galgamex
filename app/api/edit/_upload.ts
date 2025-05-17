import sharp from 'sharp'

import { uploadImageToS3 } from '~/lib/s3'
import { checkBufferSize } from '~/app/api/utils/checkBufferSize'

export const uploadPatchBanner = async (image: ArrayBuffer, id: number) => {
  if (!image || image.byteLength === 0) {
    return '图片数据为空或无效'
  }

  try {
    // 获取图片信息
    const imageInfo = await sharp(image).metadata();

    if (!imageInfo.width || !imageInfo.height) {
      return '无法解析图片尺寸，请检查图片格式是否正确'
    }

    // 保留原始比例，但限制最大尺寸以控制文件大小
    const maxWidth = 1920;
    const maxHeight = 1920;

    // 计算调整后的尺寸，保持原始比例
    let resizeOptions = {};

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

    // 生成主图，保持原始比例
    const banner = await sharp(image)
      .resize(resizeOptions)
      .avif({ quality: 70 })
      .toBuffer()
      .catch(err => {
        console.error('生成主图失败:', err);
        throw new Error('生成主图失败，请检查图片格式');
      });

    // 生成缩略图，保持原始比例但尺寸更小
    const miniWidth = 460;
    const miniHeight = Math.round(miniWidth * (imageInfo.height / imageInfo.width));

    const miniBanner = await sharp(image)
      .resize({
        width: miniWidth,
        height: miniHeight,
        fit: 'inside',
        withoutEnlargement: true
      })
      .avif({ quality: 60 })
      .toBuffer()
      .catch(err => {
        console.error('生成缩略图失败:', err);
        throw new Error('生成缩略图失败，请检查图片格式');
      });

    if (!checkBufferSize(miniBanner, 1.007)) {
      return '图片体积过大，请选择更小的图片或降低图片质量'
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
  } catch (error) {
    console.error('处理图片出错:', error)
    return '处理图片时出错，请检查图片格式是否正确'
  }
}
