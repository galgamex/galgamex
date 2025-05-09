'use client'

import { useEffect, useState } from 'react'
import { kunFetchGet } from '~/utils/kunFetch'
import { GalgameCard } from './Card'
import { FilterBar } from './FilterBar'
import { useMounted } from '~/hooks/useMounted'
import { KunHeader } from '../kun/Header'
import { KunPagination } from '../kun/Pagination'
import { useRouter, useSearchParams } from 'next/navigation'
import { KunMasonryGrid } from '../kun/MasonryGrid'
import type { SortField, SortOrder } from './_sort'

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
    JSON.parse(searchParams.get('selectedYears') as string) || ['all']
  )
  const [selectedMonths, setSelectedMonths] = useState<string[]>(
    JSON.parse(searchParams.get('selectedMonths') as string) || ['all']
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
  const [windowWidth, setWindowWidth] = useState(640)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth)

      const handleResize = () => {
        setWindowWidth(window.innerWidth)
      }

      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (!isMounted) {
      return
    }
    const params = new URLSearchParams()

    params.set('type', selectedType)
    params.set('language', selectedLanguage)
    params.set('platform', selectedPlatform)
    params.set('sortField', sortField)
    params.set('sortOrder', sortOrder)
    params.set('selectedYears', JSON.stringify(selectedYears))
    params.set('selectedMonths', JSON.stringify(selectedMonths))
    params.set('selectedTags', JSON.stringify(selectedTags))
    params.set('page', page.toString())

    const queryString = params.toString()
    const url = queryString ? `?${queryString}` : ''

    router.push(url)
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
    router
  ])

  // 获取可用标签列表
  const fetchTags = async () => {
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
  }

  useEffect(() => {
    if (isMounted) {
      fetchTags()
    }
  }, [isMounted])

  const fetchPatches = async () => {
    setLoading(true)

    // 添加调试日志
    console.log('标签筛选:', selectedTags);

    // 由于使用了toString()，标签ID可能是字符串格式，需要转换回数字
    const processedTagIds = selectedTags.length > 0
      ? JSON.stringify(selectedTags.map(id => Number(id)))
      : '';

    console.log('处理后的标签ID:', processedTagIds);

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
    setLoading(false)
  }

  useEffect(() => {
    if (!isMounted) {
      return
    }
    fetchPatches()
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

  return (
    <div className="container mx-auto my-4 space-y-6">
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
            <GalgameCard key={pa.id} patch={pa} />
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
