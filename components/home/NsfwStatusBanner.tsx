'use client'

import { useSettingStore } from '~/store/settingStore'
import { Ban, ShieldCheck, CircleSlash, Info, X } from 'lucide-react'
import { Chip, Button } from '@nextui-org/react'
import type { JSX } from 'react'

type NsfwStatusType = 'sfw' | 'nsfw' | 'all'

const nsfwStatusMap: Record<NsfwStatusType, {
    icon: JSX.Element;
    text: string;
    description: string;
    color: 'success' | 'warning' | 'default';
}> = {
    sfw: {
        icon: <ShieldCheck className="size-4" />,
        text: '安全模式 (SFW)',
        description: '仅显示适合公共场合浏览的内容',
        color: 'success'
    },
    nsfw: {
        icon: <Ban className="size-4" />,
        text: '成人模式 (NSFW)',
        description: '仅显示可能含有限制级内容的资源',
        color: 'warning'
    },
    all: {
        icon: <CircleSlash className="size-4" />,
        text: '全部内容',
        description: '同时显示安全与成人内容',
        color: 'default'
    }
}

interface NsfwStatusBannerProps {
    onClose: () => void;
}

export const NsfwStatusBanner = ({ onClose }: NsfwStatusBannerProps) => {
    const settings = useSettingStore((state) => state.data)
    const nsfwStatus = nsfwStatusMap[settings.kunNsfwEnable as NsfwStatusType] || nsfwStatusMap.sfw

    return (
        <div className="flex flex-col relative" data-nosnippet>
            <Button
                isIconOnly
                variant="light"
                size="sm"
                className="absolute top-0 right-0"
                onClick={onClose}
                aria-label="关闭内容筛选模式提示"
            >
                <X className="size-4" />
            </Button>
            <div className="flex items-center gap-2 pr-8">
                <Info className="size-4 text-default-500" />
                <span className="text-sm text-default-600">当前内容筛选模式:</span>
            </div>
            <div className="mt-1">
                <Chip
                    startContent={nsfwStatus.icon}
                    color={nsfwStatus.color}
                    variant="flat"
                    classNames={{
                        base: "px-3 py-1",
                        content: "font-medium"
                    }}
                >
                    {nsfwStatus.text}
                </Chip>
                <span className="ml-2 text-xs text-default-500">{nsfwStatus.description}</span>
            </div>
        </div>
    )
} 