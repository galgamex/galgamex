'use client'

import { useState } from 'react'
import { Card, CardBody, CardFooter } from '@nextui-org/card'
import { Button } from '@nextui-org/button'
import { Progress } from '@nextui-org/progress'
import { Tooltip } from '@nextui-org/tooltip'
import { toast } from 'react-hot-toast'
import { useUserStore } from '~/store/userStore'
import {
    IconMessageCircle,
    IconPuzzle,
    IconUser,
    IconStar,
    IconTrophy
} from '@tabler/icons-react'

interface TaskCardProps {
    title: string
    description: string
    reward: number
    progress: number
    total: number
    type: 'comment' | 'patch' | 'character' | 'favorite'
    category: 'daily' | 'weekly' | 'achievements'
    isBadge?: boolean
    claimed?: boolean
}

export const TaskCard = ({
    title,
    description,
    reward,
    progress,
    total,
    type,
    category,
    isBadge = false,
    claimed = false
}: TaskCardProps) => {
    const [loading, setLoading] = useState(false)
    const [localClaimed, setLocalClaimed] = useState(claimed)
    const { user, setUser } = useUserStore(state => state)

    const isCompleted = progress >= total
    const percent = Math.floor((progress / total) * 100)

    const getIcon = () => {
        switch (type) {
            case 'comment':
                return <IconMessageCircle className="text-primary" size={24} />
            case 'patch':
                return <IconPuzzle className="text-success" size={24} />
            case 'character':
                return <IconUser className="text-warning" size={24} />
            case 'favorite':
                return <IconStar className="text-secondary" size={24} />
            default:
                return null
        }
    }

    const getColorClass = () => {
        switch (type) {
            case 'comment':
                return 'primary'
            case 'patch':
                return 'success'
            case 'character':
                return 'warning'
            case 'favorite':
                return 'secondary'
            default:
                return 'default'
        }
    }

    const handleClaimReward = async () => {
        if (!isCompleted || localClaimed || loading) return

        try {
            setLoading(true)
            const taskCategory = category

            const response = await fetch('/api/tasks/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    taskType: type,
                    taskCategory
                })
            })

            const data = await response.json()

            if (response.ok) {
                toast.success(`奖励领取成功！获得了 ${data.reward} 萌萌点`)
                setLocalClaimed(true)

                // 更新用户的萌萌点
                if (user && setUser) {
                    setUser({
                        ...user,
                        moemoepoint: data.moemoepoint || (user.moemoepoint + reward)
                    })
                }
            } else {
                toast.error(`领取失败：${data.message || '请稍后再试'}`)
            }
        } catch (error) {
            toast.error('网络错误，请稍后再试')
        } finally {
            setLoading(false)
        }
    }

    const getButtonText = () => {
        if (localClaimed) return '已领取'
        if (isCompleted) return '领取奖励'
        if (isBadge) return '进行中'
        return '前往完成'
    }

    const handleNavigate = () => {
        // 根据任务类型跳转到相应页面
        if (!isCompleted && !isBadge) {
            switch (type) {
                case 'comment':
                    window.location.href = '/comment'
                    break
                case 'patch':
                    window.location.href = '/galgame'
                    break
                case 'character':
                    window.location.href = '/galgame'
                    break
                case 'favorite':
                    window.location.href = '/galgame'
                    break
                default:
                    break
            }
        }
    }

    return (
        <Card className="w-full">
            <CardBody>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-content1">
                        {isBadge ? (
                            <IconTrophy className="text-warning" size={24} />
                        ) : (
                            getIcon()
                        )}
                    </div>
                    <div className="flex-grow space-y-1">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium">{title}</h3>
                            <div className="flex items-center gap-1 text-success">
                                <span>+{reward}</span>
                                <span className="text-xs">萌萌点</span>
                            </div>
                        </div>
                        <p className="text-default-500 text-sm">{description}</p>
                        <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                                <span>
                                    进度: {progress}/{total}
                                </span>
                                <span>{percent}%</span>
                            </div>
                            <Progress
                                value={percent}
                                color={getColorClass()}
                                className="h-2"
                                aria-label="任务进度"
                            />
                        </div>
                    </div>
                </div>
            </CardBody>
            <CardFooter>
                {localClaimed ? (
                    <Button
                        fullWidth
                        color="success"
                        variant="flat"
                        disabled
                    >
                        已领取
                    </Button>
                ) : isCompleted ? (
                    <Button
                        fullWidth
                        color="success"
                        variant="flat"
                        isLoading={loading}
                        onClick={handleClaimReward}
                    >
                        领取奖励
                    </Button>
                ) : isBadge ? (
                    <Tooltip content="继续完成任务以获得成就徽章">
                        <Button
                            fullWidth
                            color={getColorClass()}
                            variant="flat"
                            disabled
                        >
                            进行中
                        </Button>
                    </Tooltip>
                ) : (
                    <Button
                        fullWidth
                        color={getColorClass()}
                        variant="flat"
                        onClick={handleNavigate}
                    >
                        前往完成
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
} 