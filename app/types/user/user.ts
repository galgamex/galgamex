// 用户相关类型定义
import { Article } from '../content/article';

// 用户
export interface User {
  id: number;
  username: string;
  nickname?: string;
  email?: string;
  avatar?: string;
  role?: string;
  status?: string;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// 用户等级
export interface UserLevel {
  id: number;
  level: number;
  name: string;
  icon?: string;
  requiredExp: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 用户等级进度
export interface UserLevelProgress {
  userId: number;
  currentLevelId: number;
  currentExp: number;
  totalExp: number;
  currentLevel?: UserLevel;
  user?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

// 等级变更日志
export interface LevelLog {
  id: number;
  userId: number;
  oldLevel: number;
  newLevel: number;
  reason?: string;
  user?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

// 用户积分
export interface UserPoints {
  userId: number;
  points: number;
  totalEarned: number;
  totalSpent: number;
  user?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

// 积分变更日志
export interface PointLog {
  id: number;
  userId: number;
  amount: number;
  type: string;
  description?: string;
  userPoints?: UserPoints;
  user?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

// 用户操作日志
export interface UserLog {
  id: number;
  userId: number;
  type: string;
  ip?: string;
  ua?: string;
  remark?: string;
  author?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

// 任务
export interface Task {
  id: number;
  name: string;
  description?: string;
  type: string;
  reward: number;
  rewardType: string;
  repeatType: string;
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// 任务完成记录
export interface TaskCompletion {
  id: number;
  userId: number;
  taskId: number;
  status: string;
  rewardIssued: boolean;
  completedAt?: Date;
  task?: Task;
  user?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

// 收藏记录
export interface Favorite {
  userId: number;
  articleId: number;
  createdAt?: Date;
  updatedAt?: Date;
  user?: User;
  article?: Article; // 修复循环引用问题
} 