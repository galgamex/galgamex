import {
  createFeedback,
  deleteFeedback,
  findFeedback,
  findFeedbacks,
  findFeedbacksCount,
  updateFeedback
} from '@/model/game/feedback';
// @ts-ignore - 忽略类型错误
import { Prisma } from '@prisma/client';
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
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id, ...query } = req.query;

  // 获取单个反馈
  if (id) {
    const feedback = await findFeedback({ id: Number(id) });
    if (!feedback) {
      return res.status(404).json({ error: '反馈不存在' });
    }
    return res.status(200).json(feedback);
  }

  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 10), 50);
  delete query.page;
  delete query.limit;

  // 获取反馈列表
  const where = buildWhereCondition<Prisma.FeedbackWhereInput>(query);
  const [feedbacks, total] = await Promise.all([
    findFeedbacks(where, {
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    findFeedbacksCount(where)
  ]);

  res.status(200).json({
    data: feedbacks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const feedbackData: Prisma.FeedbackCreateInput = req.body;

  // 验证必要字段
  if (!feedbackData.content || !feedbackData.authorId) {
    return res.status(400).json({
      error: '反馈内容和用户ID为必填项'
    });
  }

  const feedback = await createFeedback(feedbackData);
  res.status(201).json(feedback);
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const feedbackData = req.body;

  if (!id) {
    return res.status(400).json({ error: '反馈ID为必填项' });
  }

  // 调整updateFeedback参数格式
  const feedback = await updateFeedback({
    where: { id: Number(id) },
    data: feedbackData
  });

  res.status(200).json(feedback);
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: '反馈ID为必填项' });
  }

  await deleteFeedback({ id: Number(id) });
  res.status(204).end();
}

// 构建查询条件
const buildWhereCondition = <T extends Prisma.FeedbackWhereInput>(query: any): T => {
  const where = {} as T;

  // 基本字段过滤
  if (query.articleId) where.articleId = Number(query.articleId) as any;
  if (query.authorId) where.authorId = Number(query.authorId) as any;
  if (query.status) where.status = (query.status === 'true') as any;
  if (query.content) where.content = { contains: query.content } as any;

  // 回复状态过滤
  if (query.hasReply === 'true') {
    where.reply = { not: null } as any;
  } else if (query.hasReply === 'false') {
    where.reply = null as any;
  }

  // 日期范围过滤
  if (query.startDate && query.endDate) {
    where.createdAt = {
      gte: new Date(query.startDate),
      lte: new Date(query.endDate)
    } as any;
  }

  return where;
}; 