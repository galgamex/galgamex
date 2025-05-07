// 角色相关类型定义

// 角色
export interface Character {
  id: number;
  name: string;
  nameJp?: string;
  avatar?: string;
  description?: string;
  cv?: string;
  cvJp?: string;
  isMain?: boolean;
  isHeroine?: boolean;
  age?: string;
  birthday?: string;
  height?: string;
  weight?: string;
  hobby?: string;
  traits?: string;
  articleId: number;
  createdAt?: Date;
  updatedAt?: Date;
} 