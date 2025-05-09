import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { Comments } from '~/components/patch/comment/Comments'

interface Props {
  id: number
}

export const CommentTab = ({ id }: Props) => {
  return (
    <Card className="border-none shadow-sm min-h-[450px]">
      <CardHeader className="px-5 pt-4 pb-0">
        <h2 className="text-xl font-semibold">游戏评论</h2>
      </CardHeader>
      <CardBody className="p-4">
        <Comments id={Number(id)} />
      </CardBody>
    </Card>
  )
}
