'use client'

import { Snippet } from '@nextui-org/snippet'
import { Chip } from '@nextui-org/chip'
import { Button } from '@nextui-org/button'
import { Cloud, Link as LinkIcon, Database, Download, Key } from 'lucide-react'
import { Microsoft } from '~/components/kun/icons/Microsoft'
import { SUPPORTED_RESOURCE_LINK_MAP } from '~/constants/resource'
import { kunFetchPut } from '~/utils/kunFetch'
import { KunExternalLink } from '~/components/kun/external-link/ExternalLink'
import { detectLinkType } from '~/utils/linkDetector'
import type { JSX } from 'react'
import type { PatchResource } from '~/types/api/patch'

const storageIcons: { [key: string]: JSX.Element } = {
  s3: <Cloud className="size-4" />,
  onedrive: <Microsoft className="size-4" />,
  baidu: <LinkIcon className="size-4" />,
  aliyun: <Cloud className="size-4" />,
  quark: <Cloud className="size-4" />,
  '123pan': <Cloud className="size-4" />,
  lanzou: <Cloud className="size-4" />,
  googledrive: <Cloud className="size-4" />,
  uc: <Cloud className="size-4" />,
  cmcloud: <Cloud className="size-4" />,
  thunder: <Cloud className="size-4" />,
  weiyun: <Cloud className="size-4" />,
  galgamex: <Database className="size-4" />,
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

  // 获取链接类型
  const getResourceLinkType = (link: string, defaultType: string): string => {
    if (defaultType === 's3') return defaultType;
    return detectLinkType(link) || defaultType;
  }

  // 获取网盘显示名称
  const getResourceName = (link: string, defaultType: string): string => {
    const type = getResourceLinkType(link, defaultType);
    return SUPPORTED_RESOURCE_LINK_MAP[type as keyof typeof SUPPORTED_RESOURCE_LINK_MAP] ||
      SUPPORTED_RESOURCE_LINK_MAP['user'];
  }

  // 获取链接类型对应的图标
  const getLinkIcon = (link: string, defaultType: string): JSX.Element => {
    const type = getResourceLinkType(link, defaultType);
    return storageIcons[type] || storageIcons.user;
  }

  const links = resource.content.split(',');

  // 获取自定义密码，如果有的话
  const hasCustomPassword = resource.password && resource.password.trim() !== '';

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
            resource.storage as keyof typeof SUPPORTED_RESOURCE_LINK_MAP
            ]
          }
        </Chip>
        <Chip variant="flat" startContent={<Database className="w-4 h-4" />}>
          {resource.size}
        </Chip>
      </div>

      <p className="text-sm text-default-500">点击下方按钮直接下载资源</p>

      {/* 显示解压密码 */}
      <div className="flex items-center gap-2">
        <Chip color="warning" variant="flat" startContent={<Key className="size-4" />}>
          解压密码
        </Chip>
        <Snippet
          size="sm"
          symbol=""
          variant="flat"
          classNames={{
            pre: "text-sm",
            copyButton: "text-tiny"
          }}
        >
          {hasCustomPassword ? resource.password : 'galgamex.com'}
        </Snippet>
      </div>

      {links.map((link, index) => (
        <div key={`${resource.id}-link-${index}`} className="space-y-2">
          <Button
            color="primary"
            variant="flat"
            startContent={getLinkIcon(link, resource.storage)}
            onClick={() => handleClickDownload(link)}
            className="w-full"
          >
            {getResourceName(link, resource.storage)} {links.length > 1 ? `#${index + 1}` : ''}
          </Button>

          {resource.storage === 's3' && index === 0 && (
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
