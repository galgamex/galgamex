import {
  createDownloadLog,
  deleteDownloadLog,
  findDownloadLog,
  findDownloadLogCount,
  findDownloadLogs,
  getHotDownloads,
  logDownload
} from '@/model/game/download-log';
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
  const { id, downloadId, userId, articleId, hot, ...query } = req.query;

  // 获取热门下载
  if (hot === 'true') {
    const days = Number(query.days) || 7;
    const limit = Number(query.limit) || 10;
    
    const hotDownloads = await getHotDownloads(days, limit);
    return res.status(200).json(hotDownloads);
  }

  // 获取单个下载记录
  if (id) {
    const downloadLog = await findDownloadLog(Number(id));
    if (!downloadLog) {
      return res.status(404).json({ error: '下载记录不存在' });
    }
    return res.status(200).json(downloadLog);
  }

  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 10), 50);
  delete query.page;
  delete query.limit;

  // 构建查询条件
  const where: Prisma.DownloadLogWhereInput = {};
  
  if (downloadId) where.downloadId = Number(downloadId);
  if (userId) where.userId = Number(userId);
  if (articleId) where.articleId = Number(articleId);
  
  // 状态筛选
  if (query.status !== undefined) {
    where.status = query.status === 'true';
  }
  
  // 下载类型筛选
  if (query.downloadType) {
    where.downloadType = String(query.downloadType);
  }
  
  // IP筛选
  if (query.ip) {
    where.ip = String(query.ip);
  }
  
  // 日期范围筛选
  if (query.startDate && query.endDate) {
    where.createdAt = {
      gte: new Date(String(query.startDate)),
      lte: new Date(String(query.endDate))
    };
  }

  // 获取下载记录列表
  const [downloadLogs, total] = await Promise.all([
    findDownloadLogs(where, page, limit),
    findDownloadLogCount(where)
  ]);

  res.status(200).json({
    data: downloadLogs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { 
    downloadId, 
    userId, 
    articleId,
    ip, 
    ua, 
    referer, 
    downloadType,
    status,
    remark 
  } = req.body;

  // 验证必要字段
  if (!downloadId) {
    return res.status(400).json({
      error: '下载ID为必填项'
    });
  }

  try {
    // 记录下载
    const downloadLog = await logDownload(Number(downloadId), {
      userId: userId ? Number(userId) : undefined,
      articleId: articleId ? Number(articleId) : undefined,
      ip,
      ua,
      referer,
      downloadType,
      status: status !== undefined ? status : true,
      remark
    });

    res.status(201).json(downloadLog);
  } catch (error) {
    console.error('Error logging download:', error);
    res.status(500).json({ error: '记录下载失败' });
  }
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: '下载记录ID为必填项' });
  }

  try {
    await deleteDownloadLog(Number(id));
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting download log:', error);
    res.status(500).json({ error: '删除下载记录失败' });
  }
} 