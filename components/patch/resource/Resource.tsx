'use client'

import { useEffect, useState } from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@nextui-org/react'
import { Plus } from 'lucide-react'
import { kunFetchDelete, kunFetchGet } from '~/utils/kunFetch'
import { PublishResource } from './publish/PublishResource'
import { EditResourceDialog } from './edit/EditResourceDialog'
import { ResourceList } from './ResourceList'
import { KunLoading } from '~/components/kun/Loading'
import toast from 'react-hot-toast'
import { useUserStore } from '~/store/userStore'
import type { PatchResource } from '~/types/api/patch'

interface Props {
  id: number
  section: 'galgame' | 'patch'
}

export const Resources = ({ id, section }: Props) => {
  const [loading, setLoading] = useState(false)
  const [resources, setResources] = useState<PatchResource[]>([])
  const user = useUserStore((state) => state.user)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const res = await kunFetchGet<PatchResource[]>('/patch/resource', {
        patchId: Number(id)
      })
      setLoading(false)
      // 按照section筛选资源
      setResources(res.filter(resource => resource.section === section))
    }
    fetchData()
  }, [id, section])

  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate
  } = useDisclosure()

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit
  } = useDisclosure()
  const [editResource, setEditResource] = useState<PatchResource | null>(null)

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete
  } = useDisclosure()
  const [deleteResourceId, setDeleteResourceId] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const handleDeleteResource = async () => {
    setDeleting(true)

    await kunFetchDelete<KunResponse<{}>>('/patch/resource', {
      resourceId: deleteResourceId
    })

    setResources((prev) =>
      prev.filter((resource) => resource.id !== deleteResourceId)
    )
    setDeleteResourceId(0)
    setDeleting(false)
    onCloseDelete()
    toast.success('删除资源链接成功')
  }

  // 普通用户（角色小于3）且当前是游戏资源（galgame）时不显示添加按钮
  const shouldShowAddButton = !(user.role < 3 && section === 'galgame')

  return (
    <div className="mt-4 space-y-4">
      {shouldShowAddButton && (
        <div className="flex justify-end">
          <Button
            color="primary"
            variant="flat"
            startContent={<Plus className="size-4" />}
            onPress={onOpenCreate}
          >
            添加资源
          </Button>
        </div>
      )}

      {loading ? (
        <KunLoading hint={`正在获取 ${section === 'galgame' ? 'Galgame 资源' : 'Galgame 补丁'}数据...`} />
      ) : (
        <ResourceList
          resources={resources}
          setEditResource={setEditResource}
          onOpenEdit={onOpenEdit}
          onOpenDelete={onOpenDelete}
          setDeleteResourceId={setDeleteResourceId}
        />
      )}

      <Modal
        size="3xl"
        isOpen={isOpenCreate}
        onClose={onCloseCreate}
        scrollBehavior="outside"
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <PublishResource
          patchId={id}
          section={section}
          onClose={onCloseCreate}
          onSuccess={(res) => {
            setResources([...resources, res])
            onCloseCreate()
          }}
        />
      </Modal>

      <Modal
        size="3xl"
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        scrollBehavior="outside"
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <EditResourceDialog
          onClose={onCloseEdit}
          resource={editResource!}
          onSuccess={(res) => {
            setResources((prevResources) =>
              prevResources.map((resource) =>
                resource.id === res.id ? res : resource
              )
            )
            onCloseEdit()
          }}
        />
      </Modal>

      <Modal isOpen={isOpenDelete} onClose={onCloseDelete} placement="center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            删除资源链接
          </ModalHeader>
          <ModalBody>
            <p>
              您确定要删除这条资源链接吗,
              这将会导致您发布资源链接获得的萌萌点被扣除, 该操作不可撤销
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCloseDelete}>
              取消
            </Button>
            <Button
              color="danger"
              onPress={handleDeleteResource}
              disabled={deleting}
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
