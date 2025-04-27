// 服务器组件，不使用"use client"
import { Metadata } from "next";
import GameDetailClient from "./GameDetailClient";

// 参数类型定义
type Params = { params: { id: string; locale: string } };

// 生成元数据函数（用于SEO）
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = params;

  // 获取游戏数据
  const gameData = await getGameData(id);

  return {
    title: `${gameData.title} | 春风之恋 - 游戏详情`,
    description: gameData.description.substring(0, 160), // 描述截取前160字符
    openGraph: {
      title: gameData.title,
      description: gameData.description.substring(0, 160),
      images: [{ url: "https://t.alcy.cc/pc", alt: gameData.title }],
      type: 'article',
    },
  };
}

// 获取游戏数据函数
async function getGameData(id: string) {
  // 实际项目中，这里应该调用API或数据库获取游戏数据
  // 为了演示，我们使用模拟数据
  const gameData = {
    id: 1,
    title: "春风之恋 ~樱花盛开的季节~",
    originalTitle: "春風の恋 ~桜咲く季節~",
    releaseDate: "2023-04-15",
    developer: "ChieriSoft",
    publisher: "ChieriSoft",
    rating: 9.3,
    description: '《春风之恋》是一款以日本校园为背景的恋爱模拟游戏。玩家将扮演主角在樱花盛开的季节里，邂逅各种性格迥异的女主角，发展出各自不同的故事线。游戏融合了精美的立绘、感人的剧情和丰富的选择支，带给玩家沉浸式的视觉小说体验。故事发生在一个名为"樱花坂"的虚构小镇，主角因各种原因转学至此，开始了全新的校园生活...',
    tags: ["校园恋爱", "视觉小说", "青春", "日常", "治愈", "情感", "轻喜剧", "文艺"],
    downloads: 1526,
    favorites: 328,
    shares: 89,
    views: 8754,
    reviewCount: 1256,
    videos: [
      {
        id: 1,
        title: "游戏预告片",
        thumbnail: "https://t.alcy.cc/pc",
        url: "https://example.com/video1.mp4",
        duration: "2:35"
      },
      {
        id: 2,
        title: "游戏演示",
        thumbnail: "https://t.alcy.cc/pc",
        url: "https://example.com/video2.mp4",
        duration: "5:47"
      }
    ],
    patches: [
      {
        id: 1,
        name: "春风之恋完整汉化补丁V1.0",
        translator: "樱花汉化组",
        date: "2023-06-15",
        version: "1.0",
        gameVersion: "1.0.0",
        size: "124MB",
        downloads: 986,
        rating: 4.6,
        content: "本补丁完整汉化了游戏全部文本、界面及CG，支持最新版本。",
        features: ["文本汉化100%", "界面汉化100%", "CG字幕汉化95%", "系统兼容性修复"],
        downloadUrl: "#"
      },
      {
        id: 2,
        name: "春风之恋汉化补丁V1.1（修复版）",
        translator: "樱花汉化组",
        date: "2023-07-28",
        version: "1.1",
        gameVersion: "1.0.5",
        size: "130MB",
        downloads: 542,
        rating: 4.8,
        content: "本补丁在V1.0的基础上修复了多处文本错误，并支持新发布的1.0.5版本游戏。",
        features: ["修复50+文本错误", "完善部分CG翻译", "优化字体显示", "增加特效翻译"],
        downloadUrl: "#"
      }
    ],
    saves: [
      {
        id: 1,
        name: "全角色全CG存档",
        uploader: "春风の恋人",
        date: "2023-08-10",
        gameVersion: "1.0.5",
        size: "2.5MB",
        downloads: 453,
        rating: 4.9,
        content: "全部角色线路通关，解锁全部CG、结局和音乐。",
        features: ["全角色满好感度", "全部结局解锁", "全CG画廊解锁", "全背景音乐解锁"],
        downloadUrl: "#"
      },
      {
        id: 2,
        name: "第一章开始各角色存档",
        uploader: "新手指导员",
        date: "2023-08-22",
        gameVersion: "1.0.5",
        size: "1.2MB",
        downloads: 231,
        rating: 4.5,
        content: "通过序章后，在第一章开始处的存档，可以直接选择不同角色路线。",
        features: ["通过序章", "初始角色好感度平衡", "便于选择不同路线", "节省前期时间"],
        downloadUrl: "#"
      }
    ],
    characters: [
      {
        name: "樱井千夏",
        cv: "佐藤日和",
        desc: "班长，成绩优异，性格认真但有点傲娇。喜欢阅读和花道。",
        traits: "认真、傲娇、聪明",
        hobbies: "阅读、花道、音乐",
        birthday: "4月16日",
        height: "162cm",
        age: "17岁"
      },
      {
        name: "星野美月",
        cv: "高桥礼奈",
        desc: "学妹，性格活泼开朗，总是充满活力。是学校啦啦队的成员。",
        traits: "活泼、开朗、阳光",
        hobbies: "啦啦队、运动、唱歌",
        birthday: "7月20日",
        height: "158cm",
        age: "16岁"
      },
      {
        name: "藤原惠",
        cv: "木村真纪",
        desc: "青梅竹马，温柔体贴，擅长料理。自小与主角一起长大。",
        traits: "温柔、贤惠、细心",
        hobbies: "料理、园艺、钢琴",
        birthday: "1月15日",
        height: "160cm",
        age: "17岁"
      },
      {
        name: "高桥结衣",
        cv: "田中花子",
        desc: "转学生，神秘冷漠，很少与人交流。拥有出色的音乐才能。",
        traits: "冷漠、神秘、才华",
        hobbies: "小提琴、阅读、独处",
        birthday: "11月30日",
        height: "165cm",
        age: "17岁"
      },
      {
        name: "中村小雪",
        cv: "山本美咲",
        desc: "学姐，文学社社长，沉稳成熟。喜欢写小说，有洞察力。",
        traits: "沉稳、成熟、洞察",
        hobbies: "写作、摄影、茶道",
        birthday: "9月8日",
        height: "167cm",
        age: "18岁"
      },
      {
        name: "佐藤亮介",
        cv: "鈴木大輔",
        desc: "主角的好友，性格开朗，是学校棒球部的王牌投手。",
        traits: "阳光、热血、义气",
        hobbies: "棒球、游戏、摄影",
        birthday: "6月12日",
        height: "178cm",
        age: "17岁"
      }
    ],
    images: [1, 2, 3, 4, 5],
    reviews: [
      {
        username: "樱花控",
        date: "2023-09-10",
        rating: 5,
        content: "这是我玩过的最好的galgame之一！故事情节感人至深，特别是藤原惠线的结局让我哭了整整一晚上。角色塑造非常立体，每个人物都有自己的个性和成长。",
        playtime: "35小时",
        completed: "全部"
      }
    ],
    recommendations: [
      { id: 1, title: "推荐游戏 1", tags: "类型标签", rating: 9.2 },
      { id: 2, title: "推荐游戏 2", tags: "类型标签", rating: 9.2 },
      { id: 3, title: "推荐游戏 3", tags: "类型标签", rating: 9.2 },
      { id: 4, title: "推荐游戏 4", tags: "类型标签", rating: 9.2 },
      { id: 5, title: "推荐游戏 5", tags: "类型标签", rating: 9.2 },
      { id: 6, title: "推荐游戏 6", tags: "类型标签", rating: 9.2 }
    ]
  };

  return gameData;
}

// 主页面组件（服务器组件）
export default async function ArticleDetailPage({ params }: Params) {
  const { id } = params;
  const gameData = await getGameData(id);

  // 服务器端渲染游戏的基本信息（对SEO友好）
  return <GameDetailClient gameData={gameData} />;
}
