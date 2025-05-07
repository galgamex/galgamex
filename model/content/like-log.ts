import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"
// @ts-ignore - 忽略类型错误
import type { LikeLog } from "@prisma/client"

/**
 * 根据唯一条件查询单个点赞记录
 * @param params 查询条件
 * @returns 返回点赞记录或null
 */
export const findLikeLog = async (params: Prisma.LikeLogWhereUniqueInput) => {
  return prisma.likeLog.findUnique({
    where: params,
    include: {
      article: true,  // 包含关联的文章信息
      comment: true,  // 包含关联的评论信息
      author: true    // 包含关联的用户信息
    }
  })
}

/**
 * 根据条件查询多个点赞记录
 * @param params 查询条件
 * @param options 分页和排序选项
 * @returns 返回点赞记录数组
 */
export const findLikeLogs = async (
  params: Prisma.LikeLogWhereInput,
  options?: {
    take?: number,
    skip?: number,
    orderBy?: Prisma.LikeLogOrderByWithRelationInput
  }
) => {
  return prisma.likeLog.findMany({
    where: params,
    include: {
      article: true,
      comment: true,
      author: true
    },
    orderBy: options?.orderBy || { createdAt: 'desc' },
    take: options?.take || 10,
    skip: options?.skip || 0,
  })
}

/**
 * 统计符合条件的点赞记录数量
 * @param params 查询条件
 * @returns 返回点赞记录数量
 */
export const findLikeLogsCount = async (params: Prisma.LikeLogWhereInput) => {
  return prisma.likeLog.count({ where: params })
}

/**
 * 创建新点赞记录
 * @param data 点赞记录数据
 * @returns 返回创建的点赞记录
 */
export const createLikeLog = async (data: Prisma.LikeLogCreateInput) => {
  return prisma.likeLog.create({ data })
}

/**
 * 更新点赞记录
 * @param params 包含where条件(唯一标识)和data(更新数据)的对象
 * @returns 返回更新后的点赞记录
 */
export const updateLikeLog = async (params: {
  where: Prisma.LikeLogWhereUniqueInput,
  data: Prisma.LikeLogUpdateInput
}) => {
  const { where, data } = params
  return prisma.likeLog.update({ where, data })
}

/**
 * 删除点赞记录
 * @param where 删除条件
 * @returns 返回被删除的点赞记录
 */
export const deleteLikeLog = async (where: Prisma.LikeLogWhereUniqueInput) => {
  return prisma.likeLog.delete({ where })
}

/**
 * 检查用户是否已点赞
 * @param authorId 用户ID
 * @param type 点赞类型
 * @param targetId 目标ID(文章ID或评论ID)
 * @returns 返回布尔值，表示是否已点赞
 */
export const hasLiked = async (authorId: number, type: Prisma.LikeType, targetId: number) => {
  const count = await prisma.likeLog.count({
    where: {
      authorId,
      type,
      ...(type === 'ARTICLE' ? { articleId: targetId } : { commentId: targetId })
    }
  })
  return count > 0
} 