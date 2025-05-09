'use client'

import { useEffect } from 'react'
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { Chip } from '@nextui-org/chip'
import { Plus, X } from 'lucide-react'
import { ErrorType } from '../share'
import { SUPPORTED_RESOURCE_LINK_MAP } from '~/constants/resource'
import { fetchLinkData, fetchListData } from './fetchAlistSize'
import toast from 'react-hot-toast'

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
    if (links.some((link) => link.includes('pan.touchgal.net/s/'))) {
      checkLinkSize(links[0])
    }
  }, [links, setSize])

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
          <Chip color="primary" variant="flat">
            {
              SUPPORTED_RESOURCE_LINK_MAP[
                storage as keyof typeof SUPPORTED_RESOURCE_LINK_MAP
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
                e.preventDefault()
                const newLinks = [...links]
                newLinks[index] = e.target.value
                setContent(newLinks.filter(Boolean).toString())
              }}
            />
          </div>

          {storage !== 's3' && (
            <div className="flex justify-end">
              {index === links.length - 1 ? (
                <Button
                  isIconOnly
                  variant="flat"
                  onPress={() => setContent([...links, ''].toString())}
                >
                  <Plus className="size-4" />
                </Button>
              ) : (
                <Button
                  isIconOnly
                  variant="flat"
                  color="danger"
                  onPress={() => {
                    const newLinks = links.filter((_, i) => i !== index)
                    setContent(newLinks.toString())
                  }}
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
