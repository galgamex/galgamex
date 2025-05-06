import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // 为了演示，使用固定用户ID (1)
    // 实际应用中，应该从会话获取用户ID
    const userId = 1;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    switch (req.method) {
      case 'GET':
        // 获取用户收藏列表
        const { page = '1', limit = '10', type } = req.query;
        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(Math.max(1, Number(limit)), 50);

        const where = type ? { type: String(type) } : {};

        const [favorites, total] = await Promise.all([
          prisma.userFavorite.findMany({
            where: {
              userId,
              ...where
            },
            include: {
              article: {
                select: {
                  id: true,
                  title: true,
                  cover: true,
                  excerpt: true,
                  createdAt: true,
                  updatedAt: true
                }
              }
            },
            skip: (pageNum - 1) * limitNum,
            take: limitNum,
            orderBy: { createdAt: 'desc' }
          }),
          prisma.userFavorite.count({
            where: {
              userId,
              ...where
            }
          })
        ]);

        return res.status(200).json({
          data: favorites,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum)
          }
        });

      case 'POST':
        // 添加收藏
        const { articleId, type: favType = 'ARTICLE' } = req.body;

        if (!articleId) {
          return res.status(400).json({ error: '文章ID为必填项' });
        }

        // 检查文章是否已收藏
        const existingFavorite = await prisma.userFavorite.findFirst({
          where: {
            userId,
            articleId: Number(articleId),
            type: favType
          }
        });

        if (existingFavorite) {
          return res.status(409).json({ error: '已经收藏过该文章' });
        }

        // 添加收藏
        const favorite = await prisma.userFavorite.create({
          data: {
            userId,
            articleId: Number(articleId),
            type: favType
          }
        });

        return res.status(201).json(favorite);

      case 'DELETE':
        // 删除收藏
        const { id: favId, articleId: artId } = req.query;

        if (!favId && !artId) {
          return res.status(400).json({ error: '收藏ID或文章ID为必填项' });
        }

        if (favId) {
          // 通过收藏ID删除
          await prisma.userFavorite.deleteMany({
            where: {
              id: Number(favId),
              userId
            }
          });
        } else {
          // 通过文章ID删除
          await prisma.userFavorite.deleteMany({
            where: {
              articleId: Number(artId),
              userId
            }
          });
        }

        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
} 