import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"

/**
 * 根据唯一条件查询单个发行商
 * @param params 查询条件
 * @returns 返回发行商或null
 */
export const findPublisher = async (params: Prisma.PublisherWhereUniqueInput) => {
  return prisma.publisher.findUnique({
    where: params,
  })
}

/**
 * 根据条件查询多个发行商
 * @param params 查询条件
 * @returns 返回发行商数组
 */
export const findPublishers = async (params: Prisma.PublisherWhereInput) => {
  return prisma.publisher.findMany({ where: params })
}

/**
 * 统计符合条件的发行商数量
 * @param params 查询条件
 * @returns 返回发行商数量
 */
export const findPublisherCount = async (params: Prisma.PublisherWhereInput) => {
  return prisma.publisher.count({ where: params })
}

/**
 * 创建新发行商
 * @param data 发行商数据
 * @returns 返回创建的发行商
 */
export const createPublisher = async (data: Prisma.PublisherCreateInput) => {
  return prisma.publisher.create({ data })
}

/**
 * 更新发行商信息
 * @param params 查询条件（用于定位要更新的发行商）
 * @param data 更新数据
 * @returns 返回更新后的发行商
 */
export const updatePublisher = async (
  params: Prisma.PublisherWhereUniqueInput,
  data: Prisma.PublisherUpdateInput
) => {
  return prisma.publisher.update({ where: params, data })
}

/**
 * 删除发行商
 * @param params 查询条件（用于定位要删除的发行商）
 * @returns 返回被删除的发行商
 */
export const deletePublisher = async (params: Prisma.PublisherWhereUniqueInput) => {
  return prisma.publisher.delete({ where: params })
}

