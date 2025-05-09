'use client'

import { useState, useEffect } from 'react'
import { Button, Card, CardBody, Image, useDisclosure } from '@nextui-org/react'
import { KunImageUploader } from './KunImageUploader'
import { KunImageCropperModal } from './KunImageCropperModal'
import { KunImageMosaicModal } from './KunImageMosaicModal'
import type { KunAspect } from './types'

interface Props {
  aspect?: KunAspect
  initialImage?: string
  description?: string
  onImageComplete?: (croppedImage: string) => void
  removeImage?: () => void
}

export const KunImageCropper = ({
  aspect,
  initialImage,
  description,
  onImageComplete,
  removeImage
}: Props) => {
  const [imgSrc, setImgSrc] = useState(initialImage ?? '')
  const [previewImage, setPreviewImage] = useState<string>(initialImage ?? '')
  const {
    isOpen: isOpenCropper,
    onOpen: onOpenCropper,
    onClose: onCloseCropper
  } = useDisclosure()
  const {
    isOpen: isOpenMosaic,
    onOpen: onOpenMosaic,
    onClose: onCloseMosaic
  } = useDisclosure()

  useEffect(() => {
    if (initialImage) {
      setPreviewImage(initialImage)
    }
  }, [initialImage])

  const handleCropComplete = (image: string) => {
    setImgSrc(image)
    setPreviewImage(image)
    onImageComplete?.(image)
  }

  const handleMosaicComplete = (mosaicImage: string) => {
    setImgSrc(mosaicImage)
    setPreviewImage(mosaicImage)
    onImageComplete?.(mosaicImage)
  }

  const handleRemoveImage = () => {
    setPreviewImage('')
    setImgSrc('')
    removeImage?.()
  }

  return (
    <div className="gap-6 size-full">
      <KunImageUploader
        onImageSelect={(dataUrl: string) => {
          setImgSrc(dataUrl)
          onOpenCropper()
        }}
      />

      {previewImage && (
        <Card className="w-full max-w-md mx-auto">
          <CardBody>
            <Image
              src={previewImage}
              alt="Cropped image"
              className="object-contain w-full h-auto"
            />

            <Button
              color="danger"
              variant="bordered"
              size="sm"
              className="absolute z-10 right-2 top-2"
              onPress={handleRemoveImage}
            >
              移除
            </Button>
          </CardBody>
        </Card>
      )}

      <KunImageCropperModal
        isOpen={isOpenCropper}
        imgSrc={imgSrc}
        initialAspect={aspect}
        description={description}
        onCropComplete={handleCropComplete}
        onOpenMosaic={onOpenMosaic}
        onClose={onCloseCropper}
      />

      <KunImageMosaicModal
        isOpen={isOpenMosaic}
        imgSrc={imgSrc}
        onMosaicComplete={handleMosaicComplete}
        onClose={onCloseMosaic}
      />
    </div>
  )
}
