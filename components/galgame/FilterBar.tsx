'use client'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@nextui-org/dropdown'
import { Button } from '@nextui-org/button'
import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { Divider } from '@nextui-org/divider'
import { Select, SelectItem } from '@nextui-org/select'
import { Chip } from '@nextui-org/chip'
import { Tooltip } from '@nextui-org/tooltip'
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Calendar,
  ChevronDown,
  Filter,
  SlidersHorizontal,
  X
} from 'lucide-react'
import {
  ALL_SUPPORTED_TYPE,
  SUPPORTED_TYPE_MAP,
  ALL_SUPPORTED_LANGUAGE,
  SUPPORTED_LANGUAGE_MAP,
  ALL_SUPPORTED_PLATFORM,
  SUPPORTED_PLATFORM_MAP
} from '~/constants/resource'
import { cn } from '~/utils/cn'
import type { SortField, SortOrder } from './_sort'
import { useState } from 'react'

interface Props {
  selectedType: string
  setSelectedType: (types: string) => void
  sortField: SortField
  setSortField: (option: SortField) => void
  sortOrder: SortOrder
  setSortOrder: (direction: SortOrder) => void
  selectedLanguage: string
  setSelectedLanguage: (language: string) => void
  selectedPlatform: string
  setSelectedPlatform: (platform: string) => void
  selectedYears: string[]
  setSelectedYears: (years: string[]) => void
  selectedMonths: string[]
  setSelectedMonths: (months: string[]) => void
  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
  availableTags?: Array<{ id: number; name: string }>
}

const sortFieldLabelMap: Record<string, string> = {
  resource_update_time: '资源更新时间',
  created: '游戏创建时间',
  view: '浏览量',
  download: '下载量',
  favorite: '收藏量'
}

const currentYear = new Date().getFullYear()
const GALGAME_SORT_YEARS = [
  'all',
  'future',
  'unknown',
  ...Array.from({ length: currentYear - 1979 }, (_, i) =>
    String(currentYear - i)
  )
]

const GALGAME_SORT_YEARS_MAP: Record<string, string> = {
  all: '全部年份',
  future: '未发售',
  unknown: '未知年份'
}

const GALGAME_SORT_MONTHS = [
  'all',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12'
]

// 月份芯片组件
interface MonthChipsProps {
  selectedMonths: string[]
  setSelectedMonths: (months: string[]) => void
}

const MonthChips = ({ selectedMonths, setSelectedMonths }: MonthChipsProps) => {
  const months = selectedMonths.filter(m => m !== 'all')

  // 创建一个月份渲染数组
  const monthChips = []

  // 手动循环添加每个月份芯片
  for (let i = 0; i < months.length; i++) {
    const month = months[i]
    monthChips.push(
      <Chip
        key={`month-${month}`}
        variant="flat"
        color="secondary"
        size="sm"
        onClose={() => {
          const newMonths = selectedMonths.filter(m => m !== month)
          setSelectedMonths(newMonths.length ? newMonths : ['all'])
        }}
      >
        {`${month}月`}
      </Chip>
    )
  }

  return (
    <div className="flex flex-wrap gap-1">
      {monthChips}
    </div>
  )
}

export const FilterBar = ({
  selectedType,
  setSelectedType,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  selectedLanguage,
  setSelectedLanguage,
  selectedPlatform,
  setSelectedPlatform,
  selectedYears,
  setSelectedYears,
  selectedMonths,
  setSelectedMonths,
  selectedTags,
  setSelectedTags,
  availableTags
}: Props) => {
  const [showAdvanced, setShowAdvanced] = useState(false)

  // 检查是否有任何筛选器被设置为非默认值
  const hasActiveFilters =
    selectedType !== 'all' ||
    selectedLanguage !== 'all' ||
    selectedPlatform !== 'all' ||
    !selectedYears.includes('all') ||
    !selectedMonths.includes('all') ||
    selectedTags.length > 0

  const resetFilters = () => {
    setSelectedType('all')
    setSelectedLanguage('all')
    setSelectedPlatform('all')
    setSelectedYears(['all'])
    setSelectedMonths(['all'])
    setSelectedTags([])
  }

  return (
    <Card className="w-full border border-default-100 bg-content1/50 backdrop-blur-lg shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-5 text-primary" />
          <h3 className="text-lg font-medium">筛选与排序</h3>

          {hasActiveFilters && (
            <Tooltip content="重置所有筛选">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-danger"
                onClick={resetFilters}
              >
                <X className="size-4" />
              </Button>
            </Tooltip>
          )}
        </div>

        <Button
          variant="light"
          size="sm"
          className="text-primary"
          onClick={() => setShowAdvanced(!showAdvanced)}
          endContent={
            <ChevronDown
              className={cn("size-4 transition-transform",
                showAdvanced ? "rotate-180" : ""
              )}
            />
          }
        >
          {showAdvanced ? "收起" : "高级筛选"}
        </Button>
      </CardHeader>

      <Divider />

      <CardBody className={cn("px-4 py-3 flex flex-col gap-4",
        !showAdvanced ? "sm:flex-row sm:items-center" : ""
      )}>
        <div className={cn("flex gap-2 flex-wrap",
          !showAdvanced ? "sm:w-3/4" : "pb-3"
        )}>
          {/* 类型筛选 */}
          <Dropdown className="w-full sm:w-auto">
            <DropdownTrigger>
              <Chip
                as="button"
                variant="flat"
                color={selectedType !== 'all' ? "primary" : "default"}
                startContent={<Filter className="size-3.5" />}
                endContent={<ChevronDown className="size-3.5" />}
                className="px-3 h-8"
              >
                {SUPPORTED_TYPE_MAP[selectedType]}
              </Chip>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="类型筛选"
              selectedKeys={[selectedType]}
              selectionMode="single"
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string
                if (selected) setSelectedType(selected)
              }}
            >
              {(() => {
                const items = []
                for (let i = 0; i < ALL_SUPPORTED_TYPE.length; i++) {
                  const type = ALL_SUPPORTED_TYPE[i]
                  items.push(
                    <DropdownItem key={type}>
                      {SUPPORTED_TYPE_MAP[type]}
                    </DropdownItem>
                  )
                }
                return items
              })()}
            </DropdownMenu>
          </Dropdown>

          {/* 语言筛选 */}
          <Dropdown className="w-full sm:w-auto">
            <DropdownTrigger>
              <Chip
                as="button"
                variant="flat"
                color={selectedLanguage !== 'all' ? "primary" : "default"}
                startContent={<Filter className="size-3.5" />}
                endContent={<ChevronDown className="size-3.5" />}
                className="px-3 h-8"
              >
                {SUPPORTED_LANGUAGE_MAP[selectedLanguage]}
              </Chip>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="语言筛选"
              selectedKeys={[selectedLanguage]}
              selectionMode="single"
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string
                if (selected) setSelectedLanguage(selected)
              }}
            >
              {(() => {
                const items = []
                for (let i = 0; i < ALL_SUPPORTED_LANGUAGE.length; i++) {
                  const language = ALL_SUPPORTED_LANGUAGE[i]
                  items.push(
                    <DropdownItem key={language}>
                      {SUPPORTED_LANGUAGE_MAP[language]}
                    </DropdownItem>
                  )
                }
                return items
              })()}
            </DropdownMenu>
          </Dropdown>

          {/* 平台筛选 */}
          <Dropdown className="w-full sm:w-auto">
            <DropdownTrigger>
              <Chip
                as="button"
                variant="flat"
                color={selectedPlatform !== 'all' ? "primary" : "default"}
                startContent={<Filter className="size-3.5" />}
                endContent={<ChevronDown className="size-3.5" />}
                className="px-3 h-8"
              >
                {SUPPORTED_PLATFORM_MAP[selectedPlatform]}
              </Chip>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="平台筛选"
              selectedKeys={[selectedPlatform]}
              selectionMode="single"
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string
                if (selected) setSelectedPlatform(selected)
              }}
            >
              {(() => {
                const items = []
                for (let i = 0; i < ALL_SUPPORTED_PLATFORM.length; i++) {
                  const platform = ALL_SUPPORTED_PLATFORM[i]
                  items.push(
                    <DropdownItem key={platform}>
                      {SUPPORTED_PLATFORM_MAP[platform]}
                    </DropdownItem>
                  )
                }
                return items
              })()}
            </DropdownMenu>
          </Dropdown>

          {/* 标签筛选 */}
          {availableTags && availableTags.length > 0 && (
            <Dropdown className="w-full sm:w-auto">
              <DropdownTrigger>
                <Chip
                  as="button"
                  variant="flat"
                  color={selectedTags.length > 0 ? "primary" : "default"}
                  startContent={<Filter className="size-3.5" />}
                  endContent={<ChevronDown className="size-3.5" />}
                  className="px-3 h-8"
                >
                  {selectedTags.length > 0 ? `已选${selectedTags.length}个标签` : "标签筛选"}
                </Chip>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="标签筛选"
                selectedKeys={selectedTags}
                selectionMode="multiple"
                onSelectionChange={(keys) => {
                  setSelectedTags(Array.from(keys) as string[])
                }}
                disallowEmptySelection={false}
                closeOnSelect={false}
              >
                {availableTags.map((tag) => {
                  const tagId = tag.id.toString();
                  const isSelected = selectedTags.includes(tagId);
                  return (
                    <DropdownItem
                      key={tagId}
                      startContent={isSelected ? <span className="text-primary">✓</span> : null}
                      className={isSelected ? "text-primary" : ""}
                    >
                      {tag.name}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </Dropdown>
          )}

          {/* 排序条件 */}
          <Dropdown className="w-full sm:w-auto">
            <DropdownTrigger>
              <Chip
                as="button"
                variant="flat"
                color="default"
                startContent={sortOrder === 'asc' ? <ArrowUpAZ className="size-3.5" /> : <ArrowDownAZ className="size-3.5" />}
                endContent={<ChevronDown className="size-3.5" />}
                className="px-3 h-8"
              >
                {sortFieldLabelMap[sortField]} {sortOrder === 'asc' ? '升序' : '降序'}
              </Chip>
            </DropdownTrigger>
            <DropdownMenu aria-label="排序选项">
              <DropdownItem key="header" className="text-primary font-medium opacity-70" isReadOnly>
                排序字段
              </DropdownItem>
              <DropdownItem key="resource_update_time"
                startContent={sortField === "resource_update_time" ? <span className="text-primary">✓</span> : null}
                onPress={() => setSortField("resource_update_time")}
              >
                {sortFieldLabelMap.resource_update_time}
              </DropdownItem>
              <DropdownItem key="created"
                startContent={sortField === "created" ? <span className="text-primary">✓</span> : null}
                onPress={() => setSortField("created")}
              >
                {sortFieldLabelMap.created}
              </DropdownItem>
              <DropdownItem key="view"
                startContent={sortField === "view" ? <span className="text-primary">✓</span> : null}
                onPress={() => setSortField("view")}
              >
                {sortFieldLabelMap.view}
              </DropdownItem>
              <DropdownItem key="download"
                startContent={sortField === "download" ? <span className="text-primary">✓</span> : null}
                onPress={() => setSortField("download")}
              >
                {sortFieldLabelMap.download}
              </DropdownItem>
              <DropdownItem key="favorite"
                startContent={sortField === "favorite" ? <span className="text-primary">✓</span> : null}
                onPress={() => setSortField("favorite")}
              >
                {sortFieldLabelMap.favorite}
              </DropdownItem>
              <DropdownItem key="divider" className="h-px bg-default-100" isReadOnly />
              <DropdownItem
                key="asc"
                startContent={<ArrowUpAZ className="size-4" />}
                onPress={() => setSortOrder('asc')}
                className={sortOrder === 'asc' ? "text-primary" : ""}
              >
                升序
              </DropdownItem>
              <DropdownItem
                key="desc"
                startContent={<ArrowDownAZ className="size-4" />}
                onPress={() => setSortOrder('desc')}
                className={sortOrder === 'desc' ? "text-primary" : ""}
              >
                降序
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* 排序选项 */}
        <div className={cn("flex-1",
          !showAdvanced ? "hidden" : "flex flex-col gap-4"
        )}>
          {showAdvanced && (
            <>
              <div className="flex flex-col w-full gap-4 sm:flex-row">
                <Select
                  disallowEmptySelection
                  label="发售年份"
                  placeholder="选择年份"
                  selectedKeys={selectedYears}
                  disabledKeys={['future']}
                  onSelectionChange={(keys) => {
                    if (keys.anchorKey === 'all') {
                      setSelectedYears(['all'])
                      setSelectedMonths(['all'])
                    } else {
                      setSelectedYears(
                        Array.from(keys as Set<string>).filter(
                          (item) => item !== 'all'
                        )
                      )
                    }
                  }}
                  startContent={<Calendar className="size-4 text-default-500" />}
                  selectionMode="multiple"
                  radius="lg"
                  size="sm"
                  variant="bordered"
                  classNames={{
                    base: "w-full sm:w-1/2",
                    trigger: "h-10",
                    value: "text-small"
                  }}
                >
                  {(() => {
                    const items = []
                    for (let i = 0; i < GALGAME_SORT_YEARS.length; i++) {
                      const year = GALGAME_SORT_YEARS[i]
                      items.push(
                        <SelectItem key={year} value={year}>
                          {GALGAME_SORT_YEARS_MAP[year] ?? year}
                        </SelectItem>
                      )
                    }
                    return items
                  })()}
                </Select>

                <Select
                  disallowEmptySelection
                  label="发售月份"
                  placeholder="选择月份"
                  selectedKeys={selectedMonths}
                  onSelectionChange={(keys) => {
                    if (keys.anchorKey === 'all') {
                      setSelectedMonths(['all'])
                    } else {
                      setSelectedMonths(
                        Array.from(keys as Set<string>).filter(
                          (item) => item !== 'all'
                        )
                      )
                    }
                  }}
                  startContent={<Calendar className="size-4 text-default-500" />}
                  selectionMode="multiple"
                  radius="lg"
                  size="sm"
                  variant="bordered"
                  isDisabled={
                    selectedYears.includes('all') || selectedYears.includes('future')
                  }
                  classNames={{
                    base: "w-full sm:w-1/2",
                    trigger: "h-10",
                    value: "text-small"
                  }}
                >
                  {(() => {
                    const items = []
                    for (let i = 0; i < GALGAME_SORT_MONTHS.length; i++) {
                      const month = GALGAME_SORT_MONTHS[i]
                      items.push(
                        <SelectItem key={month} value={month}>
                          {month === 'all' ? '全部月份' : month}
                        </SelectItem>
                      )
                    }
                    return items
                  })()}
                </Select>
              </div>

              {/* 选中的年份和月份展示区 */}
              {(!selectedYears.includes('all') || !selectedMonths.includes('all')) && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {/* 年份芯片 */}
                  {(() => {
                    const items = []
                    const yearsToShow = selectedYears.filter(y => y !== 'all')
                    for (let i = 0; i < yearsToShow.length; i++) {
                      const year = yearsToShow[i]
                      items.push(
                        <Chip
                          key={`year-${year}`}
                          variant="flat"
                          color="primary"
                          size="sm"
                          onClose={() => {
                            const newYears = selectedYears.filter(y => y !== year)
                            setSelectedYears(newYears.length ? newYears : ['all'])
                          }}
                        >
                          {GALGAME_SORT_YEARS_MAP[year] ?? year}
                        </Chip>
                      )
                    }
                    return items
                  })()}

                  {/* 月份芯片 */}
                  {!selectedMonths.includes('all') && !selectedYears.includes('all') && (
                    <MonthChips
                      selectedMonths={selectedMonths}
                      setSelectedMonths={setSelectedMonths}
                    />
                  )}
                </div>
              )}

              {/* 选中的标签展示区 */}
              {selectedTags.length > 0 && showAdvanced && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {availableTags
                    ?.filter(tag => selectedTags.includes(tag.id.toString()))
                    .map(tag => (
                      <Chip
                        key={`tag-${tag.id}`}
                        variant="flat"
                        color="secondary"
                        size="sm"
                        onClose={() => {
                          setSelectedTags(selectedTags.filter(id => id !== tag.id.toString()))
                        }}
                      >
                        {tag.name}
                      </Chip>
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      </CardBody>
    </Card>
  )
}
