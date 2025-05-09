'use client'

import {
  Button,
  Tooltip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Textarea
} from '@nextui-org/react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { kunFetchPost } from '~/utils/kunFetch'
import { MessageCircleQuestion } from 'lucide-react'
import type { Patch } from '~/types/api/patch'

interface Props {
  patch: Patch
}

export const FeedbackButton = ({ patch }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [inputValue, setInputValue] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmitFeedback = async () => {
    setSubmitting(true)
    const res = await kunFetchPost<KunResponse<{}>>('/patch/feedback', {
      patchId: patch.id,
      content: inputValue
    })
    if (typeof res === 'string') {
      toast.error(res)
    } else {
      setInputValue('')
      toast.success('提交反馈成功')
    }
    onClose()
    setSubmitting(false)
  }

  return (
    <>
      <Tooltip content="游戏反馈">
        <Button
          variant="bordered"
          isIconOnly
          aria-label="游戏反馈"
          onPress={onOpen}
          size="sm"
        >
          <MessageCircleQuestion className="size-4" />
        </Button>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            提交 Galgame 反馈
          </ModalHeader>
          <ModalBody>
            <Textarea
              label={`游戏 ${patch.name} 的反馈`}
              isRequired
              placeholder="请填写反馈内容 (游戏错误, 资源失效, 游戏介绍错误等等, 请尽可能详细并指明具体的位置)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              取消
            </Button>
            <Button
              color="primary"
              onPress={handleSubmitFeedback}
              isDisabled={submitting}
              isLoading={submitting}
            >
              提交
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
