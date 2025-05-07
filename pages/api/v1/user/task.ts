import prisma from '@/lib/prisma';
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
        await handlePostRequest(req, res);
        break;
      case 'PUT':
        await handlePutRequest(req, res);
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
  const { id, ...query } = req.query;

  // 获取单个任务
  if (id) {
    const task = await prisma.task.findUnique({
      where: { id: Number(id) }
    });
    
    if (!task) {
      return res.status(404).json({ error: '任务不存在' });
    }
    
    return res.status(200).json(task);
  }

  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 10), 50);

  // 构建查询条件
  const where = buildWhereCondition(query);

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.task.count({ where })
  ]);

  res.status(200).json({
    data: tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const taskData = req.body;

  // 验证必要字段
  if (!taskData.name || !taskData.type || !taskData.reward || !taskData.rewardType || !taskData.repeatType) {
    return res.status(400).json({
      error: '任务名称、类型、奖励、奖励类型和重复类型为必填项'
    });
  }

  const task = await prisma.task.create({
    data: taskData
  });

  res.status(201).json(task);
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const taskData = req.body;

  if (!id) {
    return res.status(400).json({ error: '任务ID为必填项' });
  }

  const task = await prisma.task.update({
    where: { id: Number(id) },
    data: taskData
  });

  res.status(200).json(task);
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: '任务ID为必填项' });
  }

  await prisma.task.delete({ where: { id: Number(id) } });
  res.status(204).end();
}

// 构建查询条件
function buildWhereCondition(query: any) {
  const where: any = {};

  // 基本字段过滤
  if (query.name) where.name = { contains: query.name };
  if (query.type) where.type = query.type;
  if (query.repeatType) where.repeatType = query.repeatType;
  if (query.rewardType) where.rewardType = query.rewardType;
  if (query.enabled !== undefined) where.enabled = query.enabled === 'true';
  
  // 奖励范围过滤
  if (query.minReward) where.reward = { gte: Number(query.minReward) };
  if (query.maxReward) where.reward = { ...(where.reward || {}), lte: Number(query.maxReward) };
  
  // 日期范围过滤
  if (query.startDate && query.endDate) {
    where.createdAt = {
      gte: new Date(query.startDate),
      lte: new Date(query.endDate)
    };
  }

  return where;
} 