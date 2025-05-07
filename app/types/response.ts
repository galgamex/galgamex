// 响应相关类型定义

// 通用响应接口
export interface Response<T = unknown> {
  code: number;
  message: string;
  data?: T;
}

// 分页响应接口
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 分页请求参数
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 文件上传响应
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

// 操作结果响应
export interface OperationResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
} 