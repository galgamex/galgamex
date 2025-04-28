import prisma from "@/lib/prisma"; // 导入 Prisma 客户端
import { Article } from "@/types/article"; // 导入自定义 Article 类型
import { Status, Type } from "@prisma/client";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import CategoryClient from "./CategoryClient";

// 参数类型定义
type Params = { params: { id: string; locale: string }; searchParams: { page?: string; size?: string } };

// 检查 Prisma 客户端连接是否正常
async function checkPrismaConnection() {
  try {
    // 尝试执行一个简单的查询
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Prisma 连接错误:", error);
    return false;
  }
}

// 缓存获取分类数据的函数
const getCategoryDataCached = unstable_cache(
  async (id: string) => {
    try {
      // 从数据库获取分类数据
      const category = await prisma.category.findUnique({
        where: { id: parseInt(id) },
      });

      if (!category) {
        throw new Error(`找不到ID为 ${id} 的分类`);
      }

      return category;
    } catch (error) {
      console.error("获取分类数据失败:", error);
      // 获取失败时返回模拟数据
      return getCategoryDataMock(id);
    }
  },
  ["category-data"],
  { revalidate: 3600 } // 缓存1小时
);

// 缓存获取标签的函数
const getTagsCached = unstable_cache(
  async () => {
    try {
      console.log('尝试从数据库获取标签列表...');

      // 从数据库中获取所有标签
      const tags = await prisma.tag.findMany({
        orderBy: {
          articles: 'desc', // 按文章数量排序
        },
        take: 30, // 限制获取数量，避免过多
      });

      console.log(`获取到 ${tags.length} 个标签`);

      // 检查是否获取到标签
      if (!tags || tags.length === 0) {
        console.log('未找到标签，使用默认标签');
        return getDefaultTags();
      }

      // 将标签名称提取为数组，并添加"全部"选项
      return ["全部", ...tags.map((tag) => tag.name)];
    } catch (error) {
      console.error("获取标签失败:", error);
      // 发生错误时返回默认标签
      return getDefaultTags();
    }
  },
  ["all-tags"],
  { revalidate: 3600 } // 缓存1小时
);

// 生成元数据函数（用于SEO）
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  // 确保params已经解析完成
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;

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
  try {
    // 从数据库获取分类数据
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!category) {
      throw new Error(`找不到ID为 ${id} 的分类`);
    }

    return category;
  } catch (error) {
    console.error("获取分类数据失败:", error);
    // 获取失败时返回模拟数据
    return getCategoryDataMock(id);
  }
}

// 模拟分类数据函数 - 作为备份
function getCategoryDataMock(id: string) {
  return {
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
}

// 获取文章列表函数（已优化查询性能）
async function getArticles(categoryId: string, page: number = 1, pageSize: number = 12) {
  try {
    console.log(`尝试从数据库获取分类 ${categoryId} 的文章...`);

    // 使用一个高效的查询获取计数和分页数据
    const [totalCount, articlesData] = await Promise.all([
      // 获取总数
      prisma.article.count({
        where: {
          categoryId: parseInt(categoryId),
          status: Status.PUBLISH
        }
      }),

      // 获取分页文章数据（优化查询，仅获取必要字段和关联）
      prisma.article.findMany({
        where: {
          categoryId: parseInt(categoryId),
          status: Status.PUBLISH
        },
        include: {
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              avatar: true,
              icon: true
            }
          },
          // 只选择必要的下载字段，减少数据量
          download: {
            select: {
              id: true,
              type: true,
              url: true,
              code: true,
              unzipCode: true
            }
          },
          // 只选择必要的作者字段
          author: {
            select: {
              id: true,
              username: true,
              nickname: true,
              avatar: true
            }
          },
          // 只选择必要的发行商字段
          publisher: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          // 只选择必要的开发商字段
          developer: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          // 只选择必要的角色字段
          character: {
            select: {
              id: true,
              name: true,
              nameJp: true,
              avatar: true,
              isMain: true,
              isHeroine: true
            }
          }
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: 'desc'
        }
      })
    ]);

    console.log(`找到 ${totalCount} 篇符合条件的文章`);
    console.log(`成功获取 ${articlesData.length} 篇文章数据`);

    // 如果没有找到文章，直接使用模拟数据
    if (totalCount === 0 || !articlesData || articlesData.length === 0) {
      console.log('未找到文章或文章数据为空，使用模拟数据');
      return getArticlesMock(categoryId, page, pageSize);
    }

    // 转换为自定义 Article 类型
    const articles = articlesData as unknown as Article[];

    // 计算总页数
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      articles,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages,
        totalItems: totalCount
      }
    };
  } catch (error) {
    console.error("获取文章列表失败:", error);
    // 发生错误时返回模拟数据
    return getArticlesMock(categoryId, page, pageSize);
  }
}

// 模拟数据函数 - 作为备份
async function getArticlesMock(categoryId: string, page: number = 1, pageSize: number = 12) {
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
    status: Status.PUBLISH,
    stage: i % 3 === 0 ? "R18" : i % 3 === 1 ? "R15" : "SFW" as any,
    isTop: i < 3, // 前3个为置顶
    isHot: i % 5 === 0, // 每5个一个热门
    categoryId: parseInt(categoryId),
    authorId: (i % 10) + 1,
    comments: 30 + i * 2,
    views: 200 + i * 20,
    likes: 100 + i * 10,
    downloads: 50 + i * 3, // 下载次数
    type: Type.ARTICLE,
    // 额外字段（根据schema）
    originalTitle: `Original Title ${i + 1}`,
    releaseDate: `2024-${(i % 12) + 1}-${(i % 28) + 1}`,
    developerId: (i % 5) + 1,
    publisherId: (i % 5) + 1,
    rating: Math.floor(Math.random() * 5) + 1,
    favorites: 50 + i * 5,
    shares: 20 + i * 2,
    reviewCount: 15 + i,
    videos: i % 2 === 0 ? "https://example.com/video.mp4" : "",
    createdAt: new Date(2024, i % 12, (i % 28) + 1),
    updatedAt: new Date(2024, i % 12, (i % 28) + 1),

    // 关联
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
    publisher: {
      id: (i % 5) + 1,
      name: `发行商 ${i % 5 + 1}`,
      description: `发行商${i % 5 + 1}的简介`,
      avatar: "https://t.alcy.cc/pc",
      website: "https://example.com",
      createdAt: new Date(2024, i % 12, (i % 28) + 1),
      updatedAt: null
    },
    developer: {
      id: (i % 5) + 1,
      name: `开发商 ${i % 5 + 1}`,
      description: `开发商${i % 5 + 1}的简介`,
      avatar: "https://t.alcy.cc/pc",
      website: "https://example.com",
      createdAt: new Date(2024, i % 12, (i % 28) + 1),
      updatedAt: null
    },
    tags: Array.from({ length: (i % 3) + 1 }, (_, j) => ({
      articleId: i + 1,
      tagId: j + 1,
      tag: {
        id: j + 1,
        name: ["R18", "全年龄", "科幻", "奇幻", "校园", "恋爱", "悬疑"][(i + j) % 7],
        alias: null,
        slug: null,
        avatar: null,
        articles: 20 + (i + j) * 3,
        createdAt: new Date(2023, 1, 1),
        updatedAt: new Date(2023, 1, 1),
        categoryId: parseInt(categoryId)
      }
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
      count: Math.floor(Math.random() * 100),
      createdAt: new Date(2024, i % 12, (i % 28) + 1),
      updatedAt: null
    })),
    // 添加其他关联
    author: {
      id: (i % 10) + 1,
      username: `user${(i % 10) + 1}`,
      nickname: `用户${(i % 10) + 1}`,
      email: `user${(i % 10) + 1}@example.com`,
      password: "hashed_password",
      avatar: "https://t.alcy.cc/pc",
      articles: 10 + i,
      comments: 20 + i,
      likes: 30 + i,
      role: "USER" as any,
      ip: "127.0.0.1",
      createdAt: new Date(2023, 0, 1),
      updatedAt: null,
      lastLogin: new Date(2024, i % 12, (i % 28) + 1)
    },
    // 添加角色
    character: Array.from({ length: Math.min((i % 4) + 1, 4) }, (_, j) => ({
      id: j + 1 + i * 4,
      name: `角色 ${j + 1}`,
      nameJp: `キャラクター ${j + 1}`,
      avatar: "https://t.alcy.cc/pc",
      images: JSON.stringify(["https://t.alcy.cc/pc", "https://t.alcy.cc/pc"]),
      description: `这是角色${j + 1}的描述`,
      cv: `配音员 ${j + 1}`,
      cvJp: `声優 ${j + 1}`,
      traits: JSON.stringify(["活泼", "可爱"]),
      birthday: `${(j % 12) + 1}月${(j % 28) + 1}日`,
      height: `${150 + j * 5}cm`,
      weight: `${40 + j * 2}kg`,
      age: `${16 + j}岁`,
      hobby: JSON.stringify(["读书", "游戏"]),
      isMain: j === 0,
      isHeroine: j === 1,
      articleId: i + 1,
      createdAt: new Date(2023, 0, 1),
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

// 获取标签列表函数
async function getTags() {
  try {
    console.log('尝试从数据库获取标签列表...');

    // 从数据库中获取所有标签
    const tags = await prisma.tag.findMany({
      orderBy: {
        articles: 'desc', // 按文章数量排序
      },
      take: 30, // 限制获取数量，避免过多
    });

    console.log(`获取到 ${tags.length} 个标签`);

    // 检查是否获取到标签
    if (!tags || tags.length === 0) {
      console.log('未找到标签，使用默认标签');
      return getDefaultTags();
    }

    // 将标签名称提取为数组，并添加"全部"选项
    return ["全部", ...tags.map((tag) => tag.name)];
  } catch (error) {
    console.error("获取标签失败:", error);
    // 发生错误时返回默认标签
    return getDefaultTags();
  }
}

// 获取默认标签函数
function getDefaultTags() {
  return ["全部", "纯爱", "暴虐", "科幻", "奇幻", "日常", "治愈", "较黑", "猎奇", "血腥", "校园", "百合", "伪娘", "后宫", "侦探", "音乐"];
}

// 修改筛选选项数据获取方式（使用缓存）
async function getFilterOptions() {
  const tags = await getTagsCached();

  // 生成年份数组（自动生成而不是硬编码）
  const currentYear = new Date().getFullYear();
  const years = ["全部"];
  for (let i = currentYear + 1; i >= 1998; i--) {
    years.push(i.toString());
  }

  return {
    years: years,
    tags: tags,
    platforms: ["全部", "PC", "安卓", "KRKR"],
    ratings: ["全部", "R18", "全年龄"]
  };
}

// 主页面组件（服务器组件）
export default async function CategoryPage({ params, searchParams }: Params) {
  // 确保params和searchParams已经解析完成
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const { id } = resolvedParams;
  const page = parseInt(resolvedSearchParams.page || "1");
  const pageSize = parseInt(resolvedSearchParams.size || "12");

  // 检查数据库连接
  const isPrismaConnected = await checkPrismaConnection();

  // 如果数据库连接有问题，直接使用模拟数据
  let categoryData, articlesData, filterOptions;

  if (isPrismaConnected) {
    // 并行获取分类数据、文章列表和筛选选项
    [categoryData, articlesData, filterOptions] = await Promise.all([
      getCategoryDataCached(id), // 使用缓存的函数
      getArticles(id, page, pageSize),
      getFilterOptions()
    ]);
  } else {
    console.log("使用模拟数据作为备份");
    // 使用所有的模拟数据
    categoryData = getCategoryDataMock(id);
    articlesData = await getArticlesMock(id, page, pageSize);
    filterOptions = {
      years: ["全部", "2025", "2024", "2023", "2022", "2021", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", "2006", "2005", "2004", "2003", "2002", "2001", "2000", "1999", "1998"],
      tags: getDefaultTags(),
      platforms: ["全部", "PC", "安卓", "KRKR"],
      ratings: ["全部", "R18", "全年龄"]
    };
  }

  // 服务器端渲染分类的基本信息（对SEO友好）
  return (
    <div className="container mx-auto px-4">
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
