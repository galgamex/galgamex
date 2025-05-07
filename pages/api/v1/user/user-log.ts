import {
  createUserLog,
  deleteUserLog,
  deleteUserLogs,
  findLogs,
  findUserLog,
  findUserLogCount,
  findUserLogs,
  logUserAction
} from '@/model/user/user-log';
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
  const { id, userId, ...query } = req.query;

  // 获取单个用户日志
  if (id) {
    const userLog = await findUserLog(Number(id));
    if (!userLog) {
      return res.status(404).json({ error: '用户日志不存在' });
    }
    return res.status(200).json(userLog);
  }

  // 获取指定用户的所有日志
  if (userId) {
    // 分页参数处理
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(Math.max(1, Number(query.limit) || 10), 50);
    
    const [userLogs, total] = await Promise.all([
      findUserLogs(Number(userId), page, limit),
      findUserLogCount({ userId: Number(userId) })
    ]);
    
    return res.status(200).json({
      data: userLogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  }

  // 获取所有日志（管理员功能）
  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 10), 50);
  
  // 构建查询条件
  const where = buildWhereCondition(query);
  
  const [logs, total] = await Promise.all([
    findLogs(where, page, limit),
    findUserLogCount(where)
  ]);
  
  return res.status(200).json({
    data: logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { userId, type, remark, ip, ua } = req.body;

  // 验证必要字段
  if (!userId || !type) {
    return res.status(400).json({
      error: '用户ID和日志类型为必填项'
    });
  }

  try {
    // 记录用户操作
    const userLog = await logUserAction(
      Number(userId),
      type,
      remark,
      ip,
      ua
    );
    
    return res.status(201).json(userLog);
  } catch (error) {
    console.error('Error creating user log:', error);
    return res.status(500).json({ error: '创建用户日志失败' });
  }
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id, ids } = req.query;

  // 删除单个日志
  if (id) {
    try {
      await deleteUserLog(Number(id));
      return res.status(204).end();
    } catch (error) {
      console.error('Error deleting user log:', error);
      return res.status(500).json({ error: '删除用户日志失败' });
    }
  }

  // 批量删除日志
  if (ids) {
    try {
      const idsArray = Array.isArray(ids) 
        ? ids.map(Number) 
        : String(ids).split(',').map(Number);
      
      const count = await deleteUserLogs(idsArray);
      return res.status(200).json({ deleted: count });
    } catch (error) {
      console.error('Error batch deleting user logs:', error);
      return res.status(500).json({ error: '批量删除用户日志失败' });
    }
  }

  return res.status(400).json({ error: '必须提供日志ID或ID数组' });
}

// 构建查询条件
function buildWhereCondition(query: any): Prisma.UserLogWhereInput {
  const where: Prisma.UserLogWhereInput = {};

  // 基本字段过滤
  if (query.type) where.type = query.type;
  if (query.ip) where.ip = { contains: query.ip };
  
  // 日期范围过滤
  if (query.startDate && query.endDate) {
    where.createdAt = {
      gte: new Date(query.startDate),
      lte: new Date(query.endDate)
    };
  }

  return where;
} 