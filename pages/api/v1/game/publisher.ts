import {
  createPublisher,
  deletePublisher,
  findPublisher,
  findPublisherCount,
  findPublishers,
  updatePublisher
} from '@/model/game/publisher';
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

  // 获取单个发行商
  if (id) {
    const publisher = await findPublisher({ id: Number(id) });
    if (!publisher) {
      return res.status(404).json({ error: '发行商不存在' });
    }
    return res.status(200).json(publisher);
  }

  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 10), 50);
  delete query.page;
  delete query.limit;

  // 获取发行商列表
  const where = buildWhereCondition<Prisma.PublisherWhereInput>(query);
  const [publishers, total] = await Promise.all([
    findPublishers(where),
    findPublisherCount(where)
  ]);

  res.status(200).json({
    data: publishers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const publisherData: Prisma.PublisherCreateInput = req.body;

  // 验证必要字段
  if (!publisherData.name) {
    return res.status(400).json({
      error: '发行商名称为必填项'
    });
  }

  const publisher = await createPublisher(publisherData);
  res.status(201).json(publisher);
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const publisherData = req.body;

  if (!id) {
    return res.status(400).json({ error: '发行商ID为必填项' });
  }

  const publisher = await updatePublisher(
    { id: Number(id) },
    publisherData
  );

  res.status(200).json(publisher);
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: '发行商ID为必填项' });
  }

  await deletePublisher({ id: Number(id) });
  res.status(204).end();
}

// 构建查询条件
const buildWhereCondition = <T extends Prisma.PublisherWhereInput>(query: any): T => {
  const where = {} as T;

  // 基本字段过滤
  if (query.name) where.name = { contains: query.name } as any;
  if (query.website) where.website = { contains: query.website } as any;

  // 日期范围过滤
  if (query.startDate && query.endDate) {
    where.createdAt = {
      gte: new Date(query.startDate),
      lte: new Date(query.endDate)
    } as any;
  }

  return where;
}; 