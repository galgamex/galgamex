'use client'

import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Checkbox
} from '@nextui-org/react'
import { Settings } from 'lucide-react'
import { useSearchStore } from '~/store/searchStore'

export const SearchOption = () => {
  const searchData = useSearchStore((state) => state.data)
  const setSearchData = useSearchStore((state) => state.setData)

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button isIconOnly variant="flat" color="primary">
          <Settings className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col flex-wrap gap-3 p-3">
          <Checkbox
            isSelected={searchData.searchInIntroduction}
            onValueChange={(checked) =>
              setSearchData({ ...searchData, searchInIntroduction: checked })
            }
          >
            包含简介
          </Checkbox>
          <Checkbox
            isSelected={searchData.searchInAlias}
            onValueChange={(checked) =>
              setSearchData({ ...searchData, searchInAlias: checked })
            }
          >
            包含别名
          </Checkbox>
          <Checkbox
            isSelected={searchData.searchInTag}
            onValueChange={(checked) =>
              setSearchData({ ...searchData, searchInTag: checked })
            }
          >
            包含标签
          </Checkbox>
        </div>
      </PopoverContent>
    </Popover>
  )
}
