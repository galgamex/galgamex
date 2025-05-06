import prisma from "@/lib/prisma";
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client";

/**
 * 根据唯一条件查询单条评论（包含关联数据）
 * @param params 查询条件，需符合Prisma的CommentWhereUniqueInput类型
 * @returns 包含完整关联数据的评论对象
 */
export const findComment = async (params: Prisma.CommentWhereUniqueInput) => {
  return prisma.comment.findUnique({
    where: params,
    include: {
      author: true,
      parent: true,
      replies: true,
      like: true,
      article: true
    }
  });
}

/**
 * 根据条件查询多条评论（包含关联数据）
 * @param params 查询条件，需符合Prisma的CommentWhereInput类型
 * @param options 分页和排序选项
 * @returns 评论列表（包含关联数据）
 */
export const findComments = async (
  params: Prisma.CommentWhereInput,
  options?: {
    take?: number,
    skip?: number,
    orderBy?: Prisma.CommentOrderByWithRelationInput
  }
) => {
  return prisma.comment.findMany({
    where: params,
    include: {
      author: true,
      parent: true,
      replies: true,
      like: true,
      article: true
    },
    orderBy: options?.orderBy || { createdAt: 'desc' },
    take: options?.take || 10,
    skip: options?.skip || 0,
  });
}

/**
 * 根据条件统计评论数量
 * @param params 查询条件，需符合Prisma的CommentWhereInput类型
 * @returns 符合条件的评论总数
 */
export const findCommentsCount = async (params: Prisma.CommentWhereInput) => {
  return prisma.comment.count({ where: params });
}

/**
 * 创建新评论
 * @param params 评论数据，需符合Prisma的CommentCreateInput类型
 * @returns 新创建的评论对象
 */
export const createComment = async (params: Prisma.CommentCreateInput) => {
  return prisma.comment.create({
    data: params
  });
}

/**
 * 更新评论
 * @param params 包含where条件(唯一标识)和data(更新数据)的对象
 * @returns 更新后的评论对象
 */
export const updateComment = async (params: {
  where: Prisma.CommentWhereUniqueInput,
  data: Prisma.CommentUpdateInput
}) => {
  const { where, data } = params;
  return prisma.comment.update({ where, data });
}

/**
 * 删除评论
 * @param where 删除条件，需符合Prisma的CommentWhereUniqueInput类型
 * @returns 被删除的评论对象
 */
export const deleteComment = async (where: Prisma.CommentWhereUniqueInput) => {
  return prisma.comment.delete({ where });
}