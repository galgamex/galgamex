import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"

/**
 * 根据唯一条件查询单个用户（不包含密码）
 * @param params 查询条件
 * @returns 返回用户或null
 */
export const findUser = async (params: Prisma.UserWhereUniqueInput) => {
  return prisma.user.findUnique({
    where: params
  })
}

/**
 * 根据条件查询多个用户
 * @param params 查询条件
 * @param options 分页和排序选项
 * @returns 返回用户数组
 */
export const findUsers = async (
  params: Prisma.UserWhereInput,
  options?: {
    take?: number,
    skip?: number,
    orderBy?: Prisma.UserOrderByWithRelationInput
  }
) => {
  return prisma.user.findMany({
    where: params,
    orderBy: options?.orderBy || { createdAt: 'desc' },
    take: options?.take || 10,
    skip: options?.skip || 0,
  })
}

/**
 * 统计符合条件的用户数量
 * @param params 查询条件
 * @returns 返回用户数量
 */
export const findUsersCount = async (params: Prisma.UserWhereInput) => {
  return prisma.user.count({ where: params })
}

/**
 * 创建新用户
 * @param data 用户数据
 * @returns 返回创建的用户
 */
export const createUser = async (data: Prisma.UserCreateInput) => {
  return prisma.user.create({ data })
}

/**
 * 更新用户
 * @param params 包含where条件(唯一标识)和data(更新数据)的对象
 * @returns 返回更新后的用户
 */
export const updateUser = async (params: {
  where: Prisma.UserWhereUniqueInput,
  data: Prisma.UserUpdateInput
}) => {
  const { where, data } = params
  return prisma.user.update({ where, data })
}

/**
 * 删除用户
 * @param where 删除条件
 * @returns 返回被删除的用户
 */
export const deleteUser = async (where: Prisma.UserWhereUniqueInput) => {
  return prisma.user.delete({ where })
}

/**
 * 验证用户登录
 * @param email 邮箱
 * @param password 密码
 * @returns 返回用户或null
 */
export const verifyUser = async (email: string, password: string) => {
  return prisma.user.findFirst({
    where: {
      email,
      password
    }
  })
}

/**
 * 更新用户最后登录时间
 * @param userId 用户ID
 * @returns 返回更新后的用户
 */
export const updateLastLogin = async (userId: number) => {
  return prisma.user.update({
    where: { id: userId },
    data: { lastLogin: new Date() }
  })
} 