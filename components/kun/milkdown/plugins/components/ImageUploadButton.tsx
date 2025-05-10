'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Loader2 } from 'lucide-react'
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
  const [isUploading, setIsUploading] = useState(false)

  const { get } = editorInfo
  const call = <T,>(command: CmdKey<T>, payload?: T) => {
    return get()?.action(callCommand(command, payload))
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setIsUploading(true)

    try {
      const totalFiles = files.length
      toast(`正在上传${totalFiles}张图片...`)

      // 处理每张图片
      await Promise.all(
        files.map(async (file, index) => {
          try {
            const formData = new FormData()
            const miniImage = await resizeImage(file, 1920, 1080)
            formData.append('image', miniImage)

            const res = await kunFetchFormData<
              KunResponse<{
                imageLink: string
              }>
            >('/user/image', formData)

            if (typeof res === 'string') {
              toast.error(`图片 ${file.name} 上传失败: ${res}`)
              return
            }

            // 插入图片到编辑器
            call(insertImageCommand.key, {
              src: res.imageLink,
              title: file.name,
              alt: file.name
            })

            // 只在最后一张图片上传成功时显示成功提示
            if (index === totalFiles - 1) {
              toast.success(`成功上传${totalFiles}张图片`)
            }
          } catch (error) {
            toast.error(`图片 ${file.name} 上传失败`)
            console.error('图片上传失败:', error)
          }
        })
      )
    } catch (error) {
      toast.error('图片上传过程中发生错误')
      console.error('上传图片过程中发生错误:', error)
    } finally {
      setIsUploading(false)
      // 清空input，确保用户可以再次上传相同的文件
      if (uploadImageInputRef.current) {
        uploadImageInputRef.current.value = ''
      }
    }
  }

  // 构建按钮
  const buttonProps = {
    tooltip: isUploading ? "正在上传图片..." : "上传图片",
    icon: isUploading ? Loader2 : ImagePlus,
    onPress: () => !isUploading && uploadImageInputRef.current?.click(),
    ariaLabel: "上传图片",
    disabled: isUploading,
    className: isUploading ? "animate-spin" : ""
  };

  return (
    <>
      <MenuButton {...buttonProps} />
      <input
        ref={uploadImageInputRef}
        type="file"
        accept=".jpg, .jpeg, .png, .webp"
        className="hidden"
        onChange={handleFileChange}
        multiple
      />
    </>
  )
}
