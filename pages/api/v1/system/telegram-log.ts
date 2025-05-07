import {
  createTelegramLog,
  deleteTelegramLog,
  findArticleTelegramLog,
  findPendingTelegramLogs,
  findTelegramLog,
  findTelegramLogCount,
  findTelegramLogs,
  updateTelegramLog,
  updateTelegramStatus
} from '@/model/system/telegram-log';
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
    res.status(500).json({ error: '服务器内部错误' });
  }
}

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id, articleId, pending, ...query } = req.query;

  // 获取单个日志
  if (id) {
    const telegramLog = await findTelegramLog(Number(id));
    if (!telegramLog) {
      return res.status(404).json({ error: 'Telegram日志不存在' });
    }
    return res.status(200).json(telegramLog);
  }

  // 根据文章ID获取日志
  if (articleId) {
    const telegramLog = await findArticleTelegramLog(Number(articleId));
    if (!telegramLog) {
      return res.status(404).json({ error: '该文章没有关联的Telegram日志' });
    }
    return res.status(200).json(telegramLog);
  }

  // 获取待发布的日志
  if (pending === 'true') {
    const limit = Number(query.limit) || 10;
    const pendingLogs = await findPendingTelegramLogs(limit);
    return res.status(200).json(pendingLogs);
  }

  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 10), 50);
  delete query.page;
  delete query.limit;

  // 构建查询条件
  const where: Prisma.TelegramLogWhereInput = {};
  
  // 状态筛选
  if (query.status !== undefined) {
    where.status = query.status === 'true';
  }
  
  // 日期范围筛选
  if (query.startDate && query.endDate) {
    where.createdAt = {
      gte: new Date(String(query.startDate)),
      lte: new Date(String(query.endDate))
    };
  }

  // 获取日志列表
  const [telegramLogs, total] = await Promise.all([
    findTelegramLogs(where, page, limit),
    findTelegramLogCount(where)
  ]);

  res.status(200).json({
    data: telegramLogs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { articleId, images, url, remark, status } = req.body;

  // 验证必要字段
  if (!articleId) {
    return res.status(400).json({
      error: '文章ID为必填项'
    });
  }

  // 检查是否已存在日志
  const existingLog = await findArticleTelegramLog(Number(articleId));
  if (existingLog) {
    return res.status(409).json({
      error: '该文章已有Telegram日志，请使用PUT方法更新'
    });
  }

  try {
    // 创建日志
    const telegramLog = await createTelegramLog(Number(articleId), {
      images,
      url,
      remark,
      status: status !== undefined ? status : false
    });

    res.status(201).json(telegramLog);
  } catch (error) {
    console.error('Error creating telegram log:', error);
    res.status(500).json({ error: '创建Telegram日志失败' });
  }
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { articleId, images, url, remark, status } = req.body;

  if (!id && !articleId) {
    return res.status(400).json({ error: '日志ID或文章ID为必填项' });
  }

  let logId: number;

  // 如果提供了文章ID，查找对应的日志
  if (articleId && !id) {
    const existingLog = await findArticleTelegramLog(Number(articleId));
    if (!existingLog) {
      return res.status(404).json({ error: '该文章没有关联的Telegram日志' });
    }
    logId = existingLog.id;
  } else {
    logId = Number(id);
  }

  try {
    // 如果只需更新状态
    if (status !== undefined && Object.keys(req.body).length === 1) {
      const telegramLog = await updateTelegramStatus(logId, status, remark);
      return res.status(200).json(telegramLog);
    }

    // 更新完整日志
    const data: Prisma.TelegramLogUpdateInput = {};
    if (images !== undefined) data.images = images;
    if (url !== undefined) data.url = url;
    if (remark !== undefined) data.remark = remark;
    if (status !== undefined) data.status = status;

    const telegramLog = await updateTelegramLog(logId, data);
    res.status(200).json(telegramLog);
  } catch (error) {
    console.error('Error updating telegram log:', error);
    res.status(500).json({ error: '更新Telegram日志失败' });
  }
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id, articleId } = req.query;

  if (!id && !articleId) {
    return res.status(400).json({ error: '日志ID或文章ID为必填项' });
  }

  try {
    // 如果提供了文章ID，查找对应的日志
    if (articleId && !id) {
      const existingLog = await findArticleTelegramLog(Number(articleId));
      if (!existingLog) {
        return res.status(404).json({ error: '该文章没有关联的Telegram日志' });
      }
      await deleteTelegramLog(existingLog.id);
    } else {
      await deleteTelegramLog(Number(id));
    }

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting telegram log:', error);
    res.status(500).json({ error: '删除Telegram日志失败' });
  }
} 