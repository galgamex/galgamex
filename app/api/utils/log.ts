import { prisma } from '~/prisma/index'

export interface AdminLogData {
    type: string
    content: string
    user_id: number
}

/**
 * 创建管理日志
 * @param data 日志数据
 * @returns 创建的日志
 */
export const createAdminLog = async (data: AdminLogData) => {
    const log = await prisma.admin_log.create({
        data
    })
    return log
} 