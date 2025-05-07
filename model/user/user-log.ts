import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"
// @ts-ignore - 忽略类型错误
import type { UserLog, UserLogType } from "@prisma/client"

/**
 * 查找单个用户日志
 * @param id 日志ID
 * @returns 返回用户日志信息
 */
export const findUserLog = async (id: number): Promise<UserLog | null> => {
  return prisma.userLog.findUnique({
    where: { id },
    include: {
      author: true // 包含关联的用户信息
    }
  })
}

/**
 * 查找用户的所有日志
 * @param userId 用户ID
 * @param page 页码
 * @param pageSize 每页大小
 * @returns 返回用户日志数组
 */
export const findUserLogs = async (
  userId: number,
  page = 1,
  pageSize = 10
): Promise<UserLog[]> => {
  return prisma.userLog.findMany({
    where: { userId },
    include: {
      author: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    skip: (page - 1) * pageSize,
    take: pageSize
  })
}

/**
 * 查找多个用户日志
 * @param params 查询条件
 * @param page 页码
 * @param pageSize 每页大小
 * @returns 返回用户日志数组
 */
export const findLogs = async (
  params?: Prisma.UserLogWhereInput,
  page = 1,
  pageSize = 10
): Promise<UserLog[]> => {
  return prisma.userLog.findMany({
    where: params,
    include: {
      author: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    skip: (page - 1) * pageSize,
    take: pageSize
  })
}

/**
 * 查找用户日志数量
 * @param params 查询条件
 * @returns 返回用户日志数量
 */
export const findUserLogCount = async (params?: Prisma.UserLogWhereInput): Promise<number> => {
  return prisma.userLog.count({ where: params })
}

/**
 * 创建用户日志
 * @param data 创建数据
 * @returns 返回创建的用户日志
 */
export const createUserLog = async (data: Prisma.UserLogCreateInput): Promise<UserLog> => {
  return prisma.userLog.create({
    data,
    include: {
      author: true
    }
  })
}

/**
 * 记录用户登录日志
 * @param userId 用户ID
 * @param ip IP地址
 * @param ua 用户代理
 * @returns 返回创建的用户日志
 */
export const logUserLogin = async (
  userId: number,
  ip?: string,
  ua?: string
): Promise<UserLog> => {
  return createUserLog({
    author: { connect: { id: userId } },
    type: 'LOGIN',
    ip,
    ua,
    remark: '用户登录'
  })
}

/**
 * 记录用户注册日志
 * @param userId 用户ID
 * @param ip IP地址
 * @param ua 用户代理
 * @returns 返回创建的用户日志
 */
export const logUserRegister = async (
  userId: number,
  ip?: string,
  ua?: string
): Promise<UserLog> => {
  return createUserLog({
    author: { connect: { id: userId } },
    type: 'REGISTER',
    ip,
    ua,
    remark: '用户注册'
  })
}

/**
 * 记录通用用户操作日志
 * @param userId 用户ID
 * @param type 日志类型
 * @param remark 备注信息
 * @param ip IP地址
 * @param ua 用户代理
 * @returns 返回创建的用户日志
 */
export const logUserAction = async (
  userId: number,
  type: UserLogType,
  remark?: string,
  ip?: string,
  ua?: string
): Promise<UserLog> => {
  return createUserLog({
    author: { connect: { id: userId } },
    type,
    ip,
    ua,
    remark
  })
}

/**
 * 删除用户日志
 * @param id 日志ID
 * @returns 返回被删除的用户日志
 */
export const deleteUserLog = async (id: number): Promise<UserLog> => {
  return prisma.userLog.delete({
    where: { id }
  })
}

/**
 * 批量删除用户日志
 * @param ids 日志ID数组
 * @returns 返回被删除的用户日志数量
 */
export const deleteUserLogs = async (ids: number[]): Promise<number> => {
  const result = await prisma.userLog.deleteMany({
    where: {
      id: {
        in: ids
      }
    }
  })
  return result.count
} 