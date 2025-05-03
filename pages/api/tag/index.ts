import {
  createTag,
  deleteTag,
  findTag,
  findTags,
  findTagsCount,
  updateTag
} from '@/model/tag';
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

  // 获取单个标签
  if (id) {
    const tag = await findTag({ id: Number(id) });
    if (!tag) {
      return res.status(404).json({ error: '标签不存在' });
    }
    return res.status(200).json(tag);
  }

  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 20), 100);
  delete query.page;
  delete query.limit;

  // 获取标签列表
  const where = buildWhereCondition<Prisma.TagWhereInput>(query);
  const [tags, total] = await Promise.all([
    findTags(where, {
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    findTagsCount(where)
  ]);

  res.status(200).json({
    data: tags,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const tagData: Prisma.TagCreateInput = req.body;

  // 验证必要字段
  if (!tagData.name) {
    return res.status(400).json({
      error: '标签名称为必填项'
    });
  }

  // 检查标签名是否已存在
  const existingTag = await findTag({
    OR: [
      { name: tagData.name },
      { alias: tagData.alias },
      { slug: tagData.slug }
    ]
  });

  if (existingTag) {
    return res.status(409).json({
      error: '标签名称、别名或Slug已被使用'
    });
  }

  const tag = await createTag(tagData);
  res.status(201).json(tag);
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const tagData = req.body;

  if (!id) {
    return res.status(400).json({ error: '标签ID为必填项' });
  }

  // 检查标签名是否被其他标签使用
  if (tagData.name || tagData.alias || tagData.slug) {
    const conditions = [];
    if (tagData.name) conditions.push({ name: tagData.name });
    if (tagData.alias) conditions.push({ alias: tagData.alias });
    if (tagData.slug) conditions.push({ slug: tagData.slug });
    
    const existingTag = await findTag({
      AND: [
        { OR: conditions },
        { NOT: { id: Number(id) } }
      ]
    });

    if (existingTag) {
      return res.status(409).json({
        error: '标签名称、别名或Slug已被使用'
      });
    }
  }

  const tag = await updateTag({
    where: { id: Number(id) },
    data: tagData
  });
  
  res.status(200).json(tag);
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: '标签ID为必填项' });
  }

  // 检查是否有关联的文章
  const tag = await findTag({
    where: { id: Number(id) },
    include: { articleTag: true }
  });

  if (tag && tag.articleTag && tag.articleTag.length > 0) {
    return res.status(400).json({
      error: '请先解除该标签与文章的关联'
    });
  }

  await deleteTag({ id: Number(id) });
  res.status(204).end();
}

// 构建查询条件
const buildWhereCondition = <T extends Prisma.TagWhereInput>(query: any): T => {
  const where: Partial<T> = {};

  // 基本字段过滤
  if (query.name) where.name = { contains: query.name };
  if (query.alias) where.alias = { contains: query.alias };
  if (query.slug) where.slug = { contains: query.slug };
  if (query.categoryId) where.categoryId = Number(query.categoryId);
  
  // 日期范围过滤
  if (query.startDate && query.endDate) {
    where.createdAt = {
      gte: new Date(query.startDate),
      lte: new Date(query.endDate)
    };
  }

  return where as T;
}; 