import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"

/**
 * 根据唯一条件查询单个游戏存档
 * @param params 查询条件
 * @returns 返回游戏存档或null
 */
export const findGameSave = async (params: Prisma.GameSaveWhereUniqueInput) => {
  return prisma.gameSave.findUnique({
    where: params,
    include: {
      article: true,  // 包含关联的游戏信息
      author: true    // 包含关联的用户信息
    }
  })
}

/**
 * 根据条件查询多个游戏存档
 * @param params 查询条件
 * @param options 分页和排序选项
 * @returns 返回游戏存档数组
 */
export const findGameSaves = async (
  params: Prisma.GameSaveWhereInput,
  options?: {
    take?: number,
    skip?: number,
    orderBy?: Prisma.GameSaveOrderByWithRelationInput
  }
) => {
  return prisma.gameSave.findMany({
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
 * 统计符合条件的游戏存档数量
 * @param params 查询条件
 * @returns 返回游戏存档数量
 */
export const findGameSavesCount = async (params: Prisma.GameSaveWhereInput) => {
  return prisma.gameSave.count({ where: params })
}

/**
 * 创建新游戏存档
 * @param data 游戏存档数据
 * @returns 返回创建的游戏存档
 */
export const createGameSave = async (data: Prisma.GameSaveCreateInput) => {
  return prisma.gameSave.create({ data })
}

/**
 * 更新游戏存档
 * @param whereInput 查询条件
 * @param data 更新数据
 * @returns 返回更新后的游戏存档
 */
export const updateGameSave = async (
  whereInput: Prisma.GameSaveWhereUniqueInput,
  data: Prisma.GameSaveUpdateInput
) => {
  return prisma.gameSave.update({
    where: whereInput,
    data
  })
}

/**
 * 删除游戏存档
 * @param where 删除条件
 * @returns 返回被删除的游戏存档
 */
export const deleteGameSave = async (where: Prisma.GameSaveWhereUniqueInput) => {
  return prisma.gameSave.delete({ where })
} 