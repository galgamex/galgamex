"use client";

// UI组件导入
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AlertCircle, Download, Eye, HeartIcon, Info, Share2Icon, StarIcon } from "lucide-react";
import Image from "next/image";
import React, { TouchEvent, useRef, useState } from "react";

// 游戏数据类型
type GameData = {
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  developer: string;
  publisher: string;
  rating: number;
  description: string;
  tags: string[];
  downloads: number;
  favorites: number;
  shares: number;
  views: number;
  reviewCount: number;
  videos: {
    id: number;
    title: string;
    thumbnail: string;
    url: string;
    duration: string;
  }[];
  patches: any[];
  saves: any[];
  characters: any[];
  screenshots: number[];
  reviews: any[];
  recommendations: any[];
};

type GameDetailClientProps = {
  gameData: GameData;
};

export default function GameDetailClient({ gameData }: GameDetailClientProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<any | null>(null);
  const [showPatchUploadDialog, setShowPatchUploadDialog] = useState(false);
  const [showSaveUploadDialog, setShowSaveUploadDialog] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const { toast } = useToast();

  // Tab相关状态和引用
  const [activeTab, setActiveTab] = useState("info");
  const tabsListRef = useRef<HTMLDivElement>(null);

  // 触摸滑动相关状态
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
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

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-6 mb-4">
        {/* 游戏封面 */}
        <div className="w-full md:w-1/3 lg:w-1/4 max-w-[250px] mx-auto md:mx-0">
          <AspectRatio ratio={3 / 4} className="overflow-hidden rounded-lg relative bg-gray-200 dark:bg-gray-800 shadow-md">
            <Image
              src="https://t.alcy.cc/pc"
              alt={gameData.title}
              fill
              sizes="(max-width: 768px) 300px, (max-width: 1024px) 250px, 200px"
              className="object-cover"
              priority
            />
          </AspectRatio>
        </div>

        {/* 游戏基本信息 */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-bold">{gameData.title}</h1>
              <div className="text-muted-foreground text-sm">原名: {gameData.originalTitle}</div>

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground w-16">发售日期:</span>
                  <span>{gameData.releaseDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground w-16">开发商:</span>
                  <span>{gameData.developer}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground w-16">发行商:</span>
                  <span>{gameData.publisher}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground w-16">评分:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 flex">
                      {Array(5).fill(0).map((_, i) => (
                        <StarIcon key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </span>
                    <span>{gameData.rating}/10</span>
                  </div>
                </div>
              </div>

              {/* 游戏标签 */}
              <div>
                <div className="flex items-center flex-wrap gap-1.5">
                  <span className="text-muted-foreground text-sm">标签：</span>
                  {gameData.tags.map((tag, index) => (
                    <span key={index} className="text-xs px-2 py-0.5 bg-secondary/40 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮 - 固定在底部 */}
          <div className="flex flex-wrap gap-2 mt-auto py-2 sm:py-0">
            <Button variant="default" size="icon" className="h-8 w-8 rounded-full" title="下载资源">
              <Download size={14} />
              <span className="sr-only">下载</span>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" title="收藏游戏">
              <HeartIcon size={14} />
              <span className="sr-only">收藏</span>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" title="分享游戏">
              <Share2Icon size={14} />
              <span className="sr-only">分享</span>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" title="反馈问题">
              <Info size={14} />
              <span className="sr-only">反馈</span>
            </Button>
            <div className="flex items-center text-sm text-muted-foreground gap-3 ml-2">
              <span className="flex items-center gap-1" title="查看次数">
                <Eye size={12} className="opacity-70" />
                {gameData.views}
              </span>
              <span className="flex items-center gap-1" title="下载次数">
                <Download size={12} className="opacity-70" />
                {gameData.downloads}
              </span>
              <span className="flex items-center gap-1" title="收藏次数">
                <HeartIcon size={12} className="opacity-70" />
                {gameData.favorites}
              </span>
              <span className="flex items-center gap-1" title="分享次数">
                <Share2Icon size={12} className="opacity-70" />
                {gameData.shares}
              </span>
            </div>
          </div>
        </div>
      </div>
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
            <TabsList className="w-full h-auto flex flex-nowrap justify-start gap-0.5 mb-4 bg-transparent min-w-max">
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
        <TabsContent value="info" className="flex flex-col gap-6">
          <div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold">游戏简介</h2>
              <p className="text-muted-foreground leading-relaxed">
                {gameData.description}
              </p>
            </div>
          </div>

          {/* 游戏截图滚动条 */}
          <div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold">游戏截图与视频</h2>

              {/* 包含视频和截图的滚动区域 */}
              <div className="flex space-x-4 overflow-x-auto py-2 pb-4">
                {/* 视频项目 */}
                {gameData.videos.map((video) => (
                  <div
                    key={video.id}
                    className="w-80 h-48 flex-shrink-0 rounded-md overflow-hidden shadow-md relative group cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
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

                {/* 截图项目 */}
                {gameData.screenshots.map((num) => (
                  <div key={`screenshot-${num}`} className="w-80 h-48 flex-shrink-0 rounded-md overflow-hidden shadow-md">
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
          </div>
        </TabsContent>

        {/* 角色介绍内容 */}
        <TabsContent value="characters" className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold">游戏角色</h2>
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
                  <div className="flex flex-col gap-4">
                    <div>
                      <h4 className="font-medium text-base mb-2">角色介绍</h4>
                      <p className="text-muted-foreground text-sm">{selectedCharacter?.desc}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-base mb-2">个人资料</h4>
                      <dl className="grid grid-cols-2 gap-2 text-sm">
                        <dt className="text-muted-foreground">性格特点</dt>
                        <dd>{selectedCharacter?.traits}</dd>

                        <dt className="text-muted-foreground">喜好</dt>
                        <dd>{selectedCharacter?.hobbies}</dd>

                        <dt className="text-muted-foreground">生日</dt>
                        <dd>{selectedCharacter?.birthday}</dd>

                        <dt className="text-muted-foreground">身高</dt>
                        <dd>{selectedCharacter?.height}</dd>

                        <dt className="text-muted-foreground">年龄</dt>
                        <dd>{selectedCharacter?.age}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={() => setSelectedCharacter(null)}>关闭</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* 其他Tab内容... */}
        <TabsContent value="patches" className="flex flex-col gap-6">
          {/* 汉化补丁内容 */}
        </TabsContent>

        <TabsContent value="saves" className="flex flex-col gap-6">
          {/* 存档下载内容 */}
        </TabsContent>

        <TabsContent value="reviews" className="flex flex-col gap-6">
          {/* 用户评价内容 */}
        </TabsContent>

        <TabsContent value="recommendations" className="flex flex-col gap-6">
          {/* 相关推荐内容 */}
        </TabsContent>
      </Tabs>

      {/* 视频播放弹窗 */}
      <Dialog open={!!selectedVideo} onOpenChange={(open: boolean) => !open && setSelectedVideo(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-center justify-between w-full">
              <DialogTitle className="pr-8">{selectedVideo?.title}</DialogTitle>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden rounded-md">
            <AspectRatio ratio={16 / 9} className="bg-black">
              {selectedVideo && (
                <video
                  src={selectedVideo.url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                >
                  您的浏览器不支持视频播放。
                </video>
              )}
            </AspectRatio>
          </div>
          {selectedVideo && (
            <div className="text-sm text-muted-foreground mt-2">
              {selectedVideo.title} - {selectedVideo.duration}
            </div>
          )}
        </DialogContent>
      </Dialog>

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
