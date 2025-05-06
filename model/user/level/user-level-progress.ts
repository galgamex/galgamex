import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"
// @ts-ignore - 忽略类型错误
import type { UserLevelProgress } from "@prisma/client"
import { findUserLevel, findNextLevel } from "./user-level"

/**
 * 查找用户等级进度
 * @param userId 用户ID
 * @returns 返回用户等级进度信息
 */
export const findUserLevelProgress = async (userId: number): Promise<UserLevelProgress | null> => {
  return prisma.userLevelProgress.findUnique({
    where: { userId }
  })
}

/**
 * 查找多个用户等级进度
 * @param params 查询条件
 * @param page 页码
 * @param pageSize 每页大小
 * @returns 返回用户等级进度数组
 */
export const findUserLevelProgresses = async (
  params?: Prisma.UserLevelProgressWhereInput,
  page = 1,
  pageSize = 10
): Promise<UserLevelProgress[]> => {
  return prisma.userLevelProgress.findMany({
    where: params,
    orderBy: {
      updatedAt: 'desc'
    },
    skip: (page - 1) * pageSize,
    take: pageSize
  })
}

/**
 * 查找用户等级进度数量
 * @param params 查询条件
 * @returns 返回用户等级进度数量
 */
export const findUserLevelProgressCount = async (
  params?: Prisma.UserLevelProgressWhereInput
): Promise<number> => {
  return prisma.userLevelProgress.count({ where: params })
}

/**
 * 创建用户等级进度
 * @param data 创建数据
 * @returns 返回创建的用户等级进度
 */
export const createUserLevelProgress = async (
  data: Prisma.UserLevelProgressCreateInput
): Promise<UserLevelProgress> => {
  return prisma.userLevelProgress.create({ data })
}

/**
 * 更新用户等级进度
 * @param userId 用户ID
 * @param data 更新数据
 * @returns 返回更新后的用户等级进度
 */
export const updateUserLevelProgress = async (
  userId: number,
  data: Prisma.UserLevelProgressUpdateInput
): Promise<UserLevelProgress> => {
  return prisma.userLevelProgress.update({
    where: { userId },
    data
  })
}

/**
 * 删除用户等级进度
 * @param userId 用户ID
 * @returns 返回被删除的用户等级进度
 */
export const deleteUserLevelProgress = async (userId: number): Promise<UserLevelProgress> => {
  return prisma.userLevelProgress.delete({ where: { userId } })
}

/**
 * 增加用户经验值并处理等级升级
 * @param userId 用户ID
 * @param expAmount 增加的经验值
 * @returns 返回更新后的用户等级进度和是否升级信息
 */
export const addUserExp = async (
  userId: number,
  expAmount: number
): Promise<{ progress: UserLevelProgress; levelUp: boolean; newLevel: number | null }> => {
  // 查找当前用户等级进度
  let progress = await findUserLevelProgress(userId)
  let levelUp = false
  let oldLevel = null
  
  // 如果用户还没有等级进度记录，则创建一个
  if (!progress) {
    // 查找最低等级
    const lowestLevel = await findUserLevel(1)
    if (!lowestLevel) {
      throw new Error("找不到初始等级设置")
    }
    
    progress = await createUserLevelProgress({
      user: { connect: { id: userId } },
      currentLevel: { connect: { id: lowestLevel.id } },
      currentExp: 0,
      totalExp: 0
    })
    
    oldLevel = lowestLevel.level
  } else {
    oldLevel = progress.currentLevelId
  }
  
  // 增加经验值
  const updatedProgress = await updateUserLevelProgress(userId, {
    currentExp: { increment: expAmount },
    totalExp: { increment: expAmount }
  })
  
  // 检查是否可以升级
  const currentLevel = await findUserLevel(updatedProgress.currentLevelId)
  if (!currentLevel) {
    throw new Error("当前等级信息不存在")
  }
  
  const nextLevel = await findNextLevel(currentLevel.level)
  
  // 如果有下一个等级并且当前经验值足够升级
  if (nextLevel && updatedProgress.currentExp >= nextLevel.requiredExp) {
    // 升级
    await updateUserLevelProgress(userId, {
      currentLevel: { connect: { id: nextLevel.id } },
      currentExp: updatedProgress.currentExp - nextLevel.requiredExp
    })
    
    // 获取最新的进度信息
    const newProgress = await findUserLevelProgress(userId)
    if (!newProgress) {
      throw new Error("无法获取更新后的用户等级进度")
    }
    
    return {
      progress: newProgress,
      levelUp: true,
      newLevel: nextLevel.level
    }
  }
  
  return {
    progress: updatedProgress,
    levelUp: false,
    newLevel: null
  }
} 