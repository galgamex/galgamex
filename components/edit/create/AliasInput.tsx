'use client'

import { useState } from 'react'
import { Button, Chip, Input, Tooltip, Divider } from '@nextui-org/react'
import { Plus, Info, X } from 'lucide-react'
import { useCreatePatchStore } from '~/store/editStore'
import toast from 'react-hot-toast'

interface Props {
  errors: string | undefined
}

export const AliasInput = ({ errors }: Props) => {
  const { data, setData } = useCreatePatchStore()
  const [newAlias, setNewAlias] = useState<string>('')

  const addAlias = () => {
    const alias = newAlias.trim().toLowerCase()
    if (data.alias.includes(alias)) {
      toast.error('请不要使用重复的别名')
      return
    }
    if (newAlias.trim()) {
      setData({ ...data, alias: [...data.alias, alias] })
      setNewAlias('')
    }
  }

  const removeAlias = (index: number) => {
    setData({
      ...data,
      alias: data.alias.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl">游戏别名</h2>
        <Tooltip content="建议填写游戏的日语原名以便搜索，第一个别名将作为SEO信息">
          <Info className="size-4 text-default-400" />
        </Tooltip>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="输入后点击添加或按回车键"
          value={newAlias}
          onChange={(e) => setNewAlias(e.target.value)}
          className="flex-1"
          variant="bordered"
          startContent={<Plus size={18} className="text-default-400" />}
          isInvalid={!!errors}
          errorMessage={errors}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              addAlias();
            }
          }}
        />
        <Button
          color="primary"
          onPress={addAlias}
          className="self-end min-w-24"
          aria-label="添加 Galgame 别名"
        >
          添加别名
        </Button>
      </div>

      {data.alias.length > 0 && (
        <>
          <Divider className="my-2" />
          <div className="flex flex-wrap gap-2 mt-2">
            {data.alias.map((alias, index) => {
              const isFirstAlias = index === 0;
              return (
                <Chip
                  key={index}
                  onClose={() => removeAlias(index)}
                  variant="flat"
                  color={isFirstAlias ? "primary" : "default"}
                  className="h-8"
                  startContent={isFirstAlias && <Info size={14} className="mr-1" />}
                  endContent={<X size={14} className="cursor-pointer" onClick={() => removeAlias(index)} />}
                >
                  {isFirstAlias ? `${alias} (SEO)` : alias}
                </Chip>
              );
            })}
          </div>
          <p className="text-xs text-default-500">
            提示：第一个别名（蓝色标记）将用于SEO，建议使用游戏的日文原名
          </p>
        </>
      )}
    </div>
  )
}
