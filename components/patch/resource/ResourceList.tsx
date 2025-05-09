'use client'

import {
    Button,
    Card,
    CardBody,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger
} from '@nextui-org/react'
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react'
import { useUserStore } from '~/store/userStore'
import { ResourceInfo } from './ResourceInfo'
import { ResourceDownload } from './ResourceDownload'
import type { PatchResource } from '~/types/api/patch'
import { RESOURCE_SECTION_MAP } from '~/constants/resource'

interface Props {
    resources: PatchResource[]
    setEditResource: (resources: PatchResource) => void
    onOpenEdit: () => void
    onOpenDelete: () => void
    setDeleteResourceId: (resourceId: number) => void
}

export const ResourceList = ({
    resources,
    setEditResource,
    onOpenEdit,
    onOpenDelete,
    setDeleteResourceId
}: Props) => {
    const { user } = useUserStore((state) => state)

    return (
        <div className="space-y-4">
            {resources.length > 0 ? (
                resources.map((resource) => (
                    <Card key={resource.id}>
                        <CardBody className="space-y-2">
                            <div className="flex items-start justify-between">
                                <ResourceInfo resource={resource} />

                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button variant="light" isIconOnly>
                                            <MoreHorizontal
                                                aria-label="资源操作"
                                                className="size-4"
                                            />
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        aria-label="Resource actions"
                                        disabledKeys={
                                            user.uid !== resource.userId && user.role < 3
                                                ? ['edit', 'delete']
                                                : []
                                        }
                                    >
                                        <DropdownItem
                                            key="edit"
                                            startContent={<Edit className="size-4" />}
                                            onPress={() => {
                                                setEditResource(resource)
                                                onOpenEdit()
                                            }}
                                        >
                                            编辑
                                        </DropdownItem>
                                        <DropdownItem
                                            key="delete"
                                            className="text-danger"
                                            color="danger"
                                            startContent={<Trash2 className="size-4" />}
                                            onPress={() => {
                                                setDeleteResourceId(resource.id)
                                                onOpenDelete()
                                            }}
                                        >
                                            删除
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>

                            <ResourceDownload resource={resource} />
                        </CardBody>
                    </Card>
                ))
            ) : (
                <div className="py-8 text-center text-default-500">
                    暂无资源
                </div>
            )}
        </div>
    )
} 