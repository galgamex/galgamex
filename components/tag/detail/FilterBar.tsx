'use client'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@nextui-org/dropdown'
import { Button } from '@nextui-org/button'
import { Card, CardBody } from '@nextui-org/card'
import { Chip } from '@nextui-org/chip'
import { ChevronDown, Tag, BarChart2 } from 'lucide-react'
import type { SortField } from './_sort'

interface Props {
  sortField: SortField
  setSortField: (option: SortField) => void
}

const sortFieldLabelMap: Record<string, string> = {
  resource_update_time: '资源更新时间',
  created: '游戏创建时间',
  view: '浏览量',
  download: '下载量'
}

export const FilterBar = ({ sortField, setSortField }: Props) => {
  return (
    <Card className="w-full border border-default-100 bg-content1/50 backdrop-blur-lg shadow-sm">
      <CardBody className="p-3">
        <div className="flex items-center gap-3">
          <Tag className="size-4 text-primary-400" />
          <span className="text-sm font-medium">标签内容排序：</span>

          <Dropdown>
            <DropdownTrigger>
              <Chip
                as="button"
                variant="flat"
                color="primary"
                endContent={<ChevronDown className="size-3.5" />}
                startContent={<BarChart2 className="size-3.5" />}
                className="px-3 h-8"
              >
                {sortFieldLabelMap[sortField]}
              </Chip>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="排序选项"
              selectedKeys={[sortField]}
              selectionMode="single"
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string
                if (selected) setSortField(selected as SortField)
              }}
            >
              {Object.entries(sortFieldLabelMap).map(([key, label]) => (
                <DropdownItem
                  key={key}
                  startContent={sortField === key ? <span className="text-primary">✓</span> : null}
                >
                  {label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardBody>
    </Card>
  )
}
