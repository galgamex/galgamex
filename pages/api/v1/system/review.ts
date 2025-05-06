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

  // 获取单个审核记录
  if (id) {
    const review = await prisma.review.findUnique({
      where: { id: Number(id) },
      include: {
        submitter: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true
          }
        },
        reviewer: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true
          }
        }
      }
    });
    
    if (!review) {
      return res.status(404).json({ error: '审核记录不存在' });
    }
    
    return res.status(200).json(review);
  }

  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 10), 50);

  // 构建查询条件
  const where = buildWhereCondition(query);

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        submitter: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true
          }
        },
        reviewer: {
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
    prisma.review.count({ where })
  ]);

  res.status(200).json({
    data: reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const reviewData = req.body;

  // 验证必要字段
  if (!reviewData.title || !reviewData.type || !reviewData.submitterId || !reviewData.objectId || !reviewData.objectData) {
    return res.status(400).json({
      error: '标题、类型、提交者ID、对象ID和对象数据为必填项'
    });
  }

  const review = await prisma.review.create({
    data: reviewData,
    include: {
      submitter: {
        select: {
          id: true,
          username: true,
          nickname: true,
          avatar: true
        }
      }
    }
  });

  res.status(201).json(review);
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const reviewData = req.body;

  if (!id) {
    return res.status(400).json({ error: '审核ID为必填项' });
  }

  const review = await prisma.review.update({
    where: { id: Number(id) },
    data: reviewData,
    include: {
      submitter: {
        select: {
          id: true,
          username: true,
          nickname: true,
          avatar: true
        }
      },
      reviewer: {
        select: {
          id: true,
          username: true,
          nickname: true,
          avatar: true
        }
      }
    }
  });

  res.status(200).json(review);
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: '审核ID为必填项' });
  }

  await prisma.review.delete({ where: { id: Number(id) } });
  res.status(204).end();
}

// 构建查询条件
function buildWhereCondition(query: any) {
  const where: any = {};

  // 基本字段过滤
  if (query.title) where.title = { contains: query.title };
  if (query.type) where.type = query.type;
  if (query.status) where.status = query.status;
  if (query.submitterId) where.submitterId = Number(query.submitterId);
  if (query.reviewerId) where.reviewerId = Number(query.reviewerId);
  if (query.objectId) where.objectId = Number(query.objectId);
  
  // 待审核筛选
  if (query.pendingOnly === 'true') {
    where.status = 'PENDING';
  }
  
  // 日期范围过滤
  if (query.startDate && query.endDate) {
    where.createdAt = {
      gte: new Date(query.startDate),
      lte: new Date(query.endDate)
    };
  }

  return where;
}