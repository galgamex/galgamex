import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { kunParseGetQuery } from '~/app/api/utils/parseQuery'
import { prisma } from '~/prisma/index'
import { adminPaginationSchema } from '~/validations/admin'
import { getNSFWHeader } from '~/app/api/utils/getNSFWHeader'
import type { AdminGalgame } from '~/types/api/admin'

export const getGalgame = async (
  input: z.infer<typeof adminPaginationSchema>,
  nsfwEnable: Record<string, string | undefined>
) => {
  const { page, limit, search } = input
  const offset = (page - 1) * limit

  const where = search
    ? {
        name: {
          contains: search,
          mode: 'insensitive' as const
        },
        ...nsfwEnable
      }
    : nsfwEnable

  const [data, total] = await Promise.all([
    prisma.patch.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { created: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    }),
    prisma.patch.count({ where })
  ])

  const galgames: AdminGalgame[] = data.map((galgame) => ({
    id: galgame.id,
    uniqueId: galgame.unique_id,
    name: galgame.name,
    banner: galgame.banner,
    user: galgame.user,
    created: galgame.created
  }))

  return { galgames, total }
}

export async function GET(req: NextRequest) {
  const input = kunParseGetQuery(req, adminPaginationSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }
  const nsfwEnable = getNSFWHeader(req)

  const res = await getGalgame(input, nsfwEnable)
  return NextResponse.json(res)
}
