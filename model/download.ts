import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

/**
 * 根据唯一条件查询单个下载记录（包含关联的文章信息）
 * @param params 查询条件
 * @returns 返回下载记录或null
 */
export const findDownload = async (params: Prisma.DownloadWhereUniqueInput) => {
  return prisma.download.findUnique({
    where: params,
    include: {
      article: true,  // 包含关联的文章信息
    }
  })
}

/**
 * 根据条件查询多个下载记录（包含关联的文章信息）
 * @param params 查询条件
 * @returns 返回下载记录数组
 */
export const findDownloads = async (params: Prisma.DownloadWhereInput) => {
  return prisma.download.findMany({
    where: params,
    include: { article: true }
  })
}

/**
 * 统计符合条件的下载记录数量
 * @param params 查询条件
 * @returns 返回下载记录数量
 */
export const findDownloadCount = async (params: Prisma.DownloadWhereInput) => {
  return prisma.download.count({ where: params })
}

/**
 * 创建新的下载记录
 * @param data 下载记录数据
 * @returns 返回创建的下载记录
 */
export const createDownload = async (data: Prisma.DownloadCreateInput) => {
  return prisma.download.create({ data })
}

/**
 * 更新下载记录
 * @param params 查询条件（用于定位要更新的记录）
 * @param data 更新数据
 * @returns 返回更新后的下载记录
 */
export const updateDownload = async (
  params: Prisma.DownloadWhereUniqueInput,
  data: Prisma.DownloadUpdateInput
) => {
  return prisma.download.update({ where: params, data })
}

/**
 * 删除下载记录
 * @param params 查询条件（用于定位要删除的记录）
 * @returns 返回被删除的下载记录
 */
export const deleteDownload = async (params: Prisma.DownloadWhereUniqueInput) => {
  return prisma.download.delete({ where: params })
}

/**
 * 根据文章ID查询下载记录
 * @param articleId 文章ID
 * @returns 返回匹配的下载记录数组
 */
export const findDownloadByArticleId = async (articleId: number) => {
  return prisma.download.findMany({ where: { articleId } })
}

