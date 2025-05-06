import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"
// @ts-ignore - 忽略类型错误
import type { Task } from "@prisma/client"

/**
 * 查找单个任务
 * @param params 查询条件
 * @returns 返回任务信息
 */
export const findTask = async (params: Prisma.TaskWhereUniqueInput): Promise<Task | null> => {
  return prisma.task.findUnique({
    where: params,
  })
}

/**
 * 查找多个任务
 * @param params 查询条件
 * @returns 返回任务数组
 */
export const findTasks = async (params?: Prisma.TaskWhereInput): Promise<Task[]> => {
  return prisma.task.findMany({
    where: params,
    orderBy: {
      sortOrder: 'asc',
    },
  })
}

/**
 * 查找任务数量
 * @param params 查询条件
 * @returns 返回任务数量
 */
export const findTaskCount = async (params?: Prisma.TaskWhereInput): Promise<number> => {
  return prisma.task.count({ where: params })
}

/**
 * 创建任务
 * @param data 创建数据
 * @returns 返回创建的任务记录
 */
export const createTask = async (data: Prisma.TaskCreateInput): Promise<Task> => {
  return prisma.task.create({ data })
}

/**
 * 更新任务
 * @param params 查询条件
 * @param data 更新数据
 * @returns 返回更新后的任务记录
 */
export const updateTask = async (
  params: Prisma.TaskWhereUniqueInput,
  data: Prisma.TaskUpdateInput
): Promise<Task> => {
  return prisma.task.update({ where: params, data })
}

/**
 * 删除任务
 * @param params 查询条件
 * @returns 返回被删除的任务记录
 */
export const deleteTask = async (params: Prisma.TaskWhereUniqueInput): Promise<Task> => {
  return prisma.task.delete({ where: params })
}

/**
 * 获取活跃任务列表
 * @returns 返回当前活跃的任务列表
 */
export const findActiveTasks = async (): Promise<Task[]> => {
  const now = new Date()
  return prisma.task.findMany({
    where: {
      status: 'PUBLISH',
      OR: [
        { startTime: null },
        { startTime: { lte: now } }
      ],
      AND: [
        { OR: [
            { endTime: null },
            { endTime: { gte: now } }
          ]
        }
      ]
    },
    orderBy: {
      sortOrder: 'asc',
    },
  })
} 