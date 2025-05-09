'use client'

import { Card, CardBody, Chip } from '@nextui-org/react'
import { isValidURL } from '~/utils/validate'
import { KunExternalLink } from '~/components/kun/external-link/ExternalLink'

interface KunLinkProps {
  href: string
  text: string
}

export const KunLink = ({ href, text }: KunLinkProps) => {
  const domain = isValidURL(href) ? new URL(href).hostname : href

  return (
    <Card className="w-full">
      <CardBody>
        <div className="flex items-center gap-2">
          <Chip size="sm" color="primary" variant="flat">
            外部链接
          </Chip>
          <span className="text-default-500">{domain}</span>
        </div>
        <p style={{ margin: '0' }}>{text}</p>
        <KunExternalLink link={href}>{href}</KunExternalLink>
      </CardBody>
    </Card>
  )
}
