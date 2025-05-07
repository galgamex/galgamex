import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"
// @ts-ignore - 忽略类型错误
import type { Recommendation } from "@prisma/client"

/**
 * 查找单个推荐记录
 * @param id 推荐ID
 * @returns 返回推荐记录信息
 */
export const findRecommendation = async (id: number): Promise<Recommendation | null> => {
  return prisma.recommendation.findUnique({
    where: { id },
    include: {
      article: true,   // 包含源文章信息
      recArticle: true // 包含推荐文章信息
    }
  })
}

/**
 * 查找多个推荐记录
 * @param params 查询条件
 * @returns 返回推荐记录数组
 */
export const findRecommendations = async (params?: any): Promise<Recommendation[]> => {
  try {
    return await prisma.recommendation.findMany({
      where: params,
      include: {
        article: true,
        recArticle: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  } catch (error) {
    console.error('Error finding recommendations:', error);
    return [];
  }
}

/**
 * 查找文章的推荐列表
 * @param articleId 文章ID
 * @returns 返回推荐给该文章的推荐记录
 */
export const findArticleRecommendations = async (articleId: number): Promise<Recommendation[]> => {
  try {
    return await prisma.recommendation.findMany({
      where: { articleId },
      include: {
        recArticle: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  } catch (error) {
    console.error('Error finding article recommendations:', error);
    return [];
  }
}

/**
 * 查找被推荐的文章列表
 * @param articleId 文章ID
 * @returns 返回该文章被推荐的记录
 */
export const findArticleRecommendedBy = async (articleId: number): Promise<Recommendation[]> => {
  try {
    return await prisma.recommendation.findMany({
      where: { recId: articleId },
      include: {
        article: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  } catch (error) {
    console.error('Error finding article recommended by:', error);
    return [];
  }
}

/**
 * 查找推荐记录数量
 * @param params 查询条件
 * @returns 返回推荐记录数量
 */
export const findRecommendationCount = async (params?: Prisma.RecommendationWhereInput): Promise<number> => {
  try {
    return await prisma.recommendation.count({ where: params })
  } catch (error) {
    console.error('Error counting recommendations:', error);
    return 0;
  }
}

/**
 * 创建推荐记录
 * @param articleId 源文章ID
 * @param recId 推荐文章ID
 * @returns 返回创建的推荐记录
 */
export const createRecommendation = async (articleId: number, recId: number): Promise<Recommendation> => {
  // 检查是否已存在推荐关系，避免重复
  const exists = await prisma.recommendation.findFirst({
    where: {
      articleId,
      recId
    }
  })
  
  if (exists) {
    return exists
  }
  
  return prisma.recommendation.create({
    data: {
      article: { connect: { id: articleId } },
      recArticle: { connect: { id: recId } }
    },
    include: {
      article: true,
      recArticle: true
    }
  })
}

/**
 * 批量创建推荐
 * @param articleId 源文章ID
 * @param recIds 推荐文章ID数组
 * @returns 返回创建的推荐记录数组
 */
export const createRecommendations = async (articleId: number, recIds: number[]): Promise<Recommendation[]> => {
  const promises = recIds.map(recId => createRecommendation(articleId, recId))
  return Promise.all(promises)
}

/**
 * 删除推荐记录
 * @param id 推荐ID
 * @returns 返回被删除的推荐记录
 */
export const deleteRecommendation = async (id: number): Promise<Recommendation> => {
  return prisma.recommendation.delete({
    where: { id }
  })
}

/**
 * 删除文章的所有推荐
 * @param articleId 文章ID
 * @returns 返回被删除的推荐记录数量
 */
export const deleteArticleRecommendations = async (articleId: number): Promise<number> => {
  const result = await prisma.recommendation.deleteMany({
    where: { articleId }
  })
  return result.count
}

/**
 * 更新文章的推荐列表
 * @param articleId 文章ID
 * @param recIds 新的推荐文章ID数组
 * @returns 返回更新后的推荐记录数组
 */
export const updateArticleRecommendations = async (articleId: number, recIds: number[]): Promise<Recommendation[]> => {
  // 删除旧推荐
  await deleteArticleRecommendations(articleId)
  
  // 创建新推荐
  return createRecommendations(articleId, recIds)
} 