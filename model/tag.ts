import prisma from "@/lib/prisma"

/**
 * 根据唯一条件查询单个标签
 * @param params 查询条件
 * @returns 返回匹配的标签或null
 */
export const findTag = async (params: any) => {
  return prisma.tag.findUnique({
    where: params,
    include: {
      category: true,  // 包含关联的分类信息
    }
  })
}

/**
 * 根据条件查询多个标签
 * @param params 查询条件
 * @param options 分页和排序选项
 * @returns 返回标签数组
 */
export const findTags = async (
  params: any,
  options?: {
    skip?: number,
    take?: number,
    orderBy?: any
  }
) => {
  return prisma.tag.findMany({ 
    where: params,
    skip: options?.skip,
    take: options?.take,
    orderBy: options?.orderBy
  })
}

/**
 * 统计符合条件的标签数量
 * @param params 查询条件
 * @returns 返回标签数量
 */
export const findTagsCount = async (params: any) => {
  return prisma.tag.count({ where: params })
}

/**
 * 创建新标签
 * @param data 标签数据
 * @returns 返回创建的标签
 */
export const createTag = async (data: any) => {
  return prisma.tag.create({ data })
}

/**
 * 更新标签
 * @param params 包含where条件和要更新的数据
 * @returns 返回更新后的标签
 */
export const updateTag = async (params: {
  where: any,
  data: any
}) => {
  const { where, data } = params;
  return prisma.tag.update({ where, data })
}

/**
 * 删除标签
 * @param params 查询条件（用于定位要删除的标签）
 * @returns 返回被删除的标签
 */
export const deleteTag = async (params: any) => {
  return prisma.tag.delete({ where: params })
}

