'use client'

import { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import DOMPurify from 'isomorphic-dompurify'
import { useMounted } from '~/hooks/useMounted'
import { KunExternalLink } from '~/components/kun/external-link/ExternalLink'
import { Chip } from '@nextui-org/chip'
import { Quote } from 'lucide-react'
import { scrollIntoComment } from './_scrollIntoComment'
import type { PatchComment } from '~/types/api/patch'

interface Props {
  comment: PatchComment
}

export const CommentContent = ({ comment }: Props) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const isMounted = useMounted()

  useEffect(() => {
    if (!contentRef.current || !isMounted) {
      return
    }

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
  }, [isMounted])

  return (
    <>
      {comment.quotedContent && (
        <div
          onClick={() => scrollIntoComment(comment.parentId)}
          className="flex items-start gap-2 px-3 py-2 mb-2 bg-primary/5 dark:bg-primary/10 rounded-lg border-l-4 border-primary/50 cursor-pointer hover:bg-primary/10 transition-colors text-sm"
        >
          <Quote className="text-primary size-4 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium text-primary-600 dark:text-primary-400 mb-0.5">
              @{comment.quotedUsername}
            </div>
            <div className="text-default-700 dark:text-default-500 line-clamp-2">
              {comment.quotedContent}
            </div>
          </div>
        </div>
      )}
      <div
        ref={contentRef}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(comment.content)
        }}
        className="kun-prose max-w-none"
      />
    </>
  )
}
