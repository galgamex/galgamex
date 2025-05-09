'use client'

import { Button } from '@nextui-org/button'
import { useDisclosure } from '@nextui-org/modal'
import { Plus } from 'lucide-react'
import { CreateTagModal } from '~/components/tag/CreateTagModal'
import { KunHeader } from '../kun/Header'
import type { Tag as TagType } from '~/types/api/tag'
import { useUserStore } from '~/store/userStore'

interface Props {
  setNewTag: (tag: TagType) => void
}

export const TagHeader = ({ setNewTag }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const user = useUserStore((state) => state.user)

  return (
    <>
      <KunHeader
        name="标签列表"
        description="这里是本站 Galgame 中的所有标签"
        headerEndContent={
          <>
            {user.role > 2 && (
              <Button color="primary" onPress={onOpen} startContent={<Plus />}>
                创建标签
              </Button>
            )}
          </>
        }
      />

      <CreateTagModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={(newTag) => {
          setNewTag(newTag)
          onClose()
        }}
      />
    </>
  )
}
