🌍 *[English](README.md) ∙ [简体中文](README_zh.md) ∙ [日本语](README_ja.md)*

# Next Forge - 多语言 Next.js 15 启动模板

一个功能完备的 Next.js 15 多语言启动模板，帮助你快速构建面向全球的网站。

- [👉 源码地址](https://github.com/weijunext/nextjs-15-starter)
- [👉 在线预览](https://nextforge.dev/)

## ✨ 特性

- 🌐 内置多语言支持 (中文、英文、日语)
- 🎨 基于 Tailwind CSS 的现代 UI 设计
- 🌙 深色/浅色主题切换
- 📱 响应式布局
- 📝 MDX 博客系统
- 🔍 SEO 优化
- 📊 集成多个统计分析工具
  - Google Analytics
  - Baidu Analytics
  - Google Adsense
  - Vercel Analytics

## 🚀 快速开始

1. 克隆项目:
```bash
git clone https://github.com/weijunext/nextjs-15-starter.git
```

2. 安装依赖:
```bash
npm install
# 或
yarn
# 或
pnpm install
```

3. 复制环境变量文件:
```bash
cp .env.example .env
```

4. 启动开发服务器:
```bash
npm run dev
```

访问 http://localhost:3000 查看你的应用。

## ⚙️ 配置

1. 基础配置
   - 修改 `config/site.ts` 配置网站信息
   - 修改 `public/` 下的图标和 logo
   - 更新 `app/sitemap.ts` 配置站点地图
   - 更新 `app/robots.ts` 配置 robots.txt

2. 多语言配置
   - 在 `i18n/messages/` 下添加或修改语言文件
   - 在 `i18n/routing.ts` 中配置支持的语言
   - 在 `middleware.ts` 中配置多语言路由
   - 在 `app/[locale]/` 目录下创建页面
   - 多语言页面使用 `i18n/routing.ts` 导出的 `Link` 组件替代 next.js 的

## 📝 内容管理

### 博客文章
在 `blogs/[locale]` 目录下创建 MDX 文件，支持以下格式:

```markdown
---
title: 文章标题
description: 文章描述
image: /image.png
slug: /url-path
tags: tag1,tag2
date: 2025-02-20
visible: published
pin: true
---

文章内容...
```

可参考类型定义 `types/blog.ts` 确认支持的字段。

### 静态页面
在 `content/[page]/[locale].mdx` 下管理静态页面内容。

## 🔍 SEO 优化

模板内置了完整的 SEO 优化方案:
   - 服务端渲染和静态生成
   - 自动生成 sitemap.xml
   - 配置 robots.txt
   - 优化的 metadata
   - 支持 Open Graph
   - 多语言 SEO 支持

## 📊 统计分析

在 `.env` 文件中配置相应的 ID 即可启用:
```
NEXT_PUBLIC_GOOGLE_ANALYTICS=
NEXT_PUBLIC_BAIDU_TONGJI=
NEXT_PUBLIC_GOOGLE_ADSENSE=
```

## 🛠️ 技术栈

- Next.js 15
- TypeScript
- Tailwind CSS
- Shadcn/ui
- next-intl
- MDX
- Zustand
- Vercel


## 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/weijunext/nextjs-15-starter&project-name=&repository-name=nextjs-15-starter&demo-title=Nextjs15Starter&demo-description=Nextjs%2015%20starter.&demo-url=https://nextforge.dev&demo-image=https://nextforge.dev/og.png)


## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 关于作者

专注于 Next.js 全栈开发，欢迎探讨开发、咨询与培训等合作机会，联系微信：bigye_chengpu

- [Github](https://github.com/weijunext)
- [Twitter/X](https://twitter.com/weijunext)
- [博客 - J实验室](https://weijunext.com)
- [Medium](https://medium.com/@weijunext)
- [掘金](https://juejin.cn/user/26044008768029)
- [知乎](https://www.zhihu.com/people/mo-mo-mo-89-12-11)

<a href="https://www.buymeacoffee.com/weijunext" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/G2G6TWWMG)

<img src="./public/zs.jpeg" alt="赞赏作者" style="height: 200px; width: 200px">


