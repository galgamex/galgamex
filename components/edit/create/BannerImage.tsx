'use client'

import { useEffect, useState } from 'react'
import localforage from 'localforage'
import toast from 'react-hot-toast'
import { dataURItoBlob } from '~/utils/dataURItoBlob'
import { KunImageCropper } from '~/components/kun/cropper/KunImageCropper'
import { Tooltip, Card, CardBody } from '@nextui-org/react'
import { InfoIcon, ImageIcon } from 'lucide-react'

interface Props {
  errors: string | undefined
}

export const BannerImage = ({ errors }: Props) => {
  const [initialUrl, setInitialUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const localeBannerBlob: Blob | null =
          await localforage.getItem('kun-patch-banner')
        if (localeBannerBlob) {
          setInitialUrl(URL.createObjectURL(localeBannerBlob))
        }
      } catch (error) {
        console.error('加载图片失败:', error)
        toast.error('加载图片失败，请重试')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const removeBanner = async () => {
    try {
      await localforage.removeItem('kun-patch-banner')
      setInitialUrl('')
      toast.success('图片已移除')
    } catch (error) {
      console.error('移除图片失败:', error)
      toast.error('移除图片失败，请重试')
    }
  }

  const onImageComplete = async (croppedImage: string) => {
    try {
      const imageBlob = dataURItoBlob(croppedImage)
      await localforage.setItem('kun-patch-banner', imageBlob)
      toast.success('图片已保存')
    } catch (error) {
      console.error('保存图片失败:', error)
      toast.error('保存图片失败，请重试')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl">封面图片</h2>
        <span className="text-danger">*</span>
        <Tooltip content="系统会自动检测图片比例：宽大于高的图片将使用4:3比例展示，高大于宽的图片将使用4:6比例展示。">
          <InfoIcon className="size-4 text-default-400" />
        </Tooltip>
      </div>

      {errors && <p className="text-xs text-danger-500">{errors}</p>}



      <KunImageCropper
        aspect={null}
        initialImage={initialUrl}
        description="您可以自由设置图片比例。系统会根据图片比例自动选择最佳显示效果：宽大于高的横版图片和高大于宽的竖版图片会有不同的展示方式。"
        onImageComplete={onImageComplete}
        removeImage={removeBanner}
      />
    </div>
  )
}
