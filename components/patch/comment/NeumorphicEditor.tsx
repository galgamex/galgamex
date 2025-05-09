'use client'

import { useState } from 'react'
import { Button } from '@nextui-org/button'
import { Chip } from '@nextui-org/chip'
import { Send, X } from 'lucide-react'
import { useUserStore } from '~/store/userStore'
import { KunAvatar } from '~/components/kun/floating-card/KunAvatar'
import { KunEditor } from '~/components/kun/milkdown/Editor'
import { Markdown } from '~/components/kun/icons/Markdown'
import { useKunMilkdownStore } from '~/store/milkdownStore'

interface NeumorphicEditorProps {
    patchId: number
    receiverUsername?: string | null
    parentId?: number | null
    onCancel?: () => void
    onSubmit: (content: string) => Promise<void>
}

export const NeumorphicEditor = ({
    receiverUsername,
    onCancel,
    onSubmit
}: NeumorphicEditorProps) => {
    const [loading, setLoading] = useState(false)
    const { user } = useUserStore((state) => state)
    const refreshMilkdownContent = useKunMilkdownStore(
        (state) => state.refreshMilkdownContent
    )
    const [content, setContent] = useState('')

    const handleSubmit = async () => {
        if (!content.trim()) return

        setLoading(true)
        try {
            await onSubmit(content.trim())
            setContent('')
            refreshMilkdownContent()
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="rounded-xl bg-content1 shadow-md transition-all p-4 border border-default-200 dark:bg-content1/50 backdrop-blur-md dark:backdrop-blur-lg">
            <div className="flex items-center gap-3 mb-3">
                <KunAvatar
                    uid={user.uid}
                    avatarProps={{
                        showFallback: true,
                        name: user.name,
                        src: user.avatar,
                        size: "sm"
                    }}
                />
                <div className="flex flex-col">
                    <span className="font-medium text-sm">{user.name}</span>
                    {receiverUsername && (
                        <span className="text-xs text-default-500">回复 @{receiverUsername}</span>
                    )}
                </div>

                {onCancel && (
                    <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        className="ml-auto"
                        onPress={onCancel}
                    >
                        <X size={18} />
                    </Button>
                )}
            </div>

            <div className="mb-3 bg-background dark:bg-background/70 rounded-lg overflow-hidden p-1">
                <KunEditor valueMarkdown={content} saveMarkdown={setContent} placeholder="说点什么吧..." />
            </div>

            <div className="flex items-center justify-between">
                <Chip
                    variant="flat"
                    color="secondary"
                    size="sm"
                    endContent={<Markdown />}
                    className="select-none bg-secondary/10"
                >
                    支持 Markdown
                </Chip>

                <Button
                    color="primary"
                    size="sm"
                    startContent={<Send size={16} />}
                    isDisabled={!content.trim() || loading}
                    isLoading={loading}
                    onPress={handleSubmit}
                >
                    发布
                </Button>
            </div>
        </div>
    )
} 