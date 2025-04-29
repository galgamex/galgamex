"use client";

// UI组件导入
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Article } from "@/types/article";
import { Comment } from "@/types/comment";
import { Prisma } from "@prisma/client";

import { AlertCircle, Download, Eye, HeartIcon, Info, MessageCircle, MoreVertical, Pencil, Share2Icon, StarIcon, ThumbsUp, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { TouchEvent, useRef, useState } from "react";

type GameDetailClientProps = {
  gameData: Article;
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

  // 评论相关状态
  const [comments, setComments] = useState<Prisma.CommentUncheckedCreateInput[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [replyToComment, setReplyToComment] = useState<Comment | null>(null);

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

    // 获取表单数据
    const form = e.target as HTMLFormElement;
    const name = (form.querySelector('#patch-name') as HTMLInputElement).value;
    const translator = (form.querySelector('#patch-translator') as HTMLInputElement).value;
    const version = (form.querySelector('#patch-version') as HTMLInputElement).value;
    const gameVersion = (form.querySelector('#patch-game-version') as HTMLInputElement).value;
    const size = (form.querySelector('#patch-size') as HTMLInputElement).value;
    const url = (form.querySelector('#patch-url') as HTMLInputElement).value;
    const code = (form.querySelector('#patch-code') as HTMLInputElement).value;
    const unzipCode = (form.querySelector('#patch-unzip-code') as HTMLInputElement).value;
    const featuresText = (form.querySelector('#patch-features') as HTMLTextAreaElement).value;
    const description = (form.querySelector('#patch-description') as HTMLTextAreaElement).value;

    // 处理特点，把多行文本转换为数组
    const features = featuresText.split('\n').filter(line => line.trim() !== '');

    // 构建审核数据
    const reviewData = {
      title: `[补丁] ${name}`,
      content: description,
      type: 'PATCH',
      objectId: gameData.id, // 关联的游戏ID
      objectData: JSON.stringify({
        name,
        translator,
        version,
        gameVersion,
        size,
        url,
        code,
        unzipCode,
        features: JSON.stringify(features),
        description,
        articleId: gameData.id
      })
    };

    // 这里应该发送到后端API，但目前只是模拟
    console.log('提交补丁审核数据:', reviewData);

    toast({
      title: "提交成功",
      description: "您的汉化补丁已提交审核，通过后将显示在列表中",
    });
    setShowPatchUploadDialog(false);
  };

  // 处理存档提交
  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 获取表单数据
    const form = e.target as HTMLFormElement;
    const name = (form.querySelector('#save-name') as HTMLInputElement).value;
    const gameVersion = (form.querySelector('#save-game-version') as HTMLInputElement).value;
    const size = (form.querySelector('#save-size') as HTMLInputElement).value;
    const url = (form.querySelector('#save-url') as HTMLInputElement).value;
    const code = (form.querySelector('#save-code') as HTMLInputElement).value;
    const unzipCode = (form.querySelector('#save-unzip-code') as HTMLInputElement).value;
    const featuresText = (form.querySelector('#save-features') as HTMLTextAreaElement).value;
    const description = (form.querySelector('#save-description') as HTMLTextAreaElement).value;

    // 处理特点，把多行文本转换为数组
    const features = featuresText.split('\n').filter(line => line.trim() !== '');

    // 构建审核数据
    const reviewData = {
      title: `[存档] ${name}`,
      content: description,
      type: 'SAVE',
      objectId: gameData.id, // 关联的游戏ID
      objectData: JSON.stringify({
        name,
        gameVersion,
        size,
        url,
        code,
        unzipCode,
        features: JSON.stringify(features),
        description,
        articleId: gameData.id
      })
    };

    // 这里应该发送到后端API，但目前只是模拟
    console.log('提交存档审核数据:', reviewData);

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

  // 处理评论提交
  const handleCommentSubmit = () => {
    if (!commentContent.trim()) {
      toast({
        title: "评论内容不能为空",
        description: "请输入评论内容",
      });
      return;
    }

    setIsSubmitting(true);

    // 模拟API调用
    setTimeout(() => {
      // 如果是编辑评论
      if (editingComment) {
        const updatedComments = comments.map(comment =>
          comment.id === editingComment.id
            ? { ...comment, content: commentContent }
            : comment
        );
        setComments(updatedComments);
        setEditingComment(null);
        toast({
          title: "评论已更新",
          description: "您的评论已成功更新",
        });
      }
      // 如果是回复评论
      else if (replyToComment) {
        const newComment: Prisma.CommentUncheckedCreateInput = {

          content: commentContent,
          likes: 0,
          status: 'PUBLISH',
          articleId: gameData.id,
          authorId: 1, // 假设当前用户ID为1
          parentId: replyToComment.id,
          rootId: replyToComment.rootId || replyToComment.id,
          emoji: null,
          ip: null,
          createdAt: null,
          updatedAt: null
        };

        setComments([...comments, newComment]);
        setReplyToComment(null);
        toast({
          title: "回复已发布",
          description: "您的回复已成功发布",
        });
      }
      // 如果是新评论
      else {
        const newComment: Prisma.CommentUncheckedCreateInput = {
          content: commentContent,
          likes: 0,
          status: 'PUBLISH',
          articleId: gameData.id,
          authorId: 1,
          rootId: null,
          parentId: null,
          emoji: null,
          ip: null,
          createdAt: null,
          updatedAt: null
        };

        setComments([...comments, newComment]);
        toast({
          title: "评论已发布",
          description: "您的评论已成功发布",
        });
      }

      setCommentContent('');
      setIsSubmitting(false);
      setShowCommentDialog(false);
    }, 1000);
  };

  // 处理点赞评论
  const handleLikeComment = (commentId: number) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        const newIsLiked = !comment.isUserLiked;
        return {
          ...comment,
          likes: newIsLiked ? comment.likes + 1 : comment.likes - 1,
          isUserLiked: newIsLiked
        };
      }
      return comment;
    });

    setComments(updatedComments);
  };

  // 处理删除评论
  const handleDeleteComment = (commentId: number) => {
    // 在实际应用中，这里应该有确认对话框
    setComments(comments.filter(comment => comment.id !== commentId));
    toast({
      title: "评论已删除",
      description: "您的评论已成功删除",
    });
  };

  // 处理编辑评论
  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment);
    setCommentContent(comment.content);
    setShowCommentDialog(true);
  };

  // 处理回复评论
  const handleReplyComment = (comment: Comment) => {
    setReplyToComment(comment);
    setCommentContent('');
    setShowCommentDialog(true);
  };

  // 处理取消编辑/回复
  const handleCancelEdit = () => {
    setEditingComment(null);
    setReplyToComment(null);
    setCommentContent('');
    setShowCommentDialog(false);
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // 评论组件
  const CommentItem = ({ comment, isReply = false }: { comment: Prisma.CommentUncheckedCreateInput, isReply?: boolean }) => {
    const isOwner = comment.authorId === 1; // 假设当前用户ID为1

    return (
      <div className={`flex gap-3 ${isReply ? 'ml-12 mt-3' : 'border-b pb-4'}`}>
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.author?.avatar || 'https://t.alcy.cc/pc'} alt={comment.author?.nickname || comment.author?.username || '用户'} />
          <AvatarFallback>{comment.author?.nickname?.[0] || comment.author?.username?.[0] || 'U'}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">{comment.author?.nickname || comment.author?.username || '匿名用户'}</div>
              <div className="text-xs text-muted-foreground">{formatDate(comment?.createdAt?.toISOString()!)}{comment.updatedAt && ' (已编辑)'}</div>
            </div>

            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">更多操作</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditComment(comment)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>编辑</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>删除</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="mt-2 text-sm">{comment.content}</div>

          <div className="mt-2 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs flex items-center gap-1"
              onClick={() => handleLikeComment(comment.id)}
            >
              <ThumbsUp className={`h-4 w-4 ${comment.isUserLiked ? 'fill-primary text-primary' : ''}`} />
              <span>{comment.likes > 0 ? comment.likes : ''}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs flex items-center gap-1"
              onClick={() => handleReplyComment(comment)}
            >
              <MessageCircle className="h-4 w-4" />
              <span>回复</span>
            </Button>
          </div>

          {/* 渲染回复 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-6 mb-4">
        {/* 游戏封面 */}
        <div className="w-full md:w-1/3 lg:w-1/4 max-w-[250px] mx-auto md:mx-0">
          <AspectRatio ratio={3 / 4} className="overflow-hidden rounded-lg relative bg-gray-200 dark:bg-gray-800 shadow-md">
            <Image
              src={gameData?.avatar || 'https://t.alcy.cc/pc'}
              alt={gameData?.title || ''}
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
              <h1 className="text-3xl font-bold line-clamp-2">{gameData?.title}</h1>
              <div className="text-muted-foreground text-sm line-clamp-2">原名: {gameData?.originalTitle}</div>

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground w-16">发售日期:</span>
                  <span>{gameData?.releaseDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground w-16">开发商:</span>
                  <span>{gameData?.developer?.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground w-16">发行商:</span>
                  <span>{gameData?.publisher?.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground w-16">评分:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 flex">
                      {Array(5).fill(0).map((_, i) => (
                        <StarIcon key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </span>
                    <span>{gameData?.rating}/10</span>
                  </div>
                </div>
              </div>

              {/* 游戏标签 */}
              <div>
                <div className="flex items-center flex-wrap gap-1.5">
                  <span className="text-muted-foreground text-sm">标签：</span>
                  {gameData?.tags?.map((tagRelation, index) => (
                    <span key={index} className="text-xs px-2 py-0.5 bg-secondary/40 rounded-full">
                      {tagRelation.tag.name}
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
                {gameData?.views}
              </span>
              <span className="flex items-center gap-1" title="下载次数">
                <Download size={12} className="opacity-70" />
                {gameData?.downloads}
              </span>
              <span className="flex items-center gap-1" title="收藏次数">
                <HeartIcon size={12} className="opacity-70" />
                {gameData?.favorites}
              </span>
              <span className="flex items-center gap-1" title="分享次数">
                <Share2Icon size={12} className="opacity-70" />
                {gameData?.shares}
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
            "w-full overflow-x-auto pb-2 scrollbar-hide relative  sticky top-12 bg-background",
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
                {gameData?.content} {/* 显示游戏详细内容，使用content字段 */}
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
                {gameData?.videos && JSON.parse(gameData?.videos).map((video: any) => (
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
                {gameData?.images && gameData?.images?.split(',').map((url, index) => (
                  <div key={`screenshot-${index}`} className="w-80 h-48 flex-shrink-0 rounded-md overflow-hidden shadow-md">
                    <Image
                      src={url}  // 这里应该使用实际的url而不是固定值
                      alt={`游戏截图 ${index + 1}`}
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
            {gameData?.characters?.map((character, index) => (
              <div
                key={index}
                className="bg-secondary/20 rounded overflow-hidden cursor-pointer"
                onClick={() => setSelectedCharacter(character)}
              >
                <div className="aspect-[3/4] w-full relative">
                  <Image
                    src={character?.avatar || `https://t.alcy.cc/pc`}
                    alt={character?.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-medium truncate">{character?.name}</h3>
                  <div className="text-xs text-muted-foreground">CV: {character?.cv}</div>
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
                      src={selectedCharacter?.avatar || `https://t.alcy.cc/pc`}
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
                      <p className="text-muted-foreground text-sm">{selectedCharacter?.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-base mb-2">个人资料</h4>
                      <dl className="grid grid-cols-2 gap-2 text-sm">
                        <dt className="text-muted-foreground">性格特点</dt>
                        <dd>{selectedCharacter?.traits}</dd>

                        <dt className="text-muted-foreground">喜好</dt>
                        <dd>{selectedCharacter?.hobby}</dd>

                        <dt className="text-muted-foreground">生日</dt>
                        <dd>{selectedCharacter?.birthday}</dd>

                        <dt className="text-muted-foreground">身高</dt>
                        <dd>{selectedCharacter?.height}</dd>

                        <dt className="text-muted-foreground">体重</dt>
                        <dd>{selectedCharacter?.weight}</dd>

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

        {/* 汉化补丁内容 */}
        <TabsContent value="patches" className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">汉化补丁</h2>
            <Button onClick={() => checkLoginStatus(() => setShowPatchUploadDialog(true))}>
              上传汉化补丁
            </Button>
          </div>

          <div className="space-y-4">
            {gameData?.gamePatch && gameData?.gamePatch?.map((patch) => (
              <div key={patch.id} className="border rounded-lg p-4 bg-card">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{patch.name}</h3>
                    <div className="text-sm flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground mb-2">
                      <span>汉化: {patch.translator || '未知'}</span>
                      <span>版本: {patch.version}</span>
                      <span>适用游戏版本: {patch.gameVersion || '所有版本'}</span>
                      <span>大小: {patch.size}</span>
                      <span>发布时间: {patch.createdAt?.toISOString()}</span>
                    </div>
                    <p className="text-sm mb-3">{patch.description}</p>

                    {patch.features && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-1">补丁特点:</h4>
                        <ul className="text-sm list-disc list-inside grid grid-cols-1 md:grid-cols-2 gap-1">
                          {JSON.parse(patch.features).map((feature: string, index: number) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button size="sm">下载补丁</Button>
                      {patch.code && <div className="text-xs bg-muted p-1 rounded">提取码: {patch.code}</div>}
                      {patch.unzipCode && <div className="text-xs bg-muted p-1 rounded">解压密码: {patch.unzipCode}</div>}
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{patch.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{patch.downloads}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* 存档下载内容 */}
        <TabsContent value="saves" className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">游戏存档</h2>
            <Button onClick={() => checkLoginStatus(() => setShowSaveUploadDialog(true))}>
              上传存档
            </Button>
          </div>

          <div className="space-y-4">
            {gameData?.gameSave && gameData?.gameSave?.map((save) => (
              <div key={save.id} className="border rounded-lg p-4 bg-card">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{save.name}</h3>
                    <div className="text-sm flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground mb-2">
                      <span>适用游戏版本: {save.gameVersion || '所有版本'}</span>
                      <span>大小: {save.size || '未知'}</span>
                      <span>上传时间: {save.createdAt?.toISOString()}</span>
                    </div>
                    <p className="text-sm mb-3">{save.description}</p>

                    {save.features && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-1">存档特点:</h4>
                        <ul className="text-sm list-disc list-inside grid grid-cols-1 md:grid-cols-2 gap-1">
                          {JSON.parse(save.features).map((feature: string, index: number) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button size="sm">下载存档</Button>
                      {save.code && <div className="text-xs bg-muted p-1 rounded">提取码: {save.code}</div>}
                      {save.unzipCode && <div className="text-xs bg-muted p-1 rounded">解压密码: {save.unzipCode}</div>}
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{save.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{save.downloads}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">用户评价</h2>
            <Button
              onClick={() => checkLoginStatus(() => {
                setShowCommentDialog(true);
                setEditingComment(null);
                setReplyToComment(null);
                setCommentContent('');
              })}
            >
              写评价
            </Button>
          </div>

          <div className="flex justify-between items-center px-4 py-3 bg-muted/30 rounded-lg">
            <div>
              <div className="text-3xl font-bold">{gameData?.rating?.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">{gameData?.reviewCount} 用户评分</div>
            </div>

            <div className="flex items-center">
              <div className="flex">
                {Array(5).fill(0).map((_, i) => (
                  <StarIcon key={i} className={`h-6 w-6 ${i < Math.round(gameData?.rating / 2) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {comments.length > 0 ? (
              <div className="divide-y">
                {comments.filter(comment => !comment.parentId).map(comment => (
                  <div key={comment.id} className="py-4">
                    <CommentItem comment={comment} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border rounded-lg">
                <div className="flex flex-col space-y-2">
                  <div className="text-sm text-muted-foreground">暂无评价</div>
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">成为第一个评价此游戏的用户!</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold">相关推荐</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {gameData?.recommendedBy && gameData?.recommendedBy?.map((rec) => (
              rec && (
                <div key={rec.id} className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-[3/4] relative">
                    <Image
                      src={rec.cover || "https://t.alcy.cc/pc"}
                      alt={rec.title || ''}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm font-medium line-clamp-2 h-10">{rec?.title}</h3>
                    <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{rec?.rating?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
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
                  src={selectedVideo?.url}
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
              {selectedVideo?.title} - {selectedVideo?.duration}
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

      {/* 补丁上传对话框 */}
      <Dialog open={showPatchUploadDialog} onOpenChange={setShowPatchUploadDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>上传汉化补丁</DialogTitle>
            <DialogDescription>
              提交的补丁将经过审核后才会显示在游戏页面
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePatchSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="patch-name" className="text-sm font-medium">补丁名称 <span className="text-red-500">*</span></label>
                  <input
                    id="patch-name"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="例：完整汉化补丁V1.0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="patch-translator" className="text-sm font-medium">汉化者/汉化组</label>
                  <input
                    id="patch-translator"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="例：樱花汉化组"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="patch-version" className="text-sm font-medium">补丁版本 <span className="text-red-500">*</span></label>
                  <input
                    id="patch-version"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="例：1.0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="patch-game-version" className="text-sm font-medium">适用游戏版本</label>
                  <input
                    id="patch-game-version"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="例：1.0.0"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="patch-size" className="text-sm font-medium">补丁大小</label>
                  <input
                    id="patch-size"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="例：124MB"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="patch-url" className="text-sm font-medium">下载链接 <span className="text-red-500">*</span></label>
                  <input
                    id="patch-url"
                    type="url"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="例：https://pan.baidu.com/s/xxx"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="patch-code" className="text-sm font-medium">提取码</label>
                  <input
                    id="patch-code"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="例：a1b2"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="patch-unzip-code" className="text-sm font-medium">解压密码</label>
                  <input
                    id="patch-unzip-code"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="例：gamepass"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="patch-features" className="text-sm font-medium">补丁特点</label>
                  <textarea
                    id="patch-features"
                    className="w-full px-3 py-2 border rounded-md text-sm min-h-[80px]"
                    placeholder="例：文本汉化100%&#10;界面汉化100%&#10;CG字幕汉化95%&#10;系统兼容性修复"
                  ></textarea>
                  <p className="text-xs text-muted-foreground">每行一个特点</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="patch-description" className="text-sm font-medium">补丁描述 <span className="text-red-500">*</span></label>
              <textarea
                id="patch-description"
                className="w-full px-3 py-2 border rounded-md text-sm min-h-[120px]"
                placeholder="详细介绍补丁的内容、使用方法、注意事项等"
                required
              ></textarea>
            </div>

            <Alert className="my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                请确保您有权分享该补丁，且补丁不含有恶意代码。审核通常需要1-3个工作日。
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowPatchUploadDialog(false)}>
                取消
              </Button>
              <Button type="submit">
                提交审核
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 存档上传对话框 */}
      <Dialog open={showSaveUploadDialog} onOpenChange={setShowSaveUploadDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>上传游戏存档</DialogTitle>
            <DialogDescription>
              提交的存档将经过审核后才会显示在游戏页面
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="save-name" className="text-sm font-medium">存档名称 <span className="text-red-500">*</span></label>
                  <input
                    id="save-name"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="例：全角色全CG存档"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="save-game-version" className="text-sm font-medium">适用游戏版本</label>
                  <input
                    id="save-game-version"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="例：1.0.5"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="save-size" className="text-sm font-medium">存档大小</label>
                  <input
                    id="save-size"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="例：2.5MB"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="save-url" className="text-sm font-medium">下载链接 <span className="text-red-500">*</span></label>
                  <input
                    id="save-url"
                    type="url"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="例：https://pan.baidu.com/s/xxx"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="save-code" className="text-sm font-medium">提取码</label>
                  <input
                    id="save-code"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="例：a1b2"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="save-unzip-code" className="text-sm font-medium">解压密码</label>
                  <input
                    id="save-unzip-code"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="例：savepass"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="save-features" className="text-sm font-medium">存档特点</label>
                  <textarea
                    id="save-features"
                    className="w-full px-3 py-2 border rounded-md text-sm min-h-[80px]"
                    placeholder="例：全角色满好感度&#10;全部结局解锁&#10;全CG画廊解锁&#10;全背景音乐解锁"
                  ></textarea>
                  <p className="text-xs text-muted-foreground">每行一个特点</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="save-description" className="text-sm font-medium">存档描述 <span className="text-red-500">*</span></label>
              <textarea
                id="save-description"
                className="w-full px-3 py-2 border rounded-md text-sm min-h-[120px]"
                placeholder="详细介绍存档的内容、使用方法、注意事项等"
                required
              ></textarea>
            </div>

            <Alert className="my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                请确保您有权分享该存档，且存档不含有恶意代码。审核通常需要1-3个工作日。
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowSaveUploadDialog(false)}>
                取消
              </Button>
              <Button type="submit">
                提交审核
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 评论对话框 */}
      <Dialog open={showCommentDialog} onOpenChange={(open) => !open && handleCancelEdit()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingComment ? '编辑评论' :
                replyToComment ? `回复 ${replyToComment.author?.nickname || replyToComment.author?.username}` :
                  '发表评论'}
            </DialogTitle>
            <DialogDescription>
              {editingComment ? '修改您的评论内容' :
                replyToComment ? '请输入您的回复内容' :
                  '分享您对这款游戏的看法和体验'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <Textarea
              placeholder="请输入评论内容..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="min-h-[120px]"
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                取消
              </Button>
              <Button onClick={handleCommentSubmit} disabled={isSubmitting}>
                {isSubmitting ? '提交中...' : (editingComment ? '更新' : '发布')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
