import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"
// @ts-ignore - 忽略类型错误
import type { Publisher } from "@prisma/client"

/**
 * 查找单个发行商
 * @param params 查询条件
 * @returns 返回发行商信息
 */
export const findPublisher = async (params: Prisma.PublisherWhereUniqueInput): Promise<Publisher | null> => {
  return prisma.publisher.findUnique({
    where: params,
  })
}

/**
 * 查找多个发行商
 * @param params 查询条件
 * @returns 返回发行商数组
 */
export const findPublishers = async (params?: Prisma.PublisherWhereInput): Promise<Publisher[]> => {
  return prisma.publisher.findMany({
    where: params,
    orderBy: {
      name: 'asc',
    },
  })
}

/**
 * 查找发行商数量
 * @param params 查询条件
 * @returns 返回发行商数量
 */
export const findPublisherCount = async (params?: Prisma.PublisherWhereInput): Promise<number> => {
  return prisma.publisher.count({ where: params })
}

/**
 * 创建发行商
 * @param data 创建数据
 * @returns 返回创建的发行商记录
 */
export const createPublisher = async (data: Prisma.PublisherCreateInput): Promise<Publisher> => {
  return prisma.publisher.create({ data })
}

/**
 * 更新发行商
 * @param params 查询条件
 * @param data 更新数据
 * @returns 返回更新后的发行商记录
 */
export const updatePublisher = async (
  params: Prisma.PublisherWhereUniqueInput,
  data: Prisma.PublisherUpdateInput
): Promise<Publisher> => {
  return prisma.publisher.update({ where: params, data })
}

/**
 * 删除发行商
 * @param params 查询条件
 * @returns 返回被删除的发行商记录
 */
export const deletePublisher = async (params: Prisma.PublisherWhereUniqueInput): Promise<Publisher> => {
  return prisma.publisher.delete({ where: params })
}

