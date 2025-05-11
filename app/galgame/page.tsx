import { CardContainer } from '~/components/galgame/Container'
import { kunMetadata } from './metadata'
import { Suspense } from 'react'
import { kunGetActions } from './actions'
import { ErrorComponent } from '~/components/error/ErrorComponent'
import Script from 'next/script'
import Head from 'next/head'
import type { Metadata } from 'next'
import type { SortField, SortOrder } from '~/components/galgame/_sort'

// 设置ISR缓存时间，提高性能并保持内容相对新鲜
export const revalidate = 60 * 30 // 30分钟缓存

export const metadata: Metadata = kunMetadata

interface QueryParams {
  page?: number
  sortOrder: SortOrder
  sortField: SortField
  type: string
  language: string
  platform: string
  selectedYears?: string
  selectedMonths?: string
  selectedTags?: string
}

interface Props {
  searchParams?: Promise<QueryParams>
}

export default async function Kun({ searchParams }: Props) {
  const res = await searchParams
  const currentPage = res?.page ? res.page : 1
  const sortField = res?.sortField ? res.sortField : 'resource_update_time'
  const sortOrder = res?.sortOrder ? res.sortOrder : 'desc'

  const selectedType = res?.type ? res.type : 'all'
  const selectedLanguage = res?.language ? res.language : 'all'
  const selectedPlatform = res?.platform ? res.platform : 'all'

  const selectedYears = res?.selectedYears ? res.selectedYears : JSON.stringify(['all'])
  const selectedMonths = res?.selectedMonths ? res.selectedMonths : JSON.stringify(['all'])
  const selectedTags = res?.selectedTags || ''

  // 使用try-catch包装API调用，避免未处理的异常
  try {
    const response = await kunGetActions({
      selectedType,
      selectedLanguage,
      selectedPlatform,
      sortField,
      sortOrder,
      page: currentPage,
      limit: 24,
      yearString: selectedYears,
      monthString: selectedMonths,
      tagIds: selectedTags
    })

    if (typeof response === 'string') {
      return <ErrorComponent error={response} />
    }

    // 创建结构化数据以提升SEO
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'itemListElement': response.galgames.map((game, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'SoftwareApplication',
          'name': game.name,
          'applicationCategory': 'Game',
          'operatingSystem': game.platform?.join(', '),
          'description': `${game.name} - Galgame 资源`,
          'image': game.banner
        }
      }))
    }

    // 为上部可见区域的图片生成预加载链接
    const preloadImages = response.galgames.slice(0, 8).map(game => {
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
              // 仅为前4张图片添加高优先级
              {...(index < 4 ? { fetchPriority: "high" } : {})}
            />
          ))}
        </Head>

        {/* 添加结构化数据标记 */}
        <Script
          id="game-list-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* 使用骨架屏提示加载状态 */}
        <Suspense fallback={
          <div className="min-h-screen w-full flex items-center justify-center">
            <div className="w-full max-w-[1500px] grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 p-4">
              {Array(12).fill(0).map((_, i) => (
                <div key={i} className="w-full">
                  <div className="w-full bg-default-200 animate-pulse" style={{ aspectRatio: '4/6' }}></div>
                  <div className="h-6 w-3/4 bg-default-200 animate-pulse mt-2 rounded-sm"></div>
                </div>
              ))}
            </div>
          </div>
        }>
          <CardContainer
            initialGalgames={response.galgames}
            initialTotal={response.total}
          />
        </Suspense>
      </>
    )
  } catch (error) {
    console.error('游戏列表页加载错误:', error)
    return <ErrorComponent error="获取游戏列表失败，请稍后再试" />
  }
}
