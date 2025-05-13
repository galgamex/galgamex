'use client'

import { useEffect, useState, useCallback, memo } from 'react'
import { kunFetchGet } from '~/utils/kunFetch'
import { GalgameCard } from './Card'
import { FilterBar } from './FilterBar'
import { useMounted } from '~/hooks/useMounted'
import { KunHeader } from '../kun/Header'
import { KunPagination } from '../kun/Pagination'
import { useRouter, useSearchParams } from 'next/navigation'
import { KunMasonryGrid } from '../kun/MasonryGrid'
import dynamic from 'next/dynamic'
import type { SortField, SortOrder } from './_sort'

// 使用React.memo优化卡片组件渲染
const MemoizedGalgameCard = memo(GalgameCard)

interface Props {
  initialGalgames: GalgameCard[]
  initialTotal: number
}

export const CardContainer = ({ initialGalgames, initialTotal }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isMounted = useMounted()

  const [galgames, setGalgames] = useState<GalgameCard[]>(initialGalgames)
  const [total, setTotal] = useState(initialTotal)
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<string>(
    searchParams.get('type') || 'all'
  )
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    searchParams.get('language') || 'all'
  )
  const [selectedPlatform, setSelectedPlatform] = useState<string>(
    searchParams.get('platform') || 'all'
  )
  const [sortField, setSortField] = useState<SortField>(
    (searchParams.get('sortField') as SortField) || 'resource_update_time'
  )
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    (searchParams.get('sortOrder') as SortOrder) || 'desc'
  )
  const [selectedYears, setSelectedYears] = useState<string[]>(
    JSON.parse(searchParams.get('selectedYears') as string || '["all"]')
  )
  const [selectedMonths, setSelectedMonths] = useState<string[]>(
    JSON.parse(searchParams.get('selectedMonths') as string || '["all"]')
  )
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    try {
      const tagParam = searchParams.get('selectedTags')
      return tagParam ? JSON.parse(tagParam) : []
    } catch (error) {
      console.error('解析标签参数错误:', error)
      return []
    }
  })
  const [availableTags, setAvailableTags] = useState<Array<{ id: number; name: string }>>([])
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 640)

  const updateUrl = useCallback((params: Record<string, string>) => {
    const urlParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      urlParams.set(key, value)
    })
    const queryString = urlParams.toString()
    const url = queryString ? `?${queryString}` : ''
    router.push(url)
  }, [router])

  // 防抖函数，减少不必要的URL更新
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  }

  const debouncedUpdateUrl = useCallback(debounce(updateUrl, 300), [updateUrl])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = debounce(() => {
        setWindowWidth(window.innerWidth)
      }, 100)

      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (!isMounted) {
      return
    }

    const params = {
      type: selectedType,
      language: selectedLanguage,
      platform: selectedPlatform,
      sortField,
      sortOrder,
      selectedYears: JSON.stringify(selectedYears),
      selectedMonths: JSON.stringify(selectedMonths),
      selectedTags: JSON.stringify(selectedTags),
      page: page.toString()
    }

    debouncedUpdateUrl(params)
  }, [
    selectedType,
    selectedLanguage,
    selectedPlatform,
    sortField,
    sortOrder,
    selectedYears,
    selectedMonths,
    selectedTags,
    page,
    isMounted,
    debouncedUpdateUrl
  ])

  // 获取可用标签列表 - 使用useCallback优化
  const fetchTags = useCallback(async () => {
    try {
      const response = await kunFetchGet<{
        tags: Array<{ id: number; name: string; count: number }>
        total: number
      }>('/tag/all', { page: 1, limit: 30 })

      if (response.tags) {
        setAvailableTags(response.tags)
      }
    } catch (error) {
      console.error('获取标签列表失败', error)
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      fetchTags()
    }
  }, [isMounted, fetchTags])

  // 优化游戏数据获取 - 使用useCallback减少重复创建函数
  const fetchPatches = useCallback(async () => {
    setLoading(true)

    // 处理标签ID
    const processedTagIds = selectedTags.length > 0
      ? JSON.stringify(selectedTags.map(id => Number(id)))
      : '';

    try {
      const { galgames, total } = await kunFetchGet<{
        galgames: GalgameCard[]
        total: number
      }>('/galgame', {
        selectedType,
        selectedLanguage,
        selectedPlatform,
        sortField,
        sortOrder,
        page,
        limit: 24,
        yearString: JSON.stringify(selectedYears),
        monthString: JSON.stringify(selectedMonths),
        tagIds: processedTagIds
      })

      setGalgames(galgames)
      setTotal(total)
    } catch (error) {
      console.error('获取游戏列表失败', error)
    } finally {
      setLoading(false)
    }
  }, [
    sortField,
    sortOrder,
    selectedType,
    selectedLanguage,
    selectedPlatform,
    page,
    selectedYears,
    selectedMonths,
    selectedTags
  ])

  useEffect(() => {
    if (!isMounted) {
      return
    }

    // 使用防抖来减少API调用频率
    const handler = setTimeout(() => {
      fetchPatches()
    }, 300)

    return () => clearTimeout(handler)
  }, [fetchPatches, isMounted])

  return (
    <div className="container mx-auto  space-y-6">
      <FilterBar
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        selectedPlatform={selectedPlatform}
        setSelectedPlatform={setSelectedPlatform}
        selectedYears={selectedYears}
        setSelectedYears={setSelectedYears}
        selectedMonths={selectedMonths}
        setSelectedMonths={setSelectedMonths}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        availableTags={availableTags}
      />

      <div className="mx-auto mb-8">
        <KunMasonryGrid
          columnWidth={windowWidth >= 640 ? 220 : 150}
          gap={windowWidth >= 640 ? 16 : 8}
          className="mx-auto"
        >
          {galgames.map((pa) => (
            <MemoizedGalgameCard key={pa.id} patch={pa} />
          ))}
        </KunMasonryGrid>
      </div>

      {total > 24 && (
        <div className="flex justify-center">
          <KunPagination
            total={Math.ceil(total / 24)}
            page={page}
            onPageChange={setPage}
            isLoading={loading}
          />
        </div>
      )}
    </div>
  )
}
