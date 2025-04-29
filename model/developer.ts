import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

/**
 * 根据条件查询开发者信息
 * @param params 查询条件
 * @returns 返回开发者信息
 */
export const findDeveloper = async (params: Prisma.DeveloperWhereUniqueInput) => {
  return prisma.developer.findUnique({
    where: params,
  })
}

/**
 * 根据条件查询开发者信息（与findDeveloper功能相同）
 * @param params 查询条件
 * @returns 返回开发者数组
 */
export const findDevelopers = async (params: Prisma.DeveloperWhereInput) => {
  return prisma.developer.findMany({ where: params })
}

/**
 * 统计符合条件的开发者数量
 * @param params 查询条件
 * @returns 返回开发者数量
 */
export const findDeveloperCount = async (params: Prisma.DeveloperWhereInput) => {
  return prisma.developer.count({ where: params })
}

/**
 * 创建新开发者记录
 * @param data 开发者数据
 * @returns 返回创建的开发者记录
 */
export const createDeveloper = async (data: Prisma.DeveloperCreateInput) => {
  return prisma.developer.create({ data })
}

/**
 * 更新开发者信息
 * @param params 查询条件（用于定位要更新的开发者）
 * @param data 更新数据
 * @returns 返回更新后的开发者记录
 */
export const updateDeveloper = async (
  params: Prisma.DeveloperWhereUniqueInput,
  data: Prisma.DeveloperUpdateInput
) => {
  return prisma.developer.update({ where: params, data })
}

/**
 * 删除开发者记录
 * @param params 查询条件（用于定位要删除的开发者）
 * @returns 返回被删除的开发者记录
 */
export const deleteDeveloper = async (params: Prisma.DeveloperWhereUniqueInput) => {
  return prisma.developer.delete({ where: params })
}