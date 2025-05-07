# 类型定义目录结构

本目录包含应用程序中使用的所有TypeScript类型定义，按照功能模块进行组织。

## 目录结构

### 1. 基础类型
- `enums.ts` - 枚举类型定义
- `response.ts` - API响应相关类型

### 2. 内容相关类型 (content/)
- `article.ts` - 文章相关类型
- `category.ts` - 分类相关类型
- `character.ts` - 角色相关类型
- `comment.ts` - 评论相关类型
- `download.ts` - 下载相关类型
- `game-patch.ts` - 游戏补丁相关类型
- `game-save.ts` - 游戏存档相关类型

### 3. 用户相关类型 (user/)
- `user.ts` - 用户相关类型
- `notification.ts` - 通知相关类型
- `feedback.ts` - 反馈相关类型

### 4. 系统相关类型 (system/)
- `system.ts` - 系统相关类型
- `statistics.ts` - 统计相关类型

### 5. 游戏相关类型 (game/)
- `developer.ts` - 开发商相关类型
- `publisher.ts` - 发行商相关类型

## 使用方式

所有类型都通过 `index.ts` 文件统一导出，可以通过以下方式导入：

```typescript
// 导入所有类型
import * as Types from '@/types';

// 导入特定类型
import { Article, Comment } from '@/types';
```

或者也可以直接从特定文件导入：

```typescript
// 直接从特定文件导入
import { Article } from '@/types/content/article';
import { User } from '@/types/user/user';
```

## 注意事项

1. 为避免循环引用问题，请在导入类型时保持谨慎
2. 所有枚举类型应放置在 `enums.ts` 文件中
3. 新增类型时请遵循现有的目录结构 