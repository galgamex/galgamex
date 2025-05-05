import prisma from '@/lib/prisma';
import { revalidateTag, unstable_cache } from 'next/cache';

// 使用标签标记缓存
export const getConfigValue = unstable_cache(async (key: string) => {
  console.log(`[Config Service] 正在从数据库获取配置: ${key}`);
  const config = await prisma.config.findFirst({
    where: { key }
  });

  console.log(`[Config Service] 配置 ${key} 查询结果:`, config?.value);
  return config?.value;
}, ['config']); // 添加 'config' 标签

// 获取所有配置的函数
export const getAllConfigs = unstable_cache(async () => {
  console.log('[Config Service] 正在获取所有配置');
  const configs = await prisma.config.findMany();
  const configMap = Object.fromEntries(
    configs.map(config => [config.key, config.value])
  );

  console.log('[Config Service] 所有配置:', configMap);
  return configMap;
}, ['config']); // 添加 'config' 标签

// 更新配置并失效缓存
export async function updateConfig(key: string, value: string) {
  console.log(`[Config Service] 正在更新配置: ${key} = ${value}`);

  const result = await prisma.config.upsert({
    where: { key },
    update: { value },
    create: { key, value }
  });

  // 使缓存失效 - 方法1：通过标签
  revalidateTag('config');

  return result;
}