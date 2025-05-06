import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"
// @ts-ignore - 忽略类型错误
import type { UserPoints, PointLog } from "@prisma/client"

/**
 * 查找用户积分
 * @param userId 用户ID
 * @returns 返回用户积分信息
 */
export const findUserPoints = async (userId: number): Promise<UserPoints | null> => {
  return prisma.userPoints.findUnique({
    where: { userId },
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
  })
}

/**
 * 查找多个用户积分记录
 * @param params 查询条件
 * @returns 返回用户积分记录数组
 */
export const findUserPointsList = async (params?: Prisma.UserPointsWhereInput): Promise<UserPoints[]> => {
  return prisma.userPoints.findMany({
    where: params,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          nickname: true,
          avatar: true
        }
      }
    },
    orderBy: {
      points: 'desc',
    },
  })
}

/**
 * 查找用户积分记录数量
 * @param params 查询条件
 * @returns 返回用户积分记录数量
 */
export const findUserPointsCount = async (params?: Prisma.UserPointsWhereInput): Promise<number> => {
  return prisma.userPoints.count({ where: params })
}

/**
 * 创建或更新用户积分
 * @param userId 用户ID
 * @param points 积分变动数量(正数增加,负数减少)
 * @param type 积分变动类型
 * @param description 变动描述
 * @returns 返回更新后的用户积分
 */
export const updateUserPoints = async (
  userId: number,
  points: number,
  type: Prisma.PointLogType,
  description?: string
): Promise<{ userPoints: UserPoints; pointLog: PointLog }> => {
  return prisma.$transaction(async (prisma: typeof import('@/lib/prisma').default) => {
    // 查找或创建用户积分记录
    let userPoints = await prisma.userPoints.findUnique({
      where: { userId }
    })
    
    if (!userPoints) {
      userPoints = await prisma.userPoints.create({
        data: {
          userId,
          points: 0,
          totalEarned: 0,
          totalSpent: 0
        }
      })
    }
    
    // 更新积分总数
    const updatedUserPoints = await prisma.userPoints.update({
      where: { userId },
      data: {
        points: points > 0 
          ? { increment: points }
          : { decrement: Math.abs(points) },
        totalEarned: points > 0 
          ? { increment: points }
          : undefined,
        totalSpent: points < 0 
          ? { increment: Math.abs(points) }
          : undefined
      },
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
    })
    
    // 创建积分变动记录
    const pointLog = await prisma.pointLog.create({
      data: {
        userId,
        amount: points,
        type,
        description: description || `积分${points > 0 ? '增加' : '减少'}: ${Math.abs(points)}`
      }
    })
    
    return { userPoints: updatedUserPoints, pointLog }
  })
}

/**
 * 设置用户积分
 * @param userId 用户ID
 * @param points 设置的积分值
 * @returns 返回更新后的用户积分
 */
export const setUserPoints = async (userId: number, points: number): Promise<UserPoints> => {
  let userPoints = await prisma.userPoints.findUnique({
    where: { userId }
  })
  
  if (!userPoints) {
    return prisma.userPoints.create({
      data: {
        userId,
        points,
        totalEarned: points > 0 ? points : 0,
        totalSpent: 0
      },
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
    })
  }
  
  return prisma.userPoints.update({
    where: { userId },
    data: { points },
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
  })
} 