'use client'

import { useRef } from 'react'
import { ImagePlus } from 'lucide-react'
import { callCommand } from '@milkdown/utils'
import { insertImageCommand } from '@milkdown/preset-commonmark'
import toast from 'react-hot-toast'
import { resizeImage } from '~/utils/resizeImage'
import { kunFetchFormData } from '~/utils/kunFetch'
import { MenuButton } from '../MenuButton'
import type { CmdKey } from '@milkdown/core'
import type { UseEditorReturn } from '@milkdown/react'

export const ImageUploadButton = ({
  editorInfo
}: {
  editorInfo: UseEditorReturn
}) => {
  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)

  const { get } = editorInfo
  const call = <T,>(command: CmdKey<T>, payload?: T) => {
    return get()?.action(callCommand(command, payload))
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    const miniImage = await resizeImage(file, 1920, 1080)
    formData.append('image', miniImage)

    toast('正在上传图片...')

    const res = await kunFetchFormData<
      KunResponse<{
        imageLink: string
      }>
    >('/user/image', formData)
    if (typeof res === 'string') {
      toast.error(res)
      return
    } else {
      toast.success('上传图片成功')
      call(insertImageCommand.key, {
        src: res.imageLink,
        title: file.name,
        alt: file.name
      })
    }
  }

  return (
    <>
      <MenuButton
        tooltip="上传图片"
        icon={ImagePlus}
        onPress={() => uploadImageInputRef.current?.click()}
        ariaLabel="上传图片"
      />
      <input
        ref={uploadImageInputRef}
        type="file"
        accept=".jpg, .jpeg, .png, .webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  )
}
