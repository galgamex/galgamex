import { kunMoyuMoe } from '~/config/moyu-moe'
import { convert } from 'html-to-text'
import { generateNullMetadata } from '~/utils/noIndex'
import type { Metadata } from 'next'
import type { Patch, PatchIntroduction } from '~/types/api/patch'

const getPlatformDescription = (platform: string[]) => {
  const hasWindows = platform.includes('windows')
  const hasAndroid = platform.includes('android')

  if (hasWindows && hasAndroid) {
    return 'PC + 安卓'
  } else if (hasWindows) {
    return 'PC 游戏'
  } else if (hasAndroid) {
    return '安卓游戏'
  } else {
    return ''
  }
}

export const generateKunMetadataTemplate = (
  patch: Patch,
  intro: PatchIntroduction
): Metadata => {
  const patchType = getPlatformDescription(patch.platform)
  const pageTitle = patch.alias.length
    ? `${patch.name} | ${patch.alias[0]} | ${patchType}`
    : `${patch.name} | ${patchType}`

  if (patch.contentLimit === 'nsfw') {
    return generateNullMetadata(pageTitle)
  }

  return {
    title: pageTitle,
    keywords: [patch.name, ...patch.alias],
    authors: kunMoyuMoe.author,
    creator: patch.user.name,
    publisher: patch.user.name,
    description: convert(intro.introduction, {
      wordwrap: false,
      selectors: [{ selector: 'p', format: 'inline' }]
    }).slice(0, 170),
    openGraph: {
      title: patch.alias.length
        ? `${patch.name} | ${patch.alias[0]}`
        : `${patch.name}`,
      description: convert(intro.introduction).slice(0, 170),
      type: 'article',
      publishedTime: patch.created,
      modifiedTime: patch.updated,
      images: [
        {
          url: patch.banner,
          width: 1920,
          height: 1080,
          alt: patch.name
        }
      ]
    },
    twitter: {
      card: 'summary',
      title: patch.alias.length
        ? `${patch.name} | ${patch.alias[0]}`
        : `${patch.name}`,
      description: convert(intro.introduction).slice(0, 170),
      images: [patch.banner]
    },
    alternates: {
      canonical: `${kunMoyuMoe.domain.main}/${patch.uniqueId}`
    }
  }
}
