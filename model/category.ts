import prisma from "@/lib/prisma";

/**
 * 根据唯一条件查询单个分类
 * @param params 查询条件
 * @returns 返回匹配的分类或null
 */
export const findCategory = async (params: any) => {
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
 * @param options 分页和排序选项
 * @returns 返回匹配的分类数组
 */
export const findCategories = async (
  params: any,
  options?: {
    skip?: number,
    take?: number,
    orderBy?: any,
    include?: any
  }
) => {
  return prisma.category.findMany({
    where: params,
    include: options?.include || {
      children: true,
      parent: true,
      author: true,
    },
    skip: options?.skip,
    take: options?.take,
    orderBy: options?.orderBy
  })
}

/**
 * 统计分类数量
 * @param params 查询条件
 * @returns 返回匹配的分类数量
 */
export const findCategoriesCount = async (params: any) => {
  return prisma.category.count({
    where: params,
  })
}

/**
 * 创建新分类
 * @param data 分类数据
 * @returns 返回创建的分类
 */
export const createCategory = async (data: any) => {
  return prisma.category.create({ data })
}

/**
 * 更新分类
 * @param params 包含where条件和要更新的数据
 * @returns 返回更新后的分类
 */
export const updateCategory = async (params: {
  where: any,
  data: any
}) => {
  const { where, data } = params;
  return prisma.category.update({ where, data })
}

/**
 * 删除单个分类
 * @param params 查询条件(用于定位要删除的分类)
 * @returns 返回被删除的分类
 */
export const deleteCategory = async (params: any) => {
  return prisma.category.delete({ where: params })
}

/**
 * 批量删除分类
 * @param params 查询条件(用于定位要删除的分类)
 * @returns 返回删除操作结果
 */
export const deleteCategories = async (params: any) => {
  return prisma.category.deleteMany({ where: params })
}