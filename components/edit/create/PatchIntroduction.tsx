'use client'

import { KunDualEditorProvider } from '~/components/kun/milkdown/DualEditorProvider'
import { useCreatePatchStore } from '~/store/editStore'
import { markdownToText } from '~/utils/markdownToText'
import { Tooltip, Card, CardBody, Progress } from '@nextui-org/react'
import { HelpCircle, FileText } from 'lucide-react'

interface Props {
  errors: string | undefined
}

export const PatchIntroduction = ({ errors }: Props) => {
  const { data } = useCreatePatchStore()
  const textLength = markdownToText(data.introduction).length
  const recommendedMinLength = 100
  const progress = Math.min(100, (textLength / recommendedMinLength) * 100)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl">游戏介绍</h2>
        <Tooltip content="游戏介绍将显示在游戏详情页，并用于SEO优化">
          <HelpCircle className="size-4 text-default-400" />
        </Tooltip>
      </div>

      <Card className="bg-default-50 shadow-none">
        <CardBody className="p-3">
          <div className="flex items-center gap-2 text-default-600">
            <FileText className="size-4" />
            <span>编辑器提示</span>
          </div>
          <ul className="text-xs text-default-500 mt-2 pl-6 list-disc space-y-1">
            <li>支持Markdown格式，可使用粗体、斜体、链接等</li>
            <li>建议填写100字以上的介绍，有助于SEO优化</li>
            <li>可包含游戏背景、特色、制作组信息等</li>
          </ul>
        </CardBody>
      </Card>

      {errors && <p className="text-xs text-danger-500">{errors}</p>}

      <div className="border rounded-lg overflow-hidden">
        <KunDualEditorProvider storeName="patchCreate" />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-small">字数: {textLength}</span>
          <span className={`text-small ${textLength >= recommendedMinLength ? 'text-success' : 'text-default-500'}`}>
            {textLength >= recommendedMinLength ? '✓ 已达到推荐字数' : `建议至少 ${recommendedMinLength} 字`}
          </span>
        </div>
        <Progress
          size="sm"
          value={progress}
          color={textLength >= recommendedMinLength ? "success" : "primary"}
          aria-label="介绍字数进度"
        />
      </div>
    </div>
  )
}
