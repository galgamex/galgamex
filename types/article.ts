import {
  ArticleTag,
  Category,
  Character,
  Developer,
  Download,
  DownloadLog,
  Feedback,
  GamePatch,
  GameSave,
  LikeLog,
  Article as PrismaArticle,
  Publisher,
  User
} from "@prisma/client";

export type Article = PrismaArticle & {
  // 基础字段
  originalTitle?: string;
  releaseDate?: string;
  rating?: number;
  favorites?: number;
  shares?: number;
  reviewCount?: number;
  videos?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // 关联字段
  tags?: ArticleTag[];
  category?: Category;
  author?: User;
  publisher?: Publisher;
  developer?: Developer;
  likeLog?: LikeLog[];
  feedback?: Feedback[];
  download?: Download[];
  gameSave?: GameSave[];
  gamePatch?: GamePatch[];
  characters?: Character[];
  recommendedTo?: Article[];
  recommendedBy?: Article[];
  downloadLogs?: DownloadLog[];
};