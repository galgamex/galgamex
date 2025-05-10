import { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { kunFetchGet } from '~/utils/kunFetch'
import { KunLoading } from '~/components/kun/Loading'
import { KunNull } from '~/components/kun/Null'
import { CharacterList } from './CharacterList'
import { CharacterAddButton } from './CharacterAddButton'
import type { PatchCharacter } from '~/types/api/patch'

type KunResponse<T> = string | T

interface Props {
    patchId: number
}

export const CharacterTab = ({ patchId }: Props) => {
    const [loading, setLoading] = useState(true)
    const [characters, setCharacters] = useState<PatchCharacter[]>([])

    useEffect(() => {
        const fetchCharacters = async () => {
            setLoading(true)
            try {
                const response = await kunFetchGet<KunResponse<{ characters: PatchCharacter[] }>>('/patch/character', {
                    patchId
                })
                if (typeof response === 'string') {
                    console.error(response)
                } else {
                    setCharacters(response.characters)
                }
            } catch (error) {
                console.error('Failed to fetch characters:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCharacters()
    }, [patchId])

    const handleAddCharacter = (character: PatchCharacter) => {
        setCharacters([character, ...characters])
    }

    const handleUpdateCharacter = (updatedCharacter: PatchCharacter) => {
        setCharacters(characters.map(c =>
            c.id === updatedCharacter.id ? updatedCharacter : c
        ))
    }

    const handleDeleteCharacter = (characterId: number) => {
        setCharacters(characters.filter(c => c.id !== characterId))
    }

    return (
        <Card className="border-none shadow-sm min-h-[450px]">
            <CardHeader className="flex justify-between items-center px-5 pt-4 pb-0">
                <h3 className="text-xl font-semibold">角色列表</h3>
                <CharacterAddButton
                    patchId={patchId}
                    onAdd={handleAddCharacter}
                />
            </CardHeader>
            <CardBody className="p-4">
                <div className="min-h-[250px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-[350px]">
                            <KunLoading hint="正在加载角色数据..." />
                        </div>
                    ) : characters.length === 0 ? (
                        <div className="flex items-center justify-center h-[350px]">
                            <KunNull
                                message="还没有角色信息，添加一个吧！"
                            />
                        </div>
                    ) : (
                        <CharacterList
                            characters={characters}
                            patchId={patchId}
                            onUpdate={handleUpdateCharacter}
                            onDelete={handleDeleteCharacter}
                        />
                    )}
                </div>
            </CardBody>
        </Card>
    )
}