// 文章类型定义

import { User } from '../user/user';
import { Category } from './category';
import { Developer } from '../game/developer';
import { Publisher } from '../game/publisher';
import { Character } from './character';
import { Download, DownloadLog } from './download';
import { GamePatch } from './game-patch';
import { GameSave } from './game-save';
import { LikeLog } from './comment';

// 文章-标签关联
export interface ArticleTag {
  id: number;
  articleId: number;
  tagId: number;
  article?: Article;
  tag?: Tag;
}

// 标签
export interface Tag {
  id: number;
  name: string;
  slug?: string;
  alias?: string;
  description?: string;
  color?: string;
  icon?: string;
  categoryId?: number;
  category?: Category;
  articleTag?: ArticleTag[];
}

// 推荐关系
export interface Recommendation {
  id: number;
  articleId: number;
  recId: number;
  article?: Article;
  recArticle?: Article;
  createdAt?: Date;
  updatedAt?: Date;
}

// 文章（游戏）
export interface Article {
  id: number;
  title: string;
  originalTitle?: string;
  alias?: string;
  summary?: string;
  content?: string;
  releaseDate?: string;
  cover?: string;
  avatar?: string;
  images?: string;
  videos?: string;
  sources?: string;
  downloads?: number;
  views?: number;
  favorites?: number;
  shares?: number;
  rating?: number;
  reviewCount?: number;
  type?: string;
  stage?: string;
  status?: string;
  isTop?: boolean;
  isHot?: boolean;
  sort?: number;
  categoryId?: number;
  authorId?: number;
  publisherId?: number;
  developerId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  
  // 关联对象
  author?: User;
  category?: Category;
  tags?: ArticleTag[];
  publisher?: Publisher;
  developer?: Developer;
  character?: Character[];
  download?: Download[];
  gamePatch?: GamePatch[];
  gameSave?: GameSave[];
  downloadLogs?: DownloadLog[];
  likeLog?: LikeLog[];
  recommendedTo?: Recommendation[];
  recommendedBy?: Recommendation[];
} 