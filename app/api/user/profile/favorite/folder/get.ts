import { z } from 'zod'
import { prisma } from '~/prisma/index'
import type { UserFavoritePatchFolder } from '~/types/api/user'

const patchIdSchema = z.object({
  patchId: z.coerce.number().min(1).max(9999999).optional()
})

export const getFolders = async (
  input: z.infer<typeof patchIdSchema>,
  pageUid: number,
  currentUserUid: number
) => {
  const folders = await prisma.user_patch_favorite_folder.findMany({
    where: {
      user_id: pageUid,
      is_public: pageUid !== currentUserUid ? true : undefined
    },
    include: {
      patch: {
        where: {
          patch_id: input.patchId ?? 0
        }
      },
      _count: {
        select: { patch: true }
      }
    }
  })

  const response: UserFavoritePatchFolder[] = folders.map((f) => ({
    name: f.name,
    id: f.id,
    description: f.description,
    is_public: f.is_public,
    isAdd: f.patch.length > 0,
    _count: f._count
  }))

  return response
}
