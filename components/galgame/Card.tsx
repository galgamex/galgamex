'use client'

import { useState, useRef } from 'react'
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
  const [aspectRatio] = useState<string>('2/3')
  const processedBannerRef = useRef<string | null>(null)

  // 图片源处理
  const imageSrc = patch.banner
    ? patch.banner.replace(/\.avif$/, '-mini.avif')
    : '/touchgal.avif'

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
        <OptimizedImage
          src={imageSrc}
          alt={patch.name}
          aspectRatio={aspectRatio}
          priority={true}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 300px, 220px"
          className="transition-transform duration-500 group-hover:scale-105"
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
