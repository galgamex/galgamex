'use client'

import toast from 'react-hot-toast'
import { useState } from 'react'
import { Button, Card, CardBody, ModalBody, ModalFooter } from '@nextui-org/react'
import { kunFetchFormData } from '~/utils/kunFetch'
import { kunErrorHandler } from '~/utils/kunErrorHandler'
import { KunImageCropper } from '~/components/kun/cropper/KunImageCropper'
import { dataURItoBlob } from '~/utils/dataURItoBlob'
import { ImageIcon, UploadCloud, RefreshCw } from 'lucide-react'

interface Props {
  patchId: number
  onClose: () => void
}

export const RewritePatchBanner = ({ patchId, onClose }: Props) => {
  const [banner, setBanner] = useState<Blob | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const removeBanner = async () => {
    setPreviewUrl('')
    setBanner(null)
  }

  const [updating, setUpdating] = useState(false)
  const handleUpdateBanner = async () => {
    if (!banner) {
      toast.error('请选择一张新的预览图片')
      return
    }

    const formData = new FormData()
    formData.append('patchId', patchId.toString())
    formData.append('image', banner)

    setUpdating(true)

    const res = await kunFetchFormData<KunResponse<{}>>(
      '/patch/banner',
      formData
    )
    kunErrorHandler(res, () => {
      setBanner(null)
      setPreviewUrl('')
    })
    toast.success('更新图片成功')
    setUpdating(false)
    onClose()
  }

  const onImageComplete = async (croppedImage: string) => {
    const imageBlob = dataURItoBlob(croppedImage)
    setPreviewUrl(URL.createObjectURL(imageBlob))
    setBanner(imageBlob)
  }

  return (
    <>
      <ModalBody className="gap-5">
        {previewUrl ? (
          <Card className="w-full">
            <CardBody className="p-0 overflow-hidden">
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Banner Preview"
                  className="w-full object-cover"
                  style={{ maxHeight: "200px" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <p className="text-white text-sm">已选择新图片，点击下方按钮应用更改</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ) : (
          <Card className="border-2 border-dashed border-default-200">
            <CardBody>
              <div className="flex flex-col items-center justify-center p-8 text-default-400">
                <ImageIcon size={40} />
                <p className="mt-2 text-center">请上传新的游戏封面图片</p>
                <p className="text-xs mt-1 text-center">支持各种比例的图片</p>
              </div>
            </CardBody>
          </Card>
        )}

        <KunImageCropper
          aspect={{ x: 16, y: 9 }}
          initialImage={previewUrl}
          description="您的预览图片将会被固定为 1920 × 1080 分辨率，请选择清晰度较高的图片以获得最佳显示效果"
          onImageComplete={onImageComplete}
          removeImage={removeBanner}
        />

        <div className="bg-default-50 p-3 rounded-lg text-sm space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <RefreshCw className="size-4" />
            <p className="font-medium">更新提示</p>
          </div>
          <p className="text-default-600">
            更改图片后，由于缓存原因，更改不会立即生效。您可以尝试使用 Ctrl + F5
            刷新页面，或等待片刻后再次访问页面。
          </p>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="light" onPress={onClose}>
          取消
        </Button>
        <Button
          color="primary"
          onPress={handleUpdateBanner}
          disabled={updating}
          isLoading={updating}
          startContent={updating ? null : <UploadCloud size={18} />}
        >
          {updating ? '更新中...' : '应用更改'}
        </Button>
      </ModalFooter>
    </>
  )
}
