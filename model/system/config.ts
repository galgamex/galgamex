import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"
// @ts-ignore - 忽略类型错误
import type { Config } from "@prisma/client"

/**
 * 查找单个配置项
 * @param key 配置键名
 * @returns 返回配置或null
 */
export const findConfig = async (key: string): Promise<Config | null> => {
  return prisma.config.findUnique({
    where: { key }
  })
}

/**
 * 查找多个配置项
 * @param params 查询条件
 * @returns 返回配置数组
 */
export const findConfigs = async (params?: Prisma.ConfigWhereInput): Promise<Config[]> => {
  return prisma.config.findMany({
    where: params,
    orderBy: { key: 'asc' }
  })
}

/**
 * 获取配置值
 * @param key 配置键名
 * @param defaultValue 默认值（当配置不存在时返回）
 * @returns 返回配置值或默认值
 */
export const getConfigValue = async (key: string, defaultValue?: string): Promise<string | undefined> => {
  const config = await findConfig(key)
  return config ? config.value : defaultValue
}

/**
 * 创建或更新配置
 * @param key 配置键名
 * @param value 配置值
 * @returns 返回创建或更新后的配置
 */
export const setConfig = async (key: string, value: string): Promise<Config> => {
  return prisma.config.upsert({
    where: { key },
    update: { value },
    create: { key, value }
  })
}

/**
 * 批量设置配置
 * @param configs 配置对象，键为配置键名，值为配置值
 * @returns 返回更新的配置数组
 */
export const setConfigs = async (configs: Record<string, string>): Promise<Config[]> => {
  const promises = Object.entries(configs).map(([key, value]) => setConfig(key, value))
  return Promise.all(promises)
}

/**
 * 删除配置
 * @param key 配置键名
 * @returns 返回被删除的配置
 */
export const deleteConfig = async (key: string): Promise<Config> => {
  return prisma.config.delete({
    where: { key }
  })
}

/**
 * 批量删除配置
 * @param keys 配置键名数组
 * @returns 返回被删除的配置数量
 */
export const deleteConfigs = async (keys: string[]): Promise<number> => {
  const result = await prisma.config.deleteMany({
    where: {
      key: {
        in: keys
      }
    }
  })
  return result.count
} 