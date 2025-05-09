'use client'

import { Button } from '@nextui-org/button'
import { Link } from '@nextui-org/link'
import { Card, CardBody } from '@nextui-org/card'
import { Chip } from '@nextui-org/chip'
import { Sparkles } from 'lucide-react'
import { KunCarousel } from '../carousel/KunCarousel'
import { getKunPosts } from '../carousel/mdx'
import { RandomGalgameButton } from '../carousel/RandomGalgameButton'
import { Telegram } from '~/components/kun/icons/Telegram'
import { KunHomeNavigationItems } from '../NavigationItems'
import { kunMoyuMoe } from '~/config/moyu-moe'
import { useEffect, useState } from 'react'
import type { HomeCarouselMetadata } from '../carousel/mdx'

export const HomeHero = () => {
  const [posts, setPosts] = useState<HomeCarouselMetadata[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getKunPosts()
        setPosts(fetchedPosts)
      } catch (error) {
        console.error('Failed to fetch carousel posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="w-full mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-6 min-h-[300px]">
        <div className="flex-col justify-center hidden space-y-2 sm:flex sm:space-y-6">
          <Card className="h-full border-none bg-gradient-to-br from-primary-500/20 via-secondary-500/20 to-success-500/20">
            <CardBody className="flex justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-500" />
                <Chip color="primary" variant="flat">
                  欢迎来到 TouchGal
                </Chip>
              </div>

              <div className="space-y-4">
                <h1 className="py-1 text-3xl font-bold text-transparent xl:text-4xl bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text">
                  一站式 Galgame 文化社区！
                </h1>
                <p className="text-md text-default-600">
                  免费, 高质量的 Galgame 资源下载站
                </p>
              </div>

              <div className="flex items-center gap-2">
                <RandomGalgameButton color="primary" variant="solid">
                  随机一部游戏
                </RandomGalgameButton>
                <Button
                  isIconOnly
                  isExternal
                  as={Link}
                  href={kunMoyuMoe.domain.telegram_group}
                  variant="flat"
                  color="secondary"
                >
                  <Telegram />
                </Button>
              </div>
            </CardBody>
          </Card>

          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            <KunHomeNavigationItems buttonSize="lg" />
          </div>
        </div>

        {!loading && posts.length > 0 && <KunCarousel posts={posts} />}
      </div>
    </div>
  )
}
