// 通知相关类型定义
import { User } from './user';

// 通知类型
export type NotificationType = 
  | 'system'      // 系统通知
  | 'comment'     // 评论通知
  | 'reply'       // 回复通知
  | 'like'        // 点赞通知
  | 'follow'      // 关注通知
  | 'mention'     // 提及通知
  | 'reward'      // 奖励通知
  | 'task'        // 任务通知

// 通知
export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  content: string;
  isRead: boolean;
  userId: number;
  senderId?: number;
  targetId?: number;
  targetType?: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  // 关联对象
  user?: User;
  sender?: User;
}

// 通知设置
export interface NotificationSetting {
  id: number;
  userId: number;
  type: NotificationType;
  enabled: boolean;
  emailEnabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  
  // 关联对象
  user?: User;
} 