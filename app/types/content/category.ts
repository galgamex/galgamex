// 分类相关类型定义
import { User } from '../user/user';

// 分类
export interface Category {
  id: number;
  name: string;
  alias?: string;
  slug?: string;
  description?: string;
  type?: string;
  icon?: string;
  cover?: string;
  layout?: string;
  parentId?: number;
  sort?: number;
  authorId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  
  // 关联对象
  parent?: Category;
  children?: Category[];
  author?: User;
} 