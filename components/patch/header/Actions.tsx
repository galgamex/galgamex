'use client'

import { useState } from 'react'
import { Button } from '@nextui-org/react'
import { Download, Share2, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next-nprogress-bar'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@nextui-org/modal'
import { useUserStore } from '~/store/userStore'
import { kunFetchDelete } from '~/utils/kunFetch'
import { kunCopy } from '~/utils/kunCopy'
import { kunMoyuMoe } from '~/config/moyu-moe'
import toast from 'react-hot-toast'
import { FavoriteButton } from './button/favorite/FavoriteButton'
import { FeedbackButton } from './button/FeedbackButton'
import type { Patch } from '~/types/api/patch'

interface PatchHeaderActionsProps {
  patch: Patch
  handleClickDownloadNav: () => void
}

export const PatchHeaderActions = ({
  patch,
  handleClickDownloadNav
}: PatchHeaderActionsProps) => {
  const router = useRouter()
  const { user } = useUserStore((state) => state)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [deleting, setDeleting] = useState(false)

  const handleShareLink = () => {
    const text = `${patch.name} - ${kunMoyuMoe.domain.main}/patch/${patch.id}/introduction`
    kunCopy(text)
    toast.success('链接已复制到剪贴板')
  }

  const handleDelete = async () => {
    setDeleting(true)
    const res = await kunFetchDelete<KunResponse<{}>>('/patch', {
      patchId: patch.id
    })

    if (typeof res === 'string') {
      toast.error(res)
    } else {
      toast.success('删除 Galgame 成功')
      router.push('/')
    }

    onClose()
    setDeleting(false)
  }

  const handlePressDeleteButton = () => {
    if (user.uid !== patch.user.id && user.role < 4) {
      toast.error('仅游戏发布者或超级管理员可删除该游戏')
      return
    }
    onOpen()
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
      <div className="flex flex-wrap gap-2">
        <Button
          color="primary"
          variant="flat"
          startContent={<Download className="size-4" />}
          onPress={handleClickDownloadNav}
          size="sm"
        >
          下载
        </Button>

        <FavoriteButton patchId={patch.id} isFavorite={patch.isFavorite} />

        <Button
          variant="flat"
          isIconOnly
          size="sm"
          onPress={handleShareLink}
          aria-label="复制分享链接"
        >
          <Share2 className="size-4" />
        </Button>

        {user.role > 2 && (
          <>
            <Button
              variant="flat"
              isIconOnly
              size="sm"
              onPress={() => router.push('/edit/rewrite')}
              aria-label="编辑游戏信息"
            >
              <Pencil className="size-4" />
            </Button>

            <Button
              variant="flat"
              isIconOnly
              size="sm"
              onPress={handlePressDeleteButton}
              aria-label="删除游戏"
            >
              <Trash2 className="size-4" />
            </Button>
          </>
        )}

        <FeedbackButton patch={patch} />
      </div>

      <p className="text-xs text-default-500">
        收藏后, 有新补丁资源发布时, 您将收到通知
      </p>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>永久删除 Galgame</ModalHeader>
          <ModalBody>
            删除将会移除所有评论、资源链接及贡献历史记录，确定要删除吗？
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              取消
            </Button>
            <Button
              color="danger"
              onPress={handleDelete}
              isDisabled={deleting}
              isLoading={deleting}
            >
              删除
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
