// 发行商相关类型定义

// 发行商
export interface Publisher {
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