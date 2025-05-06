import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"
// @ts-ignore - 忽略类型错误
import type { LevelLog } from "@prisma/client"

/**
 * 查找单个等级日志
 * @param id 日志ID
 * @returns 返回等级日志信息
 */
export const findLevelLog = async (id: number): Promise<LevelLog | null> => {
  return prisma.levelLog.findUnique({
    where: { id }
  })
}

/**
 * 查找用户的等级变化日志
 * @param userId 用户ID
 * @param page 页码
 * @param pageSize 每页大小
 * @returns 返回等级日志数组
 */
export const findUserLevelLogs = async (
  userId: number,
  page = 1,
  pageSize = 10
): Promise<LevelLog[]> => {
  return prisma.levelLog.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc'
    },
    skip: (page - 1) * pageSize,
    take: pageSize
  })
}

/**
 * 查找多个等级日志
 * @param params 查询条件
 * @param page 页码
 * @param pageSize 每页大小
 * @returns 返回等级日志数组
 */
export const findLevelLogs = async (
  params?: Prisma.LevelLogWhereInput,
  page = 1,
  pageSize = 10
): Promise<LevelLog[]> => {
  return prisma.levelLog.findMany({
    where: params,
    orderBy: {
      createdAt: 'desc'
    },
    skip: (page - 1) * pageSize,
    take: pageSize
  })
}

/**
 * 查找等级日志数量
 * @param params 查询条件
 * @returns 返回等级日志数量
 */
export const findLevelLogCount = async (params?: Prisma.LevelLogWhereInput): Promise<number> => {
  return prisma.levelLog.count({ where: params })
}

/**
 * 创建等级日志
 * @param data 创建数据
 * @returns 返回创建的等级日志
 */
export const createLevelLog = async (data: Prisma.LevelLogCreateInput): Promise<LevelLog> => {
  return prisma.levelLog.create({ data })
}

/**
 * 删除等级日志
 * @param id 日志ID
 * @returns 返回被删除的等级日志
 */
export const deleteLevelLog = async (id: number): Promise<LevelLog> => {
  return prisma.levelLog.delete({ where: { id } })
}

/**
 * 清理特定日期之前的等级日志
 * @param beforeDate 日期
 * @returns 返回被删除的等级日志数量
 */
export const clearOldLevelLogs = async (beforeDate: Date): Promise<number> => {
  const result = await prisma.levelLog.deleteMany({
    where: {
      createdAt: {
        lt: beforeDate
      }
    }
  })
  return result.count
}

/**
 * 记录用户等级变化
 * @param userId 用户ID
 * @param oldLevel 旧等级
 * @param newLevel 新等级
 * @param reason 变化原因
 * @returns 返回创建的等级日志
 */
export const logLevelChange = async (
  userId: number,
  oldLevel: number,
  newLevel: number,
  reason: string
): Promise<LevelLog> => {
  return createLevelLog({
    user: { connect: { id: userId } },
    oldLevel,
    newLevel,
    reason
  })
} 