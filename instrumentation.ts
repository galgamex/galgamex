import prisma from '@/lib/prisma';
// 改变导入方式
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // 服务器端代码，只在服务器启动时执行一次
    await initDatabase();
  }
}

async function initDatabase() {
  // 数据库初始化逻辑
  const configs = [
    { key: 'site_name', value: 'Galgame Club' },
    { key: 'site_description', value: 'Galgame Club' },
    { key: 'site_keywords', value: 'Galgame Club' },
    { key: 'site_logo', value: '' },
    { key: 'site_favicon', value: '' },
    { key: 'site_separator', value: ' - ' },
    { key: 'site_tagline', value: 'All the worlds best games' },
    { key: 'site_footer', value: '' },
    { key: 'mail_host', value: '' },
    { key: 'mail_port', value: '' },
    { key: 'mail_username', value: '' },
    { key: 'mail_password', value: '' },
    { key: 'mail_from', value: '' },
    { key: 'mail_from_name', value: '' },
    { key: 'storage_type', value: 'local' },
    { key: 'storage_path', value: '' },
    { key: 's3_bucket', value: '' },
    { key: 's3_region', value: '' },
    { key: 's3_access_key', value: '' },
    { key: 's3_secret_key', value: '' },
    { key: 's3_endpoint', value: '' },
    { key: 's3_force_path_style', value: 'false' },
    { key: 's3_cdn', value: '' }
  ];

  // 批量查询已存在的配置
  const existingConfigs = await prisma.config.findMany({
    where: { key: { in: configs.map(c => c.key) } }
  });
  const existingKeys = new Set(existingConfigs.map(c => c.key));

  // 只创建不存在的配置
  const newConfigs = configs.filter(c => !existingKeys.has(c.key));
  if (newConfigs.length > 0) {
    await prisma.config.createMany({
      data: newConfigs
    });
  }

  console.log('数据库初始化完成');
}