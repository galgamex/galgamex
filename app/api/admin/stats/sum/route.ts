import { NextResponse } from 'next/server'
import { prisma } from '~/prisma/index'
import type { SumData } from '~/types/api/admin'

export const getSumData = async (): Promise<SumData> => {
  const [
    userCount,
    galgameCount,
    galgameResourceCount,
    galgamePatchResourceCount,
    galgameCommentCount,
    galgameDownloads,
    patchResourceDownloads
  ] = await Promise.all([
    prisma.user.count(),
    prisma.patch.count(),
    prisma.patch_resource.count({
      where: { section: 'galgame' }
    }),
    prisma.patch_resource.count({
      where: { section: 'patch' }
    }),
    prisma.patch_comment.count(),
    prisma.patch.aggregate({
      _sum: {
        download: true
      }
    }),
    prisma.patch_resource.aggregate({
      _sum: {
        download: true
      }
    })
  ])

  const totalDownloads = (galgameDownloads._sum.download || 0) + (patchResourceDownloads._sum.download || 0)

  return {
    userCount,
    galgameCount,
    galgameResourceCount,
    galgamePatchResourceCount,
    galgameCommentCount,
    totalDownloads
  }
}

export const GET = async () => {
  const data = await getSumData()
  return NextResponse.json(data)
}
