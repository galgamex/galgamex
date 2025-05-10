import { Decoration } from '@milkdown/prose/view'
import { kunFetchFormData } from '~/utils/kunFetch'
import toast from 'react-hot-toast'
import { resizeImage } from '~/utils/resizeImage'
import type { Uploader } from '@milkdown/plugin-upload'
import type { Node } from '@milkdown/prose/model'

export const kunUploader: Uploader = async (files, schema) => {
  const images: File[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files.item(i)
    if (!file) {
      continue
    }

    if (!file.type.startsWith('image/')) {
      continue
    }

    images.push(file)
  }

  // 如果有多张图片，显示上传数量提示
  if (images.length > 1) {
    toast(`正在上传${images.length}张图片...`, { duration: 3000 })
  }

  // @ts-expect-error It works fine:)
  const nodes: Node[] = await Promise.all(
    images.map(async (image, index) => {
      try {
        const formData = new FormData()
        const miniImage = await resizeImage(image, 1920, 1080)
        formData.append('image', miniImage)

        const res = await kunFetchFormData<
          KunResponse<{
            imageLink: string
          }>
        >('/user/image', formData)
        if (typeof res === 'string') {
          toast.error(`图片 ${image.name} 上传失败: ${res}`)
          return
        }

        // 只在最后一张图片上传成功时显示总体成功提示
        if (images.length > 1 && index === images.length - 1) {
          toast.success(`成功上传${images.length}张图片`)
        } else if (images.length === 1) {
          toast.success('图片上传成功')
        }

        const alt = image.name
        return schema.nodes.image.createAndFill({
          src: res.imageLink,
          alt
        }) as Node
      } catch (error) {
        toast.error(`图片 ${image.name} 上传失败`)
        console.error('图片上传失败:', error)
        return null
      }
    })
  )

  // 过滤掉可能的null值（上传失败的图片）
  return nodes.filter(Boolean)
}

export const kunUploadWidgetFactory = (
  pos: number,
  spec: Parameters<typeof Decoration.widget>[2]
) => {
  const widgetDOM = document.createElement('span')
  widgetDOM.textContent = '图片正在上传中'
  widgetDOM.style.color = '#006fee'
  return Decoration.widget(pos, widgetDOM, spec)
}
