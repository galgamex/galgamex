import {
  createCategory,
  deleteCategory,
  findCategories,
  findCategory,
  findCategoryCount,
  updateCategory
} from '@/model/category';
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

  // 获取单个分类
  if (id) {
    const category = await findCategory({ id: Number(id) });
    if (!category) {
      return res.status(404).json({ error: '分类不存在' });
    }
    return res.status(200).json(category);
  }

  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 20), 100);
  delete query.page;
  delete query.limit;

  // 是否获取树形结构
  const isTree = query.isTree === 'true';
  delete query.isTree;

  // 获取分类列表
  const where = buildWhereCondition<Prisma.CategoryWhereInput>(query);

  // 如果请求树形结构，只获取顶级分类
  if (isTree) {
    where.parentId = null;
  }

  const [categories, total] = await Promise.all([
    findCategories(where),
    findCategoryCount(where)
  ]);

  res.status(200).json({
    data: categories,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const categoryData: Prisma.CategoryCreateInput = req.body;

  // 验证必要字段
  if (!categoryData.name) {
    return res.status(400).json({
      error: '分类名称为必填项'
    });
  }

  // 检查分类名是否已存在
  const existingCategory = await findCategory({
    OR: [
      { name: categoryData.name },
      { alias: categoryData.alias },
      { slug: categoryData.slug }
    ]
  });

  if (existingCategory) {
    return res.status(409).json({
      error: '分类名称、别名或Slug已被使用'
    });
  }

  const category = await createCategory(categoryData);
  res.status(201).json(category);
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const categoryData = req.body;

  if (!id) {
    return res.status(400).json({ error: '分类ID为必填项' });
  }

  // 检查分类名是否被其他分类使用
  if (categoryData.name || categoryData.alias || categoryData.slug) {
    const conditions = [];
    if (categoryData.name) conditions.push({ name: categoryData.name });
    if (categoryData.alias) conditions.push({ alias: categoryData.alias });
    if (categoryData.slug) conditions.push({ slug: categoryData.slug });

    const existingCategory = await findCategory({
      AND: [
        { OR: conditions },
        { NOT: { id: Number(id) } }
      ]
    });

    if (existingCategory) {
      return res.status(409).json({
        error: '分类名称、别名或Slug已被使用'
      });
    }
  }

  // 防止循环引用
  if (categoryData.parentId && Number(categoryData.parentId) === Number(id)) {
    return res.status(400).json({
      error: '分类不能作为自己的父分类'
    });
  }

  const category = await updateCategory(
    { id: Number(id) },
    categoryData
  );

  res.status(200).json(category);
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: '分类ID为必填项' });
  }

  // 检查是否有子分类
  const childrenCount = await findCategoryCount({
    parentId: Number(id)
  });

  if (childrenCount > 0) {
    return res.status(400).json({
      error: '请先删除该分类下的子分类'
    });
  }

  await deleteCategory({ id: Number(id) });
  res.status(204).end();
}

// 构建查询条件
const buildWhereCondition = <T extends Prisma.CategoryWhereInput>(query: any): T => {
  const where = {} as T;

  // 基本字段过滤
  if (query.name) where.name = { contains: query.name } as any;
  if (query.alias) where.alias = { contains: query.alias } as any;
  if (query.slug) where.slug = { contains: query.slug } as any;
  if (query.parentId === 'null') {
    where.parentId = null as any;
  } else if (query.parentId) {
    where.parentId = Number(query.parentId) as any;
  }
  if (query.type) where.type = query.type as any;
  if (query.layout) where.layout = query.layout as any;
  if (query.authorId) where.authorId = Number(query.authorId) as any;

  // 日期范围过滤
  if (query.startDate && query.endDate) {
    where.createdAt = {
      gte: new Date(query.startDate),
      lte: new Date(query.endDate)
    } as any;
  }

  return where;
}; 