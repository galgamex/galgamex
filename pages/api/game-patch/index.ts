import {
  createGamePatch,
  deleteGamePatch,
  findGamePatch,
  findGamePatches,
  findGamePatchesCount,
  updateGamePatch
} from '@/model/game-patch';
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

  // 获取单个游戏补丁
  if (id) {
    const gamePatch = await findGamePatch({ id: Number(id) });
    if (!gamePatch) {
      return res.status(404).json({ error: '游戏补丁不存在' });
    }
    return res.status(200).json(gamePatch);
  }

  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 10), 50);
  delete query.page;
  delete query.limit;

  // 获取游戏补丁列表
  const where = buildWhereCondition<Prisma.GamePatchWhereInput>(query);
  const [gamePatches, total] = await Promise.all([
    findGamePatches(where, {
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    findGamePatchesCount(where)
  ]);

  res.status(200).json({
    data: gamePatches,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const gamePatchData: Prisma.GamePatchCreateInput = req.body;

  // 验证必要字段
  if (!gamePatchData.name || !gamePatchData.version || !gamePatchData.url || !gamePatchData.articleId || !gamePatchData.authorId) {
    return res.status(400).json({
      error: '补丁名称、版本号、下载链接、游戏ID和作者ID为必填项'
    });
  }

  const gamePatch = await createGamePatch(gamePatchData);
  res.status(201).json(gamePatch);
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const gamePatchData = req.body;

  if (!id) {
    return res.status(400).json({ error: '补丁ID为必填项' });
  }

  const gamePatch = await updateGamePatch({
    where: { id: Number(id) },
    data: gamePatchData
  });

  res.status(200).json(gamePatch);
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: '补丁ID为必填项' });
  }

  await deleteGamePatch({ id: Number(id) });
  res.status(204).end();
}

// 构建查询条件
const buildWhereCondition = <T extends Prisma.GamePatchWhereInput>(query: any): T => {
  const where: Partial<T> = {};

  // 基本字段过滤
  if (query.name) where.name = { contains: query.name };
  if (query.version) where.version = { contains: query.version };
  if (query.gameVersion) where.gameVersion = { contains: query.gameVersion };
  if (query.articleId) where.articleId = Number(query.articleId);
  if (query.authorId) where.authorId = Number(query.authorId);
  if (query.status) where.status = query.status;
  if (query.translator) where.translator = { contains: query.translator };

  // 数值范围过滤
  if (query.minRating) where.rating = { gte: Number(query.minRating) };
  if (query.maxRating) where.rating = { ...(where.rating || {}), lte: Number(query.maxRating) };

  // 日期范围过滤
  if (query.startDate && query.endDate) {
    where.createdAt = {
      gte: new Date(query.startDate),
      lte: new Date(query.endDate)
    };
  }

  return where as T;
}; 