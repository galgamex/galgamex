import { Textarea } from '@nextui-org/react'

interface Props {
  initialTag: string[]
  saveTag: (tag: string[]) => void
  errors?: string
}

export const BatchTag = ({ initialTag, saveTag, errors }: Props) => {
  return (
    <div className="space-y-2">
      <h2 className="text-xl">游戏标签 (可选)</h2>
      {errors && <p className="text-xs text-danger-500">{errors}</p>}
      <Textarea
        placeholder="批量添加标题, 每个标签需要使用英语逗号 ( , ) 分隔"
        value={initialTag.toString()}
        onChange={(e) => {
          saveTag(e.target.value.split(',').map((tag) => tag.trim()))
        }}
        className="w-full"
        minRows={3}
      />
      <p className="text-sm text-default-500">
        无该标签时将会自动创建标签, 并且会根据标签名自动增删游戏的标签以及计数
      </p>
    </div>
  )
}
