'use client'

import { Snippet } from '@nextui-org/snippet'
import { Chip } from '@nextui-org/chip'
import { Button } from '@nextui-org/button'
import { Cloud, Link as LinkIcon, Database, Download } from 'lucide-react'
import { Microsoft } from '~/components/kun/icons/Microsoft'
import { SUPPORTED_RESOURCE_LINK_MAP } from '~/constants/resource'
import { kunFetchPut } from '~/utils/kunFetch'
import { KunExternalLink } from '~/components/kun/external-link/ExternalLink'
import type { JSX } from 'react'
import type { PatchResource } from '~/types/api/patch'

const storageIcons: { [key: string]: JSX.Element } = {
  s3: <Cloud className="size-4" />,
  onedrive: <Microsoft className="size-4" />,
  user: <LinkIcon className="size-4" />
}

interface Props {
  resource: PatchResource
}

export const ResourceDownloadCard = ({ resource }: Props) => {
  const handleClickDownload = async (link: string) => {
    await kunFetchPut<KunResponse<{}>>('/patch/resource/download', {
      patchId: resource.patchId,
      resourceId: resource.id
    })

    // 在记录下载后打开链接
    window.open(link, '_blank')
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-2">
        <Chip
          color="secondary"
          variant="flat"
          startContent={storageIcons[resource.storage]}
        >
          {
            SUPPORTED_RESOURCE_LINK_MAP[
            resource.storage as 's3' | 'onedrive' | 'user'
            ]
          }
        </Chip>
        <Chip variant="flat" startContent={<Database className="w-4 h-4" />}>
          {resource.size}
        </Chip>
      </div>

      <p className="text-sm text-default-500">点击下方按钮直接下载资源</p>

      {resource.content.split(',').map((link, index) => (
        <div key={Math.random()} className="space-y-2">
          <Button
            color="primary"
            variant="flat"
            startContent={<Download className="size-4" />}
            onClick={() => handleClickDownload(link)}
            className="w-full"
          >
            下载资源 {resource.content.split(',').length > 1 ? `#${index + 1}` : ''}
          </Button>

          {resource.storage === 's3' && (
            <>
              <p className="text-sm">
                BLACK3 校验码 (您可以根据此校验码校验下载文件完整性)
              </p>
              <Snippet
                symbol=""
                className="flex overflow-auto whitespace-normal"
              >
                {resource.hash}
              </Snippet>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
