import {
  connectArticleTag,
  connectArticleTags,
  disconnectArticleTag,
  disconnectArticleTags,
  getArticleTagIds,
  getTagArticleIds,
  updateArticleTags
} from '@/model/content/article-tag';
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
  const { articleId, tagId } = req.query;

  // 必须提供文章ID或标签ID
  if (!articleId && !tagId) {
    return res.status(400).json({ error: '必须提供文章ID或标签ID' });
  }

  // 获取文章的所有标签
  if (articleId) {
    try {
      const tagIds = await getArticleTagIds(Number(articleId));
      
      // 如果需要完整的标签信息
      if (req.query.includeDetails === 'true') {
        const tags = await prisma.tag.findMany({
          where: {
            id: {
              in: tagIds
            }
          }
        });
        return res.status(200).json(tags);
      }
      
      return res.status(200).json(tagIds);
    } catch (error) {
      console.error('Error getting article tags:', error);
      return res.status(500).json({ error: '获取文章标签失败' });
    }
  }

  // 获取标签关联的所有文章
  if (tagId) {
    try {
      const articleIds = await getTagArticleIds(Number(tagId));
      
      // 如果需要完整的文章信息
      if (req.query.includeDetails === 'true') {
        const articles = await prisma.article.findMany({
          where: {
            id: {
              in: articleIds
            }
          }
        });
        return res.status(200).json(articles);
      }
      
      return res.status(200).json(articleIds);
    } catch (error) {
      console.error('Error getting tag articles:', error);
      return res.status(500).json({ error: '获取标签文章失败' });
    }
  }
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { articleId, tagId, tagIds } = req.body;

  // 验证必要字段
  if (!articleId) {
    return res.status(400).json({
      error: '文章ID为必填项'
    });
  }

  // 单个标签关联
  if (tagId) {
    try {
      const articleTag = await connectArticleTag(Number(articleId), Number(tagId));
      return res.status(201).json(articleTag);
    } catch (error) {
      console.error('Error connecting article tag:', error);
      return res.status(500).json({ error: '关联文章标签失败' });
    }
  }

  // 多个标签关联
  if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
    try {
      const articleTags = await connectArticleTags(Number(articleId), tagIds.map(Number));
      return res.status(201).json(articleTags);
    } catch (error) {
      console.error('Error connecting article tags:', error);
      return res.status(500).json({ error: '批量关联文章标签失败' });
    }
  }

  return res.status(400).json({ error: '必须提供标签ID或标签ID数组' });
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { articleId, tagIds } = req.body;

  // 验证必要字段
  if (!articleId || !tagIds || !Array.isArray(tagIds)) {
    return res.status(400).json({
      error: '文章ID和标签ID数组为必填项'
    });
  }

  try {
    // 更新文章标签（替换所有现有标签）
    const articleTags = await updateArticleTags(Number(articleId), tagIds.map(Number));
    return res.status(200).json(articleTags);
  } catch (error) {
    console.error('Error updating article tags:', error);
    return res.status(500).json({ error: '更新文章标签失败' });
  }
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { articleId, tagId, tagIds } = req.query;

  // 验证必要字段
  if (!articleId) {
    return res.status(400).json({
      error: '文章ID为必填项'
    });
  }

  // 移除单个标签关联
  if (tagId) {
    try {
      await disconnectArticleTag(Number(articleId), Number(tagId));
      return res.status(204).end();
    } catch (error) {
      console.error('Error disconnecting article tag:', error);
      return res.status(500).json({ error: '移除文章标签关联失败' });
    }
  }

  // 移除多个标签关联
  if (tagIds) {
    try {
      const tagIdsArray = Array.isArray(tagIds) 
        ? tagIds.map(Number) 
        : String(tagIds).split(',').map(Number);
      
      await disconnectArticleTags(Number(articleId), tagIdsArray);
      return res.status(204).end();
    } catch (error) {
      console.error('Error disconnecting article tags:', error);
      return res.status(500).json({ error: '批量移除文章标签关联失败' });
    }
  }

  // 移除文章的所有标签关联
  try {
    await prisma.articleTag.deleteMany({
      where: { articleId: Number(articleId) }
    });
    return res.status(204).end();
  } catch (error) {
    console.error('Error removing all article tags:', error);
    return res.status(500).json({ error: '移除文章所有标签关联失败' });
  }
} 