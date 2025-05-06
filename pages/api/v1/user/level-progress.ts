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
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
}

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const { userId, ...query } = req.query;
  
  if (userId) {
    // 查询单个用户的等级进度
    const userLevelProgress = await prisma.userLevelProgress.findUnique({
      where: { userId: Number(userId) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true
          }
        }
      }
    });
    
    if (!userLevelProgress) {
      return res.status(404).json({ error: '用户等级进度不存在' });
    }
    
    // 获取当前等级和下一等级的信息
    const [currentLevel, nextLevel] = await Promise.all([
      prisma.userLevel.findFirst({
        where: { level: userLevelProgress.currentLevel }
      }),
      prisma.userLevel.findFirst({
        where: { level: userLevelProgress.currentLevel + 1 }
      })
    ]);
    
    // 如果需要包含等级记录
    if (query.includeLogs === 'true') {
      const levelLogs = await prisma.levelLog.findMany({
        where: { userId: Number(userId) },
        orderBy: { createdAt: 'desc' },
        take: Number(query.limit) || 20
      });
      
      return res.status(200).json({
        ...userLevelProgress,
        currentLevelDetails: currentLevel,
        nextLevelDetails: nextLevel,
        logs: levelLogs
      });
    }
    
    return res.status(200).json({
      ...userLevelProgress,
      currentLevelDetails: currentLevel,
      nextLevelDetails: nextLevel
    });
  }
  
  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 10), 50);
  
  // 构建查询条件
  const where = buildWhereCondition(query);
  
  // 查询用户等级进度列表
  const [userLevelProgress, total] = await Promise.all([
    prisma.userLevelProgress.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: query.orderBy === 'level' 
        ? { currentLevel: 'desc' } 
        : { updatedAt: 'desc' }
    }),
    prisma.userLevelProgress.count({ where })
  ]);
  
  res.status(200).json({
    data: userLevelProgress,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { userId, initialLevel, initialExp } = req.body;
  
  if (!userId) {
    return res.status(400).json({
      error: '用户ID为必填项'
    });
  }
  
  // 查找用户
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    return res.status(404).json({
      error: '用户不存在'
    });
  }
  
  // 检查是否已存在进度记录
  const existingProgress = await prisma.userLevelProgress.findUnique({
    where: { userId }
  });
  
  if (existingProgress) {
    return res.status(409).json({
      error: '用户已有等级进度记录，请使用PUT方法更新'
    });
  }
  
  // 查找初始等级信息
  const level = await prisma.userLevel.findFirst({
    where: { level: initialLevel || 1 }
  });
  
  if (!level) {
    return res.status(404).json({
      error: '等级信息不存在'
    });
  }
  
  // 创建用户等级进度
  const userLevelProgress = await prisma.userLevelProgress.create({
    data: {
      userId,
      currentLevel: level.level,
      currentExp: initialExp || 0,
      totalExp: initialExp || 0
    }
  });
  
  // 创建等级变更记录
  await prisma.levelLog.create({
    data: {
      userId,
      oldLevel: 0,
      newLevel: level.level,
      description: '初始化用户等级'
    }
  });
  
  res.status(201).json(userLevelProgress);
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;
  const { addExp, newLevel, description } = req.body;
  
  if (!userId) {
    return res.status(400).json({
      error: '用户ID为必填项'
    });
  }
  
  // 查找用户等级进度
  const userLevelProgress = await prisma.userLevelProgress.findUnique({
    where: { userId: Number(userId) }
  });
  
  if (!userLevelProgress) {
    return res.status(404).json({
      error: '用户等级进度不存在，请先创建'
    });
  }
  
  try {
    const result = await prisma.$transaction(async (prisma: typeof import('@/lib/prisma').default) => {
      let updatedProgress = userLevelProgress;
      let levelChanged = false;
      let oldLevel = userLevelProgress.currentLevel;
      
      // 如果传入了newLevel，直接设置新等级
      if (newLevel !== undefined) {
        // 查找目标等级信息
        const levelInfo = await prisma.userLevel.findFirst({
          where: { level: Number(newLevel) }
        });
        
        if (!levelInfo) {
          throw new Error('目标等级不存在');
        }
        
        // 只有等级变化时才更新
        if (Number(newLevel) !== userLevelProgress.currentLevel) {
          levelChanged = true;
          
          updatedProgress = await prisma.userLevelProgress.update({
            where: { userId: Number(userId) },
            data: {
              currentLevel: Number(newLevel),
              currentExp: 0
            }
          });
          
          // 记录等级变更
          await prisma.levelLog.create({
            data: {
              userId: Number(userId),
              oldLevel,
              newLevel: Number(newLevel),
              description: description || `用户等级从${oldLevel}变更为${newLevel}`
            }
          });
        }
      } 
      // 如果传入了addExp，增加经验值并检查是否升级
      else if (addExp) {
        const expAmount = Number(addExp);
        
        // 获取所有等级信息，用于判断升级
        const levels = await prisma.userLevel.findMany({
          orderBy: { level: 'asc' }
        });
        
        // 没有等级信息，无法处理
        if (levels.length === 0) {
          throw new Error('系统中没有等级信息');
        }
        
        // 更新总经验值
        let updatedTotalExp = userLevelProgress.totalExp + expAmount;
        let updatedCurrentExp = userLevelProgress.currentExp + expAmount;
        let updatedCurrentLevel = userLevelProgress.currentLevel;
        
        // 找到当前等级信息
        const currentLevelInfo = levels.find((l: {level: number}) => l.level === updatedCurrentLevel);
        
        // 查找下一个等级
        const nextLevelIndex = levels.findIndex((l: {level: number}) => l.level === updatedCurrentLevel) + 1;
        let nextLevelInfo = nextLevelIndex < levels.length ? levels[nextLevelIndex] : null;
        
        // 如果有下一级且经验值满足升级条件，则升级
        while (nextLevelInfo && updatedTotalExp >= nextLevelInfo.pointsRequired) {
          levelChanged = true;
          oldLevel = updatedCurrentLevel;
          updatedCurrentLevel = nextLevelInfo.level;
          updatedCurrentExp = 0; // 升级后经验清零
          
          // 记录升级日志
          await prisma.levelLog.create({
            data: {
              userId: Number(userId),
              oldLevel,
              newLevel: updatedCurrentLevel,
              description: description || `获得${expAmount}经验，等级从${oldLevel}升级到${updatedCurrentLevel}`
            }
          });
          
          // 获取下一个等级信息
          const nextIndex = levels.findIndex((l: {level: number}) => l.level === updatedCurrentLevel) + 1;
          nextLevelInfo = nextIndex < levels.length ? levels[nextIndex] : null;
        }
        
        // 更新用户等级进度
        updatedProgress = await prisma.userLevelProgress.update({
          where: { userId: Number(userId) },
          data: {
            currentLevel: updatedCurrentLevel,
            currentExp: updatedCurrentExp,
            totalExp: updatedTotalExp
          }
        });
        
        // 如果只增加了经验但没有升级，也记录日志
        if (!levelChanged && expAmount > 0) {
          await prisma.levelLog.create({
            data: {
              userId: Number(userId),
              oldLevel: updatedCurrentLevel,
              newLevel: updatedCurrentLevel,
              expGained: expAmount,
              description: description || `获得${expAmount}经验`
            }
          });
        }
      }
      
      return updatedProgress;
    });
    
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : '更新等级失败';
    res.status(400).json({ error: message });
  }
}

// 构建查询条件
function buildWhereCondition(query: any) {
  const where: any = {};
  
  // 根据等级筛选
  if (query.level) {
    where.currentLevel = Number(query.level);
  }
  
  if (query.minLevel) {
    where.currentLevel = { gte: Number(query.minLevel) };
  }
  
  if (query.maxLevel) {
    where.currentLevel = { ...(where.currentLevel || {}), lte: Number(query.maxLevel) };
  }
  
  // 根据经验值筛选
  if (query.minExp) {
    where.totalExp = { gte: Number(query.minExp) };
  }
  
  if (query.maxExp) {
    where.totalExp = { ...(where.totalExp || {}), lte: Number(query.maxExp) };
  }
  
  // 如果有用户名搜索，需要联表查询
  if (query.username) {
    where.user = {
      username: { contains: query.username }
    };
  }
  
  if (query.nickname) {
    where.user = {
      ...(where.user || {}),
      nickname: { contains: query.nickname }
    };
  }
  
  return where;
} 