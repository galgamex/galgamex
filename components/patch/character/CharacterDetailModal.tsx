import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Chip,
    Divider,
    Tooltip,
    Avatar
} from '@nextui-org/react'
import { Pencil, Trash2, User, Cake, Ruler, Droplet, LayoutList, Heart, Coffee, Star, HeartHandshake, Mic } from 'lucide-react'
import { useUserStore } from '~/store/userStore'
import { CharacterEditModal } from './CharacterEditModal'
import { kunFetchDelete } from '~/utils/kunFetch'
import { kunErrorHandler } from '~/utils/kunErrorHandler'
import toast from 'react-hot-toast'
import type { PatchCharacter } from '~/types/api/patch'

type KunResponse<T> = string | T

interface Props {
    isOpen: boolean
    character: PatchCharacter
    onClose: () => void
    onUpdate: (character: PatchCharacter) => void
    onDelete: (characterId: number) => void
}

export const CharacterDetailModal = ({
    isOpen,
    character,
    onClose,
    onUpdate,
    onDelete
}: Props) => {
    const { user } = useUserStore()
    const {
        isOpen: isEditOpen,
        onOpen: onEditOpen,
        onClose: onEditClose
    } = useDisclosure()

    const {
        isOpen: isDeleteConfirmOpen,
        onOpen: onDeleteConfirmOpen,
        onClose: onDeleteConfirmClose
    } = useDisclosure()

    // 判断是否有权限编辑和删除（创建者或管理员）
    const hasEditPermission = user.uid === character.userId || user.role >= 3

    const handleDelete = async () => {
        const response = await kunFetchDelete<KunResponse<{}>>('/patch/character', {
            characterId: character.id
        })

        kunErrorHandler(response, () => {
            toast.success('角色删除成功')
            onDeleteConfirmClose()
            onClose()
            onDelete(character.id)
        })
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="3xl"
                scrollBehavior="inside"
                classNames={{
                    base: "max-w-4xl"
                }}
            >
                <ModalContent>
                    <ModalHeader className="flex justify-between items-center px-6 pb-0">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                {character.name}
                                {character.roleType && (
                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        color="primary"
                                        className="text-xs"
                                    >
                                        {character.roleType}
                                    </Chip>
                                )}
                            </h2>

                            <div className="flex items-center gap-3 text-sm text-default-500 mt-1">
                                {character.voiceActor && (
                                    <div className="flex items-center gap-1">
                                        <Mic size={14} />
                                        <span>CV: {character.voiceActor}</span>
                                    </div>
                                )}

                                {character.alias && character.alias.length > 0 && (
                                    <Tooltip content={character.alias.join(' / ')}>
                                        <div className="flex items-center gap-1 cursor-help">
                                            <User size={14} />
                                            <span>别名: {character.alias.length}个</span>
                                        </div>
                                    </Tooltip>
                                )}
                            </div>
                        </div>

                        {hasEditPermission && (
                            <div className="flex gap-2">
                                <Tooltip content="编辑角色">
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        color="primary"
                                        onPress={onEditOpen}
                                    >
                                        <Pencil className="size-4" />
                                    </Button>
                                </Tooltip>
                                <Tooltip content="删除角色">
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        color="danger"
                                        onPress={onDeleteConfirmOpen}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </Tooltip>
                            </div>
                        )}
                    </ModalHeader>

                    <Divider className="mt-2" />

                    <ModalBody className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* 左侧图片和贡献者 */}
                            <div className="md:col-span-1">
                                <div className="sticky top-4">
                                    <div className="rounded-lg overflow-hidden shadow-lg border border-default-100">
                                        <img
                                            src={character.image}
                                            alt={character.name}
                                            className="w-full object-contain max-h-[500px]"
                                        />
                                    </div>

                                    {/* 角色特性标签 */}
                                    <div className="mt-4">
                                        <h4 className="text-md font-semibold mb-2 flex items-center gap-2">
                                            <Star size={16} className="text-primary" />
                                            角色特性
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {character.traits.map((trait, index) => (
                                                <Chip
                                                    key={index}
                                                    variant="flat"
                                                    color="primary"
                                                    size="sm"
                                                >
                                                    {trait}
                                                </Chip>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-4">
                                        <Avatar
                                            src={character.user.avatar}
                                            size="sm"
                                            name={character.user.name}
                                        />
                                        <div>
                                            <p className="text-sm font-medium">贡献者</p>
                                            <p className="text-xs text-default-500">{character.user.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 右侧角色信息 */}
                            <div className="md:col-span-2 space-y-6">
                                {/* 角色介绍 */}
                                <div>
                                    <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                                        <User size={18} className="text-primary" />
                                        角色介绍
                                    </h4>
                                    <p className="text-sm whitespace-pre-line leading-relaxed">{character.description}</p>
                                </div>

                                <Divider />

                                {/* 详细属性 */}
                                <div>
                                    <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                                        <LayoutList size={18} className="text-primary" />
                                        角色属性
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        {character.age && (
                                            <div className="flex items-center gap-2 border border-default-100 rounded-lg p-2">
                                                <User size={16} className="text-default-400" />
                                                <div>
                                                    <p className="text-xs text-default-500">年龄</p>
                                                    <p>{character.age}</p>
                                                </div>
                                            </div>
                                        )}
                                        {character.height && (
                                            <div className="flex items-center gap-2 border border-default-100 rounded-lg p-2">
                                                <Ruler size={16} className="text-default-400" />
                                                <div>
                                                    <p className="text-xs text-default-500">身高</p>
                                                    <p>{character.height}</p>
                                                </div>
                                            </div>
                                        )}
                                        {character.birthday && (
                                            <div className="flex items-center gap-2 border border-default-100 rounded-lg p-2">
                                                <Cake size={16} className="text-default-400" />
                                                <div>
                                                    <p className="text-xs text-default-500">生日</p>
                                                    <p>{character.birthday}</p>
                                                </div>
                                            </div>
                                        )}
                                        {character.bloodType && (
                                            <div className="flex items-center gap-2 border border-default-100 rounded-lg p-2">
                                                <Droplet size={16} className="text-default-400" />
                                                <div>
                                                    <p className="text-xs text-default-500">血型</p>
                                                    <p>{character.bloodType}</p>
                                                </div>
                                            </div>
                                        )}
                                        {character.threeSizes && (
                                            <div className="flex items-center gap-2 border border-default-100 rounded-lg p-2 col-span-2">
                                                <div>
                                                    <p className="text-xs text-default-500">三围</p>
                                                    <p>{character.threeSizes}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 兴趣爱好与喜好 */}
                                {(character.hobby?.length > 0 || character.favorite?.length > 0 || character.personality?.length > 0) && (
                                    <>
                                        <Divider />
                                        <div className="space-y-4">
                                            <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                                                <Heart size={18} className="text-primary" />
                                                性格与爱好
                                            </h4>

                                            {character.hobby && character.hobby.length > 0 && (
                                                <div className="mb-4">
                                                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                                        <Coffee size={14} className="text-success" />
                                                        兴趣爱好
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {character.hobby.map((item, index) => (
                                                            <Chip key={index} variant="flat" color="success" size="sm">
                                                                {item}
                                                            </Chip>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {character.favorite && character.favorite.length > 0 && (
                                                <div className="mb-4">
                                                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                                        <Star size={14} className="text-warning" />
                                                        喜欢的事物
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {character.favorite.map((item, index) => (
                                                            <Chip key={index} variant="flat" color="warning" size="sm">
                                                                {item}
                                                            </Chip>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {character.personality && character.personality.length > 0 && (
                                                <div className="mb-4">
                                                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                                        <User size={14} className="text-danger" />
                                                        性格特点
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {character.personality.map((item, index) => (
                                                            <Chip key={index} variant="flat" color="danger" size="sm">
                                                                {item}
                                                            </Chip>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* 角色关系 */}
                                {character.relationship && (
                                    <>
                                        <Divider />
                                        <div>
                                            <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                                                <HeartHandshake size={18} className="text-primary" />
                                                角色关系
                                            </h4>
                                            <p className="text-sm whitespace-pre-line leading-relaxed">{character.relationship}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onPress={onClose}
                            color="primary"
                            variant="light"
                            size="lg"
                        >
                            关闭
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* 编辑角色弹窗 */}
            {isEditOpen && (
                <CharacterEditModal
                    isOpen={isEditOpen}
                    onClose={() => {
                        onEditClose()
                    }}
                    onSuccess={(updatedCharacter) => {
                        onUpdate(updatedCharacter)
                        onEditClose()
                    }}
                    character={character}
                    patchId={character.patchId}
                />
            )}

            {/* 删除确认弹窗 */}
            <Modal isOpen={isDeleteConfirmOpen} onClose={onDeleteConfirmClose} size="sm">
                <ModalContent>
                    <ModalHeader>确认删除</ModalHeader>
                    <ModalBody>
                        <p>确定要删除角色 <span className="font-bold">{character.name}</span> 吗？此操作不可恢复。</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={onDeleteConfirmClose}>
                            取消
                        </Button>
                        <Button color="danger" onPress={handleDelete}>
                            删除
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
} 