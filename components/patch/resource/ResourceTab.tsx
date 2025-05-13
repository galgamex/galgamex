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


        <Resources id={Number(id)} section={section} />
      </CardBody>
    </Card>
  )
}
