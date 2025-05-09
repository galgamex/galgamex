import { Input, Tooltip } from '@nextui-org/react'
import { HelpCircle } from 'lucide-react'

interface Props {
  name: string
  onChange: (newName: string) => void
  error?: string
}

export const GameNameInput = ({ name, onChange, error }: Props) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <h2 className="text-xl">游戏名称</h2>
      <span className="text-danger">*</span>
      <Tooltip content="游戏名称将作为主标题显示在游戏详情页">
        <HelpCircle className="size-4 text-default-400" />
      </Tooltip>
    </div>

    <Input
      isRequired
      variant="bordered"
      labelPlacement="outside"
      placeholder="输入游戏名称, 这会作为游戏的标题"
      value={name}
      onChange={(e) => onChange(e.target.value)}
      isInvalid={!!error}
      errorMessage={error}
      className="max-w-xl"
    />

    <p className="text-xs text-default-500">
      游戏名称应当简洁明了，可以是中文译名或原名
    </p>
  </div>
)
