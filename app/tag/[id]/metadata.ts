import { kunMoyuMoe } from '~/config/moyu-moe'
import type { Metadata } from 'next'
import type { TagDetail } from '~/types/api/tag'

export const generateKunMetadataTemplate = (tag: TagDetail): Metadata => {
  const title = `${tag.name} - 标签游戏列表`
  const description = tag.introduction
    ? `${tag.introduction} | 包含${tag.count}个游戏资源`
    : `浏览与"${tag.name}"相关的所有Galgame资源，当前共有${tag.count}个游戏资源`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: kunMoyuMoe.images
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    },
    alternates: {
      canonical: `${kunMoyuMoe.domain.main}/tag/${tag.id}`
    },
    keywords: [tag.name, ...tag.alias, 'Galgame', '游戏资源', '标签'].filter(Boolean)
  }
}
