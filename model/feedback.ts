import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * 根据唯一条件查询单个反馈
 * @param params 查询条件，需符合Prisma的FeedbackWhereUniqueInput类型
 * @returns 包含完整关联数据的反馈对象
 */
export const findFeedback = async (params: Prisma.FeedbackWhereUniqueInput) => {
  return prisma.feedback.findUnique({
    where: params,
    include: {
      article: true,
      author: true
    }
  });
}

/**
 * 根据条件查询多个反馈
 * @param params 查询条件，需符合Prisma的FeedbackWhereInput类型
 * @param options 分页和排序选项
 * @returns 反馈列表（包含关联数据）
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
      article: true,
      author: true
    },
    orderBy: options?.orderBy || { createdAt: 'desc' },
    take: options?.take,
    skip: options?.skip
  });
}

/**
 * 根据条件统计反馈数量
 * @param params 查询条件，需符合Prisma的FeedbackWhereInput类型
 * @returns 符合条件的反馈总数
 */
export const findFeedbacksCount = async (params: Prisma.FeedbackWhereInput) => {
  return prisma.feedback.count({ where: params });
}

/**
 * 创建新反馈
 * @param params 反馈数据
 * @returns 新创建的反馈对象
 */
export const createFeedback = async (params: Prisma.FeedbackCreateInput) => {
  return prisma.feedback.create({
    data: params
  });
}

/**
 * 更新反馈
 * @param params 包含where条件和data的对象
 * @returns 更新后的反馈对象
 */
export const updateFeedback = async (params: {
  where: Prisma.FeedbackWhereUniqueInput,
  data: Prisma.FeedbackUpdateInput
}) => {
  const { where, data } = params;
  return prisma.feedback.update({ where, data });
}

/**
 * 删除反馈
 * @param where 删除条件，需符合Prisma的FeedbackWhereUniqueInput类型
 * @returns 被删除的反馈对象
 */
export const deleteFeedback = async (where: Prisma.FeedbackWhereUniqueInput) => {
  return prisma.feedback.delete({ where });
} 