import { useState } from 'react'
import { CharacterCard } from './CharacterCard'
import { CharacterDetailModal } from './CharacterDetailModal'
import { CharacterEditModal } from './CharacterEditModal'
import type { PatchCharacter } from '~/types/api/patch'

interface Props {
    characters: PatchCharacter[]
    patchId: number
    onUpdate: (character: PatchCharacter) => void
    onDelete: (characterId: number) => void
}

export const CharacterList = ({ characters, patchId, onUpdate, onDelete }: Props) => {
    const [selectedCharacter, setSelectedCharacter] = useState<PatchCharacter | null>(null)

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 min-h-[350px]">
                {characters.map((character) => (
                    <div key={character.id} className="transform transition-transform hover:-translate-y-1 duration-300">
                        <CharacterCard
                            character={character}
                            onClick={() => setSelectedCharacter(character)}
                        />
                    </div>
                ))}
            </div>

            {selectedCharacter && (
                <CharacterDetailModal
                    isOpen={!!selectedCharacter}
                    character={selectedCharacter}
                    onClose={() => setSelectedCharacter(null)}
                    onUpdate={(updatedCharacter: PatchCharacter) => {
                        onUpdate(updatedCharacter)
                        setSelectedCharacter(updatedCharacter)
                    }}
                    onDelete={(characterId: number) => {
                        onDelete(characterId)
                        setSelectedCharacter(null)
                    }}
                />
            )}
        </>
    )
} 