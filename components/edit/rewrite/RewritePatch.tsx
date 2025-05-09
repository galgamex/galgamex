'use client'

import { useState } from 'react'
import { Button, Card, CardBody, CardHeader, Tabs, Tab, Tooltip } from '@nextui-org/react'
import { useRewritePatchStore } from '~/store/rewriteStore'
import { KunDualEditorProvider } from '~/components/kun/milkdown/DualEditorProvider'
import toast from 'react-hot-toast'
import { kunFetchPut } from '~/utils/kunFetch'
import { kunErrorHandler } from '~/utils/kunErrorHandler'
import { patchUpdateSchema } from '~/validations/edit'
import { useRouter } from 'next-nprogress-bar'
import { GameNameInput } from './GameNameInput'
import { AliasManager } from './AliasManager'
import { ContentLimit } from './ContentLimit'
import { BatchTag } from '../components/BatchTag'
import { ReleaseDateInput } from '../components/ReleaseDateInput'
import { VNDBInput } from './VNDBInput'
import { markdownToText } from '~/utils/markdownToText'
import { Info, BookOpen, Layers, Tag, Save } from 'lucide-react'
import type { RewritePatchData } from '~/store/rewriteStore'

export const RewritePatch = () => {
  const router = useRouter()
  const { data, setData } = useRewritePatchStore()
  const [errors, setErrors] = useState<
    Partial<Record<keyof RewritePatchData, string>>
  >({})

  const addAlias = (newAlias: string) => {
    const alias = newAlias.trim().toLowerCase()
    if (data.alias.includes(alias)) {
      toast.error('请不要使用重复的别名')
      return
    }
    if (newAlias.trim()) {
      setData({ ...data, alias: [...data.alias, alias] })
    }
  }

  const [rewriting, setRewriting] = useState(false)
  const handleSubmit = async () => {
    const result = patchUpdateSchema.safeParse(data)
    if (!result.success) {
      const newErrors: Partial<Record<keyof RewritePatchData, string>> = {}
      result.error.errors.forEach((err) => {
        if (err.path.length) {
          newErrors[err.path[0] as keyof RewritePatchData] = err.message
          toast.error(err.message)
        }
      })
      setErrors(newErrors)
      return
    } else {
      setErrors({})
    }

    setRewriting(true)

    const res = kunFetchPut<KunResponse<{}>>('/edit', { ...data })
    kunErrorHandler(res, async () => {
      router.push(`/${data.uniqueId}`)
    })
    toast.success('重新编辑成功, 由于缓存影响, 您的更改将在至多 30 秒后生效')
    setRewriting(false)
  }

  return (
    <div className="flex-1 w-full max-w-5xl p-4 mx-auto">
      <Card className="w-full">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <h1 className="text-2xl">编辑游戏信息</h1>
          </div>
        </CardHeader>
        <CardBody className="mt-4 space-y-12">
          <VNDBInput
            vndbId={data.vndbId}
            setVNDBId={(id) =>
              setData({
                ...data,
                vndbId: id
              })
            }
            errors={errors.vndbId}
          />

          <GameNameInput
            name={data.name}
            onChange={(name) => setData({ ...data, name })}
            error={errors.name}
          />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl">游戏介绍</h2>
              <Tooltip content="游戏介绍将显示在游戏详情页，并用于SEO优化">
                <Info className="size-4 text-default-400" />
              </Tooltip>
            </div>

            {errors.introduction && (
              <p className="text-xs text-danger-500">{errors.introduction}</p>
            )}

            <div className="border rounded-lg overflow-hidden">
              <KunDualEditorProvider storeName="patchRewrite" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-small">
                  字数: {markdownToText(data.introduction).length}
                </span>
                <span className="text-small text-default-500">
                  建议至少 100 字
                </span>
              </div>
            </div>
          </div>

          <AliasManager
            aliasList={data.alias}
            onAddAlias={addAlias}
            onRemoveAlias={(index) =>
              setData({
                ...data,
                alias: data.alias.filter((_, i) => i !== index)
              })
            }
            errors={errors.alias}
          />

          <ReleaseDateInput
            date={data.released}
            setDate={(date) => {
              setData({ ...data, released: date })
            }}
            errors={errors.released}
          />

          <BatchTag
            initialTag={data.tag}
            saveTag={(tag) =>
              setData({
                ...data,
                tag
              })
            }
            errors={errors.tag}
          />

          <ContentLimit errors={errors.contentLimit} />

          <Button
            color="primary"
            className="w-full"
            onPress={handleSubmit}
            isLoading={rewriting}
            isDisabled={rewriting}
            size="lg"
            startContent={<Save size={20} />}
          >
            保存更改
          </Button>
        </CardBody>
      </Card>
    </div>
  )
}
