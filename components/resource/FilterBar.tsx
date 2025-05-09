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
import { ArrowDownAZ, ArrowUpAZ, ChevronDown, SlidersHorizontal } from 'lucide-react'
import type { SortDirection, SortOption } from './_sort'

interface Props {
  sortField: SortOption
  setSortField: (option: SortOption) => void
  sortOrder: SortDirection
  setSortOrder: (direction: SortDirection) => void
}

const sortFieldLabelMap: Record<string, string> = {
  created: '创建时间',
  download: '下载数',
  like: '点赞数'
}

export const FilterBar = ({
  sortField,
  setSortField,
  sortOrder,
  setSortOrder
}: Props) => {
  return (
    <Card className="w-full border border-content2 bg-content1/50 backdrop-blur-lg shadow-sm">
      <CardBody className="p-3">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="size-4 text-default-500" />
          <span className="text-sm font-medium">排序方式：</span>

          <Dropdown>
            <DropdownTrigger>
              <Chip
                as="button"
                variant="flat"
                color="default"
                endContent={<ChevronDown className="size-3.5" />}
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
                if (selected) setSortField(selected as SortOption)
              }}
            >
              {Object.entries(sortFieldLabelMap).map(([key, label]) => (
                <DropdownItem key={key}>
                  {label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <Chip
                as="button"
                variant="flat"
                color="default"
                startContent={sortOrder === 'asc' ? <ArrowUpAZ className="size-3.5" /> : <ArrowDownAZ className="size-3.5" />}
                className="px-3 h-8"
              >
                {sortOrder === 'asc' ? '升序' : '降序'}
              </Chip>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="排序方向"
              selectedKeys={[sortOrder]}
              selectionMode="single"
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string
                if (selected) setSortOrder(selected as SortDirection)
              }}
            >
              <DropdownItem
                key="asc"
                startContent={<ArrowUpAZ className="size-4" />}
              >
                升序
              </DropdownItem>
              <DropdownItem
                key="desc"
                startContent={<ArrowDownAZ className="size-4" />}
              >
                降序
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardBody>
    </Card>
  )
}
