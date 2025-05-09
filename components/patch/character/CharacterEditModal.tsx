import { useState, useRef } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Textarea,
    Chip,
    Image,
    useDisclosure,
    Tabs,
    Tab,
    Divider,
    Select,
    SelectItem
} from '@nextui-org/react'
import { kunFetchPost, kunFetchPut, kunFetchFormData } from '~/utils/kunFetch'
import { kunErrorHandler } from '~/utils/kunErrorHandler'
import toast from 'react-hot-toast'
import { Upload, Plus, User, Mic, Tag, Book, ToyBrick, HeartHandshake } from 'lucide-react'
import { KunImageUploader } from '~/components/kun/cropper/KunImageUploader'
import { KunImageCropperModal } from '~/components/kun/cropper/KunImageCropperModal'
import { KunImageMosaicModal } from '~/components/kun/cropper/KunImageMosaicModal'
import { dataURItoBlob } from '~/utils/dataURItoBlob'
import type { PatchCharacter } from '~/types/api/patch'

// KunResponse 类型在全局 types/response.d.ts 中定义
// type KunResponse<T> = string | T

interface Props {
    isOpen: boolean
    onClose: () => void
    onSuccess: (character: PatchCharacter) => void
    patchId?: number
    character?: PatchCharacter
}

// 角色类型选项
const roleTypes = [
    { value: "主角", label: "主角" },
    { value: "配角", label: "配角" },
    { value: "路人", label: "路人" },
    { value: "敌人", label: "敌人" },
    { value: "其他", label: "其他" }
]

export const CharacterEditModal = ({
    isOpen,
    onClose,
    onSuccess,
    patchId,
    character
}: Props) => {
    const isEditMode = !!character

    const [name, setName] = useState(character?.name || '')
    const [image, setImage] = useState(character?.image || '')
    const [description, setDescription] = useState(character?.description || '')
    const [voiceActor, setVoiceActor] = useState(character?.voiceActor || '')
    const [traits, setTraits] = useState<string[]>(character?.traits || [])
    const [traitInput, setTraitInput] = useState('')

    // 新增状态变量
    const [alias, setAlias] = useState<string[]>(character?.alias || [])
    const [aliasInput, setAliasInput] = useState('')
    const [age, setAge] = useState(character?.age || '')
    const [height, setHeight] = useState(character?.height || '')
    const [birthday, setBirthday] = useState(character?.birthday || '')
    const [bloodType, setBloodType] = useState(character?.bloodType || '')
    const [threeSizes, setThreeSizes] = useState(character?.threeSizes || '')
    const [hobby, setHobby] = useState<string[]>(character?.hobby || [])
    const [hobbyInput, setHobbyInput] = useState('')
    const [favorite, setFavorite] = useState<string[]>(character?.favorite || [])
    const [favoriteInput, setFavoriteInput] = useState('')
    const [roleType, setRoleType] = useState(character?.roleType || '')
    const [personality, setPersonality] = useState<string[]>(character?.personality || [])
    const [personalityInput, setPersonalityInput] = useState('')
    const [relationship, setRelationship] = useState(character?.relationship || '')

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(character?.image || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // 裁剪和马赛克相关状态
    const [cropperImage, setCropperImage] = useState<string | null>(null)
    const [mosaicImage, setMosaicImage] = useState<string | null>(null)
    const {
        isOpen: isCropperOpen,
        onOpen: onCropperOpen,
        onClose: onCropperClose
    } = useDisclosure()
    const {
        isOpen: isMosaicOpen,
        onOpen: onMosaicOpen,
        onClose: onMosaicClose
    } = useDisclosure()

    const handleAddTrait = () => {
        if (!traitInput.trim()) return
        if (traits.includes(traitInput.trim())) {
            toast.error('该特性已添加')
            return
        }
        setTraits([...traits, traitInput.trim()])
        setTraitInput('')
    }

    const handleRemoveTrait = (trait: string) => {
        setTraits(traits.filter(t => t !== trait))
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddTrait()
        }
    }

    // 处理添加别名
    const handleAddAlias = () => {
        if (!aliasInput.trim()) return
        if (alias.includes(aliasInput.trim())) {
            toast.error('该别名已添加')
            return
        }
        setAlias([...alias, aliasInput.trim()])
        setAliasInput('')
    }

    // 处理移除别名
    const handleRemoveAlias = (item: string) => {
        setAlias(alias.filter(a => a !== item))
    }

    // 处理添加爱好
    const handleAddHobby = () => {
        if (!hobbyInput.trim()) return
        if (hobby.includes(hobbyInput.trim())) {
            toast.error('该爱好已添加')
            return
        }
        setHobby([...hobby, hobbyInput.trim()])
        setHobbyInput('')
    }

    // 处理移除爱好
    const handleRemoveHobby = (item: string) => {
        setHobby(hobby.filter(h => h !== item))
    }

    // 处理添加喜好
    const handleAddFavorite = () => {
        if (!favoriteInput.trim()) return
        if (favorite.includes(favoriteInput.trim())) {
            toast.error('该喜好已添加')
            return
        }
        setFavorite([...favorite, favoriteInput.trim()])
        setFavoriteInput('')
    }

    // 处理移除喜好
    const handleRemoveFavorite = (item: string) => {
        setFavorite(favorite.filter(f => f !== item))
    }

    // 处理添加性格
    const handleAddPersonality = () => {
        if (!personalityInput.trim()) return
        if (personality.includes(personalityInput.trim())) {
            toast.error('该性格特点已添加')
            return
        }
        setPersonality([...personality, personalityInput.trim()])
        setPersonalityInput('')
    }

    // 处理移除性格
    const handleRemovePersonality = (item: string) => {
        setPersonality(personality.filter(p => p !== item))
    }

    // 统一的键盘事件处理
    const handleInputKeyDown = (e: React.KeyboardEvent, handler: () => void) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handler()
        }
    }

    const validateForm = () => {
        if (!name.trim()) {
            toast.error('请输入角色名称')
            return false
        }
        if (!image.trim()) {
            toast.error('请上传角色图片或输入图片链接')
            return false
        }
        if (traits.length === 0) {
            toast.error('请至少添加一个角色特性')
            return false
        }
        if (!roleType.trim()) {
            toast.error('请选择角色类型')
            return false
        }
        return true
    }

    // 处理图片选择
    const handleImageSelect = (dataUrl: string) => {
        setCropperImage(dataUrl)
        onCropperOpen()
    }

    // 打开马赛克工具
    const handleOpenMosaic = () => {
        if (cropperImage) {
            setMosaicImage(cropperImage)
            onCropperClose()
            onMosaicOpen()
        }
    }

    // 处理马赛克完成
    const handleMosaicComplete = (mosaicedImage: string) => {
        setCropperImage(mosaicedImage)
        onMosaicClose()
        onCropperOpen()
    }

    // 处理裁剪完成
    const handleCropComplete = async (croppedImage: string) => {
        setImagePreview(croppedImage)

        if (!patchId) {
            toast.error('缺少游戏ID，无法上传图片')
            return
        }

        setIsUploading(true)
        try {
            // 转换为Blob
            const blob = dataURItoBlob(croppedImage)

            // 生成文件对象
            const file = new File([blob], "character-image.webp", { type: "image/webp" })

            // 准备表单数据
            const formData = new FormData()
            formData.append('file', file)
            formData.append('patchId', String(patchId))

            // 上传图片
            const response = await kunFetchFormData<KunResponse<{ url: string, hash: string }>>('/upload/character', formData)

            if (typeof response === 'string') {
                toast.error(response || '上传失败，请重试')
                return
            }

            // 检查并确保URL格式正确
            if (response && response.url) {
                // 图片URL正确性校验
                if (!response.url.startsWith('http')) {
                    console.error('返回的图片URL格式错误:', response.url)
                    toast.error('返回的图片地址格式错误')
                    return
                }

                setImage(response.url)
                setImagePreview(response.url) // 更新预览为实际URL
                toast.success('图片上传成功')
            } else {
                console.error('上传返回数据缺少URL:', response)
                toast.error('上传返回数据格式错误')
            }
        } catch (error) {
            console.error('图片上传失败:', error)
            toast.error('图片上传失败，请重试')
        } finally {
            setIsUploading(false)
        }
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        setIsSubmitting(true)

        const characterData = {
            name,
            image,
            description,
            voiceActor: voiceActor || undefined,
            traits,
            alias,
            age,
            height,
            birthday,
            bloodType,
            threeSizes,
            hobby,
            favorite,
            roleType,
            personality,
            relationship
        }

        try {
            if (isEditMode && character) {
                // 更新角色
                const response = await kunFetchPut<KunResponse<PatchCharacter>>('/patch/character', {
                    characterId: character.id,
                    ...characterData
                })

                kunErrorHandler(response, () => {
                    toast.success('角色更新成功')
                    if (typeof response !== 'string' && response) {
                        onSuccess(response)
                    }
                })
            } else if (patchId) {
                // 创建角色
                const response = await kunFetchPost<KunResponse<PatchCharacter>>('/patch/character', {
                    patchId,
                    ...characterData
                })

                kunErrorHandler(response, () => {
                    toast.success('角色创建成功')
                    if (typeof response !== 'string' && response) {
                        onSuccess(response)
                    }
                })
            }
        } catch (error) {
            console.error('提交角色数据时出错', error)
            toast.error('提交失败，请重试')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <h3 className="text-xl font-bold">{isEditMode ? '编辑角色' : '添加角色'}</h3>
                        <p className="text-sm text-gray-500">填写角色信息，带*的为必填项</p>
                    </ModalHeader>
                    <ModalBody>
                        <Tabs aria-label="角色信息" fullWidth variant="underlined" color="primary">
                            <Tab
                                key="basic"
                                title={
                                    <div className="flex items-center gap-2">
                                        <User size={18} />
                                        <span>基本信息</span>
                                    </div>
                                }
                            >
                                <div className="space-y-6 pt-4">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="md:w-1/2">
                                            <Input
                                                label="角色名称*"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="请输入角色名称"
                                                variant="bordered"
                                                radius="sm"
                                                isRequired
                                                startContent={<User size={16} className="text-gray-400" />}
                                                classNames={{
                                                    label: "text-sm font-medium"
                                                }}
                                            />
                                        </div>

                                        <div className="md:w-1/2">
                                            <Select
                                                label="角色类型*"
                                                placeholder="请选择角色类型"
                                                selectedKeys={roleType ? [roleType] : []}
                                                onChange={(e) => setRoleType(e.target.value)}
                                                variant="bordered"
                                                radius="sm"
                                                isRequired
                                                classNames={{
                                                    label: "text-sm font-medium"
                                                }}
                                            >
                                                {roleTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="md:w-1/2">
                                            <Input
                                                label="声优"
                                                value={voiceActor}
                                                onChange={(e) => setVoiceActor(e.target.value)}
                                                placeholder="请输入角色声优"
                                                variant="bordered"
                                                radius="sm"
                                                startContent={<Mic size={16} className="text-gray-400" />}
                                                classNames={{
                                                    label: "text-sm font-medium"
                                                }}
                                            />
                                        </div>

                                        <div className="md:w-1/2 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-medium">角色别名</label>
                                                <span className="text-xs text-gray-500">可添加多个</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={aliasInput}
                                                    onChange={(e) => setAliasInput(e.target.value)}
                                                    onKeyDown={(e) => handleInputKeyDown(e, handleAddAlias)}
                                                    placeholder="输入别名并按回车添加"
                                                    variant="bordered"
                                                    radius="sm"
                                                    className="flex-1"
                                                    size="sm"
                                                    startContent={<Tag size={14} className="text-gray-400" />}
                                                />
                                                <Button
                                                    isIconOnly
                                                    onPress={handleAddAlias}
                                                    disabled={!aliasInput.trim()}
                                                    size="sm"
                                                    color="secondary"
                                                    variant="flat"
                                                >
                                                    <Plus size={18} />
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2 min-h-8">
                                                {alias.map((item, index) => (
                                                    <Chip
                                                        key={index}
                                                        onClose={() => handleRemoveAlias(item)}
                                                        variant="flat"
                                                        color="secondary"
                                                        size="sm"
                                                    >
                                                        {item}
                                                    </Chip>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-1">
                                            <div className="space-y-3">
                                                <label className="text-sm font-medium">角色图片*</label>

                                                <div className="flex justify-center">
                                                    {imagePreview ? (
                                                        <div className="relative max-w-[180px] rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg">
                                                            <Image
                                                                src={imagePreview}
                                                                alt="角色预览"
                                                                classNames={{
                                                                    wrapper: "w-full aspect-[3/4]",
                                                                    img: "object-cover"
                                                                }}
                                                            />
                                                            <div
                                                                className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                                                                onClick={() => handleImageSelect(imagePreview)}
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    variant="flat"
                                                                    color="default"
                                                                    className="bg-white/80"
                                                                >
                                                                    更换图片
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <KunImageUploader onImageSelect={handleImageSelect} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium">角色特性*</label>
                                                    <span className="text-xs text-gray-500">至少添加一项</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        value={traitInput}
                                                        onChange={(e) => setTraitInput(e.target.value)}
                                                        onKeyDown={(e) => handleInputKeyDown(e, handleAddTrait)}
                                                        placeholder="输入角色特性并按回车添加"
                                                        variant="bordered"
                                                        radius="sm"
                                                        className="flex-1"
                                                        size="sm"
                                                        startContent={<ToyBrick size={14} className="text-gray-400" />}
                                                    />
                                                    <Button
                                                        isIconOnly
                                                        onPress={handleAddTrait}
                                                        disabled={!traitInput.trim()}
                                                        size="sm"
                                                        color="primary"
                                                        variant="flat"
                                                    >
                                                        <Plus size={18} />
                                                    </Button>
                                                </div>
                                                <div className="flex flex-wrap gap-2 min-h-8 mb-2">
                                                    {traits.map((trait, index) => (
                                                        <Chip
                                                            key={index}
                                                            onClose={() => handleRemoveTrait(trait)}
                                                            variant="flat"
                                                            color="primary"
                                                            size="sm"
                                                        >
                                                            {trait}
                                                        </Chip>
                                                    ))}
                                                </div>
                                            </div>

                                            <Divider className="my-2" />

                                            <Textarea
                                                label="角色介绍*"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="请描述角色的背景、性格、经历等"
                                                variant="bordered"
                                                radius="sm"
                                                minRows={4}
                                                classNames={{
                                                    label: "text-sm font-medium"
                                                }}
                                                startContent={<Book size={16} className="text-gray-400 mt-2" />}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                            <Tab
                                key="detailed"
                                title={
                                    <div className="flex items-center gap-2">
                                        <HeartHandshake size={18} />
                                        <span>详细信息</span>
                                    </div>
                                }
                            >
                                <div className="space-y-6 pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="年龄"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            placeholder="请输入角色年龄"
                                            variant="bordered"
                                            radius="sm"
                                            classNames={{
                                                label: "text-sm font-medium"
                                            }}
                                        />
                                        <Input
                                            label="身高"
                                            value={height}
                                            onChange={(e) => setHeight(e.target.value)}
                                            placeholder="如: 165cm"
                                            variant="bordered"
                                            radius="sm"
                                            classNames={{
                                                label: "text-sm font-medium"
                                            }}
                                        />
                                        <Input
                                            label="生日"
                                            value={birthday}
                                            onChange={(e) => setBirthday(e.target.value)}
                                            placeholder="如: 1月1日"
                                            variant="bordered"
                                            radius="sm"
                                            classNames={{
                                                label: "text-sm font-medium"
                                            }}
                                        />
                                        <Input
                                            label="血型"
                                            value={bloodType}
                                            onChange={(e) => setBloodType(e.target.value)}
                                            placeholder="如: A型"
                                            variant="bordered"
                                            radius="sm"
                                            classNames={{
                                                label: "text-sm font-medium"
                                            }}
                                        />
                                        <Input
                                            label="三围"
                                            value={threeSizes}
                                            onChange={(e) => setThreeSizes(e.target.value)}
                                            placeholder="如: B84/W58/H86"
                                            variant="bordered"
                                            radius="sm"
                                            className="col-span-2"
                                            classNames={{
                                                label: "text-sm font-medium"
                                            }}
                                        />
                                    </div>

                                    <Divider className="my-2" />

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-medium">兴趣爱好</label>
                                                <span className="text-xs text-gray-500">可添加多个</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={hobbyInput}
                                                    onChange={(e) => setHobbyInput(e.target.value)}
                                                    onKeyDown={(e) => handleInputKeyDown(e, handleAddHobby)}
                                                    placeholder="输入角色爱好并按回车添加"
                                                    variant="bordered"
                                                    radius="sm"
                                                    className="flex-1"
                                                    size="sm"
                                                />
                                                <Button
                                                    isIconOnly
                                                    onPress={handleAddHobby}
                                                    disabled={!hobbyInput.trim()}
                                                    size="sm"
                                                    color="success"
                                                    variant="flat"
                                                >
                                                    <Plus size={18} />
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2 min-h-8">
                                                {hobby.map((item, index) => (
                                                    <Chip
                                                        key={index}
                                                        onClose={() => handleRemoveHobby(item)}
                                                        variant="flat"
                                                        color="success"
                                                        size="sm"
                                                    >
                                                        {item}
                                                    </Chip>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-medium">喜欢的事物</label>
                                                <span className="text-xs text-gray-500">可添加多个</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={favoriteInput}
                                                    onChange={(e) => setFavoriteInput(e.target.value)}
                                                    onKeyDown={(e) => handleInputKeyDown(e, handleAddFavorite)}
                                                    placeholder="输入角色喜欢的事物并按回车添加"
                                                    variant="bordered"
                                                    radius="sm"
                                                    className="flex-1"
                                                    size="sm"
                                                />
                                                <Button
                                                    isIconOnly
                                                    onPress={handleAddFavorite}
                                                    disabled={!favoriteInput.trim()}
                                                    size="sm"
                                                    color="warning"
                                                    variant="flat"
                                                >
                                                    <Plus size={18} />
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2 min-h-8">
                                                {favorite.map((item, index) => (
                                                    <Chip
                                                        key={index}
                                                        onClose={() => handleRemoveFavorite(item)}
                                                        variant="flat"
                                                        color="warning"
                                                        size="sm"
                                                    >
                                                        {item}
                                                    </Chip>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-medium">性格特点</label>
                                                <span className="text-xs text-gray-500">可添加多个</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={personalityInput}
                                                    onChange={(e) => setPersonalityInput(e.target.value)}
                                                    onKeyDown={(e) => handleInputKeyDown(e, handleAddPersonality)}
                                                    placeholder="输入角色性格特点并按回车添加"
                                                    variant="bordered"
                                                    radius="sm"
                                                    className="flex-1"
                                                    size="sm"
                                                />
                                                <Button
                                                    isIconOnly
                                                    onPress={handleAddPersonality}
                                                    disabled={!personalityInput.trim()}
                                                    size="sm"
                                                    color="danger"
                                                    variant="flat"
                                                >
                                                    <Plus size={18} />
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2 min-h-8">
                                                {personality.map((item, index) => (
                                                    <Chip
                                                        key={index}
                                                        onClose={() => handleRemovePersonality(item)}
                                                        variant="flat"
                                                        color="danger"
                                                        size="sm"
                                                    >
                                                        {item}
                                                    </Chip>
                                                ))}
                                            </div>
                                        </div>

                                        <Divider className="my-2" />

                                        <Textarea
                                            label="角色关系"
                                            value={relationship}
                                            onChange={(e) => setRelationship(e.target.value)}
                                            placeholder="请描述该角色与其他角色的关系"
                                            variant="bordered"
                                            radius="sm"
                                            minRows={4}
                                            classNames={{
                                                label: "text-sm font-medium"
                                            }}
                                        />
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="bordered" onPress={onClose}>
                            取消
                        </Button>
                        <Button
                            color="primary"
                            onPress={handleSubmit}
                            isLoading={isSubmitting}
                        >
                            {isEditMode ? '保存修改' : '创建角色'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* 裁剪模态窗口 */}
            {cropperImage && (
                <KunImageCropperModal
                    isOpen={isCropperOpen}
                    imgSrc={cropperImage}
                    initialAspect={{ x: 3, y: 4 }} // 角色图片通常是3:4比例
                    description="请裁剪角色图片，推荐3:4的比例"
                    onCropComplete={handleCropComplete}
                    onOpenMosaic={handleOpenMosaic}
                    onClose={onCropperClose}
                />
            )}

            {/* 马赛克模态窗口 */}
            {mosaicImage && (
                <KunImageMosaicModal
                    isOpen={isMosaicOpen}
                    imgSrc={mosaicImage}
                    onMosaicComplete={handleMosaicComplete}
                    onClose={() => {
                        onMosaicClose()
                        onCropperOpen() // 返回到裁剪模态框
                    }}
                />
            )}
        </>
    )
} 