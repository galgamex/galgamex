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
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
}

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const { userId, ...query } = req.query;

  if (!userId) {
    return res.status(400).json({ error: '用户ID为必填项' });
  }

  // 获取用户积分信息
  const userPoints = await prisma.userPoints.findUnique({
    where: { userId: Number(userId) },
    include: {
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

  if (!userPoints) {
    // 如果用户积分记录不存在，创建一个新记录
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) }
    });

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    const newPoints = await prisma.userPoints.create({
      data: {
        userId: Number(userId),
        points: 0,
        totalEarned: 0,
        totalSpent: 0
      },
      include: {
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

    return res.status(200).json(newPoints);
  }

  // 获取积分记录
  if (query.includeLogs === 'true') {
    // 分页参数处理
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(Math.max(1, Number(query.limit) || 10), 50);

    // 构建查询条件
    const where = {
      userId: Number(userId),
      ...(query.type ? { type: String(query.type) } : {}),
      ...(query.startDate && query.endDate ? {
        createdAt: {
          gte: new Date(String(query.startDate)),
          lte: new Date(String(query.endDate))
        }
      } : {})
    };

    const [logs, total] = await Promise.all([
      prisma.pointLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.pointLog.count({ where })
    ]);

    return res.status(200).json({
      ...userPoints,
      logs: {
        data: logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  }

  return res.status(200).json(userPoints);
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { userId, amount, type, description } = req.body;

  if (!userId || !amount || !type) {
    return res.status(400).json({
      error: '用户ID、积分数量和类型为必填项'
    });
  }

  // 检查用户是否存在
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) }
  });

  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }

  // 更新用户积分
  const operation = amount > 0 ? 'increment' : 'decrement';
  const absAmount = Math.abs(amount);

  const userPoints = await prisma.userPoints.upsert({
    where: { userId: Number(userId) },
    update: {
      points: { [operation]: absAmount },
      ...(amount > 0 ? { totalEarned: { increment: absAmount } } : { totalSpent: { increment: absAmount } }),
      logs: {
        create: {
          userId: Number(userId),
          amount,
          type,
          description: description || `${amount > 0 ? '获得' : '消费'}${absAmount}积分`
        }
      }
    },
    create: {
      userId: Number(userId),
      points: Math.max(0, amount), // 新用户积分不能为负
      totalEarned: amount > 0 ? amount : 0,
      totalSpent: amount < 0 ? absAmount : 0,
      logs: {
        create: {
          userId: Number(userId),
          amount,
          type,
          description: description || `${amount > 0 ? '获得' : '消费'}${absAmount}积分`
        }
      }
    },
    include: {
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

  // 创建一条积分记录
  const log = await prisma.pointLog.findFirst({
    where: {
      userId: Number(userId)
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  res.status(200).json({
    ...userPoints,
    latestLog: log
  });
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { userId, points, totalEarned, totalSpent } = req.body;

  if (!userId) {
    return res.status(400).json({ error: '用户ID为必填项' });
  }

  // 检查用户是否存在
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) }
  });

  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }

  // 更新用户积分，但不记录日志
  const userPoints = await prisma.userPoints.upsert({
    where: { userId: Number(userId) },
    update: {
      ...(points !== undefined ? { points: Number(points) } : {}),
      ...(totalEarned !== undefined ? { totalEarned: Number(totalEarned) } : {}),
      ...(totalSpent !== undefined ? { totalSpent: Number(totalSpent) } : {})
    },
    create: {
      userId: Number(userId),
      points: Number(points) || 0,
      totalEarned: Number(totalEarned) || 0,
      totalSpent: Number(totalSpent) || 0
    },
    include: {
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

  res.status(200).json(userPoints);
} 