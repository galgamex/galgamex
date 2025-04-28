import { Status, Type } from "@prisma/client";
import { Metadata } from "next";
import CategoryClient from "./CategoryClient";

// 参数类型定义
type Params = { params: { id: string; locale: string }; searchParams: { page?: string; size?: string } };

// 生成元数据函数（用于SEO）
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = params;

  // 获取分类数据
  const categoryData = await getCategoryData(id);

  return {
    title: `${categoryData.name} | 春风之恋 - 游戏分类`,
    description: `浏览${categoryData.name}分类下的全部游戏，包含${categoryData.articles}个游戏作品。`,
    openGraph: {
      title: `${categoryData.name} - 游戏分类`,
      description: `浏览${categoryData.name}分类下的全部游戏，包含${categoryData.articles}个游戏作品。`,
      images: [{ url: categoryData.avatar || "https://t.alcy.cc/pc", alt: categoryData.name }],
      type: 'website',
    },
  };
}

// 获取分类数据函数
async function getCategoryData(id: string) {
  // 实际项目中，这里应该调用API或数据库获取分类数据
  // 为了演示，我们使用模拟数据
  const categoryData = {
    id: parseInt(id),
    name: ["Galgame", "RPG", "AVG", "ADV", "SLG"][parseInt(id) % 5] || "游戏分类",
    alias: `category-${id}`,
    slug: `category-${id}`,
    avatar: "https://t.alcy.cc/pc",
    icon: ["game", "rpg", "avg", "adv", "slg"][parseInt(id) % 5] || "game",
    parentId: null,
    articles: 50 + parseInt(id) * 5,
    type: Type.ARTICLE,
    authorId: null,
    layout: "SQUARE",
    createdAt: new Date(2023, 1, 1),
    updatedAt: null
  };

  return categoryData;
}

// 获取文章列表函数
async function getArticles(categoryId: string, page: number = 1, pageSize: number = 12) {
  // 实际项目中，这里应该调用API或数据库获取文章列表
  // 模拟数据 - 生成总共50篇文章
  const totalArticles = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `游戏标题 ${i + 1}`,
    content: `这是游戏${i + 1}的详细内容描述`,
    summary: `游戏${i + 1}的简短介绍，包含关键特点和亮点`,
    cover: "https://t.alcy.cc/pc",
    avatar: "https://t.alcy.cc/pc",
    images: "https://t.alcy.cc/pc",
    size: `${(i % 5) + 1}GB`,
    likes: 100 + i * 10,
    views: 200 + i * 20,
    comments: 30 + i * 2,
    isTop: i < 3, // 前3个为置顶
    isHot: i % 5 === 0, // 每5个一个热门
    status: Status.PUBLISH,
    stage: i % 3 === 0 ? "R18" : i % 3 === 1 ? "R15" : "SFW" as any,
    type: Type.ARTICLE,
    categoryId: parseInt(categoryId),
    authorId: (i % 10) + 1,
    createdAt: new Date(2024, i % 12, (i % 28) + 1),
    updatedAt: new Date(2024, i % 12, (i % 28) + 1),
    category: {
      id: parseInt(categoryId),
      name: ["Galgame", "RPG", "AVG", "ADV", "SLG"][parseInt(categoryId) % 5] || "游戏分类",
      alias: null,
      slug: null,
      avatar: "https://t.alcy.cc/pc",
      icon: ["game", "rpg", "avg", "adv", "slg"][parseInt(categoryId) % 5] || "game",
      parentId: null,
      articles: 50 + parseInt(categoryId) * 5,
      type: Type.ARTICLE,
      authorId: null,
      layout: "SQUARE" as any,
      createdAt: new Date(2023, 1, 1),
      updatedAt: null
    },
    tag: Array.from({ length: (i % 3) + 1 }, (_, j) => ({
      id: j + 1,
      name: ["R18", "全年龄", "科幻", "奇幻", "校园", "恋爱", "悬疑"][(i + j) % 7],
      alias: null,
      slug: null,
      avatar: null,
      articles: 20 + (i + j) * 3,
      createdAt: new Date(2023, 1, 1),
      updatedAt: new Date(2023, 1, 1),
      categoryId: parseInt(categoryId)
    })),
    download: Array.from({ length: Math.min((i % 3) + 1, 3) }, (_, j) => ({
      id: j + 1 + i * 3,
      type: ["BAIDU", "DIRECT", "MEGA", "ONEDRIVE"][(i + j) % 4] as any,
      url: `https://example.com/download/${i + 1}/${j + 1}`,
      articleId: i + 1,
      authorId: (i % 10) + 1,
      status: Status.PUBLISH,
      code: j === 0 ? "abcd" : null,
      unzipCode: j === 0 ? "1234" : null,
      createdAt: new Date(2024, i % 12, (i % 28) + 1),
      updatedAt: null
    }))
  }));

  // 计算分页
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedArticles = totalArticles.slice(startIndex, endIndex);
  const totalPages = Math.ceil(totalArticles.length / pageSize);

  return {
    articles: paginatedArticles,
    pagination: {
      currentPage: page,
      pageSize,
      totalPages,
      totalItems: totalArticles.length
    }
  };
}

// 筛选选项数据
const filterOptions = {
  years: ["全部", "2025", "2024", "2023", "2022", "2021", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", "2006", "2005", "2004", "2003", "2002", "2001", "2000", "1999", "1998"],
  types: ["全部", "纯爱", "暴虐", "科幻", "奇幻", "日常", "治愈", "较黑", "猎奇", "血腥", "校园", "百合", "伪娘", "后宫", "侦探", "音乐"],
  platforms: ["全部", "PC", "安卓", "KRKR"],
  ratings: ["全部", "R18", "全年龄"]
};

// 主页面组件（服务器组件）
export default async function CategoryPage({ params, searchParams }: Params) {
  const { id } = params;
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.size || "12");

  // 并行获取分类数据和文章列表
  const [categoryData, articlesData] = await Promise.all([
    getCategoryData(id),
    getArticles(id, page, pageSize)
  ]);

  // 服务器端渲染分类的基本信息（对SEO友好）
  return (
    <div className="container mx-auto px-4">
      {/* 分类标题和描述 - 增强SEO */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{categoryData.name}</h1>
        <p className="text-gray-500">共 {categoryData.articles} 个游戏作品</p>
      </div>

      {/* 客户端组件负责交互功能 */}
      <CategoryClient
        articles={articlesData.articles}
        pagination={articlesData.pagination}
        filterOptions={filterOptions}
        categoryId={id}
      />
    </div>
  );
}
