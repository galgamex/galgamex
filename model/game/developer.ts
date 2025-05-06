import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"
import type { Developer } from "@prisma/client"

/**
 * 查找单个开发者
 * @param params 查询条件
 * @returns 返回开发者信息
 */
export const findDeveloper = async (params: Prisma.DeveloperWhereUniqueInput): Promise<Developer | null> => {
  return prisma.developer.findUnique({
    where: params,
  })
}

/**
 * 查找多个开发者
 * @param params 查询条件
 * @returns 返回开发者数组
 */
export const findDevelopers = async (params?: Prisma.DeveloperWhereInput): Promise<Developer[]> => {
  return prisma.developer.findMany({
    where: params,
    orderBy: {
      name: 'asc',
    },
  })
}

/**
 * 查找开发者数量
 * @param params 查询条件
 * @returns 返回开发者数量
 */
export const findDeveloperCount = async (params?: Prisma.DeveloperWhereInput): Promise<number> => {
  return prisma.developer.count({ where: params })
}

/**
 * 创建开发者
 * @param data 创建数据
 * @returns 返回创建的开发者记录
 */
export const createDeveloper = async (data: Prisma.DeveloperCreateInput): Promise<Developer> => {
  return prisma.developer.create({ data })
}

/**
 * 更新开发者
 * @param params 查询条件
 * @param data 更新数据
 * @returns 返回更新后的开发者记录
 */
export const updateDeveloper = async (
  params: Prisma.DeveloperWhereUniqueInput,
  data: Prisma.DeveloperUpdateInput
): Promise<Developer> => {
  return prisma.developer.update({ where: params, data })
}

/**
 * 删除开发者
 * @param params 查询条件
 * @returns 返回被删除的开发者记录
 */
export const deleteDeveloper = async (params: Prisma.DeveloperWhereUniqueInput): Promise<Developer> => {
  return prisma.developer.delete({ where: params })
}