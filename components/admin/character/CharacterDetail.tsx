'use client'

import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Button,
    Chip,
    Divider
} from '@nextui-org/react'
import { Image } from '@nextui-org/image'
import { formatDate } from '~/utils/time'
import { kunFetchPut } from '~/utils/kunFetch'
import { kunErrorHandler } from '~/utils/kunErrorHandler'
import { toast } from 'react-hot-toast'
import type { AdminCharacter } from '~/types/api/admin'
import { useUserStore } from '~/store/userStore'

interface Props {
    character: AdminCharacter
    onClose: () => void
    onStatusChange: (character: AdminCharacter) => void
}

export const CharacterDetail = ({ character, onClose, onStatusChange }: Props) => {
    const handleApprove = async () => {
        const { user } = useUserStore.getState()

        const response = await kunFetchPut<string>('/admin/character', {
            characterId: character.id,
            approve: true,
            adminUid: user.uid
        })

        kunErrorHandler(response, () => {
            toast.success('审核通过成功')
            onStatusChange({
                ...character,
                status: 1
            })
        })
    }

    const handleReject = async () => {
        const { user } = useUserStore.getState()

        const response = await kunFetchPut<string>('/admin/character', {
            characterId: character.id,
            approve: false,
            adminUid: user.uid
        })

        kunErrorHandler(response, () => {
            toast.success('拒绝角色成功')
            onStatusChange({
                ...character,
                status: 2
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

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            size="3xl"
            scrollBehavior="inside"
        >
            <ModalContent>
                <ModalHeader className="flex justify-between">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl">{character.name}</h3>
                        {renderStatus(character.status)}
                    </div>
                </ModalHeader>

                <Divider />

                <ModalBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4">
                                <Image
                                    src={character.image}
                                    alt={character.name}
                                    className="object-cover w-full h-full"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {character.traits.map((trait, index) => (
                                    <Chip key={index} variant="flat" color="primary" size="sm">
                                        {trait}
                                    </Chip>
                                ))}
                            </div>

                            {character.alias && character.alias.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-md font-semibold mb-2">别名</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {character.alias.map((item, index) => (
                                            <Chip key={index} variant="flat" color="secondary" size="sm">
                                                {item}
                                            </Chip>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                                {character.age && (
                                    <div>
                                        <span className="font-semibold">年龄：</span>
                                        {character.age}
                                    </div>
                                )}
                                {character.height && (
                                    <div>
                                        <span className="font-semibold">身高：</span>
                                        {character.height}
                                    </div>
                                )}
                                {character.birthday && (
                                    <div>
                                        <span className="font-semibold">生日：</span>
                                        {character.birthday}
                                    </div>
                                )}
                                {character.bloodType && (
                                    <div>
                                        <span className="font-semibold">血型：</span>
                                        {character.bloodType}
                                    </div>
                                )}
                                {character.threeSizes && (
                                    <div className="col-span-2">
                                        <span className="font-semibold">三围：</span>
                                        {character.threeSizes}
                                    </div>
                                )}
                                {character.roleType && (
                                    <div className="col-span-2">
                                        <span className="font-semibold">角色类型：</span>
                                        {character.roleType}
                                    </div>
                                )}
                            </div>

                            {character.hobby && character.hobby.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-md font-semibold mb-2">兴趣爱好</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {character.hobby.map((item, index) => (
                                            <Chip key={index} variant="flat" color="success" size="sm">
                                                {item}
                                            </Chip>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {character.favorite && character.favorite.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-md font-semibold mb-2">喜欢的事物</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {character.favorite.map((item, index) => (
                                            <Chip key={index} variant="flat" color="warning" size="sm">
                                                {item}
                                            </Chip>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {character.personality && character.personality.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-md font-semibold mb-2">性格特点</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {character.personality.map((item, index) => (
                                            <Chip key={index} variant="flat" color="danger" size="sm">
                                                {item}
                                            </Chip>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-lg font-semibold mb-2">角色介绍</h4>
                                <p className="text-sm whitespace-pre-line">{character.description}</p>
                            </div>

                            {character.relationship && (
                                <div>
                                    <h4 className="text-lg font-semibold mb-2">角色关系</h4>
                                    <p className="text-sm whitespace-pre-line">{character.relationship}</p>
                                </div>
                            )}

                            {character.voiceActor && (
                                <div>
                                    <h4 className="text-lg font-semibold mb-2">声优</h4>
                                    <p>{character.voiceActor}</p>
                                </div>
                            )}

                            <div>
                                <h4 className="text-lg font-semibold mb-2">所属游戏</h4>
                                <p>
                                    <a
                                        href={`/patch/${character.patchId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        {character.patchName}
                                    </a>
                                </p>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-2">提交者</h4>
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={character.user.avatar}
                                        alt={character.user.name}
                                        className="size-8 rounded-full"
                                    />
                                    <span>{character.user.name}</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-2">提交时间</h4>
                                <p>{formatDate(character.created, { isShowYear: true, isPrecise: true })}</p>
                            </div>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    {character.status === 0 && (
                        <>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={handleReject}
                            >
                                拒绝
                            </Button>
                            <Button
                                color="success"
                                onPress={handleApprove}
                            >
                                通过
                            </Button>
                        </>
                    )}
                    <Button onPress={onClose}>
                        关闭
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
} 