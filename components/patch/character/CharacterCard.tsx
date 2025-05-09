import { Card, CardBody, CardFooter } from '@nextui-org/card'
import { Chip } from '@nextui-org/chip'
import { Tooltip } from '@nextui-org/tooltip'
import { useState, useEffect } from 'react'
import { cn } from '~/utils/cn'
import { User, Mic } from 'lucide-react'
import type { PatchCharacter } from '~/types/api/patch'

interface Props {
    character: PatchCharacter
    onClick: () => void
}

export const CharacterCard = ({ character, onClick }: Props) => {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imgError, setImgError] = useState(false)

    // 预加载图片
    useEffect(() => {
        if (character.image) {
            const img = new window.Image()
            img.src = character.image
            img.onload = () => setImageLoaded(true)
            img.onerror = () => setImgError(true)
        }
    }, [character.image])

    return (
        <Card
            isPressable
            className="w-full h-full group border border-default-100 dark:border-default-200 overflow-hidden hover:shadow-md transition-all duration-300"
            onClick={onClick}
        >
            <CardBody className="p-0 overflow-hidden">
                <div className="relative pt-[133%]">
                    {/* 加载状态背景 - 总是显示，只改变透明度 */}
                    <div
                        className={cn(
                            'absolute inset-0 bg-default-100',
                            (imageLoaded && !imgError) ? 'animate-none opacity-0' : 'animate-pulse opacity-90',
                            'transition-opacity duration-300'
                        )}
                    />

                    {/* 图片元素 - 保持位置固定但改变不透明度 */}
                    <img
                        alt={character.name}
                        className={cn(
                            'absolute top-0 left-0 w-full h-full object-cover transition-all duration-500',
                            (imageLoaded && !imgError) ? 'opacity-100' : 'opacity-0',
                            'group-hover:scale-[1.03]'
                        )}
                        src={character.image}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImgError(true)}
                    />

                    {/* 图片加载错误状态 */}
                    {imgError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-default-100">
                            <span className="text-default-500">无法加载图片</span>
                        </div>
                    )}

                    {/* 角色信息悬浮层 - 移动端可见，桌面端鼠标悬浮显示 */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white transform translate-y-0 md:translate-y-[calc(100%-36px)] group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-md font-semibold line-clamp-1 mb-1 flex items-center">
                            {character.name}
                            {character.alias && character.alias.length > 0 && (
                                <Tooltip content={character.alias.join(' / ')}>
                                    <span className="ml-1 text-xs opacity-80 cursor-help">({character.alias.length})</span>
                                </Tooltip>
                            )}
                        </h3>

                        {/* 角色属性信息 */}
                        <div className="flex flex-col gap-1 text-xs opacity-0 md:opacity-100 group-hover:opacity-100 transition-opacity duration-300">
                            {/* 角色类型和声优信息 */}
                            {(character.roleType || character.voiceActor) && (
                                <div className="flex items-center gap-2 text-white/90">
                                    {character.roleType && (
                                        <div className="flex items-center gap-1">
                                            <User size={12} />
                                            <span>{character.roleType}</span>
                                        </div>
                                    )}
                                    {character.voiceActor && (
                                        <div className="flex items-center gap-1">
                                            <Mic size={12} />
                                            <span>CV: {character.voiceActor}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 角色特性标签 */}
                            <div className="flex flex-wrap gap-1 mt-1">
                                {character.traits.slice(0, 2).map((trait, index) => (
                                    <Chip
                                        key={index}
                                        size="sm"
                                        variant="flat"
                                        color="primary"
                                        className="text-tiny bg-primary/20 text-white border-none"
                                        radius="sm"
                                    >
                                        {trait}
                                    </Chip>
                                ))}
                                {character.traits.length > 2 && (
                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        color="default"
                                        className="text-tiny bg-default/30 text-white border-none"
                                        radius="sm"
                                    >
                                        +{character.traits.length - 2}
                                    </Chip>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
} 