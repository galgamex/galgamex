import {
  createArticle,
  deleteArticle,
  findArticle,
  findArticles,
  findArticlesCount,
  updateArticle
} from '@/model/article';

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

  // 获取单篇文章
  if (id) {
    const article = await findArticle({ id: Number(id) });
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    return res.status(200).json(article);
  }

  // 分页参数兜底处理
  const page = Math.max(1, Number(query.page) || 1); // 最小为1
  const limit = Math.min(Math.max(1, Number(query.limit) || 10), 100); // 限制在1-100之间

  // 获取文章列表
  const where = buildWhereCondition<Prisma.ArticleWhereInput>(query);
  const [articles, total] = await Promise.all([
    findArticles(where, {
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    findArticlesCount(where)
  ]);

  res.status(200).json({
    data: articles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const articleData: Prisma.ArticleCreateInput = req.body;

  // 验证必要字段
  if (!articleData.title || !articleData.content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const article = await createArticle(articleData);
  res.status(201).json(article);
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const articleData = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Article ID is required' });
  }

  const article = await updateArticle({
    where: { id: Number(id) },
    data: articleData
  });

  res.status(200).json(article);
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Article ID is required' });
  }

  await deleteArticle({ id: Number(id) });
  res.status(204).end();
}

// 构建查询条件
const buildWhereCondition = <T extends Prisma.ArticleWhereInput>(query: any): T => {
  const where = {} as T;

  // 基本字段过滤
  if (query.title) where.title = { contains: query.title } as any;
  if (query.categoryId) where.categoryId = Number(query.categoryId) as any;
  if (query.authorId) where.authorId = Number(query.authorId) as any;
  if (query.status) where.status = query.status as any;
  if (query.stage) where.stage = query.stage as any;
  if (query.type) where.type = query.type as any;

  // 布尔字段过滤
  if (query.isTop) where.isTop = (query.isTop === 'true') as any;
  if (query.isHot) where.isHot = (query.isHot === 'true') as any;

  // 日期范围过滤
  if (query.startDate && query.endDate) {
    where.createdAt = {
      gte: new Date(query.startDate),
      lte: new Date(query.endDate)
    } as any;
  }

  return where;

};