import prisma from '@/lib/prisma';
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
  const { id, level, ...query } = req.query;
  
  if (id) {
    // 查询指定ID的等级
    const userLevel = await prisma.userLevel.findUnique({
      where: { id: Number(id) }
    });
    
    if (!userLevel) {
      return res.status(404).json({ error: '等级信息不存在' });
    }
    
    return res.status(200).json(userLevel);
  }
  
  if (level) {
    // 查询指定等级级别的信息
    const userLevel = await prisma.userLevel.findFirst({
      where: { level: Number(level) }
    });
    
    if (!userLevel) {
      return res.status(404).json({ error: '等级信息不存在' });
    }
    
    return res.status(200).json(userLevel);
  }
  
  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 10), 50);
  
  // 构建查询条件
  const where = buildWhereCondition(query);
  
  // 查询等级列表
  const [userLevels, total] = await Promise.all([
    prisma.userLevel.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { level: 'asc' }
    }),
    prisma.userLevel.count({ where })
  ]);
  
  res.status(200).json({
    data: userLevels,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { level, name, description, pointsRequired, benefits, iconUrl } = req.body;
  
  if (!level || !name || !pointsRequired) {
    return res.status(400).json({
      error: '等级、名称和所需积分为必填项'
    });
  }
  
  // 检查等级是否已存在
  const existingLevel = await prisma.userLevel.findFirst({
    where: { level: Number(level) }
  });
  
  if (existingLevel) {
    return res.status(409).json({
      error: '该等级已存在'
    });
  }
  
  const userLevel = await prisma.userLevel.create({
    data: {
      level: Number(level),
      name,
      description,
      pointsRequired: Number(pointsRequired),
      benefits,
      iconUrl
    }
  });
  
  res.status(201).json(userLevel);
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const updateData = req.body;
  
  if (!id) {
    return res.status(400).json({
      error: '等级ID为必填项'
    });
  }
  
  // 确保level是数字
  if (updateData.level) {
    updateData.level = Number(updateData.level);
  }
  
  // 确保pointsRequired是数字
  if (updateData.pointsRequired) {
    updateData.pointsRequired = Number(updateData.pointsRequired);
  }
  
  // 检查等级是否存在
  const userLevel = await prisma.userLevel.findUnique({
    where: { id: Number(id) }
  });
  
  if (!userLevel) {
    return res.status(404).json({
      error: '等级信息不存在'
    });
  }
  
  // 如果修改level，需要检查新level是否已存在
  if (updateData.level && updateData.level !== userLevel.level) {
    const existingLevel = await prisma.userLevel.findFirst({
      where: { 
        level: updateData.level,
        id: { not: Number(id) }
      }
    });
    
    if (existingLevel) {
      return res.status(409).json({
        error: '该等级已存在'
      });
    }
  }
  
  const updatedUserLevel = await prisma.userLevel.update({
    where: { id: Number(id) },
    data: updateData
  });
  
  res.status(200).json(updatedUserLevel);
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({
      error: '等级ID为必填项'
    });
  }
  
  // 检查等级是否存在
  const userLevel = await prisma.userLevel.findUnique({
    where: { id: Number(id) }
  });
  
  if (!userLevel) {
    return res.status(404).json({
      error: '等级信息不存在'
    });
  }
  
  // 检查是否有用户使用此等级
  const userCount = await prisma.userLevelProgress.count({
    where: { currentLevel: userLevel.level }
  });
  
  if (userCount > 0) {
    return res.status(409).json({
      error: `该等级正在被${userCount}个用户使用，无法删除`
    });
  }
  
  await prisma.userLevel.delete({
    where: { id: Number(id) }
  });
  
  res.status(200).json({ success: true, message: '等级已删除' });
}

// 构建查询条件
function buildWhereCondition(query: any) {
  const where: any = {};
  
  // 最小等级筛选
  if (query.minLevel) {
    where.level = { gte: Number(query.minLevel) };
  }
  
  // 最大等级筛选
  if (query.maxLevel) {
    where.level = { ...(where.level || {}), lte: Number(query.maxLevel) };
  }
  
  // 最小积分要求筛选
  if (query.minPointsRequired) {
    where.pointsRequired = { gte: Number(query.minPointsRequired) };
  }
  
  // 最大积分要求筛选
  if (query.maxPointsRequired) {
    where.pointsRequired = { ...(where.pointsRequired || {}), lte: Number(query.maxPointsRequired) };
  }
  
  // 名称关键字搜索
  if (query.keyword) {
    where.OR = [
      { name: { contains: query.keyword } },
      { description: { contains: query.keyword } },
      { benefits: { contains: query.keyword } }
    ];
  }
  
  return where;
} 