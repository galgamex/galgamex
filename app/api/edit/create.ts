import crypto from 'crypto'
import { z } from 'zod'
import { prisma } from '~/prisma/index'
import { uploadPatchBanner } from './_upload'
import { patchCreateSchema } from '~/validations/edit'
import { handleBatchPatchTags } from './batchTag'

export const createGalgame = async (
  input: Omit<z.infer<typeof patchCreateSchema>, 'alias' | 'tag'> & {
    alias: string[]
    tag: string[]
  },
  uid: number
) => {
  const {
    name,
    vndbId,
    alias,
    banner,
    tag,
    introduction,
    released,
    contentLimit
  } = input

  const bannerArrayBuffer = banner as ArrayBuffer
  const galgameUniqueId = crypto.randomBytes(4).toString('hex')

  const res = await prisma.$transaction(
    async (prisma) => {
      const patch = await prisma.patch.create({
        data: {
          name,
          unique_id: galgameUniqueId,
          vndb_id: vndbId ? vndbId : null,
          introduction,
          user_id: uid,
          banner: '',
          released,
          content_limit: contentLimit
        }
      })

      const newId = patch.id

      const uploadResult = await uploadPatchBanner(bannerArrayBuffer, newId)
      if (typeof uploadResult === 'string') {
        return uploadResult
      }
      const imageLink = `${process.env.KUN_VISUAL_NOVEL_IMAGE_BED_URL}/patch/${newId}/banner/banner.avif`

      await prisma.patch.update({
        where: { id: newId },
        data: { banner: imageLink }
      })

      if (alias.length) {
        const aliasData = alias.map((name) => ({
          name,
          patch_id: newId
        }))
        await prisma.patch_alias.createMany({
          data: aliasData,
          skipDuplicates: true
        })
      }

      // 先获取用户信息以检查角色
      const user = await prisma.user.findUnique({
        where: { id: uid }
      })

      if (!user) {
        return '用户未找到'
      }

      // 根据用户角色决定是否增加daily_image_count
      await prisma.user.update({
        where: { id: uid },
        data: {
          // 管理员不增加daily_image_count计数
          daily_image_count: user.role >= 3 ? undefined : { increment: 1 },
          moemoepoint: { increment: 3 }
        }
      })

      return { patchId: newId }
    },
    { timeout: 60000 }
  )

  if (typeof res === 'string') {
    return res
  }

  if (tag.length) {
    await handleBatchPatchTags(res.patchId, tag, uid)
  }

  return { uniqueId: galgameUniqueId }
}
