'use client'

import { useEffect, useState } from 'react'
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { Chip } from '@nextui-org/chip'
import { Plus, X, Cloud, Link as LinkIcon, Database } from 'lucide-react'
import { ErrorType } from '../share'
import { SUPPORTED_RESOURCE_LINK_MAP } from '~/constants/resource'
import { fetchLinkData, fetchListData } from './fetchAlistSize'
import { detectLinkType } from '~/utils/linkDetector'
import { Microsoft } from '~/components/kun/icons/Microsoft'
import toast from 'react-hot-toast'
import type { JSX } from 'react'

// 与DownloadCard组件保持一致的图标映射
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

interface ResourceLinksInputProps {
  errors: ErrorType
  storage: string
  content: string
  size: string
  setContent: (value: string) => void
  setSize: (value: string) => void
}

export const ResourceLinksInput = ({
  errors,
  storage,
  content,
  size,
  setContent,
  setSize
}: ResourceLinksInputProps) => {
  const links = content.trim() ? content.trim().split(',') : ['']
  // 存储每个链接对应的类型
  const [linkTypes, setLinkTypes] = useState<string[]>(Array(links.length).fill(storage))

  // 当content或storage变化时重新检测类型
  useEffect(() => {
    if (storage === 's3') return;

    // 将links的长度与linkTypes的长度同步
    if (links.length !== linkTypes.length) {
      // 如果links长度变化了，重新初始化linkTypes，避免下标不一致问题
      const newLinkTypes = Array(links.length).fill(storage);

      // 然后对新数组中有链接的项进行类型检测
      links.forEach((link, index) => {
        if (link) {
          newLinkTypes[index] = detectLinkType(link);
        }
      });

      setLinkTypes(newLinkTypes);
    }
  }, [content, storage, linkTypes.length, links.length]);

  const checkLinkSize = async (link: string) => {
    toast('正在尝试从 TouchGal Alist 获取文件大小')
    const data = await fetchLinkData(link)
    if (data && data.code === 0) {
      let sizeInGB
      if (data.data.source.size > 0) {
        sizeInGB = (data.data.source.size / 1024 ** 3).toFixed(3)
      } else {
        const listSize = await fetchListData(data.data.key)
        sizeInGB = listSize ? (listSize / 1024 ** 3).toFixed(3) : ''
      }
      toast.success('获取文件大小成功')
      setSize(`${sizeInGB} GB`)
    }
  }

  useEffect(() => {
    if (!links.length || size) {
      return
    }
    if (links.some((link) => link.includes('pan.galgamex.com/s/'))) {
      checkLinkSize(links[0])
    }
  }, [links, setSize, size])

  // 获取链接类型
  const getLinkType = (index: number): string => {
    if (storage === 's3') return storage;
    return linkTypes[index] || storage;
  }

  // 获取链接类型对应的图标
  const getLinkIcon = (index: number): JSX.Element => {
    const type = getLinkType(index);
    return storageIcons[type] || storageIcons.user;
  }

  // 当用户手动修改链接时检测类型
  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setContent(newLinks.filter(Boolean).toString());

    // 更新该链接的类型
    if (value && storage !== 's3') {
      const newType = detectLinkType(value);
      const newLinkTypes = [...linkTypes];
      newLinkTypes[index] = newType;
      setLinkTypes(newLinkTypes);
    }
  };

  // 当添加新链接时
  const handleAddLink = () => {
    setContent([...links, ''].toString());
    setLinkTypes([...linkTypes, storage]);
  };

  // 当删除链接时
  const handleRemoveLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    setContent(newLinks.toString());
    const newLinkTypes = linkTypes.filter((_, i) => i !== index);
    setLinkTypes(newLinkTypes);
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">资源链接</h3>
      <p className="text-sm text-default-500">
        {storage === 's3'
          ? '已为您自动创建资源链接 √'
          : '上传资源会自动添加资源链接, 您也可以自行添加资源链接。为保证单一性, 建议您一次添加一条资源链接'}
      </p>

      {links.map((link, index) => (
        <div key={index} className="flex items-center gap-2">
          <Chip
            color="primary"
            variant="flat"
            startContent={getLinkIcon(index)}
          >
            {
              // 显示自动检测的网盘类型名称，或者默认存储类型
              SUPPORTED_RESOURCE_LINK_MAP[
              getLinkType(index) as keyof typeof SUPPORTED_RESOURCE_LINK_MAP
              ]
            }
          </Chip>

          <div className="flex-col w-full">
            <Input
              isRequired
              placeholder={
                storage === 's3' ? '资源链接不可编辑' : '请输入资源链接'
              }
              value={link}
              isReadOnly={storage === 's3'}
              isDisabled={storage === 's3'}
              isInvalid={!!errors.content}
              errorMessage={errors.content?.message}
              onChange={(e) => {
                e.preventDefault();
                handleLinkChange(index, e.target.value);
              }}
            />
          </div>

          {storage !== 's3' && (
            <div className="flex justify-end">
              {index === links.length - 1 ? (
                <Button
                  isIconOnly
                  variant="flat"
                  onPress={handleAddLink}
                >
                  <Plus className="size-4" />
                </Button>
              ) : (
                <Button
                  isIconOnly
                  variant="flat"
                  color="danger"
                  onPress={() => handleRemoveLink(index)}
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
