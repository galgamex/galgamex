// 系统相关类型定义

// 系统配置
export interface Config {
  key: string;
  value: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Telegram发布日志
export interface TelegramLog {
  id: number;
  articleId: number;
  images?: string;
  url?: string;
  status: boolean;
  remark?: string;
  createdAt?: Date;
  updatedAt?: Date;
} 