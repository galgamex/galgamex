import {
  createDownload,
  deleteDownload,
  findDownload,
  findDownloadCount,
  findDownloads,
  updateDownload
} from '@/model/game/download';

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

  // 获取单个下载
  if (id) {
    const download = await findDownload({ id: Number(id) });
    if (!download) {
      return res.status(404).json({ error: '下载资源不存在' });
    }
    return res.status(200).json(download);
  }

  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 10), 50);
  delete query.page;
  delete query.limit;

  // 获取下载列表
  const where = buildWhereCondition<Prisma.DownloadWhereInput>(query);
  const [downloads, total] = await Promise.all([
    findDownloads(where),
    findDownloadCount(where)
  ]);

  res.status(200).json({
    data: downloads,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const downloadData: Prisma.DownloadCreateInput = req.body;

  // 验证必要字段
  if (!downloadData.url) {
    return res.status(400).json({
      error: '下载链接为必填项'
    });
  }

  const download = await createDownload(downloadData);
  res.status(201).json(download);
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const downloadData = req.body;

  if (!id) {
    return res.status(400).json({ error: '下载ID为必填项' });
  }

  const download = await updateDownload({
    where: { id: Number(id) },
    data: downloadData
  });

  res.status(200).json(download);
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: '下载ID为必填项' });
  }

  await deleteDownload({ id: Number(id) });
  res.status(204).end();
}

// 构建查询条件
const buildWhereCondition = <T extends Prisma.DownloadWhereInput>(query: any): T => {
  const where = {} as T;

  // 基本字段过滤
  if (query.articleId) where.articleId = Number(query.articleId) as any;
  if (query.authorId) where.authorId = Number(query.authorId) as any;
  if (query.status) where.status = query.status as any;
  if (query.type) where.type = query.type as any;

  // 日期范围过滤
  if (query.startDate && query.endDate) {
    where.createdAt = {
      gte: new Date(query.startDate),
      lte: new Date(query.endDate)
    } as any;
  }

  return where;
}; 