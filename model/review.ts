import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

/**
 * 根据唯一条件查询单个审核记录（包含审核者信息）
 * @param params 查询条件
 * @returns 返回审核记录或null
 */
export const findReview = async (params: Prisma.ReviewWhereUniqueInput) => {
  return prisma.review.findUnique({
    where: params,
    include: {
      reviewer: true  // 包含关联的审核者信息
    }
  })
}

/**
 * 根据条件查询多个审核记录（包含审核者信息）
 * @param params 查询条件
 * @returns 返回审核记录数组
 */
export const findReviews = async (params: Prisma.ReviewWhereInput) => {
  return prisma.review.findMany({
    where: params,
    include: { reviewer: true }
  })
}

/**
 * 统计符合条件的审核记录数量
 * @param params 查询条件
 * @returns 返回审核记录数量
 */
export const findReviewCount = async (params: Prisma.ReviewWhereInput) => {
  return prisma.review.count({ where: params })
}

/**
 * 创建新审核记录
 * @param data 审核记录数据
 * @returns 返回创建的审核记录
 */
export const createReview = async (data: Prisma.ReviewCreateInput) => {
  return prisma.review.create({ data })
}

/**
 * 更新审核记录
 * @param params 查询条件（用于定位要更新的记录）
 * @param data 更新数据
 * @returns 返回更新后的审核记录
 */
export const updateReview = async (
  params: Prisma.ReviewWhereUniqueInput,
  data: Prisma.ReviewUpdateInput
) => {
  return prisma.review.update({ where: params, data })
}

/**
 * 删除审核记录
 * @param params 查询条件（用于定位要删除的记录）
 * @returns 返回被删除的审核记录
 */
export const deleteReview = async (params: Prisma.ReviewWhereUniqueInput) => {
  return prisma.review.delete({ where: params })
}
