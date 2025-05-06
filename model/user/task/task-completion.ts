import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"
// @ts-ignore - 忽略类型错误
import type { TaskCompletion } from "@prisma/client"

/**
 * 查找单个任务完成记录
 * @param params 查询条件
 * @returns 返回任务完成记录信息
 */
export const findTaskCompletion = async (params: Prisma.TaskCompletionWhereUniqueInput): Promise<TaskCompletion | null> => {
  return prisma.taskCompletion.findUnique({
    where: params,
    include: {
      task: true,
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
 * 查找用户的任务完成记录
 * @param userId 用户ID
 * @param taskId 任务ID
 * @returns 返回任务完成记录
 */
export const findUserTaskCompletion = async (userId: number, taskId: number): Promise<TaskCompletion | null> => {
  return prisma.taskCompletion.findFirst({
    where: {
      userId,
      taskId
    },
    include: {
      task: true
    }
  })
}

/**
 * 查找多个任务完成记录
 * @param params 查询条件
 * @returns 返回任务完成记录数组
 */
export const findTaskCompletions = async (params?: Prisma.TaskCompletionWhereInput): Promise<TaskCompletion[]> => {
  return prisma.taskCompletion.findMany({
    where: params,
    include: {
      task: true,
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
      createdAt: 'desc',
    },
  })
}

/**
 * 查找任务完成记录数量
 * @param params 查询条件
 * @returns 返回任务完成记录数量
 */
export const findTaskCompletionCount = async (params?: Prisma.TaskCompletionWhereInput): Promise<number> => {
  return prisma.taskCompletion.count({ where: params })
}

/**
 * 创建任务完成记录
 * @param data 创建数据
 * @returns 返回创建的任务完成记录
 */
export const createTaskCompletion = async (data: Prisma.TaskCompletionCreateInput): Promise<TaskCompletion> => {
  return prisma.taskCompletion.create({
    data,
    include: {
      task: true,
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
 * 更新任务完成记录
 * @param params 查询条件
 * @param data 更新数据
 * @returns 返回更新后的任务完成记录
 */
export const updateTaskCompletion = async (
  params: Prisma.TaskCompletionWhereUniqueInput,
  data: Prisma.TaskCompletionUpdateInput
): Promise<TaskCompletion> => {
  return prisma.taskCompletion.update({
    where: params,
    data,
    include: {
      task: true,
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
 * 删除任务完成记录
 * @param params 查询条件
 * @returns 返回被删除的任务完成记录
 */
export const deleteTaskCompletion = async (params: Prisma.TaskCompletionWhereUniqueInput): Promise<TaskCompletion> => {
  return prisma.taskCompletion.delete({ where: params })
}

/**
 * 处理任务完成并发放奖励
 * @param id 任务完成记录ID
 * @returns 返回更新后的任务完成记录
 */
export const completeAndRewardTask = async (id: number): Promise<TaskCompletion> => {
  return prisma.$transaction(async (prisma: typeof import('@/lib/prisma').default) => {
    // 查找任务完成记录
    const completion = await prisma.taskCompletion.findUnique({
      where: { id },
      include: { task: true }
    })
    
    if (!completion) {
      throw new Error('任务完成记录不存在')
    }
    
    if (completion.completed && completion.rewarded) {
      throw new Error('任务已完成并已发放奖励')
    }
    
    // 标记任务为已完成并奖励
    const updatedCompletion = await prisma.taskCompletion.update({
      where: { id },
      data: {
        completed: true,
        rewarded: true
      },
      include: { 
        task: true,
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
    
    // 更新用户积分
    await prisma.userPoints.upsert({
      where: { userId: completion.userId },
      update: {
        points: { increment: completion.task.reward },
        totalEarned: { increment: completion.task.reward },
        logs: {
          create: {
            userId: completion.userId,
            amount: completion.task.reward,
            type: 'TASK',
            description: `完成任务【${completion.task.title}】的奖励`
          }
        }
      },
      create: {
        userId: completion.userId,
        points: completion.task.reward,
        totalEarned: completion.task.reward,
        totalSpent: 0,
        logs: {
          create: {
            userId: completion.userId,
            amount: completion.task.reward,
            type: 'TASK',
            description: `完成任务【${completion.task.title}】的奖励`
          }
        }
      }
    })
    
    return updatedCompletion
  })
} 