# Next Forge - 多言語対応 Next.js 15 スターター

グローバル対応のウェブサイトを素早く構築するための、機能豊富なNext.js 15多言語スターターテンプレートです。

- [👉 ソースコード](https://github.com/weijunext/nextjs-15-starter)
- [👉 デモサイト](https://nextforge.dev/)

## ✨ 主な機能

- 🌐 多言語対応（英語・中国語・日本語）
- 🎨 Tailwind CSSによるモダンなUI
- 🌙 ダーク/ライトテーマ切り替え
- 📱 レスポンシブデザイン
- 📝 MDXブログシステム 
- 🔍 SEO最適化
- 📊 アナリティクスツール統合
  - Google Analytics
  - Baidu Analytics
  - Google Adsense
  - Vercel Analytics

## 🚀 クイックスタート

1. リポジトリのクローン：
```bash
git clone https://github.com/weijunext/nextjs-15-starter.git
```

2. 依存関係のインストール：
```bash
npm install
# または
yarn
# または
pnpm install
```

3. 環境変数の設定：
```bash
cp .env.example .env
```

4. 開発サーバーの起動：
```bash
npm run dev
```

http://localhost:3000 にアクセスして確認できます。

## ⚙️ 設定方法

1. 基本設定
   - `config/site.ts`でウェブサイト情報を編集
   - `public/`内のアイコンとロゴを更新
   - `app/sitemap.ts`でサイトマップを設定
   - `app/robots.ts`でrobots.txtを更新

2. 多言語設定
   - `i18n/messages/`内の言語ファイルを追加/編集
   - `i18n/routing.ts`でサポートする言語を設定
   - `middleware.ts`で多言語ルーティングを設定
   - `app/[locale]/`配下にページを作成
   - Next.jsデフォルトの代わりに`i18n/routing.ts`の`Link`コンポーネントを使用

## 📝 コンテンツ管理

### ブログ投稿
`blogs/[locale]`にMDXファイルを以下のフォーマットで作成：

```markdown
---
title: 投稿タイトル
description: 投稿の説明
image: /image.png
slug: /url-path
tags: tag1,tag2
date: 2025-02-20
visible: published
pin: true
---

投稿内容...
```

対応フィールドについては`types/blog.ts`を参照してください。

### 静的ページ
`content/[page]/[locale].mdx`で静的ページのコンテンツを管理します。

## 🔍 SEO最適化

包括的なSEO機能を搭載：
   - サーバーサイドレンダリングと静的生成
   - sitemap.xml自動生成
   - robots.txt設定
   - 最適化されたメタデータ
   - OGP対応
   - 多言語SEOサポート

## 📊 アナリティクス

`.env`にIDを追加して有効化：
```
NEXT_PUBLIC_GOOGLE_ANALYTICS=
NEXT_PUBLIC_BAIDU_TONGJI=
NEXT_PUBLIC_GOOGLE_ADSENSE=
```

## 🛠️ 技術スタック

- Next.js 15
- TypeScript
- Tailwind CSS
- Shadcn/ui
- next-intl
- MDX
- Zustand
- Vercel

## ワンクリックデプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/weijunext/nextjs-15-starter&project-name=&repository-name=nextjs-15-starter&demo-title=Nextjs15Starter&demo-description=Nextjs%2015%20starter.&demo-url=https://nextforge.dev&demo-image=https://nextforge.dev/og.png)

## 📄 ライセンス

MIT

## 🤝 コントリビューション

Issue、PRは大歓迎です！

## 作者について

Next.jsのフルスタックスペシャリストとして、プロジェクト開発、パフォーマンス最適化、SEO改善のエキスパートサービスを提供しています。

コンサルティングやトレーニングについては、 weijunext@gmail.com までご連絡ください。

- [Github](https://github.com/weijunext)
- [Bento](https://bento.me/weijunext)
- [Twitter/X](https://twitter.com/judewei_dev)

<a href="https://www.buymeacoffee.com/weijunext" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/G2G6TWWMG)