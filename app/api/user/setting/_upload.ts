import sharp from 'sharp'

import { uploadImageToS3 } from '~/lib/s3'
import { checkBufferSize } from '~/app/api/utils/checkBufferSize'

export const uploadUserAvatar = async (image: ArrayBuffer, uid: number) => {
  const avatar = await sharp(image)
    .resize(256, 256, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .avif({ quality: 60 })
    .toBuffer()
  const miniAvatar = await sharp(image)
    .resize(100, 100, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .avif({ quality: 50 })
    .toBuffer()

  if (!checkBufferSize(avatar, 1.007)) {
    return '图片体积过大'
  }

  const bucketName = `user/avatar/user_${uid}`

  await uploadImageToS3(`${bucketName}/avatar.avif`, avatar)
  await uploadImageToS3(`${bucketName}/avatar-mini.avif`, miniAvatar)
}
