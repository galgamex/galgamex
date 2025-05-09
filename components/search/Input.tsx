'use client'

import { useRef, useState } from 'react'
import { Button, Chip } from '@nextui-org/react'
import { cn } from '~/utils/cn'
import type { SearchSuggestionType } from '~/types/api/search'
import type {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction
} from 'react'

interface Props {
  query: string
  setQuery: Dispatch<SetStateAction<string>>
  setShowSuggestions: Dispatch<SetStateAction<boolean>>
  selectedSuggestions: SearchSuggestionType[]
  setSelectedSuggestions: Dispatch<SetStateAction<SearchSuggestionType[]>>
  setShowHistory: Dispatch<SetStateAction<boolean>>
}

export const SearchInput = ({
  query,
  setQuery,
  setShowSuggestions,
  selectedSuggestions,
  setSelectedSuggestions,
  setShowHistory
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
    if (!event.target.value.trim()) {
      setShowSuggestions(false)
      setShowHistory(true)
    } else {
      setShowSuggestions(true)
      setShowHistory(false)
    }
  }

  const handleInputFocus = () => {
    setIsFocused(true)
    if (!query.trim()) {
      setShowHistory(true)
    } else {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    setIsFocused(false)
    setTimeout(() => {
      setShowHistory(false)
      setShowSuggestions(false)
    }, 100)
  }

  const handleRemoveChip = (nameToRemove: string) => {
    setSelectedSuggestions((prevSuggestions) =>
      prevSuggestions.filter((suggestion) => suggestion.name !== nameToRemove)
    )
    inputRef.current?.focus()
  }

  const handleExecuteSearch = () => {
    if (!query.trim()) {
      return
    }
    const queryArraySplitByBlank = query.trim().split(' ')
    const suggestions: SearchSuggestionType[] = queryArraySplitByBlank.map(
      (q) => ({
        type: 'keyword',
        name: q
      })
    )
    setSelectedSuggestions((prev) => {
      const namesToRemove = new Set(suggestions.map((s) => s.name))
      const filtered = prev.filter((item) => !namesToRemove.has(item.name))
      return [...filtered, ...suggestions]
    })
    setQuery('')
  }

  const [canDeleteTag, setCanDeleteTag] = useState(false)
  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (selectedSuggestions.length || !query.length) {
      setCanDeleteTag(false)
    }

    if (
      event.key === 'Backspace' &&
      selectedSuggestions.length &&
      !query.trim()
    ) {
      if (canDeleteTag) {
        setSelectedSuggestions((prev) => prev.slice(0, -1))
      } else {
        setCanDeleteTag(true)
      }
    } else if (event.key === 'Enter') {
      handleExecuteSearch()
    }
  }

  return (
    <div
      className={cn(
        'flex gap-2 p-3 bg-default-100 rounded-large transition-all duration-200',
        isFocused ? 'ring-2 ring-primary ring-offset-2' : ''
      )}
    >
      <div className="flex flex-wrap items-center w-full gap-2">
        {selectedSuggestions.map((suggestion, index) => (
          <Chip
            key={index}
            variant="flat"
            color={suggestion.type === 'keyword' ? 'primary' : 'secondary'}
            onClose={() => handleRemoveChip(suggestion.name)}
          >
            {suggestion.name}
          </Chip>
        ))}

        <input
          ref={inputRef}
          autoFocus
          className="placeholder-default-500 text-default-700 min-w-[120px] flex-grow bg-transparent outline-none"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyUp={(e) => handleKeyUp(e)}
          placeholder="输入内容, 点击按钮或回车创建关键词"
        />

        <Button color="primary" onPress={handleExecuteSearch}>
          搜索
        </Button>
      </div>
    </div>
  )
}
