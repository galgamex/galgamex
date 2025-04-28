// 服务器组件，不使用"use client"
import prisma from "@/lib/prisma";
import { findArticle } from "@/model/article";
import { Metadata } from "next";
import GameDetailClient from "./GameDetailClient";

// 1定义 Params 类型（用 Promise 包装）
type Params = {
  params: Promise<{ id: number }>;
};

// 生成元数据函数（用于SEO）
export async function generateMetadata({
  params
}: Params): Promise<Metadata> {
  const { id } = await params;

  // 获取游戏数据
  const gameData = await prisma.article.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
      author: true,
      tags: true,
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
      images: [{ url: "https://t.alcy.cc/pc", alt: gameData?.title ?? '' }],
      type: 'article',
    },
  };
}


// 主页面组件（服务器组件）
export default async function ArticleDetailPage({ params }: Params) {
  const { id } = await params;
  const gameData = await findArticle({
    id: Number(id),
  });

  // 服务器端渲染游戏的基本信息（对SEO友好）
  return <GameDetailClient gameData={gameData} />;
}
