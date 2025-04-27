"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AlertCircle, Download, HeartIcon, Info, Share2Icon, StarIcon } from "lucide-react";
import Image from "next/image";
import React, { TouchEvent, useRef, useState } from "react";

// 修改参数类型
type Params = { params: Promise<{ id: string }> };

export default function ArticleDetailPage({ params }: Params) {
  const [selectedCharacter, setSelectedCharacter] = useState<any | null>(null); //跟踪当前选中的角色数据，初始为null。当用户点击角色卡片时，这个状态会被设置为对应角色的数据，用于在弹窗中显示角色详情。
  const [showPatchUploadDialog, setShowPatchUploadDialog] = useState(false); //控制汉化补丁上传弹窗的显示状态，初始为false（不显示）。当用户点击"上传补丁"按钮时会变为true。
  const [showSaveUploadDialog, setShowSaveUploadDialog] = useState(false); //控制存档上传弹窗的显示状态，初始为false（不显示）。当用户点击"上传存档"按钮时会变为true。
  const [isLoggedIn, setIsLoggedIn] = useState(false); //跟踪用户登录状态，初始为false（未登录）。决定用户是否可以直接上传内容，还是需要先登录
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); //控制登录提示弹窗的显示状态，初始为false（不显示）。当未登录用户尝试上传内容时会显示。
  const { toast } = useToast(); //从useToast钩子中解构获取toast函数，用于显示操作成功/失败的通知消息，如登录成功、上传成功等。

  // Tab相关状态和引用
  const [activeTab, setActiveTab] = useState("info"); // 当前激活的Tab
  const tabsListRef = useRef<HTMLDivElement>(null); // 引用TabsList元素
  const [touchStart, setTouchStart] = useState<number | null>(null); // 触摸起始位置
  const [touchEnd, setTouchEnd] = useState<number | null>(null); // 触摸结束位置
  const [isSwipingLeft, setIsSwipingLeft] = useState(false);
  const [isSwipingRight, setIsSwipingRight] = useState(false);
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(false);

  // Tab选项数组，方便管理
  const tabOptions = [
    { value: "info", label: "游戏信息" },
    { value: "characters", label: "角色介绍" },
    { value: "patches", label: "汉化补丁" },
    { value: "saves", label: "存档下载" },
    { value: "reviews", label: "用户评价" },
    { value: "recommendations", label: "相关推荐" }
  ];

  // 处理登录
  const handleLogin = () => {
    // 模拟登录成功
    setIsLoggedIn(true);
    setShowLoginPrompt(false);
    toast({
      title: "登录成功",
      description: "您已成功登录",
    });
  };

  // 检查登录状态
  const checkLoginStatus = (action: () => void) => {
    if (isLoggedIn) {
      action();
    } else {
      setShowLoginPrompt(true);
    }
  };

  // 处理补丁提交
  const handlePatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "提交成功",
      description: "您的汉化补丁已提交审核，通过后将显示在列表中",
    });
    setShowPatchUploadDialog(false);
  };

  // 处理存档提交
  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "提交成功",
      description: "您的游戏存档已提交审核，通过后将显示在列表中",
    });
    setShowSaveUploadDialog(false);
  };

  // 处理触摸开始事件
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
    // 在移动端显示滑动指示器
    if (window.innerWidth < 768) {
      setShowSwipeIndicator(true);
    }
  };

  // 处理触摸移动事件
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!touchStart) return;

    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);

    const diff = touchStart - currentTouch;
    const threshold = 20; // 小阈值用于指示方向

    // 根据滑动方向设置视觉反馈
    setIsSwipingLeft(diff > threshold);
    setIsSwipingRight(diff < -threshold);
  };

  // 处理触摸结束事件，根据滑动方向切换Tab
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50; // 最小滑动距离

    // 重置状态
    setIsSwipingLeft(false);
    setIsSwipingRight(false);
    setShowSwipeIndicator(false);

    // 判断是否有效滑动
    if (Math.abs(distance) < minSwipeDistance) {
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }

    // 找到当前激活Tab的索引
    const currentIndex = tabOptions.findIndex(tab => tab.value === activeTab);

    if (distance > 0) {
      // 向左滑动，显示下一个Tab
      if (currentIndex < tabOptions.length - 1) {
        setActiveTab(tabOptions[currentIndex + 1].value);
      }
    } else {
      // 向右滑动，显示前一个Tab
      if (currentIndex > 0) {
        setActiveTab(tabOptions[currentIndex - 1].value);
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // 滑动被取消时重置状态
  const handleTouchCancel = () => {
    setTouchStart(null);
    setTouchEnd(null);
    setIsSwipingLeft(false);
    setIsSwipingRight(false);
    setShowSwipeIndicator(false);
  };

  // 使用React.use()解包params，而不是直接访问
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

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
        chapters: "全部章节",
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
        chapters: "全部章节",
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
        chapters: "全部章节",
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
        chapters: "第二章后",
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
        chapters: "第三章后",
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
        chapters: "全部章节",
        height: "178cm",
        age: "17岁"
      }
    ],
    screenshots: [1, 2, 3, 4, 5],
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

  return (
    <div className="py-8">
      {/* 游戏标题与基本信息 */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* 左侧封面 */}
        <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col">
          <div className="mx-auto w-full max-w-[300px] lg:max-w-full mb-6 lg:mb-4 lg:sticky lg:top-8">
            <AspectRatio ratio={3 / 4} className="overflow-hidden rounded-lg relative bg-gray-200 dark:bg-gray-800 shadow-md">
              <Image
                src="https://t.alcy.cc/pc"
                alt={gameData.title}
                fill
                sizes="(max-width: 768px) 300px, (max-width: 1024px) 250px, 300px"
                className="object-cover"
                priority
              />
            </AspectRatio>

            <div className="space-y-3 mt-4">
              <Button variant="default" className="w-full flex items-center justify-center gap-2">
                <div className="flex items-center justify-center gap-2">
                  <Download size={16} />
                  <span>下载资源</span>
                  <span className="text-xs opacity-80">({gameData.downloads})</span>
                </div>
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <div className="flex items-center justify-center gap-2">
                  <HeartIcon size={16} />
                  <span>收藏游戏</span>
                  <span className="text-xs opacity-80">({gameData.favorites})</span>
                </div>
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <div className="flex items-center justify-center gap-2">
                  <Share2Icon size={16} />
                  <span>分享游戏</span>
                  <span className="text-xs opacity-80">({gameData.shares})</span>
                </div>
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <Info size={16} /> 反馈问题
              </Button>
            </div>
          </div>
        </div>

        {/* 右侧信息 */}
        <div className="w-full lg:w-2/3 xl:w-3/4">
          {/* Tab选项卡菜单 */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className={cn("w-full", {
              "tab-transition": isSwipingLeft || isSwipingRight,
              "tab-slide-left": isSwipingLeft,
              "tab-slide-right": isSwipingRight
            })}
          >
            <div
              ref={tabsListRef}
              className={cn(
                "w-full overflow-x-auto pb-2 scrollbar-hide relative",
                { "swipe-indicator": showSwipeIndicator }
              )}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchCancel}
            >
              <div className="flex justify-start w-full">
                <TabsList className="w-full h-auto flex flex-nowrap justify-start gap-2 mb-4 bg-transparent min-w-max">
                  {tabOptions.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="py-2 px-4 text-sm md:text-base whitespace-nowrap"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            {/* 游戏信息内容 */}
            <TabsContent value="info">
              <h1 className="text-3xl font-bold mb-2">{gameData.title}</h1>
              <div className="text-muted-foreground mb-4">原名: {gameData.originalTitle}</div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <div className="text-muted-foreground text-sm">发售日期</div>
                  <div>{gameData.releaseDate}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">开发商</div>
                  <div>{gameData.developer}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">发行商</div>
                  <div>{gameData.publisher}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">游戏评分</div>
                  <div className="flex items-center">
                    <span className="text-yellow-400 flex mr-1">
                      {Array(5).fill(0).map((_, i) => (
                        <StarIcon key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </span>
                    <span>{gameData.rating}/10</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">游戏简介</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {gameData.description}
                </p>
              </div>

              {/* 游戏截图滚动条 */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">游戏截图与视频</h2>

                {/* 视频部分 */}
                <div className="mb-4">
                  <div className="flex space-x-4 overflow-x-auto py-2 pb-4">
                    {gameData.videos.map((video) => (
                      <div key={video.id} className="w-80 h-48 flex-shrink-0 rounded-md overflow-hidden shadow-md relative group">
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          width={320}
                          height={192}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded max-w-[200px] truncate">
                          {video.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 游戏截图部分 */}
                <div className="flex space-x-4 overflow-x-auto py-2 pb-4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className="w-80 h-48 flex-shrink-0 rounded-md overflow-hidden shadow-md">
                      <Image
                        src={`https://t.alcy.cc/pc`}
                        alt={`游戏截图 ${num}`}
                        width={320}
                        height={192}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 戏标签与特性 */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">游戏标签与特性</h2>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <div className="mb-3">
                    <h3 className="text-lg font-medium mb-2">标签</h3>
                    <div className="flex flex-wrap gap-2">
                      {gameData.tags.map((tag, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-secondary/40 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 角色介绍内容 */}
            <TabsContent value="characters" className="py-6">
              <h2 className="text-2xl font-bold mb-6">游戏角色</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {gameData.characters.map((character, index) => (
                  <div
                    key={index}
                    className="bg-secondary/20 rounded overflow-hidden cursor-pointer"
                    onClick={() => setSelectedCharacter(character)}
                  >
                    <div className="aspect-[3/4] w-full relative">
                      <Image
                        src={`https://t.alcy.cc/pc`}
                        alt={character.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-2">
                      <h3 className="text-sm font-medium truncate">{character.name}</h3>
                      <div className="text-xs text-muted-foreground">CV: {character.cv}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 角色详情弹窗 */}
              <Dialog open={!!selectedCharacter} onOpenChange={(open: boolean) => !open && setSelectedCharacter(null)}>
                <DialogContent className="sm:max-w-md md:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl md:text-2xl">{selectedCharacter?.name}</DialogTitle>
                    <DialogDescription className="text-sm md:text-base">
                      CV: {selectedCharacter?.cv}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                    <div className="sm:w-1/3">
                      <div className="aspect-[3/4] w-full rounded overflow-hidden relative">
                        <Image
                          src={`https://t.alcy.cc/pc`}
                          alt={selectedCharacter?.name || "角色图片"}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="sm:w-2/3">
                      <h4 className="font-medium text-base mb-2">角色介绍</h4>
                      <p className="text-muted-foreground text-sm mb-4">{selectedCharacter?.desc}</p>

                      <h4 className="font-medium text-base mb-2">个人资料</h4>
                      <dl className="grid grid-cols-2 gap-2 text-sm">
                        <dt className="text-muted-foreground">性格特点</dt>
                        <dd>{selectedCharacter?.traits}</dd>

                        <dt className="text-muted-foreground">喜好</dt>
                        <dd>{selectedCharacter?.hobbies}</dd>

                        <dt className="text-muted-foreground">生日</dt>
                        <dd>{selectedCharacter?.birthday}</dd>

                        <dt className="text-muted-foreground">登场章节</dt>
                        <dd>{selectedCharacter?.chapters}</dd>

                        <dt className="text-muted-foreground">身高</dt>
                        <dd>{selectedCharacter?.height}</dd>

                        <dt className="text-muted-foreground">年龄</dt>
                        <dd>{selectedCharacter?.age}</dd>
                      </dl>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button onClick={() => setSelectedCharacter(null)}>关闭</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* 汉化补丁内容 */}
            <TabsContent value="patches" className="py-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">汉化补丁</h2>
                <Button
                  variant="outline"
                  onClick={() => checkLoginStatus(() => setShowPatchUploadDialog(true))}
                >
                  上传补丁
                </Button>
              </div>
              <div className="space-y-6">
                {gameData.patches.map((patch) => (
                  <div key={patch.id} className="bg-secondary/30 p-6 rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{patch.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span>汉化组: {patch.translator}</span>
                          <span>•</span>
                          <span>发布日期: {patch.date}</span>
                          <span>•</span>
                          <span>版本: {patch.version}</span>
                          <span>•</span>
                          <span>大小: {patch.size}</span>
                          <span>•</span>
                          <span>下载: {patch.downloads}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-yellow-400 flex">
                          {Array(5).fill(0).map((_, i) => (
                            <StarIcon key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <span>{patch.rating}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4">{patch.content}</p>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">补丁特性</h4>
                      <div className="flex flex-wrap gap-2">
                        {patch.features.map((feature, featureIdx) => (
                          <span key={featureIdx} className="text-xs px-2 py-1 bg-secondary/40 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mt-4">
                      <div className="bg-secondary/40 p-3 rounded-lg text-sm">
                        <div className="font-medium mb-1">适用游戏版本</div>
                        <div>{patch.gameVersion}</div>
                      </div>
                      <div className="flex-grow"></div>
                      <Button variant="default" className="flex items-center gap-2">
                        <Download size={16} />
                        下载补丁
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 补丁上传弹窗 */}
              <Dialog open={showPatchUploadDialog} onOpenChange={setShowPatchUploadDialog}>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>上传汉化补丁</DialogTitle>
                    <DialogDescription>
                      请提供您的汉化补丁信息，上传后将进行审核
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handlePatchSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="patchName">补丁名称</Label>
                      <Input id="patchName" placeholder="例如：完整汉化补丁V1.0" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="translator">汉化组/译者</Label>
                      <Input id="translator" placeholder="您的汉化组名称或个人ID" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gameVersion">适用游戏版本</Label>
                      <Input id="gameVersion" placeholder="例如：1.0.0" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">补丁描述</Label>
                      <Textarea id="description" placeholder="请详细描述补丁内容、汉化程度等" rows={4} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="features">补丁特性（用逗号分隔）</Label>
                      <Input id="features" placeholder="例如：文本汉化100%,界面汉化100%" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="netdiskUrl">网盘链接</Label>
                      <Input id="netdiskUrl" placeholder="百度网盘、阿里云盘等链接" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">提取密码（如有）</Label>
                      <Input id="password" placeholder="网盘提取密码" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" type="button" onClick={() => setShowPatchUploadDialog(false)}>
                        取消
                      </Button>
                      <Button type="submit">提交补丁</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* 存档下载内容 */}
            <TabsContent value="saves" className="py-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">存档下载</h2>
                <Button
                  variant="outline"
                  onClick={() => checkLoginStatus(() => setShowSaveUploadDialog(true))}
                >
                  上传存档
                </Button>
              </div>
              <div className="space-y-6">
                {gameData.saves.map((save) => (
                  <div key={save.id} className="bg-secondary/30 p-6 rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{save.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span>上传者: {save.uploader}</span>
                          <span>•</span>
                          <span>上传日期: {save.date}</span>
                          <span>•</span>
                          <span>适用版本: {save.gameVersion}</span>
                          <span>•</span>
                          <span>大小: {save.size}</span>
                          <span>•</span>
                          <span>下载: {save.downloads}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-yellow-400 flex">
                          {Array(5).fill(0).map((_, i) => (
                            <StarIcon key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <span>{save.rating}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4">{save.content}</p>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">存档特性</h4>
                      <div className="flex flex-wrap gap-2">
                        {save.features.map((feature, featureIdx) => (
                          <span key={featureIdx} className="text-xs px-2 py-1 bg-secondary/40 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button variant="default" className="flex items-center gap-2">
                        <Download size={16} />
                        下载存档
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 存档上传弹窗 */}
              <Dialog open={showSaveUploadDialog} onOpenChange={setShowSaveUploadDialog}>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>上传游戏存档</DialogTitle>
                    <DialogDescription>
                      请提供您的游戏存档信息，上传后将进行审核
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSaveSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="saveName">存档名称</Label>
                      <Input id="saveName" placeholder="例如：全角色全CG存档" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="saveGameVersion">适用游戏版本</Label>
                      <Input id="saveGameVersion" placeholder="例如：1.0.5" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="saveDescription">存档描述</Label>
                      <Textarea id="saveDescription" placeholder="请详细描述存档内容、进度等" rows={4} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="saveFeatures">存档特性（用逗号分隔）</Label>
                      <Input id="saveFeatures" placeholder="例如：全角色满好感度,全部结局解锁" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="saveNetdiskUrl">网盘链接</Label>
                      <Input id="saveNetdiskUrl" placeholder="百度网盘、阿里云盘等链接" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="savePassword">提取密码（如有）</Label>
                      <Input id="savePassword" placeholder="网盘提取密码" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" type="button" onClick={() => setShowSaveUploadDialog(false)}>
                        取消
                      </Button>
                      <Button type="submit">提交存档</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* 用户评价内容 */}
            <TabsContent value="reviews" className="py-6">
              <h2 className="text-2xl font-bold mb-6">用户评价</h2>
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="text-4xl font-bold text-yellow-400 mr-4">{gameData.rating}</div>
                  <div>
                    <div className="text-yellow-400 flex">
                      {Array(5).fill(0).map((_, i) => (
                        <StarIcon key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                    <div className="text-muted-foreground">基于 {gameData.reviewCount} 个评价</div>
                  </div>
                </div>

                <div className="space-y-6">
                  {gameData.reviews.map((review, index) => (
                    <div key={index} className="bg-secondary/30 p-6 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-blue-600 rounded-full mr-4"></div>
                          <div>
                            <div className="font-medium">{review.username}</div>
                            <div className="text-sm text-muted-foreground">{review.date}</div>
                          </div>
                        </div>
                        <div className="text-yellow-400 flex">
                          {Array(review.rating).fill(0).map((_, i) => (
                            <StarIcon key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {review.content}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          游戏时长: {review.playtime} | 通关角色: {review.completed}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-6">
                  <Button>查看更多评价</Button>
                </div>
              </div>
            </TabsContent>

            {/* 相关推荐内容 */}
            <TabsContent value="recommendations" className="py-6">
              <h2 className="text-2xl font-bold mb-6">相关推荐</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {gameData.recommendations.map((game) => (
                  <div key={game.id} className="bg-secondary/30 rounded-lg overflow-hidden">
                    <div className="aspect-[3/4] w-full relative">
                      <Image
                        src={`https://t.alcy.cc/pc`}
                        alt={game.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium truncate">{game.title}</h3>
                      <div className="text-sm text-muted-foreground">{game.tags}</div>
                      <div className="flex items-center mt-1 text-xs">
                        <span className="text-yellow-400 flex mr-1">
                          {Array(5).fill(0).map((_, i) => (
                            <StarIcon key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </span>
                        <span>{game.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 登录提示弹窗 */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>需要登录</DialogTitle>
            <DialogDescription>
              您需要登录才能上传补丁或存档
            </DialogDescription>
          </DialogHeader>
          <Alert className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              登录后才能使用投稿功能，我们需要审核您提交的内容
            </AlertDescription>
          </Alert>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowLoginPrompt(false)}>
              取消
            </Button>
            <Button onClick={handleLogin}>
              登录
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
