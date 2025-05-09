import { z } from 'zod'
import { prisma } from '~/prisma/index'
import { updateFavoriteFolderSchema } from '~/validations/user'
import type { UserFavoritePatchFolder } from '~/types/api/user'

export const updateFolder = async (
  input: z.infer<typeof updateFavoriteFolderSchema>,
  uid: number
) => {
  const folder = await prisma.user_patch_favorite_folder.update({
    where: { id: input.folderId, user_id: uid },
    data: {
      name: input.name,
      description: input.description,
      is_public: input.isPublic
    },
    include: {
      _count: {
        select: { patch: true }
      }
    }
  })

  const response: UserFavoritePatchFolder = {
    name: folder.name,
    id: folder.id,
    description: folder.description,
    is_public: folder.is_public,
    isAdd: false,
    _count: folder._count
  }

  return response
}
