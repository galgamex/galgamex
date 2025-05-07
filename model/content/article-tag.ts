import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"
// @ts-ignore - 忽略类型错误
import type { ArticleTag } from "@prisma/client"

/**
 * 关联文章和标签
 * @param articleId 文章ID
 * @param tagId 标签ID
 * @returns 返回创建的文章-标签关联
 */
export const connectArticleTag = async (articleId: number, tagId: number) => {
  return prisma.articleTag.create({
    data: {
      article: { connect: { id: articleId } },
      tag: { connect: { id: tagId } }
    },
    include: {
      article: true,
      tag: true
    }
  })
}

/**
 * 批量关联文章和标签
 * @param articleId 文章ID
 * @param tagIds 标签ID数组
 * @returns 返回创建的文章-标签关联数组
 */
export const connectArticleTags = async (articleId: number, tagIds: number[]) => {
  return Promise.all(tagIds.map(tagId => connectArticleTag(articleId, tagId)))
}

/**
 * 解除文章和标签的关联
 * @param articleId 文章ID
 * @param tagId 标签ID
 * @returns 返回删除的文章-标签关联
 */
export const disconnectArticleTag = async (articleId: number, tagId: number) => {
  return prisma.articleTag.delete({
    where: {
      articleId_tagId: {
        articleId,
        tagId
      }
    }
  })
}

/**
 * 批量解除文章和标签的关联
 * @param articleId 文章ID
 * @param tagIds 标签ID数组
 * @returns 返回删除的文章-标签关联数组
 */
export const disconnectArticleTags = async (articleId: number, tagIds: number[]) => {
  return Promise.all(tagIds.map(tagId => disconnectArticleTag(articleId, tagId)))
}

/**
 * 更新文章的标签列表（先删除所有关联，再创建新关联）
 * @param articleId 文章ID
 * @param tagIds 标签ID数组
 * @returns 返回更新后的文章-标签关联数组
 */
export const updateArticleTags = async (articleId: number, tagIds: number[]) => {
  // 先删除所有关联
  await prisma.articleTag.deleteMany({
    where: { articleId }
  })
  
  // 再创建新关联
  return connectArticleTags(articleId, tagIds)
}

/**
 * 获取文章的标签ID列表
 * @param articleId 文章ID
 * @returns 返回标签ID数组
 */
export const getArticleTagIds = async (articleId: number) => {
  const articleTags = await prisma.articleTag.findMany({
    where: { articleId },
    select: { tagId: true }
  })
  
  return articleTags.map((at: { tagId: number }) => at.tagId)
}

/**
 * 获取标签关联的文章ID列表
 * @param tagId 标签ID
 * @returns 返回文章ID数组
 */
export const getTagArticleIds = async (tagId: number) => {
  const articleTags = await prisma.articleTag.findMany({
    where: { tagId },
    select: { articleId: true }
  })
  
  return articleTags.map((at: { articleId: number }) => at.articleId)
} 