'use client'

import { RadioGroup, Radio, Tooltip } from '@nextui-org/react'
import { useRewritePatchStore } from '~/store/rewriteStore'
import { AlertTriangle, ShieldCheck } from 'lucide-react'

interface Props {
  errors: string | undefined
}

export const ContentLimit = ({ errors }: Props) => {
  const { data, setData } = useRewritePatchStore()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl">内容分级</h2>
        <Tooltip content="选择适当的内容分级，NSFW内容将会在用户浏览时提供警告">
          <AlertTriangle className="size-4 text-default-400" />
        </Tooltip>
      </div>

      <RadioGroup
        orientation="horizontal"
        value={data.contentLimit}
        onValueChange={(value) => setData({ ...data, contentLimit: value as 'nsfw' | 'sfw' })}
        className="mt-4"
      >
        <div className="flex gap-4">
          <label className="flex items-start gap-2 p-4 border-1 rounded-md cursor-pointer">
            <Radio
              value="sfw"
              className="mt-1"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-success/10 p-2 rounded-full">
                  <ShieldCheck className="text-success" />
                </div>
                <span className="text-lg font-medium">SFW</span>
              </div>
              <p className="text-sm text-default-500">适合所有年龄段的内容</p>
            </div>
          </label>

          <label className="flex items-start gap-2 p-4 border-1 rounded-md cursor-pointer">
            <Radio
              value="nsfw"
              color="danger"
              className="mt-1"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-danger/10 p-2 rounded-full">
                  <AlertTriangle className="text-danger" />
                </div>
                <span className="text-lg font-medium">NSFW</span>
              </div>
              <p className="text-sm text-default-500">包含成人内容，将显示警告提示</p>
            </div>
          </label>
        </div>
      </RadioGroup>

      {errors && <p className="text-xs text-danger-500">{errors}</p>}
    </div>
  )
}
