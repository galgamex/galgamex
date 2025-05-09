'use client'

import { Link } from '@nextui-org/link'
import { useUserStore } from '~/store/userStore'
import type { ReactNode } from 'react'
import type { LinkProps } from '@nextui-org/react'

interface Props extends LinkProps {
  link: string
  isRequireRedirect?: boolean
  children?: ReactNode
  showAnchorIcon?: boolean
}

export const KunExternalLink = ({
  link,
  children,
  isRequireRedirect,
  showAnchorIcon = true,
  ...props
}: Props) => {
  const encodeLink = encodeURIComponent(link)
  const userConfig = useUserStore((state) => state.user)

  const urlHref = () => {
    const isExcludedDomain = userConfig.excludedDomains.some((domain) =>
      link.includes(domain)
    )
    if (isExcludedDomain) {
      return link
    }

    if (typeof isRequireRedirect !== 'undefined') {
      return isRequireRedirect ? `/redirect?url=${encodeLink}` : link
    }

    return userConfig.enableRedirect ? `/redirect?url=${encodeLink}` : link
  }

  return (
    <Link
      isExternal={!isRequireRedirect && !userConfig.enableRedirect}
      showAnchorIcon={showAnchorIcon}
      href={urlHref()}
      {...props}
    >
      {children}
    </Link>
  )
}
