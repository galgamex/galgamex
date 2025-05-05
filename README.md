🌍 *[English](README.md) ∙ [简体中文](README_zh.md) ∙ [日本語](README_ja.md)*

# Next Forge - Multilingual Next.js 15 Starter

A feature-rich Next.js 15 multilingual starter template to help you quickly build globally-ready websites.

- [👉 Source Code](https://github.com/weijunext/nextjs-15-starter)
- [👉 Live Demo](https://nextforge.dev/)

## ✨ Features

- 🌐 Built-in i18n support (English, Chinese, Japanese)
- 🎨 Modern UI design with Tailwind CSS
- 🌙 Dark/Light theme toggle
- 📱 Responsive layout
- 📝 MDX blog system 
- 🔍 SEO optimization
- 📊 Integrated analytics tools
  - Google Analytics
  - Baidu Analytics
  - Google Adsense
  - Vercel Analytics

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/weijunext/nextjs-15-starter.git
```

2. Install dependencies:
```bash
npm install
# or
yarn
# or
pnpm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

Visit http://localhost:3000 to view your application.

## ⚙️ Configuration

1. Basic Setup
   - Edit `config/site.ts` for website information
   - Update icons and logo in `public/`
   - Configure `app/sitemap.ts` for sitemap
   - Update `app/robots.ts` for robots.txt

2. i18n Setup
   - Add/modify language files in `i18n/messages/`
   - Configure supported languages in `i18n/routing.ts`
   - Set up i18n routing in `middleware.ts`
   - Create pages under `app/[locale]/`
   - Use the `Link` component from `i18n/routing.ts` instead of Next.js default

## 📝 Content Management

### Blog Posts
Create MDX files in `blogs/[locale]` with the following format:

```markdown
---
title: Post Title
description: Post Description
image: /image.png
slug: /url-path
tags: tag1,tag2
date: 2025-02-20
visible: published
pin: true
---

Post content...
```

Reference `types/blog.ts` for supported fields.

### Static Pages
Manage static page content in `content/[page]/[locale].mdx`.

## 🔍 SEO Optimization

Built-in comprehensive SEO features:
   - Server-side rendering and static generation
   - Automatic sitemap.xml generation
   - robots.txt configuration
   - Optimized metadata
   - Open Graph support
   - Multilingual SEO support

## 📊 Analytics

Enable analytics by adding IDs in `.env`:
```
NEXT_PUBLIC_GOOGLE_ANALYTICS=
NEXT_PUBLIC_BAIDU_TONGJI=
NEXT_PUBLIC_GOOGLE_ADSENSE=
```

## 🛠️ Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Shadcn/ui
- next-intl
- MDX
- Zustand
- Vercel

## One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/weijunext/nextjs-15-starter&project-name=&repository-name=nextjs-15-starter&demo-title=Nextjs15Starter&demo-description=Nextjs%2015%20starter.&demo-url=https://nextforge.dev&demo-image=https://nextforge.dev/og.png)

## 📄 License

MIT

## 🤝 Contributing

Issues and Pull Requests are welcome!

## About the Author

Next.js full-stack specialist providing expert services in project development, performance optimization, and SEO improvement.

For consulting and training opportunities, reach out at weijunext@gmail.com

- [Github](https://github.com/weijunext)
- [Bento](https://bento.me/weijunext)
- [Twitter/X](https://twitter.com/judewei_dev)

<a href="https://www.buymeacoffee.com/weijunext" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/G2G6TWWMG)