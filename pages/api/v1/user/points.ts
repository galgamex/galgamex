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
  // 支持通过query或path参数获取用户ID
  const userId = req.query.userId || req.query.id;

  if (!userId) {
    return res.status(400).json({ 
      error: '用户ID为必填项', 
      message: '请提供userId参数，例如：/api/v1/user/points?userId=1' 
    });
  }

  // 获取用户积分信息
  try {
    const userPoints = await prisma.userPoints.findUnique({
      where: { userId: Number(userId) }
    });

    if (!userPoints) {
      // 如果用户积分记录不存在，检查用户是否存在
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) }
      });

      if (!user) {
        return res.status(404).json({ error: '用户不存在' });
      }

      // 创建一个新记录
      const newPoints = await prisma.userPoints.create({
        data: {
          userId: Number(userId),
          points: 0,
          totalEarned: 0,
          totalSpent: 0
        }
      });

      return res.status(200).json(newPoints);
    }

    // 获取积分记录
    if (req.query.includeLogs === 'true') {
      // 分页参数处理
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(Math.max(1, Number(req.query.limit) || 10), 50);

      // 构建查询条件
      const where: any = {
        userId: Number(userId)
        // 移除type条件，防止enum错误
        // ...(req.query.type ? { type: String(req.query.type) } : {}),
      };

      if (req.query.startDate && req.query.endDate) {
        where.createdAt = {
          gte: new Date(String(req.query.startDate)),
          lte: new Date(String(req.query.endDate))
        };
      }

      try {
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
      } catch (error: any) {
        console.error('Error fetching point logs:', error);
        return res.status(200).json({
          ...userPoints,
          logs: {
            data: [],
            pagination: {
              page,
              limit,
              total: 0,
              totalPages: 0
            },
            error: error.message
          }
        });
      }
    }

    return res.status(200).json(userPoints);
  } catch (error: any) {
    console.error('Database Error:', error);
    res.status(500).json({ error: '数据库查询错误', details: error.message });
  }
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { userId, amount, type, description } = req.body;

  if (!userId || !amount) {
    return res.status(400).json({
      error: '用户ID和积分数量为必填项'
    });
  }

  // 检查用户是否存在
  try {
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
        ...(amount > 0 ? { totalEarned: { increment: absAmount } } : { totalSpent: { increment: absAmount } })
      },
      create: {
        userId: Number(userId),
        points: Math.max(0, amount),
        totalEarned: amount > 0 ? amount : 0,
        totalSpent: amount < 0 ? absAmount : 0
      }
    });

    // 创建一条积分记录
    const logData = {
      userId: Number(userId),
      amount,
      type: type || 'OTHER', // 默认使用OTHER类型
      description: description || `${amount > 0 ? '获得' : '消费'}${absAmount}积分`
    };

    try {
      const log = await prisma.pointLog.create({ data: logData });
      
      res.status(200).json({
        ...userPoints,
        latestLog: log
      });
    } catch (error: any) {
      console.error('Error creating log:', error);
      res.status(200).json({
        ...userPoints,
        logError: error.message
      });
    }
  } catch (error: any) {
    console.error('Database Error:', error);
    res.status(500).json({ error: '数据库查询错误', details: error.message });
  }
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { userId, points, totalEarned, totalSpent } = req.body;

  if (!userId) {
    return res.status(400).json({ error: '用户ID为必填项' });
  }

  // 检查用户是否存在
  try {
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
      }
    });

    res.status(200).json(userPoints);
  } catch (error: any) {
    console.error('Database Error:', error);
    res.status(500).json({ error: '数据库查询错误', details: error.message });
  }
} 