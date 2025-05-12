// import { fileURLToPath } from 'url'
import { env } from './validations/dotenv-check'
import createMDX from '@next/mdx'
import type { NextConfig } from 'next'
// import remarkGfm from 'remark-gfm'
// import rehypeSlug from 'rehype-slug'
// import rehypeAutolinkHeadings from 'rehype-autolink-headings'
// import rehypePrettyCode from 'rehype-pretty-code'
import path from 'path'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

const PRODUCTION_DOMAIN = 'https://www.galgamex.net'

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  transpilePackages: ['next-mdx-remote'],
  publicRuntimeConfig: {
    NODE_ENV: env.data!.NODE_ENV
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: {
    ignoreBuildErrors: true
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: env.data!.KUN_VISUAL_NOVEL_IMAGE_BED_HOST,
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'img.touchgalstatic.org',
        port: '',
        pathname: '/**'
      }
    ],

    minimumCacheTTL: 60 * 60 * 24 * 7,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // 使用标准输出模式，确保资源路径正确
  distDir: '.next',
  // 确保在生产环境中使用正确的资源前缀，但不使用特定域名
  // 这可以确保相对路径能正常工作，避免跨域问题
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  basePath: '',
  poweredByHeader: false,

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // 从experimental中移出到根级别
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,

  experimental: {
    // 禁用这些可能导致问题的实验性功能
    optimizeCss: false,
    serverActions: {
      allowedOrigins: ["www.galgamex.net", "localhost", "localhost:3000"]
    },
    // 这些选项保留在experimental中
    clientRouterFilter: false,
    strictNextHead: false,
    optimizePackageImports: [
      '@nextui-org/react',
      '@tabler/icons-react',
      'framer-motion',
      'react-hot-toast',
      'lucide-react'
    ],
  },
  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    }

    if (!dev && !isServer) {
      // 确保输出的文件名格式简单一致
      config.output.filename = 'static/chunks/[name].[contenthash:8].js'
      config.output.chunkFilename = 'static/chunks/[name].[contenthash:8].js'

      // 为客户端组件添加更灵活的分块策略，特别关注doc和leaderboard路径
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 30,
          minSize: 20000,
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            commons: {
              name: 'commons',
              minChunks: 3,
              priority: -30,
              reuseExistingChunk: true,
            },
            docPage: {
              test: /[\\/]app[\\/]doc[\\/]/,
              name: 'doc-bundle',
              priority: 10,
              reuseExistingChunk: true,
            },
            leaderboard: {
              test: /[\\/]app[\\/]leaderboard[\\/]/,
              name: 'leaderboard-bundle',
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      }
    }

    return config
  }
}

// Turbopack compatible errors
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // remarkPlugins: [remarkGfm],
    rehypePlugins: [
      // rehypeSlug,
      // [
      //   rehype - autolink - headings,
      //   {
      //     properties: {
      //       className: ['anchor'],
      //     },
      //   },
      // ],
      // [
      //   rehypePrettyCode,
      //   {
      //     theme: 'github-dark',
      //   },
      // ],
    ]
  }
})

export default withMDX(nextConfig)
