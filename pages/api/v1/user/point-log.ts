import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id, userId, type, page = '1', limit = '10' } = req.query;

    // 获取单个积分记录
    if (id) {
      try {
        const pointLog = await prisma.pointLog.findUnique({
          where: { id: Number(id) }
        });

        if (!pointLog) {
          return res.status(404).json({ error: '积分记录不存在' });
        }

        return res.status(200).json(pointLog);
      } catch (error) {
        console.error('Error fetching point log:', error);
        return res.status(500).json({ error: '获取积分记录失败' });
      }
    }

    // 验证用户ID
    if (!userId) {
      return res.status(400).json({ error: '用户ID为必填项' });
    }

    // 分页参数
    const pageNum = parseInt(Array.isArray(page) ? page[0] : page, 10);
    const limitNum = parseInt(Array.isArray(limit) ? limit[0] : limit, 10);
    const skip = (pageNum - 1) * limitNum;

    try {
      // 使用原始SQL查询避免枚举类型问题，适配MySQL
      const pointLogs = await prisma.$queryRawUnsafe(`
        SELECT * FROM PointLog
        WHERE userId = ${Number(userId)}
        ${type ? `AND type = '${String(type)}'` : ''}
        ORDER BY createdAt DESC
        LIMIT ${limitNum} OFFSET ${skip}
      `);
      
      // 查询总记录数
      const countResult = await prisma.$queryRawUnsafe(`
        SELECT COUNT(*) as total FROM PointLog
        WHERE userId = ${Number(userId)}
        ${type ? `AND type = '${String(type)}'` : ''}
      `);
      
      const total = parseInt(String(countResult[0].total), 10);

      // 返回结果
      return res.status(200).json({
        data: pointLogs,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    } catch (error) {
      console.error('Error querying point logs:', error);
      return res.status(500).json({ 
        error: '数据库查询错误', 
        details: error instanceof Error ? error.message : '未知错误' 
      });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
}

// 构建查询条件
function buildWhereCondition(query: any) {
  const where: any = {};
  
  // 用户ID筛选
  if (query.userId) {
    where.userId = Number(query.userId);
  }
  
  // 积分类型筛选 - 注释掉防止enum错误
  // if (query.type) {
  //   where.type = query.type as string;
  // }
  
  // 积分变化筛选
  if (query.minPoints) {
    where.amount = { gte: Number(query.minPoints) };
  }
  
  if (query.maxPoints) {
    where.amount = { ...(where.amount || {}), lte: Number(query.maxPoints) };
  }
  
  // 判断是否为增加或减少积分
  if (query.isPositive === 'true') {
    where.amount = { gt: 0 };
  } else if (query.isPositive === 'false') {
    where.amount = { lt: 0 };
  }
  
  // 日期范围筛选
  if (query.startDate) {
    where.createdAt = { gte: new Date(query.startDate as string) };
  }
  
  if (query.endDate) {
    where.createdAt = { 
      ...(where.createdAt || {}), 
      lte: new Date(query.endDate as string) 
    };
  }
  
  // 描述关键字搜索
  if (query.keyword) {
    where.description = { contains: query.keyword };
  }
  
  return where;
} 