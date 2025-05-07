// 服务器组件，不使用"use client"
import prisma from "@/lib/prisma";
import { findArticle } from "@/model/content/article";
import { Article } from "@/types/article";
import { Metadata } from "next";
import GameDetailClient from "./GameDetailClient";

// 定义 Params 类型
type Params = {
  params: { id: string };
};

// 生成元数据函数（用于SEO）
export async function generateMetadata({
  params
}: Params): Promise<Metadata> {
  const { id } = params;

  // 获取游戏数据
  const gameData = await prisma.article.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
      author: true,
      tags: {
        include: {
          tag: true
        }
      },
      publisher: true,
      developer: true,
      character: true,
      download: true,
      recommendedTo: true,
      recommendedBy: true,
      downloadLogs: true,
      likeLog: true,
      gameSave: true,
      gamePatch: true,
    }
  })

  return {
    title: `${gameData?.title} | 春风之恋 - 游戏详情`,
    description: gameData?.content?.substring(0, 160), // 描述截取前160字符，使用content字段与数据库模型保持一致
    openGraph: {
      title: gameData?.title || '',
      description: gameData?.content?.substring(0, 160),
      images: [{ url: gameData?.avatar || "https://t.alcy.cc/pc", alt: gameData?.title ?? '' }],
      type: 'article',
    },
  };
}

// 获取分类路

// 主页面组件（服务器组件）
export default async function ArticleDetailPage({ params }: Params) {
  const { id } = params;
  
  // 使用model层函数获取包含所有关联数据的文章信息
  const gameData: Article = await findArticle({
    id: Number(id),
  }) as unknown as Article;

  // 如果没有找到游戏数据，显示错误信息
  if (!gameData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">游戏不存在或已被删除</h1>
      </div>
    );
  }

  // 服务器端渲染游戏的基本信息，将数据传递给客户端组件
  return <GameDetailClient gameData={gameData} />;
}
