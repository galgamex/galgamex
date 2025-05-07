import { NextApiRequest, NextApiResponse } from 'next';
import { addFavorite, removeFavorite, getUserFavorites, checkFavorite } from '@/model/user/favorites';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // 为了演示，使用固定用户ID (1)
    // 实际应用中，应该从会话获取用户ID
    const userId = parseInt(req.query.userId as string) || 1;
    const articleId = parseInt(req.query.articleId as string);
    
    // 获取分页参数
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;

    switch (req.method) {
      case 'GET':
        // 如果有指定articleId，则检查是否已收藏
        if (articleId) {
          const result = await checkFavorite(userId, articleId);
          if (!result.success) {
            return res.status(500).json({ error: result.message });
          }
          return res.status(200).json(result);
        }
        
        // 否则获取收藏列表
        const favorites = await getUserFavorites(userId, {
          skip,
          take: pageSize,
          orderBy: { createdAt: 'desc' }
        });
        
        if (!favorites.success) {
          return res.status(500).json({ error: favorites.message });
        }
        
        return res.status(200).json({
          data: favorites.data,
          pagination: {
            total: favorites.total,
            page,
            pageSize,
            pageCount: Math.ceil(favorites.total / pageSize)
          }
        });

      case 'POST':
        // 添加收藏
        if (!articleId) {
          return res.status(400).json({ error: '文章ID不能为空' });
        }
        
        const addResult = await addFavorite(userId, articleId);
        if (!addResult.success) {
          return res.status(400).json({ error: addResult.message });
        }
        
        return res.status(201).json({
          message: '收藏成功',
          data: addResult.data
        });

      case 'DELETE':
        // 删除收藏
        if (!articleId) {
          return res.status(400).json({ error: '文章ID不能为空' });
        }
        
        const removeResult = await removeFavorite(userId, articleId);
        if (!removeResult.success) {
          return res.status(400).json({ error: removeResult.message });
        }
        
        return res.status(200).json({
          message: '已取消收藏',
          data: removeResult.data
        });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API错误:', error);
    res.status(500).json({ error: '服务器内部错误', details: error instanceof Error ? error.message : String(error) });
  }
} 