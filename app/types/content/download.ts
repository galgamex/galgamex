// 下载相关类型定义
import { Article } from "./article";
import { User } from "../user/user";

// 下载
export interface Download {
  id: number;
  url: string;
  name?: string;
  type?: string;
  size?: string;
  password?: string;
  count: number;
  articleId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  
  // 关联对象
  article?: Article;
}

// 下载日志
export interface DownloadLog {
  id: number;
  downloadId: number;
  articleId?: number;
  userId?: number;
  ip?: string;
  ua?: string;
  referer?: string;
  downloadType?: string;
  status: boolean;
  remark?: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  // 关联对象
  download?: Download;
  article?: Article;
  user?: User; // 修复循环引用问题
} 