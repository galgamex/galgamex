import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getKunDynamicPatches = async () => {
  try {
    const patches = await prisma.patch.findMany({
      where: { content_limit: 'sfw' },
      select: {
        unique_id: true,
        updated: true
      }
    })

    return patches.map((patch) => ({
      path: `/${patch.unique_id}`,
      lastmod: patch.updated?.toISOString() || new Date().toISOString()
    }))
  } catch (error) {
    console.error('Error fetching dynamic routes:', error)
    return []
  } finally {
    await prisma.$disconnect()
  }
}
