import { Button } from '@nextui-org/button'
import { Plus } from 'lucide-react'
import { useDisclosure } from '@nextui-org/react'
import { CharacterEditModal } from './CharacterEditModal'
import type { PatchCharacter } from '~/types/api/patch'

interface Props {
    patchId: number
    onAdd: (character: PatchCharacter) => void
}

export const CharacterAddButton = ({ patchId, onAdd }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Button
                color="primary"
                variant="flat"
                startContent={<Plus className="size-4" />}
                onPress={onOpen}
                size="sm"
            >
                添加角色
            </Button>

            {isOpen && (
                <CharacterEditModal
                    isOpen={isOpen}
                    patchId={patchId}
                    onClose={onClose}
                    onSuccess={(character) => {
                        onAdd(character)
                        onClose()
                    }}
                />
            )}
        </>
    )
} 