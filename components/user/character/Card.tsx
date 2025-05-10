'use client'

import { Card, CardBody, CardFooter } from '@nextui-org/card'
import { Image } from '@nextui-org/image'
import { Chip } from '@nextui-org/react'
import { Clock, FileText, Eye } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '~/utils/time'
import type { CharacterWithPatch } from '~/app/user/[id]/character/actions'

const characterStatusMap = {
    0: { label: '待审核', color: 'warning' as const },
    1: { label: '已发布', color: 'success' as const },
    2: { label: '审核失败', color: 'danger' as const }
}

interface CharacterCardProps {
    character: CharacterWithPatch
}

export const CharacterCard = ({ character }: CharacterCardProps) => {
    const status = characterStatusMap[character.status as keyof typeof characterStatusMap] ||
        characterStatusMap[0]

    // 正确的角色查看路径：角色属于某个游戏，应当跳转到游戏页面的角色区域
    const viewUrl = character.patch
        ? `/${character.patch.uniqueId}?character=${character.id}#characters`
        : `/character/${character.id}`;

    // 只有已发布状态的角色才能点击查看
    const isViewable = character.status === 1;

    return (
        <Card className={`w-full hover:shadow-md ${isViewable ? 'cursor-pointer' : 'cursor-default'}`}>
            <Link href={isViewable ? viewUrl : '#'} className={!isViewable ? 'pointer-events-none' : ''}>
                <CardBody className="p-0 overflow-hidden">
                    <div className="relative aspect-[5/6]">
                        <Image
                            src={character.image || '/images/placeholder-character.jpg'}
                            alt={character.name}
                            className="w-full h-full object-cover"
                            removeWrapper
                        />
                        {isViewable && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                                <div className="absolute bottom-2 inset-x-0 flex justify-center items-center gap-1 text-white">
                                    <Eye className="size-3.5" />
                                    <span className="text-sm">查看角色</span>
                                </div>
                            </div>
                        )}
                        <div className="absolute top-2 right-2 z-10">
                            <Chip
                                size="sm"
                                color={status.color}
                                variant="flat"
                                className="backdrop-blur-sm bg-background/40"
                            >
                                {status.label}
                            </Chip>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="flex flex-col items-start p-3 gap-1">
                    <div className="w-full">
                        <h3 className="text-medium font-medium line-clamp-1">{character.name}</h3>
                    </div>

                    {character.patch && (
                        <div className="text-xs text-primary flex items-center gap-1">
                            <FileText className="size-3" />
                            <span className="line-clamp-1">{character.patch.name}</span>
                        </div>
                    )}

                    <div className="flex items-center text-xs text-default-500">
                        <Clock className="size-3 mr-1" />
                        <span>{formatDate(character.created, { isShowYear: true })}</span>
                    </div>
                </CardFooter>
            </Link>
        </Card>
    )
} 