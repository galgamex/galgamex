import prisma from "@/lib/prisma";

/**
 * 根据唯一条件查询单个游戏补丁
 * @param params 查询条件
 * @returns 包含完整关联数据的游戏补丁对象
 */
export const findGamePatch = async (params: any) => {
  return prisma.gamePatch.findUnique({
    where: params,
    include: {
      author: true
    }
  });
}

/**
 * 根据条件查询多个游戏补丁
 * @param params 查询条件
 * @param options 分页和排序选项
 * @returns 游戏补丁列表（包含关联数据）
 */
export const findGamePatches = async (
  params: any,
  options?: {
    take?: number,
    skip?: number,
    orderBy?: any
  }
) => {
  return prisma.gamePatch.findMany({
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
 * 根据条件统计游戏补丁数量
 * @param params 查询条件
 * @returns 符合条件的游戏补丁总数
 */
export const findGamePatchesCount = async (params: any) => {
  return prisma.gamePatch.count({ where: params });
}

/**
 * 创建新游戏补丁
 * @param params 游戏补丁数据
 * @returns 新创建的游戏补丁对象
 */
export const createGamePatch = async (params: any) => {
  return prisma.gamePatch.create({
    data: params
  });
}

/**
 * 更新游戏补丁
 * @param params 包含where条件和data的对象
 * @returns 更新后的游戏补丁对象
 */
export const updateGamePatch = async (params: {
  where: any,
  data: any
}) => {
  const { where, data } = params;
  return prisma.gamePatch.update({ where, data });
}

/**
 * 删除游戏补丁
 * @param where 删除条件
 * @returns 被删除的游戏补丁对象
 */
export const deleteGamePatch = async (where: any) => {
  return prisma.gamePatch.delete({ where });
} 