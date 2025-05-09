import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { Resources } from '~/components/patch/resource/Resource'
import { RESOURCE_SECTION_MAP } from '~/constants/resource'

interface Props {
  id: number
  section: 'galgame' | 'patch'
}

export const ResourceTab = ({ id, section }: Props) => {
  return (
    <Card className="border-none shadow-sm min-h-[450px]">
      <CardHeader className="px-5 pt-4 pb-0">
        <h2 className="text-xl font-semibold">{RESOURCE_SECTION_MAP[section]}</h2>
      </CardHeader>
      <CardBody className="p-4">
        <div className="text-default-600 text-sm mb-4">
          <p>
            请注意, 本站的 Galgame 下载资源和补丁均来自互联网或用户上传,
            请自行鉴别资源安全性。
          </p>
        </div>

        <Resources id={Number(id)} section={section} />
      </CardBody>
    </Card>
  )
}
