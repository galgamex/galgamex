'use client'

import { useState } from 'react'
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip
} from '@nextui-org/react'
import { Link } from 'lucide-react'
import { toggleLinkCommand } from '@milkdown/preset-commonmark'
import type { CmdKey } from '@milkdown/core'

interface VideoInsertButtonProps {
  call: <T>(command: CmdKey<T>, payload?: T | undefined) => boolean | undefined
}

export const LinkInsertButton = ({ call }: VideoInsertButtonProps) => {
  const [link, setLink] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleLinkInsert = () => {
    call(toggleLinkCommand.key, { href: link })
    setLink('')
    setIsOpen(false)
  }

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom"
      offset={10}
    >
      <PopoverTrigger>
        <Button isIconOnly variant="light">
          <Tooltip content="插入链接" offset={16}>
            <Link className="size-6" />
          </Tooltip>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px]">
        {(titleProps) => (
          <div className="w-full px-1 py-2">
            <p className="font-bold text-small text-foreground" {...titleProps}>
              选中文本以插入链接
            </p>
            <div className="flex flex-col w-full gap-2 mt-2">
              <Input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                label="链接 URL"
                size="sm"
                variant="bordered"
              />
            </div>
            <Button
              variant="flat"
              color="primary"
              onPress={handleLinkInsert}
              className="w-full mt-2"
            >
              确定插入
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
