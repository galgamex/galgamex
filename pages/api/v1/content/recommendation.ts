import {
  createRecommendation,
  createRecommendations,
  deleteArticleRecommendations,
  deleteRecommendation,
  findArticleRecommendations,
  findArticleRecommendedBy,
  findRecommendation,
  findRecommendations,
  updateArticleRecommendations
} from '@/model/content/recommendation';
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
  try {
    const { id, articleId, recId, direction } = req.query;

    // 获取单个推荐记录
    if (id) {
      const recommendation = await findRecommendation(Number(id));
      if (!recommendation) {
        return res.status(404).json({ error: '推荐记录不存在' });
      }
      return res.status(200).json(recommendation);
    }

    // 获取文章的推荐列表
    if (articleId && direction === 'outgoing') {
      const recommendations = await findArticleRecommendations(Number(articleId));
      return res.status(200).json(recommendations);
    }

    // 获取被推荐到本文章的列表
    if (articleId && direction === 'incoming') {
      const recommendations = await findArticleRecommendedBy(Number(articleId));
      return res.status(200).json(recommendations);
    }

    // 获取两篇文章之间的推荐关系
    if (articleId && recId) {
      const recommendations = await findRecommendations({
        OR: [
          { articleId: Number(articleId), recId: Number(recId) },
          { articleId: Number(recId), recId: Number(articleId) }
        ]
      });
      return res.status(200).json(recommendations);
    }

    // 获取所有推荐记录
    const recommendations = await findRecommendations({});
    return res.status(200).json({ data: recommendations });
  } catch (error) {
    console.error('Get recommendations error:', error);
    return res.status(500).json({ error: '获取推荐记录失败' });
  }
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { articleId, recId, recIds } = req.body;

    // 验证必要字段
    if (!articleId) {
      return res.status(400).json({
        error: '源文章ID为必填项'
      });
    }

    // 单个推荐
    if (recId) {
      const recommendation = await createRecommendation(Number(articleId), Number(recId));
      return res.status(201).json(recommendation);
    }

    // 多个推荐
    if (recIds && Array.isArray(recIds) && recIds.length > 0) {
      const recommendations = await createRecommendations(Number(articleId), recIds.map(Number));
      return res.status(201).json(recommendations);
    }

    return res.status(400).json({ error: '必须提供推荐文章ID或推荐文章ID数组' });
  } catch (error) {
    console.error('Create recommendation error:', error);
    return res.status(500).json({ error: '创建推荐记录失败' });
  }
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { articleId, recIds } = req.body;

    // 验证必要字段
    if (!articleId || !recIds || !Array.isArray(recIds)) {
      return res.status(400).json({
        error: '源文章ID和推荐文章ID数组为必填项'
      });
    }

    // 更新文章的推荐列表（替换所有现有推荐）
    const recommendations = await updateArticleRecommendations(Number(articleId), recIds.map(Number));
    return res.status(200).json(recommendations);
  } catch (error) {
    console.error('Update recommendations error:', error);
    return res.status(500).json({ error: '更新推荐记录失败' });
  }
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, articleId } = req.query;

    // 删除单个推荐记录
    if (id) {
      await deleteRecommendation(Number(id));
      return res.status(204).end();
    }

    // 删除文章的所有推荐
    if (articleId) {
      await deleteArticleRecommendations(Number(articleId));
      return res.status(204).end();
    }

    return res.status(400).json({ error: '必须提供推荐ID或源文章ID' });
  } catch (error) {
    console.error('Delete recommendation error:', error);
    return res.status(500).json({ error: '删除推荐记录失败' });
  }
} 