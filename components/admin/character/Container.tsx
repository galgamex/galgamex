'use client'

import {
    Chip,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Input,
    Divider
} from '@nextui-org/react'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { kunFetchGet } from '~/utils/kunFetch'
import { KunLoading } from '~/components/kun/Loading'
import { useMounted } from '~/hooks/useMounted'
import { RenderCell } from './RenderCell'
import { useDebounce } from 'use-debounce'
import { KunPagination } from '~/components/kun/Pagination'
import { CharacterDetail } from './CharacterDetail'
import type { AdminCharacter } from '~/types/api/admin'

const columns = [
    { name: '角色', uid: 'character' },
    { name: '游戏', uid: 'game' },
    { name: '用户', uid: 'user' },
    { name: '状态', uid: 'status' },
    { name: '时间', uid: 'created' },
    { name: '操作', uid: 'actions' }
]

interface Props {
    initialCharacters: AdminCharacter[]
    initialTotal: number
}

export const Character = ({ initialCharacters, initialTotal }: Props) => {
    const [characters, setCharacters] = useState<AdminCharacter[]>(initialCharacters)
    const [total, setTotal] = useState(initialTotal)
    const [page, setPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedQuery] = useDebounce(searchQuery, 500)
    const isMounted = useMounted()
    const [selectedCharacter, setSelectedCharacter] = useState<AdminCharacter | null>(null)

    const [loading, setLoading] = useState(false)
    const fetchData = async () => {
        setLoading(true)

        const response = await kunFetchGet<{
            characters: AdminCharacter[]
            total: number
        }>('/admin/character', {
            page,
            limit: 30,
            search: debouncedQuery
        })

        setLoading(false)
        if (typeof response === 'string') {
            console.error(response)
            return
        }

        setCharacters(response.characters)
        setTotal(response.total)
    }

    useEffect(() => {
        if (!isMounted) {
            return
        }
        fetchData()
    }, [page, debouncedQuery])

    const handleSearch = (value: string) => {
        setSearchQuery(value)
        setPage(1)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">角色管理</h1>
                    <Input
                        size="sm"
                        placeholder="搜索角色名称..."
                        startContent={<Search size={16} />}
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-72"
                    />
                </div>
                <Divider />

                {loading ? (
                    <KunLoading hint="加载中..." />
                ) : (
                    <div className="overflow-x-auto">
                        <Table aria-label="角色管理表格">
                            <TableHeader columns={columns}>
                                {(column) => (
                                    <TableColumn key={column.uid}>{column.name}</TableColumn>
                                )}
                            </TableHeader>
                            <TableBody items={characters}>
                                {(character) => (
                                    <TableRow key={character.id}>
                                        {(columnKey) => (
                                            <TableCell>
                                                <RenderCell
                                                    character={character}
                                                    columnKey={columnKey as keyof AdminCharacter}
                                                    onView={setSelectedCharacter}
                                                    onStatusChange={(updatedCharacter: AdminCharacter) => {
                                                        setCharacters(characters.map(c => c.id === updatedCharacter.id ? updatedCharacter : c))
                                                    }}
                                                />
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <div className="flex justify-center my-6">
                    <KunPagination
                        total={Math.ceil(total / 30)}
                        page={page}
                        onPageChange={setPage}
                        isLoading={loading}
                    />
                </div>
            </div>

            {selectedCharacter && (
                <CharacterDetail
                    character={selectedCharacter}
                    onClose={() => setSelectedCharacter(null)}
                    onStatusChange={(updatedCharacter: AdminCharacter) => {
                        setCharacters(characters.map(c => c.id === updatedCharacter.id ? updatedCharacter : c))
                        setSelectedCharacter(null)
                    }}
                />
            )}
        </div>
    )
} 