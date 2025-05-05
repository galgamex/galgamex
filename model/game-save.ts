import prisma from "@/lib/prisma";

/**
 * 根据唯一条件查询单个游戏存档
 * @param params 查询条件
 * @returns 包含完整关联数据的游戏存档对象
 */
export const findGameSave = async (params: any) => {
  return prisma.gameSave.findUnique({
    where: params,
    include: {
      author: true
    }
  });
}

/**
 * 根据条件查询多个游戏存档
 * @param params 查询条件
 * @param options 分页和排序选项
 * @returns 游戏存档列表（包含关联数据）
 */
export const findGameSaves = async (
  params: any,
  options?: {
    take?: number,
    skip?: number,
    orderBy?: any
  }
) => {
  return prisma.gameSave.findMany({
    where: params,
    include: {
      author: true
    },
    orderBy: options?.orderBy || { createdAt: 'desc' },
    take: options?.take,
    skip: options?.skip
  });
}

/**
 * 根据条件统计游戏存档数量
 * @param params 查询条件
 * @returns 符合条件的游戏存档总数
 */
export const findGameSavesCount = async (params: any) => {
  return prisma.gameSave.count({ where: params });
}

/**
 * 创建新游戏存档
 * @param params 游戏存档数据
 * @returns 新创建的游戏存档对象
 */
export const createGameSave = async (params: any) => {
  return prisma.gameSave.create({
    data: params
  });
}

/**
 * 更新游戏存档
 * @param params 包含where条件和data的对象
 * @returns 更新后的游戏存档对象
 */
export const updateGameSave = async (params: {
  where: any,
  data: any
}) => {
  const { where, data } = params;
  return prisma.gameSave.update({ where, data });
}

/**
 * 删除游戏存档
 * @param where 删除条件
 * @returns 被删除的游戏存档对象
 */
export const deleteGameSave = async (where: any) => {
  return prisma.gameSave.delete({ where });
} 