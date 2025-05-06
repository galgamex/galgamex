import prisma from "@/lib/prisma";
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client";

/**
 * 根据唯一条件查询单个分类
 * @param params 查询条件
 * @returns 返回匹配的分类或null
 */
export const findCategory = async (params: Prisma.CategoryWhereUniqueInput) => {
  return prisma.category.findUnique({
    where: params,
    include: {
      children: true,  // 包含子分类
      parent: true,    // 包含父分类
      author: true,    // 包含创建者信息
    }
  })
}

/**
 * 查询多个分类
 * @param params 查询条件
 * @returns 返回匹配的分类数组
 */
export const findCategories = async (params: Prisma.CategoryWhereInput) => {
  return prisma.category.findMany({
    where: params,
    include: {
      children: true,
      parent: true,
      author: true,
    }
  })
}

/**
 * 统计分类数量
 * @param params 查询条件
 * @returns 返回匹配的分类数量
 */
export const findCategoryCount = async (params: Prisma.CategoryWhereInput) => {
  return prisma.category.count({
    where: params,
  })
}

/**
 * 创建新分类
 * @param data 分类数据
 * @returns 返回创建的分类
 */
export const createCategory = async (data: Prisma.CategoryCreateInput) => {
  return prisma.category.create({ data })
}

/**
 * 更新分类
 * @param params 查询条件(用于定位要更新的分类)
 * @param data 更新数据
 * @returns 返回更新后的分类
 */
export const updateCategory = async (params: Prisma.CategoryWhereUniqueInput, data: Prisma.CategoryUpdateInput) => {
  return prisma.category.update({ where: params, data })
}

/**
 * 删除单个分类
 * @param params 查询条件(用于定位要删除的分类)
 * @returns 返回被删除的分类
 */
export const deleteCategory = async (params: Prisma.CategoryWhereUniqueInput) => {
  return prisma.category.delete({ where: params })
}

/**
 * 批量删除分类
 * @param params 查询条件(用于定位要删除的分类)
 * @returns 返回删除操作结果
 */
export const deleteCategories = async (params: Prisma.CategoryWhereInput) => {
  return prisma.category.deleteMany({ where: params })
}