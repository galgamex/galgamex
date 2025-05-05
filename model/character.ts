import prisma from "@/lib/prisma"

/**
 * 根据唯一条件查询单个角色
 * @param params 查询条件
 * @returns 返回匹配的角色或null
 */
export const findCharacter = async (params: any) => {
  return prisma.character.findUnique({
    where: params,
  })
}

/**
 * 根据条件查询多个角色
 * @param params 查询条件
 * @param options 分页和排序选项
 * @returns 返回角色数组
 */
export const findCharacters = async (
  params: any,
  options?: {
    skip?: number,
    take?: number,
    orderBy?: any
  }
) => {
  return prisma.character.findMany({ 
    where: params,
    skip: options?.skip,
    take: options?.take,
    orderBy: options?.orderBy
  })
}

/**
 * 统计符合条件的角色数量
 * @param params 查询条件
 * @returns 返回角色数量
 */
export const findCharactersCount = async (params: any) => {
  return prisma.character.count({ where: params })
}

/**
 * 创建新角色
 * @param data 角色数据
 * @returns 返回创建的角色
 */
export const createCharacter = async (data: any) => {
  return prisma.character.create({ data })
}

/**
 * 更新角色信息
 * @param params 包含where条件和要更新的数据
 * @returns 返回更新后的角色
 */
export const updateCharacter = async (params: {
  where: any,
  data: any
}) => {
  const { where, data } = params;
  return prisma.character.update({ where, data })
}

/**
 * 删除角色
 * @param params 查询条件（用于定位要删除的角色）
 * @returns 返回被删除的角色
 */
export const deleteCharacter = async (params: any) => {
  return prisma.character.delete({ where: params })
}