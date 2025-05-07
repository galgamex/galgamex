// 开发商相关类型定义

// 开发商
export interface Developer {
  id: number;
  name: string;
  alias?: string;
  logo?: string;
  website?: string;
  description?: string;
  country?: string;
  createdAt?: Date;
  updatedAt?: Date;
} 