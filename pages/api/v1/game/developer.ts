import {
  createDeveloper,
  deleteDeveloper,
  findDeveloper,
  findDeveloperCount,
  findDevelopers,
  updateDeveloper
} from '@/model/developer';
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

  // 获取单个开发商
  if (id) {
    const developer = await findDeveloper({ id: Number(id) });
    if (!developer) {
      return res.status(404).json({ error: '开发商不存在' });
    }
    return res.status(200).json(developer);
  }

  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 10), 50);
  delete query.page;
  delete query.limit;

  // 获取开发商列表
  const where = buildWhereCondition<Prisma.DeveloperWhereInput>(query);
  const [developers, total] = await Promise.all([
    findDevelopers(where),
    findDeveloperCount(where)
  ]);

  res.status(200).json({
    data: developers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const developerData: Prisma.DeveloperCreateInput = req.body;

  // 验证必要字段
  if (!developerData.name) {
    return res.status(400).json({
      error: '开发商名称为必填项'
    });
  }

  const developer = await createDeveloper(developerData);
  res.status(201).json(developer);
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const developerData = req.body;

  if (!id) {
    return res.status(400).json({ error: '开发商ID为必填项' });
  }

  const developer = await updateDeveloper(
    { id: Number(id) },
    developerData
  );

  res.status(200).json(developer);
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: '开发商ID为必填项' });
  }

  await deleteDeveloper({ id: Number(id) });
  res.status(204).end();
}

// 构建查询条件
const buildWhereCondition = <T extends Prisma.DeveloperWhereInput>(query: any): T => {
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