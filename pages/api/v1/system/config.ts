import {
  deleteConfig,
  deleteConfigs,
  findConfig,
  findConfigs,
  getConfigValue,
  setConfig,
  setConfigs
} from '@/model/system/config';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET':
        await handleGetRequest(req, res);
        break;
      case 'POST':
      case 'PUT':
        await handleSetRequest(req, res);
        break;
      case 'DELETE':
        await handleDeleteRequest(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
}

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const { key, prefix } = req.query;

  // 获取单个配置项
  if (key) {
    if (req.query.value === 'true') {
      // 仅获取配置值
      const defaultValue = req.query.default as string | undefined;
      const value = await getConfigValue(String(key), defaultValue);
      return res.status(200).json({ value });
    } else {
      // 获取完整配置信息
      const config = await findConfig(String(key));
      if (!config) {
        return res.status(404).json({ error: '配置项不存在' });
      }
      return res.status(200).json(config);
    }
  }

  // 获取配置列表
  let where = {};
  if (prefix) {
    where = {
      key: {
        startsWith: String(prefix)
      }
    };
  }

  const configs = await findConfigs(where);
  
  // 如果需要将配置转换为对象格式
  if (req.query.format === 'object') {
    const configObject: Record<string, string> = {};
    configs.forEach(config => {
      configObject[config.key] = config.value;
    });
    return res.status(200).json(configObject);
  }
  
  return res.status(200).json(configs);
}

async function handleSetRequest(req: NextApiRequest, res: NextApiResponse) {
  // 单个配置
  if (req.body.key && req.body.value !== undefined) {
    const { key, value } = req.body;
    const config = await setConfig(key, String(value));
    return res.status(200).json(config);
  }
  
  // 批量配置
  if (req.body.configs && typeof req.body.configs === 'object') {
    // 将所有值转换为字符串
    const configsToSet: Record<string, string> = {};
    Object.entries(req.body.configs).forEach(([key, value]) => {
      configsToSet[key] = String(value);
    });
    
    const configs = await setConfigs(configsToSet);
    return res.status(200).json(configs);
  }
  
  return res.status(400).json({ error: '无效的请求格式' });
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { key, keys } = req.query;

  // 删除单个配置
  if (key) {
    await deleteConfig(String(key));
    return res.status(204).end();
  }
  
  // 批量删除配置
  if (keys) {
    const keysArray = Array.isArray(keys) ? keys : [keys];
    const count = await deleteConfigs(keysArray);
    return res.status(200).json({ deleted: count });
  }
  
  return res.status(400).json({ error: '必须提供要删除的配置键' });
} 