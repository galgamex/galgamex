import {
  createComment,
  deleteComment,
  findComment,
  findComments,
  findCommentsCount,
  updateComment
} from '@/model/comment';
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

  // 获取单个评论
  if (id) {
    const comment = await findComment({ id: Number(id) });
    if (!comment) {
      return res.status(404).json({ error: '评论不存在' });
    }
    return res.status(200).json(comment);
  }

  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 10), 50);
  delete query.page;
  delete query.limit;

  // 获取评论列表
  const where = buildWhereCondition(query);
  const [comments, total] = await Promise.all([
    findComments(where, {
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    findCommentsCount(where)
  ]);

  res.status(200).json({
    data: comments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const commentData = req.body;

  // 验证必要字段
  if (!commentData.content || !commentData.authorId) {
    return res.status(400).json({
      error: '评论内容和作者ID为必填项'
    });
  }

  // 检查文章ID或父评论ID至少要有一个
  if (!commentData.articleId && !commentData.parentId) {
    return res.status(400).json({
      error: '文章ID或父评论ID至少需要填写一项'
    });
  }

  const comment = await createComment(commentData);
  res.status(201).json(comment);
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const commentData = req.body;

  if (!id) {
    return res.status(400).json({ error: '评论ID为必填项' });
  }

  const comment = await updateComment({
    where: { id: Number(id) },
    data: commentData
  });
  
  res.status(200).json(comment);
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: '评论ID为必填项' });
  }

  // 检查是否有子评论
  const repliesCount = await findCommentsCount({
    parentId: Number(id)
  });

  if (repliesCount > 0) {
    return res.status(400).json({
      error: '请先删除该评论下的所有回复'
    });
  }

  await deleteComment({ id: Number(id) });
  res.status(204).end();
}

// 构建查询条件
const buildWhereCondition = (query: any): any => {
  const where: any = {};

  // 基本字段过滤
  if (query.content) where.content = { contains: query.content };
  if (query.articleId) where.articleId = Number(query.articleId);
  if (query.authorId) where.authorId = Number(query.authorId);
  if (query.parentId) where.parentId = Number(query.parentId);
  if (query.isTop) where.isTop = query.isTop === 'true';
  
  // 针对根评论或回复的过滤
  if (query.isRoot === 'true') {
    where.parentId = null;
  } else if (query.isRoot === 'false') {
    where.parentId = { not: null };
  }
  
  // 日期范围过滤
  if (query.startDate && query.endDate) {
    where.createdAt = {
      gte: new Date(query.startDate),
      lte: new Date(query.endDate)
    };
  }

  return where;
};
