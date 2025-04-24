import prisma from '@/lib/prisma';
import { store } from '@/lib/store';
// 改变导入方式
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // 服务器端代码，只在服务器启动时执行一次
    await initDatabase();
    await setupCache();
  }
}

async function initDatabase() {
  // 数据库初始化逻辑
  const data = [
    { id: 1, key: 'site_name', value: 'Galgame Club' },
    { id: 2, key: 'site_description', value: 'Galgame Club' },
    { id: 3, key: 'site_keywords', value: 'Galgame Club' },
    { id: 4, key: 'site_description', value: 'Galgame Club' },
    { id: 5, key: 'site_logo', value: '' },
    { id: 6, key: 'site_favicon', value: '' },
    { id: 7, key: 'site_separator', value: ' - ' },
  ];
  // 存在相同key不再插入
  for (const item of data) {
    const config = await prisma.config.findFirst({
      where: { key: item.key },
    });
    if (!config) {
      await prisma.config.create({
        data: item,
      });
    }
  }
  console.log('数据库初始化完成');
}

async function setupCache() {
  try {
    if (!store) {
      throw new Error('无法获取缓存实例');
    }

    // 缓存设置逻辑
    const configs = await prisma.config.findMany();
    console.log(`准备缓存 ${configs.length} 条配置`);

    for (const config of configs) {
      await store.set(config.key, config.value);
      console.log(`缓存配置: ${config.key} = ${config.value}`);
    }

    // 验证缓存
    const testValue = await store.get('site_name');
    console.log('缓存测试 - site_name:', testValue);

    console.log('缓存设置完成');
    // 通知事件
  } catch (error) {
    console.error('缓存设置失败:', error);
  }
}