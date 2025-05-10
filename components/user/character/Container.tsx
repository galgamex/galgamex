'use client'

import { useState, useEffect } from 'react'
import { Card, CardBody } from '@nextui-org/card'
import { KunLoading } from '~/components/kun/Loading'
import { KunNull } from '~/components/kun/Null'
import { KunPagination } from '~/components/kun/Pagination'
import { CharacterCard } from '~/components/user/character/Card'
import { getUserCharacters, getUserCharacterCount } from '~/app/user/[id]/character/actions'
import type { CharacterWithPatch } from '~/app/user/[id]/character/actions'

interface Props {
    params: Promise<{ id: string }>
}

export const UserCharacter = ({ params }: Props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [characters, setCharacters] = useState<CharacterWithPatch[]>([])
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [userId, setUserId] = useState<number | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { id } = await params
                const numId = Number(id)
                setUserId(numId)

                const count = await getUserCharacterCount(numId)
                setTotal(count)

                const data = await getUserCharacters(numId, page, 15)
                setCharacters(data)
            } catch (error) {
                console.error('获取角色数据失败', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [params, page])

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        setIsLoading(true)
    }

    if (isLoading) {
        return <KunLoading hint="正在加载角色数据..." />
    }

    return (
        <Card className="w-full">
            <CardBody className="p-0">
                <div className="px-4 py-3 border-b border-divider">
                    <h3 className="text-lg font-medium">角色列表</h3>
                </div>

                {characters.length === 0 ? (
                    <div className="p-6 flex flex-col items-center justify-center">
                        <KunNull message="暂无角色数据" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-3 p-4 
                            sm:grid-cols-3 
                            md:grid-cols-4 
                            lg:grid-cols-5 
                            xl:grid-cols-5">
                            {characters.map((character) => (
                                <CharacterCard key={character.id} character={character} />
                            ))}
                        </div>

                        {total > 15 && (
                            <div className="flex justify-center py-4 border-t border-divider">
                                <KunPagination
                                    total={Math.ceil(total / 15)}
                                    page={page}
                                    onPageChange={handlePageChange}
                                    isLoading={isLoading}
                                />
                            </div>
                        )}
                    </>
                )}
            </CardBody>
        </Card>
    )
} 