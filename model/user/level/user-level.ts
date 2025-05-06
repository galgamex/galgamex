import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"
// @ts-ignore - 忽略类型错误
import type { UserLevel } from "@prisma/client"

/**
 * 查找单个用户等级
 * @param id 等级ID
 * @returns 返回用户等级信息
 */
export const findUserLevel = async (id: number): Promise<UserLevel | null> => {
  return prisma.userLevel.findUnique({
    where: { id }
  })
}

/**
 * 根据等级值查找用户等级
 * @param level 等级值
 * @returns 返回用户等级信息
 */
export const findUserLevelByLevel = async (level: number): Promise<UserLevel | null> => {
  return prisma.userLevel.findUnique({
    where: { level }
  })
}

/**
 * 查找多个用户等级
 * @param params 查询条件
 * @returns 返回用户等级数组
 */
export const findUserLevels = async (params?: Prisma.UserLevelWhereInput): Promise<UserLevel[]> => {
  return prisma.userLevel.findMany({
    where: params,
    orderBy: {
      level: 'asc',
    }
  })
}

/**
 * 查找用户等级数量
 * @param params 查询条件
 * @returns 返回用户等级数量
 */
export const findUserLevelCount = async (params?: Prisma.UserLevelWhereInput): Promise<number> => {
  return prisma.userLevel.count({ where: params })
}

/**
 * 创建用户等级
 * @param data 创建数据
 * @returns 返回创建的用户等级
 */
export const createUserLevel = async (data: Prisma.UserLevelCreateInput): Promise<UserLevel> => {
  return prisma.userLevel.create({ data })
}

/**
 * 更新用户等级
 * @param id 等级ID
 * @param data 更新数据
 * @returns 返回更新后的用户等级
 */
export const updateUserLevel = async (
  id: number,
  data: Prisma.UserLevelUpdateInput
): Promise<UserLevel> => {
  return prisma.userLevel.update({
    where: { id },
    data
  })
}

/**
 * 删除用户等级
 * @param id 等级ID
 * @returns 返回被删除的用户等级
 */
export const deleteUserLevel = async (id: number): Promise<UserLevel> => {
  return prisma.userLevel.delete({ where: { id } })
}

/**
 * 查找下一个等级
 * @param currentLevel 当前等级值
 * @returns 返回下一个等级信息，如果没有下一个等级则返回null
 */
export const findNextLevel = async (currentLevel: number): Promise<UserLevel | null> => {
  return prisma.userLevel.findFirst({
    where: {
      level: {
        gt: currentLevel
      }
    },
    orderBy: {
      level: 'asc'
    }
  })
}

/**
 * 根据经验值查找对应等级
 * @param exp 经验值
 * @returns 返回对应的等级信息
 */
export const findLevelByExp = async (exp: number): Promise<UserLevel | null> => {
  return prisma.userLevel.findFirst({
    where: {
      requiredExp: {
        lte: exp
      }
    },
    orderBy: {
      requiredExp: 'desc'
    }
  })
} 