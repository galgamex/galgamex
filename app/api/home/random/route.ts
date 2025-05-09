import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/prisma/index'
import { getNSFWHeader } from '~/app/api/utils/getNSFWHeader'

export const getRandomUniqueId = async (
  nsfwEnable: Record<string, string | undefined>
) => {
  const totalArticles = await prisma.patch.findMany({
    where: nsfwEnable,
    select: { unique_id: true }
  })
  if (totalArticles.length === 0) {
    return '未查询到文章'
  }
  const uniqueIds = totalArticles.map((a) => a.unique_id)
  const randomIndex = Math.floor(Math.random() * uniqueIds.length)

  return { uniqueId: uniqueIds[randomIndex] }
}

export const GET = async (req: NextRequest) => {
  const nsfwEnable = getNSFWHeader(req)

  const response = await getRandomUniqueId(nsfwEnable)
  return NextResponse.json(response)
}
