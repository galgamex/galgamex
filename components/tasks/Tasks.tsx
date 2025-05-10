'use client'

import { useState, useEffect } from 'react'
import { KunHeader } from '~/components/kun/Header'
import { TaskCard } from './TaskCard'
import { Card, CardBody } from '@nextui-org/card'
import { Tabs, Tab } from '@nextui-org/tabs'
import { Badge } from '@nextui-org/badge'
import { Spinner } from '@nextui-org/spinner'
import { useUserStore } from '~/store/userStore'

interface TaskProgress {
    progress: number
    total: number
}

interface TasksData {
    moemoepoint: number
    claimed_tasks: string[]
    tasks: {
        daily: {
            comment: TaskProgress
            patch: TaskProgress
            character: TaskProgress
            favorite: TaskProgress
        }
        weekly: {
            comment: TaskProgress
            patch: TaskProgress
        }
        achievements: {
            comment: TaskProgress
            patch: TaskProgress
            character: TaskProgress
            favorite: TaskProgress
        }
    }
}

export const Tasks = () => {
    const [selected, setSelected] = useState<string>('daily')
    const [loading, setLoading] = useState<boolean>(true)
    const [tasksData, setTasksData] = useState<TasksData | null>(null)
    const { user } = useUserStore((state) => state)
    const isAuthenticated = !!user?.uid

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true)
                const res = await fetch('/api/tasks')
                if (!res.ok) {
                    throw new Error('获取任务数据失败')
                }
                const data = await res.json()
                setTasksData(data)
            } catch (error) {
                console.error('获取任务数据失败:', error)
            } finally {
                setLoading(false)
            }
        }

        if (isAuthenticated) {
            fetchTasks()
        } else {
            setLoading(false)
        }
    }, [isAuthenticated])

    if (loading) {
        return (
            <div className="w-full my-4 flex justify-center items-center" style={{ minHeight: '60vh' }}>
                <Spinner label="加载任务数据中..." color="primary" size="lg" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="w-full  m-auto my-4">
                <KunHeader
                    name="任务中心"
                    description="完成任务可以获取萌萌点，增加您的社区积分"
                />
                <div className="max-w-6xl m-auto mt-8 text-center">
                    <Card>
                        <CardBody className="py-10">
                            <p className="text-lg">请先登录后查看您的任务</p>
                        </CardBody>
                    </Card>
                </div>
            </div>
        )
    }

    if (!tasksData) {
        return (
            <div className="w-full my-4">
                <KunHeader
                    name="任务中心"
                    description="完成任务可以获取萌萌点，增加您的社区积分"
                />
                <div className="max-w-6xl m-auto mt-8 text-center">
                    <Card>
                        <CardBody className="py-10">
                            <p className="text-lg">获取任务数据失败，请刷新页面重试</p>
                        </CardBody>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full  my-4">
            <KunHeader
                name="任务中心"
                description="完成任务可以获取萌萌点，增加您的社区积分"
                endContent={
                    <Card className="w-full mt-4">
                        <CardBody>
                            <div className="flex flex-col sm:flex-row justify-between items-center">
                                <div className="text-lg font-medium">
                                    <span className="text-default-600">当前萌萌点：</span>
                                    <span className="text-primary">{tasksData.moemoepoint}</span>
                                </div>
                                <div className="text-sm text-default-400 mt-2 sm:mt-0">
                                    积极参与社区活动，获取更多萌萌点
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                }
            />

            <div className="max-w-[1500px] m-auto space-y-8">
                <Tabs
                    selectedKey={selected}
                    onSelectionChange={(key) => setSelected(key as string)}
                    aria-label="任务类型"
                    color="primary"
                    classNames={{
                        tabList: "gap-6",
                    }}
                >
                    <Tab
                        key="daily"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>每日任务</span>
                                <Badge content="4" color="primary" size="sm">
                                    <div className="w-2 h-2"></div>
                                </Badge>
                            </div>
                        }
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TaskCard
                                title="每日评论"
                                description="每日评论限制1次"
                                reward={1}
                                progress={tasksData.tasks.daily.comment.progress}
                                total={1}
                                type="comment"
                                category="daily"
                                claimed={tasksData.claimed_tasks.includes('daily_comment')}
                            />
                            <TaskCard
                                title="补丁创作者"
                                description="补丁创作限制3次，每次3个萌萌点"
                                reward={3}
                                progress={tasksData.tasks.daily.patch.progress}
                                total={3}
                                type="patch"
                                category="daily"
                                claimed={tasksData.claimed_tasks.includes('daily_patch')}
                            />
                            <TaskCard
                                title="角色创建"
                                description="角色创建限制3次，每次2个萌萌点"
                                reward={2}
                                progress={tasksData.tasks.daily.character.progress}
                                total={3}
                                type="character"
                                category="daily"
                                claimed={tasksData.claimed_tasks.includes('daily_character')}
                            />
                            <TaskCard
                                title="收藏游戏"
                                description="收藏游戏限制1次"
                                reward={1}
                                progress={tasksData.tasks.daily.favorite.progress}
                                total={1}
                                type="favorite"
                                category="daily"
                                claimed={tasksData.claimed_tasks.includes('daily_favorite')}
                            />
                        </div>
                    </Tab>
                    <Tab
                        key="weekly"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>每周任务</span>
                                <Badge content="2" color="secondary" size="sm">
                                    <div className="w-2 h-2"></div>
                                </Badge>
                            </div>
                        }
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TaskCard
                                title="社区活跃者"
                                description="发表20次评论"
                                reward={5}
                                progress={tasksData.tasks.weekly.comment.progress}
                                total={20}
                                type="comment"
                                category="weekly"
                                claimed={tasksData.claimed_tasks.includes('weekly_comment')}
                            />
                            <TaskCard
                                title="资源贡献者"
                                description="上传5个补丁资源"
                                reward={5}
                                progress={tasksData.tasks.weekly.patch.progress}
                                total={5}
                                type="patch"
                                category="weekly"
                                claimed={tasksData.claimed_tasks.includes('weekly_patch')}
                            />
                        </div>
                    </Tab>
                    <Tab
                        key="achievements"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>成就徽章</span>
                            </div>
                        }
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TaskCard
                                title="补丁大师"
                                description="累计上传30个补丁资源"
                                reward={20}
                                progress={tasksData.tasks.achievements.patch.progress}
                                total={30}
                                type="patch"
                                category="achievements"
                                isBadge
                                claimed={tasksData.claimed_tasks.includes('achievements_patch')}
                            />
                            <TaskCard
                                title="评论达人"
                                description="累计发表100条评论"
                                reward={20}
                                progress={tasksData.tasks.achievements.comment.progress}
                                total={100}
                                type="comment"
                                category="achievements"
                                isBadge
                                claimed={tasksData.claimed_tasks.includes('achievements_comment')}
                            />
                            <TaskCard
                                title="角色百科全书"
                                description="累计创建50个角色信息"
                                reward={20}
                                progress={tasksData.tasks.achievements.character.progress}
                                total={50}
                                type="character"
                                category="achievements"
                                isBadge
                                claimed={tasksData.claimed_tasks.includes('achievements_character')}
                            />
                            <TaskCard
                                title="收藏家"
                                description="累计收藏100个游戏"
                                reward={20}
                                progress={tasksData.tasks.achievements.favorite.progress}
                                total={100}
                                type="favorite"
                                category="achievements"
                                isBadge
                                claimed={tasksData.claimed_tasks.includes('achievements_favorite')}
                            />
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
} 