// 统计相关类型定义

// 访问统计
export interface VisitStats {
  id: number;
  date: string;
  pv: number;
  uv: number;
  ip: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// 用户统计
export interface UserStats {
  id: number;
  date: string;
  newUsers: number;
  activeUsers: number;
  totalUsers: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// 内容统计
export interface ContentStats {
  id: number;
  date: string;
  newArticles: number;
  newComments: number;
  newDownloads: number;
  totalArticles: number;
  totalComments: number;
  totalDownloads: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// 下载统计
export interface DownloadStats {
  id: number;
  date: string;
  articleId: number;
  downloadId: number;
  count: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// 搜索统计
export interface SearchStats {
  id: number;
  keyword: string;
  count: number;
  createdAt?: Date;
  updatedAt?: Date;
} 