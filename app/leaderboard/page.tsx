'use client'

import { Card, CardBody, CardHeader, Divider, Tab, Tabs } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar } from '@nextui-org/avatar'
import axios from 'axios'

interface UserRanking {
    id: number
    name: string
    avatar: string
    score: number
}

export default function LeaderboardPage() {
    const [selectedTab, setSelectedTab] = useState('checkin')
    const [checkInRankings, setCheckInRankings] = useState<UserRanking[]>([])
    const [moeMoePointRankings, setMoeMoePointRankings] = useState<UserRanking[]>([])
    const [commentRankings, setCommentRankings] = useState<UserRanking[]>([])
    const [patchRankings, setPatchRankings] = useState<UserRanking[]>([])
    const [characterRankings, setCharacterRankings] = useState<UserRanking[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [checkInRes, moeMoePointRes, commentRes, patchRes, characterRes] = await Promise.all([
                    axios.get('/api/leaderboard/checkin'),
                    axios.get('/api/leaderboard/moemoepoint'),
                    axios.get('/api/leaderboard/comment'),
                    axios.get('/api/leaderboard/patch'),
                    axios.get('/api/leaderboard/character')
                ])

                setCheckInRankings(checkInRes.data)
                setMoeMoePointRankings(moeMoePointRes.data)
                setCommentRankings(commentRes.data)
                setPatchRankings(patchRes.data)
                setCharacterRankings(characterRes.data)
            } catch (error) {
                console.error('Failed to fetch leaderboard data', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const renderRankings = (rankings: UserRanking[]) => {
        if (loading) {
            return <div className="py-10 text-center">加载中...</div>
        }

        if (rankings.length === 0) {
            return <div className="py-10 text-center">暂无数据</div>
        }

        return (
            <div className="space-y-2">
                {rankings.map((user, index) => (
                    <div
                        key={user.id}
                        className="flex items-center justify-between p-3 bg-content2 rounded-lg cursor-pointer hover:bg-content3"
                        onClick={() => router.push(`/user/${user.id}`)}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`text-lg font-bold min-w-8 ${index < 3 ? 'text-primary' : ''}`}>
                                {index + 1}
                            </div>
                            <Avatar
                                isBordered
                                className="transition-transform shrink-0"
                                color={index < 3 ? "secondary" : "default"}
                                name={user.name.charAt(0).toUpperCase()}
                                size="sm"
                                src={user.avatar}
                                showFallback
                            />
                            <div className="text-md">{user.name}</div>
                        </div>
                        <div className="font-semibold">{user.score}</div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="container mx-auto ">
            <Card className="mb-8">
                <CardHeader className="flex flex-col gap-2">
                    <div className="text-2xl font-bold">排行榜</div>
                    <div className="text-default-500">展示用户的活跃度和贡献度排名</div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Tabs
                        selectedKey={selectedTab}
                        onSelectionChange={key => setSelectedTab(key as string)}
                        variant="underlined"
                        aria-label="排行榜标签"
                        fullWidth
                        size="lg"
                        classNames={{
                            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                            cursor: "w-full bg-primary",
                            tab: "max-w-fit px-0 h-12",
                            tabContent: "group-data-[selected=true]:text-primary"
                        }}
                    >
                        <Tab key="checkin" title="签到次数">
                            {renderRankings(checkInRankings)}
                        </Tab>
                        <Tab key="moemoepoint" title="萌萌点">
                            {renderRankings(moeMoePointRankings)}
                        </Tab>
                        <Tab key="comment" title="评论数">
                            {renderRankings(commentRankings)}
                        </Tab>
                        <Tab key="patch" title="补丁数">
                            {renderRankings(patchRankings)}
                        </Tab>
                        <Tab key="character" title="角色数">
                            {renderRankings(characterRankings)}
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
        </div>
    )
} 