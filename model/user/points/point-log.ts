import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"
// @ts-ignore - 忽略类型错误
import type { PointLog } from "@prisma/client"

/**
 * 查找单个积分记录
 * @param id 记录ID
 * @returns 返回积分记录信息
 */
export const findPointLog = async (id: number): Promise<PointLog | null> => {
  return prisma.pointLog.findUnique({
    where: { id },
    include: {
      userPoints: {
        select: {
          userId: true,
          points: true
        }
      }
    }
  })
}

/**
 * 查找用户的积分记录
 * @param userId 用户ID
 * @param limit 限制数量
 * @returns 返回积分记录数组
 */
export const findUserPointLogs = async (userId: number, limit: number = 20): Promise<PointLog[]> => {
  return prisma.pointLog.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit,
    include: {
      userPoints: {
        select: {
          userId: true,
          points: true
        }
      }
    }
  })
}

/**
 * 查找多个积分记录
 * @param params 查询条件
 * @returns 返回积分记录数组
 */
export const findPointLogs = async (params?: Prisma.PointLogWhereInput): Promise<PointLog[]> => {
  return prisma.pointLog.findMany({
    where: params,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      userPoints: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              nickname: true,
              avatar: true
            }
          }
        }
      }
    }
  })
}

/**
 * 查找积分记录数量
 * @param params 查询条件
 * @returns 返回积分记录数量
 */
export const findPointLogCount = async (params?: Prisma.PointLogWhereInput): Promise<number> => {
  return prisma.pointLog.count({ where: params })
}

/**
 * 创建积分记录
 * @param data 创建数据
 * @returns 返回创建的积分记录
 */
export const createPointLog = async (data: Prisma.PointLogCreateInput): Promise<PointLog> => {
  return prisma.pointLog.create({ data })
}

/**
 * 删除积分记录
 * @param id 记录ID
 * @returns 返回被删除的积分记录
 */
export const deletePointLog = async (id: number): Promise<PointLog> => {
  return prisma.pointLog.delete({ where: { id } })
}

/**
 * 查找指定类型的积分记录
 * @param type 积分类型
 * @param limit 限制数量
 * @returns 返回积分记录数组
 */
export const findPointLogsByType = async (type: Prisma.PointLogType, limit: number = 20): Promise<PointLog[]> => {
  return prisma.pointLog.findMany({
    where: { type },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit,
    include: {
      userPoints: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              nickname: true,
              avatar: true
            }
          }
        }
      }
    }
  })
} 