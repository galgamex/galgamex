import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"
// @ts-ignore - 忽略类型错误
import type { TelegramLog } from "@prisma/client"

/**
 * 查找单个Telegram发布日志
 * @param id 日志ID
 * @returns 返回Telegram日志信息
 */
export const findTelegramLog = async (id: number): Promise<TelegramLog | null> => {
  return prisma.telegramLog.findUnique({
    where: { id }
  })
}

/**
 * 查找文章的Telegram发布日志
 * @param articleId 文章ID
 * @returns 返回Telegram日志信息
 */
export const findArticleTelegramLog = async (articleId: number): Promise<TelegramLog | null> => {
  return prisma.telegramLog.findFirst({
    where: { articleId }
  })
}

/**
 * 查找多个Telegram日志
 * @param params 查询条件
 * @returns 返回Telegram日志数组
 */
export const findTelegramLogs = async (
  params?: Prisma.TelegramLogWhereInput,
  page = 1,
  pageSize = 10
): Promise<TelegramLog[]> => {
  return prisma.telegramLog.findMany({
    where: params,
    orderBy: {
      createdAt: 'desc'
    },
    skip: (page - 1) * pageSize,
    take: pageSize
  })
}

/**
 * 查找Telegram日志数量
 * @param params 查询条件
 * @returns 返回Telegram日志数量
 */
export const findTelegramLogCount = async (params?: Prisma.TelegramLogWhereInput): Promise<number> => {
  return prisma.telegramLog.count({ where: params })
}

/**
 * 创建Telegram发布日志
 * @param articleId 文章ID
 * @param data 日志数据
 * @returns 返回创建的Telegram日志
 */
export const createTelegramLog = async (
  articleId: number,
  data: {
    images?: string,
    url?: string,
    remark?: string,
    status?: boolean
  }
): Promise<TelegramLog> => {
  return prisma.telegramLog.create({
    data: {
      articleId,
      images: data.images,
      url: data.url,
      remark: data.remark,
      status: data.status ?? false
    }
  })
}

/**
 * 更新Telegram发布日志
 * @param id 日志ID
 * @param data 更新数据
 * @returns 返回更新后的Telegram日志
 */
export const updateTelegramLog = async (
  id: number,
  data: Prisma.TelegramLogUpdateInput
): Promise<TelegramLog> => {
  return prisma.telegramLog.update({
    where: { id },
    data
  })
}

/**
 * 更新Telegram发布状态
 * @param id 日志ID
 * @param status 发布状态
 * @param remark 备注信息
 * @returns 返回更新后的Telegram日志
 */
export const updateTelegramStatus = async (
  id: number,
  status: boolean,
  remark?: string
): Promise<TelegramLog> => {
  return prisma.telegramLog.update({
    where: { id },
    data: {
      status,
      remark: remark ? remark : undefined,
      updatedAt: new Date()
    }
  })
}

/**
 * 删除Telegram发布日志
 * @param id 日志ID
 * @returns 返回被删除的Telegram日志
 */
export const deleteTelegramLog = async (id: number): Promise<TelegramLog> => {
  return prisma.telegramLog.delete({
    where: { id }
  })
}

/**
 * 获取未发布的Telegram日志
 * @param limit 限制数量
 * @returns 返回未发布的Telegram日志数组
 */
export const findPendingTelegramLogs = async (limit = 10): Promise<TelegramLog[]> => {
  return prisma.telegramLog.findMany({
    where: {
      status: false
    },
    orderBy: {
      createdAt: 'asc'
    },
    take: limit
  })
} 