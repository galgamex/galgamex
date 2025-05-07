// 游戏存档相关类型定义
import { Article } from "./article";
import { User } from "../user/user";

// 游戏存档
export interface GameSave {
  id: number;
  name: string;
  gameVersion?: string;
  url: string;
  code?: string;
  unzipCode?: string;
  size?: string;
  features?: string;
  description?: string;
  downloads: number;
  rating: number;
  articleId: number;
  authorId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  
  // 关联对象
  article?: Article;
  author?: User;
} 