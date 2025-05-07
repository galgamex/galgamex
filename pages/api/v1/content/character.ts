import {
  createCharacter,
  deleteCharacter,
  findCharacter,
  findCharacterCount,
  findCharacters,
  updateCharacter
} from '@/model/content/character';
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

  // 获取单个角色
  if (id) {
    const character = await findCharacter({ id: Number(id) });
    if (!character) {
      return res.status(404).json({ error: '角色不存在' });
    }
    return res.status(200).json(character);
  }

  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 10), 50);
  delete query.page;
  delete query.limit;

  // 获取角色列表
  const where = buildWhereCondition<Prisma.CharacterWhereInput>(query);
  const [characters, total] = await Promise.all([
    findCharacters(where),
    findCharacterCount(where)
  ]);

  res.status(200).json({
    data: characters,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const characterData: Prisma.CharacterCreateInput = req.body;

  // 验证必要字段
  if (!characterData.name || !characterData.articleId) {
    return res.status(400).json({
      error: '角色名称和游戏ID为必填项'
    });
  }

  const character = await createCharacter(characterData);
  res.status(201).json(character);
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const characterData = req.body;

  if (!id) {
    return res.status(400).json({ error: '角色ID为必填项' });
  }

  const character = await updateCharacter(
    { id: Number(id) },
    characterData
  );

  res.status(200).json(character);
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: '角色ID为必填项' });
  }

  await deleteCharacter({ id: Number(id) });
  res.status(204).end();
}

// 构建查询条件
const buildWhereCondition = <T extends Prisma.CharacterWhereInput>(query: any): T => {
  const where = {} as T;

  // 基本字段过滤
  if (query.name) where.name = { contains: query.name } as any;
  if (query.nameJp) where.nameJp = { contains: query.nameJp } as any;
  if (query.articleId) where.articleId = Number(query.articleId) as any;
  if (query.cv) where.cv = { contains: query.cv } as any;
  if (query.cvJp) where.cvJp = { contains: query.cvJp } as any;
  if (query.isMain) where.isMain = (query.isMain === 'true') as any;
  if (query.isHeroine) where.isHeroine = (query.isHeroine === 'true') as any;

  // 日期范围过滤
  if (query.startDate && query.endDate) {
    where.createdAt = {
      gte: new Date(query.startDate),
      lte: new Date(query.endDate)
    } as any;
  }

  return where;
}; 