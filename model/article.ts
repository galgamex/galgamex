import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * 根据唯一条件查询单篇文章（包含关联数据）
 * @param params 查询条件，需符合Prisma的ArticleWhereUniqueInput类型
 * @returns 包含完整关联数据的文章对象
 */
export const findArticle = async (params: Prisma.ArticleWhereUniqueInput) => {
  return prisma.article.findUnique(
    {
      where: params,
      include: {  // 包含所有关联模型数据
        author: true,      // 作者信息
        category: true,    // 分类信息
        tags: true,        // 标签列表
        publisher: true,   // 发布者信息
        developer: true,   // 开发者信息
        download: true,    // 下载信息
        feedback: true,    // 反馈信息
        gameSave: true,    // 游戏存档
        gamePatch: true,   // 游戏补丁
        recommendedTo: true, // 推荐给其他文章
        recommendedBy: true // 被其他文章推荐
      }
    }
  );
}

/**
 * 根据条件查询多篇文章（包含基本关联数据）
 * @param params 查询条件，需符合Prisma的ArticleWhereInput类型
 * @returns 文章列表（包含部分关联数据）
 */
export const findArticles = async (params: Prisma.ArticleWhereInput) => {
  return prisma.article.findMany(
    {
      where: params,
      include: {  // 包含基本关联模型数据
        author: true,
        category: true,
        tags: true,
        publisher: true,
        developer: true,
      }
    }
  )
}

/**
 * 根据条件统计文章数量
 * @param params 查询条件，需符合Prisma的ArticleWhereInput类型
 * @returns 符合条件的文章总数
 */
export const findArticlesCount = async (params: Prisma.ArticleWhereInput) => {
  return prisma.article.count({ where: params });
}

/**
 * 创建新文章
 * @param params 文章数据，包含所有字段和关联表
 * @returns 新创建的文章对象
 */
export const createArticle = async (params: Prisma.ArticleCreateInput) => {
  return prisma.article.create({
    data: params
  });
}

/**
 * 更新文章
 * @param params 包含where条件(唯一标识)和data(更新数据)的对象
 * @returns 更新后的文章对象
 */
export const updateArticle = async (params: {
  where: Prisma.ArticleWhereUniqueInput,
  data: Prisma.ArticleUpdateInput
}) => {
  const { where, data } = params;
  return prisma.article.update({ where, data });
}

/**
 * 删除文章
 * @param where 删除条件，需符合Prisma的ArticleWhereUniqueInput类型
 * @returns 被删除的文章对象
 */
export const deleteArticle = async (where: Prisma.ArticleWhereUniqueInput) => {
  return prisma.article.delete({ where });
}

