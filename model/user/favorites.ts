import prisma from "@/lib/prisma"

/**
 * 添加收藏
 * @param userId 用户ID
 * @param articleId 文章/游戏ID
 * @returns 返回创建的收藏记录
 */
export const addFavorite = async (userId: number, articleId: number) => {
  try {
    // 首先检查是否已经收藏
    const exists = await prisma.favorite.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId
        }
      }
    })

    if (exists) {
      return { success: false, message: "已经收藏过此内容" }
    }

    // 添加收藏记录
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        articleId
      }
    })

    // 更新文章收藏数量
    await prisma.article.update({
      where: { id: articleId },
      data: { favorites: { increment: 1 } }
    })

    return { success: true, data: favorite }
  } catch (error) {
    console.error("添加收藏失败:", error)
    return { success: false, message: error instanceof Error ? error.message : "添加收藏失败" }
  }
}

/**
 * 取消收藏
 * @param userId 用户ID
 * @param articleId 文章/游戏ID
 * @returns 返回删除的收藏记录
 */
export const removeFavorite = async (userId: number, articleId: number) => {
  try {
    // 首先检查是否存在收藏记录
    const exists = await prisma.favorite.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId
        }
      }
    })

    if (!exists) {
      return { success: false, message: "未找到收藏记录" }
    }

    // 删除收藏记录
    const favorite = await prisma.favorite.delete({
      where: {
        userId_articleId: {
          userId,
          articleId
        }
      }
    })

    // 更新文章收藏数量
    await prisma.article.update({
      where: { id: articleId },
      data: { favorites: { decrement: 1 } }
    })

    return { success: true, data: favorite }
  } catch (error) {
    console.error("取消收藏失败:", error)
    return { success: false, message: error instanceof Error ? error.message : "取消收藏失败" }
  }
}

/**
 * 查询用户的收藏列表
 * @param userId 用户ID
 * @param options 分页和排序选项
 * @returns 返回收藏列表
 */
export const getUserFavorites = async (
  userId: number,
  options?: {
    take?: number,
    skip?: number,
    orderBy?: any
  }
) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            summary: true,
            cover: true,
            avatar: true,
            type: true,
            createdAt: true,
            developer: true,
            publisher: true,
            stage: true,
            status: true
          }
        }
      },
      orderBy: options?.orderBy || { createdAt: 'desc' },
      take: options?.take || 10,
      skip: options?.skip || 0
    })

    const total = await prisma.favorite.count({ where: { userId } })

    return { success: true, data: favorites, total }
  } catch (error) {
    console.error("获取收藏列表失败:", error)
    return { success: false, message: error instanceof Error ? error.message : "获取收藏列表失败" }
  }
}

/**
 * 检查用户是否收藏了指定文章
 * @param userId 用户ID
 * @param articleId 文章/游戏ID
 * @returns 返回是否已收藏
 */
export const checkFavorite = async (userId: number, articleId: number) => {
  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId
        }
      }
    })

    return { success: true, isFavorite: !!favorite }
  } catch (error) {
    console.error("检查收藏状态失败:", error)
    return { success: false, message: error instanceof Error ? error.message : "检查收藏状态失败" }
  }
}

/**
 * 获取文章的收藏数
 * @param articleId 文章/游戏ID
 * @returns 返回收藏数
 */
export const getArticleFavoriteCount = async (articleId: number) => {
  try {
    const count = await prisma.favorite.count({
      where: { articleId }
    })

    return { success: true, count }
  } catch (error) {
    console.error("获取收藏数失败:", error)
    return { success: false, message: error instanceof Error ? error.message : "获取收藏数失败" }
  }
} 