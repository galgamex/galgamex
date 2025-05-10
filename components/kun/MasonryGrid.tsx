'use client'

import { useEffect, useRef, useState } from 'react'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { cn } from '~/utils/cn'

interface KunMasonryGridProps {
  children: React.ReactNode[]
  columnWidth?: number
  gap?: number
  className?: string
}

export const KunMasonryGrid = ({
  children,
  columnWidth = 256,
  gap = 24,
  className
}: KunMasonryGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const { width: containerWidth } = useResizeObserver(containerRef)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const calculateColumns = () => {
      if (!containerWidth) {
        return
      }

      const newColumns = Math.max(
        1,
        Math.floor((containerWidth + gap) / (columnWidth + gap))
      )

      setColumns(newColumns)
      if (!isLoaded) setIsLoaded(true)
    }

    calculateColumns()
  }, [containerWidth, columnWidth, gap, isLoaded])

  const distributeItems = () => {
    if (!Array.isArray(children)) {
      return []
    }

    const columnHeights = Array(columns).fill(0)
    const columnItems: React.ReactNode[][] = Array(columns)
      .fill(null)
      .map(() => [])

    children.forEach((child) => {
      if (!child) {
        return
      }
      const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights))
      columnItems[shortestColumn].push(child)
      columnHeights[shortestColumn]++
    })

    return columnItems
  }

  // 只在客户端渲染时设置动态样式
  const gridStyle = isMounted
    ? {
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      gap: `${gap}px`,
      maxWidth: '100%'
    }
    : {
      // 使用初始静态样式，避免水合不匹配
      display: 'grid',
      maxWidth: '100%'
    };

  const columnStyle = isMounted
    ? { gap: `${gap}px` }
    : {}; // 服务器端初始渲染时不设置column间距样式

  return (
    <div
      ref={containerRef}
      className={cn(
        'w-full grid transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={gridStyle}
    >
      {distributeItems().map((column, columnIndex) => (
        <div
          key={columnIndex}
          className="flex flex-col"
          style={columnStyle}
        >
          {column.map((item, itemIndex) => (
            <div key={itemIndex} className="w-full">
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
