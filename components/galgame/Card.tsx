'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardBody, CardFooter } from '@nextui-org/card'
import { Image } from '@nextui-org/image'
import { KunCardStats } from '~/components/kun/CardStats'
import Link from 'next/link'
import { KunPatchAttribute } from '~/components/kun/PatchAttribute'
import { cn } from '~/utils/cn'
import { Divider } from '@nextui-org/divider'

interface Props {
  patch: GalgameCard
}

export const GalgameCard = ({ patch }: Props) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [aspectRatio, setAspectRatio] = useState<'portrait' | 'landscape'>('portrait')
  const processedBannerRef = useRef<string | null>(null)

  // 预先加载图片并检测宽高比，但不显示加载过程
  useEffect(() => {
    // 如果是同一个banner且已经处理过，则跳过
    if (processedBannerRef.current === patch.banner) {
      return
    }

    // 创建一个隐藏的图片元素来预加载并获取尺寸
    const img = new window.Image()
    img.onload = () => {
      // 在组件挂载时静默确定比例，避免用户感知切换过程
      setAspectRatio(img.width > img.height ? 'landscape' : 'portrait')
      // 记录已处理过的banner URL
      processedBannerRef.current = patch.banner
    }
    img.src = patch.banner
      ? patch.banner.replace(/\.avif$/, '-mini.avif')
      : '/touchgal.avif'
  }, [patch.banner]) // 保持依赖数组不变

  // 横向卡片(宽大于高)
  if (aspectRatio === 'landscape') {
    return (
      <Card
        isPressable
        as={Link}
        href={`/${patch.uniqueId}`}
        target="_blank"
        className="w-full border border-default-100 dark:border-default-200 hover:border-primary/50 transition-all duration-300"
        radius="none"
      >
        <div className="relative w-full overflow-hidden group">
          <div
            className={cn(
              'absolute inset-0 animate-pulse bg-default-100',
              imageLoaded ? 'opacity-0' : 'opacity-90',
              'transition-opacity duration-300'
            )}
            style={{
              aspectRatio: '4/3',
              transition: 'aspect-ratio 0.3s ease-in-out'
            }}
          />
          <Image
            radius="none"
            alt={patch.name}
            className={cn(
              'size-full object-cover transition-all duration-500',
              imageLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0',
              'group-hover:scale-105'
            )}
            removeWrapper={true}
            src={
              patch.banner
                ? patch.banner.replace(/\.avif$/, '-mini.avif')
                : '/touchgal.avif'
            }
            style={{
              aspectRatio: '4/3',
              transition: 'aspect-ratio 0.3s ease-in-out'
            }}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <CardBody className="px-3 pt-3 pb-2">
          <h2 className="font-medium text-medium line-clamp-2 group-hover:text-primary transition-colors">
            {patch.name}
          </h2>
        </CardBody>
        <Divider className="opacity-50" />
        <CardFooter className="px-3 py-2 flex-col items-start gap-2">
          <KunCardStats patch={patch} isMobile={true} className="text-xs w-full" />
          <KunPatchAttribute types={patch.type} size="sm" className="mt-1" />
        </CardFooter>
      </Card>
    )
  }

  // 纵向卡片(高大于宽)
  return (
    <Card
      isPressable
      as={Link}
      href={`/${patch.uniqueId}`}
      target="_blank"
      className="w-full border border-default-100 dark:border-default-200 hover:border-primary/50 transition-all duration-300"
      radius="none"
    >
      <div className="relative w-full overflow-hidden group">
        <div
          className={cn(
            'absolute inset-0 animate-pulse bg-default-100',
            imageLoaded ? 'opacity-0' : 'opacity-90',
            'transition-opacity duration-300'
          )}
          style={{
            aspectRatio: '4/6',
            transition: 'aspect-ratio 0.3s ease-in-out'
          }}
        />
        <Image
          radius="none"
          alt={patch.name}
          className={cn(
            'size-full object-cover transition-all duration-500',
            imageLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0',
            'group-hover:scale-105'
          )}
          removeWrapper={true}
          src={
            patch.banner
              ? patch.banner.replace(/\.avif$/, '-mini.avif')
              : '/touchgal.avif'
          }
          style={{
            aspectRatio: '4/6',
            transition: 'aspect-ratio 0.3s ease-in-out'
          }}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      <CardBody className="px-3 pt-3 pb-2">
        <h2 className="font-medium text-medium line-clamp-2 group-hover:text-primary transition-colors">
          {patch.name}
        </h2>
      </CardBody>
      <Divider className="opacity-50" />
      <CardFooter className="px-3 py-2 flex-col items-start gap-2">
        <KunCardStats patch={patch} isMobile={true} className="text-xs w-full" />
        <KunPatchAttribute types={patch.type} size="sm" className="mt-1" />
      </CardFooter>
    </Card>
  )
}
