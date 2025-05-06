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
      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
}

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id, userId, ...query } = req.query;
  
  if (id) {
    // 查询单个积分日志
    const pointLog = await prisma.pointLog.findUnique({
      where: { id: Number(id) },
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
    
    if (!pointLog) {
      return res.status(404).json({ error: '积分日志不存在' });
    }
    
    return res.status(200).json(pointLog);
  }
  
  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 20), 100);
  
  // 构建查询条件
  const where = buildWhereCondition(req.query);
  
  // 查询积分日志列表
  const [pointLogs, total] = await Promise.all([
    prisma.pointLog.findMany({
      where,
      include: {
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
    prisma.pointLog.count({ where })
  ]);
  
  res.status(200).json({
    data: pointLogs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

// 构建查询条件
function buildWhereCondition(query: any) {
  const where: any = {};
  
  // 用户ID筛选
  if (query.userId) {
    where.userId = Number(query.userId);
  }
  
  // 积分类型筛选
  if (query.type) {
    where.type = query.type as string;
  }
  
  // 积分变化筛选
  if (query.minPoints) {
    where.amount = { gte: Number(query.minPoints) };
  }
  
  if (query.maxPoints) {
    where.amount = { ...(where.amount || {}), lte: Number(query.maxPoints) };
  }
  
  // 判断是否为增加或减少积分
  if (query.isPositive === 'true') {
    where.amount = { gt: 0 };
  } else if (query.isPositive === 'false') {
    where.amount = { lt: 0 };
  }
  
  // 日期范围筛选
  if (query.startDate) {
    where.createdAt = { gte: new Date(query.startDate as string) };
  }
  
  if (query.endDate) {
    where.createdAt = { 
      ...(where.createdAt || {}), 
      lte: new Date(query.endDate as string) 
    };
  }
  
  // 描述关键字搜索
  if (query.keyword) {
    where.description = { contains: query.keyword };
  }
  
  return where;
} 