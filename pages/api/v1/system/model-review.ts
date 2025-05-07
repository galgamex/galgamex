import {
  createReview,
  deleteReview,
  findReview,
  findReviewCount,
  findReviews,
  updateReview
} from '@/model/content/review';
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
    res.status(500).json({ error: '服务器内部错误' });
  }
}

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id, ...query } = req.query;

  // 获取单个审核记录
  if (id) {
    const review = await findReview({ id: Number(id) });
    if (!review) {
      return res.status(404).json({ error: '审核记录不存在' });
    }
    return res.status(200).json(review);
  }

  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 10), 50);
  delete query.page;
  delete query.limit;

  // 获取审核列表
  const where = buildWhereCondition<Prisma.ReviewWhereInput>(query);
  const [reviews, total] = await Promise.all([
    findReviews(where),
    findReviewCount(where)
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
  const reviewData: Prisma.ReviewCreateInput = req.body;

  // 验证必要字段
  if (!reviewData.title || !reviewData.content || !reviewData.type || !reviewData.status) {
    return res.status(400).json({
      error: '标题、内容、类型和状态为必填项'
    });
  }

  const review = await createReview(reviewData);
  res.status(201).json(review);
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const reviewData = req.body;

  if (!id) {
    return res.status(400).json({ error: '审核ID为必填项' });
  }

  const review = await updateReview(
    { id: Number(id) },
    reviewData
  );

  res.status(200).json(review);
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: '审核ID为必填项' });
  }

  await deleteReview({ id: Number(id) });
  res.status(204).end();
}

// 构建查询条件
const buildWhereCondition = <T extends Prisma.ReviewWhereInput>(query: any): T => {
  const where = {} as T;

  // 基本字段过滤
  if (query.type) where.type = query.type as any;
  if (query.status) where.status = query.status as any;
  if (query.objectId) where.objectId = Number(query.objectId) as any;
  if (query.reviewerId) where.reviewerId = Number(query.reviewerId) as any;

  // 日期范围过滤
  if (query.startDate && query.endDate) {
    where.createdAt = {
      gte: new Date(query.startDate),
      lte: new Date(query.endDate)
    } as any;
  }

  // 内容搜索
  if (query.keyword) {
    where.OR = [
      { title: { contains: query.keyword } },
      { content: { contains: query.keyword } },
      { remark: { contains: query.keyword } }
    ] as any;
  }

  return where;
}; 