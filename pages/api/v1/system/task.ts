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
      orderBy: { sortOrder: 'asc' }
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
  if (!taskData.title || !taskData.type || !taskData.reward || !taskData.rewardType || !taskData.target) {
    return res.status(400).json({
      error: '任务标题、类型、奖励点数、奖励类型和目标数量为必填项'
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
  if (query.title) where.title = { contains: query.title };
  if (query.type) where.type = query.type;
  if (query.status) where.status = query.status;
  if (query.repeatable) where.repeatable = query.repeatable === 'true';
  if (query.repeatCycle) where.repeatCycle = query.repeatCycle;
  if (query.rewardType) where.rewardType = query.rewardType;
  
  // 任务活跃状态筛选
  if (query.active === 'true') {
    const now = new Date();
    where.OR = [
      { startTime: null },
      { startTime: { lte: now } }
    ];
    where.AND = [
      { OR: [
          { endTime: null },
          { endTime: { gte: now } }
        ]
      },
      { status: 'PUBLISH' }
    ];
  }
  
  // 时间范围筛选
  if (query.startDate && query.endDate) {
    where.createdAt = {
      gte: new Date(query.startDate),
      lte: new Date(query.endDate)
    };
  }

  return where;
} 