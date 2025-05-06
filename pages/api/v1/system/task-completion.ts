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

  // 获取单个任务完成记录
  if (id) {
    const completion = await prisma.taskCompletion.findUnique({
      where: { id: Number(id) },
      include: {
        task: true,
        user: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true
          }
        }
      }
    });
    
    if (!completion) {
      return res.status(404).json({ error: '完成记录不存在' });
    }
    
    return res.status(200).json(completion);
  }

  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 10), 50);

  // 构建查询条件
  const where = buildWhereCondition(query);

  const [completions, total] = await Promise.all([
    prisma.taskCompletion.findMany({
      where,
      include: {
        task: true,
        user: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.taskCompletion.count({ where })
  ]);

  res.status(200).json({
    data: completions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const completionData = req.body;

  // 验证必要字段
  if (!completionData.taskId || !completionData.userId) {
    return res.status(400).json({
      error: '任务ID和用户ID为必填项'
    });
  }

  // 检查是否已存在记录
  const existingCompletion = await prisma.taskCompletion.findFirst({
    where: {
      taskId: completionData.taskId,
      userId: completionData.userId
    }
  });

  if (existingCompletion) {
    return res.status(409).json({
      error: '该用户已有此任务的完成记录'
    });
  }

  // 检查任务是否存在
  const task = await prisma.task.findUnique({
    where: { id: completionData.taskId }
  });

  if (!task) {
    return res.status(404).json({
      error: '任务不存在'
    });
  }

  const completion = await prisma.taskCompletion.create({
    data: completionData,
    include: {
      task: true,
      user: {
        select: {
          id: true,
          username: true,
          nickname: true,
          avatar: true
        }
      }
    }
  });

  res.status(201).json(completion);
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const completionData = req.body;

  if (!id) {
    return res.status(400).json({ error: '完成记录ID为必填项' });
  }

  // 检查记录是否存在
  const existingCompletion = await prisma.taskCompletion.findUnique({
    where: { id: Number(id) }
  });

  if (!existingCompletion) {
    return res.status(404).json({
      error: '完成记录不存在'
    });
  }

  // 处理任务完成和奖励发放逻辑
  if (completionData.completed && !existingCompletion.completed) {
    // 如果是首次完成任务，可以在这里处理积分奖励逻辑
    if (!existingCompletion.rewarded && completionData.rewarded) {
      const task = await prisma.task.findUnique({
        where: { id: existingCompletion.taskId }
      });
      
      if (task) {
        // 更新用户积分
        await prisma.userPoints.upsert({
          where: { userId: existingCompletion.userId },
          update: {
            points: { increment: task.reward },
            totalEarned: { increment: task.reward },
            logs: {
              create: {
                userId: existingCompletion.userId,
                amount: task.reward,
                type: 'TASK',
                description: `完成任务【${task.title}】的奖励`
              }
            }
          },
          create: {
            userId: existingCompletion.userId,
            points: task.reward,
            totalEarned: task.reward,
            totalSpent: 0,
            logs: {
              create: {
                userId: existingCompletion.userId,
                amount: task.reward,
                type: 'TASK',
                description: `完成任务【${task.title}】的奖励`
              }
            }
          }
        });
      }
    }
  }

  const completion = await prisma.taskCompletion.update({
    where: { id: Number(id) },
    data: completionData,
    include: {
      task: true,
      user: {
        select: {
          id: true,
          username: true,
          nickname: true,
          avatar: true
        }
      }
    }
  });

  res.status(200).json(completion);
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: '完成记录ID为必填项' });
  }

  await prisma.taskCompletion.delete({ where: { id: Number(id) } });
  res.status(204).end();
}

// 构建查询条件
function buildWhereCondition(query: any) {
  const where: any = {};

  // 基本字段过滤
  if (query.taskId) where.taskId = Number(query.taskId);
  if (query.userId) where.userId = Number(query.userId);
  if (query.completed !== undefined) where.completed = query.completed === 'true';
  if (query.rewarded !== undefined) where.rewarded = query.rewarded === 'true';
  
  // 特殊搜索条件
  if (query.completedOnly === 'true') {
    where.completed = true;
  } else if (query.pendingOnly === 'true') {
    where.completed = false;
  }
  
  if (query.rewardedOnly === 'true') {
    where.rewarded = true;
  } else if (query.unrewardedOnly === 'true') {
    where.rewarded = false;
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