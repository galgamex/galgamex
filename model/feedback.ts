import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"

/**
 * 根据唯一条件查询单个反馈
 * @param params 查询条件
 * @returns 返回反馈或null
 */
export const findFeedback = async (params: Prisma.FeedbackWhereUniqueInput) => {
  return prisma.feedback.findUnique({
    where: params,
    include: {
      author: true,  // 包含关联的用户信息
      article: true  // 包含关联的文章信息
    }
  })
}

/**
 * 根据条件查询多个反馈
 * @param params 查询条件
 * @param options 分页和排序选项
 * @returns 返回反馈数组
 */
export const findFeedbacks = async (
  params: Prisma.FeedbackWhereInput,
  options?: {
    take?: number,
    skip?: number,
    orderBy?: Prisma.FeedbackOrderByWithRelationInput
  }
) => {
  return prisma.feedback.findMany({
    where: params,
    include: {
      author: true,
      article: true
    },
    orderBy: options?.orderBy || { createdAt: 'desc' },
    take: options?.take || 10,
    skip: options?.skip || 0,
  })
}

/**
 * 统计符合条件的反馈数量
 * @param params 查询条件
 * @returns 返回反馈数量
 */
export const findFeedbacksCount = async (params: Prisma.FeedbackWhereInput) => {
  return prisma.feedback.count({ where: params })
}

/**
 * 创建新反馈
 * @param data 反馈数据
 * @returns 返回创建的反馈
 */
export const createFeedback = async (data: Prisma.FeedbackCreateInput) => {
  return prisma.feedback.create({ data })
}

/**
 * 更新反馈
 * @param params 包含where条件(唯一标识)和data(更新数据)的对象
 * @returns 返回更新后的反馈
 */
export const updateFeedback = async (params: {
  where: Prisma.FeedbackWhereUniqueInput,
  data: Prisma.FeedbackUpdateInput
}) => {
  const { where, data } = params
  return prisma.feedback.update({ where, data })
}

/**
 * 删除反馈
 * @param where 删除条件
 * @returns 返回被删除的反馈
 */
export const deleteFeedback = async (where: Prisma.FeedbackWhereUniqueInput) => {
  return prisma.feedback.delete({ where })
} 