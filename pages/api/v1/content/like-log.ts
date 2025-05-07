import {
  createLikeLog,
  deleteLikeLog,
  findLikeLog,
  findLikeLogs,
  findLikeLogsCount,
  hasLiked,
  updateLikeLog
} from '@/model/content/like-log';
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
      case 'DELETE':
        await handleDeleteRequest(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
}

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id, authorId, articleId, commentId, check, ...query } = req.query;

  // 获取单个点赞记录
  if (id) {
    const likeLog = await findLikeLog({ id: Number(id) });
    if (!likeLog) {
      return res.status(404).json({ error: '点赞记录不存在' });
    }
    return res.status(200).json(likeLog);
  }

  // 检查用户是否已点赞
  if (check === 'true' && authorId && (articleId || commentId)) {
    const type = articleId ? 'ARTICLE' : 'COMMENT';
    const targetId = Number(articleId || commentId);
    
    const liked = await hasLiked(Number(authorId), type as Prisma.LikeType, targetId);
    return res.status(200).json({ liked });
  }

  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 10), 50);
  delete query.page;
  delete query.limit;

  // 获取点赞记录列表
  const where = buildWhereCondition<Prisma.LikeLogWhereInput>(query);
  
  if (authorId) where.authorId = Number(authorId) as any;
  if (articleId) where.articleId = Number(articleId) as any;
  if (commentId) where.commentId = Number(commentId) as any;

  const [likeLogs, total] = await Promise.all([
    findLikeLogs(where, {
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    findLikeLogsCount(where)
  ]);

  res.status(200).json({
    data: likeLogs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { authorId, articleId, commentId } = req.body;

  // 验证必要字段
  if (!authorId || (!articleId && !commentId)) {
    return res.status(400).json({
      error: '用户ID和文章ID或评论ID为必填项'
    });
  }

  // 检查是否已存在点赞记录
  const type = articleId ? 'ARTICLE' : 'COMMENT';
  const targetId = Number(articleId || commentId);
  
  const existing = await hasLiked(Number(authorId), type as Prisma.LikeType, targetId);
  
  if (existing) {
    return res.status(409).json({
      error: '已经点赞过了'
    });
  }

  // 创建点赞记录
  const likeLogData: Prisma.LikeLogCreateInput = {
    author: { connect: { id: Number(authorId) } },
    type: type as Prisma.LikeType
  };

  if (articleId) {
    likeLogData.article = { connect: { id: Number(articleId) } };
  } else if (commentId) {
    likeLogData.comment = { connect: { id: Number(commentId) } };
  }

  const likeLog = await createLikeLog(likeLogData);
  res.status(201).json(likeLog);
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id, authorId, articleId, commentId } = req.query;

  if (id) {
    // 根据ID删除
    await deleteLikeLog({ id: Number(id) });
    return res.status(204).end();
  }

  if (authorId && (articleId || commentId)) {
    // 根据用户ID和文章ID或评论ID删除
    const type = articleId ? 'ARTICLE' : 'COMMENT';
    const targetId = Number(articleId || commentId);
    
    try {
      // 查找要删除的记录
      const where: Prisma.LikeLogWhereInput = {
        authorId: Number(authorId),
        type: type as Prisma.LikeType
      };
      
      if (articleId) {
        where.articleId = Number(articleId);
      } else if (commentId) {
        where.commentId = Number(commentId);
      }
      
      const likeLog = await findLikeLogs(where, { take: 1 });
      
      if (likeLog && likeLog.length > 0) {
        await deleteLikeLog({ id: likeLog[0].id });
      }
      
      return res.status(204).end();
    } catch (error) {
      console.error('Delete like log error:', error);
      return res.status(500).json({ error: '删除点赞记录失败' });
    }
  }

  return res.status(400).json({ error: '必须提供ID或(用户ID和文章ID/评论ID)' });
}

// 构建查询条件
const buildWhereCondition = <T extends Prisma.LikeLogWhereInput>(query: any): T => {
  const where = {} as T;

  if (query.type) where.type = query.type as any;

  // 日期范围过滤
  if (query.startDate && query.endDate) {
    where.createdAt = {
      gte: new Date(query.startDate),
      lte: new Date(query.endDate)
    } as any;
  }

  return where;
}; 