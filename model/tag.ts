import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

/**
 * 根据条件查询多个标签（包含关联的分类信息）
 * @param params 查询条件
 * @returns 返回标签数组
 */
export const findTag = async (params: Prisma.TagWhereInput) => {
  return prisma.tag.findMany({
    where: params,
    include: {
      category: true,  // 包含关联的分类信息
    }
  })
}

/**
 * 根据条件查询多个标签（不包含关联信息）
 * @param params 查询条件
 * @returns 返回标签数组
 */
export const findTags = async (params: Prisma.TagWhereInput) => {
  return prisma.tag.findMany({ where: params })
}

/**
 * 统计符合条件的标签数量
 * @param params 查询条件
 * @returns 返回标签数量
 */
export const findTagCount = async (params: Prisma.TagWhereInput) => {
  return prisma.tag.count({ where: params })
}

/**
 * 创建新标签
 * @param data 标签数据
 * @returns 返回创建的标签
 */
export const createTag = async (data: Prisma.TagCreateInput) => {
  return prisma.tag.create({ data })
}

/**
 * 更新标签
 * @param params 查询条件（用于定位要更新的标签）
 * @param data 更新数据
 * @returns 返回更新后的标签
 */
export const updateTag = async (params: Prisma.TagWhereUniqueInput, data: Prisma.TagUpdateInput) => {
  return prisma.tag.update({ where: params, data })
}

/**
 * 删除标签
 * @param params 查询条件（用于定位要删除的标签）
 * @returns 返回被删除的标签
 */
export const deleteTag = async (params: Prisma.TagWhereUniqueInput) => {
  return prisma.tag.delete({ where: params })
}

