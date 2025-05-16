'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardBody, CardFooter } from '@nextui-org/card'
import { KunCardStats } from '~/components/kun/CardStats'
import Link from 'next/link'
import { KunPatchAttribute } from '~/components/kun/PatchAttribute'
import { cn } from '~/utils/cn'
import { Divider } from '@nextui-org/divider'
import { OptimizedImage } from '~/components/kun/OptimizedImage'

interface Props {
  patch: GalgameCard
}

export const GalgameCard = ({ patch }: Props) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [aspectRatioReady, setAspectRatioReady] = useState(false)
  const [aspectRatio, setAspectRatio] = useState<string>('2/3') // 默认为竖版比例
  const imageUrlRef = useRef<string>(
    patch.banner
      ? patch.banner.replace(/\.avif$/, '-mini.avif')
      : '/touchgal.avif'
  )

  // 预先加载图片并检测宽高比
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      // 根据实际图片确定宽高比
      const ratio = img.width > img.height
        ? '4/3'  // 横版比例
        : '2/3'  // 竖版比例

      setAspectRatio(ratio)
      setAspectRatioReady(true)
    }
    img.src = imageUrlRef.current

    // 如果图片加载失败，也标记为准备好，使用默认比例
    img.onerror = () => {
      setAspectRatioReady(true)
    }

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [])

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  return (
    <Card
      isPressable
      as={Link}
      href={`/${patch.uniqueId}`}
      target="_blank"
      className={cn(
        "w-full border border-default-100 dark:border-default-200 hover:border-primary/50 transition-all duration-300",
        (imageLoaded && aspectRatioReady) ? "opacity-100" : "opacity-80"
      )}
      radius="none"
    >
      {/* 使用骨架屏在图片加载前显示 */}
      {!aspectRatioReady ? (
        <div className="w-full bg-default-200 animate-pulse" style={{ aspectRatio: '2/3' }}></div>
      ) : (
        <div className="relative w-full overflow-hidden group">
          <OptimizedImage
            src={imageUrlRef.current}
            alt={patch.name}
            aspectRatio={aspectRatio}
            className="group-hover:scale-105 transition-transform duration-500"
            containerClassName="w-full"
            objectFit="cover"
            onLoad={handleImageLoad}
          />
        </div>
      )}

      {/* 仅在图片宽高比确定后显示卡片内容 */}
      {aspectRatioReady && (
        <>
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
        </>
      )}
    </Card>
  )
}