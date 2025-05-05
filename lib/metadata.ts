import { siteConfig } from '@/config/site'
import { DEFAULT_LOCALE, LOCALE_NAMES, Locale } from '@/i18n/routing'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type MetadataProps = {
  page?: string
  title?: string
  siteName?: string
  description?: string
  tagLine?: string
  images?: string[]
  noIndex?: boolean
  separator?: string
  locale: Locale
  path?: string
  canonicalUrl?: string
}

export async function constructMetadata({
  page = 'Home',
  title,
  siteName = 'GalGameClub',
  tagLine = 'All The Worlds Best Games',
  description,
  images = [],
  noIndex = false,
  separator = '|',
  locale,
  path,
  canonicalUrl,
}: MetadataProps): Promise<Metadata> {
  // get translations
  const t = await getTranslations({ locale, namespace: 'Home' })

  // get page specific metadata translations
  const pageTitle = title || siteName
  const pageDescription = description || ''

  // build image URLs
  const imageUrls = images.length > 0
    ? images.map(img => ({
      url: img.startsWith('http') ? img : `${siteConfig.url}/${img}`,
      alt: pageTitle,
    }))
    : [{
      url: `${siteConfig.url}/og.png`,
      alt: pageTitle,
    }]

  // Open Graph Site
  const pageURL = `${locale === DEFAULT_LOCALE ? '' : locale}${path}` || siteConfig.url

  // build alternate language links
  const alternateLanguages = Object.keys(LOCALE_NAMES).reduce((acc, lang) => {
    const path = canonicalUrl
      ? `/${lang === DEFAULT_LOCALE ? '' : lang}${canonicalUrl}`
      : `/${lang === DEFAULT_LOCALE ? '' : lang}`
    acc[lang] = `${siteConfig.url}/${path}`
    return acc
  }, {} as Record<string, string>)

  return {
    title: {
      default: pageTitle,
      template: `%s${separator}${siteName}`,
    },
    description: pageDescription,
    keywords: [],
    authors: siteConfig.authors,
    creator: siteConfig.creator,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl ? `${siteConfig.url}/${canonicalUrl}` : undefined,
      languages: alternateLanguages,
    },
    openGraph: {
      type: 'website',
      title: {
        default: pageTitle,
        template: `%s${separator}${siteName}`,
      },
      description: pageDescription,
      url: pageURL,
      siteName: siteName,
      locale: locale,
      images: imageUrls,
    },
    twitter: {
      card: 'summary_large_image',
      title: {
        default: pageTitle,
        template: `%s ${separator} ${siteName}`,
      },
      description: pageDescription,
      site: `${siteConfig.url}/${pageURL}`,
      images: imageUrls,
      creator: siteConfig.creator,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
  }
}