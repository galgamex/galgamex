'use client'

import { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import DOMPurify from 'isomorphic-dompurify'
import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { PatchTag } from './Tag'
import dynamic from 'next/dynamic'
import { useMounted } from '~/hooks/useMounted'
import { KunLink } from '~/components/kun/milkdown/plugins/components/link/KunLink'
import { KunExternalLink } from '~/components/kun/external-link/ExternalLink'
import type { PatchIntroduction } from '~/types/api/patch'

import './_adjust.scss'

const KunPlyr = dynamic(
  () =>
    import('~/components/kun/milkdown/plugins/components/video/Plyr').then(
      (mod) => mod.KunPlyr
    ),
  { ssr: false }
)

interface Props {
  intro: PatchIntroduction
  patchId: number
}

export const IntroductionTab = ({ intro, patchId }: Props) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const isMounted = useMounted()

  useEffect(() => {
    if (!contentRef.current || !isMounted) {
      return
    }

    // 隐藏所有图片元素
    const imgElements = contentRef.current.querySelectorAll('img')
    imgElements.forEach((element) => {
      element.style.display = 'none'
    })

    // 隐藏图片容器（通常是<p>标签包围图片）
    imgElements.forEach((element) => {
      const parentElement = element.parentElement
      if (parentElement && parentElement.tagName === 'P' && parentElement.childNodes.length === 1) {
        parentElement.style.display = 'none'
      }
    })

    const externalLinkElements = contentRef.current.querySelectorAll(
      '[data-kun-external-link]'
    )
    externalLinkElements.forEach((element) => {
      const text = element.getAttribute('data-text')
      const href = element.getAttribute('data-href')
      if (!text || !href) {
        return
      }
      const root = document.createElement('div')
      root.className = element.className
      element.replaceWith(root)
      const videoRoot = createRoot(root)
      videoRoot.render(<KunExternalLink link={href}>{text}</KunExternalLink>)
    })

    const videoElements = contentRef.current.querySelectorAll(
      '[data-video-player]'
    )
    videoElements.forEach((element) => {
      const src = element.getAttribute('data-src')
      if (!src) {
        return
      }
      const root = document.createElement('div')
      root.className = element.className
      element.replaceWith(root)
      const videoRoot = createRoot(root)
      videoRoot.render(<KunPlyr src={src} />)
    })

    const linkElements = contentRef.current.querySelectorAll('[data-kun-link]')
    linkElements.forEach((element) => {
      const href = element.getAttribute('data-href')
      const text = element.getAttribute('data-text')
      if (!href || !text) return

      const root = document.createElement('div')
      root.className = element.className
      element.replaceWith(root)

      const ReactDOM = require('react-dom/client')
      const linkRoot = ReactDOM.createRoot(root)
      linkRoot.render(<KunLink href={href} text={text} />)
    })
  }, [isMounted])

  const handleGalleryClick = (e: React.MouseEvent) => {
    e.preventDefault()
    window.history.pushState(null, '', '#gallery')
    // 寻找并选中画廊标签
    const galleryTab = document.querySelector('[data-key="gallery"]') as HTMLElement
    if (galleryTab) {
      galleryTab.click()
    }
  }

  return (
    <Card className="border-none shadow-sm min-h-[450px]">
      <CardHeader className="px-5 pt-4 pb-0 flex justify-between items-center">
        <h2 className="text-xl font-semibold">游戏信息</h2>
        <div className="text-sm text-default-500">
          <a
            href="#gallery"
            className="text-primary hover:underline flex items-center gap-1"
            onClick={handleGalleryClick}
          >
            <span>查看画廊</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      </CardHeader>
      <CardBody className="p-4">
        <div
          ref={contentRef}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(intro.introduction)
          }}
          className="kun-prose max-w-none introduction-no-images"
        />

        <div className="pt-4 ">
          <PatchTag patchId={patchId} initialTags={intro.tag} />
        </div>
      </CardBody>
    </Card>
  )
}
