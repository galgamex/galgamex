import { z } from 'zod'
import { prisma } from '~/prisma/index'
import { getKv, setKv } from '~/lib/redis'
import { PATCH_CACHE_DURATION } from '~/config/cache'
import type { Patch } from '~/types/api/patch'

const CACHE_KEY = 'patch'

const uniqueIdSchema = z.object({
  uniqueId: z.string().min(8).max(8)
})

export const getPatchById = async (
  input: z.infer<typeof uniqueIdSchema>,
  uid: number
) => {
  const cachedPatch = await getKv(`${CACHE_KEY}:${input.uniqueId}`)
  if (cachedPatch) {
    return JSON.parse(cachedPatch) as Patch
  }

  const { uniqueId } = input

  const patch = await prisma.patch.findUnique({
    where: { unique_id: uniqueId },
    include: {
      user: true,
      tag: {
        select: {
          tag: {
            select: { name: true }
          }
        }
      },
      alias: {
        select: {
          name: true
        }
      },
      _count: {
        select: {
          favorite_folder: true,
          resource: true,
          comment: true
        }
      },
      favorite_folder: {
        where: {
          folder: {
            user_id: uid
          }
        }
      }
    }
  })

  if (!patch) {
    return '未找到对应 Galgame'
  }

  await prisma.patch.update({
    where: { id: patch.id },
    data: { view: { increment: 1 } }
  })

  const response: Patch = {
    id: patch.id,
    uniqueId: patch.unique_id,
    vndbId: patch.vndb_id,
    name: patch.name,
    introduction: patch.introduction,
    banner: patch.banner,
    status: patch.status,
    view: patch.view,
    download: patch.download,
    type: patch.type,
    language: patch.language,
    platform: patch.platform,
    tags: patch.tag.map((t) => t.tag.name),
    alias: patch.alias.map((a) => a.name),
    isFavorite: patch.favorite_folder.length > 0,
    contentLimit: patch.content_limit,
    user: {
      id: patch.user.id,
      name: patch.user.name,
      avatar: patch.user.avatar
    },
    created: String(patch.created),
    updated: String(patch.updated),
    _count: patch._count
  }

  await setKv(
    `${CACHE_KEY}:${input.uniqueId}`,
    JSON.stringify(response),
    PATCH_CACHE_DURATION
  )

  return response
}
