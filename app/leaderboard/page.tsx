'use client'

import { Card, CardBody, CardHeader, Divider, Tab, Tabs } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar } from '@nextui-org/avatar'
import axios from 'axios'
import { 
  CalendarCheck, 
  Lollipop, 
  MessageSquare, 
  Puzzle, 
  UserRound 
} from 'lucide-react'

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

    const getTabIcon = (tab: string) => {
        switch (tab) {
            case 'checkin':
                return <CalendarCheck className="size-4 mr-1.5 text-primary-500 flex-shrink-0" />;
            case 'moemoepoint':
                return <Lollipop className="size-4 mr-1.5 text-secondary-500 flex-shrink-0" />;
            case 'comment':
                return <MessageSquare className="size-4 mr-1.5 text-success-500 flex-shrink-0" />;
            case 'patch':
                return <Puzzle className="size-4 mr-1.5 text-warning-500 flex-shrink-0" />;
            case 'character':
                return <UserRound className="size-4 mr-1.5 text-danger-500 flex-shrink-0" />;
            default:
                return null;
        }
    };

    const getTabLabel = (tab: string) => {
        switch (tab) {
            case 'checkin':
                return "签到次数";
            case 'moemoepoint':
                return "萌萌点";
            case 'comment':
                return "评论数";
            case 'patch':
                return "资源数";
            case 'character':
                return "角色数";
            default:
                return "";
        }
    };

    const renderRankings = (rankings: UserRanking[], tab: string) => {
        if (loading) {
            return <div className="py-10 text-center">加载中...</div>
        }

        if (rankings.length === 0) {
            return <div className="py-10 text-center">暂无数据</div>
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 my-4">
                {rankings.map((user, index) => (
                    <div
                        key={user.id}
                        className="flex items-center bg-background rounded-xl shadow-sm p-4 cursor-pointer hover:bg-default-50 transition-colors"
                        onClick={() => router.push(`/user/${user.id}`)}
                    >
                        <div className="relative mr-3.5">
                            <Avatar
                                isBordered
                                className="w-12 h-12"
                                color={index < 3 ? "primary" : "default"}
                                name={user.name.charAt(0).toUpperCase()}
                                src={user.avatar}
                                showFallback
                            />
                            <div className={`absolute -top-2 -left-2 w-5 h-5 ${index < 3 ? 'bg-primary' : 'bg-default-100'} rounded-full flex items-center justify-center text-xs font-bold ${index < 3 ? 'text-white' : 'text-foreground'}`}>
                                {index + 1}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-foreground truncate mb-0.5 text-sm">{user.name}</div>
                            <div className="text-xs text-default-500 flex items-center">
                                {getTabIcon(tab)}
                                <span className="font-medium truncate">{getTabLabel(tab)}: {user.score}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6">
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
                        <Tab 
                            key="checkin" 
                            title={
                                <div className="flex items-center gap-1">
                                    <CalendarCheck className="size-4" />
                                    <span>签到次数</span>
                                </div>
                            }
                        >
                            {renderRankings(checkInRankings, 'checkin')}
                        </Tab>
                        <Tab 
                            key="moemoepoint" 
                            title={
                                <div className="flex items-center gap-1">
                                    <Lollipop className="size-4" />
                                    <span>萌萌点</span>
                                </div>
                            }
                        >
                            {renderRankings(moeMoePointRankings, 'moemoepoint')}
                        </Tab>
                        <Tab 
                            key="comment" 
                            title={
                                <div className="flex items-center gap-1">
                                    <MessageSquare className="size-4" />
                                    <span>评论数</span>
                                </div>
                            }
                        >
                            {renderRankings(commentRankings, 'comment')}
                        </Tab>
                        <Tab 
                            key="patch" 
                            title={
                                <div className="flex items-center gap-1">
                                    <Puzzle className="size-4" />
                                    <span>资源数</span>
                                </div>
                            }
                        >
                            {renderRankings(patchRankings, 'patch')}
                        </Tab>
                        <Tab 
                            key="character" 
                            title={
                                <div className="flex items-center gap-1">
                                    <UserRound className="size-4" />
                                    <span>角色数</span>
                                </div>
                            }
                        >
                            {renderRankings(characterRankings, 'character')}
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
        </div>
    )
} 