'use client'

import { useState, useEffect, useTransition } from 'react'
import { Chip, Modal, ModalContent, ModalBody, Button } from '@nextui-org/react'
import { Folder } from 'lucide-react'
import { kunFetchGet, kunFetchPut } from '~/utils/kunFetch'
import toast from 'react-hot-toast'
import { kunErrorHandler } from '~/utils/kunErrorHandler'
import { EditFolderModal } from '~/components/user/favorite/EditFolderModal'
import type { UserFavoritePatchFolder } from '~/types/api/user'

interface Props {
  patchId: number
  isOpen: boolean
  onClose: () => void
}

export const FavoriteModal = ({ patchId, isOpen, onClose }: Props) => {
  const [folders, setFolders] = useState<UserFavoritePatchFolder[]>([])
  const [isPending, startTransition] = useTransition()

  const fetchFolders = async () => {
    const response = await kunFetchGet<UserFavoritePatchFolder[]>(
      '/user/profile/favorite/folder',
      { patchId }
    )
    setFolders(response)
  }

  useEffect(() => {
    if (isOpen) {
      fetchFolders()
    }
  }, [isOpen])

  const handleAddToFolder = async (folderId: number) => {
    startTransition(async () => {
      const res = await kunFetchPut<KunResponse<{ added: boolean }>>(
        `/patch/favorite`,
        { patchId, folderId }
      )
      kunErrorHandler(res, (value) => {
        toast.success(value.added ? '收藏成功' : '取消收藏成功')
        fetchFolders()
      })
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalBody className="py-6">
          <div className="space-y-4">
            <h2>
              <p className="text-lg font-bold">添加到收藏夹</p>
              <p className="text-sm text-default-500">
                点击文件夹收藏, 再次点击取消收藏
              </p>
            </h2>

            <EditFolderModal
              action="create"
              onActionSuccess={(value) => setFolders([...folders, value])}
            />

            {folders.map((folder) => (
              <Button
                key={folder.id}
                startContent={<Folder className="w-4 h-4" />}
                variant="bordered"
                fullWidth
                className="justify-between"
                onPress={() => handleAddToFolder(folder.id)}
                isLoading={isPending}
                isDisabled={isPending}
              >
                <span>{folder.name}</span>
                <Chip size="sm">
                  {folder.isAdd
                    ? '本游戏已添加'
                    : `${folder._count.patch} 个游戏`}
                </Chip>
              </Button>
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
