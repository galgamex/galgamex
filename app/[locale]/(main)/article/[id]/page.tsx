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
    description: gameData.content.substring(0, 160), // 描述截取前160字符，使用content字段与数据库模型保持一致
    openGraph: {
      title: gameData.title,
      description: gameData.content.substring(0, 160),
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
    content: '《春风之恋》是一款以日本校园为背景的恋爱模拟游戏。玩家将扮演主角在樱花盛开的季节里，邂逅各种性格迥异的女主角，发展出各自不同的故事线。游戏融合了精美的立绘、感人的剧情和丰富的选择支，带给玩家沉浸式的视觉小说体验。故事发生在一个名为"樱花坂"的虚构小镇，主角因各种原因转学至此，开始了全新的校园生活...',
    avatar: "https://t.alcy.cc/pc",
    cover: "https://t.alcy.cc/pc",
    images: JSON.stringify(["image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg", "image5.jpg"]),
    summary: "一款以日本校园为背景的恋爱模拟游戏，玩家将扮演主角在樱花盛开的季节里，邂逅各种性格迥异的女主角",
    size: "2.5GB",
    status: "PUBLISH",
    stage: "SFW",
    isTop: false,
    isHot: true,
    categoryId: 1,
    authorId: 1,
    comments: 1256,
    views: 8754,
    likes: 3654,
    downloads: 1526,
    type: "ARTICLE",
    originalTitle: "春風の恋 ~桜咲く季節~",
    releaseDate: "2023-04-15",
    developer: "ChieriSoft",
    publisher: "ChieriSoft",
    rating: 9.3,
    favorites: 328,
    shares: 89,
    reviewCount: 1256,
    videos: JSON.stringify([
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
    ]),

    // 添加模拟评论数据
    commentList: [
      {
        id: 1,
        content: "这款游戏的剧情非常感人，特别是千夏线的结局让我印象深刻。音乐也很配合气氛，推荐给喜欢校园恋爱题材的玩家。",
        likes: 56,
        status: "PUBLISH",
        articleId: 1,
        authorId: 2,
        createdAt: "2023-08-15T10:30:00Z",
        author: {
          id: 2,
          username: "sakura_fan",
          nickname: "樱花控",
          avatar: "https://t.alcy.cc/pc",
          role: "USER"
        },
        isUserLiked: false,
        replies: [
          {
            id: 3,
            content: "完全同意！千夏的人物塑造非常立体，我也最喜欢她的路线了。",
            likes: 12,
            status: "PUBLISH",
            articleId: 1,
            authorId: 4,
            parentId: 1,
            rootId: 1,
            createdAt: "2023-08-15T13:25:00Z",
            author: {
              id: 4,
              username: "visual_novel_lover",
              nickname: "GAL爱好者",
              avatar: "https://t.alcy.cc/pc",
              role: "USER"
            },
            isUserLiked: false
          }
        ]
      },
      {
        id: 2,
        content: "游戏画面精美，配音也很到位。但是个人感觉剧情中后期有些拖沓，希望开发商后续作品能改进这一点。总体来说值得一玩。",
        likes: 34,
        status: "PUBLISH",
        articleId: 1,
        authorId: 3,
        createdAt: "2023-08-16T09:15:00Z",
        author: {
          id: 3,
          username: "game_critic",
          nickname: "游戏评论家",
          avatar: "https://t.alcy.cc/pc",
          role: "USER"
        },
        isUserLiked: true,
        replies: []
      },
      {
        id: 4,
        content: "汉化质量很高，感谢汉化组的辛勤工作！推荐大家使用V1.1版本的补丁，修复了很多bug。",
        likes: 89,
        status: "PUBLISH",
        articleId: 1,
        authorId: 5,
        createdAt: "2023-08-17T16:42:00Z",
        author: {
          id: 5,
          username: "patch_master",
          nickname: "补丁达人",
          avatar: "https://t.alcy.cc/pc",
          role: "USER"
        },
        isUserLiked: false,
        replies: []
      },
      {
        id: 5,
        content: "作为一个老资历的Galgame玩家，这款作品的水准绝对是上乘。剧本细腻，人物刻画深入，尤其是配乐非常到位，很多场景都让我热泪盈眶。",
        likes: 102,
        status: "PUBLISH",
        articleId: 1,
        authorId: 6,
        createdAt: "2023-08-18T20:10:00Z",
        author: {
          id: 6,
          username: "veteran_player",
          nickname: "资深玩家",
          avatar: "https://t.alcy.cc/pc",
          role: "USER"
        },
        isUserLiked: false,
        replies: []
      }
    ],

    // 关联数据
    category: {
      id: 1,
      name: "恋爱模拟",
      alias: "gal-game"
    },
    author: {
      id: 1,
      username: "admin",
      nickname: "管理员",
      avatar: "https://t.alcy.cc/pc"
    },
    tags: [
      { id: 1, name: "校园恋爱" },
      { id: 2, name: "视觉小说" },
      { id: 3, name: "青春" },
      { id: 4, name: "日常" },
      { id: 5, name: "治愈" },
      { id: 6, name: "情感" },
      { id: 7, name: "轻喜剧" },
      { id: 8, name: "文艺" }
    ],
    patches: [
      {
        id: 1,
        name: "春风之恋完整汉化补丁V1.0",
        translator: "樱花汉化组",
        version: "1.0",
        gameVersion: "1.0.0",
        size: "124MB",
        description: "本补丁完整汉化了游戏全部文本、界面及CG，支持最新版本。",
        downloads: 986,
        rating: 4.6,
        status: "PUBLISH",
        features: JSON.stringify(["文本汉化100%", "界面汉化100%", "CG字幕汉化95%", "系统兼容性修复"]),
        code: "abcd",
        unzipCode: "1234",
        authorId: 2,
        createdAt: "2023-06-15"
      },
      {
        id: 2,
        name: "春风之恋汉化补丁V1.1（修复版）",
        translator: "樱花汉化组",
        version: "1.1",
        gameVersion: "1.0.5",
        size: "130MB",
        description: "本补丁在V1.0的基础上修复了多处文本错误，并支持新发布的1.0.5版本游戏。",
        downloads: 542,
        rating: 4.8,
        status: "PUBLISH",
        features: JSON.stringify(["修复50+文本错误", "完善部分CG翻译", "优化字体显示", "增加特效翻译"]),
        code: "efgh",
        unzipCode: "5678",
        authorId: 2,
        createdAt: "2023-07-28"
      }
    ],
    saves: [
      {
        id: 1,
        name: "全角色全CG存档",
        description: "全部角色线路通关，解锁全部CG、结局和音乐。",
        gameVersion: "1.0.5",
        size: "2.5MB",
        downloads: 453,
        rating: 4.9,
        status: "PUBLISH",
        features: JSON.stringify(["全角色满好感度", "全部结局解锁", "全CG画廊解锁", "全背景音乐解锁"]),
        code: "ijkl",
        unzipCode: "9012",
        authorId: 3,
        createdAt: "2023-08-10"
      },
      {
        id: 2,
        name: "第一章开始各角色存档",
        description: "通过序章后，在第一章开始处的存档，可以直接选择不同角色路线。",
        gameVersion: "1.0.5",
        size: "1.2MB",
        downloads: 231,
        rating: 4.5,
        status: "PUBLISH",
        features: JSON.stringify(["通过序章", "初始角色好感度平衡", "便于选择不同路线", "节省前期时间"]),
        code: "mnop",
        unzipCode: "3456",
        authorId: 4,
        createdAt: "2023-08-22"
      }
    ],
    characters: [
      {
        id: 1,
        name: "樱井千夏",
        nameJp: "桜井千夏",
        avatar: "https://t.alcy.cc/pc",
        images: undefined,
        description: "班长，成绩优异，性格认真但有点傲娇。喜欢阅读和花道。",
        cv: "佐藤日和",
        cvJp: "佐藤日和",
        traits: "认真、傲娇、聪明",
        birthday: "4月16日",
        height: "162cm",
        weight: "48kg",
        age: "17岁",
        hobby: "阅读、花道、音乐",
        isMain: true,
        isHeroine: true
      },
      {
        id: 2,
        name: "星野美月",
        nameJp: "星野みつき",
        avatar: "https://t.alcy.cc/pc",
        images: undefined,
        description: "学妹，性格活泼开朗，总是充满活力。是学校啦啦队的成员。",
        cv: "高桥礼奈",
        cvJp: "高桥礼奈",
        traits: "活泼、开朗、阳光",
        birthday: "7月20日",
        height: "158cm",
        weight: "45kg",
        age: "16岁",
        hobby: "啦啦队、运动、唱歌",
        isMain: true,
        isHeroine: true
      },
      {
        id: 3,
        name: "藤原惠",
        nameJp: "藤原めぐみ",
        avatar: "https://t.alcy.cc/pc",
        images: undefined,
        description: "青梅竹马，温柔体贴，擅长料理。自小与主角一起长大。",
        cv: "木村真纪",
        cvJp: "木村真纪",
        traits: "温柔、贤惠、细心",
        birthday: "1月15日",
        height: "160cm",
        weight: "46kg",
        age: "17岁",
        hobby: "料理、园艺、钢琴",
        isMain: true,
        isHeroine: true
      },
      {
        id: 4,
        name: "高桥结衣",
        nameJp: "高桥ゆい",
        avatar: "https://t.alcy.cc/pc",
        images: undefined,
        description: "转学生，神秘冷漠，很少与人交流。拥有出色的音乐才能。",
        cv: "田中花子",
        cvJp: "田中花子",
        traits: "冷漠、神秘、才华",
        birthday: "11月30日",
        height: "165cm",
        weight: "49kg",
        age: "17岁",
        hobby: "小提琴、阅读、独处",
        isMain: true,
        isHeroine: true
      },
      {
        id: 5,
        name: "中村小雪",
        nameJp: "中村こゆき",
        avatar: "https://t.alcy.cc/pc",
        images: undefined,
        description: "学姐，文学社社长，沉稳成熟。喜欢写小说，有洞察力。",
        cv: "山本美咲",
        cvJp: "山本美咲",
        traits: "沉稳、成熟、洞察",
        birthday: "9月8日",
        height: "167cm",
        weight: "50kg",
        age: "18岁",
        hobby: "写作、摄影、茶道",
        isMain: true,
        isHeroine: true
      },
      {
        id: 6,
        name: "佐藤亮介",
        nameJp: "佐藤りょうすけ",
        avatar: "https://t.alcy.cc/pc",
        images: undefined,
        description: "主角的好友，性格开朗，是学校棒球部的王牌投手。",
        cv: "鈴木大輔",
        cvJp: "鈴木大輔",
        traits: "阳光、热血、义气",
        birthday: "6月12日",
        height: "178cm",
        weight: "65kg",
        age: "17岁",
        hobby: "棒球、游戏、摄影",
        isMain: true,
        isHeroine: false
      }
    ],
    downloadLinks: [
      {
        id: 1,
        type: "BAIDU",
        url: "https://pan.baidu.com/s/example",
        code: "1a2b",
        unzipCode: "game123",
        count: 986,
        status: "PUBLISH"
      },
      {
        id: 2,
        type: "DIRECT",
        url: "https://example.com/download/game",
        count: 540,
        status: "PUBLISH"
      }
    ],
    recommendations: [
      {
        id: 1,
        recId: 2,
        recArticle: {
          id: 2,
          title: "夏日回忆",
          cover: "https://t.alcy.cc/pc",
          rating: 9.2
        }
      },
      {
        id: 2,
        recId: 3,
        recArticle: {
          id: 3,
          title: "樱花物语",
          cover: "https://t.alcy.cc/pc",
          rating: 9.1
        }
      },
      {
        id: 3,
        recId: 4,
        recArticle: {
          id: 4,
          title: "星空之约",
          cover: "https://t.alcy.cc/pc",
          rating: 8.9
        }
      },
      {
        id: 4,
        recId: 5,
        recArticle: {
          id: 5,
          title: "雨声轻语",
          cover: "https://t.alcy.cc/pc",
          rating: 9.3
        }
      },
      {
        id: 5,
        recId: 6,
        recArticle: {
          id: 6,
          title: "青春日记",
          cover: "https://t.alcy.cc/pc",
          rating: 8.7
        }
      },
      {
        id: 6,
        recId: 7,
        recArticle: {
          id: 7,
          title: "花语心愿",
          cover: "https://t.alcy.cc/pc",
          rating: 9.0
        }
      }
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
