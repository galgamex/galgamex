'use client'

import { useEffect, useState, useTransition } from 'react'
import { kunFetchPost } from '~/utils/kunFetch'
import { kunErrorHandler } from '~/utils/kunErrorHandler'
import { Chip } from '@nextui-org/react'
import { Key, Tag } from 'lucide-react'
import { KunLoading } from '~/components/kun/Loading'
import type { Dispatch, SetStateAction } from 'react'
import type { SearchSuggestionType } from '~/types/api/search'

interface Props {
  query: string
  setQuery: Dispatch<SetStateAction<string>>
  setSelectedSuggestions: Dispatch<SetStateAction<SearchSuggestionType[]>>
}

export const SearchSuggestion = ({
  query,
  setQuery,
  setSelectedSuggestions
}: Props) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestionType[]>([])
  const [isPending, startTransition] = useTransition()
  const queryArraySplitByBlank = query.split(' ')

  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([])
      return
    }

    startTransition(async () => {
      const res = await kunFetchPost<KunResponse<SearchSuggestionType[]>>(
        '/search/tag',
        { query: searchQuery.split('|').filter((term) => term.length > 0) }
      )

      kunErrorHandler(res, (value) => {
        setSuggestions(value)
      })
    })
  }

  useEffect(() => {
    if (query.trim()) {
      fetchSuggestions(query)
    } else {
      setSuggestions([])
    }
  }, [query])

  const handleClickSuggestion = (suggestions: SearchSuggestionType[]) => {
    setQuery('')
    setSelectedSuggestions((prev) => {
      const namesToRemove = new Set(suggestions.map((s) => s.name))
      const filtered = prev.filter((item) => !namesToRemove.has(item.name))
      return [...filtered, ...suggestions]
    })
  }

  const handleSelectMultiQueryKeywords = () => {
    const suggestions: SearchSuggestionType[] = queryArraySplitByBlank.map(
      (q) => ({
        type: 'keyword',
        name: q
      })
    )
    handleClickSuggestion(suggestions)
  }

  return (
    <div className="absolute z-50 w-full p-3 space-y-2 overflow-auto border shadow-lg max-h-96 rounded-2xl bg-content1 border-default-200">
      <p className="text-default-500">
        点击关键词按您的输入搜索, 点击标签使用多标签搜索
      </p>

      {/* <div
        className="p-1 cursor-pointer hover:bg-default-100 rounded-2xl"
        onClick={() =>
          handleClickSuggestion([{ type: 'keyword', name: query }])
        }
      >
        <div className="flex items-center gap-2">
          <Chip
            color="primary"
            variant="flat"
            startContent={<Key className="w-4 h-4" />}
          >
            关键词
          </Chip>
          <Chip color="primary" variant="flat">
            {query}
          </Chip>
        </div>
      </div> */}

      <div
        className="p-1 cursor-pointer hover:bg-default-100 rounded-2xl"
        onClick={handleSelectMultiQueryKeywords}
      >
        <div className="flex items-center gap-2">
          <Chip
            color="primary"
            variant="flat"
            startContent={<Key className="w-4 h-4" />}
          >
            关键词
          </Chip>
          {queryArraySplitByBlank.map((q, index) => (
            <Chip key={index} color="primary" variant="flat">
              {q}
            </Chip>
          ))}
        </div>
      </div>

      {isPending ? (
        <KunLoading hint="正在获取标签..." />
      ) : (
        suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="p-1 cursor-pointer hover:bg-default-100 rounded-2xl"
            onClick={() => handleClickSuggestion([suggestion])}
          >
            <div className="flex items-center gap-2">
              <span>
                {suggestion.type === 'tag' && (
                  <Chip
                    color="secondary"
                    variant="flat"
                    startContent={<Tag className="w-4 h-4" />}
                  >
                    标签
                  </Chip>
                )}
              </span>
              <span>{suggestion.name}</span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
