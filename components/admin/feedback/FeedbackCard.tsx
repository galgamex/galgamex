import { Chip, Card, CardBody, Button } from '@nextui-org/react'
import { KunAvatar } from '~/components/kun/floating-card/KunAvatar'
import { formatDate } from '~/utils/time'
import Link from 'next/link'
import { FeedbackHandler } from './FeedbackHandler'
import type { AdminFeedback } from '~/types/api/admin'

interface Props {
  feedback: AdminFeedback
}

export const FeedbackCard = ({ feedback }: Props) => {
  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <KunAvatar
              uid={feedback.sender!.id}
              avatarProps={{
                name: feedback.sender!.name,
                src: feedback.sender!.avatar
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">{feedback.sender?.name}</h2>
                <span className="text-small text-default-500">
                  {formatDate(feedback.created, {
                    isPrecise: true,
                    isShowYear: true
                  })}
                </span>
              </div>
              <p className="mt-1 whitespace-pre-wrap">{feedback.content}</p>

              <div className="flex items-center gap-4 mt-2">
                <Chip
                  color={feedback.status ? 'success' : 'danger'}
                  variant="flat"
                >
                  {feedback.status ? '已处理' : '未处理'}
                </Chip>
                <Button
                  as={Link}
                  size="sm"
                  color="primary"
                  variant="flat"
                  href={`/${feedback.patchUniqueId}`}
                >
                  前往游戏
                </Button>
                <Button
                  as={Link}
                  size="sm"
                  color="primary"
                  variant="flat"
                  href={`/user/${feedback.sender?.id}/resource`}
                >
                  前往用户
                </Button>
              </div>
            </div>
          </div>

          <FeedbackHandler initialFeedback={feedback} />
        </div>
      </CardBody>
    </Card>
  )
}
