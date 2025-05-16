'use client'

import { Button } from '@nextui-org/button'
import { ChevronRight } from 'lucide-react'
import { GalgameCard } from '~/components/galgame/Card'
import { ResourceCard } from '~/components/resource/ResourceCard'
import { KunMasonryGrid } from '~/components/kun/MasonryGrid'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import type { HomeResource } from '~/types/api/home'
import { NsfwStatusBanner } from './NsfwStatusBanner'
import { useSettingStore } from '~/store/settingStore'

interface Props {
  galgames: GalgameCard[]
  resources: HomeResource[]
}

export const HomeContainer = ({ galgames, resources }: Props) => {
  const [windowWidth, setWindowWidth] = useState(640)
  const [isBannerVisible, setIsBannerVisible] = useState(true)
  const settings = useSettingStore((state) => state.data)

  // 初始化组件和处理窗口大小变化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 窗口大小调整处理
      setWindowWidth(window.innerWidth)
      const handleResize = () => {
        setWindowWidth(window.innerWidth)
      }
      window.addEventListener('resize', handleResize)

      // 检查是否刚刚切换了NSFW设置
      const nsfwSettingChanged = localStorage.getItem('nsfw-setting-changed')

      if (nsfwSettingChanged) {
        // 如果设置刚刚变更，确保横幅可见
        setIsBannerVisible(true)
        // 清除设置变更标志
        localStorage.removeItem('nsfw-setting-changed')
        localStorage.removeItem('nsfw-setting-previous')
      } else {
        // 如果没有设置变更，检查是否之前隐藏了横幅
        const bannerHidden = localStorage.getItem('nsfw-banner-hidden')
        if (bannerHidden) {
          setIsBannerVisible(false)
        }
      }

      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  // 处理横幅关闭
  const handleBannerClose = () => {
    setIsBannerVisible(false)
    localStorage.setItem('nsfw-banner-hidden', 'true')
  }

  return (
    <div className="mx-auto space-y-2 max-w-[1500px]">
      {isBannerVisible && (
        <div className="mb-2 bg-content1/40 p-3 mt-4 rounded-lg border border-default-200" data-nosnippet data-noindex>
          <NsfwStatusBanner onClose={handleBannerClose} />
        </div>
      )}
      <section className="space-y-6">
        <div className="flex flex-col space-y-2 mt-4">
          <div className="flex items-center justify-between ">
            <h2 className="text-lg font-bold sm:text-2xl">最新更新</h2>
            <Button
              variant="light"
              as={Link}
              color="primary"
              endContent={<ChevronRight className="size-4" />}
              href="/galgame"
            >
              查看更多
            </Button>
          </div>
        </div>

        {/* 使用瀑布流布局，适配移动设备和桌面设备 */}
        <KunMasonryGrid
          columnWidth={windowWidth >= 640 ? 220 : 150}
          gap={windowWidth >= 640 ? 16 : 8}
          className="mx-auto"
        >
          {galgames.map((galgame) => (
            <GalgameCard key={galgame.id} patch={galgame} />
          ))}
        </KunMasonryGrid>
      </section>
    </div>
  )
}
