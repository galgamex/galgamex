// API服务，处理所有与后端的交互

import { Article } from "@/types/article";
import { Character } from "@/types/character";
import { Comment } from "@/types/comment";
import { LikeLog } from "@/types/comment";
import { GamePatch } from "@/types/game-patch";
import { GameSave } from "@/types/game-save";
import { Download } from "@/types/download";

const API_BASE_URL = '/api/v1';

// 通用API请求函数
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '请求失败');
  }

  return res.json();
}

// 文章（游戏）相关API
export const articleAPI = {
  // 获取单个文章（游戏）详情
  getArticle: (id: number): Promise<Article> => {
    return fetchAPI<Article>(`/content/article?id=${id}`);
  },

  // 获取文章列表
  getArticles: (params?: Record<string, any>): Promise<{data: Article[], pagination: any}> => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return fetchAPI<{data: Article[], pagination: any}>(`/content/article?${queryString}`);
  },

  // 获取相关推荐
  getRecommendations: (articleId: number): Promise<Article[]> => {
    return fetchAPI<Article[]>(`/content/recommendation?articleId=${articleId}&direction=outgoing`);
  },

  // 是否已收藏
  checkFavorite: (userId: number, articleId: number): Promise<{liked: boolean}> => {
    return fetchAPI<{liked: boolean}>(`/user/favorites?userId=${userId}&articleId=${articleId}&check=true`);
  },

  // 收藏文章
  addFavorite: (userId: number, articleId: number): Promise<any> => {
    return fetchAPI<any>('/user/favorites', {
      method: 'POST',
      body: JSON.stringify({ userId, articleId }),
    });
  },

  // 取消收藏
  removeFavorite: (userId: number, articleId: number): Promise<any> => {
    return fetchAPI<any>(`/user/favorites?userId=${userId}&articleId=${articleId}`, {
      method: 'DELETE',
    });
  },

  // 点赞文章
  likeArticle: (userId: number, articleId: number): Promise<any> => {
    return fetchAPI<any>('/content/like-log', {
      method: 'POST',
      body: JSON.stringify({ authorId: userId, articleId }),
    });
  },

  // 取消点赞
  unlikeArticle: (userId: number, articleId: number): Promise<any> => {
    return fetchAPI<any>(`/content/like-log?authorId=${userId}&articleId=${articleId}`, {
      method: 'DELETE',
    });
  },

  // 检查是否已点赞
  checkLiked: (userId: number, articleId: number): Promise<{liked: boolean}> => {
    return fetchAPI<{liked: boolean}>(`/content/like-log?authorId=${userId}&articleId=${articleId}&check=true`);
  },

  // 记录文章浏览
  recordView: (articleId: number): Promise<any> => {
    return fetchAPI<any>(`/content/article?id=${articleId}&action=view`, {
      method: 'PUT',
    });
  },
};

// 角色相关API
export const characterAPI = {
  // 获取游戏的角色列表
  getCharacters: (articleId: number): Promise<Character[]> => {
    return fetchAPI<Character[]>(`/content/character?articleId=${articleId}`);
  },

  // 获取角色详情
  getCharacter: (id: number): Promise<Character> => {
    return fetchAPI<Character>(`/content/character?id=${id}`);
  },
};

// 评论相关API
export const commentAPI = {
  // 获取文章评论列表
  getComments: (articleId: number): Promise<Comment[]> => {
    return fetchAPI<Comment[]>(`/content/comment?articleId=${articleId}`);
  },

  // 发表评论
  addComment: (data: {content: string, articleId: number, authorId: number, parentId?: number, rootId?: number}): Promise<Comment> => {
    return fetchAPI<Comment>('/content/comment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 更新评论
  updateComment: (id: number, content: string): Promise<Comment> => {
    return fetchAPI<Comment>(`/content/comment?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  },

  // 删除评论
  deleteComment: (id: number): Promise<void> => {
    return fetchAPI<void>(`/content/comment?id=${id}`, {
      method: 'DELETE',
    });
  },

  // 点赞评论
  likeComment: (userId: number, commentId: number): Promise<LikeLog> => {
    return fetchAPI<LikeLog>('/content/like-log', {
      method: 'POST',
      body: JSON.stringify({ authorId: userId, commentId }),
    });
  },

  // 取消点赞评论
  unlikeComment: (userId: number, commentId: number): Promise<void> => {
    return fetchAPI<void>(`/content/like-log?authorId=${userId}&commentId=${commentId}`, {
      method: 'DELETE',
    });
  },
};

// 游戏补丁相关API
export const gamePatchAPI = {
  // 获取游戏补丁列表
  getPatches: (articleId: number): Promise<GamePatch[]> => {
    return fetchAPI<GamePatch[]>(`/game/game-patch?articleId=${articleId}`);
  },

  // 上传游戏补丁
  uploadPatch: (data: Partial<GamePatch>): Promise<GamePatch> => {
    return fetchAPI<GamePatch>('/game/game-patch', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 下载补丁
  downloadPatch: (id: number, userId?: number): Promise<any> => {
    return fetchAPI<any>(`/game/game-patch?id=${id}&action=download${userId ? `&userId=${userId}` : ''}`);
  },
};

// 游戏存档相关API
export const gameSaveAPI = {
  // 获取游戏存档列表
  getSaves: (articleId: number): Promise<GameSave[]> => {
    return fetchAPI<GameSave[]>(`/game/game-save?articleId=${articleId}`);
  },

  // 上传游戏存档
  uploadSave: (data: Partial<GameSave>): Promise<GameSave> => {
    return fetchAPI<GameSave>('/game/game-save', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 下载存档
  downloadSave: (id: number, userId?: number): Promise<any> => {
    return fetchAPI<any>(`/game/game-save?id=${id}&action=download${userId ? `&userId=${userId}` : ''}`);
  },
};

// 下载相关API
export const downloadAPI = {
  // 获取下载列表
  getDownloads: (articleId: number): Promise<Download[]> => {
    return fetchAPI<Download[]>(`/game/download?articleId=${articleId}`);
  },

  // 记录下载
  logDownload: (downloadId: number, userId?: number, articleId?: number): Promise<any> => {
    return fetchAPI<any>('/game/download-log', {
      method: 'POST',
      body: JSON.stringify({ downloadId, userId, articleId }),
    });
  },
};

// 用户相关API
export const userAPI = {
  // 获取用户信息
  getUser: (id: number): Promise<any> => {
    return fetchAPI<any>(`/user?id=${id}`);
  },

  // 登录
  login: (email: string, password: string): Promise<any> => {
    return fetchAPI<any>('/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // 注册
  register: (userData: any): Promise<any> => {
    return fetchAPI<any>('/user/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // 更新用户资料
  updateProfile: (id: number, data: any): Promise<any> => {
    return fetchAPI<any>(`/user/profile?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // 获取用户收藏列表
  getFavorites: (userId: number, page: number = 1, limit: number = 10): Promise<any> => {
    return fetchAPI<any>(`/user/favorites?userId=${userId}&page=${page}&limit=${limit}`);
  },
}; 