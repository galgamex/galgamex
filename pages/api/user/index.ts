import {
  createUser,
  deleteUser,
  findUser,
  findUsers,
  findUsersCount,
  updateUser
} from '@/model/user';
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

  // 获取单个用户
  if (id) {
    const user = await findUser({ id: Number(id) });
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 移除敏感信息
    const { password, ...safeUserData } = user;
    return res.status(200).json(safeUserData);
  }

  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 10), 50);
  delete query.page;
  delete query.limit;

  // 获取用户列表
  const where = buildWhereCondition<Prisma.UserWhereInput>(query);
  const [users, total] = await Promise.all([
    findUsers(where),
    findUsersCount(where)
  ]);

  // 移除所有用户的密码字段
  const safeUsers = users.map((user: any) => {
    // @ts-ignore
    const { password, ...safeUserData } = user;
    return safeUserData;
  });

  res.status(200).json({
    data: safeUsers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const userData: Prisma.UserCreateInput = req.body;

  // 验证必要字段
  if (!userData.username || !userData.email || !userData.password) {
    return res.status(400).json({
      error: '用户名、邮箱和密码为必填项'
    });
  }

  // 检查用户名和邮箱是否已存在
  const existingUser = await findUser({
    OR: [
      { username: userData.username },
      { email: userData.email }
    ]
  });

  if (existingUser) {
    return res.status(409).json({
      error: '用户名或邮箱已被使用'
    });
  }

  const user = await createUser(userData);

  // 移除敏感信息
  const { password, ...safeUserData } = user;
  res.status(201).json(safeUserData);
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const userData = req.body;

  if (!id) {
    return res.status(400).json({ error: '用户ID为必填项' });
  }

  // 不允许直接更新敏感字段
  if (userData.email) {
    // 检查邮箱是否已被其他用户使用
    const existingUser = await findUser({
      AND: [
        { email: userData.email },
        { NOT: { id: Number(id) } }
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        error: '邮箱已被其他用户使用'
      });
    }
  }

  const user = await updateUser({
    where: { id: Number(id) },
    data: userData
  });

  // 移除敏感信息
  // @ts-ignore
  const { password, ...safeUserData } = user;
  res.status(200).json(safeUserData);
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: '用户ID为必填项' });
  }

  await deleteUser({ id: Number(id) });
  res.status(204).end();
}

// 构建查询条件
const buildWhereCondition = <T extends Prisma.UserWhereInput>(query: any): T => {
  const where = {} as T;

  // 基本字段过滤
  if (query.username) where.username = { contains: query.username } as any;
  if (query.nickname) where.nickname = { contains: query.nickname } as any;
  if (query.email) where.email = { contains: query.email } as any;
  if (query.role) where.role = query.role as any;

  // 数字字段过滤
  if (query.minArticles) where.articles = { gte: Number(query.minArticles) } as any;
  if (query.maxArticles) where.articles = { ...(where.articles || {}), lte: Number(query.maxArticles) } as any;

  // 日期范围过滤
  if (query.startDate && query.endDate) {
    where.createdAt = {
      gte: new Date(query.startDate),
      lte: new Date(query.endDate)
    } as any;
  }

  return where;
}; 