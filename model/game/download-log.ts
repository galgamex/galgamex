import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"
// @ts-ignore - 忽略类型错误
import type { DownloadLog } from "@prisma/client"

/**
 * 查找单个下载记录
 * @param id 记录ID
 * @returns 返回下载记录信息
 */
export const findDownloadLog = async (id: number): Promise<DownloadLog | null> => {
  return prisma.downloadLog.findUnique({
    where: { id },
    include: {
      download: true,   // 包含关联的下载信息
      article: true,    // 包含关联的文章信息
      user: true        // 包含关联的用户信息
    }
  })
}

/**
 * 查找多个下载记录
 * @param params 查询条件
 * @param page 页码
 * @param pageSize 每页大小
 * @returns 返回下载记录数组
 */
export const findDownloadLogs = async (
  params?: Prisma.DownloadLogWhereInput,
  page = 1,
  pageSize = 10
): Promise<DownloadLog[]> => {
  return prisma.downloadLog.findMany({
    where: params,
    include: {
      download: true,
      article: true,
      user: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    skip: (page - 1) * pageSize,
    take: pageSize
  })
}

/**
 * 查找下载记录数量
 * @param params 查询条件
 * @returns 返回下载记录数量
 */
export const findDownloadLogCount = async (params?: Prisma.DownloadLogWhereInput): Promise<number> => {
  return prisma.downloadLog.count({ where: params })
}

/**
 * 创建下载记录
 * @param data 创建数据
 * @returns 返回创建的下载记录
 */
export const createDownloadLog = async (data: Prisma.DownloadLogCreateInput): Promise<DownloadLog> => {
  return prisma.downloadLog.create({ 
    data,
    include: {
      download: true,
      article: true,
      user: true
    }
  })
}

/**
 * 记录下载行为
 * @param downloadId 下载ID
 * @param userId 用户ID (可选)
 * @param ip IP地址
 * @param ua 用户代理
 * @param referer 来源页面
 * @param downloadType 下载类型
 * @returns 返回创建的下载记录
 */
export const logDownload = async (
  downloadId: number,
  options?: {
    userId?: number,
    articleId?: number,
    ip?: string,
    ua?: string,
    referer?: string,
    downloadType?: string,
    status?: boolean,
    remark?: string
  }
): Promise<DownloadLog> => {
  const data: Prisma.DownloadLogCreateInput = {
    download: { connect: { id: downloadId } },
    status: options?.status ?? true,
    ip: options?.ip,
    ua: options?.ua,
    referer: options?.referer,
    downloadType: options?.downloadType,
    remark: options?.remark
  }
  
  // 关联用户（如果有）
  if (options?.userId) {
    data.user = { connect: { id: options.userId } }
  }
  
  // 关联文章（如果有）
  if (options?.articleId) {
    data.article = { connect: { id: options.articleId } }
  }
  
  const downloadLog = await createDownloadLog(data)
  
  // 更新下载次数
  await prisma.download.update({
    where: { id: downloadId },
    data: { count: { increment: 1 } }
  })
  
  // 如果关联了文章，更新文章下载次数
  if (options?.articleId) {
    await prisma.article.update({
      where: { id: options.articleId },
      data: { downloads: { increment: 1 } }
    })
  }
  
  return downloadLog
}

/**
 * 删除下载记录
 * @param id 记录ID
 * @returns 返回被删除的下载记录
 */
export const deleteDownloadLog = async (id: number): Promise<DownloadLog> => {
  return prisma.downloadLog.delete({
    where: { id }
  })
}

/**
 * 获取热门下载
 * @param days 统计的天数（最近多少天）
 * @param limit 返回的记录数量
 * @returns 返回热门下载列表
 */
export const getHotDownloads = async (days = 7, limit = 10): Promise<any[]> => {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  return prisma.$queryRaw`
    SELECT d.id, d.url, d.type, a.id as articleId, a.title, COUNT(dl.id) as count
    FROM download d
    LEFT JOIN download_log dl ON dl.downloadId = d.id
    LEFT JOIN article a ON a.id = d.articleId
    WHERE dl.createdAt >= ${startDate}
    GROUP BY d.id
    ORDER BY count DESC
    LIMIT ${limit}
  `
} 