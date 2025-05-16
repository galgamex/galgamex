'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardBody } from '@nextui-org/card'
import { Divider } from '@nextui-org/divider'
import { Chip, Tooltip } from '@nextui-org/react'
import { KunCardStats } from '~/components/kun/CardStats'
import { KunUser } from '~/components/kun/floating-card/KunUser'
import { formatDistanceToNow } from '~/utils/formatDistanceToNow'
import { formatDate } from '~/utils/time'
import { Calendar, Clock, Link as LinkIcon, RefreshCw } from 'lucide-react'
import {
  GALGAME_AGE_LIMIT_DETAIL,
  GALGAME_AGE_LIMIT_MAP
} from '~/constants/galgame'
import { PatchHeaderActions } from './Actions'
import { Tags } from './Tags'
import Image from 'next/image'
import { EditBanner } from './EditBanner'
import type { Patch, PatchIntroduction } from '~/types/api/patch'

interface PatchHeaderInfoProps {
  patch: Patch
  intro: PatchIntroduction
  handleClickDownloadNav: () => void
}

export const PatchHeaderInfo = ({
  patch,
  intro,
  handleClickDownloadNav
}: PatchHeaderInfoProps) => {
  const [aspectRatio, setAspectRatio] = useState<'portrait' | 'landscape'>('portrait')
  const processedBannerRef = useRef<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  // 预先加载图片并静默确定比例
  useEffect(() => {
    // 如果是同一个banner且已经处理过，则跳过
    if (processedBannerRef.current === patch.banner) {
      return
    }

    // 创建一个隐藏的图片元素来预加载并获取尺寸
    const img = new window.Image()
    img.onload = () => {
      // 静默确定比例，避免用户感知切换过程
      setAspectRatio(img.width > img.height ? 'landscape' : 'portrait')
      // 记录已处理过的banner URL
      processedBannerRef.current = patch.banner
    }
    img.src = patch.banner
  }, [patch.banner]) // 保持依赖数组不变

  // 设定响应式布局的类名
  const imageSectionClass = aspectRatio === 'portrait'
    ? 'w-full md:w-1/4 md:max-w-[300px]'
    : 'w-full md:w-1/3 md:max-w-[400px]'

  const contentSectionClass = aspectRatio === 'landscape'
    ? 'md:w-2/3'
    : 'md:w-3/4'

  // 图片容器比例样式
  const imageContainerStyle = {
    aspectRatio: aspectRatio === 'portrait' ? '2/3' : '4/3',
    transition: 'aspect-ratio 0.5s ease'
  }

  return (
    <Card className="overflow-hidden shadow-sm border-none">
      <CardBody className="p-0">
        <div className="flex flex-col md:flex-row">
          <div
            className={`relative transition-all duration-500 ${imageSectionClass} p-4`}
            style={{ transition: 'width 0.5s ease' }}
          >
            <div
              className="relative w-full h-full overflow-hidden rounded-xl shadow-md"
              style={imageContainerStyle}
            >
              <div
                className={`absolute inset-0 animate-pulse bg-default-100 ${imageLoaded ? 'opacity-0' : 'opacity-90'
                  } transition-opacity duration-300`}
              />
              <Image
                src={patch.banner}
                alt={patch.name}
                className={`object-cover transition-all duration-500 ${imageLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
                  }`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
                onLoad={() => setImageLoaded(true)}
                unoptimized
              />
              <Tooltip content={GALGAME_AGE_LIMIT_DETAIL[patch.contentLimit]}>
                <Chip
                  color={patch.contentLimit === 'sfw' ? 'success' : 'danger'}
                  variant="flat"
                  className="absolute top-2 right-2 z-10 backdrop-blur-sm bg-background/40"
                >
                  {GALGAME_AGE_LIMIT_MAP[patch.contentLimit]}
                </Chip>
              </Tooltip>
              <EditBanner patch={patch} />
            </div>
          </div>

          <div
            className={`flex flex-col p-6 flex-1 gap-4 ${contentSectionClass}`}
            style={{ transition: 'width 0.5s ease' }}
          >
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {patch.name}
                </h1>
              </div>

              {intro.alias.length > 0 && (
                <div className="mt-3">
                  <h3 className="text-sm font-medium mb-1">游戏别名</h3>
                  <div className="flex flex-wrap gap-1">
                    {intro.alias.map((alias) => (
                      <Chip key={alias} size="sm" variant="flat" color="default">{alias}</Chip>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 mt-3">
                <div className="flex items-center gap-2 text-sm text-default-500">
                  <Clock className="size-4" />
                  <span>发布时间: {formatDate(intro.created, { isShowYear: true })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-default-500">
                  <RefreshCw className="size-4" />
                  <span>更新时间: {formatDate(intro.updated, { isShowYear: true })}</span>
                </div>
                {intro.released && (
                  <div className="flex items-center gap-2 text-sm text-default-500">
                    <Calendar className="size-4" />
                    <span>发售时间: {intro.released}</span>
                  </div>
                )}
                {intro.vndbId && (
                  <div className="flex items-center gap-2 text-sm text-default-500">
                    <LinkIcon className="size-4" />
                    <span>ID: {intro.vndbId}</span>
                  </div>
                )}
              </div>
            </div>

            <Divider className="my-2" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <KunUser
                user={patch.user}
                userProps={{
                  name: `${patch.user.name} - ${formatDistanceToNow(patch.created)}`,
                  avatarProps: {
                    showFallback: true,
                    name: patch.user.name.charAt(0).toUpperCase(),
                    src: patch.user.avatar,
                    size: 'sm',
                    className: 'border border-border/30'
                  }
                }}
              />
              <KunCardStats
                patch={patch}
                disableTooltip={false}
                isMobile={false}
              />
            </div>

            <PatchHeaderActions
              patch={patch}
              handleClickDownloadNav={handleClickDownloadNav}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
