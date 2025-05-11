import { Suspense } from 'react'
import { TagDetailContainer } from '~/components/tag/detail/Container'
import { generateKunMetadataTemplate } from './metadata'
import { kunGetTagByIdActions, kunTagGalgameActions } from './actions'
import { ErrorComponent } from '~/components/error/ErrorComponent'
import Script from 'next/script'
import Head from 'next/head'
import type { Metadata } from 'next'
import type { SortField } from '~/components/tag/detail/_sort'

// 提高缓存时间以改善性能
export const revalidate = 1800 // 30分钟

interface Props {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ page?: number; sortField: SortField }>
}

export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  const { id } = await params
  const tag = await kunGetTagByIdActions({ tagId: Number(id) })
  if (typeof tag === 'string') {
    return {}
  }
  return generateKunMetadataTemplate(tag)
}

export default async function Kun({ params, searchParams }: Props) {
  const { id } = await params
  const res = await searchParams
  const sortField = res?.sortField ? res.sortField : 'created'
  const currentPage = res?.page ? res.page : 1

  try {
    // 获取标签信息
    const tag = await kunGetTagByIdActions({ tagId: Number(id) })
    if (typeof tag === 'string') {
      return <ErrorComponent error={tag} />
    }

    // 获取标签下的游戏列表
    const response = await kunTagGalgameActions({
      tagId: Number(id),
      page: currentPage,
      limit: 24,
      sortField
    })
    if (typeof response === 'string') {
      return <ErrorComponent error={response} />
    }

    // 创建结构化数据以提升SEO
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': `${tag.name} - 标签游戏列表`,
      'description': tag.introduction || `${tag.name}标签下的所有游戏资源`,
      'about': {
        '@type': 'Thing',
        'name': tag.name,
        'description': tag.introduction || `${tag.name}相关游戏的集合`,
        'alternateName': tag.alias
      },
      'itemListElement': response.galgames.map((game, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'SoftwareApplication',
          'name': game.name,
          'applicationCategory': 'Game',
          'image': game.banner
        }
      }))
    }

    // 为上部可见区域的图片生成预加载链接
    const preloadImages = response.galgames.slice(0, 4).map(game => {
      const imageUrl = game.banner ? game.banner.replace(/\.avif$/, '-mini.avif') : '/touchgal.avif'
      return imageUrl
    })

    return (
      <>
        {/* 添加图片预加载 */}
        <Head>
          {preloadImages.map((imageUrl, index) => (
            <link
              key={`preload-${index}`}
              rel="preload"
              as="image"
              href={imageUrl}
              fetchPriority={index < 2 ? "high" : "auto"}
            />
          ))}
        </Head>

        {/* 添加结构化数据标记 */}
        <Script
          id="tag-page-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <Suspense fallback={
          <div className="w-full my-4 space-y-6">
            {/* 标签头部骨架屏 */}
            <div className="w-full bg-content1/50 p-4 backdrop-blur-lg">
              <div className="h-8 w-1/4 bg-default-200 animate-pulse mb-2 rounded-sm"></div>
              <div className="h-4 w-1/2 bg-default-200 animate-pulse rounded-sm"></div>
            </div>

            {/* 游戏列表骨架屏 */}
            <div className="w-full max-w-[1500px] mx-auto grid grid-cols-2 gap-2 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="w-full">
                  <div className="w-full bg-default-200 animate-pulse" style={{ aspectRatio: '2/3' }}></div>
                  <div className="h-6 w-3/4 bg-default-200 animate-pulse mt-2 rounded-sm"></div>
                </div>
              ))}
            </div>
          </div>
        }>
          <TagDetailContainer
            initialTag={tag}
            initialPatches={response.galgames}
            total={response.total}
          />
        </Suspense>
      </>
    )
  } catch (error) {
    console.error('标签页加载错误:', error)
    return <ErrorComponent error="获取标签数据失败，请稍后再试" />
  }
}
