import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"

/**
 * 根据唯一条件查询单个游戏补丁
 * @param params 查询条件
 * @returns 返回游戏补丁或null
 */
export const findGamePatch = async (params: Prisma.GamePatchWhereUniqueInput) => {
  return prisma.gamePatch.findUnique({
    where: params,
    include: {
      article: true,  // 包含关联的游戏信息
      author: true    // 包含关联的用户信息
    }
  })
}

/**
 * 根据条件查询多个游戏补丁
 * @param params 查询条件
 * @param options 分页和排序选项
 * @returns 返回游戏补丁数组
 */
export const findGamePatches = async (
  params: Prisma.GamePatchWhereInput,
  options?: {
    take?: number,
    skip?: number,
    orderBy?: Prisma.GamePatchOrderByWithRelationInput
  }
) => {
  return prisma.gamePatch.findMany({
    where: params,
    include: {
      article: true,
      author: true
    },
    orderBy: options?.orderBy || { createdAt: 'desc' },
    take: options?.take || 10,
    skip: options?.skip || 0,
  })
}

/**
 * 统计符合条件的游戏补丁数量
 * @param params 查询条件
 * @returns 返回游戏补丁数量
 */
export const findGamePatchesCount = async (params: Prisma.GamePatchWhereInput) => {
  return prisma.gamePatch.count({ where: params })
}

/**
 * 创建新游戏补丁
 * @param data 游戏补丁数据
 * @returns 返回创建的游戏补丁
 */
export const createGamePatch = async (data: Prisma.GamePatchCreateInput) => {
  return prisma.gamePatch.create({ data })
}

/**
 * 更新游戏补丁
 * @param whereInput 查询条件
 * @param data 更新数据
 * @returns 返回更新后的游戏补丁
 */
export const updateGamePatch = async (
  whereInput: Prisma.GamePatchWhereUniqueInput,
  data: Prisma.GamePatchUpdateInput
) => {
  return prisma.gamePatch.update({
    where: whereInput,
    data
  })
}

/**
 * 删除游戏补丁
 * @param where 删除条件
 * @returns 返回被删除的游戏补丁
 */
export const deleteGamePatch = async (where: Prisma.GamePatchWhereUniqueInput) => {
  return prisma.gamePatch.delete({ where })
} 