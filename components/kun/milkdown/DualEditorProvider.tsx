'use client'

import { useCallback, useState } from 'react'
import { Tabs, Tab } from '@nextui-org/tabs'
import { Code, Edit } from 'lucide-react'
import { Codemirror } from './codemirror/Codemirror'
import { useCreatePatchStore } from '~/store/editStore'
import { useRewritePatchStore } from '~/store/rewriteStore'
import { KunEditor } from './Editor'

interface Props {
  storeName: 'patchCreate' | 'patchRewrite'
}

export const KunDualEditorProvider = ({ storeName }: Props) => {
  const [cmAPI, setCmAPI] = useState({
    update: (_: string) => { }
  })

  const getCreatePatchData = useCreatePatchStore((state) => state.getData)
  const setCreatePatchData = useCreatePatchStore((state) => state.setData)
  const getRewritePatchData = useRewritePatchStore((state) => state.getData)
  const setRewritePatchData = useRewritePatchStore((state) => state.setData)

  const saveMarkdown = useCallback(
    (markdown: string) => {
      if (storeName === 'patchCreate') {
        setCreatePatchData({ ...getCreatePatchData(), introduction: markdown })
      } else if (storeName === 'patchRewrite') {
        setRewritePatchData({
          ...getRewritePatchData(),
          introduction: markdown
        })
      }
      cmAPI.update(markdown)
    },
    [
      cmAPI,
      getCreatePatchData,
      getRewritePatchData,
      setCreatePatchData,
      setRewritePatchData,
      storeName
    ]
  )

  const getMarkdown = useCallback(() => {
    if (storeName === 'patchCreate') {
      return getCreatePatchData().introduction
    } else if (storeName === 'patchRewrite') {
      return getRewritePatchData().introduction
    }
    return ''
  }, [getCreatePatchData, getRewritePatchData, storeName])

  const onCodemirrorChange = useCallback(
    (getCode: () => string) => {
      const value = getCode()
      if (storeName === 'patchCreate') {
        setCreatePatchData({ ...getCreatePatchData(), introduction: value })
      } else if (storeName === 'patchRewrite') {
        setRewritePatchData({ ...getRewritePatchData(), introduction: value })
      }
    },
    [
      getCreatePatchData,
      getRewritePatchData,
      setCreatePatchData,
      setRewritePatchData,
      storeName
    ]
  )

  return (
    <Tabs aria-label="Editor options" size="lg" variant="underlined">



      <Tab
        key="editor"
        title={
          <div className="flex items-center gap-2">
            <Edit size={18} />
            <span>编辑预览</span>
          </div>
        }
      >
        <KunEditor valueMarkdown={getMarkdown()} saveMarkdown={saveMarkdown} />
      </Tab>
    </Tabs >
  )
}
