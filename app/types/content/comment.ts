// 评论相关类型定义
import { Article } from './article';
import { User } from '../user/user';

// 评论
export interface Comment {
  id: number;
  content: string;
  status?: string;
  emoji?: string;
  ip?: string;
  likes: number;
  isUserLiked?: boolean;
  articleId: number;
  authorId: number;
  parentId?: number;
  rootId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  
  // 关联对象
  article?: Article;
  author?: User;
  parent?: Comment;
  replies?: Comment[];
  like?: LikeLog[];
}

// 点赞记录
export interface LikeLog {
  id: number;
  type: string;
  articleId?: number;
  commentId?: number;
  authorId: number;
  createdAt?: Date;
  updatedAt?: Date;
  
  // 关联对象
  article?: Article;
  comment?: Comment;
  author?: User;
} 