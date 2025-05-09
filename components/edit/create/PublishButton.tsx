'use client'

import { useState } from 'react'
import { Button, Card, CardBody, Chip, Divider } from '@nextui-org/react'
import localforage from 'localforage'
import { useCreatePatchStore } from '~/store/editStore'
import toast from 'react-hot-toast'
import { kunFetchFormData } from '~/utils/kunFetch'
import { kunErrorHandler } from '~/utils/kunErrorHandler'
import { patchCreateSchema } from '~/validations/edit'
import { useRouter } from 'next-nprogress-bar'
import { CheckCircle, XCircle, SendHorizonal, Save } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import type { CreatePatchRequestData } from '~/store/editStore'

interface Props {
  setErrors: Dispatch<
    SetStateAction<Partial<Record<keyof CreatePatchRequestData, string>>>
  >
}

export const PublishButton = ({ setErrors }: Props) => {
  const router = useRouter()
  const { data, resetData } = useCreatePatchStore()
  const [creating, setCreating] = useState(false)
  const [showPreSubmitCheck, setShowPreSubmitCheck] = useState(false)

  // 预检查提交数据
  const preSubmitCheck = () => {
    // 检查必填项
    const missingFields: string[] = []
    if (!data.name) missingFields.push('游戏名称')

    const checkImage = async (): Promise<boolean> => {
      const localeBannerBlob: Blob | null = await localforage.getItem('kun-patch-banner')
      if (!localeBannerBlob) missingFields.push('封面图片')

      if (missingFields.length > 0) {
        toast.error(`请完成以下必填项: ${missingFields.join(', ')}`)
        return false
      }

      setShowPreSubmitCheck(true)
      return true
    }

    return checkImage()
  }

  const handleSubmit = async () => {
    const localeBannerBlob: Blob | null =
      await localforage.getItem('kun-patch-banner')
    if (!localeBannerBlob) {
      toast.error('未检测到预览图片')
      return
    }

    const result = patchCreateSchema.safeParse({
      ...data,
      banner: localeBannerBlob,
      alias: JSON.stringify(data.alias),
      tag: JSON.stringify(data.tag)
    })
    if (!result.success) {
      const newErrors: Partial<Record<keyof CreatePatchRequestData, string>> =
        {}
      result.error.errors.forEach((err) => {
        if (err.path.length) {
          newErrors[err.path[0] as keyof CreatePatchRequestData] = err.message
          toast.error(err.message)
        }
      })
      setErrors(newErrors)
      return
    } else {
      setErrors({})
    }

    const formDataToSend = new FormData()
    formDataToSend.append('banner', localeBannerBlob!)
    formDataToSend.append('name', data.name)
    formDataToSend.append('vndbId', data.vndbId)
    formDataToSend.append('introduction', data.introduction)
    formDataToSend.append('alias', JSON.stringify(data.alias))
    formDataToSend.append('tag', JSON.stringify(data.tag))
    formDataToSend.append('released', data.released)
    formDataToSend.append('contentLimit', data.contentLimit)

    setCreating(true)
    toast('正在发布中 ... 这可能需要 10s 左右的时间, 这取决于您的网络环境')

    const res = await kunFetchFormData<
      KunResponse<{
        uniqueId: string
      }>
    >('/edit', formDataToSend)
    kunErrorHandler(res, async (value) => {
      resetData()
      await localforage.removeItem('kun-patch-banner')
      router.push(`/${value.uniqueId}`)
    })
    toast.success('发布完成, 正在为您跳转到资源介绍页面')
    setCreating(false)
    setShowPreSubmitCheck(false)
  }

  // 预提交检查表
  const renderPreSubmitCheck = () => {
    return (
      <Card className="w-full mb-4">
        <CardBody className="p-4">
          <h3 className="text-lg font-semibold mb-2">发布前确认</h3>
          <p className="text-small text-default-500 mb-4">请确认以下信息都已填写完成</p>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>游戏名称</span>
              {data.name ? (
                <Chip color="success" variant="flat" startContent={<CheckCircle size={14} />}>
                  已填写: {data.name}
                </Chip>
              ) : (
                <Chip color="danger" variant="flat" startContent={<XCircle size={14} />}>
                  未填写 (必填)
                </Chip>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span>VNDB ID</span>
              {data.vndbId ? (
                <Chip color="success" variant="flat" startContent={<CheckCircle size={14} />}>
                  已填写: {data.vndbId}
                </Chip>
              ) : (
                <Chip color="warning" variant="flat">
                  未填写 (可选)
                </Chip>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span>封面图片</span>
              <Chip color="success" variant="flat" startContent={<CheckCircle size={14} />}>
                已上传
              </Chip>
            </div>

            <div className="flex justify-between items-center">
              <span>游戏别名</span>
              {data.alias.length > 0 ? (
                <Chip color="success" variant="flat" startContent={<CheckCircle size={14} />}>
                  已添加 {data.alias.length} 个
                </Chip>
              ) : (
                <Chip color="warning" variant="flat">
                  未添加 (可选)
                </Chip>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span>内容分级</span>
              <Chip
                color={data.contentLimit === 'nsfw' ? 'danger' : 'success'}
                variant="flat"
              >
                {data.contentLimit === 'nsfw' ? 'NSFW' : 'SFW'}
              </Chip>
            </div>
          </div>

          <Divider className="my-4" />

          <div className="flex justify-between">
            <Button
              color="default"
              variant="light"
              onPress={() => setShowPreSubmitCheck(false)}
            >
              返回编辑
            </Button>

            <Button
              color="primary"
              onPress={handleSubmit}
              isDisabled={creating}
              isLoading={creating}
              startContent={<SendHorizonal size={18} />}
            >
              确认并发布
            </Button>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <div>
      {showPreSubmitCheck ? (
        renderPreSubmitCheck()
      ) : (
        <Button
          color="primary"
          onPress={preSubmitCheck}
          className="w-full"
          size="lg"
          startContent={<Save size={20} />}
        >
          保存并发布
        </Button>
      )}
    </div>
  )
}
