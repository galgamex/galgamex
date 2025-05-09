'use client'

import { Eye, CheckCircle, XCircle } from 'lucide-react'
import {
    Button,
    Chip,
    Tooltip,
    User,
    Link
} from '@nextui-org/react'
import { formatDate } from '~/utils/time'
import { kunFetchPut } from '~/utils/kunFetch'
import { kunErrorHandler } from '~/utils/kunErrorHandler'
import { toast } from 'react-hot-toast'
import type { AdminCharacter } from '~/types/api/admin'
import { useUserStore } from '~/store/userStore'

interface Props {
    character: AdminCharacter
    columnKey: keyof AdminCharacter | string
    onView: (character: AdminCharacter) => void
    onStatusChange: (character: AdminCharacter) => void
}

export const RenderCell = ({
    character,
    columnKey,
    onView,
    onStatusChange
}: Props) => {
    const handleStatusChange = async (approve: boolean) => {
        const { user } = useUserStore.getState()

        const response = await kunFetchPut<string>('/admin/character', {
            characterId: character.id,
            approve,
            adminUid: user.uid
        })

        kunErrorHandler(response, () => {
            toast.success(approve ? '审核通过成功' : '拒绝角色成功')
            onStatusChange({
                ...character,
                status: approve ? 1 : 2
            })
        })
    }

    const renderStatus = (status: number) => {
        switch (status) {
            case 0:
                return <Chip color="warning" variant="flat">待审核</Chip>
            case 1:
                return <Chip color="success" variant="flat">已通过</Chip>
            case 2:
                return <Chip color="danger" variant="flat">已拒绝</Chip>
            default:
                return <Chip color="default" variant="flat">未知</Chip>
        }
    }

    switch (columnKey) {
        case 'character':
            return (
                <User
                    avatarProps={{ src: character.image, size: 'sm' }}
                    name={character.name}
                    description={character.traits.slice(0, 2).join(', ')}
                />
            )
        case 'game':
            return (
                <Link href={`/patch/${character.patchId}`} color="foreground" isExternal showAnchorIcon>
                    {character.patchName}
                </Link>
            )
        case 'user':
            return (
                <User
                    avatarProps={{ src: character.user.avatar, size: 'sm' }}
                    name={character.user.name}
                />
            )
        case 'status':
            return renderStatus(character.status)
        case 'created':
            return <span>{formatDate(character.created)}</span>
        case 'actions':
            return (
                <div className="flex gap-2">
                    <Tooltip content="查看详情">
                        <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            onPress={() => onView(character)}
                        >
                            <Eye size={16} />
                        </Button>
                    </Tooltip>

                    {character.status === 0 && (
                        <>
                            <Tooltip content="通过">
                                <Button
                                    isIconOnly
                                    variant="light"
                                    size="sm"
                                    color="success"
                                    onPress={() => handleStatusChange(true)}
                                >
                                    <CheckCircle size={16} />
                                </Button>
                            </Tooltip>
                            <Tooltip content="拒绝">
                                <Button
                                    isIconOnly
                                    variant="light"
                                    size="sm"
                                    color="danger"
                                    onPress={() => handleStatusChange(false)}
                                >
                                    <XCircle size={16} />
                                </Button>
                            </Tooltip>
                        </>
                    )}
                </div>
            )
        default:
            return <span>{String(character[columnKey as keyof AdminCharacter] || '')}</span>
    }
} 