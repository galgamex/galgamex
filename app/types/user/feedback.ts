// 反馈相关类型定义
import { Article } from '../content/article';
import { User } from './user';

// 反馈
export interface Feedback {
  id: number;
  title: string;
  content: string;
  type: string;
  status: string;
  articleId?: number;
  authorId: number;
  remark?: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  // 关联对象
  article?: Article;
  author?: User;
}

// 审核
export interface Review {
  id: number;
  title: string;
  content: string;
  type: string;
  status: string;
  objectId: number;
  objectData?: string;
  reviewerId?: number;
  reviewTime?: Date;
  remark?: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  // 关联对象
  reviewer?: User;
} 