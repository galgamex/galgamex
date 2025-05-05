import prisma from "@/lib/prisma";

/**
 * 根据唯一条件查询单条评论（包含关联数据）
 * @param params 查询条件
 * @returns 包含完整关联数据的评论对象
 */
export const findComment = async (params: any) => {
  return prisma.comment.findUnique({
    where: params,
    include: {
      author: true,
      parent: true,
      replies: true,
      like: true
    }
  });
}

/**
 * 根据条件查询多条评论（包含关联数据）
 * @param params 查询条件
 * @param options 分页和排序选项
 * @returns 评论列表（包含关联数据）
 */
export const findComments = async (
  params: any,
  options?: {
    take?: number,
    skip?: number,
    orderBy?: any
  }
) => {
  return prisma.comment.findMany({
    where: params,
    include: {
      author: true,
      parent: true,
      replies: true,
      like: true
    },
    orderBy: options?.orderBy || { createdAt: 'desc' },
    take: options?.take || 10,
    skip: options?.skip || 0,
  });
}

/**
 * 根据条件统计评论数量
 * @param params 查询条件
 * @returns 符合条件的评论总数
 */
export const findCommentsCount = async (params: any) => {
  return prisma.comment.count({ where: params });
}

/**
 * 创建新评论
 * @param params 评论数据
 * @returns 新创建的评论对象
 */
export const createComment = async (params: any) => {
  return prisma.comment.create({
    data: params
  });
}

/**
 * 更新评论
 * @param params 包含where条件和data的对象
 * @returns 更新后的评论对象
 */
export const updateComment = async (params: {
  where: any,
  data: any
}) => {
  const { where, data } = params;
  return prisma.comment.update({ where, data });
}

/**
 * 删除评论
 * @param where 删除条件
 * @returns 被删除的评论对象
 */
export const deleteComment = async (where: any) => {
  return prisma.comment.delete({ where });
}