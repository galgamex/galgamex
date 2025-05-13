import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { Resources } from '~/components/patch/resource/Resource'
import { RESOURCE_SECTION_MAP } from '~/constants/resource'
import { Button } from '@nextui-org/button'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useUserStore } from '~/store/userStore'

interface Props {
  id: number
  section: 'galgame' | 'patch'
}

export const ResourceTab = ({ id, section }: Props) => {
  const user = useUserStore((state) => state.user)
  const [isMounted, setIsMounted] = useState(false)

  // 普通用户（角色小于3）且当前是游戏资源（galgame）时不显示添加按钮
  const shouldShowAddButton = !(user.role < 3 && section === 'galgame')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleAddResource = () => {
    // 触发Resource组件中的隐藏按钮点击事件
    const addButton = document.getElementById('resource-add-button')
    if (addButton) {
      addButton.click()
    }
  }

  return (
    <Card className="border-none shadow-sm min-h-[450px]">
      <CardHeader className="px-5 pt-4 pb-0 flex justify-between items-center">
        <h2 className="text-xl font-semibold">{RESOURCE_SECTION_MAP[section]}</h2>
        {isMounted && shouldShowAddButton && (
          <Button
            color="primary"
            variant="flat"
            size="sm"
            startContent={<Plus className="size-4" />}
            onPress={handleAddResource}
          >
            添加资源
          </Button>
        )}
      </CardHeader>
      <CardBody className="p-4">
        <Resources id={Number(id)} section={section} />
      </CardBody>
    </Card>
  )
}
